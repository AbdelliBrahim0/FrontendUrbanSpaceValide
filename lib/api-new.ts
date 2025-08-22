// Base response interfaces
interface BaseResponse {
  success: boolean;
  message?: string;
  error?: string;
}

interface ListResponse<T> extends BaseResponse {
  items: T[];
  total?: number;
}

interface ItemResponse<T> extends BaseResponse {
  item: T;
}

interface CategoryProductsResponse extends BaseResponse {
  category: Category;
  items: Product[];
}

interface SubcategoryProductsResponse extends BaseResponse {
  subCategory: Subcategory;
  items: Product[];
}

type ApiResponse<T> = 
  | ListResponse<T>
  | ItemResponse<T>
  | CategoryProductsResponse
  | SubcategoryProductsResponse;

// Type guards
function isListResponse<T>(response: ApiResponse<T>): response is ListResponse<T> {
  return 'items' in response && Array.isArray(response.items);
}

function isItemResponse<T>(response: ApiResponse<T>): response is ItemResponse<T> {
  return 'item' in response && response.item !== undefined;
}

function isCategoryProductsResponse(response: any): response is CategoryProductsResponse {
  return 'category' in response && 'items' in response;
}

function isSubcategoryProductsResponse(response: any): response is SubcategoryProductsResponse {
  return 'subCategory' in response && 'items' in response;
}

// Helper functions
function getItems<T>(response: ApiResponse<T>): T[] {
  if (isListResponse(response)) return response.items;
  if (isCategoryProductsResponse(response) || isSubcategoryProductsResponse(response)) {
    return response.items as unknown as T[];
  }
  return [];
}

function getItem<T>(response: ApiResponse<T>): T | null {
  if (isItemResponse(response)) return response.item;
  if (isCategoryProductsResponse(response)) return response.category as unknown as T;
  if (isSubcategoryProductsResponse(response)) return response.subCategory as unknown as T;
  return null;
}

// Fetch functions
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api';
const PUBLIC_API = `${API_BASE}/public`;

async function fetchApi<T>(
  endpoint: string, 
  options: RequestInit = {},
  isPublic = true
): Promise<ApiResponse<T>> {
  try {
    const baseUrl = isPublic ? PUBLIC_API : API_BASE;
    const url = `${baseUrl}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      credentials: 'include',
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      return {
        success: false,
        message: data.message || `HTTP error ${response.status}`,
        error: data.error || 'Unknown error',
      };
    }

    return { success: true, ...data };
  } catch (error) {
    console.error(`API Error [${endpoint}]:`, error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error',
      error: 'Network error',
    };
  }
}

// Public API
const publicApi = {
  categories: {
    list: async (): Promise<Category[]> => {
      const response = await fetchApi<Category>('/categories');
      return getItems(response);
    },
    get: async (id: number): Promise<Category | null> => {
      const response = await fetchApi<Category>(`/categories/${id}`);
      return getItem(response);
    },
    getWithProducts: async (id: number): Promise<{ category: Category | null; products: Product[] }> => {
      const response = await fetchApi<Category>(`/categories/${id}/products`, {}, true);
      if (isCategoryProductsResponse(response)) {
        return {
          category: response.category,
          products: response.items
        };
      }
      return { category: null, products: [] };
    }
  },
  
  subcategories: {
    list: async (categoryId?: number): Promise<Subcategory[]> => {
      const url = categoryId ? `/subcategories?category=${categoryId}` : '/subcategories';
      const response = await fetchApi<Subcategory>(url);
      return getItems(response);
    },
    get: async (id: number): Promise<Subcategory | null> => {
      const response = await fetchApi<Subcategory>(`/subcategories/${id}`);
      return getItem(response);
    },
    getWithProducts: async (id: number): Promise<{ subcategory: Subcategory | null; products: Product[] }> => {
      const response = await fetchApi<Subcategory>(`/subcategories/${id}/products`, {}, true);
      if (isSubcategoryProductsResponse(response)) {
        return {
          subcategory: response.subCategory,
          products: response.items
        };
      }
      return { subcategory: null, products: [] };
    }
  },
  
  products: {
    list: async (filters?: { categoryId?: number; subcategoryId?: number }): Promise<Product[]> => {
      const params = new URLSearchParams();
      if (filters?.categoryId) params.append('category', filters.categoryId.toString());
      if (filters?.subcategoryId) params.append('subcategory', filters.subcategoryId.toString());
      
      const query = params.toString() ? `?${params.toString()}` : '';
      const response = await fetchApi<Product>(`/products${query}`);
      return getItems(response);
    },
    
    get: async (id: number): Promise<Product | null> => {
      const response = await fetchApi<Product>(`/products/${id}`);
      return getItem(response);
    },
    
    search: async (query: string): Promise<Product[]> => {
      const response = await fetchApi<Product>(`/products/search?q=${encodeURIComponent(query)}`);
      return getItems(response);
    },
    
    create: async (product: ProductCreateDto, token: string): Promise<Product | null> => {
      const response = await fetchApi<Product>('/products', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(product)
      }, false);
      return getItem(response);
    },
    
    update: async (id: number, product: Partial<ProductCreateDto>, token: string): Promise<Product | null> => {
      const response = await fetchApi<Product>(`/products/${id}`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(product)
      }, false);
      return getItem(response);
    },
    
    delete: async (id: number, token: string): Promise<boolean> => {
      const response = await fetchApi<void>(`/products/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      }, false);
      return response.success;
    }
  }
};

// Export the public API as default
export default publicApi;

// Export aliases for backward compatibility
export const categoriesApi = publicApi.categories;
export const subcategoriesApi = publicApi.subcategories;
export const productsApi = publicApi.products;

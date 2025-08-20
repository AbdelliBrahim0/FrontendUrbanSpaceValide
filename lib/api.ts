// Types de base pour les réponses API
interface BaseApiResponse {
  success: boolean;
  message?: string;
  errors?: Record<string, string[]>;
  code?: number;
}

interface ApiResponseList<T> extends BaseApiResponse {
  items: T[];
  total?: number;
}

interface ApiResponseItem<T> extends BaseApiResponse {
  item: T;
}

type ApiResponse<T> = ApiResponseList<T> | ApiResponseItem<T> | T[] | T;

const API_BASE_URL = 'http://127.0.0.1:8000/api';

export async function fetchWithAuth<T = any>(
  endpoint: string, 
  options: RequestInit = {}
): Promise<T> {
  try {
    const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null;
    
    if (!token) {
      if (typeof window !== 'undefined') {
        window.location.href = '/admin/login';
      }
      throw new Error('Non authentifié');
    }

    const headers = new Headers(options.headers || {});
    headers.set('Authorization', `Bearer ${token}`);
    headers.set('Content-Type', 'application/json');

    console.log(`API Request: ${options.method || 'GET'} ${API_BASE_URL}${endpoint}`);
    console.log('Request headers:', Object.fromEntries(headers.entries()));
    if (options.body) {
      console.log('Request body:', options.body);
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
      credentials: 'include',
    });

    // Handle unauthorized or forbidden
    if (response.status === 401 || response.status === 403) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('admin_token');
        window.location.href = '/admin/login';
      }
      throw new Error('Session expirée ou non autorisée');
    }

    // Some endpoints may return 204 No Content (e.g., DELETE)
    if (response.status === 204) {
      // @ts-expect-error generic success payload for 204
      return { success: true } as T;
    }

    const data = await response.json().catch(() => ({}));
    
    if (!response.ok) {
      console.error(`API Error ${response.status}:`, data);
      console.error('Response headers:', Object.fromEntries(response.headers.entries()));
      console.error('Response status text:', response.statusText);
      console.error('Full response data:', JSON.stringify(data, null, 2));
      return {
        success: false,
        message: data.error || data.message || `Erreur ${response.status}: ${response.statusText}`,
        code: response.status,
        errors: data.errors || data.validation_errors || data.detail
      } as T;
    }
    
    return data as T;
  } catch (error) {
    console.error('API call failed:', error);
    return {
      success: false,
      message: 'Erreur de connexion au serveur',
      code: 0
    } as T;
  }
}

// Types communs
export interface Timestamps {
  createdAt: string;
  updatedAt?: string;
}

// Types pour les catégories
export interface Category extends Timestamps {
  id: number;
  name: string;
  subCategories: Array<{ id: number; name: string }>;
  products?: Array<{ id: number; name: string }>; // align with backend
  createdAt: string;
}

// Types pour les sous-catégories
export interface Subcategory extends Timestamps {
  id: number;
  name: string;
  categories: Array<{ id: number; name: string }>;
  products: Array<{ 
    id: number; 
    name: string;
    description?: string;
    price: string;
    size?: string;
    stock: number;
    urlImage?: string;
    urlImageHover?: string;
  }>;
}

export interface SubcategoryCreateDto {
  name: string;
  categories: number[];
  products?: number[];
}

export interface SubcategoryUpdateDto {
  name: string;
  categories: number[];
  products?: number[];
}

// Types pour les catégories
// Types pour les produits
export interface Product {
  id: number;
  name: string;
  description?: string;
  price: string;
  size?: string;
  stock: number;
  urlImage?: string;
  urlImageHover?: string;
  categories?: Array<{ id: number; name: string }>; // align with backend
  subCategories: Array<{ 
    id: number; 
    name: string;
    category?: { id: number; name: string };
  }>;
  createdAt: string;
}

export interface ProductCreateDto {
  name: string;
  description?: string;
  price: string | number;  // Peut être une chaîne ou un nombre
  size?: string;
  stock: string;  // Maintenant une chaîne de caractères
  urlImage?: string;
  urlImageHover?: string;
  subCategories: number[];
  categories?: number[];
}

export interface ProductUpdateDto {
  name?: string;
  description?: string;
  price?: number;
  size?: string;
  stock?: number;
  urlImage?: string;
  urlImageHover?: string;
  subCategories?: number[];
  categories?: number[];
}

// Helper function to handle API responses
const handleApiResponse = async <T>(response: Response): Promise<T> => {
  const responseData = await response.json();
  
  if (!response.ok) {
    const error = new Error(responseData.message || 'Une erreur est survenue');
    (error as any).response = responseData;
    throw error;
  }
  
  return responseData;
};

// Subcategories API
export const subcategoriesApi = {
  list: async (): Promise<Subcategory[]> => {
    const response = await fetchWithAuth<{ success: boolean; items: Subcategory[] }>('/admin/subcategories');
    return response && (response as any).success ? (response as any).items : [];
  },

  get: async (id: number): Promise<Subcategory> => {
    const response = await fetchWithAuth<{ success: boolean; item: Subcategory }>(`/admin/subcategories/${id}`);
    if (!response.success) throw new Error('Failed to fetch subcategory');
    return response.item;
  },

  create: async (data: SubcategoryCreateDto): Promise<Subcategory> => {
    const response = await fetchWithAuth<{ success: boolean; item: Subcategory }>('/admin/subcategories', {
      method: 'POST',
      body: JSON.stringify(data)
    });
    if (!response.success) throw new Error('Failed to create subcategory');
    return response.item;
  },

  update: async (id: number, data: SubcategoryUpdateDto): Promise<Subcategory> => {
    const response = await fetchWithAuth<{ success: boolean; item: Subcategory }>(`/admin/subcategories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
    if (!response.success) throw new Error('Failed to update subcategory');
    return response.item;
  },

  delete: async (id: number): Promise<{ success: boolean; message: string }> => {
    const response = await fetchWithAuth<{ success: boolean; message?: string }>(`/admin/subcategories/${id}`, {
      method: 'DELETE'
    });
    return { success: !!response.success, message: response.message || 'Sous-catégorie supprimée avec succès' };
  }
};

// Products API
export const productsApi = {
  async list(filters?: { categoryId?: number; subcategoryId?: number }): Promise<Product[]> {
    let url = '/admin/products';
    const params = new URLSearchParams();
    
    if (filters) {
      if (filters.categoryId) params.append('category', filters.categoryId.toString());
      if (filters.subcategoryId) params.append('subcategory', filters.subcategoryId.toString());
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
    }
    
    const response = await fetchWithAuth<{ success: boolean; items: Product[] }>(url);
    return response.success ? response.items : [];
  },

  async get(id: number): Promise<Product> {
    const response = await fetchWithAuth<{ success: boolean; item: Product }>(`/admin/products/${id}`);
    if (!response.success) throw new Error('Failed to fetch product');
    return response.item;
  },

  async getBySubcategory(subcategoryId: number): Promise<{ subCategory: Subcategory; items: Product[] }> {
    const response = await fetchWithAuth<{ 
      success: boolean;
      subCategory: Subcategory;
      items: Product[];
    }>(`/admin/products/subcategory/${subcategoryId}`);
    
    if (!response.success) throw new Error('Failed to fetch subcategory products');
    return {
      subCategory: response.subCategory,
      items: response.items
    };
  },

  async create(data: ProductCreateDto): Promise<Product> {
    // Le stock est maintenant traité comme une chaîne de caractères
    console.log('Stock value:', data.stock, 'Type:', typeof data.stock);
    
    const productData = {
      ...data,
      stock: String(data.stock) // S'assure que c'est une chaîne
    };
    
    console.log('API: Sending request to /admin/products with data:', productData);
    console.log('Stock in productData:', productData.stock, 'Type:', typeof productData.stock);
    
    const response = await fetchWithAuth<{ success: boolean; item: Product }>('/admin/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(productData),
    });
    
    // Debug: log the response to understand the format
    console.log('Product create response:', response);
    console.log('Response type:', typeof response);
    console.log('Response keys:', response ? Object.keys(response) : 'null/undefined');
    
    if (!response || !response.success) {
      const errorMessage = (response as any)?.message || 
                          (response as any)?.errors?.join(', ') || 
                          'Failed to create product';
      console.error('Product creation failed:', errorMessage);
      throw new Error(errorMessage);
    }
    
    // Handle both { success: true, item: Product } and direct Product response
    const result = (response as any).item || response;
    console.log('Product creation successful, returning:', result);
    return result;
  },

  async update(id: number, data: ProductUpdateDto): Promise<Product> {
    const response = await fetchWithAuth<{ success: boolean; item: Product }>(`/admin/products/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response || !response.success) {
      const errorMessage = (response as any)?.message || 
                          (response as any)?.errors?.join(', ') || 
                          'Failed to update product';
      throw new Error(errorMessage);
    }
    
    return (response as any).item || response;
  },

  async patch(id: number, data: Partial<ProductUpdateDto>): Promise<Product> {
    const response = await fetchWithAuth<{ success: boolean; item: Product }>(`/admin/products/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response || !response.success) {
      const errorMessage = (response as any)?.message || 
                          (response as any)?.errors?.join(', ') || 
                          'Failed to update product';
      throw new Error(errorMessage);
    }
    
    return (response as any).item || response;
  },

  async delete(id: number): Promise<{ success: boolean; message: string }> {
    const response = await fetchWithAuth<{ success: boolean; message?: string }>(
      `/admin/products/${id}`,
      { 
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    
    if (!response || !response.success) {
      throw new Error((response as any)?.message || 'Failed to delete product');
    }
    
    return { success: true, message: response.message || 'Produit supprimé avec succès' };
  },
};

// Categories API
export const categoriesApi = {
  async list(): Promise<Category[]> {
    const response = await fetchWithAuth<{ success: boolean; items: Category[] }>('/admin/categories');
    return response && response.success ? response.items : [];
  },

  async get(id: number): Promise<Category> {
    const response = await fetchWithAuth<{ success: boolean; item: Category }>(`/admin/categories/${id}`);
    if (!response.success) throw new Error('Failed to fetch category');
    return response.item;
  },

  async create(data: { name: string; subCategories?: number[]; products?: number[] }): Promise<Category> {
    const response = await fetchWithAuth<{ success: boolean; item: Category }>('/admin/categories', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    if (!response.success) throw new Error('Failed to create category');
    return response.item;
  },

  async update(id: number, data: { name?: string; subCategories?: number[]; products?: number[] }): Promise<Category> {
    const response = await fetchWithAuth<{ success: boolean; item: Category }>(`/admin/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    if (!response.success) throw new Error('Failed to update category');
    return response.item;
  },

  async delete(id: number): Promise<{ success: boolean; message: string }> {
    const response = await fetchWithAuth<{ success: boolean; message?: string }>(
      `/admin/categories/${id}`,
      { method: 'DELETE' }
    );
    return { success: !!response.success, message: response.message || 'Catégorie supprimée avec succès.' };
  },

  async getProducts(categoryId: number): Promise<{ category: Category; items: Product[] }> {
    const response = await fetchWithAuth<{ 
      success: boolean; 
      category: Category; 
      items: Product[] 
    }>(`/admin/products/category/${categoryId}`);
    
    if (!response.success) throw new Error('Failed to fetch category products');
    return {
      category: response.category,
      items: response.items
    };
  },
};

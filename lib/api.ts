// Base response interface
interface BaseApiResponse {
  success: boolean;
  message?: string;
  error?: string;
  errors?: string[];
  code?: number;
}

// Response type for list endpoints
interface ListResponse<T> extends BaseApiResponse {
  items: T[];
  total?: number;
}

// Response type for single item endpoints
interface ItemResponse<T> extends BaseApiResponse {
  item: T;
}

// Response type for category products
interface CategoryProductsResponse extends BaseApiResponse {
  category: Category;
  items: Product[];
}

// Response type for subcategory products
interface SubcategoryProductsResponse extends BaseApiResponse {
  subCategory: Subcategory;
  items: Product[];
}

// Union type of all possible API responses
type ApiResponse<T> =
  | ListResponse<T>
  | ItemResponse<T>
  | CategoryProductsResponse
  | SubcategoryProductsResponse;

// Type guards for API responses
function isListResponse<T>(response: ApiResponse<T>): response is ListResponse<T> {
  return 'items' in response && Array.isArray(response.items);
}

function isItemResponse<T>(response: ApiResponse<T>): response is ItemResponse<T> {
  return 'item' in response && response.item !== undefined;
}

function isCategoryProductsResponse(response: ApiResponse<Product>): response is CategoryProductsResponse {
  return 'category' in response && 'items' in response && Array.isArray(response.items);
}

function isSubcategoryProductsResponse(response: ApiResponse<Product>): response is SubcategoryProductsResponse {
  return 'subCategory' in response && 'items' in response && Array.isArray(response.items);
}

// Helper functions to safely extract data from responses
function getItemsFromResponse<T>(response: ApiResponse<T>): T[] {
  if (isListResponse(response)) {
    return response.items || [];
  }
  if (isCategoryProductsResponse(response) || isSubcategoryProductsResponse(response)) {
    return response.items || [];
  }
  return [];
}

function getItemFromResponse<T>(response: ApiResponse<T>): T | null {
  if (isItemResponse(response)) {
    return response.item;
  }
  if (isCategoryProductsResponse(response)) {
    return response.category as unknown as T;
  }
  if (isSubcategoryProductsResponse(response)) {
    return response.subCategory as unknown as T;
  }
  return null;
}

// Use environment variable for API base URL, fallback to localhost for development
const API_BASE_URL = (process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api').replace(/\/$/, '');
const PUBLIC_API_BASE = `${API_BASE_URL}`;

// Public fetch function for unauthenticated API calls
export async function fetchPublic<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    // Remove leading slash from endpoint
    const normalizedEndpoint = endpoint.startsWith('/') ? endpoint.substring(1) : endpoint;

    // If the URL already has http(s)://, use it as is, otherwise prepend the base URL
    const url = normalizedEndpoint.startsWith('http')
      ? normalizedEndpoint
      : `${PUBLIC_API_BASE}/${normalizedEndpoint}`;

    if (process.env.NODE_ENV !== 'production') {
      console.log(`[API] Fetching ${url}`, { options });
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const errorMessage = data.message || {
        404: 'Ressource non trouvée',
        400: 'Requête invalide',
        500: 'Erreur serveur',
      }[response.status] || `Erreur HTTP ${response.status}`;

      if (process.env.NODE_ENV !== 'production') {
        console.error(`[API] Error ${response.status} for ${url}:`, data);
      }

      return {
        success: false,
        message: errorMessage,
        error: data.error || 'Erreur inconnue',
        code: response.status,
        errors: data.errors || [],
      };
    }

    return data as ApiResponse<T>;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Erreur de connexion au serveur';
    if (process.env.NODE_ENV !== 'production') {
      console.error('Public API call failed:', error);
    }
    return {
      success: false,
      message: errorMessage,
      code: 0,
      errors: [],
    };
  }
}

// Authenticated fetch function for admin API calls
export async function fetchWithAuth<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
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

    if (process.env.NODE_ENV !== 'production') {
      console.log(`API Request: ${options.method || 'GET'} ${API_BASE_URL}${endpoint}`);
      console.log('Request headers:', Object.fromEntries(headers.entries()));
      if (options.body) {
        console.log('Request body:', options.body);
      }
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (response.status === 401 || response.status === 403) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('admin_token');
        window.location.href = '/admin/login';
      }
      throw new Error('Session expirée ou non autorisée');
    }

    if (response.status === 204) {
      return { success: true } as ApiResponse<T>;
    }

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const errorMessage = data.message || {
        404: 'Ressource non trouvée',
        400: 'Requête invalide',
        403: 'Accès interdit',
        500: 'Erreur serveur',
      }[response.status] || `Erreur ${response.status}`;

      if (process.env.NODE_ENV !== 'production') {
        console.error(`API Error ${response.status}:`, data);
      }

      return {
        success: false,
        message: errorMessage,
        code: response.status,
        errors: data.errors || [],
      };
    }

    return data as ApiResponse<T>;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Erreur de connexion au serveur';
    if (process.env.NODE_ENV !== 'production') {
      console.error('API call failed:', error);
    }
    return {
      success: false,
      message: errorMessage,
      code: 0,
      errors: [],
    };
  }
}

// Types communs
export interface Timestamps {
  createdAt: string;
  updatedAt?: string;
}

export interface Category extends Timestamps {
  id: number;
  name: string;
  subCategories: Array<{ id: number; name: string }>;
  products?: Array<{ id: number; name: string }>;
}

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
  name?: string;
  categories?: number[];
  products?: number[];
}

export interface Product extends Timestamps {
  id: number;
  name: string;
  description?: string;
  price: string;
  size?: string;
  stock: number;
  urlImage?: string;
  urlImageHover?: string;
  categories: Array<{ id: number; name: string }>;
  subCategories: Array<{
    id: number;
    name: string;
    category?: { id: number; name: string };
  }>;
}

export interface ProductCreateDto {
  name: string;
  description?: string;
  price: string | number;
  size?: string;
  stock: number;
  urlImage?: string;
  urlImageHover?: string;
  subCategories: number[];
  categories?: number[];
}

export interface ProductUpdateDto {
  name?: string;
  description?: string;
  price?: string | number;
  size?: string;
  stock?: number;
  urlImage?: string;
  urlImageHover?: string;
  subCategories?: number[];
  categories?: number[];
}

// Public Categories API
export const publicCategoriesApi = {
  async list(): Promise<Category[]> {
    try {
      const response = await fetchPublic<Category>('/public/categories');
      if (!response.success) {
        throw new Error(response.message || 'Échec de la récupération des catégories');
      }
      return getItemsFromResponse(response);
    } catch (error) {
      console.error('Erreur lors de la récupération des catégories:', error);
      throw error;
    }
  },

  async get(id: number): Promise<Category> {
    if (!Number.isInteger(id) || id <= 0) {
      throw new Error('ID de catégorie invalide');
    }
    try {
      const response = await fetchPublic<Category>(`/public/categories/${id}`);
      if (!response.success) {
        throw new Error(response.message || 'Échec de la récupération de la catégorie');
      }
      const item = getItemFromResponse(response);
      if (!item) {
        throw new Error('Catégorie non trouvée');
      }
      return item;
    } catch (error) {
      console.error(`Erreur lors de la récupération de la catégorie ${id}:`, error);
      throw error;
    }
  },
};

// Public Subcategories API
export const publicSubcategoriesApi = {
  async list(): Promise<Subcategory[]> {
    try {
      const response = await fetchPublic<Subcategory>('/public/subcategories');
      if (!response.success) {
        throw new Error(response.message || 'Échec de la récupération des sous-catégories');
      }
      return getItemsFromResponse(response);
    } catch (error) {
      console.error('Erreur lors de la récupération des sous-catégories:', error);
      throw error;
    }
  },

  async get(id: number): Promise<Subcategory> {
    if (!Number.isInteger(id) || id <= 0) {
      throw new Error('ID de sous-catégorie invalide');
    }
    try {
      const response = await fetchPublic<Subcategory>(`/public/subcategories/${id}`);
      if (!response.success) {
        throw new Error(response.message || 'Échec de la récupération de la sous-catégorie');
      }
      const item = getItemFromResponse(response);
      if (!item) {
        throw new Error('Sous-catégorie non trouvée');
      }
      return item;
    } catch (error) {
      console.error(`Erreur lors de la récupération de la sous-catégorie ${id}:`, error);
      throw error;
    }
  },
};

// Products API (public and admin)
export const productsApi = {
  async list(filters?: { categoryId?: number; subcategoryId?: number; page?: number; limit?: number }): Promise<Product[]> {
    try {
      let url = '/products'; // Corrigé pour utiliser /products
      const params = new URLSearchParams();
      if (filters) {
        if (filters.categoryId && Number.isInteger(filters.categoryId) && filters.categoryId > 0) {
          params.append('category', filters.categoryId.toString());
        }
        if (filters.subcategoryId && Number.isInteger(filters.subcategoryId) && filters.subcategoryId > 0) {
          params.append('subcategory', filters.subcategoryId.toString());
        }
        if (filters.page && Number.isInteger(filters.page) && filters.page > 0) {
          params.append('page', filters.page.toString());
        }
        if (filters.limit && Number.isInteger(filters.limit) && filters.limit > 0) {
          params.append('limit', filters.limit.toString());
        }
        if (params.toString()) {
          url += `?${params.toString()}`;
        }
      }
      const response = await fetchPublic<Product>(url);
      if (!response.success) {
        throw new Error(response.message || 'Échec de la récupération des produits');
      }
      return getItemsFromResponse(response);
    } catch (error) {
      console.error('Erreur lors de la récupération des produits:', error);
      throw error;
    }
  },

  async get(id: number): Promise<Product> {
    if (!Number.isInteger(id) || id <= 0) {
      throw new Error('ID de produit invalide');
    }
    try {
      const response = await fetchPublic<Product>(`/products/${id}`);
      if (!response.success) {
        throw new Error(response.message || 'Échec de la récupération du produit');
      }
      const item = getItemFromResponse(response);
      if (!item) {
        throw new Error('Produit non trouvé');
      }
      return item;
    } catch (error) {
      console.error(`Erreur lors de la récupération du produit ${id}:`, error);
      throw error;
    }
  },

  async getByCategory(categoryId: number): Promise<{ category: Category; items: Product[] }> {
    if (!Number.isInteger(categoryId) || categoryId <= 0) {
      throw new Error('ID de catégorie invalide');
    }
    try {
      const response = await fetchPublic<CategoryProductsResponse>(`/products/category/${categoryId}`);
      if (!response.success) {
        throw new Error(response.message || 'Échec de la récupération des produits par catégorie');
      }
      return {
        category: response.category,
        items: response.items || [],
      };
    } catch (error) {
      console.error(`Erreur lors de la récupération des produits pour la catégorie ${categoryId}:`, error);
      throw error;
    }
  },

  async getBySubcategory(subcategoryId: number): Promise<{ subCategory: Subcategory; items: Product[] }> {
    if (!Number.isInteger(subcategoryId) || subcategoryId <= 0) {
      throw new Error('ID de sous-catégorie invalide');
    }
    try {
      const response = await fetchPublic<SubcategoryProductsResponse>(`/products/subcategory/${subcategoryId}`);
      if (!response.success) {
        throw new Error(response.message || 'Échec de la récupération des produits par sous-catégorie');
      }
      return {
        subCategory: response.subCategory,
        items: response.items || [],
      };
    } catch (error) {
      console.error(`Erreur lors de la récupération des produits pour la sous-catégorie ${subcategoryId}:`, error);
      throw error;
    }
  },

  async create(data: ProductCreateDto): Promise<Product> {
    try {
      const productData = {
        ...data,
        stock: Number(data.stock),
        price: String(data.price),
      };
      const response = await fetchWithAuth<ItemResponse<Product>>('/admin/products', {
        method: 'POST',
        body: JSON.stringify(productData),
      });
      if (!response.success) {
        throw new Error(response.message || 'Échec de la création du produit');
      }
      return response.item;
    } catch (error) {
      console.error('Erreur lors de la création du produit:', error);
      throw error;
    }
  },

  async update(id: number, data: ProductUpdateDto, method: 'PUT' | 'PATCH' = 'PUT'): Promise<Product> {
    if (!Number.isInteger(id) || id <= 0) {
      throw new Error('ID de produit invalide');
    }
    try {
      const productData = {
        ...data,
        stock: data.stock !== undefined ? Number(data.stock) : undefined,
        price: data.price !== undefined ? String(data.price) : undefined,
      };
      const response = await fetchWithAuth<ItemResponse<Product>>(`/admin/products/${id}`, {
        method,
        body: JSON.stringify(productData),
      });
      if (!response.success) {
        throw new Error(response.message || 'Échec de la mise à jour du produit');
      }
      return response.item;
    } catch (error) {
      console.error(`Erreur lors de la mise à jour du produit ${id}:`, error);
      throw error;
    }
  },

  async delete(id: number): Promise<{ success: boolean; message: string }> {
    if (!Number.isInteger(id) || id <= 0) {
      throw new Error('ID de produit invalide');
    }
    try {
      const response = await fetchWithAuth<BaseApiResponse>(`/admin/products/${id}`, {
        method: 'DELETE',
      });
      return {
        success: response.success,
        message: response.message || 'Produit supprimé avec succès',
      };
    } catch (error) {
      console.error(`Erreur lors de la suppression du produit ${id}:`, error);
      throw error;
    }
  },
};

// Admin Categories API
export const adminCategoriesApi = {
  async list(): Promise<Category[]> {
    try {
      const response = await fetchWithAuth<ListResponse<Category>>('/admin/categories');
      if (!response.success) {
        throw new Error(response.message || 'Échec de la récupération des catégories');
      }
      return response.items;
    } catch (error) {
      console.error('Erreur lors de la récupération des catégories:', error);
      throw error;
    }
  },

  async get(id: number): Promise<Category> {
    if (!Number.isInteger(id) || id <= 0) {
      throw new Error('ID de catégorie invalide');
    }
    try {
      const response = await fetchWithAuth<ItemResponse<Category>>(`/admin/categories/${id}`);
      if (!response.success) {
        throw new Error(response.message || 'Échec de la récupération de la catégorie');
      }
      return response.item;
    } catch (error) {
      console.error(`Erreur lors de la récupération de la catégorie ${id}:`, error);
      throw error;
    }
  },

  async create(data: { name: string; subCategories?: number[]; products?: number[] }): Promise<Category> {
    try {
      const response = await fetchWithAuth<ItemResponse<Category>>('/admin/categories', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      if (!response.success) {
        throw new Error(response.message || 'Échec de la création de la catégorie');
      }
      return response.item;
    } catch (error) {
      console.error('Erreur lors de la création de la catégorie:', error);
      throw error;
    }
  },

  async update(id: number, data: { name?: string; subCategories?: number[]; products?: number[] }): Promise<Category> {
    if (!Number.isInteger(id) || id <= 0) {
      throw new Error('ID de catégorie invalide');
    }
    try {
      const response = await fetchWithAuth<ItemResponse<Category>>(`/admin/categories/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
      if (!response.success) {
        throw new Error(response.message || 'Échec de la mise à jour de la catégorie');
      }
      return response.item;
    } catch (error) {
      console.error(`Erreur lors de la mise à jour de la catégorie ${id}:`, error);
      throw error;
    }
  },

  async delete(id: number): Promise<{ success: boolean; message: string }> {
    if (!Number.isInteger(id) || id <= 0) {
      throw new Error('ID de catégorie invalide');
    }
    try {
      const response = await fetchWithAuth<BaseApiResponse>(`/admin/categories/${id}`, {
        method: 'DELETE',
      });
      return {
        success: response.success,
        message: response.message || 'Catégorie supprimée avec succès',
      };
    } catch (error) {
      console.error(`Erreur lors de la suppression de la catégorie ${id}:`, error);
      throw error;
    }
  },

  async getProducts(categoryId: number): Promise<{ category: Category; items: Product[] }> {
    if (!Number.isInteger(categoryId) || categoryId <= 0) {
      throw new Error('ID de catégorie invalide');
    }
    try {
      const response = await fetchWithAuth<CategoryProductsResponse>(`/products/category/${categoryId}`);
      if (!response.success) {
        throw new Error(response.message || 'Échec de la récupération des produits par catégorie');
      }
      return {
        category: response.category,
        items: response.items,
      };
    } catch (error) {
      console.error(`Erreur lors de la récupération des produits pour la catégorie ${categoryId}:`, error);
      throw error;
    }
  },
};

// Admin Subcategories API
export const adminSubcategoriesApi = {
  async list(): Promise<Subcategory[]> {
    try {
      const response = await fetchWithAuth<ListResponse<Subcategory>>('/admin/subcategories');
      if (!response.success) {
        throw new Error(response.message || 'Échec de la récupération des sous-catégories');
      }
      return response.items;
    } catch (error) {
      console.error('Erreur lors de la récupération des sous-catégories:', error);
      throw error;
    }
  },

  async get(id: number): Promise<Subcategory> {
    if (!Number.isInteger(id) || id <= 0) {
      throw new Error('ID de sous-catégorie invalide');
    }
    try {
      const response = await fetchWithAuth<ItemResponse<Subcategory>>(`/admin/subcategories/${id}`);
      if (!response.success) {
        throw new Error(response.message || 'Échec de la récupération de la sous-catégorie');
      }
      return response.item;
    } catch (error) {
      console.error(`Erreur lors de la récupération de la sous-catégorie ${id}:`, error);
      throw error;
    }
  },

  async create(data: SubcategoryCreateDto): Promise<Subcategory> {
    try {
      const response = await fetchWithAuth<ItemResponse<Subcategory>>('/admin/subcategories', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      if (!response.success) {
        throw new Error(response.message || 'Échec de la création de la sous-catégorie');
      }
      return response.item;
    } catch (error) {
      console.error('Erreur lors de la création de la sous-catégorie:', error);
      throw error;
    }
  },

  async update(id: number, data: SubcategoryUpdateDto): Promise<Subcategory> {
    if (!Number.isInteger(id) || id <= 0) {
      throw new Error('ID de sous-catégorie invalide');
    }
    try {
      const response = await fetchWithAuth<ItemResponse<Subcategory>>(`/admin/subcategories/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
      if (!response.success) {
        throw new Error(response.message || 'Échec de la mise à jour de la sous-catégorie');
      }
      return response.item;
    } catch (error) {
      console.error(`Erreur lors de la mise à jour de la sous-catégorie ${id}:`, error);
      throw error;
    }
  },

  async delete(id: number): Promise<{ success: boolean; message: string }> {
    if (!Number.isInteger(id) || id <= 0) {
      throw new Error('ID de sous-catégorie invalide');
    }
    try {
      const response = await fetchWithAuth<BaseApiResponse>(`/admin/subcategories/${id}`, {
        method: 'DELETE',
      });
      return {
        success: response.success,
        message: response.message || 'Sous-catégorie supprimée avec succès',
      };
    } catch (error) {
      console.error(`Erreur lors de la suppression de la sous-catégorie ${id}:`, error);
      throw error;
    }
  },
};

// Export aliases for backward compatibility
export const categoriesApi = publicCategoriesApi;
export const subcategoriesApi = publicSubcategoriesApi;
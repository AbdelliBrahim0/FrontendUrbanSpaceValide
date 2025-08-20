'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { categoriesApi, subcategoriesApi, productsApi, type Subcategory, type Category, type Product as ApiProduct } from '@/lib/api';
import BackToDashboardButton from "@/components/admin/BackToDashboardButton";

interface FormData {
  name: string;
  categoryIds: string[];
  productIds: string[];
}

interface Product {
  id: string;
  name: string;
}

export default function EditSubcategoryPage() {
  const { id } = useParams();
  const [formData, setFormData] = useState<FormData>({
    name: '',
    categoryIds: [],
    productIds: []
  });
  
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Array<{ id: string; name: string }>>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  
  const { name, categoryIds, productIds } = formData;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Charger toutes les données en parallèle
        const [subcat, cats, prods] = await Promise.all([
          subcategoriesApi.get(Number(id)),
          categoriesApi.list(),
          productsApi.list(),
        ]);

        // Catégories pour la sélection (id en string pour l'état local)
        setCategories(cats.map((c: Category) => ({ id: String(c.id), name: c.name })));

        const subcategory = subcat as Subcategory;
        setFormData({
          name: subcategory.name,
          categoryIds: (subcategory.categories || []).map((c: any) => String(c.id)),
          productIds: (subcategory.products || []).map((p: any) => String(p.id))
        });
        
        setProducts(prods.map((p: ApiProduct) => ({ id: String(p.id), name: p.name })));

      } catch (err) {
        console.error('Error in fetchData:', err);
        setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'select-multiple' && e.target instanceof HTMLSelectElement) {
      const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
      setFormData(prev => ({
        ...prev,
        [name]: selectedOptions
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };
  
  const toggleCategory = (categoryId: string) => {
    setFormData(prev => ({
      ...prev,
      categoryIds: prev.categoryIds.includes(categoryId)
        ? prev.categoryIds.filter(id => id !== categoryId)
        : [...prev.categoryIds, categoryId]
    }));
  };
  
  const toggleProduct = (productId: string) => {
    setFormData(prev => ({
      ...prev,
      productIds: prev.productIds.includes(productId)
        ? prev.productIds.filter(id => id !== productId)
        : [...prev.productIds, productId]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !categoryIds.length) {
      setError('Veuillez remplir tous les champs obligatoires');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      await subcategoriesApi.update(Number(id), {
        name: name.trim(),
        categories: categoryIds.map((cid) => parseInt(cid, 10)),
        products: productIds.map((pid) => parseInt(pid, 10)),
      });

      setSuccess(true);
      setTimeout(() => {
        router.push('/admin/subcategories');
      }, 1500);
    } catch (err) {
      console.error('Error updating subcategory:', err);
      setError('Une erreur est survenue lors de la mise à jour');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#06080d] p-8">
        <div className="max-w-3xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-10 bg-gray-800 rounded w-1/3 mb-8"></div>
            {[...Array(3)].map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 bg-gray-800 rounded w-1/4"></div>
                <div className="h-10 bg-gray-800 rounded"></div>
              </div>
            ))}
            <div className="h-12 bg-gray-800 rounded-lg w-32 mt-8"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error && !loading) {
    return (
      <div className="min-h-screen bg-[#06080d] p-8">
        <div className="max-w-3xl mx-auto text-center">
          <div className="p-6 bg-red-900/30 border border-red-500 text-red-200 rounded-lg mb-6">
            {error}
          </div>
          <Link 
            href="/admin/subcategories"
            className="inline-flex items-center px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Retour à la liste des sous-catégories
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#06080d] text-white p-6">
      <div className="max-w-4xl mx-auto">
        <BackToDashboardButton />
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 text-transparent bg-clip-text">
            Modifier la sous-catégorie
          </h1>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-900/50 border border-red-700 rounded-lg text-red-200">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-900/50 border border-green-700 rounded-lg text-green-200">
            Sous-catégorie mise à jour avec succès ! Redirection en cours...
          </div>
        )}

        <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 p-6">
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
                  Nom de la sous-catégorie <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={name}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white placeholder-gray-400"
                  placeholder="Ex: T-shirts, Chaussures, etc."
                  required
                  disabled={submitting}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Catégories parentes <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 max-h-48 overflow-y-auto p-2 bg-gray-900/50 rounded-lg border border-gray-700">
                  {categories.length > 0 ? (
                    categories.map((category) => (
                      <label key={category.id} className="flex items-center space-x-2 p-2 hover:bg-gray-800/50 rounded cursor-pointer">
                        <input
                          type="checkbox"
                          checked={categoryIds.includes(category.id)}
                          onChange={() => toggleCategory(category.id)}
                          className="rounded border-gray-600 text-cyan-500 focus:ring-cyan-500 bg-gray-800"
                          disabled={submitting}
                        />
                        <span className="text-sm text-gray-300">{category.name}</span>
                      </label>
                    ))
                  ) : (
                    <span className="text-sm text-gray-400 p-2">Aucune catégorie disponible</span>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Produits associés
                </label>
                <div className="max-h-48 overflow-y-auto p-2 bg-gray-900/50 rounded-lg border border-gray-700">
                  {products.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {products.map((product) => (
                        <label key={product.id} className="flex items-center space-x-2 p-2 hover:bg-gray-800/50 rounded cursor-pointer">
                          <input
                            type="checkbox"
                            checked={productIds.includes(product.id)}
                            onChange={() => toggleProduct(product.id)}
                            className="rounded border-gray-600 text-cyan-500 focus:ring-cyan-500 bg-gray-800"
                            disabled={submitting}
                          />
                          <span className="text-sm text-gray-300 truncate">{product.name}</span>
                        </label>
                      ))}
                    </div>
                  ) : (
                    <span className="text-sm text-gray-400 p-2">Aucun produit disponible</span>
                  )}
                </div>
              </div>

              <div className="flex justify-end space-x-4 pt-6">
                <button
                  type="button"
                  onClick={() => router.push('/admin/subcategories')}
                  className="px-6 py-3 rounded-lg font-medium transition-all duration-200 border border-gray-600 text-gray-300 hover:bg-gray-800"
                  disabled={submitting}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={submitting || categories.length === 0}
                  className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-center ${
                    submitting || categories.length === 0
                      ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:opacity-90'
                  }`}
                >
                  {submitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {categories.length === 0 ? 'Aucune catégorie' : 'Enregistrement en cours...'}
                    </>
                  ) : (
                    'Enregistrer les modifications'
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

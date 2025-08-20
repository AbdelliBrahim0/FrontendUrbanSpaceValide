'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { subcategoriesApi, categoriesApi, type Subcategory, type Category } from '@/lib/api';
import BackToDashboardButton from "@/components/admin/BackToDashboardButton";

interface CategoryMap {
  [key: string]: string;
}

export default function SubcategoriesPage() {
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [categories, setCategories] = useState<CategoryMap>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();

  // Charger les données initiales
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Charger les catégories d'abord pour les noms
        const categoriesList = await categoriesApi.list();
        
        // Créer une map des catégories pour un accès rapide
        const categoriesMap = categoriesList.reduce<CategoryMap>((acc: CategoryMap, cat: Category) => {
          acc[cat.id] = cat.name;
          return acc;
        }, {} as CategoryMap);
        
        setCategories(categoriesMap);

        // Charger les sous-catégories
        const subcategoriesList = await subcategoriesApi.list();

        // Mapper les sous-catégories avec les noms des catégories
        const subcategoriesWithCategoryNames = (subcategoriesList as any[]).map((sub: any) => ({
          ...sub,
          categoryName: Array.isArray(sub.categories) && sub.categories.length > 0 ? sub.categories[0].name : 'Inconnue'
        }));

        setSubcategories(subcategoriesWithCategoryNames);
      } catch (err) {
        console.error('Erreur lors du chargement des données:', err);
        setError(err instanceof Error ? err.message : 'Une erreur est survenue lors du chargement des données');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const filteredSubcategories = subcategories.filter(subcategory => {
    const searchLower = searchTerm.toLowerCase();
    const categoryNames = subcategory.categories?.map(cat => cat.name).join(' ') || '';
    const productNames = subcategory.products?.map(p => p.name).join(' ') || '';
    
    return (
      subcategory.name.toLowerCase().includes(searchLower) ||
      categoryNames.toLowerCase().includes(searchLower) ||
      productNames.toLowerCase().includes(searchLower)
    );
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-[#06080d] p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-10 bg-gray-800 rounded w-1/3 mb-8"></div>
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-800 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[100svh] bg-[#06080d] text-white">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <BackToDashboardButton />
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Sous-catégories</h1>
            <p className="text-sm text-white/60">Liste depuis la base de données</p>
          </div>
          <Link 
            href="/admin/subcategories/add"
            className="px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-medium rounded-lg hover:opacity-90 transition-all duration-200 flex items-center gap-2"
          >
            <span>+</span> Ajouter une sous-catégorie
          </Link>
        </div>

        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Rechercher une sous-catégorie..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white placeholder-gray-400"
            />
            <div className="absolute right-3 top-2.5 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-900/30 border border-red-500 text-red-200 rounded-lg">
            {error}
          </div>
        )}

        <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-800/80">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Nom</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Catégories</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Produits</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Date de création</th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {filteredSubcategories.length > 0 ? (
                  filteredSubcategories.map((subcategory) => (
                    <tr key={subcategory.id} className="hover:bg-gray-800/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {subcategory.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-white">{subcategory.name}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {subcategory.categories?.length ? (
                            subcategory.categories.map(category => (
                              <span 
                                key={category.id} 
                                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/20 text-blue-300 mb-1"
                              >
                                {category.name}
                              </span>
                            ))
                          ) : (
                            <span className="text-gray-400 text-xs">Aucune catégorie</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {subcategory.products?.length ? (
                            subcategory.products.map(product => (
                              <span 
                                key={product.id} 
                                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-500/20 text-purple-300 mb-1"
                                title={product.description || product.name}
                              >
                                {product.name}
                              </span>
                            ))
                          ) : (
                            <span className="text-gray-400 text-xs">Aucun produit</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                        {new Date(subcategory.createdAt).toLocaleDateString('fr-FR', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-3">
                          <Link 
                            href={`/admin/subcategories/edit/${subcategory.id}`}
                            className="text-cyan-400 hover:text-cyan-300 transition-colors"
                            title="Modifier"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </Link>
                          <button
                            onClick={() => handleDelete(subcategory.id)}
                            className="text-red-400 hover:text-red-300 transition-colors"
                            title="Supprimer"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-400">
                      Aucune sous-catégorie trouvée
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );

  async function handleDelete(id: number) {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette sous-catégorie ?')) {
      return;
    }

    try {
      const response = await subcategoriesApi.delete(id);
      
      if (response.success) {
        setSubcategories(subcategories.filter(sub => sub.id !== id));
      } else {
        setError(response.message || 'Erreur lors de la suppression');
      }
    } catch (err) {
      console.error('Error deleting subcategory:', err);
      setError('Une erreur est survenue lors de la suppression');
    }
  }
}

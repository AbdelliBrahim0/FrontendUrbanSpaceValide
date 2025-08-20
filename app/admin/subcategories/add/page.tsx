'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { subcategoriesApi, categoriesApi } from '@/lib/api';
import BackToDashboardButton from "@/components/admin/BackToDashboardButton";
import Link from 'next/link';

type Category = {
  id: number | string;
  name: string;
  // Ajoutez d'autres propriétés si nécessaire
};

export default function AddSubcategoryPage() {
  const [formData, setFormData] = useState({
    name: '',
    categories: [] as string[]
  });
  const [categoriesData, setCategoriesData] = useState<Array<{ id: number; name: string }>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  
  const { name, categories } = formData;

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // La méthode list() gère déjà les erreurs et lance une exception en cas d'échec
        const items = await categoriesApi.list();
        console.log('Réponse de l\'API catégories:', items); // Log de débogage
        
        if (items && items.length > 0) {
          // Vérifier si items est déjà un tableau d'objets avec id et name
          const formattedItems = items.map((item: any) => ({
            id: item.id || item.categoryId || 0, // Prendre en compte différentes structures possibles
            name: item.name || item.nom || 'Sans nom' // Prendre en compte différents noms de champs
          }));
          
          setCategoriesData(formattedItems);
          setFormData(prev => ({
            ...prev,
            categories: formattedItems.length > 0 ? [formattedItems[0].id] : []
          }));
        } else {
          setError('Aucune catégorie disponible');
        }
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError('Erreur lors du chargement des catégories');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || formData.categories.length === 0) {
      setError('Veuillez remplir tous les champs obligatoires');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Convertir les IDs de chaînes en nombres pour l'API
      const categories = formData.categories.map(id => parseInt(id, 10));
      
      const response = await subcategoriesApi.create({
        name: formData.name.trim(),
        categories
      });

      setSuccess(true);
      // Rediriger vers la liste après 1,5 seconde
      setTimeout(() => {
        router.push('/admin/subcategories');
      }, 1500);
    } catch (err) {
      console.error('Error creating subcategory:', err);
      setError('Une erreur est survenue lors de la création');
    } finally {
      setIsSubmitting(false);
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

  return (
    <div className="min-h-screen bg-[#06080d] text-white p-6">
      <div className="max-w-4xl mx-auto">
        <BackToDashboardButton />
        <div className="mb-8">
          <Link 
            href="/admin/subcategories" 
            className="inline-flex items-center text-cyan-400 hover:text-cyan-300 transition-colors mb-6"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Retour à la liste
          </Link>
          <h1 className="text-2xl font-bold mt-4 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
            Ajouter une sous-catégorie
          </h1>
          <p className="mt-2 text-gray-400">Remplissez le formulaire pour créer une nouvelle sous-catégorie</p>
        </div>

        {success && (
          <div className="mb-6 p-4 bg-green-900/30 border border-green-500 text-green-200 rounded-lg">
            Sous-catégorie créée avec succès ! Redirection en cours...
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-900/30 border border-red-500 text-red-200 rounded-lg">
            {error}
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
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label htmlFor="categories" className="block text-sm font-medium text-gray-300 mb-1">
                  Catégories parentes <span className="text-red-500">*</span>
                </label>
                <select
                  id="categories"
                  name="categories"
                  multiple
                  value={categories}
                  onChange={(e) => {
                    const options = e.target.options;
                    const selected: string[] = [];
                    for (let i = 0; i < options.length; i++) {
                      if (options[i].selected) {
                        selected.push(options[i].value);
                      }
                    }
                    setFormData(prev => ({
                      ...prev,
                      categories: selected
                    }));
                  }}
                  className="w-full px-4 py-2.5 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white"
                  required
                  disabled={isSubmitting || categoriesData.length === 0}
                  size={Math.min(4, categoriesData.length + 1)}
                >
                  {categoriesData.length > 0 ? (
                    categoriesData.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))
                  ) : (
                    <option value="" disabled>Aucune catégorie disponible</option>
                  )}
                </select>
                <p className="mt-1 text-xs text-gray-400">
                  Maintenez la touche Ctrl (ou Cmd sur Mac) pour sélectionner plusieurs catégories
                </p>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-center ${
                    isSubmitting || categories.length === 0
                      ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:opacity-90'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {categories.length === 0 ? 'Aucune catégorie' : 'Création en cours...'}
                    </>
                  ) : (
                    'Créer la sous-catégorie'
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

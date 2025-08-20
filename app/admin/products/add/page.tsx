'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { productsApi, categoriesApi, subcategoriesApi, type ProductCreateDto, type Category, type Subcategory } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { Loader2, ArrowLeft, Save } from 'lucide-react';
import BackToDashboardButton from '@/components/admin/BackToDashboardButton';

// Schéma de validation avec Zod
const productFormSchema = z.object({
  name: z.string().min(3, 'Le nom doit contenir au moins 3 caractères'),
  description: z.string().optional(),
  price: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: 'Le prix doit être un nombre positif',
  }),
  size: z.string().optional(),
  stock: z.string()
    .refine((val) => /^\d+$/.test(val), {
      message: 'Le stock doit être un nombre entier positif',
    }),
  urlImage: z.string().url('URL invalide').optional().or(z.literal('')),
  urlImageHover: z.string().url('URL invalide').optional().or(z.literal('')),
  subCategories: z.array(z.number()).min(1, 'Sélectionnez au moins une sous-catégorie'),
});

type ProductFormValues = z.infer<typeof productFormSchema>;

export default function AddProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Array<Category & { subCategories: Subcategory[] }>>([]);
  const [allCategories, setAllCategories] = useState<Category[]>([]);
  const [allSubCategories, setAllSubCategories] = useState<Subcategory[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: '',
      description: '',
      price: '0',
      size: '',
      stock: '0',
      urlImage: '',
      urlImageHover: '',
      subCategories: [],
    },
  });

  // Charger les catégories et sous-catégories
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const [cats, subs] = await Promise.all([
          categoriesApi.list(),
          subcategoriesApi.list(),
        ]);
        
        setAllCategories(cats);
        setAllSubCategories(subs as any[]);
        
        // Regrouper les sous-catégories par catégorie si possible
        const categoriesWithSubs = cats.map((cat) => ({
          ...cat,
          subCategories: (subs as any[])
            .filter((s: any) => Array.isArray(s.categories) && s.categories.some((c: any) => c.id === cat.id))
            .map((s: any) => ({ id: s.id, name: s.name } as Subcategory)),
        }));
        setCategories(categoriesWithSubs);
      } catch (error) {
        console.error('Erreur lors du chargement des catégories:', error);
        toast.error('Erreur lors du chargement des catégories');
      }
    };

    loadCategories();
  }, []);

  const onSubmit = async (formData: ProductFormValues) => {
    try {
      setLoading(true);
      
      // Le stock est traité comme une chaîne de caractères
      // Build product data according to backend format
      const productData: any = {
        name: formData.name,
        price: formData.price, // Laissé comme chaîne pour le moment
        stock: formData.stock, // Stocké comme chaîne de caractères
        subCategories: formData.subCategories,
        categories: selectedCategories, // Use selected categories
      };
      
      // Add optional fields only if they have values
      if (formData.description) productData.description = formData.description;
      if (formData.size) productData.size = formData.size;
      if (formData.urlImage) productData.urlImage = formData.urlImage;
      if (formData.urlImageHover) productData.urlImageHover = formData.urlImageHover;

      console.log('Sending product data:', productData);
      const newProduct = await productsApi.create(productData);
      
      toast.success('Produit créé avec succès');
      router.push('/admin/products/manage');
    } catch (error) {
      console.error('Erreur lors de la création du produit:', error);
      let errorMessage = 'Erreur lors de la création du produit';
      
      if (error instanceof Error) {
        errorMessage = error.message;
        // Try to extract validation errors from the error message
        if (error.message.includes('errors')) {
          try {
            const errorData = JSON.parse(error.message);
            if (errorData.errors) {
              const validationErrors = Object.entries(errorData.errors)
                .map(([field, messages]) => `${field}: ${Array.isArray(messages) ? messages.join(', ') : messages}`)
                .join('; ');
              errorMessage = `Erreurs de validation: ${validationErrors}`;
            }
          } catch (e) {
            // If parsing fails, use the original message
          }
        }
      }
      
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const selectedSubCategories = watch('subCategories') || [];

  return (
    <div className="min-h-screen bg-[#06080d] text-white p-6">
      <div className="max-w-4xl mx-auto">
        <BackToDashboardButton />
        
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 text-transparent bg-clip-text">
              Ajouter un produit
            </h1>
            <p className="text-sm text-gray-400 mt-1">
              Remplissez les détails du nouveau produit
            </p>
          </div>
          
          <Button 
            variant="outline" 
            className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
            onClick={() => router.back()}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour
          </Button>
        </div>

        <div className="bg-gray-900/50 backdrop-blur-sm rounded-lg border border-gray-800 p-6 mb-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Nom du produit */}
              <div className="space-y-2">
                <Label htmlFor="name">Nom du produit *</Label>
                <Controller
                  name="name"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="name"
                      placeholder="Nom du produit"
                      className="bg-gray-800 border-gray-700 text-white placeholder-gray-500"
                      {...field}
                    />
                  )}
                />
                {errors.name && (
                  <p className="text-sm text-red-400">{errors.name.message}</p>
                )}
              </div>

              {/* Prix */}
              <div className="space-y-2">
                <Label htmlFor="price">Prix (TND) *</Label>
                <Controller
                  name="price"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="0.00"
                      className="bg-gray-800 border-gray-700 text-white placeholder-gray-500"
                      {...field}
                    />
                  )}
                />
                {errors.price && (
                  <p className="text-sm text-red-400">{errors.price.message}</p>
                )}
              </div>

              {/* Taille */}
              <div className="space-y-2">
                <Label htmlFor="size">Taille (optionnel)</Label>
                <Controller
                  name="size"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="size"
                      placeholder="Ex: S, M, L, XL, 42, etc."
                      className="bg-gray-800 border-gray-700 text-white placeholder-gray-500"
                      {...field}
                    />
                  )}
                />
                {errors.size && (
                  <p className="text-sm text-red-400">{errors.size.message}</p>
                )}
              </div>

              {/* Stock */}
              <div className="space-y-2">
                <Label htmlFor="stock">Stock *</Label>
                <Controller
                  name="stock"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="stock"
                      type="number"
                      min="0"
                      placeholder="0"
                      className="bg-gray-800 border-gray-700 text-white placeholder-gray-500"
                      {...field}
                    />
                  )}
                />
                {errors.stock && (
                  <p className="text-sm text-red-400">{errors.stock.message}</p>
                )}
              </div>

              {/* URL Image */}
              <div className="space-y-2">
                <Label htmlFor="urlImage">URL de l'image (optionnel)</Label>
                <Controller
                  name="urlImage"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="urlImage"
                      type="url"
                      placeholder="https://example.com/image.jpg"
                      className="bg-gray-800 border-gray-700 text-white placeholder-gray-500"
                      {...field}
                    />
                  )}
                />
                {errors.urlImage && (
                  <p className="text-sm text-red-400">{errors.urlImage.message}</p>
                )}
              </div>

              {/* URL Image au survol */}
              <div className="space-y-2">
                <Label htmlFor="urlImageHover">URL de l'image au survol (optionnel)</Label>
                <Controller
                  name="urlImageHover"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="urlImageHover"
                      type="url"
                      placeholder="https://example.com/image-hover.jpg"
                      className="bg-gray-800 border-gray-700 text-white placeholder-gray-500"
                      {...field}
                    />
                  )}
                />
                {errors.urlImageHover && (
                  <p className="text-sm text-red-400">{errors.urlImageHover.message}</p>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description (optionnel)</Label>
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <Textarea
                    id="description"
                    placeholder="Description détaillée du produit..."
                    className="min-h-[100px] bg-gray-800 border-gray-700 text-white placeholder-gray-500"
                    {...field}
                  />
                )}
              />
              {errors.description && (
                <p className="text-sm text-red-400">{errors.description.message}</p>
              )}
            </div>

            {/* Catégories et sous-catégories */}
            <div className="space-y-6">
              {/* Sélection des catégories */}
              <div className="space-y-2">
                <Label>Catégories associées</Label>
                <select
                  multiple
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white min-h-[120px]"
                  value={selectedCategories.map(id => id.toString())}
                  onChange={(e) => {
                    const selectedOptions = Array.from(e.target.selectedOptions, option => parseInt(option.value));
                    setSelectedCategories(selectedOptions);
                    console.log('Selected categories:', selectedOptions);
                  }}
                >
                  {allCategories.map((category) => (
                    <option key={category.id} value={category.id} className="py-1">
                      {category.name}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-400">
                  Maintenez Ctrl (ou Cmd sur Mac) pour sélectionner plusieurs catégories
                </p>
              </div>

              {/* Sélection des sous-catégories */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Sous-catégories associées *</Label>
                  {errors.subCategories && (
                    <p className="text-sm text-red-400">
                      {errors.subCategories.message}
                    </p>
                  )}
                </div>
                
                <select
                  multiple
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white min-h-[120px]"
                  value={selectedSubCategories.map(id => id.toString())}
                  onChange={(e) => {
                    const selectedOptions = Array.from(e.target.selectedOptions, option => parseInt(option.value));
                    setValue('subCategories', selectedOptions, { shouldValidate: true });
                  }}
                >
                  {allSubCategories.map((subCategory) => (
                    <option key={subCategory.id} value={subCategory.id} className="py-1">
                      {subCategory.name}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-400">
                  Maintenez Ctrl (ou Cmd sur Mac) pour sélectionner plusieurs sous-catégories
                </p>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-gray-800">
              <Button
                type="submit"
                disabled={loading}
                className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-black font-medium"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Création...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Créer le produit
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

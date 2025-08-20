'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { productsApi, categoriesApi, subcategoriesApi, type Product, type ProductUpdateDto, type Category, type Subcategory } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { Loader2, ArrowLeft, Save, Trash2 } from 'lucide-react';
import BackToDashboardButton from '@/components/admin/BackToDashboardButton';

// Schéma de validation avec Zod
const productFormSchema = z.object({
  name: z.string().min(3, 'Le nom doit contenir au moins 3 caractères'),
  description: z.string().optional(),
  price: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: 'Le prix doit être un nombre positif',
  }),
  size: z.string().optional(),
  stock: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
    message: 'Le stock doit être un nombre positif ou zéro',
  }),
  urlImage: z.string().url('URL invalide').optional().or(z.literal('')),
  urlImageHover: z.string().url('URL invalide').optional().or(z.literal('')),
  subCategories: z.array(z.number()).min(1, 'Sélectionnez au moins une sous-catégorie'),
});

type ProductFormValues = z.infer<typeof productFormSchema>;

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = parseInt(Array.isArray(params.id) ? params.id[0] : params.id || '0', 10);
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState<Array<Category & { subCategories: Subcategory[] }>>([]);
  const [product, setProduct] = useState<Product | null>(null);
  
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
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

  // Charger le produit et les catégories
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // Charger les catégories et sous-catégories
        const [cats, subs] = await Promise.all([
          categoriesApi.list(),
          subcategoriesApi.list(),
        ]);
        const categoriesWithSubs = cats.map((cat) => ({
          ...cat,
          subCategories: (subs as any[])
            .filter((s: any) => Array.isArray(s.categories) && s.categories.some((c: any) => c.id === cat.id))
            .map((s: any) => ({ id: s.id, name: s.name } as Subcategory)),
        }));
        setCategories(categoriesWithSubs);
        
        // Charger le produit
        const productData = await productsApi.get(productId);
        setProduct(productData);
        
        // Pré-remplir le formulaire avec les données du produit
        reset({
          name: productData.name,
          description: productData.description || '',
          price: productData.price.toString(),
          size: productData.size || '',
          stock: productData.stock.toString(),
          urlImage: productData.urlImage || '',
          urlImageHover: productData.urlImageHover || '',
          subCategories: productData.subCategories.map(sc => sc.id),
        });
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
        toast.error('Erreur lors du chargement des données du produit');
        router.push('/admin/products/manage');
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      loadData();
    }
  }, [productId, reset, router]);

  const onSubmit = async (data: ProductFormValues) => {
    try {
      setSaving(true);
      
      const productData: ProductUpdateDto = {
        name: data.name,
        description: data.description || undefined,
        price: parseFloat(data.price),
        size: data.size || undefined,
        stock: parseInt(data.stock, 10),
        urlImage: data.urlImage || undefined,
        urlImageHover: data.urlImageHover || undefined,
        subCategories: data.subCategories,
      };

      await productsApi.update(productId, productData);
      
      toast.success('Produit mis à jour avec succès');
      router.push('/admin/products/manage');
    } catch (error) {
      console.error('Erreur lors de la mise à jour du produit:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la mise à jour du produit';
      toast.error(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const selectedSubCategories = watch('subCategories') || [];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#06080d] text-white p-6">
        <div className="max-w-4xl mx-auto">
          <BackToDashboardButton />
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-cyan-400" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#06080d] text-white p-6">
        <div className="max-w-4xl mx-auto">
          <BackToDashboardButton />
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold text-red-400 mb-2">Produit non trouvé</h2>
            <p className="text-gray-400 mb-6">Le produit que vous essayez de modifier n'existe pas ou a été supprimé.</p>
            <Button 
              variant="outline" 
              className="border-cyan-500 text-cyan-400 hover:bg-cyan-900/20"
              onClick={() => router.push('/admin/products/manage')}
            >
              Retour à la liste des produits
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#06080d] text-white p-6">
      <div className="max-w-4xl mx-auto">
        <BackToDashboardButton />
        
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 text-transparent bg-clip-text">
              Modifier le produit
            </h1>
            <p className="text-sm text-gray-400 mt-1">
              Modifiez les détails du produit
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
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Sous-catégories associées *</Label>
                {errors.subCategories && (
                  <p className="text-sm text-red-400">
                    {errors.subCategories.message}
                  </p>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {categories.map((category) => (
                  <div key={category.id} className="bg-gray-800/50 rounded-lg p-4">
                    <h3 className="font-medium text-cyan-400 mb-3">{category.name}</h3>
                    <div className="space-y-2">
                      {category.subCategories.length > 0 ? (
                        category.subCategories.map((subCategory) => (
                          <div key={subCategory.id} className="flex items-center space-x-2">
                            <Checkbox
                              id={`subcat-${subCategory.id}`}
                              checked={selectedSubCategories.includes(subCategory.id)}
                              onCheckedChange={(checked) => {
                                const newSubCategories = checked
                                  ? [...selectedSubCategories, subCategory.id]
                                  : selectedSubCategories.filter((id) => id !== subCategory.id);
                                setValue('subCategories', newSubCategories, { shouldValidate: true });
                              }}
                              className="border-gray-600 data-[state=checked]:bg-cyan-500 data-[state=checked]:border-cyan-500"
                            />
                            <Label
                              htmlFor={`subcat-${subCategory.id}`}
                              className="text-sm font-normal cursor-pointer"
                            >
                              {subCategory.name}
                            </Label>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-gray-400">Aucune sous-catégorie disponible</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-between pt-4 border-t border-gray-800">
              <Button
                type="button"
                variant="outline"
                className="text-red-400 border-red-900/50 hover:bg-red-900/20 hover:text-red-300"
                onClick={() => {
                  if (confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
                    handleDelete();
                  }
                }}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Supprimer
              </Button>
              
              <Button
                type="submit"
                disabled={saving}
                className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-black font-medium"
              >
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Enregistrement...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Enregistrer les modifications
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
  
  async function handleDelete() {
    try {
      setSaving(true);
      await productsApi.delete(productId);
      toast.success('Produit supprimé avec succès');
      router.push('/admin/products/manage');
    } catch (error) {
      console.error('Erreur lors de la suppression du produit:', error);
      toast.error('Erreur lors de la suppression du produit');
    } finally {
      setSaving(false);
    }
  }
}

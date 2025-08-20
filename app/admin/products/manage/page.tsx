'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { productsApi, categoriesApi, type Product, type Category } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Edit, Trash2, Loader2 } from 'lucide-react';
import BackToDashboardButton from '@/components/admin/BackToDashboardButton';

export default function ManageProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [deleteLoading, setDeleteLoading] = useState<number | null>(null);

  // Fetch products and categories on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [productsData, categoriesData] = await Promise.all([
          productsApi.list(),
          categoriesApi.list()
        ]);
        setProducts(productsData);
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter products based on search query and selected category
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || 
      (product.categories && product.categories.some(cat => 
        cat.id.toString() === selectedCategory || cat.name.toLowerCase().includes(selectedCategory.toLowerCase())
      )) ||
      product.subCategories.some(sc => 
        (sc.category?.id?.toString?.() || '').toString() === selectedCategory || 
        (sc.category?.name || '').toLowerCase().includes(selectedCategory.toLowerCase())
      );
    
    return matchesSearch && matchesCategory;
  });

  const handleDelete = async (id: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) return;
    
    try {
      setDeleteLoading(id);
      await productsApi.delete(id);
      setProducts(products.filter(p => p.id !== id));
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Erreur lors de la suppression du produit');
    } finally {
      setDeleteLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#06080d] text-white p-6">
        <div className="max-w-7xl mx-auto">
          <BackToDashboardButton />
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-cyan-400" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#06080d] text-white p-6">
      <div className="max-w-7xl mx-auto">
        <BackToDashboardButton />
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 text-transparent bg-clip-text">
              Gestion des Produits
            </h1>
            <p className="text-sm text-gray-400 mt-1">
              Gérez tous vos produits en un seul endroit
            </p>
          </div>
          
          <Link href="/admin/products/add">
            <Button className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-black font-medium">
              <Plus className="mr-2 h-4 w-4" />
              Ajouter un produit
            </Button>
          </Link>
        </div>

        <div className="bg-gray-900/50 backdrop-blur-sm rounded-lg border border-gray-800 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Rechercher un produit..."
                  className="pl-10 bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <div>
              <select
                className="w-full bg-gray-800 border border-gray-700 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="all">Toutes les catégories</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="rounded-md border border-gray-800 overflow-hidden">
            <Table>
              <TableHeader className="bg-gray-800">
                <TableRow>
                  <TableHead className="text-white">Produit</TableHead>
                  <TableHead className="text-white">Catégories</TableHead>
                  <TableHead className="text-white">Sous-catégories</TableHead>
                  <TableHead className="text-white text-right">Prix</TableHead>
                  <TableHead className="text-white text-right">Stock</TableHead>
                  <TableHead className="text-right text-white">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => (
                    <TableRow key={product.id} className="border-gray-800 hover:bg-gray-800/50">
                      <TableCell className="font-medium">
                        <div className="flex items-center space-x-3">
                          {product.urlImage ? (
                            <img 
                              src={product.urlImage} 
                              alt={product.name}
                              className="h-10 w-10 rounded-md object-cover"
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-md bg-gray-700 flex items-center justify-center">
                              <span className="text-xs text-gray-400">No image</span>
                            </div>
                          )}
                          <div>
                            <div className="font-medium text-white">{product.name}</div>
                            <div className="text-xs text-gray-400 line-clamp-1">
                              {product.description || 'Aucune description'}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1 max-w-[200px]">
                          {Array.from(new Set(product.subCategories
                            .map(sc => sc.category?.name)
                            .filter((name): name is string => !!name)
                          )).map((categoryName, idx) => (
                            <Badge 
                              key={`cat-${idx}`} 
                              variant="outline"
                              className="text-xs bg-gray-800 border-gray-700 text-cyan-300 hover:bg-gray-700 whitespace-nowrap"
                            >
                              {categoryName}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1 max-w-[200px]">
                          {product.subCategories.map((sc, idx) => (
                            <Badge 
                              key={`sub-${idx}`} 
                              variant="outline"
                              className="text-xs bg-gray-800 border-gray-700 text-amber-300 hover:bg-gray-700 whitespace-nowrap"
                            >
                              {sc.name}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-mono">
                        {parseFloat(product.price).toFixed(3)} TND
                      </TableCell>
                      <TableCell className="text-right">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          product.stock > 10 
                            ? 'bg-green-900/30 text-green-400' 
                            : product.stock > 0 
                              ? 'bg-yellow-900/30 text-yellow-400' 
                              : 'bg-red-900/30 text-red-400'
                        }`}>
                          {product.stock} en stock
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-gray-400 hover:text-cyan-400 hover:bg-gray-800"
                            onClick={() => router.push(`/admin/products/edit/${product.id}`)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-gray-400 hover:text-red-400 hover:bg-gray-800"
                            onClick={() => handleDelete(product.id)}
                            disabled={deleteLoading === product.id}
                          >
                            {deleteLoading === product.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center text-gray-400">
                      Aucun produit trouvé
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
}

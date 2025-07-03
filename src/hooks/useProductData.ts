import { useState, useEffect } from 'react';
import { Product } from '../types';
import { useLocalStorage } from './useLocalStorage';

export function useProductData() {
  const [products, setProducts] = useLocalStorage<Product[]>('products', []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadProductsFromFile = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/products.json');
      if (!response.ok) {
        throw new Error('Failed to load products');
      }
      
      const productsData: Product[] = await response.json();
      setProducts(productsData);
      
      return productsData;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      console.error('Error loading products:', err);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const initializeProducts = async () => {
    // Only load from file if no products exist in localStorage
    if (products.length === 0) {
      await loadProductsFromFile();
    }
  };

  useEffect(() => {
    initializeProducts();
  }, []);

  return {
    products,
    setProducts,
    loading,
    error,
    loadProductsFromFile,
    initializeProducts
  };
}
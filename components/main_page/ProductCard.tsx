'use client'

import { useState, useEffect } from 'react';
import { Card, CardBody, CardFooter } from "@heroui/card";
import { ProductImageSlider } from "@/components/ProductImageSlider";
import { FormatCurrency } from "@/models/FormatCurrency";

import { Product } from "@/types/mainPage";

import { ProductCardProps } from '@/types/mainPage';

export const ProductCard = ({ 
  filters = { 
    gender: 'all', 
    type: 'all',
    priceRange: [0, 1000],
    selectedSizes: [],
    sortOrder: 'default' 
  } 
}: ProductCardProps) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        // Build query string from filters
        const queryParams = new URLSearchParams();
        if (filters.gender !== 'all') queryParams.append('gender', filters.gender);
        if (filters.type !== 'all') queryParams.append('type', filters.type);

        // Add price range filters
        queryParams.append('minPrice', filters.priceRange[0].toString());
        queryParams.append('maxPrice', filters.priceRange[1].toString());

        // Add size filters if any are selected
        if (filters.selectedSizes.length > 0) {
          filters.selectedSizes.forEach(size => {
            queryParams.append('size', size);
          });
        }

        // Add sort order
        queryParams.append('sort', filters.sortOrder);

        const url = `/api/products${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }

        const data = await response.json();

        // Apply client-side sorting if needed
        let sortedData = [...data];
        if (filters.sortOrder === 'price-asc') {
          sortedData.sort((a, b) => (a.salePrice || a.price) - (b.salePrice || b.price));
        } else if (filters.sortOrder === 'price-desc') {
          sortedData.sort((a, b) => (b.salePrice || b.price) - (a.salePrice || a.price));
        }

        setProducts(sortedData);
      } catch (err: unknown) {
        console.error('Error fetching products:', err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [filters]);

  if (loading) {
    return <div className="w-full text-center py-8">Loading products...</div>;
  }

  if (error) {
    return <div className="w-full text-center py-8 text-red-500">Error: {error}</div>;
  }

  if (products.length === 0) {
    return <div className="w-full text-center py-8">No products found</div>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full max-w-7xl">
      {products.map((product) => (
        <Card key={product.id} isPressable radius="none" shadow="none">
          <CardBody className="p-0">
            <ProductImageSlider 
              images={product.image} 
              alt={product.name}
            />
          </CardBody>

          <CardFooter className="flex flex-col items-start justify-start">
            <div className="flex gap-1">
              {product.colors.map((color) => (
                <div 
                  key={color}
                  className="w-6 h-6 rounded-full border border-gray-300" 
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>
            <div className="flex flex-col gap-1 items-start">
              <p className="text-base font-light">{product.name}</p>
              {product.salePrice ? (
                <>
                  <p className="text-base font-bold">{FormatCurrency(product.salePrice)}</p>
                  <div className="flex flex-row gap-2">
                    <p className="text-base line-through">{FormatCurrency(product.price)}</p>
                    <p className="text-red-600 font-semibold">
                      -{Math.round((1 - product.salePrice / product.price) * 100)}%
                    </p>
                  </div>
                </>
              ) : (
                <p className="text-base font-bold">{FormatCurrency(product.price)}</p>
              )}
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};
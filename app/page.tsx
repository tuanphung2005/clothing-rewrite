'use client'

import { useState } from 'react';
import { Image } from "@heroui/image";

import { Button } from "@heroui/button";

import { BigGenderFilter } from "@/components/main_page/BigGenderFilter";
import { SmallFilter } from "@/components/main_page/SmallFilter";
import { ProductCard } from "@/components/main_page/ProductCard";
import { TypeFilter } from "@/components/main_page/TypeFilter";
import bigBanner from "@/public/bigBanner.png";

export default function Home() {
  const [filters, setFilters] = useState({
    gender: 'all',
    type: 'all',
    priceRange: [40000, 500000] as [number, number],
    selectedSizes: [] as string[],
    sortOrder: 'new'
  });

  const handleFilterChange = (filterType: string, value: any): void => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  return (
    <>
      {/* banner image */}
      <div className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <Image
          src={bigBanner.src}
          alt="banner"
          radius="none"
        />
      </div>
      {/* top section */}
      <div className="flex flex-col items-center justify-center gap-4 py-8 md:py-10 w-full">
        {/* gender filter buttons */}
        <BigGenderFilter 
          onFilterChange={handleFilterChange} 
          activeGender={filters.gender}
        />
        <TypeFilter 
          onFilterChange={handleFilterChange}
          activeType={filters.type}
        />
      </div>
      {/* main content */}
      <div className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        {/* second filter for sizes, prices */}
        <SmallFilter 
          onFilterChange={handleFilterChange}
          priceRange={filters.priceRange}
          selectedSizes={filters.selectedSizes}
          sortOrder={filters.sortOrder}
        />
        {/* Clear All Filters Button */}
        {(filters.gender !== 'all' || 
          filters.type !== 'all' || 
          filters.priceRange[0] !== 40000 || 
          filters.priceRange[1] !== 500000 || 
          filters.selectedSizes.length > 0 || 
          filters.sortOrder !== 'new') && (
          <div className="w-full flex justify-center">
            <Button 
              variant="flat" 
              color="warning"
              onPress={() => setFilters({
                gender: 'all',
                type: 'all',
                priceRange: [40000, 500000],
                selectedSizes: [],
                sortOrder: 'new'
              })}
            >
              Xóa tất cả bộ lọc
            </Button>
          </div>
        )}
        <ProductCard filters={filters} />
      </div>
    </>
  );
}

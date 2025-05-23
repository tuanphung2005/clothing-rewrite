'use client'

import { useState } from 'react';
import { Image } from "@heroui/image";

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
        <BigGenderFilter onFilterChange={handleFilterChange} />
        <TypeFilter onFilterChange={handleFilterChange} />
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
        <ProductCard filters={filters} />
      </div>
    </>
  );
}

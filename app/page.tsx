'use client'

import { Image } from "@heroui/image";

import { BigGenderFilter } from "@/components/main_page/BigGenderFilter";
import { SmallFilter } from "@/components/main_page/SmallFilter";
import { ProductCard } from "@/components/main_page/ProductCard";
import { TypeFilter } from "@/components/main_page/TypeFilter";

import bigBanner from "@/public/bigBanner.png";

export default function Home() {




  return (
    <>
      {/* banner image */}
      <div className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <Image
          src={bigBanner.src}
          alt="banner"
          className="rounded-lg"
        />
      </div>
      {/* top section */}
      <div className="flex flex-col items-center justify-center gap-4 py-8 md:py-10 w-full">
        {/* gender filter buttons (all, female, male, female(kid), male(kid)) */}
        <BigGenderFilter />
        <TypeFilter />
        
      </div>
      {/* main content */}
      <div className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        {/* second filter for sizes, prices on the left side, and sort by on the right side */}
        <SmallFilter />
        <ProductCard />

      </div>

    </>
  );
}

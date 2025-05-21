'use client'

import { BigGenderFilter } from "@/components/main_page/BigGenderFilter";
import { SmallFilter } from "@/components/main_page/SmallFilter";
import { Card } from "@heroui/card";

export default function Home() {
  return (
    <>
      {/* top section */}
      <div className="flex flex-col items-center justify-center gap-4 py-8 md:py-10 border border-default-200">
        {/* gender filter buttons (all, female, male, female(kid), male(kid)) */}
        <BigGenderFilter />
        
        
      </div>
      {/* main content */}
      <div className="flex flex-col items-center justify-center gap-4 py-8 md:py-10 border border-default-200">
        {/* second filter for sizes, prices on the left side, and sort by on the right side */}
        <SmallFilter />
        {/* product card */}


      </div>

    </>
  );
}

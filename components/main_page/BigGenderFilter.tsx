'use client'

import { Button } from "@heroui/button";
import { BigGenderFilterProps } from "@/types/mainPage";

const genderFilter = [
  { label: "Tất cả", value: "all" },
  { label: "Nữ", value: "female" },
  { label: "Nam", value: "male" },
  { label: "Bé gái", value: "female-kid" },
  { label: "Bé trai", value: "male-kid" },
];

export const BigGenderFilter = ({ onFilterChange, activeGender }: BigGenderFilterProps) => {
  return (
    <div className="flex gap-4 w-full items-stretch justify-between">
      {genderFilter.map((item) => {
        const isActive = activeGender === item.value;
        
        return (
          <Button 
            key={item.value}
            variant={isActive ? "solid" : "bordered"}
            color={isActive ? "primary" : "default"}
            radius="none" 
            className={`w-56 transition-all duration-200 ${
              isActive 
                ? "shadow-lg scale-105 font-bold" 
                : "hover:scale-102 hover:shadow-md"
            }`}
            size="lg"
            onPress={() => onFilterChange('gender', item.value)}
          >
            {item.label}
            {isActive && item.value !== 'all' && (
              <span className="ml-2 text-xs opacity-80">✓</span>
            )}
          </Button>
        );
      })}
    </div>
  );
};
'use client'

import { Button } from "@heroui/button";

const genderFilter = [
  { label: "Tất cả", value: "all" },
  { label: "Nữ", value: "female" },
  { label: "Nam", value: "male" },
  { label: "Bé gái", value: "female-kid" },
  { label: "Bé trai", value: "male-kid" },
];

import { BigGenderFilterProps } from "@/types/mainPage";



export const BigGenderFilter = ({ onFilterChange }: BigGenderFilterProps) => {
  return (
    <div className="flex gap-4 w-full items-stretch justify-between">
      {genderFilter.map((item) => (
        <Button 
          key={item.value}
          variant="bordered" 
          color="default" 
          radius="none" 
          className="w-56" 
          size="lg"
          onPress={() => onFilterChange('gender', item.value)}
        >
          {item.label}
        </Button>
      ))}
    </div>
  );
};
import { Button } from "@heroui/button";

// DO NOT CHANGE THIS
const clothingTypes = [
  { label: "Tất cả", value: "all" },
  { label: "Áo", value: "shirt" },
  { label: "Quần", value: "pants" },
  { label: "Váy", value: "skirts" },
  { label: "Đồ lót", value: "unders" },
];

import { TypeFilterProps } from "@/types/mainPage";

export const TypeFilter = ({onFilterChange} : TypeFilterProps) => {
  return (
    <div className="flex flex-wrap gap-2 w-full items-center justify-center">
      {clothingTypes.map((item) => (
        <Button 
          key={item.value}
          variant="solid" 
          color="primary" 
          radius="full" 
          className="min-w-44 text-xl font-semibold" 
          size="lg"
          onPress={() => onFilterChange('type', item.value)}
        >
          {item.label}
        </Button>
      ))}
    </div>
  );
};
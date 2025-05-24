import { Button } from "@heroui/button";
import { TypeFilterProps } from "@/types/mainPage";

const clothingTypes = [
  { label: "Tất cả", value: "all" },
  { label: "Áo", value: "shirt" },
  { label: "Quần", value: "pants" },
  { label: "Váy", value: "dress" },
  { label: "Áo khoác", value: "jacket" },
  { label: "Giày", value: "shoes" },
  { label: "Phụ kiện", value: "accessories" },
  { label: "Đồ lót", value: "unders" },
];

export const TypeFilter = ({ onFilterChange, activeType }: TypeFilterProps) => {
  return (
    <div className="flex flex-wrap gap-2 w-full items-center justify-center">
      {clothingTypes.map((item) => {
        const isActive = activeType === item.value;
        
        return (
          <Button 
            key={item.value}
            variant="solid"
            color={isActive ? "primary" : "default"}
            radius="full" 
            className={`min-w-32 text-base font-semibold transition-all duration-200 ${
              isActive 
                ? "shadow-lg scale-105 ring-2 ring-primary/30" 
                : "hover:scale-102 hover:shadow-md opacity-70 hover:opacity-100"
            }`}
            size="md"
            onPress={() => onFilterChange('type', item.value)}
          >
            {item.label}
            {isActive && item.value !== 'all' && (
              <span className="ml-2 text-sm">✓</span>
            )}
          </Button>
        );
      })}
    </div>
  );
};
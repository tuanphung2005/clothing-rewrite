import { Button } from "@heroui/button";

// Data for clothing types - can be moved to API later
const clothingTypes = [
  { label: "Tất cả", value: "all" },
  { label: "Áo", value: "shirt" },
  { label: "Quần", value: "pants" },
  { label: "Đồ lót", value: "unders" },
];

export const TypeFilter = () => {
  return (
    <div className="flex flex-wrap gap-2 w-full items-center justify-center">
      {clothingTypes.map((item) => (
        <Button 
          key={item.value}
          variant="solid" 
          color="primary" 
          radius="sm" 
          className="min-w-20" 
          size="lg"
        >
          {item.label}
        </Button>
      ))}
    </div>
  );
};
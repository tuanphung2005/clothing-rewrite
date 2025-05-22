export interface ProductImageSliderProps {
    images: string[];
    alt: string;
}

export interface BigGenderFilterProps {
  onFilterChange: (key: string, value: string) => void;
}

export interface TypeFilterProps {
onFilterChange: (key: string, value: string) => void;
}

export interface SmallFilterProps {
  onFilterChange: (filterType: string, value: any) => void;
  priceRange: [number, number];
  selectedSizes: string[];
  sortOrder: string;
}

export interface Product {
  id: string;
  image: string[];
  name: string;
  colors: string[];
  price: number;
  salePrice?: number;
}

export interface ProductCardProps {
  filters?: {
    gender: string;
    type: string;
    priceRange: [number, number];
    selectedSizes: string[];
    sortOrder: string;
  };
}
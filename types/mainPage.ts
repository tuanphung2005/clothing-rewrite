export interface ProductImageSliderProps {
    images: string[];
    alt: string;
}

export interface BigGenderFilterProps {
  onFilterChange: (key: string, value: string) => void;
  activeGender: string;
}

export interface TypeFilterProps {
  onFilterChange: (key: string, value: string) => void;
  activeType: string;
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

export interface ProductDetail {
  id: number;
  name: string;
  description?: string;
  material?: string;
  image: string[];
  colors: { name: string; color: string }[];
  price: number;
  salePrice?: number;
  sizes: string[];
  type: string;
  gender: string;
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
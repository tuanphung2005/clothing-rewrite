import { Slider } from "@heroui/slider";
import { Select, SelectItem } from "@heroui/select";
import { Chip } from "@heroui/chip";
import { SmallFilterProps } from "@/types/mainPage";

export const SmallFilter = ({ 
  onFilterChange, 
  priceRange = [40000, 500000], 
  selectedSizes = [], 
  sortOrder = "new" 
}: SmallFilterProps) => {

    // Size options
    const sizes = [
        { label: "S", value: "s" },
        { label: "M", value: "m" },
        { label: "L", value: "l" },
        { label: "XL", value: "xl" },
        { label: "XXL", value: "xxl" },
    ]

    // Price range change handler
    const handlePriceChange = (value: any) => {
        onFilterChange('priceRange', value);
    };

    // Size selection change handler
    const handleSizeChange = (value: any) => {
        const sizeArray = Array.from(value);
        onFilterChange('selectedSizes', sizeArray);
    };
    
    // Sort order change handler
    const handleSortChange = (value: string) => {
        onFilterChange('sortOrder', value);
    };

    // Check if price range is different from default
    const isPriceFiltered = priceRange[0] !== 40000 || priceRange[1] !== 500000;
    const hasSizeFilters = selectedSizes.length > 0;
    const isSortedCustom = sortOrder !== 'new';

    return (
        <div className="w-full space-y-4">
            {/* Active Filters Display */}
            {(isPriceFiltered || hasSizeFilters || isSortedCustom) && (
                <div className="flex flex-wrap gap-2 pb-4 border-b border-gray-200">
                    <span className="text-sm font-medium text-gray-600 mr-2">Bộ lọc đang áp dụng:</span>
                    
                    {isPriceFiltered && (
                        <Chip 
                            color="primary" 
                            variant="flat" 
                            size="sm"
                            onClose={() => onFilterChange('priceRange', [40000, 500000])}
                        >
                            Giá: {priceRange[0].toLocaleString('vi-VN')}₫ - {priceRange[1].toLocaleString('vi-VN')}₫
                        </Chip>
                    )}
                    
                    {selectedSizes.map(size => (
                        <Chip 
                            key={size}
                            color="secondary" 
                            variant="flat" 
                            size="sm"
                            onClose={() => {
                                const newSizes = selectedSizes.filter(s => s !== size);
                                onFilterChange('selectedSizes', newSizes);
                            }}
                        >
                            Size: {size.toUpperCase()}
                        </Chip>
                    ))}
                    
                    {isSortedCustom && (
                        <Chip 
                            color="success" 
                            variant="flat" 
                            size="sm"
                            onClose={() => onFilterChange('sortOrder', 'new')}
                        >
                            Sắp xếp: {
                                sortOrder === 'price-asc' ? 'Giá tăng dần' :
                                sortOrder === 'price-desc' ? 'Giá giảm dần' : 
                                'Mới nhất'
                            }
                        </Chip>
                    )}
                </div>
            )}

            {/* Filter Controls */}
            <div className="flex flex-col md:flex-row justify-between gap-8 w-full">
                <div className="flex flex-row gap-4 w-full md:w-2/5">
                    <div className="flex flex-col w-full">
                        <Slider 
                            formatOptions={{style: "currency", currency: "VND"}}
                            step={5000}
                            minValue={0}
                            maxValue={650000}
                            value={priceRange}
                            onChange={handlePriceChange}
                            showTooltip
                            size="md"
                            className="w-full"
                            color={isPriceFiltered ? "primary" : "foreground"}
                            label="Khoảng giá"
                        />
                    </div>
                    <Select
                        selectionMode="multiple"
                        labelPlacement="inside"
                        label="Kích cỡ"
                        size="md"
                        variant="bordered"
                        className="w-1/4"
                        radius="none"
                        selectedKeys={new Set(selectedSizes)}
                        onSelectionChange={handleSizeChange}
                        color={hasSizeFilters ? "primary" : "default"}
                    >
                        {sizes.map((item) => (
                            <SelectItem key={item.value}>
                                {item.label}
                            </SelectItem>
                        ))}
                    </Select>
                </div>
                <div className="w-full md:w-1/4">
                    <Select
                        labelPlacement="inside"
                        label="Sắp xếp theo"
                        size="md"
                        variant="underlined"
                        radius="none"
                        selectedKeys={[sortOrder]}
                        onSelectionChange={(keys) => handleSortChange(Array.from(keys)[0] as string)}
                        color={isSortedCustom ? "primary" : "default"}
                    >
                        <SelectItem key="new">Mới nhất</SelectItem>
                        <SelectItem key="price-asc">Giá: thấp đến cao</SelectItem>
                        <SelectItem key="price-desc">Giá: cao đến thấp</SelectItem>
                    </Select>
                </div>
            </div>
        </div>
    )
}
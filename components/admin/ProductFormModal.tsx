// components/admin/ProductFormModal.tsx
'use client'

import { useState, useEffect } from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import { Button } from "@heroui/button";
import { Input, Textarea } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { Chip } from "@heroui/chip";
import { Icon } from "@iconify/react";

interface Product {
  id: number;
  name: string;
  description?: string;
  material?: string;
  type: string;
  gender: string;
  price: number;
  salePrice?: number;
  images: Array<{ url: string; alt: string }>;
  colors: Array<{ name: string; color: string }>;
  sizes: Array<{ value: string }>;
}

interface ProductFormModalProps {
  product: Product | null;
  isEditing: boolean;
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
}

export const ProductFormModal = ({
  product,
  isEditing,
  isOpen,
  onClose,
  onSaved,
}: ProductFormModalProps) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    material: '',
    type: '',
    gender: '',
    price: '',
    salePrice: '',
  });
  const [images, setImages] = useState<Array<{ url: string; alt: string }>>([]);
  const [colors, setColors] = useState<Array<{ name: string; color: string }>>([]);
  const [sizes, setSizes] = useState<string[]>([]);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newColorName, setNewColorName] = useState('');
  const [newColorValue, setNewColorValue] = useState('#000000');
  const [newSize, setNewSize] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (product && isEditing) {
      setFormData({
        name: product.name,
        description: product.description || '',
        material: product.material || '',
        type: product.type,
        gender: product.gender,
        price: product.price.toString(),
        salePrice: product.salePrice?.toString() || '',
      });
      setImages(product.images);
      setColors(product.colors);
      setSizes(product.sizes.map(s => s.value));
    } else {
      // Reset form for new product
      setFormData({
        name: '',
        description: '',
        material: '',
        type: '',
        gender: '',
        price: '',
        salePrice: '',
      });
      setImages([]);
      setColors([]);
      setSizes([]);
    }
  }, [product, isEditing, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const submitData = {
        ...formData,
        price: parseFloat(formData.price),
        salePrice: formData.salePrice ? parseFloat(formData.salePrice) : null,
        images,
        colors,
        sizes,
      };

      const url = isEditing 
        ? `/api/admin/products/${product?.id}` 
        : '/api/admin/products';
      
      const method = isEditing ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submitData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to save product');
      }

      onSaved();
    } catch (error) {
      console.error('Error saving product:', error);
      alert(error instanceof Error ? error.message : 'Có lỗi xảy ra');
    } finally {
      setIsSubmitting(false);
    }
  };

  const addImage = () => {
    if (newImageUrl.trim()) {
      setImages([...images, { url: newImageUrl.trim(), alt: formData.name }]);
      setNewImageUrl('');
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const addColor = () => {
    if (newColorName.trim() && newColorValue) {
      setColors([...colors, { name: newColorName.trim(), color: newColorValue }]);
      setNewColorName('');
      setNewColorValue('#000000');
    }
  };

  const removeColor = (index: number) => {
    setColors(colors.filter((_, i) => i !== index));
  };

  const addSize = () => {
    if (newSize.trim() && !sizes.includes(newSize.trim())) {
      setSizes([...sizes, newSize.trim()]);
      setNewSize('');
    }
  };

  const removeSize = (size: string) => {
    setSizes(sizes.filter(s => s !== size));
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      size="4xl"
      scrollBehavior="inside"
    >
      <ModalContent>
        <form onSubmit={handleSubmit}>
          <ModalHeader>
            <h2 className="text-xl font-semibold">
              {isEditing ? `Sửa sản phẩm: ${product?.name}` : 'Thêm sản phẩm mới'}
            </h2>
          </ModalHeader>

          <ModalBody className="space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Tên sản phẩm"
                placeholder="Nhập tên sản phẩm"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                isRequired
              />
              <Input
                label="Chất liệu"
                placeholder="Ví dụ: Cotton, Polyester"
                value={formData.material}
                onChange={(e) => setFormData({ ...formData, material: e.target.value })}
              />
            </div>

            <Textarea
              label="Mô tả"
              placeholder="Mô tả chi tiết về sản phẩm"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              minRows={3}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Select
                label="Loại sản phẩm"
                placeholder="Chọn loại"
                selectedKeys={formData.type ? [formData.type] : []}
                onSelectionChange={(keys) => {
                  const type = Array.from(keys)[0] as string;
                  setFormData({ ...formData, type });
                }}
                isRequired
              >
                <SelectItem key="shirt" value="shirt">Áo</SelectItem>
                <SelectItem key="pants" value="pants">Quần</SelectItem>
                <SelectItem key="dress" value="dress">Váy</SelectItem>
                <SelectItem key="jacket" value="jacket">Áo khoác</SelectItem>
                <SelectItem key="shoes" value="shoes">Giày</SelectItem>
                <SelectItem key="accessories" value="accessories">Phụ kiện</SelectItem>
                <SelectItem key="unders" value="unders">Đồ lót</SelectItem>
              </Select>

              <Select
                label="Giới tính"
                placeholder="Chọn giới tính"
                selectedKeys={formData.gender ? [formData.gender] : []}
                onSelectionChange={(keys) => {
                  const gender = Array.from(keys)[0] as string;
                  setFormData({ ...formData, gender });
                }}
                isRequired
              >
                <SelectItem key="male" value="male">Nam</SelectItem>
                <SelectItem key="female" value="female">Nữ</SelectItem>
                <SelectItem key="unisex" value="unisex">Unisex</SelectItem>
              </Select>

              <div className="space-y-2">
                <Input
                  label="Giá gốc (VND)"
                  placeholder="0"
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  isRequired
                />
                <Input
                  label="Giá khuyến mãi (VND)"
                  placeholder="Để trống nếu không có"
                  type="number"
                  value={formData.salePrice}
                  onChange={(e) => setFormData({ ...formData, salePrice: e.target.value })}
                />
              </div>
            </div>

            {/* Images */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Hình ảnh</h3>
              <div className="flex gap-2">
                <Input
                  placeholder="URL hình ảnh"
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  className="flex-1"
                />
                <Button
                  type="button"
                  onPress={addImage}
                  startContent={<Icon icon="mdi:plus" />}
                >
                  Thêm
                </Button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {images.map((image, index) => (
                  <div key={index} className="relative">
                    <img
                      src={image.url}
                      alt={`Product ${index + 1}`}
                      className="w-full h-24 object-cover rounded border"
                    />
                    <Button
                      size="sm"
                      color="danger"
                      variant="flat"
                      className="absolute top-1 right-1"
                      onPress={() => removeImage(index)}
                    >
                      <Icon icon="mdi:close" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* Colors */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Màu sắc</h3>
              <div className="flex gap-2">
                <Input
                  placeholder="Tên màu"
                  value={newColorName}
                  onChange={(e) => setNewColorName(e.target.value)}
                  className="flex-1"
                />
                <input
                  type="color"
                  value={newColorValue}
                  onChange={(e) => setNewColorValue(e.target.value)}
                  className="w-12 h-10 border rounded"
                />
                <Button
                  type="button"
                  onPress={addColor}
                  startContent={<Icon icon="mdi:plus" />}
                >
                  Thêm
                </Button>
              </div>
              <div className="flex gap-2 flex-wrap">
                {colors.map((color, index) => (
                  <Chip
                    key={index}
                    variant="flat"
                    onClose={() => removeColor(index)}
                    startContent={
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: color.color }}
                      />
                    }
                  >
                    {color.name}
                  </Chip>
                ))}
              </div>
            </div>

            {/* Sizes */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Kích thước</h3>
              <div className="flex gap-2">
                <Input
                  placeholder="Kích thước (S, M, L, XL, 38, 39...)"
                  value={newSize}
                  onChange={(e) => setNewSize(e.target.value)}
                  className="flex-1"
                />
                <Button
                  type="button"
                  onPress={addSize}
                  startContent={<Icon icon="mdi:plus" />}
                >
                  Thêm
                </Button>
              </div>
              <div className="flex gap-2 flex-wrap">
                {sizes.map((size, index) => (
                  <Chip
                    key={index}
                    variant="bordered"
                    onClose={() => removeSize(size)}
                  >
                    {size}
                  </Chip>
                ))}
              </div>
            </div>
          </ModalBody>

          <ModalFooter>
            <Button variant="light" onPress={onClose}>
              Hủy
            </Button>
            <Button
              type="submit"
              color="primary"
              isLoading={isSubmitting}
              startContent={!isSubmitting && <Icon icon="mdi:content-save" />}
            >
              {isEditing ? 'Cập nhật' : 'Tạo mới'}
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};
// components/main_page/ProductDetailPopover.tsx
'use client'

import { useState } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@heroui/modal";
import { Button } from "@heroui/button";
import { Select, SelectItem } from "@heroui/select";
import { Chip } from "@heroui/chip";
import { Divider } from "@heroui/divider";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { Image } from "@heroui/image";
import { Icon } from "@iconify/react";
import { FormatCurrency } from "@/models/FormatCurrency";
import { ProductDetail } from "@/types/mainPage";
import { useCart } from "@/lib/cart-context";
import { useAuth } from "@/lib/auth-context";

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface ProductDetailPopoverProps {
  product: ProductDetail;
  isOpen: boolean;
  onClose: () => void;
}

export const ProductDetailPopover = ({ product, isOpen, onClose }: ProductDetailPopoverProps) => {
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>(product.colors[0]?.name || '');
  const [quantity, setQuantity] = useState<number>(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  
  const { addToCart } = useCart();
  const { user } = useAuth();

  const handleAddToCart = async () => {
    if (!user) {
      alert('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng');
      return;
    }

    if (!selectedSize) {
      alert('Vui lòng chọn size');
      return;
    }

    try {
      setIsAddingToCart(true);
      await addToCart(product.id, quantity);
      onClose();
      // Reset selections
      setSelectedSize('');
      setSelectedColor(product.colors[0]?.name || '');
      setQuantity(1);
    } catch (error) {
      console.error('Failed to add to cart:', error);
      alert('Không thể thêm sản phẩm vào giỏ hàng');
    } finally {
      setIsAddingToCart(false);
    }
  };

  const selectedColorObj = product.colors.find(c => c.name === selectedColor);

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      size="4xl" 
      scrollBehavior="inside"
      classNames={{
        body: "py-6",
        backdrop: "bg-black/50 backdrop-opacity-40",
        base: "border border-default-200",
        header: "border-b border-default-200",
        footer: "border-t border-default-200",
      }}
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <h3 className="text-2xl font-bold">{product.name}</h3>
          <div className="flex items-center gap-2">
            {product.salePrice ? (
              <>
                <span className="text-2xl font-bold text-primary">
                  {FormatCurrency(product.salePrice)}
                </span>
                <span className="text-lg line-through text-gray-500">
                  {FormatCurrency(product.price)}
                </span>
                <Chip color="danger" variant="flat" size="sm">
                  -{Math.round((1 - product.salePrice / product.price) * 100)}%
                </Chip>
              </>
            ) : (
              <span className="text-2xl font-bold text-primary">
                {FormatCurrency(product.price)}
              </span>
            )}
          </div>
        </ModalHeader>

        <ModalBody>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Product Images */}
            <div className="w-full">
              <Swiper
                modules={[Navigation, Pagination, Autoplay]}
                navigation
                pagination={{ clickable: true }}
                autoplay={{
                  delay: 4000,
                  disableOnInteraction: false,
                }}
                loop={product.image.length > 1}
                className="w-full h-96 rounded-lg"
              >
                {product.image.map((image, index) => (
                  <SwiperSlide key={index}>
                    <Image
                      src={image}
                      alt={`${product.name} - ${index + 1}`}
                      className="w-full h-full object-cover"
                      radius="lg"
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>

            {/* Product Details */}
            <div className="flex flex-col gap-4">
              {/* Description */}
              {product.description && (
                <div>
                  <h4 className="font-semibold mb-2">Mô tả sản phẩm</h4>
                  <p className="text-gray-600">{product.description}</p>
                </div>
              )}

              {/* Material */}
              {product.material && (
                <div>
                  <h4 className="font-semibold mb-2">Chất liệu</h4>
                  <p className="text-gray-600">{product.material}</p>
                </div>
              )}

              <Divider />

              {/* Color Selection */}
              <div>
                <h4 className="font-semibold mb-3">Màu sắc</h4>
                <div className="flex gap-2 flex-wrap">
                  {product.colors.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => setSelectedColor(color.name)}
                      className={`relative w-12 h-12 rounded-full border-2 transition-all ${
                        selectedColor === color.name 
                          ? 'border-primary scale-110' 
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                      style={{ backgroundColor: color.color }}
                      title={color.name}
                    >
                      {selectedColor === color.name && (
                        <Icon 
                          icon="mdi:check" 
                          className="absolute inset-0 m-auto text-white drop-shadow-lg" 
                          width={20} 
                        />
                      )}
                    </button>
                  ))}
                </div>
                {selectedColorObj && (
                  <p className="text-sm text-gray-600 mt-2">
                    Đã chọn: {selectedColorObj.name}
                  </p>
                )}
              </div>

              {/* Size Selection */}
              <div>
                <h4 className="font-semibold mb-3">Kích cỡ</h4>
                <div className="flex gap-2 flex-wrap">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 border rounded-lg transition-all ${
                        selectedSize === size
                          ? 'border-primary bg-primary text-white'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity Selection */}
              <div>
                <h4 className="font-semibold mb-3">Số lượng</h4>
                <div className="flex items-center gap-3">
                  <Button
                    isIconOnly
                    variant="flat"
                    onPress={() => setQuantity(Math.max(1, quantity - 1))}
                    isDisabled={quantity <= 1}
                  >
                    <Icon icon="mdi:minus" />
                  </Button>
                  <span className="px-4 py-2 border rounded-lg min-w-16 text-center">
                    {quantity}
                  </span>
                  <Button
                    isIconOnly
                    variant="flat"
                    onPress={() => setQuantity(quantity + 1)}
                  >
                    <Icon icon="mdi:plus" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </ModalBody>

        <ModalFooter>
          <Button variant="light" onPress={onClose}>
            Đóng
          </Button>
          <Button 
            color="primary" 
            onPress={handleAddToCart}
            isLoading={isAddingToCart}
            isDisabled={!selectedSize || isAddingToCart}
            startContent={<Icon icon="mdi:cart-plus" />}
          >
            Thêm vào giỏ hàng
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
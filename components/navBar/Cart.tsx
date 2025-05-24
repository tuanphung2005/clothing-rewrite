'use client'

import { 
  Drawer, 
  DrawerContent, 
  DrawerHeader, 
  DrawerBody, 
  DrawerFooter 
} from "@heroui/drawer";
import { Button } from "@heroui/button";
import { useDisclosure } from "@heroui/use-disclosure";
import { Icon } from "@iconify/react";
import { FormatCurrency } from "@/models/FormatCurrency";
import { useCart } from "@/lib/cart-context";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";

export const Cart = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { user } = useAuth();
  const { cartItems, updateQuantity, removeFromCart, totalPrice, totalItems } = useCart();
  const router = useRouter();

  const handleUpdateQuantity = async (itemId: number, newQuantity: number) => {
    try {
      if (newQuantity <= 0) {
        await removeFromCart(itemId);
      } else {
        await updateQuantity(itemId, newQuantity);
      }
    } catch (error) {
      console.error('Failed to update quantity:', error);
    }
  };

  const handleRemoveItem = async (itemId: number) => {
    try {
      await removeFromCart(itemId);
    } catch (error) {
      console.error('Failed to remove item:', error);
    }
  };

  return (
    <>
      <Button 
        isIconOnly
        variant="light" 
        onPress={onOpen}
        className="relative overflow-visible"
        radius="none"
      >
        <Icon icon="mdi:cart" width={32} />
        {user && totalItems > 0 && (
          <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {totalItems}
          </span>
        )}
      </Button>
      
      <Drawer isOpen={isOpen} onOpenChange={onOpenChange} placement="right">
        <DrawerContent>
          {(onClose) => (
            <>
              <DrawerHeader className="flex flex-col gap-1 border-b">
                <div className="flex justify-between items-center">
                  <h4 className="text-lg font-semibold">Giỏ hàng của bạn</h4>
                  {user && (
                    <p className="text-sm text-gray-500">{cartItems.length} sản phẩm</p>
                  )}
                </div>
              </DrawerHeader>
              
              <DrawerBody>
                {!user ? (
                  <div className="flex flex-col items-center justify-center h-full">
                    <Icon icon="mdi:account-alert" width={64} className="text-gray-400 mb-4" />
                    <p className="text-gray-500 text-center">
                      Vui lòng đăng nhập để xem giỏ hàng của bạn
                    </p>
                    <Button className="mt-4" color="primary" variant="flat" onPress={onClose}>
                      Đăng nhập
                    </Button>
                  </div>
                ) : cartItems.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full">
                    <Icon icon="mdi:cart-outline" width={64} className="text-gray-400 mb-4" />
                    <p className="text-gray-500">Giỏ hàng của bạn đang trống</p>
                    <Button className="mt-4" color="primary" variant="flat" onPress={onClose}>
                      Tiếp tục mua sắm
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-4">
                    {cartItems.map(item => (
                      <div key={item.id} className="flex gap-4 border-b pb-4">
                        <img 
                          src={item.product.images[0]?.url || 'https://placehold.co/100x100/'} 
                          alt={item.product.name} 
                          className="w-20 h-20 object-cover"
                        />
                        <div className="flex-1">
                          <p className="font-medium">{item.product.name}</p>
                          <p className="text-primary font-semibold mt-1">
                            {FormatCurrency(item.product.salePrice || item.product.price)}
                          </p>
                          <div className="flex items-center mt-2">
                            <Button 
                              isIconOnly 
                              size="sm" 
                              variant="flat" 
                              onPress={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                            >
                              <Icon icon="mdi:minus" />
                            </Button>
                            <span className="mx-2 min-w-8 text-center">{item.quantity}</span>
                            <Button 
                              isIconOnly 
                              size="sm" 
                              variant="flat" 
                              onPress={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                            >
                              <Icon icon="mdi:plus" />
                            </Button>
                          </div>
                        </div>
                        <Button 
                          isIconOnly 
                          size="sm" 
                          variant="light" 
                          className="self-start"
                          onPress={() => handleRemoveItem(item.id)}
                        >
                          <Icon icon="mdi:delete-outline" width={20} />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </DrawerBody>
              
              {user && cartItems.length > 0 && (
                <DrawerFooter className="border-t pt-4">
                  <div className="w-full">
                    <div className="flex justify-between mb-4">
                      <span className="font-medium">Tổng cộng:</span>
                      <span className="font-bold text-lg">{FormatCurrency(totalPrice)}</span>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Button 
                        color="primary" 
                        className="w-full"
                        onPress={() => {
                          onClose();
                          router.push('/purchase');
                        }}
                      >
                        Tiến hành thanh toán
                      </Button>
                      <Button variant="flat" color="default" onPress={onClose} className="w-full">
                        Tiếp tục mua sắm
                      </Button>
                    </div>
                  </div>
                </DrawerFooter>
              )}
            </>
          )}
        </DrawerContent>
      </Drawer>
    </>
  );
};
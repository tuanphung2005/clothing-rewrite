'use client'

import { useState } from "react";
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

// Sample cart items - replace with your actual cart state management
const initialItems = [
  {
    id: 1,
    name: "Áo Thun Basic",
    price: 150000,
    quantity: 1,
    image: "https://placehold.co/100x100/"
  },
  {
    id: 2,
    name: "Quần Jean Nam",
    price: 450000,
    quantity: 2,
    image: "https://placehold.co/100x100/"
  }
];

export const Cart = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [cartItems, setCartItems] = useState(initialItems);

  // Calculate total price
  const totalPrice = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  // Update quantity
  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity <= 0) return;
    setCartItems(cartItems.map(item => 
      item.id === id ? {...item, quantity: newQuantity} : item
    ));
  };
  
  // Remove item
  const removeItem = (id: number) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  return (
    <>
      <Button 
        isIconOnly
        variant="light" 
        onPress={onOpen}
        className="relative overflow-visible "
        radius="none"
      >
        <Icon icon="mdi:cart" width={24} />
        {cartItems.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
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
                  <p className="text-sm text-gray-500">{cartItems.length} sản phẩm</p>
                </div>
              </DrawerHeader>
              
              <DrawerBody>
                {cartItems.length === 0 ? (
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
                          src={item.image} 
                          alt={item.name} 
                          className="w-20 h-20 object-cover"
                        />
                        <div className="flex-1">
                          <p className="font-medium">{item.name}</p>
                          <p className="text-primary font-semibold mt-1">
                            {FormatCurrency(item.price)}
                          </p>
                          <div className="flex items-center mt-2">
                            <Button 
                              isIconOnly 
                              size="sm" 
                              variant="flat" 
                              onPress={() => updateQuantity(item.id, item.quantity - 1)}
                            >
                              <Icon icon="mdi:minus" />
                            </Button>
                            <span className="mx-2 min-w-8 text-center">{item.quantity}</span>
                            <Button 
                              isIconOnly 
                              size="sm" 
                              variant="flat" 
                              onPress={() => updateQuantity(item.id, item.quantity + 1)}
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
                          onPress={() => removeItem(item.id)}
                        >
                          <Icon icon="mdi:delete-outline" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </DrawerBody>
              
              {cartItems.length > 0 && (
                <DrawerFooter className="border-t pt-4">
                  <div className="w-full">
                    <div className="flex justify-between mb-4">
                      <span className="font-medium">Tổng cộng:</span>
                      <span className="font-bold text-lg">{FormatCurrency(totalPrice)}</span>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Button color="primary" className="w-full">
                        Thanh toán
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
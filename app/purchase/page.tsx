// app/purchase/page.tsx
'use client'

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { RadioGroup, Radio } from "@heroui/radio";
import { Divider } from "@heroui/divider";
import { Icon } from "@iconify/react";
import { useCart } from "@/lib/cart-context";
import { useAuth } from "@/lib/auth-context";
import { FormatCurrency } from "@/models/FormatCurrency";
import { PaymentMethod, ShippingAddress, UserDetails, CheckoutData } from "@/types/purchase";

const paymentMethods: PaymentMethod[] = [
  {
    id: 'cod',
    name: 'Thanh toán khi nhận hàng',
    description: 'Thanh toán bằng tiền mặt khi nhận được hàng',
    icon: 'mdi:cash'
  },
  {
    id: 'online',
    name: 'Thanh toán trực tuyến',
    description: 'Thanh toán ngay qua thẻ tín dụng/ví điện tử',
    icon: 'mdi:credit-card'
  }
];

const vietnamProvinces = [
  'Hà Nội', 'TP. Hồ Chí Minh', 'Đà Nẵng', 'Hải Phòng', 'Cần Thơ',
  'An Giang', 'Bà Rịa - Vũng Tàu', 'Bắc Giang', 'Bắc Kạn', 'Bạc Liêu',
  // Add more provinces as needed
];

export default function PurchasePage() {
  const router = useRouter();
  const { user } = useAuth();
  const { cartItems, totalPrice, clearCart, setCartItems } = useCart();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderCompleted, setOrderCompleted] = useState(false); // Add this flag
  const [formData, setFormData] = useState({
    paymentMethod: 'cod',
    shippingAddress: {
      fullName: user?.name || '',
      street: '',
      city: '',
      state: '',
      postalCode: '',
      country: 'Vietnam',
      phone: '',
    },
    userDetails: {
      email: user?.email || '',
      birthDate: '',
      phone: '',
    },
  });

  // Redirect if cart is empty or user not logged in (but not if order just completed)
  useEffect(() => {
    if (!user) {
      router.push('/');
      return;
    }
    
    // Don't redirect if we just completed an order
    if (cartItems.length === 0 && !orderCompleted) {
      router.push('/');
      return;
    }
  }, [user, cartItems, router, orderCompleted]);

  // Calculate order summary
  const subtotal = totalPrice;
  const shipping = subtotal > 500000 ? 0 : 30000; // Free shipping over 500k VND
  const tax = subtotal * 0.1; // 10% VAT
  const total = subtotal + shipping + tax;

  const handleInputChange = (section: keyof typeof formData, field: string, value: string | boolean) => {
    if (section === 'paymentMethod') {
      setFormData(prev => ({
        ...prev,
        paymentMethod: value as string
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [section]: {
          ...(prev[section] as any),
          [field]: value
        }
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const orderData = {
        ...formData,
        items: cartItems,
        subtotal,
        shipping,
        tax,
        total,
      };

      console.log('Submitting order:', orderData);

      const response = await fetch('/api/orders/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });

      const result = await response.json();
      console.log('Response body:', result);

      if (!response.ok) {
        console.error('API Error Details:', {
          status: response.status,
          statusText: response.statusText,
          error: result
        });
        throw new Error(result.error || result.message || `Server error: ${response.status}`);
      }

      console.log('Order created successfully:', result);

      // Set order completed flag BEFORE clearing cart
      setOrderCompleted(true);
      
      // Clear cart both locally and on server
      console.log('Clearing cart after successful order...');
      await clearCart(); // This will clear both server and local state
      
      // Also clear local state as backup
      setCartItems([]);
      
      console.log('Cart cleared, items length:', cartItems.length);
      
      // Small delay to ensure state updates
      setTimeout(() => {
        console.log('About to redirect to:', `/purchase/success?orderId=${result.orderId}`);
        router.push(`/purchase/success?orderId=${result.orderId}`);
      }, 200); // Increased delay slightly
      
    } catch (error) {
      console.error('Order creation failed:', error);
      
      const errorMessage = error instanceof Error ? error.message : 'Lỗi không xác định';
      alert(`Không thể tạo đơn hàng: ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show loading state if order is completed but cart is empty
  if (orderCompleted && cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="text-center">
          <Icon icon="mdi:loading" className="animate-spin text-4xl text-primary mb-4" />
          <p>Đang chuyển hướng đến trang thành công...</p>
        </div>
      </div>
    );
  }

  if (!user || (cartItems.length === 0 && !orderCompleted)) {
    return null; // Will redirect
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Thanh toán đơn hàng</h1>
        <p className="text-gray-600 mt-2">Hoàn tất thông tin để đặt hàng</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Forms */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Payment Method Selection */}
            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <Icon icon="mdi:payment" width={24} />
                  Phương thức thanh toán
                </h2>
              </CardHeader>
              <CardBody>
                <RadioGroup
                  value={formData.paymentMethod}
                  onValueChange={(value) => {
                    console.log('Selected payment method:', value); // Debug log
                    setFormData(prev => ({
                      ...prev,
                      paymentMethod: value
                    }));
                  }}
                >
                  {paymentMethods.map((method) => (
                    <Radio key={method.id} value={method.id}>
                      <div className="flex items-center gap-3">
                        <Icon icon={method.icon} width={24} />
                        <div>
                          <p className="font-medium">{method.name}</p>
                          <p className="text-sm text-gray-600">{method.description}</p>
                        </div>
                      </div>
                    </Radio>
                  ))}
                </RadioGroup>
                
                {/* Debug display - remove this after testing */}
                <p className="mt-2 text-sm text-gray-500">
                  selection: {formData.paymentMethod}
                </p>
              </CardBody>
            </Card>

            {/* Shipping Address */}
            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <Icon icon="mdi:map-marker" width={24} />
                  Địa chỉ giao hàng
                </h2>
              </CardHeader>
              <CardBody className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Họ và tên"
                    value={formData.shippingAddress.fullName}
                    onChange={(e) => handleInputChange('shippingAddress', 'fullName', e.target.value)}
                    isRequired
                  />
                  <Input
                    label="Số điện thoại"
                    value={formData.shippingAddress.phone}
                    onChange={(e) => handleInputChange('shippingAddress', 'phone', e.target.value)}
                    isRequired
                  />
                </div>
                
                <Input
                  label="Địa chỉ chi tiết"
                  placeholder="Số nhà, tên đường, phường/xã"
                  value={formData.shippingAddress.street}
                  onChange={(e) => handleInputChange('shippingAddress', 'street', e.target.value)}
                  isRequired
                />
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Select
                    label="Tỉnh/Thành phố"
                    selectedKeys={formData.shippingAddress.state ? [formData.shippingAddress.state] : []}
                    onSelectionChange={(keys) => {
                      const value = Array.from(keys)[0] as string;
                      handleInputChange('shippingAddress', 'state', value);
                    }}
                  >
                    {vietnamProvinces.map((province) => (
                      <SelectItem key={province}>{province}</SelectItem>
                    ))}
                  </Select>
                  
                  <Input
                    label="Quận/Huyện"
                    value={formData.shippingAddress.city}
                    onChange={(e) => handleInputChange('shippingAddress', 'city', e.target.value)}
                    isRequired
                  />
                  
                  <Input
                    label="Mã bưu điện"
                    value={formData.shippingAddress.postalCode}
                    onChange={(e) => handleInputChange('shippingAddress', 'postalCode', e.target.value)}
                  />
                </div>
              </CardBody>
            </Card>

            {/* User Details */}
            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <Icon icon="mdi:account" width={24} />
                  Thông tin cá nhân
                </h2>
              </CardHeader>
              <CardBody className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Email"
                    type="email"
                    value={formData.userDetails.email}
                    onChange={(e) => handleInputChange('userDetails', 'email', e.target.value)}
                    isRequired
                    isDisabled={!!user.email}
                  />
                  <Input
                    label="Ngày sinh"
                    type="date"
                    value={formData.userDetails.birthDate}
                    onChange={(e) => handleInputChange('userDetails', 'birthDate', e.target.value)}
                  />
                </div>
              </CardBody>
            </Card>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <h2 className="text-xl font-semibold">Tóm tắt đơn hàng</h2>
              </CardHeader>
              <CardBody className="space-y-4">
                {/* Order Items */}
                <div className="space-y-3">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex gap-3">
                      <img
                        src={item.product.images[0]?.url || 'https://placehold.co/60x60/'}
                        alt={item.product.name}
                        className="w-15 h-15 object-cover rounded"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-sm">{item.product.name}</p>
                        <p className="text-sm text-gray-600">Số lượng: {item.quantity}</p>
                        <p className="text-sm font-semibold text-primary">
                          {FormatCurrency(item.product.salePrice || item.product.price)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <Divider />

                {/* Price Breakdown */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Tạm tính:</span>
                    <span>{FormatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Phí vận chuyển:</span>
                    <span className={shipping === 0 ? 'text-green-600' : ''}>
                      {shipping === 0 ? 'Miễn phí' : FormatCurrency(shipping)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>VAT (10%):</span>
                    <span>{FormatCurrency(tax)}</span>
                  </div>
                  <Divider />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Tổng cộng:</span>
                    <span className="text-primary">{FormatCurrency(total)}</span>
                  </div>
                </div>

                {/* Place Order Button */}
                <Button
                  type="submit"
                  color="primary"
                  size="lg"
                  className="w-full"
                  isLoading={isSubmitting}
                  startContent={<Icon icon="mdi:shopping" />}
                >
                  {formData.paymentMethod === 'cod' ? 'Đặt hàng' : 'Thanh toán ngay'}
                </Button>

                {/* Security Notice */}
                <div className="text-center text-sm text-gray-600 mt-4">
                  <Icon icon="mdi:shield-check" className="inline mr-1" />
                  Thông tin của bạn được bảo mật an toàn
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}
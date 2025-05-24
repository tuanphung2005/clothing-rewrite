// app/purchase/success/page.tsx
'use client'

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { Divider } from "@heroui/divider";
import { Icon } from "@iconify/react";
import { useAuth } from "@/lib/auth-context";
import { FormatCurrency } from "@/models/FormatCurrency";

interface OrderDetails {
  id: number;
  status: string;
  totalAmount: number;
  paymentMethod: string;
  createdAt: string;
  address: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  cart: {
    items: Array<{
      id: number;
      quantity: number;
      product: {
        id: number;
        name: string;
        price: number;
        salePrice?: number;
        images: Array<{ url: string }>;
      };
    }>;
  };
}

export default function PurchaseSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const orderId = searchParams.get('orderId');

  useEffect(() => {

    if (!orderId) {
      console.error('Order ID not found in URL');
      router.push('/');
      return;
    }

    fetchOrderDetails();
  }, [user, orderId, router]);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/orders/${orderId}`);
      
      if (!response.ok) {
        throw new Error('Không thể tải thông tin đơn hàng');
      }

      const order = await response.json();
      setOrderDetails(order);
    } catch (error) {
      console.error('Error fetching order details:', error);
      setError(error instanceof Error ? error.message : 'Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'warning';
      case 'PAID': return 'success';
      case 'SHIPPED': return 'primary';
      case 'DELIVERED': return 'success';
      case 'CANCELLED': return 'danger';
      default: return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'PENDING': return 'Đang xử lý';
      case 'PAID': return 'Đã thanh toán';
      case 'SHIPPED': return 'Đang giao hàng';
      case 'DELIVERED': return 'Đã giao hàng';
      case 'CANCELLED': return 'Đã hủy';
      default: return status;
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <Icon icon="mdi:loading" className="animate-spin text-4xl text-primary mb-4" />
            <p>Đang tải thông tin đơn hàng...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !orderDetails) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card className="text-center py-12">
          <CardBody>
            <Icon icon="mdi:alert-circle" className="text-6xl text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-red-600 mb-2">Có lỗi xảy ra</h1>
            <p className="text-gray-600 mb-6">{error || 'Không thể tải thông tin đơn hàng'}</p>
            <div className="flex gap-4 justify-center">
              <Button color="primary" onPress={() => router.push('/')}>
                Về trang chủ
              </Button>
              <Button variant="flat" onPress={() => router.push('/account')}>
                Xem đơn hàng
              </Button>
            </div>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Success Header */}
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Icon icon="mdi:check-circle" className="text-4xl text-green-600" />
        </div>
        <h1 className="text-3xl font-bold text-green-600 mb-2">Đặt hàng thành công!</h1>
        <p className="text-gray-600">Cảm ơn bạn đã mua sắm tại GIOHOA</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Summary */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Info */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start w-full">
                <div>
                  <h2 className="text-xl font-semibold">Đơn hàng #{orderDetails.id}</h2>
                  <p className="text-sm text-gray-600">
                    Đặt ngày {new Date(orderDetails.createdAt).toLocaleDateString('vi-VN', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
                <Chip color={getStatusColor(orderDetails.status)} variant="flat">
                  {getStatusText(orderDetails.status)}
                </Chip>
              </div>
            </CardHeader>
            <CardBody>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <Icon icon="mdi:map-marker" width={20} />
                    Địa chỉ giao hàng
                  </h3>
                  <div className="text-sm text-gray-600">
                    <p>{orderDetails.address.street}</p>
                    <p>{orderDetails.address.city}, {orderDetails.address.state}</p>
                    <p>{orderDetails.address.postalCode}</p>
                    <p>{orderDetails.address.country}</p>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <Icon icon="mdi:credit-card" width={20} />
                    Phương thức thanh toán
                  </h3>
                  <p className="text-sm text-gray-600">
                    {orderDetails.paymentMethod === 'cod' 
                      ? 'Thanh toán khi nhận hàng' 
                      : 'Thanh toán trực tuyến'}
                  </p>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Order Items */}
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold">Sản phẩm đã đặt</h2>
            </CardHeader>
            <CardBody>
              <div className="space-y-4">
                {orderDetails.cart.items.map((item) => (
                  <div key={item.id} className="flex gap-4 pb-4 border-b border-gray-100 last:border-b-0">
                    <img
                      src={item.product.images[0]?.url || 'https://placehold.co/80x80/'}
                      alt={item.product.name}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium">{item.product.name}</h4>
                      <p className="text-sm text-gray-600">Số lượng: {item.quantity}</p>
                      <p className="text-primary font-semibold mt-1">
                        {FormatCurrency(item.product.salePrice || item.product.price)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">
                        {FormatCurrency((item.product.salePrice || item.product.price) * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Order Total & Actions */}
        <div className="lg:col-span-1">
          <Card className="sticky top-4">
            <CardHeader>
              <h2 className="text-xl font-semibold">Tổng đơn hàng</h2>
            </CardHeader>
            <CardBody className="space-y-4">
              <div className="flex justify-between text-lg font-bold">
                <span>Tổng cộng:</span>
                <span className="text-primary">{FormatCurrency(orderDetails.totalAmount)}</span>
              </div>

              <Divider />

              <div className="space-y-3">
                <Button 
                  color="primary" 
                  className="w-full"
                  onPress={() => router.push('/account')}
                  startContent={<Icon icon="mdi:account" />}
                >
                  Xem tài khoản
                </Button>
                <Button 
                  variant="flat" 
                  className="w-full"
                  onPress={() => router.push('/')}
                  startContent={<Icon icon="mdi:home" />}
                >
                  Tiếp tục mua sắm
                </Button>
              </div>

              {/* Estimated Delivery */}
              {orderDetails.status === 'PENDING' && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 text-blue-700 mb-2">
                    <Icon icon="mdi:truck-delivery" width={20} />
                    <span className="font-semibold">Thời gian giao hàng dự kiến</span>
                  </div>
                  <p className="text-sm text-blue-600">
                    {orderDetails.paymentMethod === 'cod' ? '3-5 ngày làm việc' : '2-4 ngày làm việc'}
                  </p>
                </div>
              )}

              {/* Customer Support */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 text-gray-700 mb-2">
                  <Icon icon="mdi:headset" width={20} />
                  <span className="font-semibold">Cần hỗ trợ?</span>
                </div>
                <p className="text-sm text-gray-600 mb-2">
                  Liên hệ với chúng tôi nếu bạn có bất kỳ câu hỏi nào về đơn hàng
                </p>
                <Button size="sm" variant="flat" className="w-full">
                  <Icon icon="mdi:phone" className="mr-2" />
                  Hotline: 1900-xxxx
                </Button>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
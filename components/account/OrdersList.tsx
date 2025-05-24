// components/account/OrdersList.tsx
'use client'

import { useState } from 'react';
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { Icon } from "@iconify/react";
import { useDisclosure } from "@heroui/use-disclosure";
import { FormatCurrency } from "@/models/FormatCurrency";
import { Order } from "@/types/account";
import { OrderDetailModal } from "./OrderDetailModal";

interface OrdersListProps {
  orders: Order[];
  loading?: boolean;
}

export const OrdersList = ({ orders, loading = false }: OrdersListProps) => {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'warning';
      case 'PAID': return 'primary';
      case 'SHIPPED': return 'secondary';
      case 'DELIVERED': return 'success';
      case 'CANCELLED': return 'danger';
      default: return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'PENDING': return 'Chờ xử lý';
      case 'PAID': return 'Đã thanh toán';
      case 'SHIPPED': return 'Đang giao';
      case 'DELIVERED': return 'Đã giao';
      case 'CANCELLED': return 'Đã hủy';
      default: return status;
    }
  };

  const handleOrderClick = (order: Order) => {
    setSelectedOrder(order);
    onOpen();
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <Card key={index} className="animate-pulse">
            <CardBody className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="h-6 bg-gray-200 rounded w-32"></div>
                <div className="h-6 bg-gray-200 rounded w-20"></div>
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <Card>
        <CardBody className="text-center py-12">
          <Icon icon="mdi:package-variant-closed" width={64} className="text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">Chưa có đơn hàng nào</h3>
          <p className="text-gray-500 mb-4">Bạn chưa có đơn hàng nào. Hãy bắt đầu mua sắm ngay!</p>
          <Button color="primary" href="/">
            Tiếp tục mua sắm
          </Button>
        </CardBody>
      </Card>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {orders.map((order) => (
          <Card key={order.id} className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardBody className="p-6" onClick={() => handleOrderClick(order)}>
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-semibold">Đơn hàng #{order.id}</h3>
                  <Chip color={getStatusColor(order.status)} variant="flat" size="sm">
                    {getStatusText(order.status)}
                  </Chip>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-primary">
                    {FormatCurrency(order.totalAmount)}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Icon icon="mdi:map-marker" width={16} className="text-gray-400" />
                    <span className="text-sm text-gray-600">
                      {order.address.city}, {order.address.state}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Icon icon="mdi:credit-card" width={16} className="text-gray-400" />
                    <span className="text-sm text-gray-600">
                      {order.paymentMethod === 'cod' ? 'COD' : 'Online'}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <span>{order.cart.items.length} sản phẩm</span>
                  <Icon icon="mdi:chevron-right" width={16} />
                </div>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      {selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          isOpen={isOpen}
          onClose={onClose}
        />
      )}
    </>
  );
};
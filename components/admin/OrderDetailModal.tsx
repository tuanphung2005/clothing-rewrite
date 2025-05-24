// components/admin/OrderDetailModal.tsx
'use client'

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Select, SelectItem } from "@heroui/select";
import { Divider } from "@heroui/divider";
import { Icon } from "@iconify/react";
import { useState } from "react";
import { FormatCurrency } from "@/models/FormatCurrency";

interface OrderItem {
  id: number;
  quantity: number;
  product: {
    id: number;
    name: string;
    price: number;
    salePrice?: number;
    images: Array<{ url: string }>;
  };
}

interface Order {
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
    user: {
      id: number;
      name?: string;
      email: string;
    };
    items: OrderItem[];
  };
}

interface OrderDetailModalProps {
  order: Order;
  isOpen: boolean;
  onClose: () => void;
  onStatusUpdate: (orderId: number, newStatus: string) => Promise<void>;
}

export const OrderDetailModal = ({ 
  order, 
  isOpen, 
  onClose, 
  onStatusUpdate 
}: OrderDetailModalProps) => {
  const [isUpdating, setIsUpdating] = useState(false);

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

  const handleStatusUpdate = async (newStatus: string) => {
    if (newStatus === order.status) return;
    
    setIsUpdating(true);
    try {
      await onStatusUpdate(order.id, newStatus);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      size="4xl"
      scrollBehavior="inside"
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <div className="flex items-center justify-between w-full">
            <h2 className="text-xl font-semibold">
              Chi tiết đơn hàng #{order.id}
            </h2>
            <Chip
              color={getStatusColor(order.status)}
              variant="flat"
            >
              {getStatusText(order.status)}
            </Chip>
          </div>
          <p className="text-sm text-gray-600">
            Đặt hàng lúc {new Date(order.createdAt).toLocaleString('vi-VN')}
          </p>
        </ModalHeader>

        <ModalBody>
          <div className="space-y-6">
            {/* Customer Info */}
            <Card>
              <CardBody>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Icon icon="mdi:account" width={20} />
                  Thông tin khách hàng
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Tên khách hàng</p>
                    <p className="font-medium">
                      {order.cart.user.name || 'Không có tên'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium">{order.cart.user.email}</p>
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* Shipping Address */}
            <Card>
              <CardBody>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Icon icon="mdi:map-marker" width={20} />
                  Địa chỉ giao hàng
                </h3>
                <div className="text-sm">
                  <p>{order.address.street}</p>
                  <p>{order.address.city}, {order.address.state}</p>
                  <p>{order.address.postalCode}</p>
                  <p>{order.address.country}</p>
                </div>
              </CardBody>
            </Card>

            {/* Order Items */}
            <Card>
              <CardBody>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Icon icon="mdi:package-variant" width={20} />
                  Sản phẩm đặt hàng ({order.cart.items.length} sản phẩm)
                </h3>
                <div className="space-y-4">
                  {order.cart.items.map((item) => (
                    <div key={item.id} className="flex gap-4 p-3 border border-gray-200 rounded-lg">
                      <img
                        src={item.product.images[0]?.url || 'https://placehold.co/60x60/'}
                        alt={item.product.name}
                        className="w-15 h-15 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium">{item.product.name}</h4>
                        <p className="text-sm text-gray-600">Số lượng: {item.quantity}</p>
                        <p className="text-sm text-primary font-semibold">
                          {FormatCurrency(item.product.salePrice || item.product.price)} x {item.quantity}
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

                <Divider className="my-4" />

                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-600">Phương thức thanh toán</p>
                    <p className="font-medium">
                      {order.paymentMethod === 'cod' 
                        ? 'Thanh toán khi nhận hàng' 
                        : 'Thanh toán trực tuyến'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Tổng cộng</p>
                    <p className="text-xl font-bold text-primary">
                      {FormatCurrency(order.totalAmount)}
                    </p>
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* Status Update */}
            {order.status !== 'DELIVERED' && order.status !== 'CANCELLED' && (
              <Card>
                <CardBody>
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Icon icon="mdi:update" width={20} />
                    Cập nhật trạng thái
                  </h3>
                  <Select
                    placeholder="Chọn trạng thái mới"
                    selectedKeys={[order.status]}
                    onSelectionChange={(keys) => {
                      const newStatus = Array.from(keys)[0] as string;
                      if (newStatus && newStatus !== order.status) {
                        handleStatusUpdate(newStatus);
                      }
                    }}
                    isDisabled={isUpdating}
                  >
                    <SelectItem key="PENDING" value="PENDING">Chờ xử lý</SelectItem>
                    <SelectItem key="PAID" value="PAID">Đã thanh toán</SelectItem>
                    <SelectItem key="SHIPPED" value="SHIPPED">Đang giao</SelectItem>
                    <SelectItem key="DELIVERED" value="DELIVERED">Đã giao</SelectItem>
                    <SelectItem key="CANCELLED" value="CANCELLED">Đã hủy</SelectItem>
                  </Select>
                </CardBody>
              </Card>
            )}
          </div>
        </ModalBody>

        <ModalFooter>
          <Button variant="light" onPress={onClose}>
            Đóng
          </Button>
          {order.status !== 'DELIVERED' && order.status !== 'CANCELLED' && (
            <Button
              color="primary"
              startContent={<Icon icon="mdi:printer" />}
              onPress={() => window.print()}
            >
              In đơn hàng
            </Button>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
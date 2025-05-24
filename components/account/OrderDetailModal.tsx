// components/account/OrderDetailModal.tsx
'use client'

import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@heroui/modal";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { Divider } from "@heroui/divider";
import { Icon } from "@iconify/react";
import { FormatCurrency } from "@/models/FormatCurrency";
import { Order } from "@/types/account";

interface OrderDetailModalProps {
  order: Order;
  isOpen: boolean;
  onClose: () => void;
}

export const OrderDetailModal = ({ order, isOpen, onClose }: OrderDetailModalProps) => {
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

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      size="2xl" 
      scrollBehavior="inside"
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <div className="flex items-center justify-between w-full">
            <h3 className="text-xl font-bold">Chi tiết đơn hàng #{order.id}</h3>
            <Chip color={getStatusColor(order.status)} variant="flat">
              {getStatusText(order.status)}
            </Chip>
          </div>
          <p className="text-sm text-gray-500">
            Đặt ngày {new Date(order.createdAt).toLocaleDateString('vi-VN')}
          </p>
        </ModalHeader>

        <ModalBody>
          <div className="space-y-6">
            {/* Order Items */}
            <div>
              <h4 className="font-semibold mb-3">Sản phẩm đã đặt</h4>
              <div className="space-y-3">
                {order.cart.items.map((item) => (
                  <div key={item.id} className="flex gap-4 p-3 border rounded-lg">
                    <img
                      src={item.product.images[0]?.url || 'https://placehold.co/80x80/'}
                      alt={item.product.name}
                      className="w-20 h-20 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h5 className="font-medium">{item.product.name}</h5>
                      <p className="text-sm text-gray-600">Số lượng: {item.quantity}</p>
                      <p className="text-primary font-semibold">
                        {FormatCurrency(item.product.salePrice || item.product.price)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Divider />

            {/* Shipping Address */}
            <div>
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <Icon icon="mdi:map-marker" width={20} />
                Địa chỉ giao hàng
              </h4>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="font-medium">{order.address.street}</p>
                <p className="text-gray-600">
                  {order.address.city}, {order.address.state} {order.address.postalCode}
                </p>
                <p className="text-gray-600">{order.address.country}</p>
              </div>
            </div>

            <Divider />

            {/* Payment Info */}
            <div>
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <Icon icon="mdi:credit-card" width={20} />
                Thông tin thanh toán
              </h4>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span>Phương thức:</span>
                  <span className="font-medium">
                    {order.paymentMethod === 'cod' ? 'Thanh toán khi nhận hàng' : 'Thanh toán trực tuyến'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Tổng tiền:</span>
                  <span className="text-lg font-bold text-primary">
                    {FormatCurrency(order.totalAmount)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </ModalBody>

        <ModalFooter>
          <Button variant="light" onPress={onClose}>
            Đóng
          </Button>
          {order.status === 'PENDING' && (
            <Button color="danger" variant="flat">
              Hủy đơn hàng
            </Button>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
// components/admin/CustomerDetailModal.tsx
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
import { Card, CardBody } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Divider } from "@heroui/divider";
import { Icon } from "@iconify/react";
import { FormatCurrency } from "@/models/FormatCurrency";

interface Customer {
  id: number;
  email: string;
  name?: string;
  role: string;
  createdAt: string;
}

interface CustomerDetails extends Customer {
  addresses: Array<{
    id: number;
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    isDefault: boolean;
  }>;
  carts: Array<{
    order: {
      id: number;
      status: string;
      totalAmount: number;
      paymentMethod: string;
      createdAt: string;
      address: {
        street: string;
        city: string;
        state: string;
      };
    };
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
  }>;
  stats: {
    totalOrders: number;
    totalSpent: number;
    pendingOrders: number;
    completedOrders: number;
  };
}

interface CustomerDetailModalProps {
  customer: Customer;
  isOpen: boolean;
  onClose: () => void;
}

export const CustomerDetailModal = ({
  customer,
  isOpen,
  onClose,
}: CustomerDetailModalProps) => {
  const [customerDetails, setCustomerDetails] = useState<CustomerDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen && customer) {
      fetchCustomerDetails();
    }
  }, [isOpen, customer]);

  const fetchCustomerDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/customers/${customer.id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch customer details');
      }
      const data = await response.json();
      setCustomerDetails(data);
    } catch (error) {
      console.error('Error fetching customer details:', error);
    } finally {
      setLoading(false);
    }
  };

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
      size="5xl"
      scrollBehavior="inside"
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <h2 className="text-xl font-semibold">
            Chi tiết khách hàng: {customer.name || customer.email}
          </h2>
          <p className="text-sm text-gray-600">
            ID: {customer.id} • Tham gia từ {new Date(customer.createdAt).toLocaleDateString('vi-VN')}
          </p>
        </ModalHeader>

        <ModalBody>
          {loading ? (
            <div className="text-center py-8">
              <Icon icon="mdi:loading" className="animate-spin text-4xl text-primary mb-4" />
              <p>Đang tải thông tin khách hàng...</p>
            </div>
          ) : customerDetails ? (
            <div className="space-y-6">
              {/* Customer Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardBody className="text-center p-4">
                    <div className="text-2xl font-bold text-blue-600">
                      {customerDetails.stats.totalOrders}
                    </div>
                    <div className="text-sm text-gray-600">Tổng đơn hàng</div>
                  </CardBody>
                </Card>
                <Card>
                  <CardBody className="text-center p-4">
                    <div className="text-2xl font-bold text-green-600">
                      {FormatCurrency(customerDetails.stats.totalSpent)}
                    </div>
                    <div className="text-sm text-gray-600">Tổng chi tiêu</div>
                  </CardBody>
                </Card>
                <Card>
                  <CardBody className="text-center p-4">
                    <div className="text-2xl font-bold text-orange-600">
                      {customerDetails.stats.pendingOrders}
                    </div>
                    <div className="text-sm text-gray-600">Đang xử lý</div>
                  </CardBody>
                </Card>
                <Card>
                  <CardBody className="text-center p-4">
                    <div className="text-2xl font-bold text-emerald-600">
                      {customerDetails.stats.completedOrders}
                    </div>
                    <div className="text-sm text-gray-600">Hoàn thành</div>
                  </CardBody>
                </Card>
              </div>

              {/* Customer Info */}
              <Card>
                <CardBody>
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Icon icon="mdi:account" width={20} />
                    Thông tin cá nhân
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Tên</p>
                      <p className="font-medium">{customerDetails.name || 'Chưa cập nhật'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="font-medium">{customerDetails.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Vai trò</p>
                      <p className="font-medium">{customerDetails.role}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Ngày tham gia</p>
                      <p className="font-medium">
                        {new Date(customerDetails.createdAt).toLocaleDateString('vi-VN')}
                      </p>
                    </div>
                  </div>
                </CardBody>
              </Card>

              {/* Addresses */}
              {customerDetails.addresses.length > 0 && (
                <Card>
                  <CardBody>
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <Icon icon="mdi:map-marker" width={20} />
                      Địa chỉ ({customerDetails.addresses.length})
                    </h3>
                    <div className="space-y-3">
                      {customerDetails.addresses.map((address) => (
                        <div key={address.id} className="p-3 border rounded-lg">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium">{address.street}</p>
                              <p className="text-sm text-gray-600">
                                {address.city}, {address.state} {address.postalCode}
                              </p>
                              <p className="text-sm text-gray-600">{address.country}</p>
                            </div>
                            {address.isDefault && (
                              <Chip size="sm" color="primary" variant="flat">
                                Mặc định
                              </Chip>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardBody>
                </Card>
              )}

              {/* Recent Orders */}
              <Card>
                <CardBody>
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Icon icon="mdi:package-variant" width={20} />
                    Đơn hàng gần đây ({customerDetails.carts.length})
                  </h3>
                  {customerDetails.carts.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">Chưa có đơn hàng nào</p>
                  ) : (
                    <div className="space-y-4">
                      {customerDetails.carts.map((cart) => (
                        <div key={cart.order.id} className="p-4 border rounded-lg">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h4 className="font-medium">Đơn hàng #{cart.order.id}</h4>
                              <p className="text-sm text-gray-600">
                                {new Date(cart.order.createdAt).toLocaleDateString('vi-VN')}
                              </p>
                            </div>
                            <div className="text-right">
                              <Chip
                                color={getStatusColor(cart.order.status)}
                                variant="flat"
                                size="sm"
                              >
                                {getStatusText(cart.order.status)}
                              </Chip>
                              <p className="font-semibold mt-1">
                                {FormatCurrency(cart.order.totalAmount)}
                              </p>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="text-gray-600">Địa chỉ giao hàng:</p>
                              <p>{cart.order.address.street}</p>
                              <p>{cart.order.address.city}, {cart.order.address.state}</p>
                            </div>
                            <div>
                              <p className="text-gray-600">Phương thức thanh toán:</p>
                              <p>
                                {cart.order.paymentMethod === 'cod' 
                                  ? 'Thanh toán khi nhận hàng' 
                                  : 'Thanh toán trực tuyến'}
                              </p>
                            </div>
                          </div>

                          <Divider className="my-3" />

                          <div className="space-y-2">
                            <p className="text-sm font-medium">Sản phẩm:</p>
                            {cart.items.map((item) => (
                              <div key={item.id} className="flex gap-3 text-sm">
                                <img
                                  src={item.product.images[0]?.url || 'https://placehold.co/40x40/'}
                                  alt={item.product.name}
                                  className="w-10 h-10 object-cover rounded"
                                />
                                <div className="flex-1">
                                  <p className="font-medium">{item.product.name}</p>
                                  <p className="text-gray-600">
                                    {FormatCurrency(item.product.salePrice || item.product.price)} x {item.quantity}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardBody>
              </Card>
            </div>
          ) : (
            <div className="text-center py-8">
              <Icon icon="mdi:alert-circle" className="text-4xl text-red-500 mb-4" />
              <p>Không thể tải thông tin khách hàng</p>
            </div>
          )}
        </ModalBody>

        <ModalFooter>
          <Button variant="light" onPress={onClose}>
            Đóng
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
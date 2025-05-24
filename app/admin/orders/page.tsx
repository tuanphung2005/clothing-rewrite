// app/admin/orders/page.tsx
'use client'

import { useState, useEffect } from 'react';
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { Chip } from "@heroui/chip";
import { Pagination } from "@heroui/pagination";
import { Icon } from "@iconify/react";
import { useDisclosure } from "@heroui/use-disclosure";
import { FormatCurrency } from "@/models/FormatCurrency";
import { OrderDetailModal } from "@/components/admin/OrderDetailModal";

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

interface OrdersResponse {
  orders: Order[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [filters, setFilters] = useState({
    status: 'all',
    search: '',
    page: 1,
    limit: 10,
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });

  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    fetchOrders();
  }, [filters]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        page: filters.page.toString(),
        limit: filters.limit.toString(),
      });

      if (filters.status !== 'all') {
        queryParams.append('status', filters.status);
      }

      if (filters.search) {
        queryParams.append('search', filters.search);
      }

      const response = await fetch(`/api/admin/orders?${queryParams}`);
      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }

      const data: OrdersResponse = await response.json();
      setOrders(data.orders);
      setPagination(data.pagination);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId: number, newStatus: string) => {
    try {
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Failed to update order status');
      }

      // Refresh orders
      fetchOrders();
      
      // Update selected order if it's open
      if (selectedOrder?.id === orderId) {
        const updatedOrder = await response.json();
        setSelectedOrder(updatedOrder);
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Có lỗi xảy ra khi cập nhật trạng thái đơn hàng');
    }
  };

  const openOrderDetail = (order: Order) => {
    setSelectedOrder(order);
    onOpen();
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Quản lý đơn hàng</h1>
          <p className="text-gray-600 mt-1">
            Quản lý và theo dõi tất cả đơn hàng
          </p>
        </div>
        <Button
          color="primary"
          startContent={<Icon icon="mdi:refresh" />}
          onPress={() => fetchOrders()}
        >
          Làm mới
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardBody>
          <div className="flex flex-col md:flex-row gap-4">
            <Input
              placeholder="Tìm kiếm theo ID, tên hoặc email khách hàng..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}
              startContent={<Icon icon="mdi:magnify" />}
              className="flex-1"
            />
            <Select
              placeholder="Trạng thái"
              selectedKeys={[filters.status]}
              onSelectionChange={(keys) => {
                const status = Array.from(keys)[0] as string;
                setFilters({ ...filters, status, page: 1 });
              }}
              className="w-full md:w-48"
            >
              <SelectItem key="all" value="all">Tất cả</SelectItem>
              <SelectItem key="PENDING" value="PENDING">Chờ xử lý</SelectItem>
              <SelectItem key="PAID" value="PAID">Đã thanh toán</SelectItem>
              <SelectItem key="SHIPPED" value="SHIPPED">Đang giao</SelectItem>
              <SelectItem key="DELIVERED" value="DELIVERED">Đã giao</SelectItem>
              <SelectItem key="CANCELLED" value="CANCELLED">Đã hủy</SelectItem>
            </Select>
            <Select
              placeholder="Số lượng/trang"
              selectedKeys={[filters.limit.toString()]}
              onSelectionChange={(keys) => {
                const limit = parseInt(Array.from(keys)[0] as string);
                setFilters({ ...filters, limit, page: 1 });
              }}
              className="w-full md:w-32"
            >
              <SelectItem key="10" value="10">10</SelectItem>
              <SelectItem key="25" value="25">25</SelectItem>
              <SelectItem key="50" value="50">50</SelectItem>
            </Select>
          </div>
        </CardBody>
      </Card>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center w-full">
            <h2 className="text-xl font-semibold">
              Danh sách đơn hàng ({pagination.total})
            </h2>
          </div>
        </CardHeader>
        <CardBody className="p-0">
          {loading ? (
            <div className="p-8 text-center">
              <Icon icon="mdi:loading" className="animate-spin text-4xl text-primary mb-4" />
              <p>Đang tải đơn hàng...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="p-8 text-center">
              <Icon icon="mdi:package-variant-closed" className="text-6xl text-gray-400 mb-4" />
              <p className="text-gray-500">Không tìm thấy đơn hàng nào</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left p-4 font-semibold">ID</th>
                    <th className="text-left p-4 font-semibold">Khách hàng</th>
                    <th className="text-left p-4 font-semibold">Sản phẩm</th>
                    <th className="text-left p-4 font-semibold">Tổng tiền</th>
                    <th className="text-left p-4 font-semibold">Trạng thái</th>
                    <th className="text-left p-4 font-semibold">Ngày đặt</th>
                    <th className="text-left p-4 font-semibold">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id} className="border-b hover:bg-gray-50">
                      <td className="p-4 font-mono">#{order.id}</td>
                      <td className="p-4">
                        <div>
                          <p className="font-medium">
                            {order.cart.user.name || 'Không có tên'}
                          </p>
                          <p className="text-sm text-gray-600">{order.cart.user.email}</p>
                        </div>
                      </td>
                      <td className="p-4">
                        <p className="text-sm">{order.cart.items.length} sản phẩm</p>
                      </td>
                      <td className="p-4">
                        <p className="font-semibold">{FormatCurrency(order.totalAmount)}</p>
                        <p className="text-sm text-gray-600">
                          {order.paymentMethod === 'cod' ? 'COD' : 'Online'}
                        </p>
                      </td>
                      <td className="p-4">
                        <Chip
                          color={getStatusColor(order.status)}
                          variant="flat"
                          size="sm"
                        >
                          {getStatusText(order.status)}
                        </Chip>
                      </td>
                      <td className="p-4">
                        <p className="text-sm">
                          {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(order.createdAt).toLocaleTimeString('vi-VN')}
                        </p>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="flat"
                            onPress={() => openOrderDetail(order)}
                            startContent={<Icon icon="mdi:eye" />}
                          >
                            Xem
                          </Button>
                          {order.status !== 'DELIVERED' && order.status !== 'CANCELLED' && (
                            <Select
                              size="sm"
                              placeholder="Cập nhật"
                              className="w-32"
                              onSelectionChange={(keys) => {
                                const newStatus = Array.from(keys)[0] as string;
                                if (newStatus && newStatus !== order.status) {
                                  handleStatusUpdate(order.id, newStatus);
                                }
                              }}
                            >
                              <SelectItem key="PENDING" value="PENDING">Chờ xử lý</SelectItem>
                              <SelectItem key="PAID" value="PAID">Đã thanh toán</SelectItem>
                              <SelectItem key="SHIPPED" value="SHIPPED">Đang giao</SelectItem>
                              <SelectItem key="DELIVERED" value="DELIVERED">Đã giao</SelectItem>
                              <SelectItem key="CANCELLED" value="CANCELLED">Đã hủy</SelectItem>
                            </Select>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardBody>
      </Card>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination
            page={pagination.page}
            total={pagination.totalPages}
            onChange={(page) => setFilters({ ...filters, page })}
            showControls
          />
        </div>
      )}

      {/* Order Detail Modal */}
      {selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          isOpen={isOpen}
          onClose={onClose}
          onStatusUpdate={handleStatusUpdate}
        />
      )}
    </div>
  );
}
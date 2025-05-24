// app/admin/customers/page.tsx
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
import { CustomerDetailModal } from "@/components/admin/CustomerDetailModal";
import { CustomerEditModal } from "@/components/admin/CustomerEditModal";

interface Customer {
  id: number;
  email: string;
  name?: string;
  role: string;
  createdAt: string;
  updatedAt: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate?: string;
}

interface CustomersResponse {
  customers: Customer[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [filters, setFilters] = useState({
    search: '',
    role: 'all',
    sortBy: 'createdAt',
    sortOrder: 'desc',
    page: 1,
    limit: 10,
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });

  const { isOpen: isDetailOpen, onOpen: onDetailOpen, onClose: onDetailClose } = useDisclosure();
  const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();

  useEffect(() => {
    fetchCustomers();
  }, [filters]);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        page: filters.page.toString(),
        limit: filters.limit.toString(),
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder,
      });

      if (filters.search) {
        queryParams.append('search', filters.search);
      }
      if (filters.role !== 'all') {
        queryParams.append('role', filters.role);
      }

      const response = await fetch(`/api/admin/customers?${queryParams}`);
      if (!response.ok) {
        throw new Error('Failed to fetch customers');
      }

      const data: CustomersResponse = await response.json();
      setCustomers(data.customers);
      setPagination(data.pagination);
    } catch (error) {
      console.error('Error fetching customers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    onDetailOpen();
  };

  const handleEditCustomer = (customer: Customer) => {
    setEditingCustomer(customer);
    onEditOpen();
  };

  const handleDeleteCustomer = async (customerId: number) => {
    if (!confirm('Bạn có chắc chắn muốn xóa khách hàng này?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/customers/${customerId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete customer');
      }

      // Refresh customers list
      fetchCustomers();
      alert('Xóa khách hàng thành công');
    } catch (error) {
      console.error('Error deleting customer:', error);
      alert(error instanceof Error ? error.message : 'Có lỗi xảy ra khi xóa khách hàng');
    }
  };

  const onCustomerUpdated = () => {
    fetchCustomers();
    onEditClose();
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'ADMIN': return 'danger';
      case 'CUSTOMER': return 'primary';
      default: return 'default';
    }
  };

  const getRoleText = (role: string) => {
    switch (role) {
      case 'ADMIN': return 'Quản trị viên';
      case 'CUSTOMER': return 'Khách hàng';
      default: return role;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Quản lý khách hàng</h1>
          <p className="text-gray-600 mt-1">
            Xem và quản lý thông tin khách hàng
          </p>
        </div>
        <Button
          color="primary"
          startContent={<Icon icon="mdi:refresh" />}
          onPress={() => fetchCustomers()}
        >
          Làm mới
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardBody>
          <div className="flex flex-col md:flex-row gap-4">
            <Input
              placeholder="Tìm kiếm theo tên hoặc email..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}
              startContent={<Icon icon="mdi:magnify" />}
              className="flex-1"
            />
            <Select
              placeholder="Vai trò"
              selectedKeys={[filters.role]}
              onSelectionChange={(keys) => {
                const role = Array.from(keys)[0] as string;
                setFilters({ ...filters, role, page: 1 });
              }}
              className="w-full md:w-48"
            >
              <SelectItem key="all" value="all">Tất cả</SelectItem>
              <SelectItem key="CUSTOMER" value="CUSTOMER">Khách hàng</SelectItem>
              <SelectItem key="ADMIN" value="ADMIN">Quản trị viên</SelectItem>
            </Select>
            <Select
              placeholder="Sắp xếp theo"
              selectedKeys={[filters.sortBy]}
              onSelectionChange={(keys) => {
                const sortBy = Array.from(keys)[0] as string;
                setFilters({ ...filters, sortBy, page: 1 });
              }}
              className="w-full md:w-48"
            >
              <SelectItem key="createdAt" value="createdAt">Ngày tạo</SelectItem>
              <SelectItem key="name" value="name">Tên</SelectItem>
              <SelectItem key="email" value="email">Email</SelectItem>
              <SelectItem key="updatedAt" value="updatedAt">Cập nhật gần nhất</SelectItem>
            </Select>
            <Select
              placeholder="Thứ tự"
              selectedKeys={[filters.sortOrder]}
              onSelectionChange={(keys) => {
                const sortOrder = Array.from(keys)[0] as string;
                setFilters({ ...filters, sortOrder, page: 1 });
              }}
              className="w-full md:w-32"
            >
              <SelectItem key="desc" value="desc">Giảm dần</SelectItem>
              <SelectItem key="asc" value="asc">Tăng dần</SelectItem>
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

      {/* Customers Table */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center w-full">
            <h2 className="text-xl font-semibold">
              Danh sách khách hàng ({pagination.total})
            </h2>
          </div>
        </CardHeader>
        <CardBody className="p-0">
          {loading ? (
            <div className="p-8 text-center">
              <Icon icon="mdi:loading" className="animate-spin text-4xl text-primary mb-4" />
              <p>Đang tải khách hàng...</p>
            </div>
          ) : customers.length === 0 ? (
            <div className="p-8 text-center">
              <Icon icon="mdi:account-group" className="text-6xl text-gray-400 mb-4" />
              <p className="text-gray-500">Không tìm thấy khách hàng nào</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left p-4 font-semibold">Khách hàng</th>
                    <th className="text-left p-4 font-semibold">Vai trò</th>
                    <th className="text-left p-4 font-semibold">Đơn hàng</th>
                    <th className="text-left p-4 font-semibold">Tổng chi tiêu</th>
                    <th className="text-left p-4 font-semibold">Đơn hàng cuối</th>
                    <th className="text-left p-4 font-semibold">Ngày tham gia</th>
                    <th className="text-left p-4 font-semibold">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map((customer) => (
                    <tr key={customer.id} className="border-b hover:bg-gray-50">
                      <td className="p-4">
                        <div>
                          <p className="font-medium">
                            {customer.name || 'Không có tên'}
                          </p>
                          <p className="text-sm text-gray-600">{customer.email}</p>
                        </div>
                      </td>
                      <td className="p-4">
                        <Chip
                          color={getRoleColor(customer.role)}
                          variant="flat"
                          size="sm"
                        >
                          {getRoleText(customer.role)}
                        </Chip>
                      </td>
                      <td className="p-4">
                        <p className="font-semibold">{customer.totalOrders}</p>
                        <p className="text-sm text-gray-600">đơn hàng</p>
                      </td>
                      <td className="p-4">
                        <p className="font-semibold text-green-600">
                          {FormatCurrency(customer.totalSpent)}
                        </p>
                      </td>
                      <td className="p-4">
                        {customer.lastOrderDate ? (
                          <p className="text-sm">
                            {new Date(customer.lastOrderDate).toLocaleDateString('vi-VN')}
                          </p>
                        ) : (
                          <p className="text-sm text-gray-500">Chưa có</p>
                        )}
                      </td>
                      <td className="p-4">
                        <p className="text-sm">
                          {new Date(customer.createdAt).toLocaleDateString('vi-VN')}
                        </p>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="flat"
                            color="primary"
                            startContent={<Icon icon="mdi:eye" />}
                            onPress={() => handleViewCustomer(customer)}
                          >
                            Xem
                          </Button>
                          <Button
                            size="sm"
                            variant="flat"
                            startContent={<Icon icon="mdi:pencil" />}
                            onPress={() => handleEditCustomer(customer)}
                          >
                            Sửa
                          </Button>
                          {customer.role !== 'ADMIN' && customer.totalOrders === 0 && (
                            <Button
                              size="sm"
                              variant="flat"
                              color="danger"
                              startContent={<Icon icon="mdi:delete" />}
                              onPress={() => handleDeleteCustomer(customer.id)}
                            >
                              Xóa
                            </Button>
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

      {/* Customer Detail Modal */}
      {selectedCustomer && (
        <CustomerDetailModal
          customer={selectedCustomer}
          isOpen={isDetailOpen}
          onClose={onDetailClose}
        />
      )}

      {/* Customer Edit Modal */}
      {editingCustomer && (
        <CustomerEditModal
          customer={editingCustomer}
          isOpen={isEditOpen}
          onClose={onEditClose}
          onUpdated={onCustomerUpdated}
        />
      )}
    </div>
  );
}
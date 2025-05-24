// app/admin/page.tsx
'use client'

import { useState, useEffect } from 'react';
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";
import { Icon } from "@iconify/react";
import { FormatCurrency } from "@/models/FormatCurrency";

interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  totalProducts: number;
  totalCustomers: number;
  pendingOrders: number;
  recentOrders: Array<{
    id: number;
    customerName: string;
    total: number;
    status: string;
    createdAt: string;
  }>;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalOrders: 0,
    totalRevenue: 0,
    totalProducts: 0,
    totalCustomers: 0,
    pendingOrders: 0,
    recentOrders: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching dashboard data from API...');
      
      const response = await fetch('/api/admin/dashboard', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('API Response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Dashboard data received:', data);
      
      setStats(data);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      setError(error instanceof Error ? error.message : 'Failed to load dashboard data');
      
      // Fallback to mock data if API fails
      setStats({
        totalOrders: 0,
        totalRevenue: 0,
        totalProducts: 0,
        totalCustomers: 0,
        pendingOrders: 0,
        recentOrders: [],
      });
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Tổng đơn hàng',
      value: stats.totalOrders.toString(),
      icon: 'mdi:package-variant',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
    },
    {
      title: 'Doanh thu',
      value: FormatCurrency(stats.totalRevenue),
      icon: 'mdi:currency-usd',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
    },
    {
      title: 'Sản phẩm',
      value: stats.totalProducts.toString(),
      icon: 'mdi:shopping',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
    },
    {
      title: 'Khách hàng',
      value: stats.totalCustomers.toString(),
      icon: 'mdi:account-group',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
    },
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardBody className="p-6">
                <div className="h-20 bg-gray-200 rounded"></div>
              </CardBody>
            </Card>
          ))}
        </div>
        
        <div className="text-center">
          <Icon icon="mdi:loading" className="animate-spin text-4xl text-primary mb-4" />
          <p className="text-gray-600">Đang tải dữ liệu dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Chào mừng quay trở lại! Hôm nay là {new Date().toLocaleDateString('vi-VN', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
        </div>
        <Button 
          color="primary" 
          startContent={<Icon icon="mdi:refresh" />}
          onPress={fetchDashboardStats}
          isLoading={loading}
        >
          Làm mới
        </Button>
      </div>

      {/* Error Message */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardBody>
            <div className="flex items-center gap-2 text-red-700">
              <Icon icon="mdi:alert-circle" />
              <span>Lỗi: {error}</span>
              <Button 
                size="sm" 
                color="danger" 
                variant="flat"
                onPress={fetchDashboardStats}
              >
                Thử lại
              </Button>
            </div>
          </CardBody>
        </Card>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <Card key={index} className={`hover:shadow-lg transition-shadow border ${stat.borderColor}`}>
            <CardBody className="p-6">
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-xl ${stat.bgColor} border ${stat.borderColor}`}>
                  <Icon icon={stat.icon} width={28} className={stat.color} />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <Card>
          <CardHeader className="flex justify-between">
            <h3 className="text-lg font-semibold">Đơn hàng gần đây</h3>
            <Button 
              size="sm" 
              variant="light" 
              endContent={<Icon icon="mdi:arrow-right" />}
              onPress={() => window.location.href = '/admin/orders'}
            >
              Xem tất cả
            </Button>
          </CardHeader>
          <CardBody>
            {stats.recentOrders.length === 0 ? (
              <div className="text-center py-8">
                <Icon icon="mdi:package-variant-closed" className="text-4xl text-gray-400 mb-2" />
                <p className="text-gray-500">Chưa có đơn hàng nào</p>
              </div>
            ) : (
              <div className="space-y-4">
                {stats.recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <Icon icon="mdi:package" className="text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium">#{order.id}</p>
                        <p className="text-sm text-gray-600">{order.customerName}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{FormatCurrency(order.total)}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardBody>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Thao tác nhanh</h3>
          </CardHeader>
          <CardBody>
            <div className="space-y-3">
              <Button
                className="w-full justify-start"
                variant="flat"
                color="primary"
                startContent={<Icon icon="mdi:plus" />}
                onPress={() => window.location.href = '/admin/products/create'}
              >
                Thêm sản phẩm mới
              </Button>
              <Button
                className="w-full justify-start"
                variant="flat"
                color="warning"
                startContent={<Icon icon="mdi:package" />}
                onPress={() => window.location.href = '/admin/orders'}
              >
                Xem đơn hàng chờ xử lý ({stats.pendingOrders})
              </Button>
              <Button
                className="w-full justify-start"
                variant="flat"
                color="success"
                startContent={<Icon icon="mdi:chart-line" />}
                onPress={() => window.location.href = '/admin/reports'}
              >
                Xem báo cáo
              </Button>
              <Button
                className="w-full justify-start"
                variant="flat"
                startContent={<Icon icon="mdi:account-group" />}
                onPress={() => window.location.href = '/admin/customers'}
              >
                Quản lý khách hàng
              </Button>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
// app/account/page.tsx
'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardBody } from "@heroui/card";
import { Tabs, Tab } from "@heroui/tabs";
import { Icon } from "@iconify/react";
import { useAuth } from "@/lib/auth-context";
import { StatsCards } from "@/components/account/StatsCards";
import { OrdersList } from "@/components/account/OrdersList";
import { ProfileSection } from "@/components/account/ProfileSection";
import { UserStats, Order, UserProfile } from "@/types/account";

export default function AccountPage() {
  const router = useRouter();
  const { user, loading: authLoading, refreshUser } = useAuth(); // Add refreshUser
  const [stats, setStats] = useState<UserStats>({
    totalOrders: 0,
    totalSpent: 0,
    pendingOrders: 0,
    completedOrders: 0,
  });
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/');
      return;
    }

    if (user) {
      fetchAccountData();
    }
  }, [user, authLoading, router]);

  const fetchAccountData = async () => {
    try {
      setLoading(true);
      
      // Fetch stats and orders in parallel
      const [statsResponse, ordersResponse] = await Promise.all([
        fetch('/api/account/stats'),
        fetch('/api/account/orders?limit=20'),
      ]);

      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStats(statsData);
      }

      if (ordersResponse.ok) {
        const ordersData = await ordersResponse.json();
        setOrders(ordersData);
      }
    } catch (error) {
      console.error('Error fetching account data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async (profileData: Partial<UserProfile>) => {
    try {
      const response = await fetch('/api/account/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update profile');
      }

      const result = await response.json();
      console.log('Profile updated:', result);

      // Refresh user data in auth context
      await refreshUser();

    } catch (error) {
      console.error('Error updating profile:', error);
      alert(`Lỗi cập nhật thông tin: ${error instanceof Error ? error.message : 'Unknown error'}`);
      throw error;
    }
  };

  if (authLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-64"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Tài khoản của tôi</h1>
        <p className="text-gray-600">Xin chào, {user.name || user.email}!</p>
      </div>

      <Tabs 
        selectedKey={activeTab} 
        onSelectionChange={(key) => setActiveTab(key as string)}
        className="w-full"
      >
        <Tab 
          key="overview" 
          title={
            <div className="flex items-center gap-2">
              <Icon icon="mdi:view-dashboard" width={20} />
              Tổng quan
            </div>
          }
        >
          <div className="space-y-6">
            <StatsCards stats={stats} loading={loading} />
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card>
                  <CardBody>
                    <h3 className="text-lg font-semibold mb-4">Đơn hàng gần đây</h3>
                    <OrdersList orders={orders.slice(0, 5)} loading={loading} />
                  </CardBody>
                </Card>
              </div>
              
              <div>
                <ProfileSection 
                  profile={{
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    role: user.role,
                    createdAt: new Date().toISOString(), // You might want to fetch this from API
                  }}
                  onUpdate={handleProfileUpdate}
                />
              </div>
            </div>
          </div>
        </Tab>

        <Tab 
          key="orders" 
          title={
            <div className="flex items-center gap-2">
              <Icon icon="mdi:package-variant" width={20} />
              Đơn hàng
            </div>
          }
        >
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Tất cả đơn hàng</h3>
            <OrdersList orders={orders} loading={loading} />
          </div>
        </Tab>

        <Tab 
          key="profile" 
          title={
            <div className="flex items-center gap-2">
              <Icon icon="mdi:account" width={20} />
              Hồ sơ
            </div>
          }
        >
          <div className="max-w-2xl">
            <ProfileSection 
              profile={{
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
                createdAt: new Date().toISOString(),
              }}
              onUpdate={handleProfileUpdate}
            />
          </div>
        </Tab>
      </Tabs>
    </div>
  );
}
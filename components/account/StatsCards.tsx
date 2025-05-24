// components/account/StatsCards.tsx
'use client'

import { Card, CardBody } from "@heroui/card";
import { Icon } from "@iconify/react";
import { FormatCurrency } from "@/models/FormatCurrency";
import { UserStats } from "@/types/account";

interface StatsCardsProps {
  stats: UserStats;
  loading?: boolean;
}

export const StatsCards = ({ stats, loading = false }: StatsCardsProps) => {
  const statsConfig = [
    {
      title: "Tổng đơn hàng",
      value: stats.totalOrders.toString(),
      icon: "mdi:shopping",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Tổng chi tiêu",
      value: FormatCurrency(stats.totalSpent),
      icon: "mdi:currency-usd",
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Đang xử lý",
      value: stats.pendingOrders.toString(),
      icon: "mdi:clock-outline",
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      title: "Hoàn thành",
      value: stats.completedOrders.toString(),
      icon: "mdi:check-circle",
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
    },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index} className="animate-pulse">
            <CardBody className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-6 bg-gray-200 rounded"></div>
                </div>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {statsConfig.map((stat, index) => (
        <Card key={index} className="hover:shadow-lg transition-shadow">
          <CardBody className="p-6">
            <div className="flex items-center space-x-4">
              <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                <Icon icon={stat.icon} width={24} className={stat.color} />
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
  );
};
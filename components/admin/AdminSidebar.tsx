// components/admin/AdminSidebar.tsx
'use client'

import { usePathname } from 'next/navigation';
import { Button } from "@heroui/button";
import { Icon } from "@iconify/react";
import NextLink from "next/link";
import clsx from "clsx";

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const sidebarItems = [
  {
    title: 'Dashboard',
    href: '/admin',
    icon: 'mdi:view-dashboard',
  },
  {
    title: 'Quản lý đơn hàng',
    href: '/admin/orders',
    icon: 'mdi:package-variant',
  },
  {
    title: 'Quản lý sản phẩm',
    href: '/admin/products',
    icon: 'mdi:shopping',
  },
  {
    title: 'Quản lý khách hàng',
    href: '/admin/customers',
    icon: 'mdi:account-group',
  },
];

export const AdminSidebar = ({ isOpen, onClose }: AdminSidebarProps) => {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={clsx(
        "fixed top-0 left-0 z-50 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out",
        "lg:translate-x-0 lg:static lg:z-auto",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* Logo */}
        <div className="flex items-center justify-between p-6 border-b">
          <NextLink href="/admin" className="flex items-center gap-2">
            <Icon icon="mdi:shield-crown" className="text-2xl text-primary" />
            <span className="text-xl font-bold">GIOHOA Admin</span>
          </NextLink>
          <Button
            isIconOnly
            variant="light"
            className="lg:hidden"
            onPress={onClose}
          >
            <Icon icon="mdi:close" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="p-4">
          <ul className="space-y-2">
            {sidebarItems.map((item) => {
              const isActive = pathname === item.href || 
                (item.href !== '/admin' && pathname.startsWith(item.href));
              
              return (
                <li key={item.href}>
                  <NextLink
                    href={item.href}
                    className={clsx(
                      "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
                      isActive
                        ? "bg-primary text-white"
                        : "text-gray-700 hover:bg-gray-100"
                    )}
                    onClick={onClose}
                  >
                    <Icon icon={item.icon} width={20} />
                    <span>{item.title}</span>
                  </NextLink>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </>
  );
};
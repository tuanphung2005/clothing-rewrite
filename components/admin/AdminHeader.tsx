// components/admin/AdminHeader.tsx
'use client'

import { Button } from "@heroui/button";
import { Icon } from "@iconify/react";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@heroui/dropdown";
import { Avatar } from "@heroui/avatar";
import { useAdminAuth } from "@/lib/admin-auth-context";

interface AdminUser {
  username: string;
  role: 'ADMIN';
}

interface AdminHeaderProps {
  onMenuClick: () => void;
  admin: AdminUser;
}

export const AdminHeader = ({ onMenuClick, admin }: AdminHeaderProps) => {
  const { logout } = useAdminAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <header className="bg-white shadow-sm border-b px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            isIconOnly
            variant="light"
            className="lg:hidden"
            onPress={onMenuClick}
          >
            <Icon icon="mdi:menu" />
          </Button>
          <h1 className="text-xl font-semibold text-gray-800">
            Admin Panel
          </h1>
        </div>

        <div className="flex items-center gap-4">
          {/* Notifications */}
          <Button isIconOnly variant="light">
            <Icon icon="mdi:bell-outline" width={20} />
          </Button>

          {/* Admin Menu */}
          <Dropdown>
            <DropdownTrigger>
              <div className="flex items-center gap-2 cursor-pointer">
                <Avatar
                  name={admin.username}
                  size="sm"
                  className="w-8 h-8 bg-primary text-white"
                />
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium">{admin.username}</p>
                  <p className="text-xs text-gray-500">Administrator</p>
                </div>
                <Icon icon="mdi:chevron-down" width={16} />
              </div>
            </DropdownTrigger>
            <DropdownMenu>
              <DropdownItem key="settings" startContent={<Icon icon="mdi:cog" />}>
                Cài đặt
              </DropdownItem>
              <DropdownItem 
                key="logout" 
                className="text-danger" 
                color="danger"
                startContent={<Icon icon="mdi:logout" />}
                onPress={handleLogout}
              >
                Đăng xuất
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>
    </header>
  );
};
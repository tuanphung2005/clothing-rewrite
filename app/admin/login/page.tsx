// app/admin/login/page.tsx
'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Icon } from "@iconify/react";
import { useAdminAuth } from "@/lib/admin-auth-context";

export default function AdminLoginPage() {
  const { login } = useAdminAuth();
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      await login(formData.username, formData.password);
      router.push('/admin');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Đăng nhập thất bại');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="flex flex-col items-center pb-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-large">
          <div className="flex items-center gap-2 mb-4">
            <Icon icon="mdi:shield-lock" className="text-3xl" />
            <span className="text-2xl font-bold">ADMIN</span>
          </div>
          <h1 className="text-xl font-semibold">Đăng nhập quản trị</h1>
          <p className="text-blue-100 text-center text-sm mt-2">
            Chỉ dành cho quản trị viên hệ thống
          </p>
        </CardHeader>

        <CardBody className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Tên đăng nhập"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              startContent={<Icon icon="mdi:account" />}
              variant="bordered"
              isRequired
            />
            
            <Input
              label="Mật khẩu"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              startContent={<Icon icon="mdi:lock" />}
              variant="bordered"
              isRequired
            />

            {error && (
              <div className="text-red-500 text-sm bg-red-50 p-3 rounded-lg border border-red-200">
                <Icon icon="mdi:alert-circle" className="inline mr-2" />
                {error}
              </div>
            )}

            <Button
              type="submit"
              color="primary"
              className="w-full"
              isLoading={isSubmitting}
              isDisabled={!formData.username || !formData.password}
              startContent={!isSubmitting && <Icon icon="mdi:login" />}
            >
              Đăng nhập
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Button
              variant="light"
              onPress={() => router.push('/')}
              startContent={<Icon icon="mdi:home" />}
              className="text-gray-600"
            >
              Về trang chủ
            </Button>
          </div>

          {/* Dev credentials info */}
          <div className="mt-6 p-3 bg-gray-50 rounded-lg border">
            <p className="text-xs text-gray-600 text-center mb-2">
              <Icon icon="mdi:information" className="inline mr-1" />
              Thông tin đăng nhập (Development)
            </p>
            <div className="text-xs text-gray-500 text-center">
              <p>Username: <code className="bg-gray-200 px-1 rounded">admin</code></p>
              <p>Password: <code className="bg-gray-200 px-1 rounded">admin123</code></p>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
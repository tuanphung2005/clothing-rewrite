// components/account/ProfileSection.tsx
'use client'

import { useState } from 'react';
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Icon } from "@iconify/react";
import { UserProfile } from "@/types/account";

interface ProfileSectionProps {
  profile: UserProfile;
  onUpdate: (profile: Partial<UserProfile>) => Promise<void>;
}

export const ProfileSection = ({ profile, onUpdate }: ProfileSectionProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: profile.name || '',
    email: profile.email,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleSave = async () => {
    setIsSubmitting(true);
    setMessage(null);
    
    try {
      await onUpdate(editData);
      setIsEditing(false);
      setMessage({ type: 'success', text: 'Cập nhật thông tin thành công!' });
      
      // Clear message after 3 seconds
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error('Failed to update profile:', error);
      setMessage({ 
        type: 'error', 
        text: error instanceof Error ? error.message : 'Có lỗi xảy ra' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setEditData({
      name: profile.name || '',
      email: profile.email,
    });
    setIsEditing(false);
  };

  return (
    <Card>
      <CardHeader className="flex justify-between">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Icon icon="mdi:account" width={24} />
          Thông tin cá nhân
        </h3>
        {!isEditing && (
          <Button
            size="sm"
            variant="flat"
            onPress={() => setIsEditing(true)}
            startContent={<Icon icon="mdi:pencil" />}
          >
            Chỉnh sửa
          </Button>
        )}
      </CardHeader>
      <CardBody className="space-y-4">
        {message && (
          <div className={`p-3 rounded-lg text-sm ${
            message.type === 'success' 
              ? 'bg-green-100 text-green-700 border border-green-200' 
              : 'bg-red-100 text-red-700 border border-red-200'
          }`}>
            {message.text}
          </div>
        )}
        
        {isEditing ? (
          <>
            <Input
              label="Họ và tên"
              value={editData.name}
              onChange={(e) => setEditData({ ...editData, name: e.target.value })}
            />
            <Input
              label="Email"
              value={editData.email}
              onChange={(e) => setEditData({ ...editData, email: e.target.value })}
              type="email"
            />
            <div className="flex gap-2 justify-end">
              <Button variant="flat" onPress={handleCancel}>
                Hủy
              </Button>
              <Button 
                color="primary" 
                onPress={handleSave}
                isLoading={isSubmitting}
              >
                Lưu
              </Button>
            </div>
          </>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Icon icon="mdi:account" width={20} className="text-gray-400" />
              <div>
                <p className="text-sm text-gray-600">Họ và tên</p>
                <p className="font-medium">{profile.name || 'Chưa cập nhật'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Icon icon="mdi:email" width={20} className="text-gray-400" />
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-medium">{profile.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Icon icon="mdi:shield-account" width={20} className="text-gray-400" />
              <div>
                <p className="text-sm text-gray-600">Vai trò</p>
                <p className="font-medium">{profile.role}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Icon icon="mdi:calendar" width={20} className="text-gray-400" />
              <div>
                <p className="text-sm text-gray-600">Tham gia từ</p>
                <p className="font-medium">
                  {new Date(profile.createdAt).toLocaleDateString('vi-VN')}
                </p>
              </div>
            </div>
          </div>
        )}
      </CardBody>
    </Card>
  );
};
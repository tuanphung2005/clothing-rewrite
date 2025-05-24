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

  const handleSave = async () => {
    setIsSubmitting(true);
    try {
      await onUpdate(editData);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
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
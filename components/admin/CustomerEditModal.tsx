// components/admin/CustomerEditModal.tsx
'use client'

import { useState, useEffect } from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { Icon } from "@iconify/react";

interface Customer {
  id: number;
  email: string;
  name?: string;
  role: string;
}

interface CustomerEditModalProps {
  customer: Customer;
  isOpen: boolean;
  onClose: () => void;
  onUpdated: () => void;
}

export const CustomerEditModal = ({
  customer,
  isOpen,
  onClose,
  onUpdated,
}: CustomerEditModalProps) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (customer && isOpen) {
      setFormData({
        name: customer.name || '',
        email: customer.email,
        role: customer.role,
      });
    }
  }, [customer, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/admin/customers/${customer.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update customer');
      }

      onUpdated();
    } catch (error) {
      console.error('Error updating customer:', error);
      alert(error instanceof Error ? error.message : 'Có lỗi xảy ra');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        <form onSubmit={handleSubmit}>
          <ModalHeader>
            <h2 className="text-xl font-semibold">
              Chỉnh sửa khách hàng: {customer.name || customer.email}
            </h2>
          </ModalHeader>

          <ModalBody className="space-y-4">
            <Input
              label="Tên"
              placeholder="Nhập tên khách hàng"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />

            <Input
              label="Email"
              type="email"
              placeholder="Nhập email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              isRequired
            />

            <Select
              label="Vai trò"
              placeholder="Chọn vai trò"
              selectedKeys={formData.role ? [formData.role] : []}
              onSelectionChange={(keys) => {
                const role = Array.from(keys)[0] as string;
                setFormData({ ...formData, role });
              }}
              isRequired
            >
              <SelectItem key="CUSTOMER" value="CUSTOMER">Khách hàng</SelectItem>
              <SelectItem key="ADMIN" value="ADMIN">Quản trị viên</SelectItem>
            </Select>
          </ModalBody>

          <ModalFooter>
            <Button variant="light" onPress={onClose}>
              Hủy
            </Button>
            <Button
              type="submit"
              color="primary"
              isLoading={isSubmitting}
              startContent={!isSubmitting && <Icon icon="mdi:content-save" />}
            >
              Cập nhật
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};
// components/admin/ProductDeleteModal.tsx
'use client'

import { useState } from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import { Button } from "@heroui/button";
import { Icon } from "@iconify/react";

interface Product {
  id: number;
  name: string;
}

interface ProductDeleteModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
  onDeleted: () => void;
}

export const ProductDeleteModal = ({
  product,
  isOpen,
  onClose,
  onDeleted,
}: ProductDeleteModalProps) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);

    try {
      const response = await fetch(`/api/admin/products/${product.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete product');
      }

      onDeleted();
    } catch (error) {
      console.error('Error deleting product:', error);
      alert(error instanceof Error ? error.message : 'Có lỗi xảy ra khi xóa sản phẩm');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        <ModalHeader className="flex items-center gap-2">
          <Icon icon="mdi:alert" className="text-danger" />
          Xác nhận xóa sản phẩm
        </ModalHeader>
        <ModalBody>
          <p>
            Bạn có chắc chắn muốn xóa sản phẩm{' '}
            <span className="font-semibold">"{product.name}"</span>?
          </p>
          <p className="text-danger text-sm">
            Hành động này không thể hoàn tác. Sản phẩm sẽ bị xóa vĩnh viễn.
          </p>
        </ModalBody>
        <ModalFooter>
          <Button variant="light" onPress={onClose}>
            Hủy
          </Button>
          <Button
            color="danger"
            onPress={handleDelete}
            isLoading={isDeleting}
            startContent={!isDeleting && <Icon icon="mdi:delete" />}
          >
            Xóa sản phẩm
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
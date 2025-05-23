'use client'

import { useState } from 'react';
import { Button } from "@heroui/button";
import { Icon } from "@iconify/react";
import { Modal, ModalBody, ModalContent, ModalHeader, ModalFooter } from "@heroui/modal";
import { Input } from "@heroui/input";
import { useDisclosure } from "@heroui/use-disclosure";
import { Tabs, Tab } from "@heroui/tabs";
import { useAuth } from '@/lib/auth-context';

export const Auth = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user, login, register, logout, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('login');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError('');

    try {
      if (activeTab === 'login') {
        await login(formData.email, formData.password);
      } else {
        await register(formData.email, formData.password, formData.name);
      }
      onClose();
      setFormData({ email: '', password: '', name: '' });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = async () => {
    await logout();
  };

  if (loading) {
    return (
      <Button isIconOnly variant="light" isLoading>
        <Icon icon="mdi:user-circle" width={32} />
      </Button>
    );
  }

  if (user) {
    return (
      <Button 
        isIconOnly 
        variant="light" 
        onPress={handleLogout}
        title={`Logout ${user.name || user.email}`}
      >
        <Icon icon="mdi:account-check" width={32} />
      </Button>
    );
  }

  return (
    <>
      <Button isIconOnly variant="light" onPress={onOpen}>
        <Icon icon="mdi:user-circle" width={32} />
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} size="md">
        <ModalContent>
          <ModalHeader>
            <h3 className="text-xl font-semibold">
              Trở thành thành viên thân thiết với GIOHOA
            </h3>
          </ModalHeader>
          <ModalBody>
            <Tabs 
              selectedKey={activeTab} 
              onSelectionChange={(key) => setActiveTab(key as string)}
              fullWidth
            >
              <Tab key="login" title="Đăng nhập">
                <div className="flex flex-col gap-4">
                  <Input
                    label="Email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    isRequired
                  />
                  <Input
                    label="Mật khẩu"
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    isRequired
                  />
                </div>
              </Tab>
              <Tab key="register" title="Đăng ký">
                <div className="flex flex-col gap-4">
                  <Input
                    label="Họ và tên"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                  <Input
                    label="Email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    isRequired
                  />
                  <Input
                    label="Mật khẩu"
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    isRequired
                  />
                </div>
              </Tab>
            </Tabs>

            {error && (
              <div className="text-red-500 text-sm mt-2">{error}</div>
            )}
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={onClose}>
              Hủy
            </Button>
            <Button 
              color="primary" 
              onPress={handleSubmit}
              isLoading={isSubmitting}
              isDisabled={!formData.email || !formData.password}
            >
              {activeTab === 'login' ? 'Đăng nhập' : 'Đăng ký'}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
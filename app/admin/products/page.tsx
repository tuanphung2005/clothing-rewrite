// app/admin/products/page.tsx
'use client'

import { useState, useEffect } from 'react';
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { Chip } from "@heroui/chip";
import { Pagination } from "@heroui/pagination";
import { Icon } from "@iconify/react";
import { useDisclosure } from "@heroui/use-disclosure";
import { FormatCurrency } from "@/models/FormatCurrency";
import { ProductFormModal } from "@/components/admin/ProductFormModal";
import { ProductDeleteModal } from "@/components/admin/ProductDeleteModal";

interface Product {
  id: number;
  name: string;
  description?: string;
  material?: string;
  type: string;
  gender: string;
  price: number;
  salePrice?: number;
  createdAt: string;
  images: Array<{ url: string; alt: string }>;
  colors: Array<{ name: string; color: string }>;
  sizes: Array<{ value: string }>;
}

interface ProductsResponse {
  products: Product[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [filters, setFilters] = useState({
    search: '',
    type: 'all',
    gender: 'all',
    page: 1,
    limit: 10,
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });

  const { isOpen, onOpen, onClose } = useDisclosure();
  const { 
    isOpen: isDeleteOpen, 
    onOpen: onDeleteOpen, 
    onClose: onDeleteClose 
  } = useDisclosure();

  useEffect(() => {
    fetchProducts();
  }, [filters]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        page: filters.page.toString(),
        limit: filters.limit.toString(),
      });

      if (filters.search) {
        queryParams.append('search', filters.search);
      }
      if (filters.type !== 'all') {
        queryParams.append('type', filters.type);
      }
      if (filters.gender !== 'all') {
        queryParams.append('gender', filters.gender);
      }

      const response = await fetch(`/api/admin/products?${queryParams}`);
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }

      const data: ProductsResponse = await response.json();
      setProducts(data.products);
      setPagination(data.pagination);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProduct = () => {
    setSelectedProduct(null);
    setIsEditing(false);
    onOpen();
  };

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product);
    setIsEditing(true);
    onOpen();
  };

  const handleDeleteProduct = (product: Product) => {
    setProductToDelete(product);
    onDeleteOpen();
  };

  const onProductSaved = () => {
    fetchProducts();
    onClose();
  };

  const onProductDeleted = () => {
    fetchProducts();
    onDeleteClose();
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case 'shirt': return 'Áo';
      case 'pants': return 'Quần';
      case 'dress': return 'Váy';
      case 'jacket': return 'Áo khoác';
      case 'shoes': return 'Giày';
      case 'accessories': return 'Phụ kiện';
      case 'unders': return 'Đồ lót';
      default: return type;
    }
  };

  const getGenderText = (gender: string) => {
    switch (gender) {
      case 'male': return 'Nam';
      case 'female': return 'Nữ';
      case 'unisex': return 'Unisex';
      default: return gender;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Quản lý sản phẩm</h1>
          <p className="text-gray-600 mt-1">
            Thêm, sửa và xóa sản phẩm trong cửa hàng
          </p>
        </div>
        <Button
          color="primary"
          startContent={<Icon icon="mdi:plus" />}
          onPress={handleCreateProduct}
        >
          Thêm sản phẩm
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardBody>
          <div className="flex flex-col md:flex-row gap-4">
            <Input
              placeholder="Tìm kiếm sản phẩm..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}
              startContent={<Icon icon="mdi:magnify" />}
              className="flex-1"
            />
            <Select
              placeholder="Loại sản phẩm"
              selectedKeys={[filters.type]}
              onSelectionChange={(keys) => {
                const type = Array.from(keys)[0] as string;
                setFilters({ ...filters, type, page: 1 });
              }}
              className="w-full md:w-48"
            >
              <SelectItem key="all" value="all">Tất cả</SelectItem>
              <SelectItem key="shirt" value="shirt">Áo</SelectItem>
              <SelectItem key="pants" value="pants">Quần</SelectItem>
              <SelectItem key="dress" value="dress">Váy</SelectItem>
              <SelectItem key="jacket" value="jacket">Áo khoác</SelectItem>
              <SelectItem key="shoes" value="shoes">Giày</SelectItem>
              <SelectItem key="accessories" value="accessories">Phụ kiện</SelectItem>
              <SelectItem key="unders" value="unders">Đồ lót</SelectItem>
            </Select>
            <Select
              placeholder="Giới tính"
              selectedKeys={[filters.gender]}
              onSelectionChange={(keys) => {
                const gender = Array.from(keys)[0] as string;
                setFilters({ ...filters, gender, page: 1 });
              }}
              className="w-full md:w-48"
            >
              <SelectItem key="all" value="all">Tất cả</SelectItem>
              <SelectItem key="male" value="male">Nam</SelectItem>
              <SelectItem key="female" value="female">Nữ</SelectItem>
              <SelectItem key="unisex" value="unisex">Unisex</SelectItem>
            </Select>
            <Select
              placeholder="Số lượng/trang"
              selectedKeys={[filters.limit.toString()]}
              onSelectionChange={(keys) => {
                const limit = parseInt(Array.from(keys)[0] as string);
                setFilters({ ...filters, limit, page: 1 });
              }}
              className="w-full md:w-32"
            >
              <SelectItem key="10" value="10">10</SelectItem>
              <SelectItem key="25" value="25">25</SelectItem>
              <SelectItem key="50" value="50">50</SelectItem>
            </Select>
          </div>
        </CardBody>
      </Card>

      {/* Products Table */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center w-full">
            <h2 className="text-xl font-semibold">
              Danh sách sản phẩm ({pagination.total})
            </h2>
          </div>
        </CardHeader>
        <CardBody className="p-0">
          {loading ? (
            <div className="p-8 text-center">
              <Icon icon="mdi:loading" className="animate-spin text-4xl text-primary mb-4" />
              <p>Đang tải sản phẩm...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="p-8 text-center">
              <Icon icon="mdi:package-variant-closed" className="text-6xl text-gray-400 mb-4" />
              <p className="text-gray-500">Không tìm thấy sản phẩm nào</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left p-4 font-semibold">Sản phẩm</th>
                    <th className="text-left p-4 font-semibold">Loại</th>
                    <th className="text-left p-4 font-semibold">Giá</th>
                    <th className="text-left p-4 font-semibold">Màu sắc</th>
                    <th className="text-left p-4 font-semibold">Kích thước</th>
                    <th className="text-left p-4 font-semibold">Ngày tạo</th>
                    <th className="text-left p-4 font-semibold">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id} className="border-b hover:bg-gray-50">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={product.images[0]?.url || 'https://placehold.co/60x60/'}
                            alt={product.name}
                            className="w-12 h-12 object-cover rounded"
                          />
                          <div>
                            <p className="font-medium">{product.name}</p>
                            <p className="text-sm text-gray-600">
                              {getGenderText(product.gender)}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <Chip size="sm" variant="flat">
                          {getTypeText(product.type)}
                        </Chip>
                      </td>
                      <td className="p-4">
                        <div>
                          {product.salePrice ? (
                            <>
                              <p className="font-semibold text-red-600">
                                {FormatCurrency(product.salePrice)}
                              </p>
                              <p className="text-sm text-gray-500 line-through">
                                {FormatCurrency(product.price)}
                              </p>
                            </>
                          ) : (
                            <p className="font-semibold">
                              {FormatCurrency(product.price)}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-1">
                          {product.colors.slice(0, 3).map((color, index) => (
                            <div
                              key={index}
                              className="w-6 h-6 rounded-full border border-gray-300"
                              style={{ backgroundColor: color.color }}
                              title={color.name}
                            />
                          ))}
                          {product.colors.length > 3 && (
                            <span className="text-sm text-gray-500">
                              +{product.colors.length - 3}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-1 flex-wrap">
                          {product.sizes.map((size, index) => (
                            <Chip key={index} size="sm" variant="bordered">
                              {size.value}
                            </Chip>
                          ))}
                        </div>
                      </td>
                      <td className="p-4">
                        <p className="text-sm">
                          {new Date(product.createdAt).toLocaleDateString('vi-VN')}
                        </p>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="flat"
                            color="primary"
                            startContent={<Icon icon="mdi:pencil" />}
                            onPress={() => handleEditProduct(product)}
                          >
                            Sửa
                          </Button>
                          <Button
                            size="sm"
                            variant="flat"
                            color="danger"
                            startContent={<Icon icon="mdi:delete" />}
                            onPress={() => handleDeleteProduct(product)}
                          >
                            Xóa
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardBody>
      </Card>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination
            page={pagination.page}
            total={pagination.totalPages}
            onChange={(page) => setFilters({ ...filters, page })}
            showControls
          />
        </div>
      )}

      {/* Product Form Modal */}
      <ProductFormModal
        product={selectedProduct}
        isEditing={isEditing}
        isOpen={isOpen}
        onClose={onClose}
        onSaved={onProductSaved}
      />

      {/* Delete Confirmation Modal */}
      {productToDelete && (
        <ProductDeleteModal
          product={productToDelete}
          isOpen={isDeleteOpen}
          onClose={onDeleteClose}
          onDeleted={onProductDeleted}
        />
      )}
    </div>
  );
}
// app/api/admin/products/[id]/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const productId = parseInt(params.id);

    if (isNaN(productId)) {
      return NextResponse.json(
        { error: 'Invalid product ID' },
        { status: 400 }
      );
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        images: true,
        colors: true,
        sizes: true,
      },
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const productId = parseInt(params.id);

    if (isNaN(productId)) {
      return NextResponse.json(
        { error: 'Invalid product ID' },
        { status: 400 }
      );
    }

    const {
      name,
      description,
      material,
      type,
      gender,
      price,
      salePrice,
      images,
      colors,
      sizes,
    } = await request.json();

    // Check if product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!existingProduct) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Update product in a transaction
    const updatedProduct = await prisma.$transaction(async (tx) => {
      // Delete existing related records
      await tx.productImage.deleteMany({
        where: { productId },
      });
      await tx.productColor.deleteMany({
        where: { productId },
      });
      await tx.productSize.deleteMany({
        where: { productId },
      });

      // Update product with new data
      return tx.product.update({
        where: { id: productId },
        data: {
          name,
          description: description || null,
          material: material || null,
          type,
          gender,
          price: parseFloat(price),
          salePrice: salePrice ? parseFloat(salePrice) : null,
          images: {
            create: images?.map((img: { url: string; alt: string }) => ({
              url: img.url,
              alt: img.alt || name,
            })) || [],
          },
          colors: {
            create: colors?.map((color: { name: string; color: string }) => ({
              name: color.name,
              color: color.color,
            })) || [],
          },
          sizes: {
            create: sizes?.map((size: string) => ({
              value: size,
            })) || [],
          },
        },
        include: {
          images: true,
          colors: true,
          sizes: true,
        },
      });
    });

    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const productId = parseInt(params.id);

    if (isNaN(productId)) {
      return NextResponse.json(
        { error: 'Invalid product ID' },
        { status: 400 }
      );
    }

    // Check if product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!existingProduct) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Check if product is used in any orders
    const orderItems = await prisma.cartItem.findFirst({
      where: { productId },
      include: {
        cart: {
          include: {
            order: true,
          },
        },
      },
    });

    if (orderItems?.cart?.order) {
      return NextResponse.json(
        { error: 'Cannot delete product that has been ordered' },
        { status: 400 }
      );
    }

    // Delete product and related data (cascade)
    await prisma.product.delete({
      where: { id: productId },
    });

    return NextResponse.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    );
  }
}
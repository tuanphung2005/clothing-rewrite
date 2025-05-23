// app/api/products/[id]/route.ts
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

    // Format the response to match ProductDetail interface
    const formattedProduct = {
      id: product.id,
      name: product.name,
      description: product.description,
      material: product.material,
      image: product.images.map(img => img.url),
      colors: product.colors.map(c => ({ name: c.name, color: c.color })),
      price: product.price,
      salePrice: product.salePrice,
      sizes: product.sizes.map(s => s.value),
      type: product.type,
      gender: product.gender,
    };

    return NextResponse.json(formattedProduct);
  } catch (error) {
    console.error('Error fetching product details:', error);
    return NextResponse.json(
      { error: 'Failed to fetch product details' },
      { status: 500 }
    );
  }
}
// app/api/admin/products/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search');
    const type = searchParams.get('type');
    const gender = searchParams.get('gender');

    const skip = (page - 1) * limit;

    // Build filters
    const where: any = {};
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (type && type !== 'all') {
      where.type = type;
    }

    if (gender && gender !== 'all') {
      where.gender = gender;
    }

    // Get products with pagination
    const [products, totalCount] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          images: true,
          colors: true,
          sizes: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take: limit,
      }),
      prisma.product.count({ where }),
    ]);

    return NextResponse.json({
      products,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching admin products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
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

    // Validation
    if (!name || !type || !gender || !price) {
      return NextResponse.json(
        { error: 'Name, type, gender, and price are required' },
        { status: 400 }
      );
    }

    // Create product with related data
    const product = await prisma.product.create({
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

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
}
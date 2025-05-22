import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    // Get URL parameters for filtering
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const gender = searchParams.get('gender');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const sizes = searchParams.getAll('size');
    const sort = searchParams.get('sort');
    
    // Build query filters
    const filters: any = {};
    
    // Basic filters
    if (type && type !== 'all') filters.type = type;
    if (gender && gender !== 'all') filters.gender = gender;
    
    // Price range filter
    if (minPrice || maxPrice) {
      filters.OR = [
        {
          price: {
            gte: minPrice ? parseFloat(minPrice) : 0,
            lte: maxPrice ? parseFloat(maxPrice) : 9999999
          }
        },
        {
          salePrice: {
            gte: minPrice ? parseFloat(minPrice) : 0,
            lte: maxPrice ? parseFloat(maxPrice) : 9999999
          }
        }
      ];
    }
    
    // Size filter
    if (sizes.length > 0) {
      filters.sizes = {
        some: {
          value: {
            in: sizes
          }
        }
      };
    }
    
    // Determine sort order
    let orderBy = {};
    if (sort === 'price-asc') {
      orderBy = { price: 'asc' };
    } else if (sort === 'price-desc') {
      orderBy = { price: 'desc' };
    } else {
      orderBy = { createdAt: 'desc' }; // default to newest
    }
    
    // Fetch products with filters
    const products = await prisma.product.findMany({
      where: filters,
      orderBy,
      include: {
        images: true,
        colors: true,
        sizes: true,
      },
    });
    
    // Format response
    const formattedProducts = products.map(product => ({
      id: product.id,
      name: product.name,
      image: product.images.map(img => img.url),
      colors: product.colors.map(c => c.color),
      price: product.price,
      salePrice: product.salePrice,
      sizes: product.sizes.map(s => s.value),
      type: product.type,
      gender: product.gender,
    }));
    
    return NextResponse.json(formattedProducts);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}
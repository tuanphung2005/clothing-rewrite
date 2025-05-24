// app/api/cart/route.ts
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { prisma } from '@/lib/prisma';

async function getUserFromToken(request: Request) {
  const token = request.headers.get('cookie')
    ?.split('; ')
    .find(row => row.startsWith('auth-token='))
    ?.split('=')[1];

  if (!token) throw new Error('No token provided');

  const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: number };
  return decoded.userId;
}

export async function GET(request: Request) {
  try {
    const userId = await getUserFromToken(request);

    // Find active cart (not associated with any orders)
    const cart = await prisma.cart.findFirst({
      where: { 
        userId,
        order: {
          is: null
        }
      },
      include: {
        items: {
          include: {
            product: {
              include: {
                images: true,
              },
            },
          },
        },
      },
    });

    // If no active cart exists, create one
    if (!cart) {
      const newCart = await prisma.cart.create({
        data: { userId },
        include: {
          items: {
            include: {
              product: {
                include: {
                  images: true,
                },
              },
            },
          },
        },
      });
      return NextResponse.json(newCart);
    }

    return NextResponse.json(cart);
  } catch (error) {
    console.error('Cart fetch error:', error);
    return NextResponse.json(
      { message: 'Failed to fetch cart' },
      { status: 500 }
    );
  }
}
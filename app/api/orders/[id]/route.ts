// app/api/orders/[id]/route.ts
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

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const userId = await getUserFromToken(request);
    const orderId = parseInt(params.id);

    if (isNaN(orderId)) {
      return NextResponse.json(
        { error: 'Invalid order ID' },
        { status: 400 }
      );
    }

    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        cart: {
          userId: userId,
        },
      },
      include: {
        address: true,
        cart: {
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
        },
      },
    });

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    return NextResponse.json(
      { error: 'Failed to fetch order details' },
      { status: 500 }
    );
  }
}
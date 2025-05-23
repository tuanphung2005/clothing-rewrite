// app/api/cart/update/route.ts
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

export async function PUT(request: Request) {
  try {
    const userId = await getUserFromToken(request);
    const { itemId, quantity } = await request.json();

    // Verify the cart item belongs to the user
    const cartItem = await prisma.cartItem.findFirst({
      where: {
        id: itemId,
        cart: {
          userId: userId,
        },
      },
    });

    if (!cartItem) {
      return NextResponse.json(
        { message: 'Cart item not found' },
        { status: 404 }
      );
    }

    // Update the cart item quantity
    await prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity },
    });

    return NextResponse.json({ message: 'Cart updated successfully' });
  } catch (error) {
    console.error('Cart update error:', error);
    return NextResponse.json(
      { message: 'Failed to update cart' },
      { status: 500 }
    );
  }
}
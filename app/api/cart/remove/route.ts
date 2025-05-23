// app/api/cart/remove/route.ts
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

export async function DELETE(request: Request) {
  try {
    const userId = await getUserFromToken(request);
    const { itemId } = await request.json();

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

    // Delete the cart item
    await prisma.cartItem.delete({
      where: { id: itemId },
    });

    return NextResponse.json({ message: 'Item removed from cart' });
  } catch (error) {
    console.error('Cart remove error:', error);
    return NextResponse.json(
      { message: 'Failed to remove item' },
      { status: 500 }
    );
  }
}
// app/api/cart/clear/route.ts
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

    // Find the user's cart
    const cart = await prisma.cart.findFirst({
      where: { userId },
    });

    if (!cart) {
      return NextResponse.json({ message: 'Cart cleared' });
    }

    // Delete all items in the cart
    await prisma.cartItem.deleteMany({
      where: { cartId: cart.id },
    });

    return NextResponse.json({ message: 'Cart cleared successfully' });
  } catch (error) {
    console.error('Cart clear error:', error);
    return NextResponse.json(
      { message: 'Failed to clear cart' },
      { status: 500 }
    );
  }
}
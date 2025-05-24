// app/api/cart/add/route.ts
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

export async function POST(request: Request) {
  try {
    const userId = await getUserFromToken(request);
    const { productId, quantity } = await request.json();

    // Find or create active cart (not associated with orders)
    let cart = await prisma.cart.findFirst({
      where: { 
        userId,
        order: {
          is: null
        }
      },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId },
      });
    }

    // Check if item already exists in cart
    const existingItem = await prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        productId,
      },
    });

    if (existingItem) {
      // Update quantity
      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity },
      });
    } else {
      // Create new cart item
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          quantity,
        },
      });
    }

    return NextResponse.json({ message: 'Item added to cart' });
  } catch (error) {
    console.error('Cart add error:', error);
    return NextResponse.json(
      { message: 'Failed to add item to cart' },
      { status: 500 }
    );
  }
}
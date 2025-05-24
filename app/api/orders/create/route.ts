// app/api/orders/create/route.ts
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
    console.log('Order creation API called');
    
    const userId = await getUserFromToken(request);
    console.log('User ID:', userId);
    
    const orderData = await request.json();
    console.log('Order data received:', orderData);

    // Start a transaction to ensure data consistency
    const result = await prisma.$transaction(async (tx) => {
      // 1. Get user's current cart
      const cart = await tx.cart.findFirst({
        where: { 
          userId,
          order: {
            is: null // Only get carts not associated with orders
          }
        },
        include: { 
          items: {
            include: {
              product: true
            }
          }
        },
      });

      if (!cart || cart.items.length === 0) {
        throw new Error('Cart is empty or not found');
      }

      console.log('Found cart with items:', cart.items.length);

      // 2. Create address for this order
      const address = await tx.address.create({
        data: {
          userId: userId,
          street: orderData.shippingAddress.street,
          city: orderData.shippingAddress.city,
          state: orderData.shippingAddress.state || 'Unknown',
          postalCode: orderData.shippingAddress.postalCode || '00000',
          country: orderData.shippingAddress.country || 'Vietnam',
          isDefault: false,
        },
      });

      console.log('Created address:', address.id);

      // 3. Create the order
      const order = await tx.order.create({
        data: {
          cartId: cart.id,
          addressId: address.id,
          totalAmount: orderData.total,
          paymentMethod: orderData.paymentMethod,
          status: orderData.paymentMethod === 'cod' ? 'PENDING' : 'PAID',
        },
      });

      console.log('Created order:', order.id);

      // 4. Create a new cart for the user (so they can continue shopping)
      const newCart = await tx.cart.create({
        data: {
          userId: userId,
        },
      });

      console.log('Created new cart:', newCart.id);

      return { 
        orderId: order.id, 
        order, 
        address,
        newCartId: newCart.id
      };
    });

    console.log('Transaction completed successfully:', result.orderId);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Order creation error:', error);
    
    // Return more detailed error information
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorStack = error instanceof Error ? error.stack : undefined;
    
    console.error('Error details:', { message: errorMessage, stack: errorStack });
    
    return NextResponse.json(
      { 
        error: 'Failed to create order',
        message: errorMessage,
        details: process.env.NODE_ENV === 'development' ? errorStack : undefined
      },
      { status: 500 }
    );
  }
}
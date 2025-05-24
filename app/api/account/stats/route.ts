// app/api/account/stats/route.ts
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

    // Get all orders for the user
    const orders = await prisma.order.findMany({
      where: {
        cart: {
          userId: userId,
        },
      },
    });

    // Calculate stats
    const totalOrders = orders.length;
    const totalSpent = orders.reduce((sum, order) => sum + order.totalAmount, 0);
    const pendingOrders = orders.filter(order => 
      ['PENDING', 'PAID', 'SHIPPED'].includes(order.status)
    ).length;
    const completedOrders = orders.filter(order => 
      order.status === 'DELIVERED'
    ).length;

    return NextResponse.json({
      totalOrders,
      totalSpent,
      pendingOrders,
      completedOrders,
    });
  } catch (error) {
    console.error('Error fetching user stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user stats' },
      { status: 500 }
    );
  }
}
// app/api/admin/dashboard/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Simple admin check - in production, you should implement proper admin authentication
export async function GET(request: Request) {
  try {
    // For now, we'll skip auth check since you're using localStorage admin auth
    // In production, you should verify admin token here

    console.log('Fetching admin dashboard stats...');

    // Get dashboard statistics
    const [
      totalOrders,
      totalRevenue,
      totalProducts,
      totalCustomers,
      pendingOrders,
      recentOrders
    ] = await Promise.all([
      // Total orders
      prisma.order.count(),
      
      // Total revenue from completed orders
      prisma.order.aggregate({
        _sum: {
          totalAmount: true,
        },
        where: {
          status: {
            in: ['PAID', 'DELIVERED'],
          },
        },
      }),
      
      // Total products
      prisma.product.count(),
      
      // Total customers (non-admin users)
      prisma.user.count({
        where: {
          role: 'CUSTOMER',
        },
      }),
      
      // Pending orders
      prisma.order.count({
        where: {
          status: {
            in: ['PENDING', 'PAID'],
          },
        },
      }),
      
      // Recent orders with customer info
      prisma.order.findMany({
        take: 5,
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          cart: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
            },
          },
        },
      }),
    ]);

    const dashboardStats = {
      totalOrders,
      totalRevenue: totalRevenue._sum.totalAmount || 0,
      totalProducts,
      totalCustomers,
      pendingOrders,
      recentOrders: recentOrders.map(order => ({
        id: order.id,
        customerName: order.cart.user.name || order.cart.user.email,
        total: order.totalAmount,
        status: order.status,
        createdAt: order.createdAt,
      })),
    };

    console.log('Dashboard stats fetched successfully:', dashboardStats);

    return NextResponse.json(dashboardStats);
  } catch (error) {
    console.error('Dashboard stats error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard stats' },
      { status: 500 }
    );
  }
}
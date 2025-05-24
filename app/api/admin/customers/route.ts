// app/api/admin/customers/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search');
    const role = searchParams.get('role');
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    const skip = (page - 1) * limit;

    // Build filters
    const where: any = {};
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (role && role !== 'all') {
      where.role = role;
    }

    // Build orderBy
    const orderBy: any = {};
    orderBy[sortBy] = sortOrder;

    // Get customers with pagination and stats
    const [customers, totalCount] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          createdAt: true,
          updatedAt: true,
          _count: {
            select: {
              carts: {
                where: {
                  order: {
                    isNot: null,
                  },
                },
              },
            },
          },
        },
        orderBy,
        skip,
        take: limit,
      }),
      prisma.user.count({ where }),
    ]);

    // Get additional stats for each customer
    const customersWithStats = await Promise.all(
      customers.map(async (customer) => {
        const [totalSpent, lastOrderDate] = await Promise.all([
          prisma.order.aggregate({
            where: {
              cart: {
                userId: customer.id,
              },
              status: {
                in: ['PAID', 'DELIVERED'],
              },
            },
            _sum: {
              totalAmount: true,
            },
          }),
          prisma.order.findFirst({
            where: {
              cart: {
                userId: customer.id,
              },
            },
            orderBy: {
              createdAt: 'desc',
            },
            select: {
              createdAt: true,
            },
          }),
        ]);

        return {
          ...customer,
          totalOrders: customer._count.carts,
          totalSpent: totalSpent._sum.totalAmount || 0,
          lastOrderDate: lastOrderDate?.createdAt || null,
        };
      })
    );

    return NextResponse.json({
      customers: customersWithStats,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching customers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch customers' },
      { status: 500 }
    );
  }
}
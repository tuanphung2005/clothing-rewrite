// app/api/admin/customers/[id]/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const customerId = parseInt(params.id);

    if (isNaN(customerId)) {
      return NextResponse.json(
        { error: 'Invalid customer ID' },
        { status: 400 }
      );
    }

    // Get customer details with orders and addresses
    const customer = await prisma.user.findUnique({
      where: { id: customerId },
      include: {
        addresses: true,
        carts: {
          where: {
            order: {
              isNot: null,
            },
          },
          include: {
            order: {
              include: {
                address: true,
              },
            },
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
          orderBy: {
            createdAt: 'desc',
          },
          take: 10, // Last 10 orders
        },
      },
    });

    if (!customer) {
      return NextResponse.json(
        { error: 'Customer not found' },
        { status: 404 }
      );
    }

    // Calculate customer stats
    const totalOrders = customer.carts.length;
    const totalSpent = customer.carts.reduce((sum, cart) => {
      return sum + (cart.order?.totalAmount || 0);
    }, 0);
    
    const orders = customer.carts.map(cart => cart.order).filter(Boolean);
    const pendingOrders = orders.filter(order => 
      ['PENDING', 'PAID', 'SHIPPED'].includes(order!.status)
    ).length;
    
    const completedOrders = orders.filter(order => 
      order!.status === 'DELIVERED'
    ).length;

    return NextResponse.json({
      ...customer,
      stats: {
        totalOrders,
        totalSpent,
        pendingOrders,
        completedOrders,
      },
    });
  } catch (error) {
    console.error('Error fetching customer:', error);
    return NextResponse.json(
      { error: 'Failed to fetch customer' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const customerId = parseInt(params.id);
    const { name, email, role } = await request.json();

    if (isNaN(customerId)) {
      return NextResponse.json(
        { error: 'Invalid customer ID' },
        { status: 400 }
      );
    }

    // Check if customer exists
    const existingCustomer = await prisma.user.findUnique({
      where: { id: customerId },
    });

    if (!existingCustomer) {
      return NextResponse.json(
        { error: 'Customer not found' },
        { status: 404 }
      );
    }

    // Check if email is already taken by another user
    if (email && email !== existingCustomer.email) {
      const emailExists = await prisma.user.findFirst({
        where: {
          email: email,
          id: { not: customerId },
        },
      });

      if (emailExists) {
        return NextResponse.json(
          { error: 'Email is already taken' },
          { status: 400 }
        );
      }
    }

    // Update customer
    const updatedCustomer = await prisma.user.update({
      where: { id: customerId },
      data: {
        name: name || null,
        email: email,
        role: role,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(updatedCustomer);
  } catch (error) {
    console.error('Error updating customer:', error);
    return NextResponse.json(
      { error: 'Failed to update customer' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const customerId = parseInt(params.id);

    if (isNaN(customerId)) {
      return NextResponse.json(
        { error: 'Invalid customer ID' },
        { status: 400 }
      );
    }

    // Check if customer exists
    const existingCustomer = await prisma.user.findUnique({
      where: { id: customerId },
    });

    if (!existingCustomer) {
      return NextResponse.json(
        { error: 'Customer not found' },
        { status: 404 }
      );
    }

    // Check if customer has orders
    const hasOrders = await prisma.order.findFirst({
      where: {
        cart: {
          userId: customerId,
        },
      },
    });

    if (hasOrders) {
      return NextResponse.json(
        { error: 'Cannot delete customer with existing orders' },
        { status: 400 }
      );
    }

    // Delete customer and related data
    await prisma.$transaction(async (tx) => {
      // Delete cart items first
      await tx.cartItem.deleteMany({
        where: {
          cart: {
            userId: customerId,
          },
        },
      });

      // Delete carts
      await tx.cart.deleteMany({
        where: {
          userId: customerId,
        },
      });

      // Delete addresses
      await tx.address.deleteMany({
        where: {
          userId: customerId,
        },
      });

      // Delete user
      await tx.user.delete({
        where: { id: customerId },
      });
    });

    return NextResponse.json({ message: 'Customer deleted successfully' });
  } catch (error) {
    console.error('Error deleting customer:', error);
    return NextResponse.json(
      { error: 'Failed to delete customer' },
      { status: 500 }
    );
  }
}
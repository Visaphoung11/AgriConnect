import Order from '../models/orderModel';
import OrderItem from '../models/orderItemModel';
import { IOrder } from '../models/orderModel';
import { UpdateProductStock } from './productService';
import { IProduct } from '../models/productModel';

export const CreateOrder = async (orderData: any) => {
  const session = await Order.startSession();
  session.startTransaction();
  
  try {
    const { items, ...orderDetails } = orderData;
    
    // Create order
    const order = new Order({
      ...orderDetails,
      status: 'pending',
      total: 0, // Will be calculated from items
    });
    
    // Calculate total and validate products
    let total = 0;
    const orderItems = [];
    
    for (const item of items) {
      // Check product availability and get price
      const productResult = await UpdateProductStock(
        item.productId,
        item.quantity,
        'decrement'
      );
      
      if (!productResult.success) {
        throw new Error(`Product ${item.productId}: ${productResult.message}`);
      }
      
      // Type assertion since we know the data exists when success is true
      const productData = productResult.data as IProduct;
      const subtotal = productData.price * item.quantity;
      total += subtotal;
      
      // Create order item
      const orderItem = new OrderItem({
        orderId: order._id,
        productId: item.productId,
        quantity: item.quantity,
        subtotal,
      });
      
      orderItems.push(orderItem);
    }
    
    // Update order total
    order.total = total;
    
    // Save order and order items
    await order.save({ session });
    await OrderItem.insertMany(orderItems, { session });
    
    await session.commitTransaction();
    session.endSession();
    
    // Populate order with items
    const savedOrder = await Order.findById(order._id)
      .populate({
        path: 'items',
        populate: {
          path: 'productId',
          select: 'name price image',
        },
      });
    
    return {
      status: 201,
      success: true,
      message: 'Order created successfully',
      data: savedOrder,
    };
  } catch (error: any) {
    await session.abortTransaction();
    session.endSession();
    
    return {
      status: 500,
      success: false,
      message: error.message || 'Failed to create order',
    };
  }
};

export const GetOrders = async (filters: any = {}) => {
  try {
    const { status, startDate, endDate, sortBy = 'createdAt', sortOrder = 'desc' } = filters;
    
    const query: any = {};
    
    if (status) {
      query.status = status;
    }
    
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }
    
    const sortOption: any = {};
    sortOption[sortBy] = sortOrder === 'desc' ? -1 : 1;
    
    const orders = await Order.find(query)
      .sort(sortOption)
      .populate({
        path: 'items',
        populate: {
          path: 'productId',
          select: 'name price image',
        },
      });
    
    return {
      status: 200,
      success: true,
      data: orders,
    };
  } catch (error: any) {
    return {
      status: 500,
      success: false,
      message: error.message || 'Failed to fetch orders',
    };
  }
};

export const GetOrderById = async (id: string) => {
  try {
    const order = await Order.findById(id)
      .populate({
        path: 'items',
        populate: {
          path: 'productId',
          select: 'name price image',
        },
      });
    
    if (!order) {
      return {
        status: 404,
        success: false,
        message: 'Order not found',
      };
    }
    
    return {
      status: 200,
      success: true,
      data: order,
    };
  } catch (error: any) {
    return {
      status: 500,
      success: false,
      message: error.message || 'Failed to fetch order',
    };
  }
};

export const UpdateOrderStatus = async (id: string, status: string) => {
  try {
    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    
    if (!validStatuses.includes(status)) {
      return {
        status: 400,
        success: false,
        message: 'Invalid status',
      };
    }
    
    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );
    
    if (!updatedOrder) {
      return {
        status: 404,
        success: false,
        message: 'Order not found',
      };
    }
    
    return {
      status: 200,
      success: true,
      message: 'Order status updated successfully',
      data: updatedOrder,
    };
  } catch (error: any) {
    return {
      status: 500,
      success: false,
      message: error.message || 'Failed to update order status',
    };
  }
};

export const DeleteOrder = async (id: string) => {
  const session = await Order.startSession();
  session.startTransaction();
  
  try {
    // First, find and delete order items
    await OrderItem.deleteMany({ orderId: id }, { session });
    
    // Then delete the order
    const deletedOrder = await Order.findByIdAndDelete(id, { session });
    
    if (!deletedOrder) {
      await session.abortTransaction();
      session.endSession();
      
      return {
        status: 404,
        success: false,
        message: 'Order not found',
      };
    }
    
    await session.commitTransaction();
    session.endSession();
    
    return {
      status: 200,
      success: true,
      message: 'Order deleted successfully',
    };
  } catch (error: any) {
    await session.abortTransaction();
    session.endSession();
    
    return {
      status: 500,
      success: false,
      message: error.message || 'Failed to delete order',
    };
  }
};

import OrderItem from '../models/orderItemModel';
import { IOrderItem } from '../models/orderModel';

export const GetOrderItemsByOrderId = async (orderId: string) => {
  try {
    const orderItems = await OrderItem.find({ orderId })
      .populate('productId', 'name price image');
    
    return {
      status: 200,
      success: true,
      data: orderItems,
    };
  } catch (error: any) {
    return {
      status: 500,
      success: false,
      message: error.message || 'Failed to fetch order items',
    };
  }
};

export const GetOrderItemById = async (id: string) => {
  try {
    const orderItem = await OrderItem.findById(id)
      .populate('productId', 'name price image');
    
    if (!orderItem) {
      return {
        status: 404,
        success: false,
        message: 'Order item not found',
      };
    }
    
    return {
      status: 200,
      success: true,
      data: orderItem,
    };
  } catch (error: any) {
    return {
      status: 500,
      success: false,
      message: error.message || 'Failed to fetch order item',
    };
  }
};

export const UpdateOrderItem = async (id: string, updateData: Partial<IOrderItem>) => {
  try {
    const updatedOrderItem = await OrderItem.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    )
      .populate('productId', 'name price image');
    
    if (!updatedOrderItem) {
      return {
        status: 404,
        success: false,
        message: 'Order item not found',
      };
    }
    
    return {
      status: 200,
      success: true,
      message: 'Order item updated successfully',
      data: updatedOrderItem,
    };
  } catch (error: any) {
    return {
      status: 500,
      success: false,
      message: error.message || 'Failed to update order item',
    };
  }
};

export const DeleteOrderItem = async (id: string) => {
  try {
    const deletedOrderItem = await OrderItem.findByIdAndDelete(id);
    
    if (!deletedOrderItem) {
      return {
        status: 404,
        success: false,
        message: 'Order item not found',
      };
    }
    
    return {
      status: 200,
      success: true,
      message: 'Order item deleted successfully',
    };
  } catch (error: any) {
    return {
      status: 500,
      success: false,
      message: error.message || 'Failed to delete order item',
    };
  }
};

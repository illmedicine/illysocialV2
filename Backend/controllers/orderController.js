// In-memory order storage (in production, use a database)
const orders = new Map();

// Generate unique order ID
function generateOrderId() {
  return `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Create new order
export async function createOrder(req, res) {
  try {
    const { service, quantity, url, price, paymentMethod, userId } = req.body;

    if (!service || !quantity || !url || !price || !paymentMethod) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: service, quantity, url, price, paymentMethod'
      });
    }

    const orderId = generateOrderId();
    const order = {
      id: orderId,
      service,
      quantity,
      url,
      price,
      paymentMethod,
      userId: userId || 'anonymous',
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    orders.set(orderId, order);

    res.status(201).json({
      success: true,
      order
    });
  } catch (error) {
    console.error('Order creation error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to create order'
    });
  }
}

// Get order by ID
export async function getOrder(req, res) {
  try {
    const { orderId } = req.params;

    const order = orders.get(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }

    res.json({
      success: true,
      order
    });
  } catch (error) {
    console.error('Get order error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to get order'
    });
  }
}

// Update order status
export async function updateOrderStatus(req, res) {
  try {
    const { orderId } = req.params;
    const { status, paymentDetails } = req.body;

    const order = orders.get(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }

    // Validate status
    const validStatuses = ['pending', 'processing', 'completed', 'failed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
      });
    }

    order.status = status;
    order.updatedAt = new Date().toISOString();

    if (paymentDetails) {
      order.paymentDetails = paymentDetails;
    }

    orders.set(orderId, order);

    res.json({
      success: true,
      order
    });
  } catch (error) {
    console.error('Update order status error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to update order status'
    });
  }
}

// Get all orders (admin endpoint)
export async function getAllOrders(req, res) {
  try {
    const allOrders = Array.from(orders.values());

    res.json({
      success: true,
      orders: allOrders,
      count: allOrders.length
    });
  } catch (error) {
    console.error('Get all orders error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to get all orders'
    });
  }
}

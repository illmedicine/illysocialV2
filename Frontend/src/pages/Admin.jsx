import { useState, useEffect } from 'react';

const Admin = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [filter, setFilter] = useState('all');

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/orders`);
      if (!response.ok) throw new Error('Failed to fetch orders');
      const data = await response.json();
      setOrders(data.orders || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await fetch(`${API_URL}/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (!response.ok) throw new Error('Failed to update order');

      const data = await response.json();
      setOrders(orders.map(order => 
        order.id === orderId ? data.order : order
      ));
      setSelectedOrder(null);
    } catch (err) {
      alert('Failed to update order: ' + err.message);
    }
  };

  const filteredOrders = filter === 'all' 
    ? orders 
    : orders.filter(order => order.status === filter);

  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    processing: orders.filter(o => o.status === 'processing').length,
    completed: orders.filter(o => o.status === 'completed').length,
    failed: orders.filter(o => o.status === 'failed').length,
    totalRevenue: orders
      .filter(o => o.status === 'completed')
      .reduce((sum, order) => sum + parseFloat(order.price), 0)
      .toFixed(2)
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: '#f59e0b',
      processing: '#3b82f6',
      completed: '#10b981',
      failed: '#ef4444',
      cancelled: '#6b7280'
    };
    return colors[status] || '#6b7280';
  };

  const getPaymentMethodIcon = (method) => {
    return method === 'paypal' ? '💳' : '◎';
  };

  if (loading) {
    return (
      <div className="admin-page">
        <div className="admin-container">
          <h1 className="admin-title">Admin Dashboard</h1>
          <div className="loading">Loading orders...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-page">
        <div className="admin-container">
          <h1 className="admin-title">Admin Dashboard</h1>
          <div className="error-message">{error}</div>
          <button onClick={fetchOrders} className="retry-btn">Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="admin-container">
        <div className="admin-header">
          <h1 className="admin-title">Admin Dashboard</h1>
          <button onClick={fetchOrders} className="refresh-btn">🔄 Refresh</button>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card total">
            <div className="stat-value">{stats.total}</div>
            <div className="stat-label">Total Orders</div>
          </div>
          <div className="stat-card pending">
            <div className="stat-value">{stats.pending}</div>
            <div className="stat-label">Pending</div>
          </div>
          <div className="stat-card processing">
            <div className="stat-value">{stats.processing}</div>
            <div className="stat-label">Processing</div>
          </div>
          <div className="stat-card completed">
            <div className="stat-value">{stats.completed}</div>
            <div className="stat-label">Completed</div>
          </div>
          <div className="stat-card revenue">
            <div className="stat-value">${stats.totalRevenue}</div>
            <div className="stat-label">Total Revenue</div>
          </div>
        </div>

        {/* Filter */}
        <div className="filter-bar">
          <span className="filter-label">Filter by status:</span>
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Orders</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="completed">Completed</option>
            <option value="failed">Failed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {/* Orders Table */}
        <div className="orders-table-container">
          <table className="orders-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Service</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Payment</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="8" className="no-orders">No orders found</td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id}>
                    <td className="order-id">{order.id}</td>
                    <td className="order-service">{order.service}</td>
                    <td className="order-quantity">{order.quantity}</td>
                    <td className="order-price">${order.price}</td>
                    <td className="order-payment">
                      {getPaymentMethodIcon(order.paymentMethod)} {order.paymentMethod}
                    </td>
                    <td className="order-status">
                      <span 
                        className="status-badge"
                        style={{ backgroundColor: getStatusColor(order.status) }}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="order-date">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="order-actions">
                      <button 
                        onClick={() => setSelectedOrder(order)}
                        className="action-btn view-btn"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Order Detail Modal */}
        {selectedOrder && (
          <div className="modal-overlay" onClick={() => setSelectedOrder(null)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Order Details</h2>
                <button onClick={() => setSelectedOrder(null)} className="close-btn">×</button>
              </div>
              <div className="modal-body">
                <div className="order-detail-grid">
                  <div className="detail-item">
                    <label>Order ID:</label>
                    <span>{selectedOrder.id}</span>
                  </div>
                  <div className="detail-item">
                    <label>Service:</label>
                    <span>{selectedOrder.service}</span>
                  </div>
                  <div className="detail-item">
                    <label>Quantity:</label>
                    <span>{selectedOrder.quantity}</span>
                  </div>
                  <div className="detail-item">
                    <label>Price:</label>
                    <span>${selectedOrder.price}</span>
                  </div>
                  <div className="detail-item">
                    <label>Payment Method:</label>
                    <span>{selectedOrder.paymentMethod}</span>
                  </div>
                  <div className="detail-item">
                    <label>Status:</label>
                    <span>{selectedOrder.status}</span>
                  </div>
                  <div className="detail-item full-width">
                    <label>URL:</label>
                    <span className="url-text">{selectedOrder.url}</span>
                  </div>
                  <div className="detail-item">
                    <label>Created:</label>
                    <span>{new Date(selectedOrder.createdAt).toLocaleString()}</span>
                  </div>
                  <div className="detail-item">
                    <label>Updated:</label>
                    <span>{new Date(selectedOrder.updatedAt).toLocaleString()}</span>
                  </div>
                </div>

                <div className="status-update-section">
                  <label>Update Status:</label>
                  <div className="status-buttons">
                    <button 
                      onClick={() => updateOrderStatus(selectedOrder.id, 'pending')}
                      className="status-btn pending-btn"
                    >
                      Pending
                    </button>
                    <button 
                      onClick={() => updateOrderStatus(selectedOrder.id, 'processing')}
                      className="status-btn processing-btn"
                    >
                      Processing
                    </button>
                    <button 
                      onClick={() => updateOrderStatus(selectedOrder.id, 'completed')}
                      className="status-btn completed-btn"
                    >
                      Completed
                    </button>
                    <button 
                      onClick={() => updateOrderStatus(selectedOrder.id, 'failed')}
                      className="status-btn failed-btn"
                    >
                      Failed
                    </button>
                    <button 
                      onClick={() => updateOrderStatus(selectedOrder.id, 'cancelled')}
                      className="status-btn cancelled-btn"
                    >
                      Cancelled
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;

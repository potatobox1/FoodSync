import React, { useState, useEffect } from 'react';
import '../styles/OrdersPage.css';

// Using the provided interfaces
interface Restaurant {
  _id: string;
  name: string;
  location: {
    latitude: number;
    longitude: number;
  };
}

interface FoodItem {
  _id: string;
  restaurant_id: string;
  restaurant: Restaurant;
  quantity: number;
  expiration_date: Date;
  name: string;
  category: string;
  status: "available" | "expired";
  created_at: Date;
  expiresIn: string;
  subCategory: "Savoury" | "Sweet" | "Beverage";
}

interface DonationRequest {
  _id: string;
  foodbank_id: string;
  food_id: string;
  requested_quantity: number;
  status: 'pending' | 'accepted' | 'cancelled' | 'completed';
  created_at: Date;
  foodItem?: FoodItem;
}

// Helper functions as provided
function getCategoryImage(subCategory: string): string {
  switch (subCategory) {
    case "Savoury":
      return "/images/savoury.jpg";
    case "Sweet":
      return "/images/sweet.jpg";
    case "Beverage":
      return "/images/beverage.jpg";
    default:
      return "/images/default-food.jpg";
  }
}

function determineSubCategory(category: string): "Savoury" | "Sweet" | "Beverage" {
  const lowerCategory = category.toLowerCase();

  if (
    lowerCategory.includes("beverage") ||
    lowerCategory.includes("drink") ||
    lowerCategory.includes("juice") ||
    lowerCategory.includes("water")
  ) {
    return "Beverage";
  } else if (
    lowerCategory.includes("sweet") ||
    lowerCategory.includes("dessert") ||
    lowerCategory.includes("cake") ||
    lowerCategory.includes("pastry")
  ) {
    return "Sweet";
  } else {
    return "Savoury";
  }
}

function formatExpiryTime(expirationDate: Date): string {
  const now = new Date();
  const diffMs = expirationDate.getTime() - now.getTime();
  const diffHrs = Math.round(diffMs / (1000 * 60 * 60));

  if (diffHrs < 1) {
    return "Less than 1h";
  } else if (diffHrs < 24) {
    return `${diffHrs}h`;
  } else {
    const days = Math.floor(diffHrs / 24);
    return `${days}d`;
  }
}

const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<DonationRequest[]>([]);
  const [filter, setFilter] = useState<string>('all');
  
  // Mock data for demonstration - replace with actual API call
  useEffect(() => {
    // This would be your actual API call
    // fetchOrders().then(data => setOrders(data));
    
    // Mock data with the updated interfaces
    const mockOrders = [
      {
        _id: '1',
        foodbank_id: 'fb123',
        food_id: 'food1',
        requested_quantity: 12,
        status: 'pending',
        created_at: new Date('2023-04-06T10:00:00'),
        foodItem: {
          _id: 'food1',
          restaurant_id: 'rest1',
          restaurant: {
            _id: 'rest1',
            name: 'Italian Corner Restaurant',
            location: { latitude: 40.7128, longitude: -74.0060 }
          },
          quantity: 20,
          expiration_date: new Date('2023-04-07T10:00:00'),
          name: 'Palao',
          category: 'Rice',
          status: 'available',
          created_at: new Date('2023-04-05T10:00:00'),
          expiresIn: '24h',
          subCategory: 'Savoury'
        }
      },
      {
        _id: '2',
        foodbank_id: 'fb123',
        food_id: 'food2',
        requested_quantity: 30,
        status: 'accepted',
        created_at: new Date('2023-04-05T14:30:00'),
        foodItem: {
          _id: 'food2',
          restaurant_id: 'rest1',
          restaurant: {
            _id: 'rest1',
            name: 'Italian Corner Restaurant',
            location: { latitude: 40.7128, longitude: -74.0060 }
          },
          quantity: 40,
          expiration_date: new Date('2023-04-06T14:30:00'),
          name: 'Daal',
          category: 'Soup',
          status: 'available',
          created_at: new Date('2023-04-04T14:30:00'),
          expiresIn: '24h',
          subCategory: 'Savoury'
        }
      },
      {
        _id: '3',
        foodbank_id: 'fb123',
        food_id: 'food3',
        requested_quantity: 50,
        status: 'completed',
        created_at: new Date('2023-04-04T09:15:00'),
        foodItem: {
          _id: 'food3',
          restaurant_id: 'rest1',
          restaurant: {
            _id: 'rest1',
            name: 'Italian Corner Restaurant',
            location: { latitude: 40.7128, longitude: -74.0060 }
          },
          quantity: 60,
          expiration_date: new Date('2023-04-05T09:15:00'),
          name: 'Lemonade',
          category: 'Drink',
          status: 'available',
          created_at: new Date('2023-04-03T09:15:00'),
          expiresIn: '24h',
          subCategory: 'Beverage'
        }
      },
      {
        _id: '4',
        foodbank_id: 'fb123',
        food_id: 'food4',
        requested_quantity: 25,
        status: 'cancelled',
        created_at: new Date('2023-04-03T16:45:00'),
        foodItem: {
          _id: 'food4',
          restaurant_id: 'rest1',
          restaurant: {
            _id: 'rest1',
            name: 'Italian Corner Restaurant',
            location: { latitude: 40.7128, longitude: -74.0060 }
          },
          quantity: 30,
          expiration_date: new Date('2023-04-04T16:45:00'),
          name: 'Halwa',
          category: 'Dessert',
          status: 'available',
          created_at: new Date('2023-04-02T16:45:00'),
          expiresIn: '24h',
          subCategory: 'Sweet'
        }
      }
    ] as DonationRequest[];
    
    setOrders(mockOrders);
  }, []);

  // Filter orders based on status
  const filteredOrders = filter === 'all' 
    ? orders 
    : orders.filter(order => order.status === filter);

  // Format date to readable string
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get status class for styling
  const getStatusClass = (status: string) => {
    switch(status) {
      case 'pending': return 'status-pending';
      case 'accepted': return 'status-accepted';
      case 'cancelled': return 'status-cancelled';
      case 'completed': return 'status-completed';
      default: return '';
    }
  };

  return (
    <div className="orders-page">
      <header className="header">
        <div className="logo">FoodSync</div>
        <nav className="navigation">
          <a href="#" className="nav-link">Dashboard</a>
          <a href="#" className="nav-link">Available Food</a>
          <a href="#" className="nav-link active">My Orders</a>
        </nav>
        {/* Profile picture removed as requested */}
      </header>

      <main className="main-content">
        <h1 className="page-title">My Food Bank Orders</h1>
        
        <div className="filter-container">
          <div className="filter-tabs">
            <button 
              className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              All Orders
            </button>
            <button 
              className={`filter-tab ${filter === 'pending' ? 'active' : ''}`}
              onClick={() => setFilter('pending')}
            >
              Pending
            </button>
            <button 
              className={`filter-tab ${filter === 'accepted' ? 'active' : ''}`}
              onClick={() => setFilter('accepted')}
            >
              Accepted
            </button>
            <button 
              className={`filter-tab ${filter === 'completed' ? 'active' : ''}`}
              onClick={() => setFilter('completed')}
            >
              Completed
            </button>
            <button 
              className={`filter-tab ${filter === 'cancelled' ? 'active' : ''}`}
              onClick={() => setFilter('cancelled')}
            >
              Cancelled
            </button>
          </div>
        </div>

        <div className="orders-grid">
          {filteredOrders.map(order => (
            <div className="order-card" key={order._id}>
              <div className="order-image-container">
                {order.foodItem && (
                  <img 
                    src={getCategoryImage(order.foodItem.subCategory) || "/placeholder.svg"} 
                    alt={order.foodItem.name} 
                    className="order-image" 
                  />
                )}
                {order.foodItem && order.foodItem.expiration_date && (
                  <div className="expires-tag">
                    Expires in {formatExpiryTime(order.foodItem.expiration_date)}
                  </div>
                )}
              </div>
              <div className="order-details">
                <h3 className="food-name">{order.foodItem?.name || 'Food Item'}</h3>
                <div className={`order-status ${getStatusClass(order.status)}`}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </div>
                <div className="order-provider">
                  <span className="provider-icon">🏢</span>
                  {order.foodItem?.restaurant.name || 'Food Provider'}
                </div>
                <div className="order-quantity">
                  Quantity requested: <span className="quantity-value">{order.requested_quantity} portions</span>
                </div>
                <div className="order-date">
                  Ordered on: <span className="date-value">{formatDate(order.created_at)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {filteredOrders.length === 0 && (
          <div className="no-orders">
            <p>No orders found with the selected filter.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default OrdersPage;
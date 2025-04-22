import React, { useEffect, useState } from "react";
import { Check, Clock, X } from "lucide-react";
import styles from "../styles/IncomingOrders.module.css";
import { fetchDonationRequestsForRestaurant } from "../services/addDonationRequest";
import { updateDonationRequestStatus } from "../services/addDonationRequest";
import { updateFoodItemStatus } from "../services/foodItems";
import { addCompletedOrder } from "../services/completedorders";
import { fetchUserById } from "../services/user";
import { getUserIdByFoodbankId } from "../services/foodbank";
import { useAppSelector } from "../redux/hooks";
import Navbar from "../components/NavBar";
import { updateTotalDonations } from "../services/restaurant";
interface DonationRequest {
  _id: string;
  requested_quantity: number;
  status: string;
  created_at: string;
  food_id: string;
  foodbank_id: string;
  foodItem: {
    _id: string;
    name: string;
    category: string;
    expiration_date: string;
  };
}

export default function IncomingOrders() {
  const [filterStatus, setFilterStatus] = useState<"all" | "pending" | "accepted" | "cancelled">("all");
  const user = useAppSelector((state: any) => state.user);
  const [orders, setOrders] = useState<DonationRequest[]>([]);
  const [foodbankNames, setFoodbankNames] = useState<{ [key: string]: string }>({});
  const restaurantId = user.type_id;
  console.log("I am :", restaurantId)

  useEffect(() => {
    const loadRequests = async () => {
      try {
        const data = await fetchDonationRequestsForRestaurant(restaurantId);
        setOrders(data);

        const namesMap: { [key: string]: string } = {};
        await Promise.all(
          data.map(async (order: DonationRequest) => {
            try {
              console.log(order.foodbank_id)
              const userId = await getUserIdByFoodbankId(order.foodbank_id);
              const user = await fetchUserById(userId);
              namesMap[order.foodbank_id] = user.name;
            } catch (error) {
              console.error("Error loading user name for foodbank:", order.foodbank_id);
            }
          })
        );
        setFoodbankNames(namesMap);
      } catch (err) {
        console.error("Failed to load donation requests", err);
      }
    };

    loadRequests();
  }, []);

  const handleAccept = async (id: string, foodItemId: string) => {
    try {
      await updateDonationRequestStatus(id, "accepted");
      await updateFoodItemStatus(foodItemId, "sold");
      await addCompletedOrder({
        restaurant_id: restaurantId,
        food_id: foodItemId,
        quantity: orders.find((order) => order._id === id)?.requested_quantity || 1,
      });
      await updateTotalDonations (restaurantId,orders.find((order) => order._id === id)?.requested_quantity || 1)

      const otherPendingRequests = orders.filter(
        (order) =>
          order.food_id === foodItemId &&
          order._id !== id &&
          order.status === "pending"
      );

      await Promise.all(
        otherPendingRequests.map((order) =>
          updateDonationRequestStatus(order._id, "cancelled")
        )
      );

      setOrders((prev) =>
        prev.map((order) => {
          if (order._id === id) return { ...order, status: "accepted" };
          if (
            order.food_id === foodItemId &&
            order._id !== id &&
            order.status === "pending"
          ) {
            return { ...order, status: "cancelled" };
          }
          return order;
        })
      );
    } catch (err) {
      console.error("Error while accepting the request:", err);
    }
  };

  const handleReject = async (id: string) => {
    try {
      await updateDonationRequestStatus(id, "cancelled");
      setOrders((prev) =>
        prev.map((order) =>
          order._id === id ? { ...order, status: "cancelled" } : order
        )
      );
    } catch (err) {
      console.error("Failed to cancel donation request:", err);
    }
  };

  return (
    <>
    <div>
      <Navbar active="orders" />

    </div>
   
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>Incoming Orders</h1>
        <div className={styles.filterContainer}>
          <label htmlFor="statusFilter" className={styles.filterLabel}>Filter by status:</label>
          <select
            id="statusFilter"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className={styles.filterSelect}
          >
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="accepted">Accepted</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>



        {
          orders.filter(order => filterStatus === "all" || order.status === filterStatus).length === 0 ? (
            <p className={styles.emptyState}>No orders available</p>
          ) : (
            orders
              .filter(order => filterStatus === "all" || order.status === filterStatus)
              .map((order) => (
                <div key={order._id} className={styles.card}>
                  <div className={styles.cardHeader}>
                    <div>
                      <h3 className={styles.customerName}>
                        {foodbankNames[order.foodbank_id] || "Loading..."}
                      </h3>
                      <div className={styles.orderTime}>
                        <Clock size={14} />
                        <span>
                          Order placed at{" "}
                          {new Date(order.created_at).toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                    <div className={styles.orderSummary}>
                      <div className={styles.orderId}>
                        Request ID #{order._id.slice(-5)}
                      </div>
                      <div className={styles.orderAmount}>
                        Quantity: {order.requested_quantity}
                      </div>
                    </div>
                  </div>

                  <div className={styles.itemList}>
                    <div className={styles.item}>
                      <div className={styles.itemLeft}>
                        <img
                          src={
                            order.foodItem.category === "Savoury"
                              ? "/images/savoury.jpg"
                              : order.foodItem.category === "Sweet"
                                ? "/images/sweet.jpg"
                                : order.foodItem.category === "Beverage"
                                  ? "/images/beverage.jpg"
                                  : "/placeholder.svg"
                          }
                          alt={order.foodItem.name}
                          className={styles.itemImage}
                        />
                        <div className={styles.itemInfo}>
                          <div className={styles.itemName}>{order.foodItem.name}</div>
                          <div className={styles.itemDetail}>
                            Category: {order.foodItem.category}
                          </div>
                          <div className={styles.itemDetail}>
                            Expires on{" "}
                            {new Date(
                              order.foodItem.expiration_date
                            ).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={styles.actions}>
                    {order.status === "pending" ? (
                      <>
                        <button
                          onClick={() => handleReject(order._id)}
                          className={styles.rejectBtn}
                        >
                          <X size={16} />
                          Reject Order
                        </button>
                        <button
                          onClick={() => handleAccept(order._id, order.food_id)}
                          className={styles.acceptBtn}
                        >
                          <Check size={16} />
                          Accept Order
                        </button>
                      </>
                    ) : (
                      <div
                        className={`${styles.statusBadge} ${order.status === "accepted"
                            ? styles.accepted
                            : styles.rejected
                          }`}
                      >
                        Order {order.status === "accepted" ? "Accepted" : "Rejected"}
                      </div>
                    )}
                  </div>
                </div>
              )))}

      </main>
    </div>
    </>
  );
}

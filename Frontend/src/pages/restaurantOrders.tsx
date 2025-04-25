import React, { useEffect, useState } from "react";
import { Check, Clock, X } from "lucide-react";
import styles from "../styles/incomingOrders.module.css";
import { fetchDonationRequestsForRestaurant } from "../services/donationRequests";
import { updateDonationRequestStatus } from "../services/donationRequests";
import { fetchFoodItemById, updateFoodItemStatus } from "../services/foodItems";
import { addCompletedOrder } from "../services/completedOrders";
import { fetchUserById } from "../services/user";
import { getUserIdByFoodbankId } from "../services/foodbank";
import { useAppSelector } from "../redux/hooks";
import Navbar from "../components/navBar";
import { updateTotalDonations } from "../services/restaurant";
import { sendEmail } from "../services/emails";
import { getDonationRequestById } from "../services/donationRequests";
import socket from "../services/socket"; 
import AIAssistant from '../components/aiAssistant'

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

  useEffect(() => {
    const loadRequests = async () => {
      try {
        const data = await fetchDonationRequestsForRestaurant(restaurantId);
        setOrders(data);

        const namesMap: { [key: string]: string } = {};
        await Promise.all(
          data.map(async (order: DonationRequest) => {
            try {
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

    socket.on("newDonationRequest", (data) => {
      console.log("📦 New donation request received:", data);
    
      const { request, foodItem } = data;
    
      const mappedOrder: DonationRequest = {
        _id: request._id.toString(),
        requested_quantity: request.requested_quantity,
        status: request.status,
        created_at: request.created_at,
        food_id: request.food_id.toString(),
        foodbank_id: request.foodbank_id.toString(),
        foodItem: {
          _id: foodItem._id.toString(),
          name: foodItem.name,
          category: foodItem.category,
          expiration_date: foodItem.expiration_date.toString(),
        },
      };
    
      console.log("🧾 Mapped Order:", mappedOrder);
      setOrders((prevOrders) => [mappedOrder, ...prevOrders]);
    });
    
  
    return () => {
      socket.off("newDonationRequest"); // 🧹 Cleanup on unmount
    };
    
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
      await updateTotalDonations(restaurantId, orders.find((order) => order._id === id)?.requested_quantity || 1)

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

      const foodItem = await fetchFoodItemById(foodItemId)
      const fullReq = await getDonationRequestById(id);
      const user_id = await getUserIdByFoodbankId(fullReq.foodbank_id);
      const foodbank = await fetchUserById(user_id)


      await sendEmail({
        to: foodbank.email,
        subject: "Donation Request Accepted",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; background: linear-gradient(135deg, #000000, #00a9cd); border-radius: 8px;">
            <h2 style="color: white;">✅ Request Accepted</h2>
            <p style="color: white;">Hi <strong>${foodbank.name}</strong>,</p>
            <p style="color: white;"><strong>${user.name}</strong> has accepted your request for <strong>${foodItem.name}</strong> (${foodItem.quantity} portions) 🥳</p>
            <p style="color: white;">Please make sure to pick up your order in a timely manner.</p>
            <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;" />
            <p style="color: white; font-size: 1em;">Thanks for using <strong>FoodSync</strong> ❤️</p>
          </div>
        `,
      });

    } catch (err) {
      console.error("Error while accepting the request:", err);
    }
  };

  const handleReject = async (id: string, foodItemId: string) => {
    try {
      await updateDonationRequestStatus(id, "cancelled");
      setOrders((prev) =>
        prev.map((order) =>
          order._id === id ? { ...order, status: "cancelled" } : order
        )
      );

      const foodItem = await fetchFoodItemById(foodItemId)
      const fullReq = await getDonationRequestById(id);
      const user_id = await getUserIdByFoodbankId(fullReq.foodbank_id);
      const foodbank = await fetchUserById(user_id)


      await sendEmail({
        to: foodbank.email,
        subject: "Donation Request Rejected",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; background: linear-gradient(135deg, #000000, #00a9cd); border-radius: 8px;">
            <h2 style="color: white;">❌ Request Rejected</h2>
            <p style="color: white;">Hi <strong>${foodbank.name}</strong>,</p>
            <p style="color: white;">We regret to inform you that your request for <strong>${foodItem.name}</strong> (${foodItem.quantity} units) was <strong>rejected</strong> by ${user.name}.</p>
            <p style="color: white;">There are still plenty of donations available. Feel free to explore other options in the app 🙌</p>
            <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;" />
            <p style="color: white; font-size: 1em;">Thanks for using <strong>FoodSync</strong> ❤️</p>
          </div>
        `,
      });

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
                            onClick={() => handleReject(order._id, order.food_id)}
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
        <AIAssistant />
      </div>
    </>
  );
}

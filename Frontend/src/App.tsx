import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/loginPage";
import Register from "./pages/register";
import 'leaflet/dist/leaflet.css';
import RestaurantDashboard from "./pages/restaurantDashboard";
import LandingPage from "./pages/landingPage";
import Contact from "./pages/contact";
import RestaurantInventory from "./pages/restaurantInventory";
import Leaderboard from "./pages/leaderboard";
import AvailableItems from "./pages/availableItems";
import OrdersPage from "./pages/OrdersPage";
import IncomingOrders from "./pages/restaurantOrders";
import AboutUs from "./pages/aboutUs";
import OrderReviews from "./pages/restaurantReviews";
import ReviewPage from "./pages/foodbankReviews";
import FoodbankDashboard from "./pages/foodbankDashboard";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/foodbank/dashboard" element={<FoodbankDashboard />} />         
        <Route path="/restaurant/dashboard" element={<RestaurantDashboard/>} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/restaurant/inventory" element={<RestaurantInventory/>} />
        <Route path="/foodbank/avaialableItems" element={<AvailableItems/>} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/foodbank/ordersPage" element={<OrdersPage />} />
        <Route path="/restaurant/incomingOrders" element={<IncomingOrders />} />
        <Route path="/aboutUs" element={<AboutUs/>} />
        <Route path="/foodbank/reviews" element={<ReviewPage />} />
        <Route path="/restaurant/reviews" element= {<OrderReviews/>}/>
      </Routes>
    </BrowserRouter>
  );
};

export default App;

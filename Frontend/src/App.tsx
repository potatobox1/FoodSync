import React from "react";
// import UserList from "./components/table";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import InfoPage from "./pages/InfoPage";
import Dashboard from "./pages/dashboard";
import Landing from "./pages/landing"
import Learn from "./pages/learn-more"
import Contact from "./pages/contact"
import Inventory from "./pages/MainInventory"


const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/register" element={<InfoPage />} />
        <Route path="/dashboard" element={<Dashboard />} /> {/* Add this */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/learn-more" element={<Learn />} />
        <Route path="/inventory" element={<Inventory />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;


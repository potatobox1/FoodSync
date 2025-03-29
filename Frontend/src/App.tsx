import React from "react";
// import UserList from "./components/table";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./components/LoginPage";
import InfoPage from "./components/InfoPage";
import Dashboard from "./components/dashboard";
import Landing from "./components/landing"
import Learn from "./components/learn-more"
import Contact from "./components/contact"


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
      </Routes>
    </BrowserRouter>
  );
};

export default App;


// import React from "react";
// // import UserList from "./components/table";
// const App: React.FC = () => {
//   return (
//     <div><LoginPage/></div>
//   );
// };

// export default App;


import React from "react";
// import UserList from "./components/table";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./components/LoginPage";
import InfoPage from "./components/InfoPage";
import Dashboard from "./components/dashboard";


const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<InfoPage />} />
        <Route path="/dashboard" element={<Dashboard />} /> {/* Add this */}
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


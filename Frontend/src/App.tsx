import React from "react";
import UserList from "./components/table";

const App: React.FC = () => {
  return (
    <div>
      <h1>Food Sync Users</h1>
      <UserList />
    </div>
  );
};

export default App;

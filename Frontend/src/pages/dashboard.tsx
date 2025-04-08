import { useSelector } from "react-redux";
import { RootState } from "../redux/store";


const Dashboard: React.FC = () => {
  const user = useSelector((state: RootState) => state.user);
  console.log(user.uid); // John Doe
  // console.log(user.id); // john@example.com
    return (
      <div>
        <h1>Dashboard</h1>
      </div>
    );
  };
  
  export default Dashboard;
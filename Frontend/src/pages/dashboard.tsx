import { useAppSelector } from "../redux/hooks";


const Dashboard: React.FC = () => {
  // const user = useSelector((state: RootState) => state.user);
  const user = useAppSelector((state:any) => state.user);
  console.log(user); 
    return (
      <div>
        <h1>Dashboard</h1>
      </div>
    );
  };
  
  export default Dashboard;
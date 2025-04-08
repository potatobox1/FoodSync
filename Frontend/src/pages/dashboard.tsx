import { useAppSelector } from "../redux/hooks";


const Dashboard: React.FC = () => {
  // const user = useSelector((state: RootState) => state.user);
  const uid = useAppSelector((state:any) => state.user.uid);
  console.log(uid); // John Doe
  // console.log(user.id); // john@example.com
    return (
      <div>
        <h1>Dashboard</h1>
      </div>
    );
  };
  
  export default Dashboard;
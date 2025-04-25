import { useNavigate } from "react-router-dom";
import { doSignInWithGoogle } from "../../../backend/src/firebase/auth";
import {useAppDispatch} from "../redux/hooks"
import { setUser, setFirebaseUid } from "../redux/userSlice"
import { getUserByFirebaseUID } from "../services/sign_up";
import {getRestaurantByUserId} from "../services/restaurant"
import {getFoodBankByUserId } from "../services/foodbank"
import socket from "../services/socket";
import "../styles/LoginPage.css"; // Import the new CSS file

export default function LoginPage() {
  const navigate = useNavigate(); // React Router hook for navigation
  const dispatch = useAppDispatch();
  let type = "none"
  const handleGoogleSignIn = async () => {
    try {
      const { user, isNewUser } = await doSignInWithGoogle(); // Destructure correctly
      console.log("User signed in:", user.user.uid);
    
      if (isNewUser) {
        dispatch(setFirebaseUid({ 
          firebase_uid: user.user.uid,
          photoURL: user.user.photoURL }));
        navigate("/register"); // Redirect new users to registration
      }
       
      else {
        ////
          let rest_id = "none"
          let fb_id = "none"
          try {
            const userData = await getUserByFirebaseUID(user.user.uid);
            if (userData.user_type == "restaurant")
            {
              type = "restaurant"
              const restaurant = await getRestaurantByUserId(userData.id);
              dispatch(setUser({
                firebase_uid: user.user.uid, //
                email: userData.email, //
                name:userData.name,    //
                user_type: userData.user_type, //
                photoURL: user.user.photoURL, //
                user_id: userData.id,  //
                type_id: restaurant._id, ///
  
              }));
              // navigate("/dashboard");
              rest_id = restaurant._id
            }
            else{
              type = "foodbank"
              const foodBank = await getFoodBankByUserId(userData.id);

              dispatch(setUser({
                firebase_uid: user.user.uid, //
                email: userData.email, //
                name:userData.name,    //
                user_type: userData.user_type, //
                photoURL: user.user.photoURL, //
                user_id: userData.id,  //
                type_id: foodBank._id, ///
  
              }));
              // navigate("/dashboard");
              fb_id =  foodBank._id

            }
            console.log("Fetched user:", userData);
          } catch (err) {
            console.error("Could not fetch user", err);
          }
        if (type == "restaurant"){
          console.log("Restaurant user type detected, navigating to restaurant dashboard.");
          socket.emit("joinRestaurantRoom", rest_id);
          navigate("/restaurant-dashboard")
        }
        else if (type == "foodbank"){
          console.log("Foodbank user type detected, navigating to inventory.");
          socket.emit("joinFoodbankRoom",fb_id);
          navigate("/FBdashboard")
        } else {
          console.error("Unknown user type:", type);
        }
      }
    } catch (error) {
      console.error("Google sign-in error:", error);
    }
  };
  

  return (
    <div className="login-container">
      {/* Left column - Login form */}
      <div className="login-form">
        <div className="form-content">
          {/* Logo */}
          <h1 className="logo">
            <span className="text-black">Food</span>
            <span className="text-teal-600">Sync</span>
          </h1>

          {/* Sign in heading */}
          <h2 className="signin-heading">Sign in</h2>
          <p className="signin-subtext">
            Please login to continue to your account.
          </p>

          {/* Google Sign in button */}
          <div className="google-signin">
            <button className="google-button" onClick={handleGoogleSignIn}>
              <img src="/google-logo.svg" alt="Google logo" className="google-logo" />
              Sign in with Google
            </button>
          </div>

          {/* Create account link */}
          <p className="create-account">
            Need an account? <a href="/signup">Create one</a>
          </p>
        </div>
      </div>

      {/* Right column - Image */}
      <div className="image-container">
        <img src="images/children-eating.jpg" alt="Children enjoying food" />
      </div>
    </div>
  );
}

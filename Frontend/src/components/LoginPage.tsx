
import { doSignInWithGoogle } from "../../../backend/src/firebase/auth";
import "../styles/LoginPage.css"; // Import the new CSS file



export default function LoginPage() {
  const handleGoogleSignIn = async () => {
    try {
      const userCredential = await doSignInWithGoogle();
      console.log("User signed in:", userCredential.user);
      // Redirect or handle login success
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
        <img src="/children-eating.jpg" alt="Children enjoying food" />
      </div>
    </div>
  );
}

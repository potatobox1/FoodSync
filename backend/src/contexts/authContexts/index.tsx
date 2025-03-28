
// import React, {useContext, useState, useEffect } from "react";
// import { auth } from "../../firebase/firebase";
// import { onAuthStateChanged } from "firebase/auth";


// const AuthContext = React.createContext();

// export function useAuth()
// {
//     return useContext(AuthContext);
// }

// export function AuthProvider({ children })
// {
//     // state variables
//     const [currentUser, setCurrentUser] = useState(null);   
//     const [userLoggedIn, setUserLoggedIn] = useState(false);
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         //yeh mujhe lag rha is for email people 
//         const unsubscribe = onAuthStateChanged(auth, initializeUser)
//         return unsubscribe;

//     }, [])

//     async function initializeUser(user) {
//         if (user) {
//             setCurrentUser({ ...user });
//             setUserLoggedIn(true);
//         }
//         else {
//             setCurrentUser(null);
//             setUserLoggedIn(false);

//         }
//         setLoading(false);
//     }

//     const value = {
//         currentUser,
//         userLoggedIn,
//         loading


//     }

//     return (
//         <AuthContext.Provider value={value}>
//             {!loading && children}
//             </AuthContext.Provider>
//             )



// }

import React, { useContext, useState, useEffect, ReactNode } from "react";
import { auth } from "../../firebase/firebase";
import { onAuthStateChanged, User } from "firebase/auth";

interface AuthContextType {
  currentUser: User | null;
  userLoggedIn: boolean;
  loading: boolean;
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
        setUserLoggedIn(true);
      } else {
        setCurrentUser(null);
        setUserLoggedIn(false);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value: AuthContextType = {
    currentUser,
    userLoggedIn,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>
  );
}
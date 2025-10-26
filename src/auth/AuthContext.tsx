import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "./firebase";

type UserStatus = "pending" | "approved" | "rejected";

interface AuthContextType {
  user: User | null;
  role: string | null;
  status: UserStatus | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  role: null,
  status: null,
  loading: true,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [status, setStatus] = useState<UserStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(true);

      try {
        if (firebaseUser) {
          const userRef = doc(db, "users", firebaseUser.uid);
          const userSnap = await getDoc(userRef);

          if (!userSnap.exists()) {
            await setDoc(
              userRef,
              {
                email: firebaseUser.email,
                role: "viewer",
                status: "pending" as UserStatus,
              },
              { merge: true }
            );
            setRole("viewer");
            setStatus("pending");
          } else {
            const data = userSnap.data() as { role?: string; status?: UserStatus };
            setRole(data?.role ?? "viewer");
            setStatus(data?.status ?? "pending");
          }
        } else {
          setRole(null);
          setStatus(null);
        }
      } catch (error) {
        console.error("AuthContext: erro ao sincronizar usuário", error);
        setRole(null);
        setStatus(null);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, role, status, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);


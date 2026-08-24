import { createContext, useContext } from "react";
import useLocalStorage from "../hooks/useLocalStorage";

/**
 * Mock authentication.
 * NOTE: This is a frontend-only demo. Passwords are stored in plain
 * localStorage — replace with a real backend before production.
 */

// Seeded admin account available out of the box for the demo.
const SEED_USERS = [
  {
    id: 1,
    name: "Store Admin",
    email: "admin@1shopnepal.com",
    password: "admin123",
    phone: "9800000000",
    role: "admin",
  },
];

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // All registered accounts + seeded users
  const [users, setUsers] = useLocalStorage("users", SEED_USERS);
  // Currently logged-in user (null when logged out)
  const [user, setUser] = useLocalStorage("currentUser", null);

  /**
   * Attempts to log a user in. Returns { ok, error, user }.
   */
  const login = (email, password) => {
    const found = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase().trim()
    );

    if (!found || found.password !== password) {
      return { ok: false, error: "Invalid email or password." };
    }

    // Never keep the password on the session object
    const { password: _pwd, ...safeUser } = found;
    setUser(safeUser);
    return { ok: true, user: safeUser };
  };

  /**
   * Registers a new customer account. Returns { ok, error }.
   */
  const register = ({ name, email, phone, password }) => {
    if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
      return { ok: false, error: "An account with this email already exists." };
    }

    const newUser = {
      id: Date.now(),
      name,
      email,
      phone,
      password,
      role: "customer",
    };
    setUsers((prev) => [...prev, newUser]);

    const { password: _pwd, ...safeUser } = newUser;
    setUser(safeUser); // auto login after signup
    return { ok: true };
  };

  /** Updates the logged-in user's profile fields. */
  const updateProfile = (patch) =>
    setUser((prev) => ({ ...prev, ...patch }));

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider
      value={{ user, isLoggedIn: Boolean(user), login, register, logout, updateProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
};

/** Hook to access auth state and actions. */
export const useAuth = () => useContext(AuthContext);

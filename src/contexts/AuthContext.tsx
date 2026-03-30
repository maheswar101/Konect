import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

export interface StudentProfile {
  name: string;
  collegeId: string;
  collegeName: string;
}

interface AuthContextType {
  student: StudentProfile | null;
  login: (profile: StudentProfile) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const STORAGE_KEY = "medbuddy_student";
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [student, setStudent] = useState<StudentProfile | null>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const login = (profile: StudentProfile) => {
    setStudent(profile);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  };

  const logout = () => {
    setStudent(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <AuthContext.Provider value={{ student, login, logout, isAuthenticated: !!student }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};

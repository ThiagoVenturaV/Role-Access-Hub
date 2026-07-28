import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type UserRole = 'morador' | 'lider' | 'empresa' | 'prefeitura';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  pontos: number;
  bairro: string;
  cargo?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (name: string, role: UserRole) => Promise<void>;
  logout: () => Promise<void>;
  addPontos: (amount: number) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  login: async () => {},
  logout: async () => {},
  addPontos: async () => {},
});

const STORAGE_KEY = '@pilar:user';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((data) => {
        if (data) setUser(JSON.parse(data));
      })
      .finally(() => setIsLoading(false));
  }, []);

  const login = async (name: string, role: UserRole) => {
    const initialPontos =
      role === 'morador' ? 150 : role === 'lider' ? 850 : 0;
    const cargo =
      role === 'empresa'
        ? 'Empresa Parceira'
        : role === 'prefeitura'
          ? 'Gestão Municipal'
          : undefined;
    const newUser: User = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      name,
      role,
      pontos: initialPontos,
      bairro: 'Pilar',
      cargo,
    };
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
    setUser(newUser);
  };

  const logout = async () => {
    await AsyncStorage.removeItem(STORAGE_KEY);
    setUser(null);
  };

  const addPontos = async (amount: number) => {
    if (!user) return;
    const updated = { ...user, pontos: user.pontos + amount };
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setUser(updated);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, addPontos }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthState, getAuthState, loginAdmin, logoutAdmin } from '../services/auth.service';

interface AuthContextType {
    authState: AuthState;
    login: (email: string, password: string) => Promise<boolean>;
    logout: () => void;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [authState, setAuthState] = useState<AuthState>({
        isAuthenticated: false,
        admin: null
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check for existing authentication on app load
        const storedAuth = getAuthState();
        setAuthState(storedAuth);
        setLoading(false);
    }, []);

    const login = async (email: string, password: string): Promise<boolean> => {
        setLoading(true);
        try {
            const admin = await loginAdmin(email, password);
            if (admin) {
                setAuthState({
                    isAuthenticated: true,
                    admin: admin
                });
                return true;
            }
            return false;
        } catch (error) {
            console.error('Login failed:', error);
            return false;
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        logoutAdmin();
        setAuthState({
            isAuthenticated: false,
            admin: null
        });
    };

    return (
        <AuthContext.Provider value={{ authState, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

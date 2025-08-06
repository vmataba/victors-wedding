import { Admin } from "../models/admin.model";
import { loginAdmin as adminServiceLogin } from "./admin.service";

export interface AuthState {
    isAuthenticated: boolean;
    admin: Admin | null;
}

export const loginAdmin = async (email: string, password: string): Promise<Admin | null> => {
    try {
        // Use the admin service login function which handles both default admin and Firebase admins
        const admin = await adminServiceLogin(email, password);
        
        if (admin) {
            // Store in localStorage for persistence
            localStorage.setItem('adminAuth', JSON.stringify({
                isAuthenticated: true,
                admin: admin
            }));
            return admin;
        }
        return null;
    } catch (error) {
        console.error('Login error:', error);
        return null;
    }
};

export const logoutAdmin = (): void => {
    localStorage.removeItem('adminAuth');
};

export const getAuthState = (): AuthState => {
    try {
        const stored = localStorage.getItem('adminAuth');
        if (stored) {
            return JSON.parse(stored);
        }
    } catch (error) {
        console.error('Error reading auth state:', error);
    }
    
    return {
        isAuthenticated: false,
        admin: null
    };
};

export const isAuthenticated = (): boolean => {
    return getAuthState().isAuthenticated;
};

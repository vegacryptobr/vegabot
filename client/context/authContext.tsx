import { createContext, ReactNode, useContext, useState } from 'react';

type AuthContextType = {
  successfulLogin: boolean;
  logMessage: string;
  error: string;
  setError: (error: string) => void;
  setLogMessage: (message: string) => void;
  setSuccessfulLogin: (isAuth: boolean) => void;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthProviderProps = {
    children: ReactNode;
  };
  
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [successfulLogin, setSuccessfulLogin] = useState(false);
    const [logMessage, setLogMessage] = useState('');
    const [error, setError] = useState('');

    return (
        <AuthContext.Provider value={{ successfulLogin, logMessage, error, setError, setLogMessage, setSuccessfulLogin }}>
            {children}
        </AuthContext.Provider>
    );
};

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
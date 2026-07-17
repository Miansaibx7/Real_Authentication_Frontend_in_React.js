import {
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";

// create a context for authentication
const AuthContext = createContext();


// create a provider component to wrap the app and provide the auth state and functions
export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("access");

        if (token) {setUser(token);}
    }, []);

    const login = (tokens) => {

        localStorage.setItem("access", tokens.access);
        localStorage.setItem("refresh", tokens.refresh);
        setUser(tokens.access);
    };

    const logout = () => {
        localStorage.clear();
        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{ user, login, logout }}
        >
            {children}
        </AuthContext.Provider>
    );
};
export const useAuth = () => useContext(AuthContext);
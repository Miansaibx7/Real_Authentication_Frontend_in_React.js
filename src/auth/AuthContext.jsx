import {
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("access");

        if (token) {
            setUser(token);
        }
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
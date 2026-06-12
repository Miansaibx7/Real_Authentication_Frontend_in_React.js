import axios from "axios";

const dashboardApi = axios.create({
    baseURL: "http://127.0.0.1:8000/api/dashboard/",
    headers: { "Content-Type": "application/json" },
});

// Attach JWT token to every dashboard request
dashboardApi.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("access");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor – refresh token on 401
dashboardApi.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            // Avoid refresh loop for the refresh token call itself
            if (originalRequest.url?.includes("token/refresh/")) {
                localStorage.clear();
                window.location.href = "/";
                return Promise.reject(error);
            }

            try {
                const refresh = localStorage.getItem("refresh");
                if (!refresh) throw new Error();

                const res = await axios.post(
                    "http://127.0.0.1:8000/api/auth/token/refresh/",
                    { refresh }
                );

                localStorage.setItem("access", res.data.access);
                originalRequest.headers.Authorization = `Bearer ${res.data.access}`;
                return dashboardApi(originalRequest);
            } catch (err) {
                localStorage.clear();
                window.location.href = "/";
                return Promise.reject(err);
            }
        }
        return Promise.reject(error);
    }
);

export default dashboardApi;
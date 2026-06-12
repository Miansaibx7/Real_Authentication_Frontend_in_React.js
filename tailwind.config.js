/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,jsx}"],
    theme: {
        extend: {
            colors: {
                emerald: "#065F46",
                mint: "#A7F3D0",
                cream: "#FFF8E7",
            },
        },
    },
    plugins: [],
};
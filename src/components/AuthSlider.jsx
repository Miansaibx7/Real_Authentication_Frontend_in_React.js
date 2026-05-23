import { motion } from "framer-motion";

export default function AuthSlider({ title, subtitle }) {

    return (
        <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="hidden lg:flex w-1/2 bg-gradient-to-br from-green-500 to-emerald-700 p-20 flex-col justify-center text-white relative overflow-hidden"
        >

            <div className="absolute w-72 h-72 bg-white/10 rounded-full top-[-50px] right-[-50px]" />

            <div className="absolute w-96 h-96 bg-white/5 rounded-full bottom-[-150px] left-[-100px]" />

            <h1 className="text-6xl font-black leading-tight">
                {title}
            </h1>

            <p className="mt-6 text-xl text-green-50">
                {subtitle}
            </p>

        </motion.div>
    );
}
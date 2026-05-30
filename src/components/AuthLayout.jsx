import { motion } from "framer-motion";

export default function AuthLayout({
  title,
  subtitle,
  children,
}) {

  return (
    <div className="min-h-screen flex bg-slate-950">

      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        className="hidden lg:flex w-1/2 bg-gradient-to-br from-green-500 to-emerald-700 p-16 flex-col justify-center"
      >
        <h1 className="text-6xl font-black text-white leading-tight">
          {title}
        </h1>

        <p className="mt-6 text-green-100 text-lg max-w-lg">
          {subtitle}
        </p>
      </motion.div>

      <div className="flex-1 flex justify-center items-center px-5">
        {children}
      </div>

    </div>
  );
}
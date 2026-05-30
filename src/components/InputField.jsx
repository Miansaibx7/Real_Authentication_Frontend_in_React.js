export default function InputField({
    type = "text",
    name,
    value,
    onChange,
    placeholder,
}) {

    return (
        <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required
            className="w-full p-4 rounded-2xl bg-slate-800 border border-slate-700 text-white 
            placeholder:text-slate-400 outline-none focus:border-green-500 transition-all mb-4"
        />
    );
}
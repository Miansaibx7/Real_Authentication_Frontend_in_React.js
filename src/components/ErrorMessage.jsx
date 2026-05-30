export default function ErrorMessage({ message }) {

    if (!message) return null;

    return (
        <div className="bg-red-500/10 border border-red-500 text-red-400 p-4 rounded-xl mb-5 text-sm">
            {message}
        </div>
    );
}
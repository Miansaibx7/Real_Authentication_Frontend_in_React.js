import { Link } from "react-router-dom";

export default function Header({
  heading,
  paragraph,
  linkName,
  linkUrl,
}) {

  return (
    <div className="mb-8 text-center">

      <h1 className="text-4xl font-black text-white">
        {heading}
      </h1>

      <p className="text-slate-400 mt-2">
        {paragraph}

        <Link
          to={linkUrl}
          className="text-green-400 ml-2"
        >
          {linkName}
        </Link>
      </p>

    </div>
  );
}
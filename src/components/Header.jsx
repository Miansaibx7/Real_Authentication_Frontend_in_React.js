import { Link } from 'react-router-dom';

export default function Header({ heading, paragraph, linkName, linkUrl = "#" }) {
  return (
    <div className="mb-10">
      <div className="flex justify-center">
        <img alt="" className="h-14 w-14" src="/logo.png" />
      </div>
      <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
        {heading}
      </h2>
      <p className="mt-2 text-center text-sm text-gray-600">
        {paragraph}{' '}
        <Link to={linkUrl} className="font-medium text-blue-600 hover:text-blue-500">
          {linkName}
        </Link>
      </p>
    </div>
  );
}
// ```【34†L420-L428】

// This `Header` uses Tailwind classes like `text-center`, `font-extrabold`, etc. to style the title and link【34†L420-L428】. On the login page you might render it as:

// ```jsx
<Header
  heading="Login to your account"
  paragraph="Don’t have an account?"
  linkName="Sign up"
  linkUrl="/signup"
/>
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#f7f7f7]">
      <h1 className="text-6xl font-bold text-[#19287A] mb-4">404</h1>
      <h2 className="text-2xl font-semibold mb-2">Page Not Found</h2>
      <p className="text-gray-600 mb-6">
        Sorry, the page you are looking for does not exist.
      </p>
      <Link
        href="/"
        className="px-6 py-2 bg-[#19287A] text-white rounded-lg hover:bg-[#0C8F8F] transition-colors"
      >
        Go Home
      </Link>
    </div>
  );
}
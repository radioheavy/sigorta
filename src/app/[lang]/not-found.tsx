import Link from "next/link";
import Button from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-24 text-center">
      <div className="border-4 border-black p-12 bg-white">
        <p className="text-8xl font-black mb-4">404</p>
        <div className="border-t-4 border-black pt-6 mt-6">
          <h1 className="text-xl font-bold uppercase tracking-wider mb-2">
            Page not found
          </h1>
          <p className="text-xs text-gray-500 mb-6">
            The requested page does not exist.
          </p>
          <Link href="/">
            <Button variant="accent">← Home</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

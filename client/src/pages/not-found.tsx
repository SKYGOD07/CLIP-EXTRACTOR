import { AlertCircle } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4">
      <div className="text-center space-y-8 max-w-md">
        {/* Animated 404 Icon */}
        <div className="relative inline-flex">
          <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-orange-500 rounded-full blur-3xl opacity-40 animate-pulse" />
          <div className="relative p-8 rounded-full bg-gradient-to-br from-red-500/20 to-orange-500/20 border border-red-500/30">
            <AlertCircle className="h-20 w-20 text-red-400" />
          </div>
        </div>

        {/* Error Message */}
        <div className="space-y-4">
          <h1 className="text-7xl font-bold gradient-text">404</h1>
          <h2 className="text-2xl font-semibold text-white">Page Not Found</h2>
          <p className="text-slate-400 text-lg">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        {/* Action Button */}
        <Link href="/">
          <Button 
            size="lg"
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 border-0 neon-glow px-8"
          >
            Return Home
          </Button>
        </Link>
      </div>
    </div>
  );
}
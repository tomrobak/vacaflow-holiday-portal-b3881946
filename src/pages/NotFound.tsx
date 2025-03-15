
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold">404</h1>
        <h2 className="mt-2 text-2xl font-semibold">Page Not Found</h2>
        <p className="mt-4 text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6 flex justify-center gap-4">
          <Button asChild>
            <Link to="/">Go Home</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/dashboard">Dashboard</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;

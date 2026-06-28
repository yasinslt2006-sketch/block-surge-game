import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center gap-4 bg-background px-6 text-center">
      <p className="font-display text-7xl font-bold text-primary">404</p>
      <h1 className="font-display text-2xl font-semibold">This floor doesn't exist</h1>
      <p className="max-w-sm text-sm text-muted-foreground">
        The tower has shifted. Head back to base camp and try another path.
      </p>
      <Link to="/">
        <Button>Return Home</Button>
      </Link>
    </div>
  );
}

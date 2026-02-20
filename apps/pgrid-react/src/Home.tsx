import { Button } from "./components/ui/button";
import { useSession, signOut } from "@pgrid/auth/client";
import { Link } from "react-router";
import { ModeToggle } from "./components/mode-toggle";

const Home = () => {
  const { data: session, isPending } = useSession();

  const handleLogout = async () => {
    await signOut();
  };

  if (isPending) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <h1 className="text-3xl font-bold">PromptGrid</h1>
      <ModeToggle />
      {session ? (
        <div className="flex flex-col items-center gap-2">
          <p>Welcome, {session.user.name}!</p>
          <Button onClick={handleLogout}>Logout</Button>
        </div>
      ) : (
        <div className="flex gap-4">
          <Link to="/login">
            <Button variant="outline">Login</Button>
          </Link>
          <Link to="/signup">
            <Button>Sign Up</Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default Home;

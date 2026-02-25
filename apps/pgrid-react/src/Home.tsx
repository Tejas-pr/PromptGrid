import { Button } from "./components/ui/button";
import { ModeToggle } from "./components/mode-toggle";
import { Zap, Search, FolderOpen, Code2, Sparkles } from "lucide-react";
import { signOut, useSession } from "@pgrid/auth/client";
import { useNavigate } from "react-router";

const Home = () => {
  const { data: session, isPending } = useSession();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
  };

  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (session) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
        <div className="absolute top-6 right-6">
          <ModeToggle />
        </div>
        <div className="flex flex-col items-center gap-6 max-w-md text-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome back!</h1>
            <p className="text-muted-foreground">
              Hey {session.user.name}, ready to explore prompts?
            </p>
          </div>
          <div className="flex justify-center items-center gap-5">
            <Button onClick={() => navigate('/dashboard')} variant="outline" size="lg">
              Dashboard
            </Button>
            <Button onClick={handleLogout} variant="outline" size="lg">
              Logout
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.15),rgba(255,255,255,0)_50%)] dark:bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.1),rgba(0,0,0,0)_50%)]" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-fuchsia-500/20 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg">PromptGrid</span>
          </div>
          <div className="flex items-center gap-4">
            <a href="/login">
              <Button variant="ghost">Login</Button>
            </a>
            <a href="/signup">
              <Button>Sign Up</Button>
            </a>
            <ModeToggle />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 pt-32 pb-20 flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border/40 bg-muted/50 text-sm text-muted-foreground mb-6">
          <Zap className="w-3 h-3" />
          <span>Now in Beta</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold mb-6 max-w-4xl leading-tight">
          Discover, organize, and{" "}
          <span className="bg-gradient-to-r from-violet-500 to-fuchsia-500 bg-clip-text text-transparent">
            ship prompts
          </span>{" "}
          faster
        </h1>

        <p className="text-xl text-muted-foreground mb-10 max-w-2xl">
          The prompt management platform built for developers. Find the perfect
          prompt, version it, and integrate it into your workflow.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4">
          <a href="/signup">
            <Button size="lg" className="text-base px-8">
              Get Started Free
            </Button>
          </a>
          <a href="/login">
            <Button size="lg" variant="outline" className="text-base px-8">
              Login
            </Button>
          </a>
        </div>

        <div className="mt-12 text-sm text-muted-foreground">
          No credit card required • Free forever
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {/* Feature 1 */}
          <div className="group relative p-6 rounded-2xl border border-border/40 bg-card hover:bg-accent/5 transition-all duration-300">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500/10 to-violet-500/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Search className="w-6 h-6 text-violet-500" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Prompt Discovery</h3>
            <p className="text-sm text-muted-foreground">
              Browse thousands of curated prompts across models and use cases.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="group relative p-6 rounded-2xl border border-border/40 bg-card hover:bg-accent/5 transition-all duration-300">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-fuchsia-500/10 to-fuchsia-500/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <FolderOpen className="w-6 h-6 text-fuchsia-500" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Smart Organization</h3>
            <p className="text-sm text-muted-foreground">
              Version control for prompts. Tag, categorize, and share with your
              team.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="group relative p-6 rounded-2xl border border-border/40 bg-card hover:bg-accent/5 transition-all duration-300">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/10 to-cyan-500/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Code2 className="w-6 h-6 text-cyan-500" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Developer-Friendly</h3>
            <p className="text-sm text-muted-foreground">
              API-first design. Export to any format. Integrate anywhere.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="group relative p-6 rounded-2xl border border-border/40 bg-card hover:bg-accent/5 transition-all duration-300">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500/10 to-amber-500/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Zap className="w-6 h-6 text-amber-500" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Fast & Minimal</h3>
            <p className="text-sm text-muted-foreground">
              Lightning-fast search. Clean interface. Zero bloat.
            </p>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center p-12 rounded-3xl border border-border/40 bg-gradient-to-br from-violet-500/5 to-fuchsia-500/5">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to level up your prompt game?
          </h2>
          <p className="text-muted-foreground mb-8 text-lg">
            Join developers who are shipping AI faster with PromptGrid
          </p>
          <a href="/signup">
            <Button size="lg" className="text-base px-8">
              Start Building Now
            </Button>
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          © 2026 PromptGrid. Built for developers, by Tejas.
        </div>
      </footer>
    </div>
  );
};

export default Home;

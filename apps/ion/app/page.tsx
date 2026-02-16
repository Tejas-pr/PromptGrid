import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ModeToggle } from "@/components/mode-toggle";
import {
  ArrowRight,
  CheckCircle2,
  FlaskConical,
  ShieldCheck,
  Zap,
} from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Bun + Turbo",
    description: "Blazing fast runtime and build system.",
    color: "text-yellow-500",
  },
  {
    icon: ShieldCheck,
    title: "Better Auth",
    description: "Secure, type-safe authentication.",
    color: "text-green-500",
  },
  {
    icon: CheckCircle2,
    title: "Prisma ORM",
    description: "Type-safe database access and migrations.",
    color: "text-blue-500",
  },
] as const;

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col font-sans">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
        <div className="container flex h-14 items-center justify-between mx-auto px-4 md:px-6">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <FlaskConical className="size-6" />
            <span>Ion</span>
          </Link>
          <nav className="flex items-center gap-4">
            <ModeToggle />
            <Link href="/login">
              <Button variant="ghost" size="sm">
                Sign In
              </Button>
            </Link>
            <Link href="/signup">
              <Button size="sm">Get Started</Button>
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32">
          <div className="container flex max-w-5xl flex-col items-center gap-4 text-center mx-auto px-4">
            <h1 className="font-heading text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight pb-1">
              Modern Authentication with <br />
              <span className="bg-clip-text text-transparent bg-linear-to-r from-blue-600 to-cyan-500">
                Speed & Security
              </span>
            </h1>
            <p className="max-w-2xl leading-normal text-muted-foreground sm:text-xl sm:leading-8">
              A production-ready starter kit powered by Next.js, Bun, Turborepo,
              Better Auth, and Prisma. Built for performance.
            </p>
            <div className="flex gap-4">
              <Link href="/signup">
                <Button size="lg" className="h-11 px-8">
                  Start Building <ArrowRight className="ml-2 size-4" />
                </Button>
              </Link>
              <Link
                href="https://github.com/Tejas-pr/bun-turbo-nextjs-betterauth-prisma"
                target="_blank"
                rel="noreferrer"
              >
                <Button variant="outline" size="lg" className="h-11 px-8">
                  GitHub
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="container space-y-6 py-8 md:py-12 lg:py-24 mx-auto px-4">
          <div className="mx-auto flex max-w-3xl flex-col items-center space-y-4 text-center">
            <h2 className="font-heading text-3xl leading-tight sm:text-3xl md:text-6xl font-bold">
              Features
            </h2>
            <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
              Everything you need to build a modern web application.
            </p>
          </div>
          <div className="mx-auto grid justify-center gap-4 sm:grid-cols-2 md:max-w-5xl md:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="relative overflow-hidden rounded-lg border bg-background p-2"
              >
                <div className="flex h-45 flex-col justify-between rounded-md p-6">
                  <feature.icon className={`size-12 ${feature.color}`} />
                  <div className="space-y-2">
                    <h3 className="font-bold">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="py-6 md:px-8 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row mx-auto px-4">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            Built by{" "}
            <a
              href="https://github.com/Tejas-pr"
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4"
            >
              Tejas
            </a>
            . The source code is available on{" "}
            <a
              href="https://github.com/Tejas-pr/bun-turbo-nextjs-betterauth-prisma"
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4"
            >
              GitHub
            </a>
            .
          </p>
        </div>
      </footer>
    </div>
  );
}

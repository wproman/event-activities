import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function CTA() {
  return (
    <section className="py-20 bg-primary text-primary-foreground">
      <div className="container px-4 text-center">
        <h2 className="text-4xl md:text-5xl font-bold">
          Ready to Make New Friends?
        </h2>
        <p className="mt-6 text-xl opacity-90">
          Join thousands who are already enjoying life together.
        </p>
        <div className="mt-10">
          <Button
            size="lg"
            variant="secondary"
            asChild
            className="text-lg px-10"
          >
            <Link href="/register">Get Started — It's Free!</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

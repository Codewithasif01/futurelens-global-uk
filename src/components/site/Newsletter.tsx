import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { subscribe } from "@/lib/content.functions";
import { getSpelling } from "@/lib/i18n";
import { useSite, useSiteKey } from "@/hooks/use-site";

export function Newsletter() {
  const siteKey = useSiteKey();
  const site = useSite();
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "busy" | "done" | "error">("idle");

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setState("busy");
    try {
      await subscribe({ data: { email } });
      setState("done");
    } catch {
      setState("error");
    }
  }

  return (
    <section id="newsletter" aria-labelledby="nl-title" className="rounded-sm bg-ink p-6 text-paper md:p-8">
      <p className="kicker !text-edition-2">{getSpelling("inYourInbox", siteKey)}</p>
      <h2 id="nl-title" className="mt-2 text-2xl font-semibold md:text-3xl">{getSpelling("newsletterTitle", siteKey)}</h2>
      <p className="mt-2 max-w-xl text-sm text-paper/80">{getSpelling("newsletterBody", siteKey)}</p>
      {state === "done" ? (
        <p role="status" className="mt-4 font-mono text-sm">You're on the list for {site.name}. Check your inbox.</p>
      ) : (
        <form onSubmit={onSubmit} className="mt-4 flex max-w-lg flex-col gap-2 sm:flex-row">
          <label htmlFor="nl-email" className="sr-only">Email address</label>
          <Input
            id="nl-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="h-11 border-paper/30 bg-paper text-ink"
          />
          <Button type="submit" variant="edition" className="h-11 px-6" disabled={state === "busy"}>
            {getSpelling("subscribe", siteKey)}
          </Button>
        </form>
      )}
      {state === "error" && <p role="alert" className="mt-2 text-sm">Something went wrong. Please try again.</p>}
      <p className="mt-3 text-xs text-paper/70">
        You can unsubscribe at any time. We'll only use your email to send this newsletter.
      </p>
    </section>
  );
}

import Hero from "../features/summary/components/Hero.jsx";
import { useSummary } from "../features/summary/hooks/useSummary.js";

/**
 * HomePage — public landing page.
 *
 * Slice 2.3: the Hero renders from the live `useSummary` query hook.
 * Loading / error / retry are wired through the same Hero props;
 * the populated tally flows from the envelope-unwrapped payload.
 */
export default function HomePage() {
  const { data: summary, isLoading, isError, refetch } = useSummary();

  return (
    <Hero
      summary={summary ?? null}
      isLoading={isLoading}
      isError={isError}
      onRetry={() => refetch()}
    />
  );
}

import Hero from "../features/summary/components/Hero.jsx";
import { summaryFixture } from "../features/summary/__fixtures__/summary.js";

/**
 * HomePage — public landing page.
 *
 * Slice 2.1: the Hero renders its populated state from the summary fixture.
 * Slice 2.3 replaces this with the useSummary query hook (loading / error /
 * retry wired through the same Hero props).
 */
export default function HomePage() {
  return <Hero summary={summaryFixture} />;
}

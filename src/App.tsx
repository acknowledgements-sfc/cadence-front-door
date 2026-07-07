import { HeroSection } from "./components/HeroSection";
import { WaitlistForm } from "./components/WaitlistForm";
import { copyGuardrailCheck } from "./copy";
import "./App.css";

const guardErrors = copyGuardrailCheck();
if (guardErrors.length > 0 && import.meta.env.DEV) {
  console.warn("[copy-gate]", guardErrors);
}

export function App() {
  return (
    <main className="app">
      <HeroSection />
      <WaitlistForm />
    </main>
  );
}

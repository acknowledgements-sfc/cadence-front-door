import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HeroSection } from "./components/HeroSection";
import { WaitlistForm } from "./components/WaitlistForm";
import { Footer } from "./components/Footer";
import { PrivacyPage } from "./components/PrivacyPage";
import { TermsPage } from "./components/TermsPage";
import { ContactPage } from "./components/ContactPage";
import { copyGuardrailCheck } from "./copy";
import "./App.css";

const guardErrors = copyGuardrailCheck();
if (guardErrors.length > 0 && import.meta.env.DEV) {
  console.warn("[copy-gate]", guardErrors);
}

function HomePage() {
  return (
    <>
      <HeroSection />
      <WaitlistForm />
    </>
  );
}

export function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/contact" element={<ContactPage />} />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

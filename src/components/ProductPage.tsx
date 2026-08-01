import { ProductP0 } from "./product/ProductP0";
import { ProductP1 } from "./product/ProductP1";
import { ProductP2 } from "./product/ProductP2";
import { WaitlistForm } from "./WaitlistForm";

/**
 * /product long-scroll demo.
 * Chapter order: P-0 → P-1 → P-2 → [P-3 reserved] → P-4.
 * P-3 is not in this slice — leave the seam clean.
 */
export function ProductPage() {
  return (
    <main className="product-page">
      <ProductP0 />
      <ProductP1 />
      <ProductP2 />

      {/* P-3 seam — reserved for "bring what you have". Do not build here. */}
      <div id="product-p3-slot" hidden aria-hidden="true" />

      {/* P-4 — Beat 4 ask, verbatim via WaitlistForm */}
      <WaitlistForm />
    </main>
  );
}

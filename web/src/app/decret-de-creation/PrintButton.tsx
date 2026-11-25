"use client";

export default function PrintButton() {
  return (
    <button type="button" className="inst-btn inst-btn--quiet dec-print" onClick={() => window.print()}>
      Imprimer le décret
    </button>
  );
}

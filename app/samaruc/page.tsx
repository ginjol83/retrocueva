import type { Metadata } from "next";
import PageShell from "../components/PageShell";
import SamarucSection from "../components/home/SamarucSection";

export const metadata: Metadata = {
  title: "Samaruc",
  description:
    "Samaruc: IDE de escritorio para desarrollo retro de 8 bits — Game Boy, ZX Spectrum, Amstrad CPC, Commodore 64, MSX y más.",
  alternates: { canonical: "/samaruc" },
  openGraph: {
    title: "Samaruc · RETROCUEVA",
    description:
      "IDE de escritorio para desarrollo retro de 8 bits, con toolchains y emuladores empaquetados.",
  },
};

export default function SamarucPage() {
  return (
    <PageShell>
      <SamarucSection />
    </PageShell>
  );
}

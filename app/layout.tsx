import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.kampstamping.in"),
  title: {
    default: "KAMP Stamping | Electrical Stampings & Motor Components",
    template: "%s | KAMP Stamping",
  },
  description: "Electrical motor stampings, CNC copper and aluminium winding, annealing and die-cast rotors manufactured in Bhiwadi, India since 1984.",
  openGraph: {
    title: "KAMP Stamping | Precision in every layer",
    description: "Electrical stampings and motor components manufactured for OEMs across India since 1984.",
    type: "website",
    locale: "en_IN",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "KAMP Stamping — Precision in every layer" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "KAMP Stamping | Precision in every layer",
    description: "Electrical stampings and motor components manufactured for OEMs across India since 1984.",
    images: ["/og.png"],
  },
  icons: { icon: "/images/kamp-logo.png" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}

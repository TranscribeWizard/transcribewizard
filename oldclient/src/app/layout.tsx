
import "@/styles/globals.css";
import Providers from "@/context/Providers";

export const metadata = {
  title: "TranscribeWizard",
  description: "Transcribe your audio",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme='dark'>
      <body className="bg-base-300">
      <Providers >
          {children}
      </Providers>
      </body>
    </html>
  );
}
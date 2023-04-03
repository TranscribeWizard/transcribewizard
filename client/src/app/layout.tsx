
import "@/styles/globals.css";
import Providers from "@/context/Providers";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme='dark'>
      {/*
        <head /> will contain the components returned by the nearest parent
        head.tsx. Find out more at https://beta.nextjs.org/docs/api-reference/file-conventions/head
      */}
      <head />
      <body className="bg-base-300">
      <Providers >
          {children}
      </Providers>
      </body>
    </html>
  );
}
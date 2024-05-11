import "~/styles/globals.css";

import { Rubik } from "next/font/google";

import { TRPCReactProvider } from "~/trpc/react";

const rubik = Rubik({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata = {
  title: "Data Table ",
  description: "Data Table Powered by Shadcn/ui - Drizzle",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`font-sans ${rubik.variable}`}>
        <TRPCReactProvider>{children}</TRPCReactProvider>
      </body>
    </html>
  );
}

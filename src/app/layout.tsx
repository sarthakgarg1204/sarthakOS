import { Geist, Geist_Mono, Ubuntu } from "next/font/google";
import { Toaster } from "react-hot-toast";
import wallpapers from "../../wallpaper.config";
import "./globals.css";
import { Providers } from "./providers";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
const ubuntu = Ubuntu({
  variable: "--font-ubuntu",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

export const metadata = {
  title: "Ubuntu WebOS",
  description: "Portfolio OS",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preload" as="image" href={wallpapers["wall-14"]} />
        {Object.entries(wallpapers).map(([key, url]) => {
          if (key === "wall-14") return null;
          return <link key={url} rel="preload" as="image" href={url} />;
        })}
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${ubuntu.variable}`}
      >
        <Providers>{children}</Providers>
        <Toaster position="bottom-right" toastOptions={{ duration: 3000 }} />
      </body>
    </html>
  );
}

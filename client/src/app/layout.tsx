import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import Header from "@/components/Header";
import ReduxProvider from "@/providers/ReduxProviders";
import Footer from "@/components/footer";


export const metadata: Metadata = {
  title: "PlanetType",
  description: "A Minimal Space For Typing",
  icons:"/public/svgs/planet.svg"
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`bg-fourth px-4 md:p-4 md:!px-10 antialiased`}
      >
        <ReduxProvider>
          <Header />
          <div className="md:my-10 flex flex-col items-center my-20 w-full">
            {children}
          </div>
          <Footer />
        <Toaster position={"bottom-center"} toastOptions={{
            className: 'font-JetBrainsMono text-secondary',
            style: {
              width:'50%',
              color:"var(--primary)",
              backgroundColor:'var(--third)',
              borderRadius: '16px',
            },
          }}
/>
          </ReduxProvider>
      </body>
    </html>
  );
}

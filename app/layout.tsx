import "@/app/global.css";
import {inter} from "./fonts";
import {Metadata} from "next";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>{children}</body>
    </html>
  );
}
export const metadata:Metadata={
  title:{
    template:"%s|Acme",
    default:"Acme"
  },
  description:"Next js application",
  metadataBase:new URL('https://next-learn-dashboard.vercel.sh')
}

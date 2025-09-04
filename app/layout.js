import "./globals.css"
import SessionWrapper from "@/components/SessionWrapper"

export const metadata = {
  title: "NextJS 14 Todo App",
  description: "Todo List App built using NextJS 14 App Router with Next-Auth and Supabase integration.",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <SessionWrapper>
          {children}
        </SessionWrapper>
      </body>
    </html>
  )
}

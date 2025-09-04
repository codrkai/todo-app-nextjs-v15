import "./globals.css"
import SessionWrapper from "@/components/SessionWrapper"

export const metadata = {
  title: "Todo App - NextJS 15",
  description: "Todo List App built using NextJS 15 with Next-Auth and Supabase integration. It allows users to manage their tasks with drag and drop functionality.",
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

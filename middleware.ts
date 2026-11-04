import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"

import type { Database } from "@/types/supabase"
import { createServerClient } from "@supabase/auth-helpers-nextjs"

export async function middleware(request: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url) throw new Error("Missing env var: NEXT_PUBLIC_SUPABASE_URL")
  if (!anonKey) throw new Error("Missing env var: NEXT_PUBLIC_SUPABASE_ANON_KEY")

  const response = NextResponse.next()

  const supabase = createServerClient<Database>(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet) {
        for (const cookie of cookiesToSet) {
          response.cookies.set(cookie.name, cookie.value, cookie.options)
        }
      },
    },
  })

  await supabase.auth.getSession()

  const pathname = request.nextUrl.pathname
  if (!pathname.startsWith("/dashboard")) return response

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    const nextUrl = new URL("/auth/login", request.url)
    nextUrl.searchParams.set("next", pathname)
    return NextResponse.redirect(nextUrl)
  }

  if (!user.email_confirmed_at && pathname !== "/auth/verify-email") {
    return NextResponse.redirect(new URL("/auth/verify-email", request.url))
  }

  return response
}

// Only run on page routes. API routes create their own Supabase client, and
// static assets don't need a session, so skipping them avoids an auth round
// trip (and database load) on every API call, image, and file request.
export const config = {
  matcher: [
    "/((?!api/|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|avif|ico|css|js|map|txt|xml|json|woff|woff2|ttf)$).*)",
  ],
}

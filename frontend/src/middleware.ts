import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Check if target is a dashboard route
  if (pathname.startsWith("/dashboard")) {
    const sessionCookie = req.cookies.get("shipnex-session");

    if (!sessionCookie) {
      // Redirect unauthenticated user to login
      const loginUrl = new URL("/login", req.url);
      return NextResponse.redirect(loginUrl);
    }

    try {
      const token = sessionCookie.value;
      const parts = token.split(".");
      
      if (parts.length !== 3) {
        // Invalid token format -> clear & redirect to login
        const loginUrl = new URL("/login", req.url);
        const response = NextResponse.redirect(loginUrl);
        response.cookies.delete("shipnex-session");
        return response;
      }

      // Safe Base64URL decoding in Next.js Edge Runtime
      const base64Url = parts[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );

      const decoded = JSON.parse(jsonPayload);
      const role = decoded.role; // superadmin, admin, hub, delivery

      // 1. Super Admin access
      if (pathname.startsWith("/dashboard/superadmin") && role !== "superadmin") {
        return NextResponse.redirect(new URL(`/dashboard/${role}`, req.url));
      }

      // 2. Admin access
      if (pathname.startsWith("/dashboard/admin") && role !== "admin") {
        // Superadmins can access if they desire, otherwise redirect standard roles
        if (role === "superadmin") {
          return NextResponse.next();
        }
        return NextResponse.redirect(new URL(`/dashboard/${role}`, req.url));
      }

      // 3. Hub Manager access
      if (pathname.startsWith("/dashboard/hub") && role !== "hub") {
        return NextResponse.redirect(new URL(`/dashboard/${role}`, req.url));
      }

      // 4. Delivery Partner access
      if (pathname.startsWith("/dashboard/delivery") && role !== "delivery") {
        return NextResponse.redirect(new URL(`/dashboard/${role}`, req.url));
      }

    } catch (error) {
      const loginUrl = new URL("/login", req.url);
      const response = NextResponse.redirect(loginUrl);
      response.cookies.delete("shipnex-session");
      return response;
    }
  }

  return NextResponse.next();
}

// Limit the middleware to run only on dashboard paths
export const config = {
  matcher: ["/dashboard/:path*"],
};

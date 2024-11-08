import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { api } from "./services/apiClient";

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("@barber.token")?.value;

  // Função de validação de token
  async function validateToken(token: string) {
    try {
      const response = await api.get("/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.status === 200;
    } catch (error: unknown) {
      console.error("Erro ao validar token", error);
      return false;
    }
  }

  // Caso esteja acessando a página de autenticação
  if (req.nextUrl.pathname === "/auth") {
    if (token) {
      const isValidToken = await validateToken(token);
      if (isValidToken) {
        // Se o token for válido, redireciona para o dashboard
        return NextResponse.redirect(new URL("/dashboard", req.url));
      } else {
        // Se o token não for válido, remove o cookie e deixa acessar a página de login
        const response = NextResponse.next();
        response.cookies.delete("@barber.token");
        return response;
      }
    }
    return NextResponse.next(); // Sem token, permite acessar a página de login
  }

  // Caso esteja acessando o dashboard
  if (req.nextUrl.pathname === "/dashboard") {
    if (!token) {
      // Sem token, redireciona para a página de login
      return NextResponse.redirect(new URL("/auth", req.url));
    }

    // Valida o token
    const isValidToken = await validateToken(token);
    if (!isValidToken) {
      // Se inválido, redireciona para login e remove o token
      const response = NextResponse.redirect(new URL("/auth", req.url));
      response.cookies.delete("@barber.token");
      return response;
    }

    // Token válido, segue para a página
    return NextResponse.next();
  }

  if (req.nextUrl.pathname === "/dashboard/profile") {
    if (!token) {
      // Sem token, redireciona para a página de login
      return NextResponse.redirect(new URL("/auth", req.url));
    }

    // Valida o token
    const isValidToken = await validateToken(token);
    if (!isValidToken) {
      // Se inválido, redireciona para login e remove o token
      const response = NextResponse.redirect(new URL("/auth", req.url));
      response.cookies.delete("@barber.token");
      return response;
    }

    // Token válido, segue para a página
    return NextResponse.next();
  }

  if (req.nextUrl.pathname === "/dashboard/haircuts") {
    if (!token) {
      // Sem token, redireciona para a página de login
      return NextResponse.redirect(new URL("/auth", req.url));
    }

    // Valida o token
    const isValidToken = await validateToken(token);
    if (!isValidToken) {
      // Se inválido, redireciona para login e remove o token
      const response = NextResponse.redirect(new URL("/auth", req.url));
      response.cookies.delete("@barber.token");
      return response;
    }

    // Token válido, segue para a página
    return NextResponse.next();
  }

  if (req.nextUrl.pathname === "/dashboard/haircuts/new") {
    if (!token) {
      // Sem token, redireciona para a página de login
      return NextResponse.redirect(new URL("/auth", req.url));
    }

    // Valida o token
    const isValidToken = await validateToken(token);
    if (!isValidToken) {
      // Se inválido, redireciona para login e remove o token
      const response = NextResponse.redirect(new URL("/auth", req.url));
      response.cookies.delete("@barber.token");
      return response;
    }

    // Token válido, segue para a página
    return NextResponse.next();
  }

  if (req.nextUrl.pathname === "/dashboard/haircuts/[id]") {
    if (!token) {
      // Sem token, redireciona para a página de login
      return NextResponse.redirect(new URL("/auth", req.url));
    }

    // Valida o token
    const isValidToken = await validateToken(token);
    if (!isValidToken) {
      // Se inválido, redireciona para login e remove o token
      const response = NextResponse.redirect(new URL("/auth", req.url));
      response.cookies.delete("@barber.token");
      return response;
    }
  }

  if (req.nextUrl.pathname === "/dashboard/new-schedule") {
    if (!token) {
      // Sem token, redireciona para a página de login
      return NextResponse.redirect(new URL("/auth", req.url));
    }

    // Valida o token
    const isValidToken = await validateToken(token);
    if (!isValidToken) {
      // Se inválido, redireciona para login e remove o token
      const response = NextResponse.redirect(new URL("/auth", req.url));
      response.cookies.delete("@barber.token");
      return response;
    }

    // Token válido, segue para a página
    return NextResponse.next();
  }

  if (req.nextUrl.pathname === "/dashboard/profile/change-plan") {
    if (!token) {
      // Sem token, redireciona para a página de login
      return NextResponse.redirect(new URL("/auth", req.url));
    }

    // Valida o token
    const isValidToken = await validateToken(token);
    if (!isValidToken) {
      // Se inválido, redireciona para login e remove o token
      const response = NextResponse.redirect(new URL("/auth", req.url));
      response.cookies.delete("@barber.token");
      return response;
    }

    // Token válido, segue para a página
    return NextResponse.next();
  }

  return NextResponse.next(); // Continua normalmente se nenhuma condição foi atendida
}

export const config = {
  matcher: ["/dashboard/:path*", "/auth"], // Define as rotas protegidas pelo middleware
};

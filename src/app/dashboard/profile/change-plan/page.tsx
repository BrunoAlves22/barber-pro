"use client";

import { CustomTrigger } from "@/components/CustomTrigger";
import { AppSidebar } from "@/components/ui/app-sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SidebarProvider } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { setupAPIClient } from "@/services/api";
import { User } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft } from "lucide-react";
import { getStripeJs } from "@/services/stripe-js";
import Link from "next/link";

export default function ChangePlan() {
  const { data: userInfo } = useQuery({
    queryKey: ["info"],
    queryFn: async () => {
      try {
        const api = setupAPIClient();
        const response = await api.get<User>("/me");

        if (!response.data) {
          throw new Error("Usuário não encontrado");
        }

        return response.data;
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
  });

  async function handleSubscribe() {
    if (userInfo?.subscriptions?.status === "active") {
      return;
    }

    try {
      const api = setupAPIClient();
      const response = await api.post("/subscription");

      const { sessionId } = response.data;

      const stripe = await getStripeJs();

      await stripe.redirectToCheckout({ sessionId: sessionId });
    } catch (error) {
      console.log(error);
    }
  }

  async function handleUnsubscribe() {
    try {
      if (userInfo?.subscriptions?.status !== "active") {
        return;
      }

      const api = setupAPIClient();
      const response = await api.post("/portal");

      const { sessionId } = response.data;

      window.location.href = sessionId;
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="border-zinc-800 w-screen h-screen md:overflow-hidden overflow-y-auto">
      <SidebarProvider
        defaultOpen={false}
        className="w-screen h-screen max-h-screen"
      >
        <AppSidebar />

        <main className={cn("w-full p-5 lg:ml-0 h-full")}>
          <div className="flex flex-row items-center gap-2">
            <div className="md:hidden">
              <CustomTrigger />
            </div>
            <div
              className={cn(
                "md:my-5 md:mx-5 flex flex-row items-center w-full"
              )}
            >
              <div className="flex flex-row items-center justify-center">
                <Link href="/dashboard">
                  <button className="md:p-2 px-2 py-1 flex flex-row items-center justify-center gap-1 bg-zinc-800 rounded-md hover:bg-zinc-700 transition-colors duration-300">
                    <ChevronLeft size={20} color="white" />
                    <span className="text-white font-medium text-sm md:text-base md:text-nowrap">
                      Voltar
                    </span>
                  </button>
                </Link>
              </div>
            </div>
          </div>

          <div className="w-full p-2 mt-10 h-full">
            <div className="flex flex-col justify-center items-center">
              <h1 className="text-3xl font-medium text-[#FBB131]">Planos</h1>
            </div>

            <div className="flex md:flex-row flex-col items-center justify-center w-full h-full p-5 gap-5 md:-mt-52">
              <Card className="w-full max-w-96 flex flex-col bg-zinc-800 border-none text-white h-full max-h-96">
                <CardHeader className="text-center">
                  <CardTitle className="text-xl font-medium">
                    Plano Grátis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center px-5 py-1">
                    <ul className="list-outside list-disc font-medium tracking-tight">
                      <li>Registrar cortes</li>
                      <li>Criar apenas 3 modelos de cortes</li>
                      <li>Editar seu perfil</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card className="w-full max-w-96 flex flex-col bg-zinc-800 border-none text-white h-full max-h-96">
                <CardHeader className="text-center">
                  <CardTitle className="text-xl font-medium text-emerald-500">
                    Plano Premium
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center px-5 py-1">
                    <ul className="list-outside list-disc font-medium tracking-tight">
                      <li>Registrar cortes ilimitados</li>
                      <li>Criar modelos ilimitados</li>
                      <li>Editar seu perfil</li>
                      <li>Editar tipos de corte</li>
                      <li>Recebe todas as atualizações</li>
                    </ul>

                    {userInfo?.subscriptions?.status === "active" ? (
                      <>
                        <div className="w-full p-2 mt-20 mb-2 bg-zinc-900 rounded-md transition-colors duration-300 text-center select-none">
                          <span className="text-base font-medium">
                            Você já é Premium
                          </span>
                        </div>
                        <button
                          onClick={handleUnsubscribe}
                          className="bg-emerald-600 w-full p-2 rounded-md hover:bg-emerald-700 transition-colors duration-300 text-center"
                        >
                          <span className="text-base font-medium text-white">
                            Alterar Assinatura
                          </span>
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={handleSubscribe}
                        className="w-full p-2 mt-20 bg-[#FBB131] rounded-md hover:bg-[#D28F29] transition-colors duration-300 text-center"
                      >
                        <span className="font-medium text-black">
                          <span>Virar Premium</span>
                        </span>
                      </button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </SidebarProvider>
    </div>
  );
}

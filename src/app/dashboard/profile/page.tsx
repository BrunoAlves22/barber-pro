"use client";

import { CustomInput } from "@/components/CustomInput";
import { CustomTrigger } from "@/components/CustomTrigger";
import { AppSidebar } from "@/components/ui/app-sidebar";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SidebarProvider } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { setupAPIClient } from "@/services/api";
import { User } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const schema = z.object({
  name: z.string({ required_error: "Nome inválido" }).min(2, "Nome inválido"),
  address: z
    .string({ required_error: "Endereço obrigatório" })
    .min(2, "Endereço obrigatório"),
});

type FormValues = z.infer<typeof schema>;

export default function Profile() {
  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      address: "",
    },
  });

  const {
    data: userInfo,
    isPending,
    isLoading,
  } = useQuery({
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

  useEffect(() => {
    if (userInfo) {
      setValue("name", userInfo.name || "");
      setValue("address", userInfo.address || "");
    }
  }, [userInfo, setValue]);

  async function onSubmit(data: FormValues) {
    try {
      const api = setupAPIClient();
      await api.put("/users", {
        name: data.name,
        address: data.address,
      });

      console.log("Dados atualizados com sucesso!");
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="border-zinc-800 w-screen h-screen overflow-hidden">
      <SidebarProvider defaultOpen={false} className="w-full">
        <AppSidebar />

        <main
          className={cn(
            "w-full p-5",
            "lg:ml-0",
            isLoading && "flex justify-center items-center"
          )}
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#FBB131]" />
            </div>
          ) : (
            <>
              <div className="flex flex-row items-center gap-2">
                <div className="md:hidden">
                  <CustomTrigger />
                </div>

                <div className="md:my-5 md:mx-5">
                  <span className="text-3xl font-medium text-[#FBB131]">
                    Minha Conta
                  </span>
                </div>
              </div>
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="w-full max-w-3xl grid gap-2 mx-auto my-16 overflow-hidden"
              >
                <Card className="p-5 flex flex-col justify-center items-center bg-transparent border-none">
                  <CardHeader className="text-white">
                    <CardTitle className="text-2xl">
                      Informações Pessoais
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="w-full max-w-md py-7 text-white gap-3 grid bg-zinc-800 rounded-md">
                    <CustomInput
                      control={control}
                      name="name"
                      label="Nome da Barbearia"
                      placeholder="Digite o nome"
                      error={errors.name?.message}
                      htmlFor="name"
                      id="name"
                      className="bg-zinc-700 border-zinc-700"
                    />
                    <CustomInput
                      control={control}
                      name="address"
                      label="Endereço"
                      placeholder="Digite seu endereço"
                      error={errors.address?.message}
                      htmlFor="address"
                      id="address"
                      className="bg-zinc-700 border-zinc-700"
                    />

                    <div className="flex justify-center flex-col">
                      <span className="text-sm font-medium">Plano Atual</span>

                      <div className="outline-none bg-zinc-700 border-zinc-700 my-2 p-2 rounded-md flex flex-row items-center justify-between">
                        <span className="text-base font-medium text-emerald-400">
                          Plano
                          {userInfo?.subscriptions?.status === "active" ? (
                            <span className="text-emerald-400"> Premium</span>
                          ) : (
                            <span className="text-emerald-400"> Grátis</span>
                          )}
                        </span>

                        <Link href="/dashboard/profile/change-plan">
                          <button className="bg-emerald-600 px-1 rounded-md hover:bg-emerald-700 transition-colors duration-300">
                            <span className="text-sm font-medium">
                              Mudar Plano
                            </span>
                          </button>
                        </Link>
                      </div>
                    </div>

                    <button
                      disabled={isPending}
                      type="submit"
                      className="bg-[#FBB131] text-black font-medium py-2 px-4 rounded-md w-full hover:bg-[#D28F29] transition-colors duration-300"
                    >
                      Salvar
                    </button>
                  </CardContent>
                  <CardFooter></CardFooter>
                </Card>
              </form>
            </>
          )}
        </main>
      </SidebarProvider>
    </div>
  );
}

"use client";

import Loading from "@/app/loading";
import { CustomInput } from "@/components/CustomInput";
import { CustomTrigger } from "@/components/CustomTrigger";
import { AppSidebar } from "@/components/ui/app-sidebar";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { SidebarProvider } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { setupAPIClient } from "@/services/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(3, "Campo obrigatório"),
  price: z.string().min(2, "Campo obrigatório"),
});

interface HaircutCheck {
  subscriptions: {
    id: string;
    status: string;
  };
}

export type FormValues = z.infer<typeof schema>;

export default function New() {
  const router = useRouter();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      price: "",
    },
  });

  const { data, isLoading, isError } = useQuery({
    queryKey: ["haircut"],
    queryFn: async () => {
      const api = setupAPIClient();
      const haircut = await api.get<HaircutCheck>("/haircut/check");
      const count = await api.get<number>("/haircut/count");

      // Retorna ambos os valores como um objeto
      return { haircut: haircut.data, count: count.data };
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (values: FormValues) => {
      const api = setupAPIClient();
      await api.post("/haircut", {
        name: values.name,
        price: Number(values.price),
      });
    },
    onSuccess: () => {
      router.push("/dashboard/haircuts");
      console.log("Cadastrado com sucesso");
    },
    onError: (error) => {
      console.log("Erro ao cadastrar:", error);
    },
  });

  const onSubmit = (values: FormValues) => {
    mutate(values);
  };

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return <div>Aconteceu algum erro</div>;
  }

  return (
    <div className="border-zinc-100 w-screen h-screen overflow-hidden">
      <SidebarProvider defaultOpen={false} className="border-zinc-800">
        <AppSidebar />

        <main className={cn("w-full p-5", "lg:ml-0")}>
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
                <Link href="/dashboard/haircuts">
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

          <div className="w-full p-2 mt-10">
            <div className="flex flex-col justify-center items-center">
              <h1 className="text-3xl font-medium text-[#FBB131]">
                Cadastrar Corte
              </h1>

              <form
                onSubmit={handleSubmit(onSubmit)}
                className="w-full max-w-3xl grid gap-2 mx-auto overflow-hidden mt-16"
              >
                <Card className="flex flex-col justify-center items-center bg-transparent border-none">
                  <CardContent className="w-full max-w-xl py-7 text-white gap-3 grid bg-zinc-800 rounded-md">
                    <CustomInput
                      control={control}
                      name="name"
                      label="Nome"
                      placeholder="Nome do Corte"
                      error={errors.name?.message}
                      htmlFor="name"
                      id="name"
                      className="bg-zinc-700 border-zinc-700"
                      type="text"
                    />
                    <CustomInput
                      control={control}
                      name="price"
                      label="Preço"
                      placeholder="Preço do Corte"
                      error={errors.price?.message}
                      htmlFor="price"
                      id="price"
                      className="bg-zinc-700 border-zinc-700"
                      type="text"
                    />

                    <button
                      disabled={
                        data?.haircut.subscriptions?.status !== "active" &&
                        data.count >= 3
                      }
                      type="submit"
                      className="bg-[#FBB131] text-black font-medium py-2 px-4 mt-5 rounded-md w-full hover:bg-[#D28F29] transition-colors duration-300 disabled:bg-zinc-500 disabled:cursor-not-allowed"
                    >
                      {isPending ? "Cadastrando..." : "Cadastrar"}
                    </button>

                    <div className="w-full flex items-center justify-center">
                      {data?.haircut.subscriptions?.status === "active" &&
                      data.count >= 3 ? (
                        <div className="flex flex-col items-center">
                          <span className="text-sm font-medium text-center">
                            Você é premium e pode cadastrar mais cortes
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-center">
                            Você não é premium e só pode cadastrar 3 cortes -{" "}
                            {data.count} cadastrados
                          </span>

                          <div>
                            <Link href="/profile/change-plan">
                              <span className="text-sm font-medium text-emerald-500">
                                Seja Premium
                              </span>
                            </Link>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter></CardFooter>
                </Card>
              </form>
            </div>
          </div>
        </main>
      </SidebarProvider>
    </div>
  );
}

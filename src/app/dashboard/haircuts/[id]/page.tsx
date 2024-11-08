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
import { LayoutGroup, motion } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(3, "Campo obrigatório"),
  price: z.string().min(2, "Campo obrigatório"),
  status: z.boolean(),
});

interface HaircutCheck {
  name: string;
  price: string;
  subscriptions: {
    id: string;
    status: string;
  };
}

interface HaircutsItem {
  id: string;
  name: string;
  price: number | string;
  status: boolean;
  userId: string;
}

export type FormValues = z.infer<typeof schema>;

export default function EditHaircuts({
  params: { id },
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      price: "",
      status: false,
    },
  });

  const { data, isLoading, isError } = useQuery({
    queryKey: ["haircut"],
    queryFn: async () => {
      const api = setupAPIClient();
      const haircut = await api.get<HaircutCheck>("/haircut/check");
      const haircutItem = await api.get<HaircutsItem>("/haircut/detail", {
        params: {
          haircut_id: id,
        },
      });

      // Retorna ambos os valores como um objeto
      return { haircut: haircut.data, haircutItem: haircutItem.data };
    },
  });

  const [isActive, setIsActive] = useState(data?.haircutItem.status);

  useEffect(() => {
    if (data) {
      setValue("name", data.haircutItem?.name);
      setValue("price", data.haircutItem?.price.toString());
      setIsActive(data.haircutItem?.status);
      setValue("status", data.haircutItem?.status); // Defina o valor inicial do status
    }
  }, [data, setValue]);

  const { mutate, isPending } = useMutation({
    mutationFn: async (values: FormValues) => {
      const api = setupAPIClient();
      await api.put("/haircut", {
        haircut_id: id,
        name: values.name,
        price: Number(values.price),
        status: values.status,
      });

      console.log(values);
    },
    onSuccess: () => {
      router.push("/dashboard/haircuts");
      console.log("Editado com sucesso");
    },
    onError: (error) => {
      console.log("Erro ao editar:", error);
    },
  });

  const onToggleSwitch = () => {
    setIsActive((prev) => {
      const newStatus = !prev;
      setValue("status", newStatus); // Atualize o valor do status no formulário
      return newStatus;
    });
  };

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
                Editar Corte
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

                    <LayoutGroup>
                      <div className={cn("flex flex-row items-center gap-2")}>
                        <span className="text-sm font-medium transition-colors duration-300">
                          {isActive ? "Ativo" : "Inativo"}
                        </span>
                        <div
                          onClick={onToggleSwitch}
                          className={cn(
                            "relative w-10 md:w-12 md:h-6 h-4 rounded-full p-1 transition-colors duration-300 cursor-pointer",
                            isActive
                              ? "bg-emerald-500 hover:bg-emerald-600"
                              : "bg-red-700 hover:bg-red-600"
                          )}
                        >
                          <motion.div
                            className="w-2 h-2 md:w-4 md:h-4 bg-white rounded-full"
                            animate={{
                              x: isActive ? 24 : 0,
                            }}
                            transition={{
                              type: "spring",
                              stiffness: 200,
                              damping: 30,
                            }}
                          />
                        </div>
                      </div>
                    </LayoutGroup>

                    <button
                      disabled={
                        data?.haircut.subscriptions?.status !== "active"
                      }
                      type="submit"
                      className="bg-[#FBB131] text-black font-medium py-2 px-4 mt-5 rounded-md w-full hover:bg-[#D28F29] transition-colors duration-300 disabled:bg-zinc-500 disabled:cursor-not-allowed"
                    >
                      {isPending ? "Salvando..." : "Salvar"}
                    </button>

                    <div className="w-full flex items-center justify-center">
                      {data?.haircut.subscriptions?.status === "active" ? (
                        <div className="flex flex-col items-center">
                          <span className="text-sm font-medium text-center text-emerald-500">
                            Você é premium{" "}
                            <span className="text-sm font-medium text-white">
                              e tem todos os acessos liberados.
                            </span>
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Link
                            href="/profile/change-plan"
                            className="text-center"
                          >
                            <span className="text-sm font-medium text-emerald-500">
                              Seja Premium{" "}
                              <span className="text-sm font-medium text-white">
                                e tenha todos os acessos liberados.
                              </span>
                            </span>
                          </Link>
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

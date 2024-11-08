"use client";

import Loading from "@/app/loading";
import { CustomInput } from "@/components/CustomInput";
import { CustomTrigger } from "@/components/CustomTrigger";
import { AppSidebar } from "@/components/ui/app-sidebar";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SidebarProvider } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { setupAPIClient } from "@/services/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(3, "Campo obrigatório"),
  haircutType: z.string().min(1, "Selecione um corte"),
});

interface Haircut {
  id: string;
  name: string;
  price: number;
  status: boolean;
  userId: string;
}

export type FormValues = z.infer<typeof schema>;

export default function NewSchedule() {
  const router = useRouter();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      haircutType: "",
    },
  });

  const {
    data: haircutData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["haircut"],
    queryFn: async () => {
      const api = setupAPIClient();
      const response = await api.get<Haircut[]>("/haircuts", {
        params: {
          status: true,
        },
      });
      return response.data;
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (values: FormValues) => {
      const api = setupAPIClient();
      await api.post("/schedule", {
        customer: values.name,
        haircut_id: values.haircutType,
      });
    },
    onSuccess: () => {
      router.push("/dashboard");
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

        <main className={cn("w-full p-5 lg:ml-0")}>
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

          <div className="w-full p-2 mt-10">
            <div className="flex flex-col justify-center items-center">
              <h1 className="text-3xl font-medium text-[#FBB131]">
                Novo Serviço
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
                      placeholder="Nome do Cliente"
                      error={errors.name?.message}
                      htmlFor="name"
                      id="name"
                      className="bg-zinc-700 border-zinc-700"
                      type="text"
                    />

                    <div>
                      <Controller
                        name="haircutType"
                        control={control}
                        render={({ field }) => (
                          <Select
                            defaultValue={field.value}
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger className="bg-zinc-700 border-zinc-700">
                              <SelectValue placeholder="Selecione o Corte" />
                            </SelectTrigger>
                            <SelectContent className="bg-zinc-700 border-zinc-700">
                              <SelectGroup className="flex flex-col gap-1">
                                <SelectLabel className="text-white bg-zinc-600 rounded">
                                  Cortes
                                </SelectLabel>
                                {Array.isArray(haircutData) &&
                                  haircutData.map((haircut) => (
                                    <SelectItem
                                      key={haircut.id}
                                      value={haircut.id}
                                      className="text-white rounded focus:text-black focus:bg-zinc-400 transition-colors duration-300"
                                    >
                                      {haircut.name}
                                    </SelectItem>
                                  ))}
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        )}
                      />
                      {errors.haircutType && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.haircutType.message}
                        </p>
                      )}
                    </div>

                    <button
                      disabled={isPending}
                      type="submit"
                      className="bg-[#FBB131] text-black font-medium py-2 px-4 mt-5 rounded-md w-full hover:bg-[#D28F29] transition-colors duration-300 disabled:bg-zinc-500 disabled:cursor-not-allowed"
                    >
                      {isPending ? "Registrando..." : "Registrar"}
                    </button>
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

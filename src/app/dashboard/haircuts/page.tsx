"use client";

import Loading from "@/app/loading";
import { CustomTrigger } from "@/components/CustomTrigger";
import { AppSidebar } from "@/components/ui/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { setupAPIClient } from "@/services/api";
import { razor } from "@lucide/lab";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Icon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface HaircutsItem {
  id: string;
  name: string;
  price: number | string;
  status: boolean;
  userId: string;
}

interface HaircutsProps {
  haircuts: HaircutsItem[];
}

export default function Haircuts() {
  const [isActive, setIsActive] = useState<boolean>(true);

  const { data, isLoading, isError } = useQuery<HaircutsProps>({
    queryKey: ["list-haircuts", isActive], // Inclui isActive no queryKey
    queryFn: async () => {
      const api = setupAPIClient();
      const response = await api.get<HaircutsItem[]>("/haircuts", {
        params: {
          status: isActive, // Usa isActive para definir o status
        },
      });

      if (!response.data) {
        throw new Error("Nenhum corte encontrado");
      }

      return { haircuts: response.data };
    },
  });

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center text-white">
        Erro ao carregar cortes
      </div>
    );
  }

  // Filtra os cortes com base no status e no estado isActive
  const filteredHaircuts = data?.haircuts.filter(
    (haircut) => haircut.status === isActive
  );

  return (
    <div className="border-zinc-800 w-screen h-screen overflow-hidden">
      <SidebarProvider defaultOpen={false} className="border-zinc-800">
        <AppSidebar />

        <main className="w-full p-5">
          <div className="flex flex-row items-center md:gap-2">
            <div className="md:hidden">
              <CustomTrigger />
            </div>
            <div
              className={cn(
                "md:my-5 md:mx-5 flex flex-row items-center justify-around w-full"
              )}
            >
              <div className="flex flex-row items-center justify-center md:gap-x-3 gap-x-2 p-1">
                <span className="md:text-3xl font-medium text-[#FBB131] md:text-nowrap">
                  Cortes
                </span>

                <Link href="/dashboard/haircuts/new">
                  <button className="md:p-2 p-1 bg-zinc-800 rounded-md hover:bg-zinc-700 transition-colors duration-300">
                    <span className="text-white font-medium text-sm md:text-base md:text-nowrap">
                      Cadastrar Corte
                    </span>
                  </button>
                </Link>
              </div>
              <div
                className={cn(
                  "flex flex-col md:flex-row items-center md:gap-2 gap-1 -mb-5 md:-mb-0 md:ml-1"
                )}
              >
                <span className="text-white font-medium md:text-lg">
                  {isActive ? "Ativos" : "Inativos"}
                </span>
                <button
                  onClick={() => setIsActive(!isActive)}
                  className={cn(
                    "relative w-10 md:w-12 md:h-6 h-4 bg-zinc-700 rounded-full p-1",
                    isActive
                      ? "bg-emerald-500 transition-colors duration-300"
                      : "bg-zinc-700 transition-colors duration-300"
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
                </button>
              </div>
            </div>
          </div>

          <section className="w-full flex flex-col justify-center items-center p-2">
            {filteredHaircuts?.map((haircut) => (
              <Link
                key={haircut.id}
                href={`/dashboard/haircuts/${haircut.id}`}
                className="w-full lg:max-w-[55%] md:max-w-[85%] py-2"
              >
                <button className="w-full bg-zinc-800 py-2 px-4 rounded-md flex flex-row items-center justify-between">
                  <div className="flex flex-row items-center md:gap-x-3 gap-x-2">
                    <Icon iconNode={razor} className="w-7 h-7 text-[#FBB131]" />
                    <span className="font-medium text-white">
                      {haircut.name}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="font-medium text-white">
                      R$ {haircut.price}
                    </span>
                  </div>
                </button>
              </Link>
            ))}
          </section>
        </main>
      </SidebarProvider>
    </div>
  );
}

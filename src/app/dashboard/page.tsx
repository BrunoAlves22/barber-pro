"use client";

import { CustomTrigger } from "@/components/CustomTrigger";
import { ScheduleModal } from "@/components/Modal";
import { AppSidebar } from "@/components/ui/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { setupAPIClient } from "@/services/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { User } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export interface Schedule {
  id: string;
  customer: string;
  haircut: {
    name: string;
    price: number;
  };
}

export default function Dashboard() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(
    null
  );
  const { data } = useQuery({
    queryKey: ["schedules"],
    queryFn: async () => {
      const api = setupAPIClient();
      const response = await api.get<Schedule[]>("/schedule");

      return response.data;
    },
  });

  const handleScheduleClick = (schedule: Schedule, e: React.MouseEvent) => {
    e.preventDefault();
    setSelectedSchedule(schedule);
    setIsModalOpen(true);
  };

  const { mutate } = useMutation({
    mutationFn: async (id: string) => {
      const api = setupAPIClient();
      await api.delete("/schedule", {
        params: {
          schedule_id: id,
        },
      });
    },
    onMutate: async (deletedId) => {
      // Cancela qualquer refetch em andamento
      await queryClient.cancelQueries({ queryKey: ["schedules"] });

      // Salva o estado anterior
      const previousSchedules = queryClient.getQueryData(["schedules"]);

      // Atualiza otimisticamente
      queryClient.setQueryData<Schedule[]>(["schedules"], (old) =>
        old ? old.filter((schedule) => schedule.id !== deletedId) : []
      );

      return { previousSchedules };
    },
    onError: (err, newTodo, context) => {
      // Em caso de erro, volta ao estado anterior
      queryClient.setQueryData(["schedules"], context?.previousSchedules);
      console.log("Erro ao finalizar agendamento");
    },
    onSuccess: () => {
      setIsModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ["schedules"] });
      console.log("Agendamento finalizado com sucesso");
    },
  });

  const handleFinishSchedule = async (id: string) => {
    await mutate(id);
  };

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
                  Agenda
                </span>

                <Link href="/dashboard/new-schedule">
                  <button className="md:p-2 p-1 bg-zinc-800 rounded-md hover:bg-zinc-700 transition-colors duration-300">
                    <span className="text-white font-medium text-sm md:text-base md:text-nowrap">
                      Registrar
                    </span>
                  </button>
                </Link>
              </div>
            </div>
          </div>

          <section className="w-full flex flex-col justify-center items-center p-2">
            {data?.map((schedule) => (
              <Link
                key={schedule.id}
                href="#"
                className="w-full lg:max-w-[55%] md:max-w-[85%] py-2"
                onClick={(e) => handleScheduleClick(schedule, e)}
              >
                <div className="w-full bg-zinc-800 py-2 px-4 rounded-md flex flex-row items-center justify-between hover:bg-zinc-700 transition-colors duration-300">
                  <div className="flex flex-row items-center md:gap-x-3 gap-x-2">
                    <User className="w-7 h-7 text-[#FBB131]" />
                    <span className="font-medium text-white">
                      {schedule.customer}
                    </span>
                  </div>

                  <div className="flex items-center">
                    <span className="font-medium text-white">
                      {schedule.haircut.name}
                    </span>
                  </div>

                  <div className="flex items-center">
                    <span className="font-medium text-white">
                      R$ {schedule.haircut.price}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </section>
        </main>
        <ScheduleModal
          isOpen={isModalOpen}
          onOpenChange={setIsModalOpen}
          schedule={selectedSchedule}
          finishSchedule={() => handleFinishSchedule(selectedSchedule?.id)}
        />
      </SidebarProvider>
    </div>
  );
}

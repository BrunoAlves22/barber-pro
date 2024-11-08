import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Schedule } from "@/app/dashboard/page"; // ajuste o caminho conforme necessário

interface ScheduleModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  schedule: Schedule | null;
  finishSchedule: () => Promise<void>;
}

export function ScheduleModal({
  isOpen,
  onOpenChange,
  schedule,
  finishSchedule,
}: ScheduleModalProps) {
  if (!schedule) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-zinc-800 text-white">
        <DialogHeader>
          <DialogTitle className="text-[#FBB131]">
            Detalhes do Agendamento
          </DialogTitle>
          <DialogDescription>
            Informações completas sobre o agendamento selecionado
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-2 py-2">
          <div className="grid grid-cols-4 items-center gap-1.5">
            <span className="font-medium">Cliente:</span>
            <span className="col-span-3">{schedule.customer}</span>
          </div>
          <div className="grid grid-cols-4 items-center gap-1.5">
            <span className="font-medium">Serviço:</span>
            <span className="col-span-3">{schedule.haircut.name}</span>
          </div>
          <div className="grid grid-cols-4 items-center gap-1.5">
            <span className="font-medium">Preço:</span>
            <span className="col-span-3">R$ {schedule.haircut.price}</span>
          </div>
        </div>

        <DialogFooter>
          <button
            className="p-2 bg-zinc-700 rounded-md hover:bg-zinc-600 transition-colors duration-300"
            onClick={finishSchedule}
          >
            Finalizar Agendamento
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

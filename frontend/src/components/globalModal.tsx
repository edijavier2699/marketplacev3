import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ReactNode } from "react";

interface GlobalModalProps {
  id: string;
  title: string;
  description: string;
  contentComponent?: ReactNode; // Este prop es opcional y puede aceptar un componente React
}

export const GlobalModal: React.FC<GlobalModalProps> = ({
  id,
  title,
  description,
  contentComponent, // Nuevo prop para contenido dinámico
}) => {
  return (
    <Dialog>
      {/* Asegurarse de que el DialogTrigger está habilitado */}
      <DialogTrigger asChild>
        <button
          id={`trigger-${id}`}
          className="relative px-2 rounded-sm w-full flex cursor-pointer hover:bg-accent select-none items-center py-1.5 text-sm outline-none transition-colors"
        >
          {title}
        </button>
      </DialogTrigger>

      {/* Asegurarse de que el contenido está visible y ajustado */}
      <DialogContent
        className="sm:max-w-xl max-h-[90vh] overflow-y-auto"
        id={`content-${id}`}
      >
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        {/* Renderizar el contenido dinámico */}
        <div className="overflow-y-auto h-auto">{contentComponent}</div>
      </DialogContent>
    </Dialog>
  );
};
import React from "react"; // Asegúrate de importar React
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import infoIcon from "../assets/infoIcon.svg";

interface InformationToolProps {
    message: string;
}

export const InformationTool: React.FC<InformationToolProps> = ({ message }) => {
    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger className="p-0 mt-0">
                    <img alt="info-icon" src={infoIcon} />
                </TooltipTrigger>
                <TooltipContent>
                    <p className="max-w-xs text-gray-500 text-xs">{message}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
};


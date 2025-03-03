// components/StatCard/StatCard.tsx
import { ReactNode } from "react";

type StatCardProps = {
  title: string;
  date: string;
  value: ReactNode;
  icon?: ReactNode;
  withBorder?: boolean; // Prop opcional para añadir border-right
};

const StatCard = ({
  title,
  date,
  value,
  icon,
  withBorder = false,
}: StatCardProps) => {
  return (
    <div className={`p-4 ${withBorder ? "border-r" : ""}`}>
      <div className="flex items-center justify-between gap-3 mb-4">
        <div>
          <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">
            {title}
          </p>
          <span className="text-xs text-gray-400">{date}</span>
        </div>
        <span className="flex items-center space-x-5">
          <span className="text-2xl font-bold text-gray-900">{value}</span>
          {icon}
        </span>
      </div>
    </div>
  );
};

export default StatCard;

import { Badge } from "@/components/ui/badge";
import type { TransparencyProjectStatus } from "@/lib/sanity-derived-types";
import { cn } from "@/lib/utils/ui-utils";
import { AlertCircle, CheckCircle, Clock, type LucideIcon } from "lucide-react";
/**
 * @param status - Status value. Unknown or nullish values default to "pending".
 * @param className - Additional CSS classes to apply to the badge.
 */
interface Props {
  status: TransparencyProjectStatus;
  className?: string;
}

const statusConfig: Record<
  NonNullable<TransparencyProjectStatus>,
  { label: string; classes: string; Icon: LucideIcon }
> = {
  in_progress: {
    label: "Em execução",
    classes: "bg-blue-100 text-blue-700 border-blue-300 hover:bg-blue-100",
    Icon: Clock,
  },
  completed: {
    label: "Concluído",
    classes: "bg-emerald-100 text-emerald-700 border-emerald-300 hover:bg-emerald-100",
    Icon: CheckCircle,
  },
  in_analysis: {
    label: "Em análise",
    classes: "bg-amber-100 text-amber-700 border-amber-300 hover:bg-amber-100",
    Icon: Clock,
  },
  pending: { label: "Pendente", classes: "bg-red-100 text-red-700 border-red-300 hover:bg-red-100", Icon: AlertCircle },
};

export default function StatusBadge({ status, className }: Readonly<Props>) {
  const config = statusConfig[status ?? "pending"];
  const { label, classes, Icon } = config;

  return (
    <Badge variant="outline" className={cn("gap-1 font-medium", classes, className)}>
      <Icon className="w-3 h-3" />
      {label}
    </Badge>
  );
}

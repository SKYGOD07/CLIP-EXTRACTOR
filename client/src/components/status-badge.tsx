import { Badge } from "@/components/ui/badge";
import { Loader2, CheckCircle2, AlertCircle, Clock } from "lucide-react";

type Status = "uploaded" | "transcribing" | "analyzing" | "complete" | "error";

interface StatusBadgeProps {
  status: string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const normalizedStatus = status as Status;

  switch (normalizedStatus) {
    case "complete":
      return (
        <Badge 
          variant="default" 
          className="bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20 border border-emerald-500/30 gap-1.5 px-3 py-1"
        >
          <CheckCircle2 className="h-3.5 w-3.5" /> 
          <span>Complete</span>
        </Badge>
      );
    case "error":
      return (
        <Badge 
          variant="destructive" 
          className="bg-red-500/10 text-red-300 hover:bg-red-500/20 border border-red-500/30 gap-1.5 px-3 py-1"
        >
          <AlertCircle className="h-3.5 w-3.5" /> 
          <span>Error</span>
        </Badge>
      );
    case "transcribing":
    case "analyzing":
      return (
        <Badge 
          variant="secondary" 
          className="bg-blue-500/10 text-blue-300 hover:bg-blue-500/20 border border-blue-500/30 gap-1.5 px-3 py-1 animate-pulse"
        >
          <Loader2 className="h-3.5 w-3.5 animate-spin" /> 
          <span>{normalizedStatus.charAt(0).toUpperCase() + normalizedStatus.slice(1)}...</span>
        </Badge>
      );
    default:
      return (
        <Badge 
          variant="outline" 
          className="bg-slate-500/10 text-slate-300 hover:bg-slate-500/20 border border-slate-500/30 gap-1.5 px-3 py-1"
        >
          <Clock className="h-3.5 w-3.5" /> 
          <span>Queued</span>
        </Badge>
      );
  }
}
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
        <Badge variant="default" className="bg-green-500 hover:bg-green-600 gap-1">
          <CheckCircle2 className="h-3 w-3" /> Complete
        </Badge>
      );
    case "error":
      return (
        <Badge variant="destructive" className="gap-1">
          <AlertCircle className="h-3 w-3" /> Error
        </Badge>
      );
    case "transcribing":
    case "analyzing":
      return (
        <Badge variant="secondary" className="gap-1 animate-pulse">
          <Loader2 className="h-3 w-3 animate-spin" /> 
          {normalizedStatus.charAt(0).toUpperCase() + normalizedStatus.slice(1)}...
        </Badge>
      );
    default:
      return (
        <Badge variant="outline" className="gap-1">
          <Clock className="h-3 w-3" /> Queued
        </Badge>
      );
  }
}

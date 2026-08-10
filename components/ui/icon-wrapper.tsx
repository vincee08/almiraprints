import { LucideIcon } from "lucide-react";
import * as Icons from "lucide-react";
import { cn } from "@/lib/utils";

interface IconWrapperProps {
  iconName: string;
  className?: string;
  size?: number;
}

export function IconWrapper({ iconName, className, size = 24 }: IconWrapperProps) {
  const IconComponent = (Icons[iconName as keyof typeof Icons] || Icons.HelpCircle) as LucideIcon;

  return <IconComponent className={cn("", className)} size={size} />;
}

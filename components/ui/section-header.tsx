import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  title: string;
  description?: string;
  centered?: boolean;
  className?: string;
}

export function SectionHeader({
  title,
  description,
  centered = false,
  className,
}: SectionHeaderProps) {
  return (
    <div className={cn(
      "space-y-4",
      centered && "text-center max-w-3xl mx-auto",
      className
    )}>
      <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
        {title}
      </h2>
      {description && (
        <p className="text-lg text-muted-foreground">
          {description}
        </p>
      )}
    </div>
  );
}

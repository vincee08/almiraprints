import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  title: string;
  description?: string;
  centered?: boolean;
  className?: string;
  as?: "h1" | "h2";
}

export function SectionHeader({
  title,
  description,
  centered = false,
  className,
  as: Heading = "h2",
}: SectionHeaderProps) {
  return (
    <div className={cn(
      "space-y-4",
      centered && "text-center max-w-3xl mx-auto",
      className
    )}>
      <Heading className="text-3xl sm:text-4xl font-bold tracking-tight">
        {title}
      </Heading>
      {description && (
        <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">
          {description}
        </p>
      )}
    </div>
  );
}

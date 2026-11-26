import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface ProcessStepProps {
  step: string;
  title: string;
  description: string;
  isLast?: boolean;
  colorIndex?: number;
}

export function ProcessStep({ step, title, description, colorIndex = 0 }: ProcessStepProps) {
  const colors = [
    "bg-primary text-primary-foreground", // Coral
    "bg-secondary text-foreground", // Warm Peach
    "bg-accent text-foreground", // Soft Peach
    "bg-success text-success-foreground",
  ];

  return (
    <div className="relative">
      <Card className="h-full">
        <CardHeader className="flex-row items-start gap-4 space-y-0 p-5">
          <div className={`inline-flex shrink-0 items-center justify-center w-10 h-10 rounded-full font-bold text-base ${colors[colorIndex % colors.length]}`}>
            {step}
          </div>
          <div><CardTitle className="text-base">{title}</CardTitle>
          <CardDescription className="mt-2 leading-relaxed">{description}</CardDescription></div>
        </CardHeader>
      </Card>
      
    </div>
  );
}

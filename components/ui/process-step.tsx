import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface ProcessStepProps {
  step: string;
  title: string;
  description: string;
  isLast?: boolean;
  colorIndex?: number;
}

export function ProcessStep({ step, title, description, isLast, colorIndex = 0 }: ProcessStepProps) {
  const colors = [
    "bg-primary text-primary-foreground", // Coral
    "bg-secondary text-foreground", // Warm Peach
    "bg-accent text-foreground", // Soft Peach
    "bg-success text-foreground", // Mint Green
  ];

  return (
    <div className="relative">
      <Card className="h-full hover:shadow-md transition-shadow">
        <CardHeader>
          <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full font-bold text-xl mb-4 ${colors[colorIndex % colors.length]}`}>
            {step}
          </div>
          <CardTitle className="text-xl">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
      </Card>
      
      {/* Connection line for desktop */}
      {!isLast && (
        <div className="hidden lg:block absolute top-1/2 left-full w-full h-0.5 bg-primary/20 -translate-y-1/2 z-0" />
      )}
    </div>
  );
}

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface ProcessStepProps {
  step: string;
  title: string;
  description: string;
  isLast?: boolean;
}

export function ProcessStep({ step, title, description, isLast }: ProcessStepProps) {
  return (
    <div className="relative">
      <Card className="h-full">
        <CardHeader>
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary text-primary-foreground font-bold text-xl mb-4">
            {step}
          </div>
          <CardTitle className="text-xl">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
      </Card>
      
      {/* Connection line for desktop */}
      {!isLast && (
        <div className="hidden lg:block absolute top-1/2 left-full w-full h-0.5 bg-border -translate-y-1/2 z-0" />
      )}
    </div>
  );
}

import { LucideIcon } from "lucide-react";
import * as Icons from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface FeatureCardProps {
  title: string;
  description: string;
  icon: string;
}

export function FeatureCard({ title, description, icon }: FeatureCardProps) {
  const IconComponent = (Icons[icon as keyof typeof Icons] || Icons.Star) as LucideIcon;

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="p-3 rounded-lg bg-primary/10 text-primary w-fit mb-4">
          <IconComponent className="h-6 w-6" />
        </div>
        <CardTitle className="text-xl">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
    </Card>
  );
}

import { LucideIcon } from "lucide-react";
import * as Icons from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface FeatureCardProps {
  title: string;
  description: string;
  icon: string;
  variant?: "coral" | "peach" | "soft-peach" | "mint" | "cream";
}

export function FeatureCard({ title, description, icon, variant = "coral" }: FeatureCardProps) {
  const IconComponent = (Icons[icon as keyof typeof Icons] || Icons.Star) as LucideIcon;

  const variantStyles = {
    coral: "bg-primary/10 text-primary",
    peach: "bg-secondary/20 text-foreground",
    "soft-peach": "bg-accent/30 text-foreground",
    mint: "bg-success/30 text-foreground",
    cream: "bg-muted/50 text-foreground",
  };

  return (
    <Card className="h-full hover:shadow-md transition-shadow">
      <CardHeader>
        <div className={`p-3 rounded-lg w-fit mb-4 ${variantStyles[variant]}`}>
          <IconComponent className="h-6 w-6" />
        </div>
        <CardTitle className="text-xl">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
    </Card>
  );
}

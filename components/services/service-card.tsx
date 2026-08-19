import Link from "next/link";
import { ArrowRight, LucideIcon } from "lucide-react";
import * as Icons from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Service } from "@/types/service";
import { cn } from "@/lib/utils";

interface ServiceCardProps {
  service: Service;
  featured?: boolean;
}

export function ServiceCard({ service, featured }: ServiceCardProps) {
  const IconComponent = (Icons[service.icon as keyof typeof Icons] || Icons.FileText) as LucideIcon;

  // Map service categories to brand colors
  const getCategoryColor = () => {
    switch (service.category.slug) {
      case "party-event":
        return "bg-secondary text-foreground"; // Warm Peach
      case "signage-display":
        return "bg-primary text-primary-foreground"; // Coral
      case "tshirt-printing":
        return "bg-accent text-accent-foreground"; // Soft Peach
      case "gifts-souvenirs":
        return "bg-success text-success-foreground"; // Mint Green
      case "calendar-printing":
        return "bg-muted text-foreground"; // Cream
      case "personalized-products":
        return "bg-primary text-primary-foreground"; // Coral
      default:
        return "bg-accent text-accent-foreground";
    }
  };

  return (
    <Card className={cn(
      "h-full flex flex-col transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-primary",
      featured && "border-primary/50"
    )}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className={cn(
            "p-3 rounded-lg mb-4",
            getCategoryColor()
          )}>
            <IconComponent className="h-6 w-6" />
          </div>
          {featured && (
            <Badge className="bg-secondary text-foreground">Featured</Badge>
          )}
        </div>
        <Badge variant="outline" className="w-fit mb-2 border-primary/30">
          {service.category.name}
        </Badge>
        <CardTitle className="text-xl">{service.title}</CardTitle>
        <CardDescription className="line-clamp-2">
          {service.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        {service.priceStarting && (
          <p className="text-sm text-muted-foreground">
            {service.priceStarting}
          </p>
        )}
      </CardContent>
      <CardFooter>
        <Button asChild variant="ghost" className="w-full group hover:text-primary">
          <Link href={`/services/${service.slug}`}>
            Learn More
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

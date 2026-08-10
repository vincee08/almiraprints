import Link from "next/link";
import { ArrowRight, LucideIcon } from "lucide-react";
import * as Icons from "lucide-react";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ServiceCategory } from "@/types/service";

interface ServiceCategoryCardProps {
  category: ServiceCategory;
}

export function ServiceCategoryCard({ category }: ServiceCategoryCardProps) {
  const IconComponent = (Icons[category.icon as keyof typeof Icons] || Icons.Folder) as LucideIcon;

  return (
    <Link href={`/services?category=${category.slug}`}>
      <Card className="h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-primary cursor-pointer group">
        <CardHeader>
          <div className="p-3 rounded-lg bg-primary/10 text-primary w-fit mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
            <IconComponent className="h-8 w-8" />
          </div>
          <CardTitle className="text-xl group-hover:text-primary transition-colors">
            {category.name}
          </CardTitle>
          <CardDescription className="line-clamp-2">
            {category.description}
          </CardDescription>
          <div className="flex items-center text-sm text-primary font-medium pt-2">
            View Services
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </div>
        </CardHeader>
      </Card>
    </Link>
  );
}

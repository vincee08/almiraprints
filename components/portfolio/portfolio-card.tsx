import Image from "next/image";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PortfolioItem } from "@/types/portfolio";

interface PortfolioCardProps {
  item: PortfolioItem;
}

export function PortfolioCard({ item }: PortfolioCardProps) {
  return (
    <Card className="h-full flex flex-col overflow-hidden group transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-primary">
      {/* Project Image */}
      <div className="relative h-64 bg-muted overflow-hidden">
        {item.imageUrl ? (
          <>
            <Image
              src={item.imageUrl}
              alt={item.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <p className="text-white text-sm font-medium">View Project</p>
            </div>
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/20 via-accent/20 to-secondary">
            <div className="text-center p-4">
              <div className="text-4xl font-bold text-primary/20 mb-2">
                PROJECT
              </div>
              <div className="text-sm text-muted-foreground">
                Image Placeholder
              </div>
            </div>
          </div>
        )}
      </div>
      
      <CardHeader>
        <Badge variant="outline" className="w-fit mb-2 border-primary/30">
          {item.category}
        </Badge>
        <CardTitle className="text-lg group-hover:text-primary transition-colors">
          {item.title}
        </CardTitle>
        <CardDescription className="line-clamp-2">
          {item.description}
        </CardDescription>
      </CardHeader>
      
      {item.tags && item.tags.length > 0 && (
        <CardContent className="flex-1 flex items-end">
          <div className="flex flex-wrap gap-1">
            {item.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </CardContent>
      )}
    </Card>
  );
}

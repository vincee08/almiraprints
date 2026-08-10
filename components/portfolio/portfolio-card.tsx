import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PortfolioItem } from "@/types/portfolio";

interface PortfolioCardProps {
  item: PortfolioItem;
}

export function PortfolioCard({ item }: PortfolioCardProps) {
  return (
    <Card className="h-full flex flex-col overflow-hidden group transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      {/* Image Placeholder */}
      <div className="relative h-48 bg-gradient-to-br from-primary/20 via-accent/20 to-secondary overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center p-4">
            <div className="text-4xl font-bold text-primary/20 mb-2">
              PROJECT
            </div>
            <div className="text-sm text-muted-foreground">
              Image Placeholder
            </div>
          </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
      
      <CardHeader>
        <Badge variant="outline" className="w-fit mb-2">
          {item.category}
        </Badge>
        <CardTitle className="text-lg">{item.title}</CardTitle>
        <CardDescription className="line-clamp-2">
          {item.description}
        </CardDescription>
      </CardHeader>
      
      {item.tags && item.tags.length > 0 && (
        <CardContent className="flex-1 flex items-end">
          <div className="flex flex-wrap gap-1">
            {item.tags.map((tag) => (
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

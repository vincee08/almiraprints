import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Star } from "lucide-react";
import { Testimonial } from "@/types/testimonial";

interface TestimonialCardProps {
  testimonial: Testimonial;
}

export function TestimonialCard({ testimonial }: TestimonialCardProps) {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex gap-1 mb-2" aria-label={`${testimonial.rating} out of 5 stars`}>
          {Array.from({ length: testimonial.rating }).map((_, i) => (
            <Star 
              key={i} 
              className="h-4 w-4 fill-primary text-primary" 
              aria-hidden="true"
            />
          ))}
        </div>
      </CardHeader>
      <CardContent className="space-y-4 flex-grow flex flex-col justify-between">
        <p className="text-muted-foreground italic leading-relaxed">
          &ldquo;{testimonial.content}&rdquo;
        </p>
        <div className="pt-2 border-t">
          <p className="font-semibold text-foreground">{testimonial.name}</p>
          <p className="text-sm text-primary font-medium mt-1">{testimonial.service}</p>
        </div>
      </CardContent>
    </Card>
  );
}

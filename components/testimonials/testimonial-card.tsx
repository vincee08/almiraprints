import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Star } from "lucide-react";
import { Testimonial } from "@/types/testimonial";

interface TestimonialCardProps {
  testimonial: Testimonial;
}

export function TestimonialCard({ testimonial }: TestimonialCardProps) {
  return (
    <Card className="h-full">
      <CardHeader>
        {testimonial.rating && (
          <div className="flex gap-1 mb-2">
            {Array.from({ length: testimonial.rating }).map((_, i) => (
              <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            ))}
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-muted-foreground italic">
          &ldquo;{testimonial.content}&rdquo;
        </p>
        <div>
          <p className="font-semibold">{testimonial.name}</p>
          {testimonial.role && (
            <p className="text-sm text-muted-foreground">{testimonial.role}</p>
          )}
          {testimonial.company && (
            <p className="text-sm text-muted-foreground">{testimonial.company}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

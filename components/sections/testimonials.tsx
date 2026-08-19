import { SectionHeader } from "@/components/ui/section-header";
import { TestimonialCard } from "@/components/testimonials/testimonial-card";
import { testimonials } from "@/data/testimonials";

export function TestimonialsSection() {
  return (
    <section className="section-padding bg-secondary/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title="What Our Clients Say"
          description="Real feedback from customers who've experienced our personalized printing services"
          centered
        />

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} />
          ))}
        </div>
      </div>
    </section>
  );
}

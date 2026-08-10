import { SectionHeader } from "@/components/ui/section-header";
import { TestimonialCard } from "@/components/testimonials/testimonial-card";
import { testimonials } from "@/data/testimonials";

export function TestimonialsSection() {
  return (
    <section className="section-padding">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title="What Our Clients Say"
          description="Sample testimonials from satisfied customers"
          centered
        />

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.slice(0, 6).map((testimonial) => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} />
          ))}
        </div>
      </div>
    </section>
  );
}

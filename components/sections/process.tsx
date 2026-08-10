import { SectionHeader } from "@/components/ui/section-header";
import { ProcessStep } from "@/components/ui/process-step";
import { PROCESS_STEPS } from "@/lib/constants";

export function ProcessSection() {
  return (
    <section className="section-padding bg-secondary/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title="How It Works"
          description="A simple and transparent process from inquiry to delivery"
          centered
        />

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-4">
          {PROCESS_STEPS.map((step, index) => (
            <ProcessStep
              key={step.step}
              step={step.step}
              title={step.title}
              description={step.description}
              isLast={index === PROCESS_STEPS.length - 1}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

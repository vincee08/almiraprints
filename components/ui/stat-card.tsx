import { Card, CardContent } from "@/components/ui/card";

interface StatCardProps {
  label: string;
  value: string;
}

export function StatCard({ label, value }: StatCardProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="text-center space-y-2">
          <p className="text-3xl sm:text-4xl font-bold text-primary">
            {value}
          </p>
          <p className="text-sm text-muted-foreground font-medium">
            {label}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

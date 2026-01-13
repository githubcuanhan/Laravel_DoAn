import { Card, CardContent } from "@/components/ui/card";

export default function DashboardStatCard({
  title,
  value,
}: {
  title: string;
  value: number | string;
}) {
  return (
    <Card className="py-3">
      <CardContent className="">
        <div className="space-y-2">
          <p className="text-sm font-medium text-primary">{title}</p>
          <p className="text-3xl font-bold">
            {typeof value === "number" ? value.toLocaleString("vi-VN"): value}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler
);

export default function DashboardChart({
  data,
  title,
  dataKey,
}: {
  data: any[];
  title: string;
  dataKey: string;
}) {
  const labels = data.map((d) => `Tháng ${d.month}`);
  const values = data.map((d) => Number(d[dataKey]));

  // Lấy màu primary từ CSS variables
  const getPrimaryColor = () => {
    if (typeof window !== "undefined") {
      const style = getComputedStyle(document.documentElement);
      const primary = style.getPropertyValue("--primary").trim();
      // Convert HSL to rgb
      const hslMatch = primary.match(/(\d+\.?\d*)\s+(\d+\.?\d*)%\s+(\d+\.?\d*)%/);
      if (hslMatch) {
        const h = parseFloat(hslMatch[1]);
        const s = parseFloat(hslMatch[2]) / 100;
        const l = parseFloat(hslMatch[3]) / 100;
        return hslToRgb(h, s, l);
      }
    }
    return "rgb(59, 130, 246)"; // fallback color
  };

  const hslToRgb = (h: number, s: number, l: number) => {
    let r, g, b;
    if (s === 0) {
      r = g = b = l;
    } else {
      const hue2rgb = (p: number, q: number, t: number) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
      };
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h / 360 + 1 / 3);
      g = hue2rgb(p, q, h / 360);
      b = hue2rgb(p, q, h / 360 - 1 / 3);
    }
    return `rgb(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(
      b * 255
    )})`;
  };

  const primaryColor = getPrimaryColor();

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
        <span className="text-sm font-medium text-muted-foreground">
          {values[values.length - 1]?.toLocaleString("vi-VN")}
        </span>
      </CardHeader>
      <CardContent>
        <Line
          data={{
            labels,
            datasets: [
              {
                label: title,
                data: values,
                borderColor: primaryColor,
                backgroundColor: (context) => {
                  const ctx = context.chart.ctx;
                  const gradient = ctx.createLinearGradient(0, 0, 0, 300);
                  gradient.addColorStop(
                    0,
                    primaryColor.replace("rgb", "rgba").replace(")", ", 0.2)")
                  );
                  gradient.addColorStop(
                    1,
                    primaryColor.replace("rgb", "rgba").replace(")", ", 0)")
                  );
                  return gradient;
                },
                borderWidth: 2,
                tension: 0.4,
                fill: true,
                pointRadius: 4,
                pointHoverRadius: 6,
                pointBackgroundColor: primaryColor,
                pointBorderColor: "#ffffff",
                pointBorderWidth: 2,
              },
            ],
          }}
          options={{
            responsive: true,
            maintainAspectRatio: true,
            interaction: {
              mode: "index",
              intersect: false,
            },
            plugins: {
              legend: {
                display: false,
              },
              tooltip: {
                enabled: true,
                backgroundColor: "rgba(0, 0, 0, 0.8)",
                titleColor: "#fff",
                bodyColor: "#fff",
                borderColor: "rgba(255, 255, 255, 0.1)",
                borderWidth: 1,
                padding: 12,
                displayColors: false,
                callbacks: {
                  label: function (context) {
                    return `${context.parsed.y.toLocaleString("vi-VN")}`;
                  },
                },
              },
            },
            scales: {
              x: {
                grid: {
                  color: "rgba(0, 0, 0, 0.05)",
                  drawBorder: false,
                },
                ticks: {
                  color: "#6b7280",
                  font: {
                    size: 12,
                  },
                },
                border: {
                  display: false,
                },
              },
              y: {
                grid: {
                  color: "rgba(0, 0, 0, 0.05)",
                  drawBorder: false,
                },
                ticks: {
                  color: "#6b7280",
                  font: {
                    size: 12,
                  },
                  callback: function (value) {
                    return (value as number).toLocaleString("vi-VN");
                  },
                },
                border: {
                  display: false,
                },
              },
            },
          }}
        />
      </CardContent>
    </Card>
  );
}

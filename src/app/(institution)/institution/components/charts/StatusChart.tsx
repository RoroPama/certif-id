"use client";

import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

interface StatusData {
  statut: string;
  count: number;
}

interface StatusChartProps {
  data: StatusData[];
}

const COLORS = {
  EN_ATTENTE: "#f59e0b", // amber
  APPROUVE: "#10b981", // emerald
  REJETE: "#ef4444", // red
};

const STATUS_LABELS: Record<string, string> = {
  EN_ATTENTE: "En attente",
  APPROUVE: "Approuvé",
  REJETE: "Rejeté",
};

export function StatusChart({ data }: StatusChartProps) {
  // Formater les données pour l'affichage
  const formattedData = data.map((item) => ({
    name: STATUS_LABELS[item.statut] || item.statut,
    value: item.count,
    statut: item.statut,
  }));

  const getColor = (statut: string) => {
    return COLORS[statut as keyof typeof COLORS] || "#94a3b8";
  };

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={formattedData}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }) =>
            `${name}: ${(percent * 100).toFixed(0)}%`
          }
          outerRadius={100}
          fill="#8884d8"
          dataKey="value"
        >
          {formattedData.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={getColor(entry.statut)}
            />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            backgroundColor: "white",
            border: "1px solid #e2e8f0",
            borderRadius: "8px",
          }}
        />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}


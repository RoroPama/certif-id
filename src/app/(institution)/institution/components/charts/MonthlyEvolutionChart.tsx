"use client";

import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface MonthlyEvolutionData {
  mois: string;
  count: number;
}

interface MonthlyEvolutionChartProps {
  data: MonthlyEvolutionData[];
}

export function MonthlyEvolutionChart({ data }: MonthlyEvolutionChartProps) {
  // Formater les données pour l'affichage
  const formattedData = data.map((item) => ({
    mois: new Date(item.mois + "-01").toLocaleDateString("fr-FR", {
      month: "short",
      year: "numeric",
    }),
    count: item.count,
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart
        data={formattedData}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis
          dataKey="mois"
          stroke="#64748b"
          style={{ fontSize: "12px" }}
          angle={-45}
          textAnchor="end"
          height={60}
        />
        <YAxis stroke="#64748b" style={{ fontSize: "12px" }} />
        <Tooltip
          contentStyle={{
            backgroundColor: "white",
            border: "1px solid #e2e8f0",
            borderRadius: "8px",
          }}
        />
        <Legend />
        <Line
          type="monotone"
          dataKey="count"
          stroke="#3b82f6"
          strokeWidth={2}
          name="Nombre de demandes"
          dot={{ fill: "#3b82f6", r: 4 }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}


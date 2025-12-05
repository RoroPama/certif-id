"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface DocumentTypeData {
  documentType: string;
  count: number;
  montantTotal: number;
}

interface DocumentTypeChartProps {
  data: DocumentTypeData[];
  showAmount?: boolean;
}

export function DocumentTypeChart({
  data,
  showAmount = false,
}: DocumentTypeChartProps) {
  // Formater les données pour l'affichage
  const formattedData = data.map((item) => ({
    type: item.documentType,
    count: item.count,
    montant: item.montantTotal,
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        data={formattedData}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis
          dataKey="type"
          stroke="#64748b"
          style={{ fontSize: "12px" }}
          angle={-45}
          textAnchor="end"
          height={80}
        />
        <YAxis stroke="#64748b" style={{ fontSize: "12px" }} />
        <Tooltip
          contentStyle={{
            backgroundColor: "white",
            border: "1px solid #e2e8f0",
            borderRadius: "8px",
          }}
          formatter={(value: number, name: string) => {
            if (name === "montant") {
              return `${value.toLocaleString("fr-FR")} FCFA`;
            }
            return value;
          }}
        />
        <Legend />
        <Bar
          dataKey="count"
          fill="#3b82f6"
          name="Nombre de documents"
          radius={[8, 8, 0, 0]}
        />
        {showAmount && (
          <Bar
            dataKey="montant"
            fill="#10b981"
            name="Montant total (FCFA)"
            radius={[8, 8, 0, 0]}
          />
        )}
      </BarChart>
    </ResponsiveContainer>
  );
}


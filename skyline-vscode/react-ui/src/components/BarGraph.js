import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Bar,
} from "recharts";

const BarGraph = ({ data, height, xlabel, ylabel, color }) => {
  return (
    <ResponsiveContainer height={height}>
      <BarChart
        data={data}
        margin={{ top: 10, right: 10, left: 10, bottom: 50 }}
      >
        <CartesianGrid />
        <XAxis dataKey="name" label={{ value: xlabel, position: 'insideBottom', offset:-15}}/>
        <YAxis label={{ value: ylabel, angle: -90, position: 'insideLeft', offset:-2 }}/>
        <Tooltip />
        <Bar dataKey="value" fill={color}/>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default BarGraph;

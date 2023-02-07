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
  let upperLimit = 0;
  data.forEach(element => {
    const predictedTime = parseFloat(Number(element.x));
    upperLimit = predictedTime > upperLimit ? predictedTime: upperLimit
  });
  upperLimit *=1.1;
  return (
    <ResponsiveContainer width="80%" height={height}>
      <BarChart
      layout="vertical"
        data={data}
        margin={{ top: 10, right: 30, left: 50, bottom: 50 }}
      >
        
        <XAxis type="number" domain={[0, Math.floor(upperLimit)]} label={{ value: xlabel, position: 'insideBottom', offset:-15}}/>
        <YAxis type="category" dataKey="y" label={{ value: ylabel, angle: -90, position: 'outside'}}/>
        <Tooltip />
        <Bar  dataKey="x" fill={color}/>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default BarGraph;

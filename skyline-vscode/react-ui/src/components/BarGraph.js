import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  XAxis,
  YAxis,
  Tooltip,
  Bar,
} from "recharts";


export const HorizontalBarGraph = ({ data, height, xlabel, ylabel, color }) => {
  let upperLimit = 0;
  data.forEach((element) => {
    const predictedTime = parseFloat(Number(element.x));
    upperLimit = predictedTime > upperLimit ? predictedTime : upperLimit;
  });
  upperLimit *= 1.1;
  data.sort((a, b) => a.x - b.x);
  return (
    <ResponsiveContainer width="80%" height={height}>
      <BarChart
        layout="vertical"
        data={data}
        margin={{ top: 10, right: 30, left: 50, bottom: 50 }}
        barCategoryGap={10}
      >
        <XAxis
          type="number"
          domain={[0, Math.floor(upperLimit)]}
          label={{ value: xlabel, position: "insideBottom", offset: -15 }}
        />
        <YAxis
          width={70}
          type="category"
          dataKey="y"
          label={{
            value: ylabel,
            angle: -90,
            position: "insideLeft",
            offset: -35,
          }}
        />
        <Tooltip />
        <Bar dataKey="x" fill={color} />
      </BarChart>
    </ResponsiveContainer>
  );
};

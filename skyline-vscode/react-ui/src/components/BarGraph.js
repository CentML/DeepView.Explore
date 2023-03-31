import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  XAxis,
  YAxis,
  Tooltip,
  Bar,
} from "recharts";


export const HorizontalBarGraph = ({ data, height, xlabel, ylabel, color, onBarClick }) => {
  let upperLimit = 0;
  let longestLabel = 0;
  data.forEach((element) => {
    const value = parseFloat(Number(element.x));
    upperLimit = value > upperLimit ? value : upperLimit;
    const currLabelLength = element.y.length;
    longestLabel = currLabelLength > longestLabel ? currLabelLength : longestLabel;
  });
  upperLimit *= 1.1;
  data.sort((a, b) => a.x - b.x);
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart
        layout="vertical"
        data={data}
        margin={{ top: 20, right: 20, left: 30, bottom: 20 }}
        barCategoryGap={10}
      >
        <XAxis
          type="number"
          dataKey="x"
          domain={[0, 'auto']}
          label={{ value: xlabel, position: "insideBottom", offset: -15 }}
          allowDecimals={true}
        />
        <YAxis
          type="category"
          width={longestLabel*7}
          dataKey="y"
          label={{
            value: ylabel,
            angle: -90,
            position: "insideLeft",
            offset: -70,
          }}
        />
        <Tooltip
        formatter={(value) => [value.toFixed(4), xlabel]} />
        <Bar dataKey="x" fill={color} onClick={onBarClick} />
      </BarChart>
    </ResponsiveContainer>
  );
};

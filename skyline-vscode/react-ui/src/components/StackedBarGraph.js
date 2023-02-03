import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Bar,
  Legend,
  Label,
  LabelList,
  Cell,
} from "recharts";

const renderCustomizedLabel = (props) => {
  const { x, y, width, height, value } = props;
  const Y_OFFSET = 10;

  return (
    value === "current" && (
      <g>
        <text
          x={x + width / 2}
          y={y - Y_OFFSET}
          fill="#1c2833"
          fontSize={12}
          fontWeight={900}
          fontFamily="sans-serif"
          textAnchor="middle"
          dominantBaseline="middle"
        >
          {"Current Profiling"}
        </text>
      </g>
    )
  );
};

const StackedBarGraph = ({ data, height, xlabel, ylabel, bar1_color, bar2_color }) => {
  return (
    <ResponsiveContainer height={height}>
      <BarChart
        data={data}
        margin={{ top: 30, right: 60, left: 25, bottom: 50 }}
      >
        <CartesianGrid horizontal={false} vertical={false} />
        <XAxis
          dataKey="name"
          label={{ value: xlabel, position: "insideBottom", offset: -25 }}
        />
        <YAxis width={120}>
          <Label value={ylabel} angle={-90} position="outside" />
        </YAxis>
        <Tooltip />
        <Bar dataKey="cpu" stackId="a" fill={bar1_color}>
          {data.map((entry, index) => (
            <Cell
              key={`bar1-${index}`}
              fill={
                entry.name === "current" ? entry.cpu_color : entry.cpu_color_opacity
              }
            />
          ))}
        </Bar>
        <Bar isAnimationActive={false} dataKey="gpu" stackId="a" fill={bar2_color}>
          {data.map((entry, index) => (
            <Cell
              key={`bar2-${index}`}
              fill={
                entry.name === "current" ? entry.gpu_color : entry.gpu_color_opacity
              }
            />
          ))}
          <LabelList
            dataKey="name"
            position="top"
            content={renderCustomizedLabel}
          />
        </Bar>
        <Legend align="center" verticalAlign="top" height={50}/>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default StackedBarGraph;

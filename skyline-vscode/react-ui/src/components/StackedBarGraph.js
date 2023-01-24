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

const StackedBarGraph = ({ data, height, xlabel, ylabel }) => {
  return (
    <ResponsiveContainer height={height}>
      <BarChart
        data={data}
        margin={{ top: 30, right: 10, left: 50, bottom: 50 }}
      >
        <CartesianGrid horizontal={false} vertical={false} />
        <XAxis
          dataKey="name"
          label={{ value: xlabel, position: "insideBottom", offset: -45 }}
        />
        <YAxis width={120}>
          <Label value={ylabel} angle={-90} position="outside" />
        </YAxis>
        <Tooltip />
        <Bar dataKey="cpu" stackId="a" fill="#5499c7">
          {data.map((entry, index) => (
            <Cell
              key={`bar1-${index}`}
              fill={
                entry.name === "current" ? "#5499c7" : "rgba(84,153,199,0.55)"
              }
            />
          ))}
        </Bar>
        <Bar isAnimationActive={false} dataKey="gpu" stackId="a" fill="#17a589">
          {data.map((entry, index) => (
            <Cell
              key={`bar2-${index}`}
              fill={
                entry.name === "current" ? "#17a589" : "rgba(23,165,137,0.55)"
              }
            />
          ))}
          <LabelList
            dataKey="name"
            position="top"
            content={renderCustomizedLabel}
          />
        </Bar>
        <Legend align="center" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default StackedBarGraph;

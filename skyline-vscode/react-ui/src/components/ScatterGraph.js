import React from "react";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  CartesianGrid,
  ResponsiveContainer,
  Label,
  Legend,
  Tooltip,
  LabelList,
} from "recharts";
import { calculate_training_time, currencyFormat } from "../utils/utils";
import { gpuPropertyList } from "../data/providers";

export const ProviderScatterGraph = ({
  data,
  onClickHandler,
  xlabel,
  ylabel,
  providers,
  numIterations,
}) => {
  const finalData = [];
  if (data.length > 0) {
    data.forEach((item) => {
      const time = calculate_training_time(numIterations, item);
      const cost = item.info.cost * time;
      finalData.push({
        ...item,
        x: time,
        y: cost,
      });
    });
  }

  const formatYAxis = (value) => {
    return currencyFormat(value);
  };

  const fortmatXAxis = (value) => {
    const formatter = new Intl.NumberFormat("en-US", {
      notation: "compact",
    });
    return formatter.format(value);
  };

  return (
    <>
      {finalData.length > 0 ? (
        <ResponsiveContainer width="80%" height={400}>
          <ScatterChart
            margin={{
              top: 20,
              right: 20,
              bottom: 30,
              left: 20,
            }}
          >
            <CartesianGrid />
            <XAxis type="number" dataKey="x" tickFormatter={fortmatXAxis}>
              <Label value={xlabel} position="insideBottom" offset={-15} />
            </XAxis>
            <YAxis
              type="number"
              dataKey="y"
              width={150}
              tickFormatter={formatYAxis}
            >
              <Label value={ylabel} angle={-90} position="outside" />
            </YAxis>
            <ZAxis type="number" dataKey="z" range={[200, 300]} />
            {Object.keys(providers).map((key, index) => {
              const providerData = providers[key];
              const providerInstances = finalData.filter(
                (item) => item.info.provider === key
              );
              return (
                <Scatter
                  key={index}
                  name={key}
                  fill={providerData.color}
                  data={providerInstances}
                  onClick={(e) => onClickHandler(e.payload)}
                />
              );
            })}
            <Legend
              verticalAlign="top"
              layout="vertical"
              align="right"
              wrapperStyle={{
                paddingLeft: "10px",
              }}
            />
          </ScatterChart>
        </ResponsiveContainer>
      ) : (
        <div>No data to show, please change filters</div>
      )}
    </>
  );
};

export const HabitatScatterGraph = ({ habitatData, height, color }) => {
  const renderTooltip = (props) => {
    const { active, payload } = props;

    if (active && payload && payload.length) {
      const data = payload[0] && payload[0].payload;

      return (
        <div
          style={{
            backgroundColor: "#fff",
            border: "1px solid #999",
            margin: 0,
            padding: 5,
          }}
        >
          <p style={{ margin: 0 }}>{data.card}</p>
          <p style={{ margin: 0 }}>
            <span>time: </span>
            {data.time}
          </p>
        </div>
      );
    }

    return null;
  };

  const renderCustomizedLabel = (props) => {
    const { x, y, width, height, value } = props;
    console.log(x, y, width, height, value);
    const y_offset = 5;
    return (
      <text x={x + width / 2} y={y - y_offset}>
        {value}
      </text>
    );
  };

  const habitatConsumerCards = [];
  const habitatServerCards = [];
  const sourceInHabitat = habitatData.find(
    (item) => item[0].toLowerCase() === "source"
  );
  const sourceCard = [
    {
      time: parseFloat(Number(sourceInHabitat[1]).toFixed(2)),
      card: "Local GPU",
      index: 1,
      size: 100,
    },
  ];

  gpuPropertyList.forEach((item) => {
    const findInHabitat = habitatData.find(
      (card) => card[0].toLowerCase() === item.name.toLowerCase()
    );
    if (item.type === "server") {
      habitatServerCards.push({
        time: parseFloat(Number(findInHabitat[1]).toFixed(2)),
        card: findInHabitat[0],
        index: 1,
        size: 100,
      });
    } else {
      habitatConsumerCards.push({
        time: parseFloat(Number(findInHabitat[1]).toFixed(2)),
        card: findInHabitat[0],
        index: 1,
        size: 100,
      });
    }
  });

  const LOWER_LIMIT =
    0.8 * habitatData.reduce((a, b) => Math.min(a, b[1]), +Infinity);
  const UPPER_LIMIT =
    1.2 * habitatData.reduce((a, b) => Math.max(a, b[1]), -Infinity);

  return (
    <>
      <div style={{ width: "100%" }}>
        <ResponsiveContainer width="100%" height={height}>
          <ScatterChart margin={{ top: 30, right: 30, left: 50, bottom: 10 }}>
            <XAxis
              type="number"
              dataKey="time"
              domain={[
                parseFloat(Number(LOWER_LIMIT).toFixed(2)),
                parseFloat(Number(UPPER_LIMIT).toFixed(2)),
              ]}
              tick={{ fontSize: 0 }}
              tickLine={{ transform: "translate(0, -6)" }}
            />

            <YAxis
              type="number"
              dataKey="index"
              name="Source"
              width={80}
              tick={false}
              tickLine={false}
              axisLine={false}
              label={{ value: "Source", position: "insideTopRight" }}
            />
            <ZAxis type="number" dataKey="size" range={[0, 250]} />
            <Tooltip
              cursor={{ strokeDasharray: "3 3" }}
              wrapperStyle={{ zIndex: 100 }}
              content={renderTooltip}
            />
            <Scatter data={sourceCard} fill="#ffc300" />
          </ScatterChart>
        </ResponsiveContainer>
        <ResponsiveContainer width="100%" height={height}>
          <ScatterChart margin={{ top: 30, right: 30, left: 50, bottom: 10 }}>
            <XAxis
              type="number"
              dataKey="time"
              domain={[
                parseFloat(Number(LOWER_LIMIT).toFixed(2)),
                parseFloat(Number(UPPER_LIMIT).toFixed(2)),
              ]}
              tick={{ fontSize: 0 }}
              tickLine={{ transform: "translate(0, -6)" }}
            />

            <YAxis
              type="number"
              dataKey="index"
              name="Consumer Grade"
              width={80}
              tick={false}
              tickLine={false}
              axisLine={false}
              label={{ value: "Consumer Grade", position: "insideTopRight" }}
            />
            <ZAxis type="number" dataKey="size" range={[0, 250]} />
            <Tooltip
              cursor={{ strokeDasharray: "3 3" }}
              wrapperStyle={{ zIndex: 100 }}
              content={renderTooltip}
            />
            <Scatter data={habitatConsumerCards} fill={color} />
          </ScatterChart>
        </ResponsiveContainer>
        <ResponsiveContainer width="100%" height={height}>
          <ScatterChart margin={{ top: 40, right: 30, left: 50, bottom: 30 }}>
            <XAxis
              type="number"
              dataKey="time"
              interval="preserveStartEnd"
              domain={[
                parseFloat(Number(LOWER_LIMIT).toFixed(2)),
                parseFloat(Number(UPPER_LIMIT).toFixed(2)),
              ]}
              tickLine={{ transform: "translate(0, -6)" }}
              label={{
                value: "Predicted Runtime (ms)",
                position: "insideBottom",
                offset: -15,
              }}
            />

            <YAxis
              type="number"
              dataKey="index"
              name="Server Grade"
              width={80}
              tick={false}
              tickLine={false}
              axisLine={false}
              label={{ value: "Server Grade", position: "insideTopRight" }}
            />
            <ZAxis type="number" dataKey="size" range={[0, 250]} />
            <Tooltip
              cursor={{ strokeDasharray: "3 3" }}
              wrapperStyle={{ zIndex: 100 }}
              content={renderTooltip}
            />
            <Scatter data={habitatServerCards} fill={color}>
              <LabelList dataKey="card" content={renderCustomizedLabel} />
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </>
  );
};

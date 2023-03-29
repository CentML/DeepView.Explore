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
import { gpuPropertyList } from "../data/properties";

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

export const HabitatScatterGraph = ({ habitatData, height }) => {
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
    // eslint-disable-next-line no-unused-vars
    const { x, y, width, height, value } = props;
    const y_offset = 5;
    return (
      <text x={x + width / 2} y={y - y_offset} fill="#1c2833"
      fontSize={12}
      fontWeight={650}
      fontFamily="sans-serif">
        {value}
      </text>
    );
  };

  const NUMBER_OF_COLUMNS = 5;
  const habitatConsumerCards = [];
  const habitatServerCards = [];
  const sourceInHabitat = [];

  habitatData.sort((a, b) => a[1] - b[1]);

  habitatData.forEach((habitatItem,idx) => {
    const findGPUProperty = gpuPropertyList.find(
      (item) => item.name.toLowerCase() === habitatItem[0].toLowerCase()
    );
    if (findGPUProperty) {
      if (findGPUProperty.type === "server") {
        habitatServerCards.push({
          time: parseFloat(Number(habitatItem[1]).toFixed(2)),
          card: habitatItem[0],
          index: idx%NUMBER_OF_COLUMNS +0.5,
          size: 100,
        });
      } else {
        habitatConsumerCards.push({
          time: parseFloat(Number(habitatItem[1]).toFixed(2)),
          card: habitatItem[0],
          index: idx%NUMBER_OF_COLUMNS+0.5,
          size: 100,
        });
      }
    } else {
      sourceInHabitat.push({
        time: parseFloat(Number(habitatItem[1]).toFixed(2)),
        card: "Local GPU",
        index: idx%NUMBER_OF_COLUMNS+0.5,
        size: 100,
      });
    }
  });

  const UPPER_LIMIT =
    1.2 * habitatData.reduce((a, b) => Math.max(a, b[1]), -Infinity);

  return (
    <>
      <ResponsiveContainer width="100%" height={height}>
        <ScatterChart margin={{ top: 60, right: 30, left: 50, bottom: 30 }}>
          <XAxis
            type="number"
            dataKey="time"
            interval="preserveStartEnd"
            domain={[0, parseFloat(Number(UPPER_LIMIT).toFixed(2))]}
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
            domain={[0,NUMBER_OF_COLUMNS+1]}
            width={80}
            tick={false}
            tickLine={false}
            axisLine={false}
            label={{ value: "GPU cards", position: "insideTopRight" }}
          />
          <ZAxis type="number" dataKey="size" range={[0, 250]} />
          <Tooltip
            cursor={{ strokeDasharray: "3 3" }}
            wrapperStyle={{ zIndex: 100 }}
            content={renderTooltip}
          />
          <Scatter
            name="workstation card"
            data={habitatConsumerCards}
            fill="rgb(255, 99, 132)"
          >
            <LabelList dataKey="card" content={renderCustomizedLabel} />
          </Scatter>
          <Scatter
            name="server card"
            data={habitatServerCards}
            fill="rgb(53, 162, 235)"
          >
            <LabelList dataKey="card" content={renderCustomizedLabel} />
          </Scatter>
          <Scatter
            name="local card"
            data={sourceInHabitat}
            fill="rgb( 155, 89, 182)"
          >
            <LabelList dataKey="card" content={renderCustomizedLabel} />
          </Scatter>
          <Legend verticalAlign="top" align="left" height={60} />
        </ScatterChart>
      </ResponsiveContainer>
    </>
  );
};

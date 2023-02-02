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
} from "recharts";

const ScatterGraph = ({ data, onClickHandler, xlabel, ylabel, providers,numIterations }) => {
  const finalData = [];
  if (data.length>0){
    data.forEach((item)=>{
      const time = numIterations * item.x  / 3.6e6 / item.info.ngpus;
      const cost = item.info.cost * time;
      finalData.push({
        ...item,
        x: time,
        y: cost
      })
    })
  }
  const scientificFormater = new Intl.NumberFormat("en-US", {
    style: 'currency', 
    currency: 'USD',
    notation: "compact",
    compactDisplay: "short",
  });
  const formatYAxis = (value) => {
    return scientificFormater.format(value);
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
            <XAxis type="number" dataKey="x">
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
            {/* <Scatter data={data} onClick={(e) => onClickHandler(e.payload)} /> */}
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

export default ScatterGraph;

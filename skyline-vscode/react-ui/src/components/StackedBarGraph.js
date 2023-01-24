import React, {useState} from "react";
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
  ReferenceLine,
  Cell
} from "recharts";

const StackedBarGraph = ({ data, height, xlabel, ylabel }) => {
    const [focusBar, setFocusBar] = useState(null);
const [mouseLeave, setMouseLeave] = useState(true);

  return (
    <ResponsiveContainer height={height}>
      <BarChart 
      onMouseMove={(state) => {
        if (state.isTooltipActive) {
          setFocusBar(state.activeTooltipIndex);
          setMouseLeave(false);
        } else {
          setFocusBar(null);
          setMouseLeave(true);
        }
     }}
        data={data}
        margin={{ top: 10, right: 10, left: 50, bottom: 50 }}
      >
        <CartesianGrid horizontal={false} vertical={false}/>
        <XAxis dataKey="name" label={{ value: xlabel, position: 'insideBottom', offset:-45}}/>
        <YAxis width={100}>
          <Label value={ylabel} angle={-90} position="outside"/>
        </YAxis>
        <Tooltip />
        <Bar dataKey="cpu" stackId="a" fill='#5499c7'>
        {data.map((entry, index) => (
            <Cell key={`bar1-${index}`} fill={
                entry.name === 'current'
                  ? "#5499c7"
                  : "rgba(84,153,199,0.55)"
              }/>
        ))}
        </Bar>
        <Bar dataKey="gpu" stackId="a" fill='#17a589'> 
        {data.map((entry, index) => (
            <Cell key={`bar2-${index}`} fill={
                entry.name === 'current'
                  ? "#17a589"
                  : "rgba(23,165,137,0.55)"
              }/>
        ))}
        </Bar>        
        <ReferenceLine x="current" strokeWidth={0} >
            <Label width={10} value={'Current Experiment'} position={'insideTop'} style={{fontSize:20,fontWeight:900,fontFamily:'sans-serif',fill:'#17202a'}}/> 
            </ReferenceLine>
        <Legend align="center" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default StackedBarGraph;
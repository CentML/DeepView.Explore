import React from "react";
import { makeWidthFlexible, RadialChart } from "react-vis";

const PieChart = ({ data, height, labelMultiplier, fontSize, showLabel }) => {
  const FlexRadialChart = makeWidthFlexible(RadialChart);
  return (
    <FlexRadialChart
      data={data}
      height={height}
      labelsRadiusMultiplier={labelMultiplier}
      labelsStyle={{
        fontSize: fontSize,
      }}
      showLabels={showLabel}
      colorType="literal"
    />
  );
};

export default PieChart;

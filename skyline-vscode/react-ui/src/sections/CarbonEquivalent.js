import React from "react";
import Container from "react-bootstrap/Container";

import {
  ResponsiveContainer,
  BarChart,
  XAxis,
  YAxis,
  Tooltip,
  Bar,
} from "recharts";

import styled from "styled-components";
import Subheader from "../components/Subheader";

const CarbonEquivalent = ({ carbonData }) => {
  let XAxisLabel = "CO2e (metric tons)";
  let largestValue = 0.0;
  let longestRegionName = 0;
  carbonData.forEach((element) => {
    const value = parseFloat(Number(element.carbonEmissions));
    largestValue = value > largestValue ? value : largestValue;

    const currRegionNameLength = element.regionName.length;
    longestRegionName = currRegionNameLength > longestRegionName ? currRegionNameLength : longestRegionName;
  });
  // Convert to kgs if we have small values
  if (largestValue < 1) {
    carbonData.map(value => value.carbonEmissions*1000)
    XAxisLabel = "C02e (kgs)"
  }
  carbonData.sort((a, b) => a.carbonEmissions - b.carbonEmissions);
  
  const toolTipFormatter = ({ active, payload, label }) => { 
    if (active && payload && payload.length) {
      return (
      <div className="recharts-default-tooltip">
        <h5 className="recharts-tooltip-label">{payload[0].payload.regionName}</h5>
        <p className="recharts-tooltip-label">{`${XAxisLabel} : ${payload[0].value.toFixed(4)}`}</p>
        <p className="recharts-tooltip-label">This is equivalent to:</p>
        <ul className="recharts-tooltip-item-list">
          <li className="recharts-tooltip-item">{`${payload[0].payload.miles}  miles driven`}</li>
          <li className="recharts-tooltip-item">{`${payload[0].payload.phone} smartphones charged `}</li>
          <li className="recharts-tooltip-item">{`${payload[0].payload.household[0]} homes' energy use for 1 ${payload[0].payload.household[1]}`}</li>
        </ul>
      </div>
    );
    } else {
      return null;
    }
  };

  return (
    <>
      <Wrapper>
        <div className="innpv-memory innpv-subpanel">
          <Subheader icon="database">Environmental Impact</Subheader>
          <div className="innpv-subpanel-content">
            <Container fluid>
                <ResponsiveContainer width="100%" height={50*carbonData.length}>
                  <BarChart
                    layout="vertical"
                    data={carbonData}
                    margin={{ top: 20, right: 20, left: 30, bottom: 20 }}
                    barCategoryGap={10}
                  >
                    <XAxis
                      type="number"
                      domain={[0, 'auto']}
                      label={{ value: XAxisLabel, position: "insideBottom", offset: -15 }}
                      allowDecimals={true}
                    />
                    <YAxis
                      type="category"
                      width={longestRegionName*7}
                      dataKey="regionName"
                      label={{
                        value: "Regions",
                        angle: -90,
                        position: "insideLeft",
                        offset: -70,
                      }}
                    />
                    <Tooltip content={toolTipFormatter}/>
                      <Bar dataKey={"carbonEmissions"} fill={"#27ae60"}/>
                  </BarChart>
                </ResponsiveContainer>
            </Container>
          </div>
        </div>
      </Wrapper>
    </>
  );
};

const Wrapper = styled.main`

  h6 {
    text-align: center;
    margin-top: 0.25rem;
  }

  .list-item {
    border: none;
  }

  .center {
    display: flex;
    align-items: center;
    flex-direction: column;
    padding: 0.25rem;
    text-align: center;
    p {
      margin-top: 0.5rem;
    }
  }

  .bargraph-container {
    margin-top: 1rem;
  }
  
  .recharts-default-tooltip {
    margin: 0 !important;
    padding: 10px;
    background-color: #fff;
    border: 1px solid #ccc;
    white-space: nowrap;
  }
`;

export default CarbonEquivalent;

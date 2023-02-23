import React, { useState } from "react";

import Subheader from "../components/Subheader";
import { Form, Container, Row, Col, Spinner, Card } from "react-bootstrap";
import { HorizontalBarGraph } from "../components/BarGraph";
import { HabitatScatterGraph } from "../components/ScatterGraph";
import { gpuPropertyList } from "../data/providers";

// The colors used for the visualization
// The first n-1 colors should follow a blue gradient while the last
// color is used for the current device.
const colors = [
  "#7986cb",
  "#5c6bc0",
  "#3f51b5",
  "#3949ab",
  "#303f9f",
  "#283593",
  "#1a237e",
  "#ffc300",
];

const initialLoad = (habitatData) => {
  let habitatProperties = [];

  gpuPropertyList.forEach((item, idx) => {
    const findInHabitat = habitatData.find(
      (card) => card[0].toLowerCase() === item.name.toLowerCase()
    );
    if (item.type === "server") {
      habitatProperties.push({
        x: parseFloat(Number(findInHabitat[1]).toFixed(2)),
        y: findInHabitat[0],
        fill: colors[idx % (colors.length - 1)],
        type: "server",
      });
    } else {
      habitatProperties.push({
        x: parseFloat(Number(findInHabitat[1]).toFixed(2)),
        y: findInHabitat[0],
        fill: colors[idx % (colors.length - 1)],
        type: "consumer",
      });
    }
  });

  const sourceInHabitat = habitatData.find(
    (item) => item[0].toLowerCase() === "source"
  );

  habitatProperties.push({
    x: parseFloat(Number(sourceInHabitat[1]).toFixed(2)),
    y: sourceInHabitat[0],
    fill: colors[colors.length - 1],
    type: "source",
  });

  // for (var i = 0; i < habitatData.length; i++) {
  //   habitatProperties.push({
  //     y: habitatData[i][0],
  //     x: habitatData[i][1].toFixed(2),
  //     fill:
  //       habitatData[i][0] === "source"
  //         ? colors[colors.length - 1]
  //         : colors[i % (colors.length - 1)],
  //   });
  // }
  return habitatProperties;
};

export default function Habitat({ habitatData }) {
  const [habitatState, setHabitatState] = useState({
    data: initialLoad(habitatData),
    filter: "all",
  });

  const originalData = initialLoad(habitatData);

  const filterByCardType = (cardType) => {
    const filteredData = originalData.filter(item=>{
      if(cardType !=='all'){
        return item.type === cardType || item.type === 'source'
      }
      return true;
    })
    setHabitatState(
      {data: filteredData,
      filter:cardType}
    )
  }

  return (
    <>
      <div className="innpv-memory innpv-subpanel">
        <Subheader icon="database">Habitat</Subheader>
        <div className="innpv-subpanel-content">
          {habitatData.length === 0 && (
            <Container fluid>
              <Row className="justify-content-md-center">
                <Card>
                  <Card.Body>
                    <Spinner animation="border" size="sm" /> Loading Habitat
                    predictions.
                  </Card.Body>
                </Card>
              </Row>
            </Container>
          )}
          {habitatData !== [] && (
            <Container fluid>
              <Row>
                <Col xxl={4}>
                  <div style={{ marginTop: "1rem" }}>
                    <h6>Filter by type of card</h6>
                    <Form.Select onChange={(e) => {filterByCardType(e.target.value)}}>
                      <option value="all">All</option>
                      <option value="consumer">Consumer</option>
                      <option value="server">Server</option>
                    </Form.Select>
                  </div>
                </Col>
              </Row>
              <Row>
                <div
                  style={{
                    width: "80%",
                    marginTop: "1rem",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <h6>Predicted Runtime</h6>
                </div>
                <HorizontalBarGraph
                  data={habitatState.data}
                  height={50 * habitatState.data.length}
                  xlabel={"msec"}
                  ylabel={"GPU Cards"}
                />
              </Row>
            </Container>
          )}
        </div>
        <div className="innpv-subpanel-content">
          {habitatData !== [] && (
            <HabitatScatterGraph
              habitatData={habitatData}
              height={150}
              color={"#8884d8"}
            />
          )}
        </div>
      </div>
    </>
  );
}

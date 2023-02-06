import Subheader from "./Subheader";
import { Container, Row, Spinner, Card } from "react-bootstrap";
import BarGraph from "./components/HorizontalBarGraph";

export default function Habitat({ habitatData }) {
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

  let habitatProperties = [];

  for (var i = 0; i < habitatData.length; i++) {
    habitatProperties.push({
      y: habitatData[i][0],
      x: habitatData[i][1].toFixed(2),
      fill:
        habitatData[i][0] === "source"
          ? colors[colors.length - 1]
          : colors[i % (colors.length - 1)],
    });
  }

  return (
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
          <BarGraph
            data={habitatProperties}
            height={350}
            xlabel={"Predicted Runtime (ms)"}
            ylabel={""}
          />
        )}
      </div>
    </div>
  );
}

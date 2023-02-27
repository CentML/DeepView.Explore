import React,{useState} from "react";
import ProjectInfo from "../components/ProjectInfo";
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Image from 'react-bootstrap/Image';
import Stack from 'react-bootstrap/Stack';

const WelcomeScreen = ({analysisState, vscodeApi}) => {
  const [btn_clicked,setBtn_clicked] = useState(false);

  const onClickBeginAnalysis = () => {
    setBtn_clicked(true);
    if(vscodeApi){
      vscodeApi.postMessage({
        command: "begin_analysis_clicked",
      });
    }
  }

  return (
    <>
      <Container>
        <Card>
          <Card.Title></Card.Title>
          <Card.Body>
            <Stack gap={3}>
              <Image src="resources/skyline.svg" width="400px"></Image>
              {analysisState && (
                <>
                  <ProjectInfo
                    projectRoot={analysisState["project_root"]}
                    entryPoint={analysisState["project_entry_point"]}
                  />
                </>
              )}
              <Button
                variant={
                  btn_clicked
                    ? "secondary"
                    : "success"
                }
                size="lg"
                onClick={onClickBeginAnalysis}
                disabled={btn_clicked}
              >
                {btn_clicked
                  ? "Analyzing Project ..."
                  : "Begin Analysis"}
              </Button>
            </Stack>
          </Card.Body>
        </Card>
      </Container>
    </>
  );
}

export default WelcomeScreen;
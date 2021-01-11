import React, { Component } from "react";
import Box from "ui-box";
import { Heading, Paragraph, TextInput, Button, toaster } from "evergreen-ui";
// import { ipcRenderer, clipboard } from "electron";

interface Props {
  peerName: string;
  connect?: (remotePeerName) => void;
}

interface State {
  remotePeerName: "";
}

export class Home extends Component<Props, State> {
  state: State = { remotePeerName: "" };

  onKeyPress = (e: any) => {
    
    if (e.key === "Enter") {
        if (!this.state.remotePeerName) {
            return toaster.danger("ID field can't be empty!"); // do i need this??
          }
      this.props.connect(this.state.remotePeerName);
    }
  };

  render() {
    return (
      <Box position="relative" height="100%" width="100%">
        <Box
          position="absolute"
          top="50%"
          left="50%"
          transform="translate(-50%, -50%)"
        >
          <Heading
            color="#1070CA"
            textAlign="center"
            marginBottom="2rem"
            size={900}
            fontWeight="bold"
          >
            ScreenView
          </Heading>
          <Paragraph textAlign="center" marginBottom="2rem">
            Contol a computer remotely!
          </Paragraph>
          <Box textAlign="center">
            <TextInput
              value={this.state.remotePeerName}
              marginBottom="2rem"
              isInvalid={!this.state.remotePeerName}
              onKeyPress={this.onKeyPress}
              display="block"
              onChange={(e: any) =>
                this.setState({ remotePeerName: e.target.value.trim() })
              }
              placeholder="Enter remote computer ID here"
            />

            <Button
              disabled={!this.state.remotePeerName}
              appearance="primary"
              onClick={this.props.connect}
              marginBottom="2rem"
              // display="block"
            >
              Connect Remote Computer
            </Button>

            <Paragraph
              color="muted"
              textDecoration="underline"
            //   onClick={() => clipboard.writeText(this.props.peerName)}
            >
              Your name: {this.props.peerName}
            </Paragraph>
          </Box>
        </Box>
      </Box>
    );
  }
}

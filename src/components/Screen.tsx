import React, { Component } from "react";
import Box from "ui-box";

interface Props {
  disconnect: () => void;
  stream: MediaStream;
}

interface State {}

export class Screen extends Component<Props, State> {
  state = {};

  componentDidMount() {}

  setUpListeners() {
    const mouseDownTypes = ["left", "middle", "right"];

    document.addEventListener("keydown", this.onKeyDown);

    document.addEventListener("mousedown", this.onMouseDown);

    // document.addEventListener("scroll", (e) => {
    //     console.log("SCROLL")
    //     console.log(e);
    // })

    document.addEventListener("mousemove", this.onMouseMove);
  }

  onMouseDown = (e: any) => { 
      console.log(e)
  };

  onKeyDown = (e: KeyboardEvent) => {
      console.log(e)
  };

  onMouseMove = (e: MouseEvent) => {
      console.log(e)
  };

  removeListeners() {}

  render() {
    return (
      <Box height="100%" width="100%" padding="1rem">
        <video src={URL.createObjectURL(this.props.stream)} autoPlay />
      </Box>
    );
  }

  componentWillUnmount() {
    this.props.disconnect();
  }
}

import React, { Component } from "react";
import Box from "ui-box";
import { RemoteEventPayload } from "../types";

interface Props {
  disconnect: () => void;
  stream: MediaStream;
  sendEvent: (event: RemoteEventPayload) => void;
}

interface State {}

export class Screen extends Component<Props, State> {
  videoRef: React.RefObject<HTMLVideoElement>;
  state = {};

  constructor(props: Props) {
    super(props);
    this.videoRef = React.createRef();
  }

  componentDidMount() {
    this.setUpListeners();
    this.videoRef.current.srcObject = this.props.stream;
  }

  setUpListeners() {
    const mouseDownTypes = ["left", "middle", "right"];

    document.addEventListener("keydown", this.onKeyDown);

    document.addEventListener("mousedown", this.onMouseDown);

    // document.addEventListener("scroll", (e) => {
    //     console.log("SCROLL")
    //     // console.log(e.);
    // })

    document.addEventListener("mousemove", this.onMouseMove);
  }

  onMouseDown = (e: MouseEvent) => {
    console.log(e);
    const mouseDownTypes = ["left", "middle", "right"];
    const { button } = e;
    const payload: RemoteEventPayload = {
      type: "mousedown",
      mouseClickType: mouseDownTypes[button],
    };
    this.props.sendEvent(payload);
  };

  onKeyDown = (e: KeyboardEvent) => {
    console.log(e);
    const { key } = e;

    const payload: RemoteEventPayload = {
      type: "keydown",
      key,
    };

    this.props.sendEvent(payload);
  };

  onMouseMove = (e: MouseEvent) => {
    console.log(e);
    const { clientX, clientY } = e;
    const { height, width } = this.videoRef.current.getBoundingClientRect();
    const payload: RemoteEventPayload = {
      type: "mousemove",
      clientX,
      clientY,
      elementHeight: height,
      elementWidth: width,
    };

    this.props.sendEvent(payload);
  };

  // formatData(e)

  removeListeners() {
    document.removeEventListener("keydown", this.onKeyDown);

    document.removeEventListener("mousedown", this.onMouseDown);

    // document.addEventListener("scroll", (e) => {
    //     console.log("SCROLL")
    //     console.log(e);
    // })

    document.removeEventListener("mousemove", this.onMouseMove);
  }

  render() {
    return (
      <Box height="100%" width="100%" padding="1rem" backgroundColor="black">
        <video ref={this.videoRef} autoPlay />
        {/* //SHOULD INITIATOR SEE THIS???? */}
      </Box>
    );
  }

  componentWillUnmount() {
    this.props.disconnect();
  }
}

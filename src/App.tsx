import React from "react";
import { Text, toaster } from "evergreen-ui";
import { randomName } from "./utils";
import Peer from "peerjs";
import { Home } from "./components/Home";
import { Screen } from "./components/Screen";

interface State {
  peer: Peer;
  mediaConnection: Peer.MediaConnection;
  stream: MediaStream
}

class App extends React.Component<{}, State> {
  state: State = {
    peer: new Peer(randomName()), // should i save the name as a field
    mediaConnection: null,
    stream: null
  };

  async componentDidMount() {
    // const peer = new Peer(randomName()); // should i just use uuid?????
    this.state.peer.on("call", (mediaConnection) => {
        mediaConnection.answer()

        mediaConnection.on("stream", (stream) => {
            this.setState({ mediaConnection, stream });
        })
    //   this.setState({ mediaConnection }, this.setStreamListener);
    });
    // this.setState({ peer });

    this.state.peer.on("close", () => {
      if (this.state.mediaConnection) {
        this.setState({ mediaConnection: null });
      }
    });

    this.state.peer.on("error", (e) => {
      console.log(e);
      toaster.danger("Error occored");
    });

    this.state.peer.on("disconnect", () => {
      console.log("Disconnected");
      if (this.state.mediaConnection) {
        this.setState({ mediaConnection: null });
      }
    });
  }

  componentWillUnmount() {
    this.state.peer.destroy();
  }

  setStreamListener() {
    this.state.mediaConnection?.on("stream", (stream) => {
        console.log(stream)
    });
  }

  connect = async (remotePeerName: string) => {
    //   this.state.peer.call()

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        //@ts-ignore
        video: {
          //@ts-ignore
          mandatory: {
            chromeMediaSource: "desktop",
            //   chromeMediaSourceId: source.id
          },
        },
        audio: false,
      });

      console.log(stream);

      const call = this.state.peer.call(remotePeerName, stream);
    //   call.on("strea")
      this.setState({ mediaConnection: call, stream})
    } catch (e) {
      toaster.danger("Error getting stream");
      console.log(e);
    }
  };

  disconnect = () => {
    this.state.peer.disconnect(); // should i use destoy???
  };

  render() {
    if (this.state?.mediaConnection && this.state.stream) {
      return <Screen disconnect={this.disconnect} stream={this.state.stream} />;
    } else {
      return <Home connect={this.connect} peerName={this.state.peer.id} />;
    }
  }
}

// const App = () => {
//     return (
//         <div>
//             Hello friend!
//         </div>
//     )
// }

export default App;

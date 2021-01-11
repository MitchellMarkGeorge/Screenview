import React from "react";
import { toaster } from "evergreen-ui";
import { randomName } from "./utils";
import Peer from "peerjs";
import { Home } from "./components/Home";
import { Screen } from "./components/Screen";
import { Loading } from "./components/Loading";
// import Box from 'ui-box';


interface State {
  peer: Peer;
  mediaConnection: Peer.MediaConnection;
  stream: MediaStream;
  isLoading: boolean;
}

class App extends React.Component<{}, State> {
  state: State = {
    peer: new Peer(randomName()), // should i save the name as a field
    mediaConnection: null,
    stream: null,
    isLoading: false,
  };

  async componentDidMount() {
    // const peer = new Peer(randomName()); // should i just use uuid?????
    this.state.peer.on("call", (mediaConnection) => {
        this.setState({ isLoading: true})
      mediaConnection.answer();

      mediaConnection.on("stream", (stream) => {
        this.setState({ mediaConnection, stream, isLoading: false });
      });
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
      console.log(stream);
    });
  }

  connect = async (remotePeerName: string) => {
    //   this.state.peer.call()

    try {
      this.setState({ isLoading: true });
      // await navigator.getUserMedia()
      // await navigator.mediaDevices
      const stream = await navigator.mediaDevices.getUserMedia({
        //@ts-ignore
        video: {
          //@ts-ignore
          mandatory: {
            chromeMediaSource: "screen",
            //   chromeMediaSourceId: source.id
          },
        },
        audio: false,
      });

      console.log(stream);

      const call = this.state.peer.call(remotePeerName, stream);
      //   call.on("strea")
      this.setState({ mediaConnection: call, stream, isLoading: false });
    } catch (e) {
      toaster.danger("Error getting stream");
      console.log(e);
      this.setState({ isLoading: false });
    } 
  };

  disconnect = () => {
    this.state.peer.disconnect(); // should i use destoy???
  };

  render() {
    if (this.state?.mediaConnection && this.state.stream) {
      return <Screen disconnect={this.disconnect} stream={this.state.stream} />;
    } else if (this.state.isLoading) {
        return <Loading/>
    } else {
      return <Home connect={this.connect} peerName={this.state.peer.id} />;
    }
    // return <Loading/>
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

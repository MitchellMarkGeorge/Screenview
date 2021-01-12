import React from "react";
import { toaster } from "evergreen-ui";
import { randomName } from "./utils";
import Peer from "peerjs";
import { Home } from "./components/Home";
import { Screen } from "./components/Screen";
import { Loading } from "./components/Loading";
import { ipcRenderer } from "electron";
import { RemoteEventPayload } from './types'

interface State {
  peer: Peer; // does peer need to be in state
  mediaConnection: Peer.MediaConnection;
  // connection: Peer.DataConnection;
  stream: MediaStream;
  isLoading: boolean;
}
// move peer things to seperate file???

class App extends React.Component<{}, State> {
  connection: Peer.DataConnection = null;
  state: State = {
    peer: new Peer(randomName()), // should i save the name as a field
    mediaConnection: null,
    stream: null,
    isLoading: false,
    // connection: null
  };

  componentDidMount() {

    ipcRenderer.on("endSession", () => {
      this.state.peer.destroy();
      this.setState({ mediaConnection: null, stream: null });
    })
    // const peer = new Peer(randomName()); // should i just use uuid?????
    this.state.peer.on("call", (mediaConnection) => {
      this.setState({ isLoading: true });
      mediaConnection.answer();

      mediaConnection.on("stream", (stream) => {
        this.setState({ mediaConnection, stream, isLoading: false });
      });
      //   this.setState({ mediaConnection }, this.setStreamListener);
    });
    // this.setState({ peer });

    // this.state.peer.on("")
    // this.state.mediaConnection.on()
    this.state.peer.on("close", () => {
      if (this.state.mediaConnection) {
        this.setState({ mediaConnection: null, stream: null });
      }
    });

    this.state.peer.on("connection", (dataConnection) => {
      this.setConnection(dataConnection);
    });

    this.state.peer.on("error", (e) => {
      console.log(e);
      toaster.danger("Error occored");
    });

    this.state.peer.on("disconnect", () => {
      console.log("Disconnected");
      if (this.state.mediaConnection) {
        this.setState({ mediaConnection: null, stream: null });
      }
    });
  }

  componentWillUnmount() {
    this.state.peer.destroy();
    ipcRenderer.removeAllListeners("endSession")
    screen.width
  }

  setConnection(connection: Peer.DataConnection) {
    this.connection = connection;
    this.setDataConnectionListeners();
  }

  setDataConnectionListeners() {
    this.connection?.on("data", (data: RemoteEventPayload) => {
      console.log(data);
      // ipcRenderer.send("remoteEvent", data, screen.)
    });

    this.connection?.on("error", (err) => {
      console.log(err);
    });
  }

  sendEvent = (e: {}) => {
    this.connection.send(e);
  }

  connect = async (remotePeerName: string) => {
    //   this.state.peer.call()

    try {
      this.setState({ isLoading: true });
      // await navigator.getUserMedia()
      // await navigator.mediaDevices

      const connection = this.state.peer.connect(remotePeerName);
      this.setConnection(connection);
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
      this.setState({ mediaConnection: call, stream, isLoading: false }, () => {
        ipcRenderer.send("updateMenuItem", true);
      });
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
    if (this.connection && this.state?.mediaConnection && this.state.stream) {
      return <Screen disconnect={this.disconnect} stream={this.state.stream} sendEvent={this.sendEvent}/>;
    } else if (this.state.isLoading) {
      return <Loading />;
    } else {
      return <Home connect={this.connect} peerName={this.state.peer.id} />;
    }
  }
}

export default App;

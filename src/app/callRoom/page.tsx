"use client";
import "@/app/callRoom/page.css";
import Navbar from "@/components/navbar/navbar";
import { useRef, useEffect, useState } from "react";
import {
  socket,
  userAction,
  removeSocket,
  setSocket,
  handleOnCreate,
  handleOnJoin,
  startingStep,
} from "@/components/functions/function";
import ReactPlayer from "react-player";
import useMediaQuery from "@mui/material/useMediaQuery";

import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  ScreenShare,
  ScreenShareIcon,
  Send,
  MessageSquareMore,
  X,
  Unplug,
} from "lucide-react";

import {
  streamLocal,
  setStreamLocal,
  tempaa,
  setTempaa,
  setRoomNoVar,
  setFormData,
  formData,
  roomNoVar,
  addClient,
  getClients,
  addPeerConnection,
  getPeerConnections,
  removePeerConnection,
  authenticationObject,
} from "@/components/variableSet/variableSet";

const page = () => {
  const localVideoRef = useRef<HTMLVideoElement>(null);

  const [remoteVideoTracks, setRemoteVideoTracks] = useState<
    MediaStreamTrack[]
  >([]);
  const [remoteAudioTracks, setRemoteAudioTracks] = useState<
    MediaStreamTrack[]
  >([]);

  const [localaStreamState, setLocalStreamState] = useState<MediaStream>();

  const [remoteStream, setRemoteStream] = useState<MediaStream[]>([]);

  const isMobileOrTablet = useMediaQuery("(max-width: 767px)");

  const [chatBoxMobile, setChatBoxMobile] = useState<boolean>(false);

  const [videoPremission, setVideoPremission] = useState<boolean>(true);
  const [audioPremission, setAudioPremission] = useState<boolean>(true);

  const clientStreamMap = new Map<string, MediaStream>();
  const [width, setWidth] = useState<number>(0);
  const [message, setMessage] = useState<string>("");

  const [messageList, setMessageList] = useState<any[]>([]);

  const configuration = {
    iceServers: [
      { urls: "stun:stun.l.google.com:19302" },

      { urls: "stun:global.stun.twilio.com:3478" },
    ],
  };

  const sendOffer = async (client: string) => {
    console.log("OFFER SENT TO", client);
    const pcStore: RTCPeerConnection = new RTCPeerConnection(configuration);
    trackEventSetup(pcStore, client);
    eventlistenerSetup(pcStore, client);
    addPeerConnection(client, pcStore);

    const pcList = getPeerConnections();
    const pc = pcList[client];

    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    socket.send(
      JSON.stringify({
        type: "offer",
        offer: offer,
        target: client,
      })
    );

    addPeerConnection(client, pc);

    console.log(pc);
  };

  const handleNegotiationNeededOffer = async (client: string) => {
    const pcList = getPeerConnections();
    const pc = pcList[client];

    if (pc) {
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      socket.send(
        JSON.stringify({
          type: "offer",
          offer: offer,
          target: client,
          negotiation: true,
        })
      );

      console.log(`NEGOTIATION OFFER SENT TO ${client}`);
      addPeerConnection(client, pc);
    }
  };
  const handleNegotiationNeededAnswer = async (data: any) => {
    try {
      console.log(`NEGOTIATION OFFER BY ${data.senderID} RECIEVED`);
      const pcList = getPeerConnections();
      const pc = pcList[data.senderID];

      if (!pc) return; // Return

      const remoteDescription = data.payloadOffer
        ? new RTCSessionDescription(data.payloadOffer)
        : null;
      if (!remoteDescription) return; // Return

      await pc.setRemoteDescription(remoteDescription);
      const answer = await pc.createAnswer();

      await pc.setLocalDescription(answer);

      socket.send(
        JSON.stringify({
          type: "answer",
          answer: answer,
          target: data.senderID,
          negotiation: true,
        })
      );

      console.log(`ANSWER SENT TO ${data.senderID}`, answer);
      console.log("PEER CONNECTION NEGO", pc);
      addPeerConnection(data.senderID, pc);
    } catch (error) {
      console.log("error", error);
    }
  };

  const sendAnswer = async (data: any) => {
    const pcListINI = getPeerConnections();

    console.log(` OFFER BY ${data.senderID} RECIEVED`);

    const pcStore: RTCPeerConnection = new RTCPeerConnection(configuration);
    trackEventSetup(pcStore, data.senderID);
    eventlistenerSetup(pcStore, data.senderID);

    addPeerConnection(data.senderID, pcStore);
    negotiationEventlistenerSetup(pcStore, data.senderID);
    const pcList = getPeerConnections();
    const pc = pcList[data.senderID];

    if (!pc) return; // Return

    const remoteDescription = data.payloadOffer
      ? new RTCSessionDescription(data.payloadOffer)
      : null;
    if (!remoteDescription) return; // Return

    await pc.setRemoteDescription(remoteDescription);
    const answer = await pc.createAnswer();

    await pc.setLocalDescription(answer);

    socket.send(
      JSON.stringify({
        type: "answer",
        answer: answer,
        target: data.senderID,
      })
    );

    console.log(`ANSWER SENT TO ${data.senderID}`, answer);

    console.log("PEER CONNECTION", pc);
    addPeerConnection(data.senderID, pc);

    socket.send(
      JSON.stringify({
        type: "clientList",

        target: "JAI SHRI RAM",
      })
    );

    //addTrackAddon(streamLocal);
  };

  const handleIceCandidate = (event: any, clientId: any) => {
    console.log("ICE CANDIDATE", event, clientId);
    const pcList = getPeerConnections();
    const pc = pcList[clientId];
    if (event.candidate && pc) {
      socket.send(
        JSON.stringify({
          type: "iceCandidate",
          candidate: event.candidate,
          target: clientId,
        })
      );

      console.log("ICE CANDIDATE DISPATCHED", {
        type: "iceCandidate",
        candidate: event.candidate,
        target: clientId,
      });
    }
  };

  const handleRecieveIceCandidate = async (data: any) => {
    const pcList = getPeerConnections();
    const pc = pcList[data.senderID];
    console.log("RECIEVED ICE CANDIDATE", data);
    if (pc) {
      try {
        const candidate = new RTCIceCandidate(data.candidate);
        await pc.addIceCandidate(candidate);
        console.log("ICE CANDIDATE RECIEVED AND ADDED", candidate);
      } catch (err) {
        console.log("error", err, data.senderID, pc);
      }
    }
  };

  const handleRecieveOffer = async (data: any) => {
    const pcList = getPeerConnections();
    const pc = pcList[data.senderID];
    console.log("NEEDED PC IF TRUE---------------2 TIMES RUN", pc);
    if (!pc) {
      await sendAnswer(data);
    }
  };

  const handleRecieveAnswer = async (data: any, client: string) => {
    try {
      if (data.answer) {
        const pcList = getPeerConnections();
        const pc = pcList[data.senderID];
        console.log(
          `PROCEEDED ANSWER FROM ${client} ${data.senderID}`,
          pcList[data.senderID]
        );

        if (pcList[data.senderID]) {
          console.log(
            `PROCEEDED FURTHER ANSWER FROM ${client} ${data.senderID}`
          );

          await pcList[data.senderID].setRemoteDescription(
            new RTCSessionDescription(data.answer)
          ); //data.answer is the answer recieved

          addPeerConnection(data.senderID, pcList[data.senderID]);

          console.log("remote description set", data.answer);
          console.log(
            "After setting remote description:",
            pcList[data.senderID].iceConnectionState,
            pcList[data.senderID].iceGatheringState
          );

          addPeerConnection(data.senderID, pcList[data.senderID]);
          console.log("pc", pcList[data.senderID]);
        }
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  const handleChat = (data: any) => {
    console.log("CHAT RECIEVED", data);

    var messageComp: JSX.Element = (
      <div style={{ textAlign: "left", width: "100%" }}>
        <h3 style={{ margin: 0 }}>{data.message}</h3>
        <h5 style={{ margin: 0 }}>{data.senderID}</h5>
        <br />
      </div>
    );

    setMessageList((prevList) => [...prevList, messageComp]);
  };
  const handleSendChat = (message: string) => {
    if (message === "") return;
    socket.send(
      JSON.stringify({
        type: "chat",
        message: message,
        senderName: "Arnav",
      })
    );

    var messageComp: JSX.Element = (
      <div style={{ textAlign: "right", width: "100%" }}>
        <h3 style={{ margin: 0 }}>{message}</h3>
        <br />
      </div>
    );

    setMessageList((prevList) => [...prevList, messageComp]);
    setMessage("");
  };
  const handleStartVideoButton = () => {
    const pcList = getPeerConnections();
    const clientList = getClients();
    const clientListSet = new Set(clientList);
    const clientListArray = Array.from(clientListSet);
    clientListArray.forEach(async (client) => {
      if (!pcList[client]) {
        await sendOffer(client);
      }
    });
  };

  const connectionInitiator = async (list: string[]) => {
    const pcList = getPeerConnections();

    socket.onmessage = async (event) => {
      const data = await JSON.parse(event.data);

      if (data.type === "offer") {
        console.log(`RECIEVED OFFER FROM ${data.senderID}`);
        if (data.negotiation) {
          await handleNegotiationNeededAnswer(data);
        } else {
          await handleRecieveOffer(data);
        }
      } else if (data.type === "answer") {
        console.log(`RECIEVED ANSWER FROM ${data.senderID}`);

        await handleRecieveAnswer(data, data.senderID);
      } else if (data.type === "candidate") {
        await handleRecieveIceCandidate(data);
      } else if (data.type === "clientList") {
        var listClients = getClients();
        data.list.forEach((client: string) => {
          if (listClients.includes(client) === false) {
            addClient(client);
          }
        });
        console.log("CLIENT LIST RECIEVED", data);
      } else if (data.type === "initialClientList") {
        var listClients = getClients();
        data.list.forEach((client: string) => {
          if (listClients.includes(client) === false) {
            addClient(client);
          }
        });
        var clientList = getClients();
        const clientListSet = new Set(clientList);
        clientList = Array.from(clientListSet);
        clientList.forEach(async (client) => {
          if (!pcList[client]) {
            await sendOffer(client);
          }
        });
        console.log("INI CLIENT LIST RECIEVED", data);
      } else if (data.type === "chat") {
        handleChat(data);
      } else {
        console.log("RECIEVED SOMETHING ELSE", data);
      }
    };
  };

  const addTrackAddon = async (stream: MediaStream) => {
    var clientList = getClients();
    const clientListSet = new Set(clientList);
    clientList = Array.from(clientListSet);

    console.log("client list", clientList);

    clientList.forEach((client) => {
      const pcList = getPeerConnections();
      const pc = pcList[client];
      if (stream) {
        if (pc) {
          try {
            negotiationEventlistenerSetup(pc, client);
            stream.getTracks().forEach((track) => pc.addTrack(track, stream));
            console.log(
              `TRACK ADDED BY FUNCTION FOR ${client}`,
              stream.getTracks()
            );
          } catch (err) {
            console.log("error", err);
          }
        }
      }

      addPeerConnection(client, pc);
    });
  };

  const handleTrackEvent = (event: any, clientID: string) => {
    console.log("track event", event.track);
    const track = event.track;

    var mediaStream = clientStreamMap.get(clientID) || new MediaStream();

    if (track.kind === "audio") {
      mediaStream = new MediaStream();
    }
    if (track.kind === "video") {
      mediaStream.addTrack(track);
      setRemoteVideoTracks((prevTracks) => [...prevTracks, track]);
    }
    if (track.kind === "audio") {
      mediaStream.addTrack(track);
      setRemoteAudioTracks((prevTracks) => [...prevTracks, track]);
    }

    clientStreamMap.set(clientID, mediaStream);

    loadTrack();
  };

  const loadTrack = () => {
    setRemoteStream([]);

    Array.from(clientStreamMap.values()).map((stream: MediaStream) =>
      setRemoteStream((prevStreams) => [...prevStreams, stream])
    );

    const number = Math.ceil(
      Math.sqrt(
        Array.from(clientStreamMap.values()).length > 0
          ? Array.from(clientStreamMap.values()).length
          : 1
      )
    );

    setWidth(100 / number);

    console.log(
      "SET WIDTH LENGTH",
      width,
      number,
      Array.from(clientStreamMap.values()).length
    );
  };

  const startLocalStream = async () => {
    try {
      const stream: MediaStream = await navigator.mediaDevices.getUserMedia({
        video: videoPremission,
        audio: audioPremission,
      });
      setLocalStreamState(stream);
      setStreamLocal(stream);

      //await addTrackAddon(streamLocal);

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = streamLocal;
      }
    } catch (error) {
      console.error("Error accessing local media:", error);
    }
  };
  const removeAllTracksFromStream = (stream: MediaStream) => {
    stream.getTracks().forEach((track) => {
      stream.removeTrack(track);
    });
  };
  const startScreenStream = async () => {
    try {
      const stream: MediaStream = await navigator.mediaDevices.getDisplayMedia({
        video: videoPremission,
        audio: audioPremission,
      });
      stream.getVideoTracks()[0].onended = async () => {
        console.log("TRIGGERED");
        console.log(streamLocal.getVideoTracks());
        await startLocalStream();
        removeAllTracksFromStream(stream);
        addTrackAddon(streamLocal);
      };
      setLocalStreamState(stream);
      addTrackAddon(stream);
      //await addTrackAddon(streamLocal);

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = streamLocal;
      }
    } catch (error) {
      console.error("Error accessing local media:", error);
    }
  };

  const manageStreamControls = (changeNeeded: string) => {
    const localStream = streamLocal;
    const audioTrack = localStream.getAudioTracks()[0]; // Assuming there is only one audio track
    const videoTrack = localStream.getVideoTracks()[0]; // Assuming there is only one video track

    if (audioTrack && !audioPremission && changeNeeded === "audio") {
      audioTrack.enabled = true;
      setAudioPremission(true);
    }
    if (videoTrack && !videoPremission && changeNeeded === "video") {
      videoTrack.enabled = true;
      setVideoPremission(true);
    }
    if (audioTrack && audioPremission && changeNeeded === "audio") {
      audioTrack.enabled = false;
      setAudioPremission(false);
    }

    if (videoTrack && videoPremission && changeNeeded === "video") {
      videoTrack.enabled = false;
      setVideoPremission(false);
    }
  };

  const eventlistenerSetup = (pc: RTCPeerConnection, clientID: string) => {
    pc.onicecandidate = (event) => handleIceCandidate(event, clientID);

    pc.oniceconnectionstatechange = () => {
      console.log("ICE Connection State:", pc.iceConnectionState);
      if (pc.iceConnectionState === "connected") {
      } else if (pc.iceConnectionState === "disconnected") {
        console.log("DISCONNECTED");

        removePeerConnection(clientID);

        clientStreamMap.delete(clientID);

        loadTrack();
      }
    };
  };

  const negotiationEventlistenerSetup = (
    pc: RTCPeerConnection,
    clientID: string
  ) => {
    pc.onnegotiationneeded = async () => {
      console.log("NEGOTIATION NEEDED");
      await handleNegotiationNeededOffer(clientID);
    };
  };
  const trackEventSetup = (pc: RTCPeerConnection, clientID: string) => {
    try {
      if (streamLocal) {
        streamLocal
          .getTracks()
          .forEach((track) => pc.addTrack(track, streamLocal));

        console.log(`TRACK ADDED FOR ${clientID}`, streamLocal.getTracks(), pc);
      }
    } catch (err) {
      console.log("error", err);
    }

    pc.ontrack = (event) => {
      handleTrackEvent(event, clientID);
    };
  };
  const handleFormSubmit = (event: any) => {
    event.preventDefault();
    handleSendChat(message);
  };

  const handleDisconnect = () => {
    const tracks = (
      localVideoRef.current?.srcObject as MediaStream
    )?.getTracks();
    tracks && tracks.forEach((track: MediaStreamTrack) => track.stop());

    var clientList = getClients();
    const clientListSet = new Set(clientList);
    clientList = Array.from(clientListSet);
    console.log("CLEANUP FIRED");
    if (socket.readyState === WebSocket.OPEN) {
      socket.close();
      console.log("CLOSED SOCKKKKKKKET");
    }
    clientList.forEach((client) => {
      const pcList = getPeerConnections();
      const pc = pcList[client];
      if (pc) {
        pc.close();
        console.log("CLEANUP FIRED", client);
        removePeerConnection(client);
      }
    });
    window.location.replace("/");
    
  }

  const waitSocketConnection = () => {
    return new Promise<void>((resolve, reject) => {
      const maxNumberOfAttempts = 10;
      const intervalTime = 300;
      setSocket();
      let currentAttempt = 0;
      const interval = setInterval(async () => {
        if (currentAttempt > maxNumberOfAttempts - 1) {
          clearInterval(interval);
          reject();
          if (userAction === "createRoom") {
            window.location.replace("/roomCreate");
          } else if (userAction === "joinRoom") {
            window.location.replace("/roomJoin");
          }
        } else if (socket.readyState === socket.OPEN) {
          clearInterval(interval);
          startingStep(userAction, socket); //imp--------##########
          var clientList = getClients();
          const clientListSet = new Set(clientList);
          clientList = Array.from(clientListSet);

          console.log("LIST OF CLIENTS", clientList);
          await startLocalStream();
          connectionInitiator(clientList);
          resolve();
        }
        currentAttempt++;
      }, intervalTime);
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      if (
        !socket ||
        socket.readyState === WebSocket.CLOSING ||
        socket.readyState === WebSocket.CLOSED
      ) {
        console.log("FIREDDDDDDDDD");
        await waitSocketConnection();
      }
    };

    fetchData();

    return () => {
      const tracks = (
        localVideoRef.current?.srcObject as MediaStream
      )?.getTracks();
      tracks && tracks.forEach((track: MediaStreamTrack) => track.stop());

      var clientList = getClients();
      const clientListSet = new Set(clientList);
      clientList = Array.from(clientListSet);
      console.log("CLEANUP FIRED");
      if (socket.readyState === WebSocket.OPEN) {
        socket.close();
        console.log("CLOSED SOCKKKKKKKET");
      }
      clientList.forEach((client) => {
        const pcList = getPeerConnections();
        const pc = pcList[client];
        if (pc) {
          pc.close();
          console.log("CLEANUP FIRED", client);
          removePeerConnection(client);
        }
      });
    };
  }, []);

  return (
    <>
      <Navbar userName={authenticationObject?.user?.name} authenticationCall={authenticationObject?.authenticated} />
      <div id="mainLayoutDivCallRoom">
        <div id="mainLayoutDivSub1CallRoom">
          <div
            className="mainLayoutDivSub1VideoBoxCallRoom"
            style={{ borderRadius: "15px" }}
          >
            {localaStreamState ? (
              <ReactPlayer
                className="mainLayoutDivSub1VideoBoxVideoCallRoom"
                url={localaStreamState}
                playing
                playsInline
                muted
              ></ReactPlayer>
            ) : (
              <div></div>
            )}
            <div className="mainLayoutDivSub1VideoBoxControlsCallRoom">
              {videoPremission ? (
                <Video
                  style={{ color: "white", scale: "2.5" }}
                  onClick={() => {
                    manageStreamControls("video");
                  }}
                />
              ) : (
                <VideoOff
                  style={{ color: "white", scale: "2.5" }}
                  onClick={() => {
                    manageStreamControls("video");
                  }}
                />
              )}
              {audioPremission ? (
                <Mic
                  className="mainLayoutDivSub1VideoBoxControlsMicCallRoom"
                  style={{ color: "white", scale: "2.5" }}
                  onClick={() => {
                    manageStreamControls("audio");
                  }}
                />
              ) : (
                <MicOff
                  className="mainLayoutDivSub1VideoBoxControlsMicCallRoom"
                  style={{ color: "white", scale: "2.5" }}
                  onClick={() => {
                    manageStreamControls("audio");
                  }}
                />
              )}

              {isMobileOrTablet ? null : (
                <ScreenShare
                  className="mainLayoutDivSub1VideoBoxControlsScreenShareCallRoom"
                  style={{ color: "white", scale: "2.5", margin: "15px" }}
                  onClick={() => startScreenStream()}
                />
              )}
              {isMobileOrTablet ? (
                <MessageSquareMore
                  className="mainLayoutDivSub1VideoBoxControlsMessageButtonMobileCallRoom"
                  style={{ color: "white", scale: "2.5", margin: "15px" }}
                  onClick={() => setChatBoxMobile(!chatBoxMobile)}
                />
              ) : null}
              <Unplug
                className="mainLayoutDivSub1VideoBoxControlsDisconnectCallRoom"
                style={{ color: "white", scale: "2.5" }}
                onClick={() => handleDisconnect()}
              />
            </div>
          </div>
          {isMobileOrTablet ? (
            <div></div>
          ) : (
            <div className="chatSystemCallRoom">
              <div className="chatDisplayBoxCallRoom">
                <div className="chatMessagesCallRoom">
                  {messageList.map((message) => message)}
                </div>
              </div>
              <form
                className="chatSubmitBoxFormCallRoom"
                onSubmit={(event) => handleFormSubmit(event)}
              >
                <input
                  type="text"
                  onChange={(event) => {
                    setMessage(event.target.value);
                  }}
                  value={message}
                />
                <button onClick={() => handleSendChat(message)}>
                  <Send />
                </button>
              </form>
            </div>
          )}
        </div>
        <div id="mainLayoutDivSub2CallRoom">
          {remoteStream.length === 0
            ? userAction == "joinRoom" && (
                <button
                  className="mainLayoutDivSub2JoinBtnCallRoom"
                  onClick={() => handleStartVideoButton()}
                  style={{}}
                >
                  Click To Join
                </button>
              )
            : null}
          {remoteStream.map((stream: MediaStream) => (
            <ReactPlayer
              style={{
                maxWidth: `${width - 3}%`,
                maxHeight: `${width - 6}%`,
                flexGrow: "1",
                flexShrink: "1",
                marginBottom: "1%",
              }}
              key={stream.id}
              playing
              url={stream}
            />
          ))}
        </div>
        {chatBoxMobile ? (
          <div
            className="chatSystemCallRoom"
            style={{
              position: "absolute",
              width: "70vw",
              height: "500px",
              opacity: 0.7,
              backgroundColor: "black",
              padding: "15px",
              borderRadius: "15px",
            }}
          >
            <X
              style={{
                color: "white",
                marginLeft: "85%",
                position: "absolute",
              }}
              onClick={() => setChatBoxMobile(!chatBoxMobile)}
            />
            <div className="chatDisplayBoxCallRoom">
              <div className="chatMessagesCallRoom">
                {messageList.map((message) => message)}
              </div>
            </div>
            <form
              className="chatSubmitBoxFormCallRoom"
              onSubmit={(event) => handleFormSubmit(event)}
            >
              <input
                type="text"
                onChange={(event) => {
                  setMessage(event.target.value);
                }}
                value={message}
              />
              <button onClick={() => handleSendChat(message)}>
                <Send />
              </button>
            </form>
          </div>
        ) : null}
      </div>
    </>
  );
};
export default page;

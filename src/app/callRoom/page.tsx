"use client";
import "@/app/page.css";
import "@/app/[roomAction]/page.css";
import Navbar from "@/components/navbar/navbar";
import { useRef, useEffect, useState } from "react";
import { socket, userAction } from "@/components/functions/function";
import ReactPlayer from "react-player";

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
} from "@/components/variableSet/variableSet";

import { RemoteMedia } from "@/components/video/remoteMedia";

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
  };

  const sendAnswer = async (data: any) => {
    const pcListINI = getPeerConnections();

    console.log(` OFFER BY ${data.senderID} RECIEVED`);

    const pcStore: RTCPeerConnection = new RTCPeerConnection(configuration);
    trackEventSetup(pcStore, data.senderID);
    eventlistenerSetup(pcStore, data.senderID);
    negotiationEventlistenerSetup(pcStore, data.senderID);
    addPeerConnection(data.senderID, pcStore);

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

    addTrackAddon(streamLocal);
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
    if (data.answer) {
      const pcList = getPeerConnections();
      const pc = pcList[data.senderID];
      console.log(
        `PROCEEDED ANSWER FROM ${client} ${data.senderID}`,
        pcList[data.senderID]
      );

      if (pcList[data.senderID]) {
        console.log(`PROCEEDED FURTHER ANSWER FROM ${client} ${data.senderID}`);

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
  };

  const handleChat = (data:any) => {
    console.log("CHAT RECIEVED", data);

    var messageComp : JSX.Element= <div style={{textAlign:"left" , width:"100%"}}>
      <h3 style={{margin:0}}>{data.message}</h3>
      <h5 style={{margin:0}}>{data.senderID}</h5>
      <br/>

    </div>

    setMessageList((prevList)=>[...prevList,messageComp])

  }
  const handleSendChat = (message:string) => {
    
    socket.send(
      JSON.stringify({
        type: "chat",
        message: message,
        senderName : "Arnav"
      })
    );
    
    var messageComp : JSX.Element= <div style={{textAlign:"right" , width:"100%"}}>
      <h3 style={{margin:0}}>{message}</h3>
      <br/>

    </div>

    setMessageList((prevList)=>[...prevList,messageComp])

  }
  const connectionInitiator = async (list: string[]) => {
    const pcList = getPeerConnections();

    list.forEach(async (client) => {
      if (!pcList[client]) {
        await sendOffer(client);
      }
    });

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
      }else if(data.type === "chat"){

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
        const existingSender = pc.getSenders().find((sender) => {
          return sender.track === stream.getTracks()[0];
        });

        if (!existingSender) {
          stream.getTracks().forEach((track) => pc.addTrack(track, stream));

          console.log(
            `TRACK ADDED BY FUNCTION FOR ${client}`,
            stream.getTracks()
          );
        }
      }

      addPeerConnection(client, pc);
    });
  };

  const handleTrackEvent = (event: any, clientID: string) => {
    console.log("track event", event.track);
    const track = event.track;
    
    var mediaStream = clientStreamMap.get(clientID) || new MediaStream();

    if(track.kind === "audio"){
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
      setLocalStreamState(stream)
      setStreamLocal(stream);

      //await addTrackAddon(streamLocal);

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = streamLocal;
      }
    } catch (error) {
      console.error("Error accessing local media:", error);
    }
  };

  const manageStreamControls = (changeNeeded:string) => {
    const localStream = streamLocal;
    const audioTrack = localStream.getAudioTracks()[0]; // Assuming there is only one audio track
    const videoTrack = localStream.getVideoTracks()[0]; // Assuming there is only one video track

    if (audioTrack && !audioPremission && changeNeeded === "audio") {
      audioTrack.enabled = true;
      setAudioPremission(true)
    }
    if (videoTrack && !videoPremission && changeNeeded === "video") {
      videoTrack.enabled = true;
      setVideoPremission(true)
    }
    if (audioTrack && audioPremission && changeNeeded === "audio") {
      audioTrack.enabled = false;
      setAudioPremission(false)
    }

    
    if (videoTrack && videoPremission && changeNeeded === "video") {
      videoTrack.enabled = false;
      setVideoPremission(false)
    }


  };

  const eventlistenerSetup = (pc: RTCPeerConnection, clientID: string) => {
    pc.onicecandidate = (event) => handleIceCandidate(event, clientID);

    pc.oniceconnectionstatechange = () => {
      console.log("ICE Connection State:", pc.iceConnectionState);
      if (pc.iceConnectionState === "connected") {
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

  useEffect(() => {
    var clientList = getClients();
    const clientListSet = new Set(clientList);
    clientList = Array.from(clientListSet);

    console.log("LIST OF CLIENTS", clientList);

    const start = async () => {
      await startLocalStream();
      connectionInitiator(clientList);
    };
    start();

    return () => {
      const tracks = (
        localVideoRef.current?.srcObject as MediaStream
      )?.getTracks();
      tracks && tracks.forEach((track: MediaStreamTrack) => track.stop());
    };
  }, []);

  return (
    <>
      <Navbar />
      <div
        id="mainLayoutDiv"
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          id="mainLayoutDivSub1"
          style={{
            width: "20%",
            margin: "1%",
            marginLeft: ".5%",
            height: "85vh",
            marginTop: "3.5%",
            backgroundColor: "hsla(0, 0%, 0%, 0.200)",
            opacity: 0.7,
            padding:"15px"
          }}
        >
          <div style={{  width: "100%", height: "40%" }}>
            {localaStreamState ? (
              <ReactPlayer
                url={localaStreamState}
                playing
                playsInline
                muted
                style={{
                  width: "95%",
                  height: "90%",
                 
                  
                  display:"inline"
                }}
              ></ReactPlayer>
            ) : (
              <div
                style={{
                  width: "95%",
                  margin: "2.5%",
                  height: "90%",
                  backgroundColor: "white",
                }}
              ></div>
            )}
            <button onClick={() => manageStreamControls("video")}>
              Video
            </button>
            <button onClick={() => manageStreamControls("audio")}>
              Audio
            </button>
            
          </div>
          <div style={{height:"60%" ,width:"100%"}}>
            <div style={{height:"75%",width:"100%",overflowY:"hidden" , color:"beige", marginTop:"10%"}}>
              {messageList.map((message)=>(
                message
              ))}
            </div>
            <div style={{height:"20%",width:"100%"}}>
              <input type="text" onChange={(event)=>{setMessage(event.target.value)}} />
              <button onClick={()=>handleSendChat(message)}>Send</button>
            </div>
          </div>
        </div>
        <div
          id="mainLayoutDivSub2"
          style={{
            textDecoration: "none",
            width: "77%",
            margin: "1%",
            marginRight: ".5%",
            height: "85vh",
            marginTop: "3.5%",
            backgroundColor: "hsla(0, 0%, 0%, 0.200)",
            opacity: 0.7,
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            paddingTop: "30px",
            paddingBottom: "20px",
          }}
        >
          {remoteStream.map((stream: MediaStream) => (
            <ReactPlayer
              style={{
                maxWidth: `${width - 3}%`,
                maxHeight: `${width - 3}%`,
                flexGrow: "1",
                flexShrink: "1",
                marginBottom: "1%",
                borderRadius: "25%",
              }}
              key={stream.id}
              playing
              url={stream}
            />
          ))}
        </div>
      </div>
    </>
  );
};
export default page;

"use client";
import "dotenv/config";
import { use } from "react";
import {
  setRoomNoVar,
  setFormData,
  formData,
  roomNoVar,
  addClient,
  getClients,
  setAuthenticatedObject,
  authenticationObject,
} from "../variableSet/variableSet";
import Cookies from "js-cookie";

export var socket: WebSocket;

export var socketReadyState: boolean = false;
export const removeSocket = () => {
  socket?.close();
};
export const setSocket = () => {
  

  socket = new WebSocket("wss://videochatsignallingserverrender.onrender.com/");
  socket.onopen = () => {
    console.log("WebSocket connection established.");
    socketReadyState = true;
  };

  socket.onmessage = (event) => {

    const data = JSON.parse(event.data);
    if (data.type === "clientList") {
      var listClients = getClients();
      data.list.forEach((client: string) => {
        if (listClients.includes(client) === false) {
          addClient(client);
        }
      });
    }
  };
  return socket;
};

export var userAction = "";

export const handleOnJoin = () => {
  
  // startingStep("joinRoom", socket);
  userAction = "joinRoom";
};

export const handleOnCreate = () => {

  // startingStep("createRoom", socket);
  userAction = "createRoom";
};

export const startingStep = async (type: string, socket: WebSocket) => {
  const sendString = JSON.stringify({
    type: type,
    roomId: "room" + roomNoVar,
    userId: formData.userName + "_" + formData.userEmail,
  });
  if (socket.readyState === WebSocket.OPEN) {
    socket.send(sendString);
  } else {
    if (type === "createRoom") {
      window.location.replace("/roomCreate");
    } else if (type === "joinRoom") {
      window.location.replace("/roomJoin");
    }
  }
};

export const authenticationCheck = async () => {
  try {
    
    const response = await fetch("/api/authenticate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({ jwtToken: Cookies.get("LoginToken") }),
    });
    const data = await response.json();
    console.log(data)
    setAuthenticatedObject(data.verificationBool, data.user.email , data.user.name, data.user._id,data.user.servers)
    return response;
  } catch (error) {
    console.error("Error during authentication:", error);
  }
};

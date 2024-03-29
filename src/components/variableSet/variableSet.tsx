"use client";

export var roomNoVar: any = 0;

export const setRoomNoVar = (value: any) => {
  roomNoVar = value;
};

export var authenticationObject: {
  authenticated: boolean,
  user: {
    email: string,
    name: string,
    id: string
    servers: string[]
  }
};

export const setAuthenticatedObject = (authenticated: boolean, email: string, name: string, id: string, servers:string[]) => {
  authenticationObject = {
    authenticated,
    user: {
      email,
      name,
      id,
      servers
    }
  };
};



export var tempaa: number = 0;

export const setTempaa = (value: number) => {
  tempaa = value;
};

export var streamLocal: MediaStream;

export const setStreamLocal = (value: MediaStream) => {
  streamLocal = value;
};

export const formData = {
  userName: "",
  userEmail: "",
  userRoomNumber: "1111",
};

export const setFormData = (data: any) => {
  formData.userName = data.userName;
  formData.userEmail = data.userEmail;
  formData.userRoomNumber = data.userRoomNumber;
  setRoomNoVar(data.userRoomNumber);
};

type PeerConnectionStorage = {
  [key: string]: RTCPeerConnection;
};

let peerConnections: PeerConnectionStorage = {};

export const addPeerConnection = (key: string, pc: RTCPeerConnection) => {
  peerConnections[key] = pc;
};

export const removePeerConnection = (key: string) => {
  delete peerConnections[key];
};

export const getPeerConnections = (): PeerConnectionStorage => {
  return { ...peerConnections }; // Return a copy to avoid direct manipulation
};

let clients: string[] = [];

export const addClient = (id: string) => {
  clients.push(id);
};

export const removeClient = (id: string) => {
  clients = clients.filter((client) => client !== id);
};

export const getClients = () => {
  return [...clients];
};

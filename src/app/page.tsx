"use client";
import Link from "next/link";
import Navbar from "@/components/navbar/navbar";
import "@/app/page.css";
import {
  authenticationCheck,
  handleOnJoin,
} from "@/components/functions/function";
import {
  setFormData,
  formData,
  authenticationObject,
} from "@/components/variableSet/variableSet";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Any } from "react-spring";

export default function Home() {
  const router = useRouter();
  const [authenticationObjectState, setAuthenticationObjectState] = useState(authenticationObject);
  const [roomList, setRoomList] = useState<string[]>([]);

  const handleOnClick = (room: any) => {
   
    var data = {
      userName: room,
      userRoomNumber: room,
    };
    setFormData(data);
    handleOnJoin();
  };

  const authenticateChecker = async () => {
    await new Promise<void>(async (resolve, reject) => {
      const response = await authenticationCheck();
      if (response?.ok) {

        setRoomList([])
        console.log("authenticationObject?.user?.servers",authenticationObject?.user?.servers)
        authenticationObject?.user?.servers.forEach((server: any) => {
          if (!roomList.includes(server.name)) {
            setRoomList((prevRoomList) => [...prevRoomList, server.name]);
          }
        });

        

        setAuthenticationObjectState(authenticationObject)
        resolve();
      } else {
        setRoomList([
          "Room1",
          "Room2",
          "Room3",
          "Room4",
          "Room5"
        ])
        reject();
      }
    });
  };

  useEffect(() => {
    console.log("runnnnnnnnnnNNNNNNNNNNNNNNNNNNNNNN")
    authenticateChecker();
  },[]);
  return (
    <main>
      <Navbar userName={authenticationObjectState?.user?.name} authenticationCall={authenticationObjectState?.authenticated} />
      <div id="mainLayoutDiv">
        <div id="mainLayoutDivSub1" style={{ overflowY: "scroll" }}>
          
          <div className="mainLayoutDivSub1Rooms">
            {roomList.map((room) => (
              <Link
                href={"/callRoom"}
                key={room}
                style={{ textDecoration: "none", color: "black" }}
              >
                <div
                  onClick={() => {
                    handleOnClick(room);
                  }}
                  className="roomBoxRoom"
                >
                  <h3>{room}</h3>
                </div>
              </Link>
            ))}
          </div>
          <div className="mainLayoutDivSub1Server">
            <div onClick={()=> router.push("/joinserver")} className="mainLayoutDivSub1ServerJoin">
              Join Server
            </div>
            <div onClick={()=> router.push("/createserver")} className="mainLayoutDivSub1ServerCreate">
              Create Server
            </div>
          </div>
        </div>
        <div id="mainLayoutDivSub2">
          <div className="mainLayoutDivSub2Tagline">
            {"Seamless Meetings, Elevated Experience."
              .split(" ")
              .map((word, index) => (
                <h1 className="mainLayoutDivSub2h1" key={index}>
                  {word}
                </h1>
              ))}
          </div>
          <div className="mainLayoutDivSub2Buttons">
            <Link
              href="/roomCreate"
              className="createRoom"
              style={{ textDecoration: "none", color: "black", scale: 0.75 }}
            >
              <p>Create Room</p>
            </Link>
            <Link
              href="/roomJoin"
              className="joinRoom"
              style={{ textDecoration: "none", color: "black", scale: 0.75 }}
            >
              <p>Join Room</p>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

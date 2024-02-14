"use client";
import Link from "next/link";
import Navbar from "@/components/navbar/navbar";
import "@/app/page.css";
import { handleOnJoin } from "@/components/functions/function";
import { setFormData, formData } from "@/components/variableSet/variableSet";
export default function Home() {
  var roomList: string[] = [
    "Room1",
    "Room2",
    "Room3",
    "Room4",
    "Room5",
    "Room6",
    "Room7",
    "Room8",
    "Room9",
    "Room10",
  ];

  const handleOnClick = (room: any) => {
    console.log("CLICKKKKET");
    var data = {
      userName: room,
      userRoomNumber: room,
    };
    setFormData(data);
    handleOnJoin();
  };

  return (
    <main>
      <Navbar />
      <div id="mainLayoutDiv">
        <div id="mainLayoutDivSub1" style={{ overflowY: "scroll" }}>
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
        <div id="mainLayoutDivSub2">
          <div  className="mainLayoutDivSub2Tagline">
            {"Seamless Meetings, Elevated Experience."
              .split(" ")
              .map((word, index) => (
                <h1 className="mainLayoutDivSub2h1" key={index}>{word}</h1>
              ))}
          </div>
          <div className="mainLayoutDivSub2Buttons" >
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

"use client";
import Link from "next/link";
import Navbar from "@/components/navbar/navbar";
import "@/app/page.css";
import { handleOnJoin } from "@/components/functions/function";
import {
  setFormData,
  formData,
  setAuthenticatedObject,
  authenticationObject,
} from "@/components/variableSet/variableSet";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Cookies from "js-cookie";
export default function Home() {
  const router = useRouter();

  var roomList: string[] = [];

  const handleOnClick = (room: any) => {
    console.log("CLICKKKKET");
    var data = {
      userName: room,
      userRoomNumber: room,
    };
    setFormData(data);
    handleOnJoin();
  };
  const url = "/api";

  const [formDataComp, setFormDataComp] = useState({
    name: "",
    password: "",
  });

  var signSearchHandle = (event: any) => {
    const { name, value } = event.target;
    setFormDataComp({ ...formDataComp, [name]: value });
  };

  var signSubmit = async (event: any) => {
    event.preventDefault();

    try {
      const response = await fetch("/api/action/serverAdd", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userName: authenticationObject?.user?.name,
          name: formDataComp.name,
          password: formDataComp.password,
        }),
      });

      if (response.ok) {
        const data = await response.json();

        console.log(authenticationObject);
        router.push("/");
      } else {
      }
    } catch (error) {
      router.push("/createServer");
    }
  };

  return (
    <main>
      <Navbar userName={authenticationObject?.user?.name} authenticationCall={authenticationObject?.authenticated} />
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
          <div className="mainLayoutDivSub2Tagline">
            {"Seamless Meetings, Elevated Experience."
              .split(" ")
              .map((word, index) => (
                <h1 className="mainLayoutDivSub2h1" key={index}>
                  {word}
                </h1>
              ))}
          </div>
          <div
            className="mainLayoutDivSub2Buttons"
            style={{ borderLeft: "2px solid var(--background)" }}
          >
            <form onSubmit={signSubmit} className="loginPageForm">
              <div className="loginPageHeading">
                <h1>Create Server</h1>
              </div>
              <input
                className="loginPageFormInput"
                type="text"
                placeholder="Name"
                name="name"
                value={formDataComp.name}
                onChange={signSearchHandle}
              />

              <input
                className="loginPageFormInput"
                type="password"
                name="password"
                placeholder="Password"
                value={formDataComp.password}
                onChange={signSearchHandle}
              />
              <button type="submit" className="loginPageFormButton">
                Create Server
              </button>
              <div className="changeModes">
                <p className="changeModesP">
                  Want to join a Server
                  <a onClick={() => router.replace("/joinserver")}>
                    Join Server
                  </a>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}

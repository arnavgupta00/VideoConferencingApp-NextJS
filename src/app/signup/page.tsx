"use client";
import Link from "next/link";
import Navbar from "@/components/navbar/navbar";
import "@/app/page.css";
import { handleOnJoin } from "@/components/functions/function";
import { setFormData, formData, setAuthenticatedObject, authenticationObject } from "@/components/variableSet/variableSet";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Cookies from "js-cookie";

export default function Home() {
  const router = useRouter();

  var roomList: string[] = [

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
  const url = "/api";

  const [formDataComp, setFormDataComp] = useState({
    userName: "",
    userEmail: "",
    userPassword: "",
    userConfirmPassword: "",

  });

  var signSearchHandle = (event: any) => {
    const { name, value } = event.target;
    setFormDataComp({ ...formDataComp, [name]: value });
  };

  var signSubmit = async (event: any) => {
    event.preventDefault();

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name:formDataComp.userName,
          email: formDataComp.userEmail,
          password: formDataComp.userPassword,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        Cookies.set('LoginToken', data.message, { expires: 7 });

        setAuthenticatedObject(true, data.user.email , data.user.name, data.user._id,data.user.servers)
        router.push("/")
      }else{

      }
    } catch (error) {
      router.push("/signup")
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
          <div className="mainLayoutDivSub2Buttons" style={{borderLeft:"2px solid var(--background)"}}>
            <form onSubmit={signSubmit} className="loginPageForm">
              <div className="loginPageHeading">
                <h1>Sign Up</h1>
              </div>
              <input
                className="loginPageFormInput"
                type="text"
                placeholder="Username"
                name="userName"
                value={formDataComp.userName}
                onChange={signSearchHandle}
              />
              <input
                className="loginPageFormInput"
                type="text"
                placeholder="Email"
                name="userEmail"
                value={formDataComp.userEmail}
                onChange={signSearchHandle}
              />
            <input
                className="loginPageFormInput"
                type="password"
                name="userPassword"
                placeholder="Password"
                value={formDataComp.userPassword}
                onChange={signSearchHandle}
            />
            <input
                className="loginPageFormInput"
                type="password"
                name="userConfirmPassword"
                placeholder="Confirm Password"
                value={formDataComp.userConfirmPassword}
                onChange={signSearchHandle}
            />
            <button
                type="submit"
                className="loginPageFormButton"
                disabled={formDataComp.userPassword !== formDataComp.userConfirmPassword}
            >
                Sign Up
            </button>
              <div className="changeModes">
                <p className="changeModesP"> 
                  Don't have an account?<a onClick={()=>router.replace("/login")}>Log in</a>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}

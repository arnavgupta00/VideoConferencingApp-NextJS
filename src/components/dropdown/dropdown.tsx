"use client";

import React, { useState, useEffect } from "react";

import "./dropdown.css";
import { authenticationObject } from "../variableSet/variableSet";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

export interface DropdownProps {
  userName: string;
  authenticationCall: boolean;
}

const Dropdown: React.FC<DropdownProps> = (props:{userName:string , authenticationCall:boolean}) => {

  const router = useRouter();

  

  if (props.authenticationCall === true) {
    return (
      <div className="container" style={{ zIndex: 15 }}>
        <button className="btn">
          <span> Hello , {props.userName}</span>
          <ul className="dropdown">
            <li>
              <a href="#">Profile Information</a>
            </li>
            <li>
              <a href="#">Help</a>
            </li>
            <li
              onClick={() => {
                Cookies.remove("LoginToken");
                window.open("/", "_self");
              }}
            >
              <a>Log Out</a>
            </li>
          </ul>
        </button>
      </div>
    );
  } else {
    return (
      <div className="container" style={{ zIndex: 15 }}>
        <button className="btn">
          <span>{"SignUp/In"}</span>
          <ul className="dropdown" style={{ marginLeft: "-50px" }}>
            <li >
              <a onClick={() => router.push("/login")}>Login</a>
            </li>
            <li >
              <a onClick={() => router.push("/signup")}>Sign Up</a>
            </li>
            <li>
              <a>Help</a>
            </li>
          </ul>
        </button>
      </div>
    );
  }
};

export default Dropdown;

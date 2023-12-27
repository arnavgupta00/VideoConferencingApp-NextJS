"use client";

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import "./dropdown.css";
import Cookies from 'js-cookie';

interface DropdownProps {
  userName: string;
}

const Dropdown: React.FC<DropdownProps> = (props) => {
  const [ authenticationCall, setauthenticationCall] = useState<boolean>(true);
  var result = props.userName;
  const cookieDelete = (i: string) => {
    Cookies.remove("token");
    setauthenticationCall(false);
    useNavigate()(i);
  };

  if (authenticationCall === true) {
    return (
      <div className="container">
        <button className="btn">
          <span> Hello , {result}</span>
          <ul className="dropdown">
            <li className="active"><a href="#">Profile Information</a></li>
            <li><a href="#">Help</a></li>
            <li onClick={() => { cookieDelete("/") }}><a >Log Out</a></li>
          </ul>
        </button>
      </div>
    );
  } else {
    return (
      <div className="container">
        <button className="btn">
          <span>{"SignUp"}</span>
          <ul className="dropdown" style={{marginLeft:"-50px"}}>
            <li className="active" onClick={() => useNavigate()("/login")}><a >Login</a></li>
            <li onClick={() => useNavigate()("/register")}><a >Sign Up</a></li>
            <li><a >Help</a></li>
          </ul>
        </button>
      </div>
    );
  }
};

export default Dropdown;

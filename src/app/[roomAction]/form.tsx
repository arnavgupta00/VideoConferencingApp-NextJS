"use client";
import React, { ChangeEvent, useEffect, useState } from "react";
import "@/app/[roomAction]/page.css";
import rn from "random-number";
import {
  setRoomNoVar,
  setFormData,
  formData,
  authenticationObject,
} from "../../components/variableSet/variableSet";
import {
  handleOnJoin,
  handleOnCreate,
  socket,
  setSocket,
  socketReadyState,
} from "@/components/functions/function";
import Link from "next/link";

interface FormProps {
  actionCreate: string;
}

const Form: React.FC<FormProps> = ({ actionCreate }) => {
  const signSearchHandle = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const options = {
    min: 0,
    max: 9999,
    integer: true,
  };

  const numberRoom = rn(options);

  const email = authenticationObject?.user?.email;
  const name = authenticationObject?.user?.name;
  setFormData({ ...formData, userRoomNumber: numberRoom });

  useEffect(() => {
    setFormData({ ...formData, userName: authenticationObject?.user?.name });
    setFormData({ ...formData, userEmail: authenticationObject?.user?.email });
  }, []);

  return (
    <div className="formBoxRoomAction">
      {actionCreate === "true" ? (
        <div className="formBoxRoomAction">
          <div className="loginPageHeadingRoomAction">
            <h1>Create Room</h1>
          </div>
          <input
            className="signinputRoomAction"
            type="text"
            name="userName"
            placeholder="Enter Full Name"
            value={name}
            onChange={signSearchHandle}
          />
          <input
            className="signinputRoomAction"
            type="text"
            name="userEmail"
            placeholder="Enter e-mail"
            value={email}
            onChange={signSearchHandle}
          />
          <input
            className="signinputRoomAction"
            type="text"
            name="userRoomNumber"
            placeholder="Enter Room Number"
            value={numberRoom}
            onChange={signSearchHandle}
          />

          <Link href={"/callRoom"}>
            <input
              className="signSubmitRoomAction"
              type="submit"
              value="Create Room"
              onClick={() => {
                handleOnCreate();
              }}
            />
          </Link>
        </div>
      ) : (
        <div className="formBoxRoomAction">
          <div className="loginPageHeadingRoomAction">
            <h1>Join Room </h1>
          </div>
          <input
            className="signinputRoomAction"
            type="text"
            name="userName"
            value={name}
            placeholder="Enter Full Name"
            onChange={signSearchHandle}
          />
          <input
            className="signinputRoomAction"
            type="text"
            name="userEmail"
            placeholder="Enter e-mail"
            value={email}
            onChange={signSearchHandle}
          />
          <input
            className="signinputRoomAction"
            type="text"
            name="userRoomNumber"
            placeholder="Enter Room Number"
            onChange={signSearchHandle}
          />

          <Link href={"/callRoom"}>
            <input
              className="signSubmitRoomAction"
              type="submit"
              value="Join Room"
              onClick={() => {
                handleOnJoin();
              }}
            />
          </Link>
        </div>
      )}
    </div>
  );
};

export default Form;

"use server";

import { setAuthenticatedObject } from "@/components/variableSet/variableSet";
import { cookies } from "next/headers";

export const signSubmit = async (
  event: any,
  formDataComp: { userName: string; userEmail: string; userPassword: string }
) => {
  console.log("here");
  event.preventDefault();

  try {
    const response = await fetch("/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: formDataComp.userName,
        email: formDataComp.userEmail,
        password: formDataComp.userPassword,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      cookies().set("loginToken", data.message, {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
      });
      setAuthenticatedObject(
        true,
        data.user.email,
        data.user.name,
        data.user._id,
        data.user.servers
      );
      console.log("success");
      return "success";
    } else {
      console.log("fail");
      return "fail";
    }
  } catch (error) {
    console.log("failure");
    return "failure";
  }
};

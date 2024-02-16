import "dotenv/config";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { NextRequest, NextResponse } from "next/server";
import { userCollection } from "@/components/api/schema/schema";
import connect from "@/components/api/mongoose/connect";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    // const jwtToken = body.jwtToken;
    const JWTkey = process.env.SECRET_KEY;

    await connect();

    const email = body.email;
    const password = body.password;

    const userFind = await userCollection.findOne({ email: email });
    if (userFind) {
      const result = await bcrypt.compare(password, userFind.password);

      if (result === true) {
        const userPayload = {
          _id: userFind._id,
          name: userFind.name,
          email: userFind.email,
        };
        const tokenJwtSigned = jwt.sign(userPayload, JWTkey ?? "");

        // return NextResponse.set('set-cookie', `loggedIn=${tokenJwtSigned}; HttpOnly`);

        const userFindOne = await userCollection.findOne({ email: email });


        return NextResponse.json({ message: tokenJwtSigned, user:userFindOne }, { status: 200 });
      } else {
        console.log("Incorrect Password");
        return NextResponse.json(
          { message: "Incorrect Password" },
          { status: 400 }
        );
      }
    } else {
      console.log("User Not Found");
      return NextResponse.json(
        { message: "User Not Found" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.log("Error processing request", error);
    return NextResponse.json(
        { message: "Error processing request" },
        { status: 400 }
      );
  }
}

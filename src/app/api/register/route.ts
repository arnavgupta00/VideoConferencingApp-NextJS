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
    const JWTkey = await process.env.SECRET_KEY;

    await connect();

    const saltRound = 10;
    const email = body.email;
    const password = body.password;
    const name = body.name;

    // Hash the password
    const hash = await bcrypt.hash(password, saltRound);

    const userToAdd = new userCollection({
      name: name,
      email: email,
      password: hash,
      servers: [],
    });

    // Check if user already exists
    const userCheck = await userCollection.findOne({ email: email });
    if (userCheck) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 400 }
      );
    }

    // Save the new user
    await userToAdd.save();

    const userPayload = {
      _id: userToAdd._id,
      name: userToAdd.name,
      email: userToAdd.email,
    };

    // Sign JWT token
    const tokenJwtSigned = jwt.sign(userPayload, JWTkey as jwt.Secret);
    const userFind = await userCollection.findOne({ email: email });
    return NextResponse.json({ message: tokenJwtSigned , user:userFind }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Error processing request" },
      { status: 400 }
    );
  }
}

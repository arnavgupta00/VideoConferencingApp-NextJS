import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import {
  serverCollection,
  userCollection,
} from "@/components/api/schema/schema";
import connect from "@/components/api/mongoose/connect";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    await connect();

    const existingServer = await serverCollection.findOne({ name: body.name });
    if (!existingServer) {
      return NextResponse.json(
        { message: "Server does not exist" },
        { status: 400 }
      );
    }

    const result = await bcrypt.compare(body.password, existingServer.password);

    if (!result) {
      return NextResponse.json(
        { message: "Incorrect password" },
        { status: 401 }
      );
    }
    const userCheck = await userCollection.findOne({ name: body.userName });
    if (!userCheck) {
      return NextResponse.json(
        { message: "User does not exist" },
        { status: 400 }
      );
    }
    const userHasAccessToServer = userCheck.servers.some(
      (server: any) => server.name === body.name
    );
    if (userHasAccessToServer) {
      return NextResponse.json(
        { message: "User already has access to this server" },
        { status: 400 }
      );
    }

    userCheck.servers.push({ name: body.name });

    console.log(userCheck.servers);

    await userCheck.save();

    existingServer.users.push({ name: body.userName, role: "user" });

    await existingServer.save();

    return NextResponse.json(existingServer, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Server error", errora: error },
      { status: 500 }
    );
  }
}

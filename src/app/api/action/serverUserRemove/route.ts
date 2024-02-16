import { NextRequest, NextResponse } from "next/server";
import { serverCollection, userCollection } from "@/components/api/schema/schema";
import connect from "@/components/api/mongoose/connect";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    await connect();

    const existingServer = await serverCollection.findOne({ name: body.name });
    if (!existingServer) {
      return NextResponse.json({ message: 'Server does not exist' }, { status: 400 });
    }
    if (existingServer.password !== body.password) {
      return NextResponse.json({ message: 'Incorrect password' }, { status: 401 });
    }
    const userCheck = await userCollection.findOne({ name: body.userName });
    if (!userCheck) {
      return NextResponse.json({ message: 'User does not exist' }, { status: 400 });
    }

    const updatedServer = await serverCollection.findOneAndUpdate(
      { name: body.name },
      { $pull: { users: { name: body.userName } } },
      { new: true }
    );

    return NextResponse.json(updatedServer, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: 'Server error', errora: error }, { status: 500 });
  }
}

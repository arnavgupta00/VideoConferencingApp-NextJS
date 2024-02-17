import "dotenv/config";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { NextRequest, NextResponse } from "next/server";
import { serverCollection, userCollection } from "@/components/api/schema/schema";
import connect from "@/components/api/mongoose/connect";
import { cookies } from "next/headers";


export async function POST(request: Request) {
    try {
        const body = await request.json();
        const saltRound = 10;

        await connect();

        const existingServer = await serverCollection.findOne({ name: body.name });
        if (existingServer) {
            return NextResponse.json({ message: 'Server with the same name already exists' }, { status: 400 });
        }

        const user = await userCollection.findOne({ name: body.userName });
        if (!user) {
            return NextResponse.json({ message: 'User does not exist' }, { status: 400 });
        }
        const hash = await bcrypt.hash(body.password, saltRound);
        const newServer = new serverCollection({
            name: body.name,
            password: hash,
            users: [user]
        });

        await newServer.save();

        user.servers.push({ name: body.name });


        await user.save();

        return NextResponse.json(newServer, { status: 201 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: 'Server error', errora: error }, { status: 500 });
    }
}

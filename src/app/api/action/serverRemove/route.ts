import "dotenv/config";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { NextRequest, NextResponse } from "next/server";
import { serverCollection } from "@/components/api/schema/schema";
import connect from "@/components/api/mongoose/connect";
import { cookies } from "next/headers";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        // const jwtToken = body.jwtToken;

        await connect();

        const serverToRemove = await serverCollection.findOneAndDelete({ name: body.name });

        if (!serverToRemove) {
            return NextResponse.json({ error: 'Server not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Server removed successfully' }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Server error' }, { status: 500});
    }
}
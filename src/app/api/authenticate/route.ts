import "dotenv/config";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { NextRequest, NextResponse } from "next/server";
import { userCollection } from "@/components/api/schema/schema";
import connect from "@/components/api/mongoose/connect";

export async function POST(request : Request) {
    const body = await request.json();
    const jwtToken = body.jwtToken;
    const JWTkey = process.env.SECRET_KEY;

    await connect();
    if (jwtToken) {
        try {
            if (JWTkey) {
                const verificationStatus = jwt.verify(jwtToken, JWTkey) as jwt.JwtPayload;
                if (verificationStatus) {
                    const userAuthTe = await userCollection.findOne({ _id: verificationStatus._id })
                    if (userAuthTe) {
                        console.log(verificationStatus);
                        return NextResponse.json({verificationBool : true ,  verificationStatus: verificationStatus, user: userAuthTe }, { status: 200 });
                    } else {
                        return NextResponse.json({ message: "User not found" }, { status: 404 });
                    }
                }
            } else {
                return NextResponse.json({ message: "Authentication failed" }, { status: 403 });
            }
        } catch (error) {
            return  NextResponse.json({ message: "Authentication failed" }, { status: 403 });
        }
    } else {
        return  NextResponse.json({ message: "Login or Register First" }, { status: 403});
    }
}

import "dotenv/config";
import { NextResponse, NextRequest } from "next/server";
import { authenticationObject } from "@/components/variableSet/variableSet";
import { Console } from "console";
import { authenticationCheck } from "@/components/functions/function";


export async function middleware(request: NextRequest) {
  // console.log(authenticationObject);
  // if (authenticationObject === undefined || authenticationObject === null) {
  //   const authenticateChecker = async () => {
  //     await new Promise<void>((resolve, reject) => {
  //       authenticationCheck()
  //         .then((response) => {
  //           if (response?.ok) {
  //             resolve();
  //           } else {
  //             reject();
  //           }
  //         })
  //         .catch((error) => {
            
  //           reject(error); 
  //         });
  //     });
  //   };

  //   await authenticateChecker();
  // }
  // if (!(authenticationObject?.authenticated ?? false)) {
  //   if (request.nextUrl.pathname.startsWith("/api/")) {
  //     return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  //   }
  //   return NextResponse.redirect(new URL("/login", request.url));
  // }

  return NextResponse.next();
}

export const config = {
  matcher: [],
};

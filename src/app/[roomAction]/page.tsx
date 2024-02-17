"use client";
import Form from "./form";

import "@/app/[roomAction]/page.css";
import Navbar from "@/components/navbar/navbar";
import { authenticationObject } from "@/components/variableSet/variableSet";

const page = ({ params }: { params: { roomAction: string } }) => {
  const action: string = params.roomAction;

  return (
    <>
      <Navbar userName={authenticationObject?.user?.name} authenticationCall={authenticationObject?.authenticated} />
      <div id="mainLayoutDivRoomAction">
        <div id="mainLayoutDivSub1RoomAction"></div>
        <div id="mainLayoutDivSub2RoomAction">
          {action === "roomCreate" && <Form actionCreate="true" />}
          {action === "roomJoin" && (
            <>
              <Form actionCreate="false" />
            </>
          )}
        </div>
      </div>
    </>
  );
};
export default page;

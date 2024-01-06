"use client";
import Form from "./form";
import "./page.css"
import "@/app/page.css"
import Navbar from "@/components/navbar/navbar";



const page = ({ params }: { params: { roomAction: string } }) => {
    const action: string = params.roomAction;

    return (
        <>
            <Navbar />
            <div id='mainLayoutDiv' style={{ display: 'flex', flexDirection: 'row' , justifyContent:"center", alignItems:"center"}}>
                <div id='mainLayoutDivSub1' style={{ width: '20%', margin: "1%", marginLeft: ".5%", height: "85vh", marginTop: "3.5%", backgroundColor: "black", opacity: 0.3 }}>

                </div>
                <div id='mainLayoutDivSub2' style={{ textDecoration: "none", width: '77%', margin: "1%", marginRight: ".5%", height: "85vh", marginTop: "3.5%", backgroundColor: "black", opacity: 0.3 }}>
                    {action === "roomCreate" && <Form actionCreate="true" />}
                    {action === "roomJoin" && <>
                        <Form actionCreate="false" />
                        <button onClick={() => console.log("hello")}>Join</button>
                    </>}
                </div>
            </div>

        </>
    )

}
export default page
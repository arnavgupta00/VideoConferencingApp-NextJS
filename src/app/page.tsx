"use client"
import Link from 'next/link';
import Navbar from "@/components/navbar/navbar";
import "./page.css"
export default function Home() {
  return (
    <main >

      <Navbar />
      <div id='mainLayoutDiv' style={{ display: 'flex', flexDirection: 'row' }}>
        <div id='mainLayoutDivSub1' style={{ width: '20%', margin: "1%", marginLeft: ".5%", height: "85vh", marginTop: "3.5%", backgroundColor: "black", opacity: 0.3 }}>

        </div>
        <div id='mainLayoutDivSub2' style={{ textDecoration: "none", width: '77%', margin: "1%", marginRight: ".5%", height: "85vh", marginTop: "3.5%", backgroundColor: "black", opacity: 0.3 }}>
          <Link href="/roomCreate" className='createRoom' style={{ textDecoration: "none", color: "black" }}>
            <p>Create Room</p>
          </Link>
          <Link href="/roomJoin" className='joinRoom' style={{ textDecoration: "none", color: "black" }}>
            <p>Join Room</p>
          </Link>

        </div>
      </div>
    </main>
  )
}


import RootLayout from '../layout';
import Link from 'next/link';
import { useState } from 'react';
import Form from './form';
const page = ({ params }: { params: { roomAction: string } }) => {
  const action: string = params.roomAction;
  
  return (
    <RootLayout children=
      {
        <div id='mainLayoutDiv' style={{ display: 'flex', flexDirection: 'row' }}>
          <div id='mainLayoutDivSub1' style={{ width: '20%', margin: "1%", marginLeft: ".5%", height: "85vh", marginTop: "3.5%", backgroundColor: "black", opacity: 0.3 }}>

          </div>
          <div id='mainLayoutDivSub2' style={{ textDecoration: "none", width: '77%', margin: "1%", marginRight: ".5%", height: "85vh", marginTop: "3.5%", backgroundColor: "black", opacity: 0.3 }}>
            {action === "roomCreate" &&  <Form actionCreate = "true" />}
            {action === "roomJoin" &&  <Form actionCreate = "false" />}
            
          </div>
        </div>

      } />

  )
}

export default page
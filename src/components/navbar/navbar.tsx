import Dropdown from "@/components/dropdown/dropdown";


export default function Navbar(props:{userName:string , authenticationCall:boolean}) {
    return (
        <nav style={{ height: '1px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
                {/* Logo */}
            </div>
            <div className='dropdown' style={{ marginTop: "90px" }}>
                <Dropdown userName={props.userName} authenticationCall={props.authenticationCall} />
            </div>
        </nav>
    )
}
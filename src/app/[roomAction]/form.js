
"use client";
import { useState } from 'react'
import rn from 'random-number'
import "./page.css"
const Form = (props) => {
    const [formData, setFormData] = useState({
        userName: '',
        userEmail: '',
        userRoomNumber: '',

    });
    var signSearchHandle = (event) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    }
    const actionCreate = props.actionCreate;
    var options = {
        min: 0
        , max: 9999
        , integer: true
    }
    const numberRoom = rn(options)
    return (
        <div>
            {actionCreate === "true" ? (
            <div style={{display:"flex" ,flexDirection:"column"}}>
                <input
                    className='signinput'
                    type='text'
                    name='userName'
                    placeholder='Enter Full Name'
                    value={formData.userName}
                    onChange={signSearchHandle}
                />
                <input
                    className='signinput'
                    type='text'
                    name='userEmail'
                    placeholder='Enter e-mail'
                    value={formData.userEmail}
                    onChange={signSearchHandle}
                />
                <input
                    className='signinput'
                    type='text'
                    name='userRoomNumber'
                    placeholder='Enter Room Number'
                    value={numberRoom}
                    onChange={signSearchHandle}
                />
                <input className='signSubmit' type="submit" value="Create Room "  />
            </div> ): (
                <div style={{display:"flex" ,flexDirection:"column"}}>
                    <input
                        className='signinput'
                        type='text'
                        name='userName'
                        placeholder='Enter Full Name'
                        value={formData.userName}
                        onChange={signSearchHandle}
                    />
                    <input
                        className='signinput'
                        type='text'
                        name='userEmail'
                        placeholder='Enter e-mail'
                        value={formData.userEmail}
                        onChange={signSearchHandle}
                    />
                    <input
                        className='signinput'
                        type='text'
                        name='userRoomNumber'
                        placeholder='Enter Room Number'
                        value={formData.userRoomNumber}
                        onChange={signSearchHandle}
                    />
                    <input className='signSubmit' type="submit" value="Join Room "  />
                </div>
            )}
        </div>
    );
}

export default Form
import React, {useState} from 'react'
import SubmitButton from "../SubmitButton/SubmitButton"
import TextLogo from "../TextLogo/TextLogo"
import InputBox from "../InputBox/InputBox"
import {
    Link,
   } from "react-router-dom";
 
 
import "./ChangePassPage.scss"


function ChangePassPage() {

    const [currentPass, setCurrentPass] = useState();
    const [newPass, setNewPass] = useState();
    const [confirmNewPass, setConfirmNewPass] = useState();
    const [passInputType, setPassInputType] = useState("password");
    const [msg, setMsg] = useState("");
    const [msgColor, setMsgColor] = useState("");

    const changePass = () =>{
        


        if (!(currentPass && newPass && confirmNewPass)){
            setMsg("ALl fields must be filled");
            setMsgColor("red");
        }

        if (!(newPass===confirmNewPass)){
            setMsg("Confirmed password doesn't match");
            setMsgColor("Red");
        }

        if(!(newPass.length>=4)){
            setMsg("Password must atleast be 8 characters long");
            setMsgColor("red");
            return;
        }

        if (!(newPass.match(/^[A-Za-z]\w{7,14}$/))){
            setMsg("Password can only contain a-z,A-z,0-10,and _, and must not start with a number or _");
            setMsgColor("red");
            return;
        }

        console.log({
            currentPass,
            newPass,
            confirmNewPass
        })

        
        fetch("/changepassword/", 
        {
            method:"POST",
            headers : {
                "Content-Type" : "application/json"
            },
            body : JSON.stringify(
                {
                    password : currentPass,
                    newPassword : newPass,
                    confirmPassword : confirmNewPass
                }
            )
        }) .then(res=>res.json())
        .then(data=>{
            if(data.type=="error"){
                setMsg(data.error);
                setMsgColor("red");
                return;
            }
            else{
                
                setMsg("password changed Succesfully");
                setMsgColor("green");
                window.location.pathname="/"
                return;
            }
        })
        
    }

    return (
        <div className="ChangePassPage">
            <div className="change-pass-Box">
            <Link to="/" style={{textDecoration : "none"}}>
                <TextLogo className = "title"/>
            </Link>
                <InputBox 
                    label="Current Password"
                    var={currentPass}
                    setVar={setCurrentPass}
                    type={passInputType}
                />
                <InputBox 
                    label= "New Password"
                    var={newPass}
                    setVar={setNewPass}
                    type={passInputType}
                />
                <InputBox 
                    label="Confirm new passoword"
                    var={confirmNewPass}
                    setVar={setConfirmNewPass}
                    type={passInputType}
                />
               {
                    msg && (
                        <span style= {
                            {color : msgColor , 
                            "textAlign" : "center",
                            "wordWrap": "break-word",
                            "maxWidth" : "22rem"
                        }}>
                            {msg}
                        </span>
                    )
                }
                <div className="showPass-wrapper">
                    <input type="checkbox" 
                    name="showPasss" 
                    id="showPass-check"
                    onChange= {e=>{
                        if(e.target.checked) 
                            setPassInputType("text");
                        else
                            setPassInputType("password")
                    }}
                    />
                    <label htmlFor="showPass" id="showPass-label">Show Password</label>
                </div>
               

                <SubmitButton
                    text="Change Password"
                    className="change-pass-btn"
                    onclick={changePass}
                    
                />


            </div>
        </div>
    )
}

export default ChangePassPage

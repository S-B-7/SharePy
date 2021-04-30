import React , {useState, useContext} from 'react'
import InputBox from "../InputBox/InputBox"
import TextLogo from "../TextLogo/TextLogo"
import SubmitButton from "../SubmitButton/SubmitButton"

import {
    Link,
   } from "react-router-dom";
import "./SignUpPage.scss"

function SignUpPage() {

   

    const [username, setUsername] = useState("");
    const [pass, setPass] = useState("");
    const [gender, setGender] = useState("M")
    const [confirmPass, setConfirmPass] = useState("");
    const [passInputType, setPassInputType] = useState("password");
    const [msg, setMsg] = useState("")
    const [msgColor, setMsgColor] = useState("")

    document.title = "SharePy - Sign Up"
    
    const signUp = () => {
        if (!username.trim()){
            setMsg("Username can't be empty");
            setMsgColor("red");
            return;
        }

        if (!pass.trim()){
            setMsg("Password can't be empty");
            setMsgColor("red")
            return ;
        }

        if (!confirmPass.trim()){
            setMsg("Please confrim the password");
            setMsgColor("red")
            return ;
        }

        if (!(pass.trim()===confirmPass.trim())){
            setMsg("Passwords don't match")
            setMsgColor("red");
            return;
        }

        if(username.length<=3){
            setMsg("Username must be at least 3 characters long");
            setMsgColor("red");
            return;
        }

        if(!(pass.length>=8)){
            setMsg("Password must atleast be 8 characters long");
            setMsgColor("red");
            return;
        }

        if (!(pass.match(/^[A-Za-z]\w{7,14}$/))){
            setMsg("Password can only contain a-z,A-z,0-10,and _, and must not start with a number or _");
            setMsgColor("red");
            return;
        }

       fetch(
            '/signup/',
            {
                method : "POST",
                headers: {
                    "Content-Type" : "application/json"
                },
                body: JSON.stringify(
                    {
                        "username" : username,
                        "password" : pass,
                        "confirmPass" : confirmPass,
                        "gender" : gender
                    }
                )
            }
        ).then(res=>res.json())
        .then(data=>{
            console.log(data);
           if (data.type==="error"){
               setMsg(data.error);
               setMsgColor("red");
           }
           else if (data.type==="success") {
                setMsg("Logged In Successfully");
                setMsgColor("green");
                localStorage.setItem(
                    "username", 
                    username
                )
                location.pathname="/";
                
           }
        })

       

        
    }

    return (
        <div className="SignUpPage">
            <div className="signup-box">
                <TextLogo className="title"/>
                <InputBox 
                    label="Enter Username"
                    variable={username}
                    setVar={setUsername}
                    type="text"
                    className="input"
                />

                <InputBox
                    label="Enter Password"
                    variable={pass}
                    setVar={setPass}
                    type={passInputType}
                    className="input"
                />

                <InputBox
                    label="Confirm Password"
                    variable={confirmPass}
                    setVar={setConfirmPass}
                    type={passInputType}
                    className="input"
                />

                {
                    msg && (
                        <span style= {
                            {color : msgColor , 
                            "textAlign" : "center",
                            "wordWrap": "break-word",
                            "maxWidth" : "22rem",
                            "paddingBottom" : "0.5rem"
                        }}>
                            {msg}
                        </span>
                    )
                }

                <div className="combo-wrapper">
                    <label class = "enterLb" >Select Gender : </label>

                    <select class = "combo" name = "gender" value={gender} onChange={e=>{
                        setGender(e.target.value);
                        let value = e.target.value;
                        setGender(value);
                        console.log({value , gender})
                    }} >
                        <option value="M">Male </option>
                        <option value = "F">Female</option>
                    </select>
                </div>

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
                
                

                <SubmitButton text="Sign Up" onclick={signUp}/>
                
                <Link to="/login/"  className = "link">
                    Log In instead
                </Link>

                

                
            </div>

        </div>
    )
}

export default SignUpPage

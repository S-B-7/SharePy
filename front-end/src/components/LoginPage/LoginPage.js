import React , {useState, useContext, useEffect} from 'react';
import InputBox from "../InputBox/InputBox"
import SubmitButton from "../SubmitButton/SubmitButton"
import TextLogo from "../TextLogo/TextLogo"


import "./LoginPage.scss"

import {
   Link,
  } from "react-router-dom";


function LoginPage() {

   
    const [username, setUsername] = useState("");
    const [pass, setPass] = useState("");
    const [passInputType, setPassInputType] = useState("password");
    const [msg, setMsg] = useState("")
    const [msgColor, setMsgColor] = useState("")
    document.title ="SharePy - Log In"


    const login = () => {
       
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

       
        fetch("/login/", {
           method : "POST", 
           headers : {
               "Content-Type" : "application/json"
           },
           body : JSON.stringify(
               {
                   "username" : username.trim(),
                   "password" : pass.trim()
               }
           )
       }).then(res=>res.json())
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
                location.pathname="/"
           }
       })

       
       
      
    }
    
    return (
       
        <div className="LoginPage">
            <div className="login-box">
                
                <TextLogo className = "title"/>

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
                <SubmitButton text="Log In" onclick= {login} />
                
               


                <Link to="/signup/"  className = "link">
                    Sign Up instead
                </Link>
                
                
            </div>
        </div>
        
        
    )
}

export default LoginPage

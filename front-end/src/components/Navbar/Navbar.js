import React, {useState, useContext} from 'react';
import TextLogo from "../TextLogo/TextLogo";
import "./Navbar.scss";
import {Link} from "react-router-dom";
import SubmitButton from "../SubmitButton/SubmitButton"

function Navbar({theme,setTheme}) {


    const [showDropDown, setShowDropDown] = useState(false);
    const [showThemeDiv, setShowThemeDiv] = useState(false);
    const user = localStorage.getItem("username");
    const logout= e=>{
        localStorage.setItem("username", null);
        location.pathname="/logout"
    }

   
    return (
        <div className="wrapper">
            <div className="Navbar">
                <Link to="/" className="logo-link  logo">
                <TextLogo className=""/>
                </Link>

                <div className="command-texts">
                    <Link to="/addpost/" style={{
                        color : "var(--primary-fg)",
                        textDecoration : "none"
                    }}>
                        AddPost
                    </Link>

                    <button className="userBtn" onClick = {e=>setShowDropDown(!showDropDown)}   >
                        <div className ="usernameTxt"> 
                            {user}
                        </div>

                        <svg id="userIcon" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="user-circle" className="svg-inline--fa fa-user-circle fa-w-16" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 496 512">
                            <path fill="currentColor" d="M248 8C111 8 0 119 0 256s111 248 248 248 248-111 248-248S385 8 248 8zm0 96c48.6 0 88 39.4 88 88s-39.4 88-88 88-88-39.4-88-88 39.4-88 88-88zm0 344c-58.7 0-111.3-26.6-146.5-68.2 18.8-35.4 55.6-59.8 98.5-59.8 2.4 0 4.8.4 7.1 1.1 13 4.2 26.6 6.9 40.9 6.9 14.3 0 28-2.7 40.9-6.9 2.3-.7 4.7-1.1 7.1-1.1 42.9 0 79.7 24.4 98.5 59.8C359.3 421.4 306.7 448 248 448z">
                            </path>
                        </svg>
                        

                    </button>

                </div>
                
                <div className="command-btns">
                    <Link to="/addpost/" style={{
                            color : "var(--primary-fg)",
                            textDecoration : "none",
                            transform : "scale(1.6)"
                        }}>
                            +
                    </Link>

                    <button className="userBtn" onClick = {e=>setShowDropDown(!showDropDown)}>
                            <svg id="userIcon" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="user-circle" className="svg-inline--fa fa-user-circle fa-w-16" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 496 512">
                                <path fill="currentColor" d="M248 8C111 8 0 119 0 256s111 248 248 248 248-111 248-248S385 8 248 8zm0 96c48.6 0 88 39.4 88 88s-39.4 88-88 88-88-39.4-88-88 39.4-88 88-88zm0 344c-58.7 0-111.3-26.6-146.5-68.2 18.8-35.4 55.6-59.8 98.5-59.8 2.4 0 4.8.4 7.1 1.1 13 4.2 26.6 6.9 40.9 6.9 14.3 0 28-2.7 40.9-6.9 2.3-.7 4.7-1.1 7.1-1.1 42.9 0 79.7 24.4 98.5 59.8C359.3 421.4 306.7 448 248 448z">
                                </path>
                            </svg>
                    </button>

                </div>

               
                {
                    showDropDown && 

                      (<div className="dropdown-menu">
                    
                    <Link to={`/user/${user}`} ><SubmitButton text="View Profile"  /></Link>
                   <SubmitButton text="Logout" onclick={logout} />
                    <a href="/changepassword/"><SubmitButton text="Change Password" /></a>
                  
                    <button className="theme-div-activator-wrapper" onClick={e=>setShowThemeDiv(!showThemeDiv)}>
                        
                        <span>Theme</span> 
                    

                        <svg 
                        version="1.1" id="Capa_1"   className="arrow-icon"  x="0px" y="0px"
	                    width="451.847px" height="451.847px" viewBox="0 0 451.847 451.847" style={{enableBackground:"new 0 0 451.847 451.847;"}}>
                            <g>
                                <path d="M225.923,354.706c-8.098,0-16.195-3.092-22.369-9.263L9.27,151.157c-12.359-12.359-12.359-32.397,0-44.751
                                    c12.354-12.354,32.388-12.354,44.748,0l171.905,171.915l171.906-171.909c12.359-12.354,32.391-12.354,44.744,0
                                    c12.365,12.354,12.365,32.392,0,44.751L248.292,345.449C242.115,351.621,234.018,354.706,225.923,354.706z"/>
                            </g>
                            <g>
                            </g>
                            <g>
                            </g>
                            <g>
                            </g>
                            <g>
                            </g>
                            <g>
                            </g>
                            <g>
                            </g>
                            <g>
                            </g>
                            <g>
                            </g>
                            <g>
                            </g>
                            <g>
                            </g>
                            <g>
                            </g>
                            <g>
                            </g>
                            <g>
                            </g>
                            <g>
                            </g>
                            <g>
                            </g>
                        </svg>

                       

                    </button>
                    
                    
                    {(
                        showThemeDiv && (
                            <div className="theme-div">
                                <button className={ `theme-btn ${localStorage.getItem("theme")=="dark"?"theme-btn-selected" : ""}` } onClick={e=>{
                                    setTheme("dark");
                                    localStorage.setItem("theme", "dark");
                                }}>Dark Mode</button>
                                <button className={ `theme-btn ${localStorage.getItem("theme")=="light"?"theme-btn-selected" : ""}` } onClick={e=>{
                                    setTheme("light");
                                    localStorage.setItem("theme", "light")
                                }}>Light Mode</button>
                                <button className= "theme-btn" onClick={e=>{
                                    localStorage.setItem("theme", "sys");
                                    let sysTheme="dark";
                                    if  (window.matchMedia) 
                                      sysTheme= window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches?"light" : "dark"
                                    if(!(sysTheme=="light" || sysTheme=="dark"))
                                        sysTheme="dark"
                                    setTheme(sysTheme);
                                }}>Sysetm Default</button>

                            </div>
                        )
                    )}
                        
                    </div>
                    
                    )

                }
             
            </div>
        </div>
    )
}
export default Navbar

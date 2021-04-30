import logo from './logo.svg';
import React , {useState , useContext}from "react"
import './App.scss';
import {
  BrowserRouter as Router,
  Route,
} from "react-router-dom";
import LoginPage from "./components/LoginPage/LoginPage"
import SignUpPage from "./components/SignUpPage/SignUpPage"
import HomePage from "./components/HomePage/HomePage"
import AddPostPage from "./components/AddPostPage/AddPostPage"
import ChangePassPage from "./components/ChangePassPage/ChangePassPage"
import UserPage from "./components/UserPage/UserPage"
import Navbar from "./components/Navbar/Navbar"




function App() {
  let t,l,sysTheme
  
  t=localStorage.getItem("theme")

  sysTheme="dark"
  if  (window.matchMedia) 
    sysTheme = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches?"light" : "dark"
  

  if (localStorage.getItem("theme" ) =="sys")
    t=sysTheme;
    
  if (!(sysTheme=="light" || sysTheme=="dark"))
    sysTheme="dark";
  if (!(t=="light" || t=="dark"))
    t=sysTheme;
    

  
  
  

  const [theme, setTheme] = useState( t);
  const [currentUserName , setCurrentUserName] = useState("sa");
  const [user, setUser] = useState(localStorage.getItem("theme"));

  if  (window.matchMedia) 
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
      l = localStorage.getItem("theme")
      if (l==null || l=="null" || l==undefined || (l=="sys"))
        setTheme( ( e.matches ? "dark" : "light"));

    });

 

  return (
    
    <Router>
      
      <div className={theme} id="main">
      


        {!(location.pathname == "/login" 
        || location.pathname== "/login/" 
        ||location.pathname== "/signup/" 
        || location.pathname== "/signup" 
        || location.pathname== "/changepassword/" 
        ||location.pathname== "/changepassword"
        ||location.pathname=="/logout/"
        ||location.pathname=="/logout") && <Navbar theme={theme} setTheme={setTheme}/>}
      
        <Route exact path="/" component={HomePage} />
        <Route exact path="/login/" render={()=><LoginPage currentUserName={currentUserName}  setCurrentUserName={setCurrentUserName}/>} />
        <Route exact path="/signup/" component={SignUpPage}  />
        <Route exact path="/addpost/" component={AddPostPage} />
        <Route exact path="/changepassword/" component={ChangePassPage} />
        <Route exact path= "/user/:username" component={UserPage} />
    </div>
  

    </Router>

    
  );
}

export default App;

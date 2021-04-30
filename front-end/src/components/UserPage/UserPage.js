import React , {useState, useEffect} from 'react'
import {useParams } from 'react-router-dom'
import SubmitButton from "../SubmitButton/SubmitButton"
import UserList from "../UserList/UserlList"
import "./UserPage.scss"

function UserPage() {
    
    let {username} = useParams();
    const [currentUser, setCurrentUser] = useState(username)
    const [userData, setUserData] = useState({followers : [], followers : [] , });
    const [showList, setShowList] = useState (null);

    useEffect(
        ()=>{
            
            setShowList(null);

            fetch(
                `/getuserinfo/${username}/`,
                {
                    method : "POST",
                }
            ).then(res=>res.json())
            .then(data=>{
                setUserData(data.data);
                console.log(data.data)
               
            })
        },
        [username]
        )


    const follow = ()=> {
        fetch(
            '/follow/',
            {
                method : "POST",
                headers : {
                    "Content-Type" : "application/json"
                },
                body : JSON.stringify(
                    {
                        "username" : username
                    }
                )
            }
        ).then(res=>res.json())
        .then(data=>{
            console.log(data);
            if (data.type=="success"){
                setUserData(
                    {
                        ...userData,
                        isFollowed : true,
                        followers : [...userData.followers , localStorage.getItem("username")],
                        followerCount : userData.followerCount+1
                       
                    }
                )
            }
        })
    }

    const unFollow = () => {
        fetch(
            '/unfollow/',
            {
                method : "POST",
                headers : {
                    "Content-Type" : "application/json"
                },
                body : JSON.stringify(
                    {
                        "username" : username
                    }
                )
            }
        ).then(res=>res.json())
        .then(data=>{
            console.log(data);
            if (data.type=="success"){
                setUserData(
                    {
                        ...userData,
                        isFollowed : false,
                        followers : userData.followers.filter(user=>user!=localStorage.getItem("username")),
                        followerCount : userData.followerCount-1
                    }
                )
            }
        })
    }

    const followBtnClick= () => {
        if (userData.isFollowed)
            unFollow();
        else
            follow();
            
    }

    return (
        <div className="UserPage">
            <div className="userInfoBox">
               <h1 className="usernameTitle">{userData.name}</h1>
                <div id="wrapper-1">
                    <div className="field" id="joinedOnfield">
                        <div className="field-name">Joined On : </div>
                        <div className="field-data">{userData.dateJoined}</div>
                    </div>
                    <SubmitButton 
                        text={ userData.isFollowed  ?"Unfollow": "Follow"}
                        className="follow-btn"
                        onclick = {followBtnClick}
                    />
                </div>

                <div id="wrapper-2">
                    <button className="field field-box">
                        <div className="field-name">Gender</div>
                        <div className="field-data">{userData.gender=="M"?"Male":"Female"}</div>
                    </button>
                    <button className="field field-box" onClick = {()=>{
                            if(showList=="followers")
                                setShowList(null)
                            else
                                setShowList("followers")
                            }
                        }>
                        <div className="field-name">Followers</div>
                        <div className="field-data">{userData.followerCount}</div>
                    </button>
                    <button className="field field-box" onClick={()=>{
                            if(showList=="following")
                                setShowList(null)
                            else
                                setShowList("following")
                            }
                        } >
                        <div className="field-name">Following</div>
                        <div className="field-data">{userData.followingCount}</div>
                    </button>
                </div>
           </div>

            { (showList==="followers") && <UserList title="Followers" userList={userData.followers} currentUser={currentUser} setCurrentUser={setCurrentUser}/> }
            
            { (showList==="following") &&<UserList title="Following" userList={userData.following}  currentUser={currentUser} setCurrentUser={setCurrentUser} /> }
   
        </div>
    ) 
}

export default UserPage



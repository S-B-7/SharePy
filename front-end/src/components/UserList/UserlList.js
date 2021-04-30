import React from 'react'
import {Link} from "react-router-dom"
import "./UserList.scss"

function UserlList({title, userList, currentUser, setCurrentUser}) {
    return (
        <div className="user-list-box">
            <h1 className="title">{title}</h1>
            <div className="list">
                {userList.map(user=>(
                    <Link style={{textDecoration : "none"}} to={`/user/${user}`} onClick= {(e)=>setCurrentUser(user)} >
                        <div className="user-box">{user}</div>
                    </Link>
                ))}
            </div>
        </div>
    )
}

export default UserlList

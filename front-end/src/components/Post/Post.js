import React from 'react'
import {Link} from "react-router-dom"
import "./Post.scss"

function Post({post}) {
    return (
        <div className="post-wrapper">
                <p className="post-title">{post.title}</p>
                <span className="posted-by-text">
                    Posted By <Link to={`/user/${post.poster}`} className="poster" >{post.poster}</Link>
                </span>
                <span className="post-content-box">
                    {post.content}
                </span>
                <span className="post-date">
                    {post.createdOn}
                </span>
        </div>
    )
}

export default Post

import React , {useState} from 'react'
import "./AddPostPage.scss"
import InputBox from "../InputBox/InputBox"
import SubmitButton from "../SubmitButton/SubmitButton"


function AddPostPage() {

    const [postTitle, setPostTitle] = useState("");
    const [postContent, setPostContent] = useState("");

    const [msg, setMsg] = useState("")
    const [msgColor, setMsgColor] = useState("")

    document.title = "SharePy - Add Post"

    const addPost = () =>{
        console.log({postTitle, postContent});

        if (!postTitle){
            setMsg("Post title can not be empty");
            setMsgColor("red");
            return;
        }

        if(!postContent){
            setMsg("Post Content can not be empty");
            setMsgColor("red");
            return;
        }

        fetch(
            "/addpost/",
            {
                method : "POST", 
                headers : {
                    "Content-Type" : "application/json"
                },
                body:JSON.stringify(
                    {
                        title : postTitle,
                        content : postContent
                    }
                )
            }
        ).then(res=>res.json())
        .then(data=>{
            if (data.type=="success"){
                location.pathname="/"     
                return       
            }
            else{
                setMsg(
                    "could not add post try again"
                )
                setMsgColor("red");
                return;
            }
        })

    }

    return (
        <div className="AddPostPage">
            <div className="add-page-wrapper">
                <h1>
                    Add Post
                </h1>

                <InputBox 
                        className="add-post-title"
                        label="Post Title"
                        var={postTitle}
                        setVar={setPostTitle}
                        style={
                            {
                                margin: "0 1rem 0"
                            }
                        }

                />
                
                <textarea 
                    className="add-post-content"
                    type = "text" 
                    placeholder="Post Content"
                    value={postContent}
                    onChange={e=>setPostContent(e.target.value)}
                    />

                {
                    msg && (
                        <span style= {
                            {color : msgColor , 
                            "textAlign" : "center",
                            "wordWrap": "break-word",
                            "maxWidth" : "100%",
                        }}>
                            {msg}
                        </span>
                    )
                }
                
                <SubmitButton 
                    text="Add Post"
                    className= "add-post-btn"
                    onclick={addPost}
                />

               

            </div>
        </div>
    )
}

export default AddPostPage

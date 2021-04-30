import React , {useState , useEffect} from 'react'
import "./HomePage.scss"
import SubmitButton from "../SubmitButton/SubmitButton"
import Post from "../Post/Post"

function HomePage() {
    const [posts, setPosts] = useState([]);
    const [offest, setOffest] = useState(0);
    const [showLoadMoreBtn, setShowLoadMoreBtn] = useState(true);

    const loadPosts = () => {
        console.log("SA");
        fetch("/getposts/",
            {
                method : "POST",
                headers : {
                    "Content-Type" : "application/json"
                },
                body : JSON.stringify(
                    {
                        "offset" : offest,
                        "limit" : 3, 
                    }                    
                )
            }
        )
        .then(res=>res.json())
        .then(data=>{

            if (data.type === "success"){
                setPosts([...posts , ...data.posts ] );
                setOffest(offest + 3);
            }
            else{
                if (!data.posts){
                    setShowLoadMoreBtn(false);
                }
            }
        })
    }

    useEffect(loadPosts,[]);

    document.title = "SharePy - Home"

    return (
        <div className="HomePage">
           <div className="post-area">
                    
                {
                    posts.map(
                        post=><Post post={post} />
                    )
                }

                {
                    showLoadMoreBtn && (
                        <SubmitButton 
                        className="load-more-button"
                        text="Load More Posts"
                        onclick={loadPosts}
                />
                    )
                }
                
                
           </div>
        </div>
    )
}

export default HomePage

from flask import Flask,  session, url_for, request,redirect, jsonify, abort
from mongoManager import DatabaseManager
from datetime import timedelta

app = Flask(__name__,  static_folder='./front-end/build/', static_url_path='/')
app.secret_key = "%#$@20)*_#@&$1907^&*"
app.permanent_session_lifetime = timedelta(weeks = (10 * 52))
dbMngr = DatabaseManager() 

def errorMsg(errMsg): # make an error json to send  
    return jsonify(
        {
            "type" : "error",
            "error" : errMsg
        }
    )

@app.before_request
def before_request(*_): # Make the session permanent so that a user can stay logged in 
    session.permanent = True

@app.route("/") # home 
def root():
   
    if not ("user" in session):
        print("user not in session")
        return redirect(url_for("login"))
    return app.send_static_file("index.html")

@app.route("/home/") #redirect to path= "/" 
def home():
    return redirect(url_for("root"))

@app.route("/login/", methods = ["GET", "POST"])  # login api for react 
def login(): 

    if "user" in session:
        return redirect(url_for("home"))
       
    if request.method == "POST":
        if "user" in session :
            return errorMsg("Already Logged In")
        jsonRecv = request.get_json() # get JSON send by the "fetch" function from react front-end
        print(jsonRecv)
        if jsonRecv:
            username = jsonRecv["username"]
            password = jsonRecv["password"]

            if username and password:

                actualUser = dbMngr.getAuthorizedUser(username.strip()) # get a dict of a user from the database along with their actual password
                if actualUser:
                    if actualUser['pass'].strip() == password.strip():
                        session["user"] = actualUser 
                        return jsonify(
                            {
                                "type" : "success",
                            }
                        )
                    else:
                        return  errorMsg("Wrong Password")
                else:
                    return  errorMsg(f"User {username} doesn't exist ")
                        
        abort(404)

    return app.send_static_file('index.html')

@app.route("/signup/", methods = ["GET", "POST"]) #signup api for react
def signUp():
    if "user" in session:
        return redirect(url_for("home"))

    if request.method == "POST":
        jsonRecv = request.get_json() # get JSON send by the "fetch" function from react front-end
        print(jsonRecv)
        if jsonRecv:
            username = jsonRecv["username"].strip()
            password = jsonRecv["password"].strip()
            confirmPass = jsonRecv["confirmPass"].strip()
            gender =  jsonRecv["gender"].strip()

            if username and password and confirmPass and gender :
                if password==confirmPass:
                    user = ( dbMngr.addUser(
                        {
                        'name' : username, 
                        'password' : password,
                        "gender" : gender
                        }
                    ))

                    if not user:
                        return errorMsg(f"User {username} already exits")
                    else :
                        session['user'] = user
                        return  jsonify(
                            {
                                "type" : "success",
                            }
                        )
                    
                else:
                    return errorMsg("Confirmed password doesnt match password entered")
        abort(404)  
    return app.send_static_file("index.html")

@app.route("/logout/", methods = ["GET", "POST"])# log out and delte the session from server
def logout():
    if not ("user" in session):
        return(redirect(url_for("login"))) 
    session.pop("user")
    return redirect(url_for("login"))
   

@app.route("/addpost/", methods = ["GET", "POST"]) # Add Post to the database
def addPost():
    if not "user" in session:
        return redirect(url_for("login"))
    
    if request.method == "POST":
        jsonRecv = request.get_json() # get JSON send by the "fetch" function from react front-end
        print(jsonRecv)
        if jsonRecv:
           
            title = jsonRecv['title'].strip()
            content = jsonRecv['content'].strip()

            if title and content:
                dbMngr.addPost(  # Add the Post to the database
                    {
                        'title': title,
                        'content': content,
                        'poster' : session['user']['name'],
                    }
                )

                return jsonify(
                            {
                                "type" : "success",
                            }
                        )  
            else :
                errorMsg("Dont levae the fields blank")
        
        abort(404)
    return app.send_static_file('index.html')

@app.route("/changepassword/" ,methods = ["GET", "POST"]) # change the password of a user
def changePassword():

    if not "user" in session:
        return redirect(url_for("login"))
    
    if request.method == "POST":
        jsonRecv = request.get_json() # get JSON send by the "fetch" function from react front-end
        if jsonRecv:
            password = jsonRecv['password'].strip()
            newPass = jsonRecv['newPassword'].strip()
            confirmPass = jsonRecv['confirmPassword'].strip()
            
            if newPass != confirmPass:
                return errorMsg("2 passwords does not match")
            else:
                print(session['user'])
                if  (password.strip() != session['user']['pass'].strip() ) :
                    return errorMsg("enter current password correctly")
                success = dbMngr.changePass(session['user']['name'], newPass ) # change the password for the user in the database
                if success:
                    session['user']['pass'] = newPass
                    return jsonify(
                            {
                                "type" : "success",
                            }
                        )  
                else:
                    return errorMsg("Could not change the password. Try again later")
        
        abort(404)
    return app.send_static_file('index.html')

@app.route("/user/<path:username>")
def userPage(username):
    if not "user" in session:
        return (redirect(url_for("/login")))
    if dbMngr.getUser(username):
        return app.send_static_file('index.html')
    else:
        abort(404)

@app.route("/getposts/", methods = ['POST']) # api for the react front-end to fetch the posts for the user
def handleGetPosts(): 
    jsonRecv = request.get_json() 
    if jsonRecv:
        print(jsonRecv)
        offset =  int (jsonRecv['offset'])
        limit = jsonRecv.get('limit')
        posts = []
        for post in dbMngr.getPosts(offset, limit):
            post['createdOn'] = post['createdOn'].strftime('%H:%M, %d %b %Y')
            posts.append(post)
        
        if posts:
            return jsonify({
                "type" : "success",
                "posts" : posts
                })
        else :
            return jsonify({
                "type" : "error",
                "posts" : None,
                "error" : "Can't find nny more Posts"
            })
    else:
        abort(404)

@app.route('/follow/', methods = ["POST"]) # Api to allow the users to follow other users
def handleFollow(): 
    jsonRecv = request.get_json() 
    if jsonRecv:
        username = jsonRecv['username']
        dbMngr.follow(session['user']['name'] , username)
        return jsonify(
                            {
                                "type" : "success",
                            }
                        )  

    else:
        return errorMsg(f"Couldn't follow {username}")

@app.route('/unfollow/', methods = ["POST"]) # Api to allow the users to unfllow other users
def handleUnFollow():
    jsonRecv = request.get_json() 
    if jsonRecv:
        print(jsonRecv)
        username = jsonRecv['username']
        dbMngr.unfollow(session['user']['name'] , username)
        return jsonify(
                            {
                                "type" : "success",
                            }
                        )  

    else:
        return errorMsg(f"Couldn't unfollow {username}")

@app.route('/getuserinfo/<path:username>/', methods = ["POST"])
def handleUserInfo(username):
    print(session['user']['name'])
    userInfo =  dbMngr.getUser(username)
    if userInfo:
        followers = dbMngr.getFollowers(username)
        following = dbMngr.getFollowing(username)
        followerCount = len(followers)
        followingCount = len(following)
        isFollowed = session['user']['name'] in followers
        data = {
            'name' : userInfo['name'],
            'dateJoined' : userInfo['dateJoined'].strftime(r'%d %b %Y'),
            'gender' : userInfo['gender'],
            'followers' : followers,
            'following': following,
            'followerCount' : followerCount,
            'followingCount' : followingCount,
            "isFollowed" : isFollowed
        }
        return jsonify(
                {
                    "type" : "success",
                    "data" : data
                }
            )
    else:
        return errorMsg("Could not get info")
             
@app.route("/getusername/" , )
def getUserName():
    if "user" in session:
        return jsonify(session['user'])
    else:
        return jsonify(None)



if __name__ == "__main__":
    app.run(port = 4001)
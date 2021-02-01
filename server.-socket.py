from flask import Flask, render_template, session, url_for, request,redirect, flash
from flask_socketio import SocketIO, emit
from DatabaseManager import DatabaseManager
from time import sleep



PyShareWeb = Flask(__name__)
PyShareWeb.secret_key = "%#$@20)*_#@&$1907^&*"
dbMngr = DatabaseManager() 
serverSocket = SocketIO(PyShareWeb)



@serverSocket.on("get_posts")
def handleGetPosts(offset):
    
    serverSocket.emit(
        "get_posts" , [post for post in dbMngr.getPosts(offset)], room = request.sid
    )

@PyShareWeb.route("/")
def mainPage():
   
    return redirect(url_for("home"))

@PyShareWeb.route("/home/", )
def home():
 
    if not "user" in session:
        return redirect(url_for("login"))
    else:
        return render_template("home.html", user = session['user']['name'])

@PyShareWeb.route("/login/", methods = ["GET", "POST"] )
def login():

    if "user" in session:
        flash ("Already Logged in ")
        return redirect(url_for("home"))

    if request.method == "POST":
        username = request.form["username"]
        password = request.form["password"]
        
        if username and password: 
            user = dbMngr.getAuthorizedUser(username.strip())
          
            if user:
                if user['pass'].strip() == password.strip():
                    session['user'] = user
                    return redirect(url_for("home"))
                else : 
                    flash("password entered is wrong")
            else: 
                flash(f"User {username} doesnt exist")
        
    return render_template("login.html")

@PyShareWeb.route("/signup/", methods = ["GET", "POST"])
def signup():

    if "user" in session:
        flash ("Already Logged in ")
        return redirect(url_for("home"))

    if request.method == "POST":
        username = request.form["username"].strip()
        password = request.form["password"].strip()
        confirmPass = request.form["confirmPass"].strip()
        gender  = request.form.get("gender", None).strip()
       

        if username and password and confirmPass and gender :
            if password.strip() == confirmPass.strip():
                status = ( dbMngr.addUser(
                    {
                        'name' : username.strip(), 
                        'pass' : password.strip(),
                        "gender" : gender
                        }
                    )
                    )

                if not status:
                    flash(f"User {username} already exits")

            else: 
                flash("Confirmed password doesnt match password entered")

    return render_template("signup.html")


@PyShareWeb.route("/addpost/", methods= ["GET", "POST"])
def addPost():
    if not "user" in session:
        return redirect(url_for("login"))

    if request.method == "POST" : 
        
        title = request.form['title']
        content = request.form['content']
        
        if title and content:
        
            dbMngr.addPost(
                {
                    'title': title,
                    'content': content,
                    'poster' : session['user']['name'],
                }
            )
            flash("Post added succefully")
            return redirect(url_for('home'))

        else: 
            flash("Dont levae the fields blank")

        
        
        print(title, content)

    return  render_template('addPost.html',user = session['user']['name'])


@PyShareWeb.route("/changepassword/" ,methods = ["GET", "POST"])
def changePassword():

    if not "user" in session:
        return redirect(url_for("login"))


    if  request.method == "POST": 
        newPass= request.form['newPassword'].strip()
        confirmPass = request.form["confirmPassword"].strip()

      
        if  newPass != confirmPass:
            flash("2 passwords does not match")
        else: 
          
            print(dbMngr.changePass(session['user']['name'], newPass ))
        

    return render_template("changePass.html", user= session['user']['name'])

@PyShareWeb.route("/me/", )
def mePage():
    if not "user" in session:
        return redirect(url_for("login"))
    return render_template('me.html', user = session['user']['name'])

@PyShareWeb.route("/logout/")
def logout():
    session.pop("user")
    flash("logged out")
    return redirect(url_for('login'))

@PyShareWeb.route("/user/<path:username>")
def userPage(username):
    if username == session['user']['name']:
        return redirect(url_for("mePage"))
    userInfo =  dbMngr.getUser(username)
    if userInfo:
        return render_template("userpage.html", userinfo = userInfo, user = session['user']['name'])
    else : 
        flash(f"user {username} does not exist")
        return redirect(url_for("home"))



serverSocket.run(PyShareWeb, host="192.168.0.5", debug = True)
 
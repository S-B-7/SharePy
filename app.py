# server  server ovjs;ofj

from flask import Flask, render_template, session, url_for, request,redirect, flash, jsonify
from flask_socketio import SocketIO, emit
from mongoManager import DatabaseManager
from datetime import timedelta


app = Flask(__name__)

app.secret_key = "%#$@20)*_#@&$1907^&*"
app.permanent_session_lifetime = timedelta(weeks = 52)
dbMngr = DatabaseManager() 



@app.before_request
def befor_request(*_):
    session.permanent = True

@app.route("/getposts/", methods = ['POST'])
def handleGetPosts():
    
    o = int(request.form['offset'])
    posts =   [post for post in dbMngr.getPosts(o)]
    if posts: 
        return jsonify(posts)
    else :
        return jsonify(None)

@app.route("/")
def mainPage():
   
    return redirect(url_for("home"))

@app.route("/home/", )
def home():
 
    if not "user" in session:
        return redirect(url_for("login"))
    else:
        return render_template("home.html", user = session['user']['name'])

@app.route("/login/", methods = ["GET", "POST"] )
def login():

    if "user" in session:
        flash ("Already Logged in ")
        return redirect(url_for("home"))

    if request.method == "POST":
        username = request.form["username"]
        password = request.form["password"]
        
        if username and password: 
            user = dbMngr.getAuthorizedUser(username.strip())
            print (user)
            if user:
                if user['pass'].strip() == password.strip():
                    session['user'] = user
                    return redirect(url_for("home"))
                else : 
                    flash("password entered is wrong")
            else: 
                flash(f"User {username} doesnt exist")
        
    return render_template("login.html")

@app.route("/signup/", methods = ["GET", "POST"])
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
                user = ( dbMngr.addUser(
                    {
                        'name' : username.strip(), 
                        'password' : password.strip(),
                        "gender" : gender
                        }
                    )
                    )

                if not user:
                    flash(f"User {username} already exits")
                else:
                    session['user'] = user
                    return redirect(url_for('home'))

            else: 
                flash("Confirmed password doesnt match password entered")

    return render_template("signup.html")


@app.route("/addpost/", methods= ["GET", "POST"])
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


@app.route("/changepassword/" ,methods = ["GET", "POST"])
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

@app.route("/me/", )
def mePage():
    if not "user" in session:
        return redirect(url_for("login"))
    return render_template('me.html', user = session['user']['name'])

@app.route("/logout/")
def logout():
    session.pop("user")
    flash("logged out")
    return redirect(url_for('login'))

@app.route("/user/<path:username>")
def userPage(username):
    if username == session['user']['name']:
        return redirect(url_for("mePage"))
    userInfo =  dbMngr.getUser(username)
    if userInfo:
        return render_template("userpage.html", userinfo = userInfo, user = session['user']['name'])
    else : 
        flash(f"user {username} does not exist")
        return redirect(url_for("home"))


if __name__ == "__main__":
    app.run( host="192.168.0.5",threaded = True,debug=True)
 
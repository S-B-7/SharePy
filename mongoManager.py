import pymongo as mongo
from  pprint import pprint
from datetime import datetime
import os

class DatabaseManager:
    ''' 
        Communicated with MongoDb 
    '''
    def __init__(self, limit = 3):
        self.LIMIT = limit
        self.client = mongo.MongoClient(os.environ['SharePyMongoDb'])
        self.db= self.client['SharePy']
        self.users = self.db['Users']
        self.posts = self.db['Posts']
        self.following = self.db['Following']

    def getUser(self, username : str) -> dict : #get a user dict without password
        user  = self.users.find_one({"_id" : username}, {"_id":0,"password": 0 })
        if user :
            user['name'] = username
        return user
    
    def getAuthorizedUser(self, username : str) -> dict : # get a user dict with the password
        user  = self.users.find_one({"_id" : username}, {"_id" : 0 } )
        if user :
            user['name'] = username
            user['pass'] = user['password']
            user.pop('password')
        return user
    
    def addUser(self, user : dict) -> bool: #adds a user to the database
        user['_id'] = user['name']
        user['dateJoined'] = datetime.today()
        user.pop('name')
        try : 
            self.users.insert(user)
            user['name'] = user['_id']
            user.pop('_id')
            return user
        except mongo.errors.DuplicateKeyError as e: 
            return False
    
    def getPost(self, id :str ) -> dict: #gets a specific post by its id
        result  =  self.posts.findOne({"_id": id})
        result['_id'] = str (result['_id']) 
    
    def getPosts(self, offset: int = 0 ) -> dict: #gets posts for homepage using a offset which defaults to 0v
        iterator = self.posts.find().sort("createdOn",-1).limit(self.LIMIT).skip(offset)
        for post in iterator:
            post['_id'] = str(post['_id']) 
            yield post

    def addPost(self, post: dict ) : # adds a post
        post['createdOn'] = datetime.now()
        return self.posts.insert(post)
    
    def changePass(self, user : str , password : str ) -> bool : # changes assword of a user
        try: 
            self.users.update({"_id": user},
                    {"$set": 
                        {
                            "password": password
                        }
                    }
            )     
            return True   
        except :
            return False

    def getFollowers(self,username : str) -> list: #get list of followers of specific user
        cur = self.following.find(
            {
                "following": username  
            },
            {
                "_id" : 0,
                "follower": 1,
            }
        )

        return  [f['follower'] for f in cur]

    def getFollowing(self, username : str) -> list : # get a list of the users a specific user is following
        cur = self.following.find(
            {
                "follower": username  
            },
            {
                "_id" : 0,
                "following": 1,
            }
        )

        return  [f['following'] for f in cur]
        
    def follow(self, follower : str, following : str) : #makes a user follow another user
        self.following.insert(
            {
                'follower' : follower,
                'following': following
            }
        )

    def unfollow(self, follower : str , following : str ): # makes a user unfollow another user
        self.following.remove(
            {
                "follower" : follower,
                "following": following,
            }
        )

if __name__ == "__main__":
    db = DatabaseManager()
    db.follow(
        'S.B.7', 
        'user2'
    )
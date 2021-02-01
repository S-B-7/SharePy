import pymongo as mongo
from  pprint import pprint
from datetime import datetime

class DatabaseManager:
    ''' 
        Communicated with MongoDb 
    '''
    def __init__(self, limit = 3):
        self.LIMIT = limit
        self.client = mongo.MongoClient("mongodb+srv://SB7:s_7650_b@pyshare.gtcow.mongodb.net/SharePy?retryWrites=true&w=majority")
        self.db= self.client['SharePy']
        self.users = self.db['Users']
        self.posts = self.db['Posts']

    def getUser(self, username : str) -> dict : 
        user  = self.users.find_one({"_id" : username}, {"_id":0,"password": 0 })
        if user :
            user['name'] = username
            user['pass'] = user['password']
            user.pop('password')
        return user
    
    def getAuthorizedUser(self, username : str) -> dict : 
        user  = self.users.find_one({"_id" : username}, {"_id" : 0 } )
        if user :
            user['name'] = username
            user['pass'] = user['password']
            user.pop('password')
        return user
    
    def addUser(self, user : dict) -> bool:
        user['_id'] = user['name']
        user['dateJoined'] = datetime.today()
        user.pop('name')
        try : 
            self.users.insert(user)
            return True
        except mongo.errors.DuplicateKeyError as e: 
            return False
    
    def getPost(self, id :str ) -> dict:
        result  =  self.posts.findOne({"_id": id})
        result['_id'] = str (result['_id']) 
    
    def getPosts(self, offset: int = 0 ) -> dict: 
        iterator = self.posts.find().sort("createdOn",-1).limit(self.LIMIT).skip(offset)
        for post in iterator:
            post['_id'] = str(post['_id']) 
            yield post

    def addPost(self, post: dict ) :
        post['createdOn'] = datetime.now()
        return self.posts.insert(post)
    
    def changePass(self, user : str , password : str ) -> bool :
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

if __name__ == "__main__":
    db = DatabaseManager()
  
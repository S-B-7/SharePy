import mysql.connector
import datetime

class DatabaseManager:
    '''
        Communicates with the MySQL database
    '''

    def __init__(self):
        self.db= mysql.connector.connect(
            pool_name = "mypool",
            pool_size = 3,
            host = "localhost",
            user  = "SB7",
            password = "pass",
            database = "PyShare"
        )
        self.cursor = self.db.cursor()

    def getUser(self, username : str ) -> dict:
        self.execute(''' SELECT name, gender, dateJoined FROM users 
            WHERE name = %s
            LIMIT 1;
        ''',
            ( username,)
        )

        userTuple = self.cursor.fetchone()
        if userTuple:
            return {
                'name': userTuple[0],
                'gender' : userTuple[1],
                'dateJoined': userTuple[2].__str__()
                }
        else:
            return None

    def getAuthorizedUser (self, username : str )  :
        self.execute('''
                   
                    SELECT name,pass, gender, dateJoined FROM users 
                    WHERE name = %s
                    LIMIT 1;
               ''',
                            (username,)
                            )

        userTuple = self.cursor.fetchone()
        if userTuple:
            return {
                'name' : userTuple[0],
                'pass' : userTuple[1],
                'gender' : userTuple[2],
                'dateJoined' : userTuple[3].__str__()
            }
        else:
            return None

    def addUser(self , user ):

        if self.getUser(user['name']):
            return False
        else:
            self.execute('''
            INSERT INTO users(name,gender,pass)
            VALUES (%s, %s, %s );
            ''',
            (user['name'], user['gender'], user['pass'] )
            )
            self.db.commit()
            return True

    def getPost(self, id :int ) :
        self.execute(''' SELECT title, content , poster,createdOn   FROM posts 
                    WHERE id = %s
                    LIMIT 1;
                ''',
                            (id,)
                            )
        postTuple = self.cursor.fetchone()
        if not postTuple: return  None
        
        return {
            'title' : postTuple[0],
            'content' : postTuple[1],
            'poster' : postTuple[2],
            'createdOn' : postTuple[3]
        }

    def addPost (self, post) -> bool :


        self.execute('''
            INSERT INTO posts ( title, content, poster)
            VALUES ( %s, %s,%s );
        ''' , (post['title'], post['content'], post['poster'], ) )
        self.db.commit()

    def getPosts(self,offset = 0 ):
        self.execute('''
            SELECT title, content, poster, createdOn FROM posts 
            ORDER BY createdOn DESC
            LIMIT 3
            OFFSET %s;
        ''', (offset,) )

       
        for postTuple in self.cursor:
           
            yield {
                'title' : postTuple[0],
                'content': postTuple[1],
                'poster' :  postTuple[2],
                'createdOn' : postTuple[3].__str__()
            }

    def changePass(self, user , password):
        print(user, password)
        self.execute('''
            UPDATE users
            SET pass = %s
            WHERE name = %s;
        ''', (password, user)
        )
        self.db.commit()

    def execute (self, sql, *_, **__):
        self.db.ping(reconnect = True)
        self.cursor.execute(sql, *_, **__)


if __name__ == "__main__":
    dbMngr = DatabaseManager()
    print(dbMngr.getAuthorizedUser("s.b.7"))



from flask import Flask
from flask import render_template
from flask import stream_with_context, request, Response
from flask import json

app = Flask(__name__)

from pprint import pprint
json_data=open('/home/cipo7741/Dropbox/Public/flask/guess-the-method/java-lang-math.json')
data = json.load(json_data)

@app.route('/')
def index():
    return render_template('index.html', description=data[0]["Description"], classpath="java.lang.Math.", size=len(data[0]["Method"]), arguments=data[0]["Arguments"])

#@app.route('/hello/')
#@app.route('/hello/<name>')
#def hello(name=None):
#    return render_template('hello.html', name=name)

def index():
    if request.method == 'OPTIONS':
        # custom options handling here
        hello
    return 'Hello World!'
index.provide_automatic_options = False
index.methods = ['GET', 'OPTIONS']

app.add_url_rule('/', index)

#@app.route('/login', methods=['POST', 'GET'])
#def login():
#    error = None
#    if request.method == 'POST':
#        if valid_login(request.form['username'],
#                       request.form['password']):
#            return log_the_user_in(request.form['username'])
#        else:
#            error = 'Invalid username/password'
#    # the code below is executed if the request method
#    # was GET or the credentials were invalid
#    return render_template('login.html', error=error)

@app.errorhandler(404)
def page_not_found(error):
    return 'This page does not exist', 404

@app.template_test()
def is_prime(n):
    if n == 2:
        return True
    for i in range(2, int(math.ceil(math.sqrt(n))) + 1):
        if n % i == 0:
            return False
    return True

@app.route('/stream')
def streamed_response():
    @stream_with_context
    def generate():
        yield 'Hello '
        yield request.args['name']
        yield '!'
    return Response(generate())

if __name__ == '__main__':
    app.run(debug=True)
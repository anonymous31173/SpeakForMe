from flask import Flask
from flask import render_template
from flask import request, redirect

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/data', methods = ['POST'])
def post():
    data = request.form['data']
    print("data is '" + data + "'")

   

    

    return redirect('/')

if __name__ == "__main__":
    app.config.update(
        DEBUG=True,
        SECRET_KEY="development"
    )
    app.run(host="0.0.0.0", port=8000)

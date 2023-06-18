from flask import Flask, render_template

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/words')
def words():
    return render_template('words.html')

@app.route('/sentences')
def sentences():
    return render_template('sentences.html')

if __name__ == '__main__':
    app.run()

from flask import Flask, render_template, session, request, redirect, jsonify
import pyrebase
from bot import get_response
from flask_cors import CORS
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "https://vegacrypto.xyz"}})

config = {
    'apiKey': "AIzaSyAZDuSI9RwZlg6SziXPhXjIz30yQAsogMo",
    'authDomain': "vegabotchatbot.firebaseapp.com",
    'projectId': "vegabotchatbot",
    'storageBucket': "vegabotchatbot.appspot.com",
    'messagingSenderId': "1022370349573",
    'appId': "1:1022370349573:web:0e0fbd6e8c05a9ffd5526c",
    'measurementId': "G-3S1Z6E3MHH",
    'databaseURL': ''
}

firebase = pyrebase.initialize_app(config)
auth = firebase.auth()

app.secret_key = 'secret'


@app.route('/')
def message():
    return "Hey there. Veguinha's house"

@app.route('/auth', methods=['POST', 'GET'])
def authentication():
    data = request.json

    if 'user' in session:
        return jsonify({
            'success': True,
            'email': session['user']
        })

    if request.method == 'POST':
        email = data.get('email')
        password = data.get('pwd')
        type = data.get('type')

        try:
            if type == 'login':
                user = auth.sign_in_with_email_and_password(email, password)
                session['user'] = email
                user['localId']
                return jsonify({
                    'success': True,
                    'email': user['email'],
                    'uid': user['localId']
                })
        except Exception as e:
            return jsonify({
                'success': False,
                'error': str(e)
            })
        
        try:
            if type == 'register':
                user = auth.create_user_with_email_and_password(email, password)
                verify = auth.send_email_verification(user['idToken'])
                print(verify)
                verify

                return jsonify({
                    'success': True,
                    'email': user['email'],
                    'uid': user['localId'],
                })
        except Exception as e:
            return jsonify({
                'success': False,
                'error': str(e)
            })

        try:
            if type == 'reset':
                auth.send_password_reset_email(email)
                return jsonify({
                    'success': True,
                    'email': email
                })
        except Exception as e:
            return jsonify({
                'success': False,
                'error': str(e)
            })

@app.route('/predict', methods=['POST'])
def chat(): 
    data = request.json
    user_input = data.get('input')
    user_id = data.get('id')
    lang = data.get('lang')
    messageId = data.get('messageId')
    bot_response = get_response(user_id, user_input, lang, messageId)
    if "error" in bot_response:
        return jsonify({"error": bot_response["error"]})

    else:
        response = {'result': bot_response['result'], 'source': bot_response['source']}
        return jsonify(response)




if __name__ == '__main__':
    app.run(debug=True)
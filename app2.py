from flask import Flask, render_template, request, redirect, session, url_for, flash
from flask_mail import Mail, Message
from flask_socketio import SocketIO, join_room, leave_room
import base64
from pymongo import MongoClient
import os
import random
import string
from flask import jsonify
  
app = Flask(__name__)
app.secret_key=os.urandom(24)

mongo_client = MongoClient("mongodb+srv://Textovert:Kyundu17@textovert.uzlevw3.mongodb.net/")
db = mongo_client['nsp']
nsp_register_collection = db['nsp_register']

app.config['MAIL_SERVER'] = 'smtp-relay.brevo.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USE_SSL'] = False
app.config['MAIL_USERNAME'] = 'rawsomeraj10@gmail.com'
app.config['MAIL_PASSWORD'] = '7FC2Mg4tcVqwTb09'

mail = Mail(app)
socketio = SocketIO(app)

def send_email(recipient, subject, body):
    msg = Message(subject, sender='2022pietcrrituraj047@poornima.org', recipients=[recipient])
    msg.body = body
    mail.send(msg)

@app.route('/')
def signup():
    return render_template('log.html')

@app.route('/index')
def index():
    return render_template('index.html')

@app.route('/add_user', methods=['POST'])
def add_user():
    name = request.form.get('uname')
    email = request.form.get('uemail')
    password = request.form.get('upassword')
    otp = ''.join(random.choices(string.digits, k=6))

    existing_user = nsp_register_collection.find_one({'email': email})

    if existing_user:
        return render_template('log.html', error_message="User with this email already exists.")

    nsp_register_collection.insert_one({
        'name': name,
        'email': email,
        'password': password,
        'otp': otp,
        'verified': False
    })

    subject = 'Registration OTP'
    message = f'Your OTP for registration is: {otp}'
    send_email(email, subject, message)

    return render_template('verify.html')


@app.route('/verify_otp', methods=['POST'])
def verify_otp():
    email = request.form.get('email')
    otp = request.form.get('otp')

    user = nsp_register_collection.find_one({'email': email, 'otp': otp})

    if user:
        nsp_register_collection.update_one({'email': email}, {'$set': {'verified': True}})
        return render_template('log.html')
    else:
        return render_template('verify.html')
    
@app.route('/register')
def register():
    return render_template('reg.html')
    
@app.route('/login_validation', methods=["POST"])
def login_validation():
    email = request.form.get('email')
    password = request.form.get('password')

    user = nsp_register_collection.find_one({'email': email, 'password': password})

    if user:
        session['user_id'] = str(user['_id'])  
        return redirect(url_for('index'))
    else:
        flash('Invalid email or password. Please try again.', 'error')
        return redirect(url_for('signup'))
    
@app.route('/forgot_pass', methods=['GET', 'POST'])
def forgot_password():
    if request.method == 'GET':
        return render_template('forgot_password.html')
    elif request.method == 'POST':
        email = request.form.get('email')
        user = nsp_register_collection.find_one({'email': email})
        if user:
            new_password = ''.join(random.choices(string.ascii_letters + string.digits, k=8))
            nsp_register_collection.update_one({'email': email}, {'$set': {'password': new_password}})
            subject = 'Password Reset'
            message = f'Your new password is: {new_password}'
            send_email(email, subject, message)

            return jsonify({'success': True, 'message': 'Password reset successful. Check your email for the new password.'}), 200
        else:
            return jsonify({'success': False, 'message': 'Email not found. Please enter a valid email address.'}), 404

@app.route('/logout')
def logout():
    session.pop('user_id')
    return redirect('/')

@app.route('/services')
def services():
    return render_template('services.html')

@app.route('/about')
def about():
    return render_template('about.html')

@app.route('/explore')
def exp():
    return render_template('exp.html')

@app.route('/chat')
def chat():
    username = request.args.get('username')
    if username:
        return render_template('chat.html',username=username)
    else:
        return render_template('services.html')
    
@app.route('/scene')
def scene():
    username = request.args.get('username')
    if username:
        return render_template('scene.html',username=username)
    else:
        return render_template('services.html')
    
@app.route('/chat-o-vert')
def chatovert():
    return render_template('chat-o-vert.html')

@app.route('/scratch-o-vert')
def scratchovert():
    return render_template('scrath-o-vert.html')

@app.route('/scratch')
def scratch():
    username = request.args.get('username')
    if username:
        return render_template('scratch.html',username=username)
    else:
        return render_template('services.html')

@app.route('/scenevert')
def scenevert():
    return render_template('scenevert.html')
    
@socketio.on('send_message')
def handle_send_message_event(data):
    app.logger.info("{} has sent message to the room {}: {}".format(data['username'],data['room'],data['message']))
    socketio.emit('receive_message', data, room=data['room'])

@socketio.on('send_messages')
def handle_send_message_events(data):
    app.logger.info("{} has sent message to the room {}: {}".format(data['username'],data['room'],data['message']))
    socketio.emit('receive_messages', data, room=data['room'])


@socketio.on('send_image')
def handle_send_image_event(data):
    image_file = data.get('image')
    if image_file:
        try:
            with open(image_file, 'rb') as file:
                image_data = base64.b64encode(file.read()).decode('utf-8')
                data['image'] = image_data
        except Exception as e:
            print(f"Error: {e}")


    app.logger.info("{} has sent an image to the room {}".format(data['username'], data['room']))
    socketio.emit('receive_image', data, room=data['room'])

@socketio.on('join_room')
def handle_join_room_event(data):
    app.logger.info("{} has joined the room {}".format(data['username'], data['room']))
    join_room(data['room'])
    socketio.emit('join_room_announcement', data, room=data['room'])


@socketio.on('leave_room')
def handle_leave_room_event(data):
    app.logger.info("{} has left the room {}".format(data['username'], data['room']))
    leave_room(data['room'])
    socketio.emit('leave_room_announcement', data, room=data['room'])

@socketio.on('join_room2')
def handle_join_room_events(data):
    app.logger.info("{} has joined the room {}".format(data['username'], data['room']))
    join_room(data['room'])
    socketio.emit('join_room_announcement2', data, room=data['room'])


@socketio.on('leave_room2')
def handle_leave_room_events(data):
    app.logger.info("{} has left the room {}".format(data['username'], data['room']))
    leave_room(data['room'])
    socketio.emit('leave_room_announcement2', data, room=data['room'])

@socketio.on('join_room3')
def handle_join_room_eventss(data):
    app.logger.info("{} has joined the room {}".format(data['username'], data['room']))
    join_room(data['room'])
    socketio.emit('join_room_announcement3', data, room=data['room'])


@socketio.on('leave_room3')
def handle_leave_room_eventss(data):
    app.logger.info("{} has left the room {}".format(data['username'], data['room']))
    leave_room(data['room'])
    socketio.emit('leave_room_announcement3', data, room=data['room'])


if __name__=="__main__":
   socketio.run(app,debug=True)

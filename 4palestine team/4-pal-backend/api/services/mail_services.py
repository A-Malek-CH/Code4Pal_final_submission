from flask_mail import  Message
import os, random, string
from api.extensions import mail

def generate_code(length=6):
    return ''.join(random.choices(string.digits, k=length))


def send_mail(email_title, email_body, recipient_email):
    try:
        msg = Message(email_title, recipients=[recipient_email])
        msg.body = email_body
        mail.send(msg)
        return True
    except Exception as e:
        print("ERROR:", e)  
        return False

def send_confirmation_email(user_email, code):
    try:
        email_title = "Confirm your email"
        email_body = f""""
        Hey there, this is the code to confirm your email at 4 Palestine App.
        {code}
        """

        sent = send_mail(email_title, email_body, user_email)      
        return sent

    except Exception as e:
        print(f"error while sending mail: {e}")
        return False
import asyncio
import smtplib
import ssl
import secrets
from email.message import EmailMessage
from .template.otp_template import return_template
from src import settings


def generate_otp(length: int = 6) -> int:
    start = 10 ** (length - 1)
    end = (10**length) - 1
    return secrets.randbelow(end - start + 1) + start


def _send_email_blocking(msg: EmailMessage):
    context = ssl.create_default_context()

    with smtplib.SMTP(settings.SMTP_SERVER, settings.SMTP_PORT) as server:
        server.starttls(context=context)
        server.login("tvyoutub07@gmail.com", settings.SMTP_PASSWORD)
        server.send_message(msg)


def send_otp(recipient_name: str, email: str):
    otp = generate_otp()
    html = return_template(recipient_name, otp, email)

    msg = EmailMessage()
    msg["Subject"] = "Your OTP"
    msg["From"] = "tvyoutub07@gmail.com"
    msg["To"] = email
    msg.set_content("Your OTP is below:")
    msg.add_alternative(html, subtype="html")

    # Run blocking SMTP in a thread
    _send_email_blocking(msg)

    return otp

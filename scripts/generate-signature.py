import requests
import base64
import imghdr
import argparse
import os
import logging

logging.basicConfig(
    filename="signature.log",
    format="%(asctime)s %(levelname)s: %(message)s",
    level=logging.INFO
)
console_handler = logging.StreamHandler()
console_handler.setLevel(logging.INFO)

logging.getLogger().addHandler(console_handler)


def generate_token(password, username, signin_url):

    payload = {
        "username": username,
        "password": password
    }

    response = requests.post(signin_url, json=payload)
    # Check the status code to see if the request was successful
    if response.status_code == 401:
        raise Exception("Login failed. Please check your username and password and try again.")
    elif response.status_code == 500:
        raise Exception("Login failed. Server error please try again later")
    
    token = response.json()["token"]
    return token


def generate_signature(token, image_path, generate_signature_url):

    # Determine the image type using imghdr.what()
    image_type = imghdr.what(image_path)
        
    if image_type not in ["jpeg", "png", "jpg"]:
        raise Exception("Image is not of JPEG, PNG, or JPG format")
    
    access_token = token
    headers = {
        "Authorization": f"Bearer {access_token}"
    }

    with open(image_path, 'rb') as f:
        files = {"image": f}
        response = requests.post(generate_signature_url, headers=headers, files=files)
    
    # Check the status code to see if the request was successful
    if response.status_code == 500:
        raise Exception("Upload failed. Server error, please try again later.")
    
    signature = response.json()['signature']
    return signature


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="My script")
    
    parser.add_argument("--username", type=str, default=None, help="signin username", required=True)
    parser.add_argument("--password", type=str, default=None, help="signin password", required=True)
    parser.add_argument("--signin-url", type=str, default="http://13.67.71.103:10989/signin", help="signin url", required=False)
    parser.add_argument("--generate-signature-url", type=str, default="http://13.67.71.103:10989/generate-signature", help="generate signature url", required=False)
    parser.add_argument("--image-path", type=str, default='download.png', help="file path to the image", required=False)

    args = parser.parse_args()

    if not os.path.exists(args.image_path):
        raise Exception("Image does not exist, please check the path")
    
    username = args.username
    password = args.password
    signin_url = args.signin_url
    generate_signature_url = args.generate_signature_url
    image_path = args.image_path

    token = generate_token(password, username, signin_url)
    signature = generate_signature(token, image_path, generate_signature_url)
    logging.info(f"Signature:{signature}")
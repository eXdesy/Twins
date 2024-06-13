from jwt import encode, decode
from jwt import exceptions
from datetime import datetime, timedelta
from os import getenv
from fastapi.responses import JSONResponse
import bcrypt
from fastapi import Request
from fastapi.routing import APIRoute
import re

# Function to calculate the expiration date for a token
def expire_date(days: int):
  date = datetime.now()
  new_date = date + timedelta(days)
  return new_date

# Function to write a token with expiration date
def write_token(data: dict):
  token = encode(payload={**data, "exp": expire_date(7)}, key=getenv("SECRET"), algorithm="HS256")
  return token

# Function to validate a token
def validate_token(token, output=False):
  try:
    if output:
      return decode(token, key=getenv("SECRET"), algorithms=["HS256"])
    decode(token, key=getenv("SECRET"), algorithms=["HS256"])
  except exceptions.DecodeError:
    return JSONResponse(content={"message": "Invalid Token"}, status_code=400)
  except exceptions.ExpiredSignatureError:
    return JSONResponse(content={"message": "Token Expired"}, status_code=400)

# Function to hash a password
def hash_password(password):
  hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
  return hashed_password.decode('utf-8')

# Function to validate an url
def is_valid_url(url):
  url_regex = re.compile(
    r'^(?:http|ftp)s?://'  # http:// or https://
    r'(?:(?:[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?\.)+(?:[A-Z]{2,6}\.?|[A-Z0-9-]{2,}\.?)|'  # domain
    r'localhost|'  # or localhost...
    r'\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}|'  # ...or IP
    r'\[?[A-F0-9]*:[A-F0-9:]+\]?)'  # ...r IPv6
    r'(?::\d+)?'  # port
    r'(?:/?|[/?]\S+)$', re.IGNORECASE)
  return re.match(url_regex, url) is not None

# Function to convert date of birth to age
def calculate_age(date_of_birth):
  today = datetime.today()
  birth_date = datetime.strptime(date_of_birth, '%Y-%m-%d')
  age = today.year - birth_date.year - ((today.month, today.day) < (birth_date.month, birth_date.day))
  return age

# Custom middleware for verifying tokens
class VerifyTokenRoute(APIRoute):
  def get_route_handler(self):
    original_route = super().get_route_handler()
    async def verify_token_middleware(request:Request):
      if request.headers.get("Authorization"):
        token = request.headers["Authorization"].split(" ")[1]
      validation_response = validate_token(token, output=False)
      if validation_response == None:
        return await original_route(request)
      else:
        return validation_response
    return verify_token_middleware

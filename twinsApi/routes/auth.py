from fastapi import APIRouter, Header, HTTPException
from fastapi.responses import JSONResponse

from middlewares.functions_jwt import validate_token
from middlewares.functions_auth import *
from database.model import *

auth_routes = APIRouter()

@auth_routes.post("/register")
def register(newUser: NewUser):
  print(newUser.model_dump())
  if newUser:
    return register_user(newUser.role, newUser.username, newUser.password, newUser.gender, newUser.first_name, newUser.last_name)
  else:
    return JSONResponse(content={"message": "Unexpected error"}, status_code=404)

@auth_routes.post("/login")
def login(loginUser: LoginUser):
  print(loginUser.model_dump())
  if loginUser:
    return login_user(loginUser.username, loginUser.password)
  else:
    return JSONResponse(content={"message": "Unexpected error"}, status_code=404)

@auth_routes.post("/logout")
def logout(Authorization: str = Header(None)):
  token = verify_token(Authorization)
  if not token:
    return JSONResponse(content={"message": "Invalid token"}, status_code=404)
  try:
    return invalidate_token(token["user_id"])
  except HTTPException as e:
    return JSONResponse(content={"message": "Error logging out", "details": str(e.detail)}, status_code=500)

@auth_routes.post("/upadatePassword")
def password(updatePassword: UpdatePassword, Authorization: str = Header(None)):
  token = verify_token(Authorization)
  if not token:
    return JSONResponse(content={"message": "Invalid token"}, status_code=404)
  try:
    return update_password(token["user_id"], updatePassword.old_password, updatePassword.new_password)
  except HTTPException as e:
    return JSONResponse(content={"message": "Error password updating", "details": str(e.detail)}, status_code=500)

@auth_routes.post("/verify/token")
def verify_token(Authorization: str = Header(None)):
  token = Authorization.split(" ")[1]
  return validate_token(token, output=True)

@auth_routes.post("/support")
def support(support: Support):
  print(support.dict())
  if support:
    return support_user(support.user_id, support.username, support.first_name, support.last_name, support.description)
  else:
    return JSONResponse(content={"message": "Unexpected error"}, status_code=404)

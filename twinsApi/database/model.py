from pydantic import BaseModel
from datetime import date

class LoginUser(BaseModel):
	username: str
	password: str
	current_id: int

class UpdatePassword(BaseModel):
	old_password: str
	new_password: str

class NewUser(BaseModel):
  user_id: int
  role: str
  username: str
  password: str
  gender: str
  first_name: str
  last_name: str

class ProfileUser(BaseModel):
  first_name: str
  last_name: str
  orientation: str
  country: str
  country_iso: str
  city: str
  city_iso: str
  date_of_birth: date
  description: str
  foto: str

class NetworksUser(BaseModel):
  instagram: str
  snapchat: str
  twitter: str
  vk: str
  discord: str
  tiktok: str
  twitch: str
  bereal: str

class CreateChannelsUser(BaseModel):
  foto: str
  name: str
  category: str
  description: str
  country: str
  country_iso: str
  price: int
  link: str

class UpdateChannelsUser(BaseModel):
  channel_id: int
  foto: str
  name: str
  category: str
  description: str
  country: str
  country_iso: str
  price: int
  link: str

class CreateGroupsUser(BaseModel):
  foto: str
  name: str
  category: str
  description: str
  country: str
  country_iso: str
  price: int
  link: str

class UpdateGroupsUser(BaseModel):
  group_id: int
  foto: str
  name: str
  category: str
  description: str
  country: str
  country_iso: str
  price: int
  link: str

class LikeUser(BaseModel):
  liked_profile_id: int
  status: bool

class MatchUser(BaseModel):
  match_profile_id: int
  status: bool

class JoinChannel(BaseModel):
  channel_id: int
  status: bool

class JoinGroup(BaseModel):
  group_id: int
  status: bool

class Support(BaseModel):
  user_id: int
  username: str
  first_name: str
  last_name: str
  description: str

class Report(BaseModel):
  report_type_id: int
  report_type: str
  report_category: str
  description: str
  report_status: bool

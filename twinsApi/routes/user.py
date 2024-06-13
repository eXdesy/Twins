from fastapi import APIRouter, Header
from fastapi.responses import JSONResponse
from typing import List
from fastapi import Query

from middlewares.functions_jwt import validate_token, VerifyTokenRoute
from middlewares.functions_user import *
from database.model import *

user_routes = APIRouter(route_class=VerifyTokenRoute)

@user_routes.post("/report")
def create_report(report: Report, Authorization: str = Header(None)):
  user_data = verify_token(Authorization)
  if not user_data:
    return JSONResponse(content={"message": "Unexpected token error"}, status_code=400)

  user_id = user_data.get("user_id")
  
  if user_id:
    return reports(user_id, report.report_type_id, report.report_type, report.report_category, report.description, report.report_status)
  else:
    return JSONResponse(content={"message": "Unexpected error"}, status_code=400)


@user_routes.put("/updateProfile")
def update_user_profile(profileUser: ProfileUser, Authorization: str = Header(None)):
  user_data = verify_token(Authorization)
  if not user_data:
    return JSONResponse(content={"message": "Unexpected token error"}, status_code=400)

  user_id = user_data.get("user_id")
  
  if user_id:
    return update_profile(user_id, profileUser.first_name, profileUser.last_name, profileUser.orientation, profileUser.country, profileUser.country_iso, profileUser.city, profileUser.city_iso, profileUser.date_of_birth, profileUser.description, profileUser.foto)
  else:
    return JSONResponse(content={"message": "Unexpected error"}, status_code=400)

@user_routes.get("/getProfile")
def get_user_profile(Authorization: str = Header(None)):
  user_data = verify_token(Authorization)
  if not user_data:
    return JSONResponse(content={"message": "Unexpected token error"}, status_code=400)

  user_id = user_data.get("user_id")
  
  if user_id:
    return get_profile(user_id)
  else:
    return JSONResponse(content={"message": "Unexpected error"}, status_code=400)

@user_routes.get("/getProfiles/{profile_id}")
def get_user_profiles(profile_id: int, Authorization: str = Header(None)):
  user_data = verify_token(Authorization)
  if not user_data:
    return JSONResponse(content={"message": "Unexpected token error"}, status_code=400)

  user_id = user_data.get("user_id")
  
  if user_id:
    return get_matched_user(profile_id)
  else:
    return JSONResponse(content={"message": "Unexpected error"}, status_code=400)

@user_routes.put("/updateNetwork")
def update_user_network(networksUser: NetworksUser, Authorization: str = Header(None)):
  user_data = verify_token(Authorization)
  if not user_data:
    return JSONResponse(content={"message": "Unexpected token error"}, status_code=400)

  user_id = user_data.get("user_id")
  
  if user_id:
    return update_network(user_id, networksUser.instagram, networksUser.snapchat, networksUser.twitter, networksUser.vk, networksUser.discord, networksUser.tiktok, networksUser.twitch, networksUser.bereal)
  else:
    return JSONResponse(content={"message": "Unexpected error"}, status_code=400)

@user_routes.get("/getNetwork")
def get_user_network(Authorization: str = Header(None)):
  user_data = verify_token(Authorization)
  if not user_data:
    return JSONResponse(content={"message": "Unexpected token error"}, status_code=400)

  user_id = user_data.get("user_id")
  
  if user_id:
    return get_network(user_id)
  else:
    return JSONResponse(content={"message": "Unexpected error"}, status_code=400)

@user_routes.get("/getNetworks/{profile_id}")
def get_user_networks(profile_id: int, Authorization: str = Header(None)):
  user_data = verify_token(Authorization)
  if not user_data:
    return JSONResponse(content={"message": "Unexpected token error"}, status_code=400)

  user_id = user_data.get("user_id")
  
  if user_id:
    return get_network(profile_id)
  else:
    return JSONResponse(content={"message": "Unexpected error"}, status_code=400)


@user_routes.get("/getAllChannels")
def get_all_channels(Authorization: str = Header(None)):
  user_data = verify_token(Authorization)
  if not user_data:
    return JSONResponse(content={"message": "Unexpected token error"}, status_code=400)

  user_id = user_data.get("user_id")
  
  if user_id:
    return all_channels(user_id)
  else:
    return JSONResponse(content={"message": "Unexpected error"}, status_code=400)

@user_routes.get("/searchChannels/{name}")
def get_search_channels(name: str, Authorization: str = Header(None)):
  user_data = verify_token(Authorization)
  if not user_data:
    return JSONResponse(content={"message": "Unexpected token error"}, status_code=400)

  user_id = user_data.get("user_id")
  
  if user_id:
    return search_channels(user_id, name)
  else:
    return JSONResponse(content={"message": "Unexpected error"}, status_code=400)

@user_routes.get("/getAllChannelsCountry/{country}")
def get_user_all_channels_country(country: str, Authorization: str = Header(None)):
  user_data = verify_token(Authorization)
  if not user_data:
    return JSONResponse(content={"message": "Unexpected token error"}, status_code=400)

  user_id = user_data.get("user_id")
  
  if user_id:
    return all_channels_country(user_id, country)
  else:
    return JSONResponse(content={"message": "Unexpected error"}, status_code=400)

@user_routes.get("/getAllChannelsCategory/")
def get_user_all_channels_category(categories: List[str] = Query(..., alias="categories"), Authorization: str = Header(None)):
    user_data = verify_token(Authorization)
    if not user_data:
        return JSONResponse(content={"message": "Unexpected token error"}, status_code=400)
    # Verifica si no hay categorías
    if not categories:
        return JSONResponse(content={"message": "No categories provided"}, status_code=200)

    user_id = user_data.get("user_id")
    
    if user_id:
        return all_channels_category(user_id, categories)
    else:
        return JSONResponse(content={"message": "Unexpected error"}, status_code=400)

@user_routes.post("/createChannel")
def create_user_channel(createChannelsUser: CreateChannelsUser, Authorization: str = Header(None)):
  user_data = verify_token(Authorization)
  if not user_data:
    return JSONResponse(content={"message": "Unexpected token error"}, status_code=400)

  user_id = user_data.get("user_id")
  
  if user_id:
    return create_channel(user_id, createChannelsUser.foto, createChannelsUser.name, createChannelsUser.category, createChannelsUser.description, createChannelsUser.country, createChannelsUser.country_iso, createChannelsUser.price, createChannelsUser.link)
  else:
    return JSONResponse(content={"message": "Unexpected error"}, status_code=400)

@user_routes.put("/updateChannel")
def update_user_channel(updateChannelsUser: UpdateChannelsUser, Authorization: str = Header(None)):
  user_data = verify_token(Authorization)
  if not user_data:
    return JSONResponse(content={"message": "Unexpected token error"}, status_code=400)

  user_id = user_data.get("user_id")
  
  if user_id:
    return update_channel(user_id, updateChannelsUser.channel_id, updateChannelsUser.foto, updateChannelsUser.name, updateChannelsUser.category, updateChannelsUser.description, updateChannelsUser.country, updateChannelsUser.country_iso, updateChannelsUser.price, updateChannelsUser.link)
  else:
    return JSONResponse(content={"message": "Unexpected error"}, status_code=400)

@user_routes.get("/getChannel")
def get_user_channel(Authorization: str = Header(None)):
  user_data = verify_token(Authorization)
  if not user_data:
    return JSONResponse(content={"message": "Unexpected token error"}, status_code=400)

  user_id = user_data.get("user_id")
  
  if user_id:
    return get_channel(user_id)
  else:
    return JSONResponse(content={"message": "Unexpected error"}, status_code=400)

@user_routes.delete("/deleteChannel/{channel_id}")
def delete_user_channel(channel_id: int, Authorization: str = Header(None)):
  user_data = verify_token(Authorization)
  if not user_data:
    return JSONResponse(content={"message": "Unexpected token error"}, status_code=400)

  user_id = user_data.get("user_id")

  if user_id:
    return delete_channel(user_id, channel_id)
  else:
    return JSONResponse(content={"message": "Unexpected error"}, status_code=400)

@user_routes.post("/joinChannel")
def join_user_channel(joinChannel: JoinChannel, Authorization: str = Header(None)):
  user_data = verify_token(Authorization)
  if not user_data:
    return JSONResponse(content={"message": "Unexpected token error"}, status_code=400)
	
  user_id = user_data.get("user_id")
  
  if user_id:
    return join_channel(user_id, joinChannel.channel_id, joinChannel.status)
  else:
    return JSONResponse(content={"message": "Unexpected error"}, status_code=400)

@user_routes.get("/getJoinedChannel")
def get_user_joined_channel(Authorization: str = Header(None)):
  user_data = verify_token(Authorization)
  if not user_data:
    return JSONResponse(content={"message": "Unexpected token error"}, status_code=400)

  user_id = user_data.get("user_id")
  
  if user_id:
    return get_joined_channels(user_id)
  else:
    return JSONResponse(content={"message": "Unexpected error"}, status_code=400)

@user_routes.delete("/deleteJoinedChannel/{channel_id}")
def delete_user_joined_channel(channel_id: int, Authorization: str = Header(None)):
  user_data = verify_token(Authorization)
  if not user_data:
    return JSONResponse(content={"message": "Unexpected token error"}, status_code=400)

  user_id = user_data.get("user_id")

  if user_id:
    return delete_joined_channel(user_id, channel_id)
  else:
    return JSONResponse(content={"message": "Unexpected error"}, status_code=400)


@user_routes.get("/getAllGroups")
def get_all_groups(Authorization: str = Header(None)):
    user_data = verify_token(Authorization)
    if not user_data:
      return JSONResponse(content={"message": "Unexpected token error"}, status_code=400)

    user_id = user_data.get("user_id")
    
    if user_id:
      return all_groups(user_id)
    else:
      return JSONResponse(content={"message": "Unexpected error"}, status_code=400)

@user_routes.get("/searchGroups/{name}")
def get_search_groups(name: str, Authorization: str = Header(None)):
  user_data = verify_token(Authorization)
  if not user_data:
    return JSONResponse(content={"message": "Unexpected token error"}, status_code=400)

  user_id = user_data.get("user_id")
  
  if user_id:
    return search_groups(user_id, name)
  else:
    return JSONResponse(content={"message": "Unexpected error"}, status_code=400)

@user_routes.get("/getAllGroupsCountry/{country}")
def get_user_all_groups_country(country: str, Authorization: str = Header(None)):
  user_data = verify_token(Authorization)
  if not user_data:
    return JSONResponse(content={"message": "Unexpected token error"}, status_code=400)

  user_id = user_data.get("user_id")
  
  if user_id:
    return all_groups_country(user_id, country)
  else:
    return JSONResponse(content={"message": "Unexpected error"}, status_code=400)

@user_routes.get("/getAllGroupsCategory/")
def get_user_all_groups_category(categories: List[str] = Query(..., alias="categories"), Authorization: str = Header(None)):
    user_data = verify_token(Authorization)
    if not user_data:
        return JSONResponse(content={"message": "Unexpected token error"}, status_code=400)
    # Verifica si no hay categorías
    if not categories:
        return JSONResponse(content={"message": "No categories provided"}, status_code=200)

    user_id = user_data.get("user_id")
    
    if user_id:
        return all_groups_category(user_id, categories)
    else:
        return JSONResponse(content={"message": "Unexpected error"}, status_code=400)

@user_routes.post("/createGroup")
def create_user_group(createGroupsUser: CreateGroupsUser, Authorization: str = Header(None)):
  user_data = verify_token(Authorization)
  if not user_data:
    return JSONResponse(content={"message": "Unexpected token error"}, status_code=400)

  user_id = user_data.get("user_id")
  
  if user_id:
    return create_group(user_id, createGroupsUser.foto, createGroupsUser.name, createGroupsUser.category, createGroupsUser.description, createGroupsUser.country, createGroupsUser.country_iso, createGroupsUser.price, createGroupsUser.link)
  else:
    return JSONResponse(content={"message": "Unexpected error"}, status_code=400)

@user_routes.put("/updateGroup")
def update_user_group(updateGroupsUser: UpdateGroupsUser, Authorization: str = Header(None)):
  user_data = verify_token(Authorization)
  if not user_data:
    return JSONResponse(content={"message": "Unexpected token error"}, status_code=400)

  user_id = user_data.get("user_id")
  
  if user_id:
    return update_group(user_id, updateGroupsUser.group_id, updateGroupsUser.foto, updateGroupsUser.name, updateGroupsUser.category, updateGroupsUser.description, updateGroupsUser.country, updateGroupsUser.country_iso, updateGroupsUser.price, updateGroupsUser.link)
  else:
    return JSONResponse(content={"message": "Unexpected error"}, status_code=400)

@user_routes.get("/getGroup")
def get_user_group(Authorization: str = Header(None)):
  user_data = verify_token(Authorization)
  if not user_data:
    return JSONResponse(content={"message": "Unexpected token error"}, status_code=400)

  user_id = user_data.get("user_id")
  
  if user_id:
    return get_group(user_id)
  else:
    return JSONResponse(content={"message": "Unexpected error"}, status_code=400)

@user_routes.delete("/deleteGroup/{group_id}")
def delete_user_group(group_id: int, Authorization: str = Header(None)):
  user_data = verify_token(Authorization)
  if not user_data:
    return JSONResponse(content={"message": "Unexpected token error"}, status_code=400)

  user_id = user_data.get("user_id")

  if user_id:
    return delete_group(user_id, group_id)
  else:
    return JSONResponse(content={"message": "Unexpected error"}, status_code=400)

@user_routes.post("/joinGroup")
def join_user_group(joinGroup: JoinGroup, Authorization: str = Header(None)):
  user_data = verify_token(Authorization)
  if not user_data:
    return JSONResponse(content={"message": "Unexpected token error"}, status_code=400)

  user_id = user_data.get("user_id")
  
  if user_id:
    return join_group(user_id, joinGroup.group_id, joinGroup.status)
  else:
    return JSONResponse(content={"message": "Unexpected error"}, status_code=400)

@user_routes.get("/getJoinedGroups")
def get_user_joined_groups(Authorization: str = Header(None)):
  user_data = verify_token(Authorization)
  if not user_data:
    return JSONResponse(content={"message": "Unexpected token error"}, status_code=400)

  user_id = user_data.get("user_id")
  
  if user_id:
    return get_joined_groups(user_id)
  else:
    return JSONResponse(content={"message": "Unexpected error"}, status_code=400)

@user_routes.delete("/deleteJoinedGroup/{group_id}")
def delete_user_joined_group(group_id: int,  Authorization: str = Header(None)):
  user_data = verify_token(Authorization)
  if not user_data:
    return JSONResponse(content={"message": "Unexpected token error"}, status_code=400)

  user_id = user_data.get("user_id")

  if user_id:
    return delete_joined_group(user_id, group_id)
  else:
    return JSONResponse(content={"message": "Unexpected error"}, status_code=400)


@user_routes.get("/getAllUsers")
def get_all_users(Authorization: str = Header(None)):
  user_data = verify_token(Authorization)
  if not user_data:
    return JSONResponse(content={"message": "Unexpected token error"}, status_code=400)

  user_id = user_data.get("user_id")
  
  if user_id:
    return all_users(user_id)
  else:
    return JSONResponse(content={"message": "Unexpected error"}, status_code=400)

@user_routes.get("/getRandomUsers")
def get_random_users(Authorization: str = Header(None)):
  user_data = verify_token(Authorization)
  if not user_data:
    return JSONResponse(content={"message": "Unexpected token error"}, status_code=400)

  user_id = user_data.get("user_id")
  
  if user_id:
    return random_users(user_id)
  else:
    return JSONResponse(content={"message": "Unexpected error"}, status_code=400)

@user_routes.get("/searchUsers/{username}")
def get_search_users(username: str, Authorization: str = Header(None)):
  user_data = verify_token(Authorization)
  if not user_data:
    return JSONResponse(content={"message": "Unexpected token error"}, status_code=400)

  user_id = user_data.get("user_id")
  
  if user_id:
    return search_users(user_id, username)
  else:
    return JSONResponse(content={"message": "Unexpected error"}, status_code=400)

@user_routes.post("/likeUser")
def user_like_user(likeUser: LikeUser, Authorization: str = Header(None)):
  user_data = verify_token(Authorization)
  if not user_data:
    return JSONResponse(content={"message": "Unexpected token error"}, status_code=400)

  user_id = user_data.get("user_id")
  
  if user_id:
    return like_user(user_id, likeUser.liked_profile_id, likeUser.status)
  else:
    return JSONResponse(content={"message": "Unexpected error"}, status_code=400)

@user_routes.get("/getLikedUsers")
def get_user_liked_users(Authorization: str = Header(None)):
  user_data = verify_token(Authorization)
  if not user_data:
    return JSONResponse(content={"message": "Unexpected token error"}, status_code=400)

  user_id = user_data.get("user_id")
  
  if user_id:
    return get_liked_users(user_id)
  else:
    return JSONResponse(content={"message": "Unexpected error"}, status_code=400)

@user_routes.delete("/unlikeUser/{liked_profile_id}")
def user_unlike_user(liked_profile_id: int, Authorization: str = Header(None)):
  user_data = verify_token(Authorization)
  if not user_data:
    return JSONResponse(content={"message": "Unexpected token error"}, status_code=400)

  user_id = user_data.get("user_id")

  if user_id:
    return unlike_user(user_id, liked_profile_id)
  else:
    return JSONResponse(content={"message": "Unexpected error"}, status_code=400)


@user_routes.post("/matchUser")
def user_match_user(matchUser: MatchUser, Authorization: str = Header(None)):
  user_data = verify_token(Authorization)
  if not user_data:
    return JSONResponse(content={"message": "Unexpected token error"}, status_code=400)
	
  user_id = user_data.get("user_id")
  
  if user_id:
    return match_user(user_id, matchUser.match_profile_id, matchUser.status)
  else:
    return JSONResponse(content={"message": "Unexpected error"}, status_code=400)

@user_routes.get("/getMatchedUsers")
def get_user_matched_users(Authorization: str = Header(None)):
  user_data = verify_token(Authorization)
  if not user_data:
    return JSONResponse(content={"message": "Unexpected token error"}, status_code=400)

  user_id = user_data.get("user_id")
  
  if user_id:
    return get_matched_users(user_id)
  else:
    return JSONResponse(content={"message": "Unexpected error"}, status_code=400)

@user_routes.delete("/unmatchUser/{match_profile_id}")
def user_unmatch_user(match_profile_id: int, Authorization: str = Header(None)):
  user_data = verify_token(Authorization)
  if not user_data:
    return JSONResponse(content={"message": "Unexpected token error"}, status_code=400)

  user_id = user_data.get("user_id")

  if user_id:
    return unmatch_user(user_id, match_profile_id)
  else:
    return JSONResponse(content={"message": "Unexpected error"}, status_code=400)


def verify_token(Authorization):
  token = Authorization.split(" ")[1]
  return validate_token(token, output=True)
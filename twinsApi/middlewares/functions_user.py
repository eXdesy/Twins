import sqlite3
import random
from fastapi.responses import JSONResponse
from datetime import datetime, timedelta

from database.database import connect_db
from database.model import *
from middlewares.functions_jwt import is_valid_url, calculate_age


def reports(user_id, report_type_id, report_type, report_category, description, report_status):
  # Check if any required data is null or empty
  if any(field is None for field in [report_type_id, report_type, report_category, report_status]) or any(field == "" for field in [report_type_id, report_type, report_category, report_status]):
      return JSONResponse(content={"message": "All fields are required and cannot be null or empty"}, status_code=400)
  # Connecting to opened database connection
  conn = connect_db()
  cursor = conn.cursor()
  try:
    # Insert a new channel into the channels table
    cursor.execute('''
      INSERT INTO report (user_id, report_type_id, report_type, report_category, description, report_status) 
      VALUES (?, ?, ?, ?, ?, ?)
    ''', (user_id, report_type_id, report_type, report_category, description, report_status))
    conn.commit()
    return JSONResponse(content={"message": "Report successfully successfully! Thanks for help us!"}, status_code=200)
  except sqlite3.Error as e:
      # Handle general database errors
      return JSONResponse(content={"message": "Database error", "details": str(e)}, status_code=500)

def update_profile(user_id, first_name, last_name, orientation, country, country_iso, city, city_iso, date_of_birth, description, foto):
  # Connecting to opened database connection
  conn = connect_db()
  cursor = conn.cursor()
  # Parcing data
  profile_data = (first_name, last_name, orientation, country, country_iso, city, city_iso, date_of_birth, description, foto, user_id)
  try:
    # Executing SQL Command
    cursor.execute('''
      UPDATE profile 
      SET first_name=?, last_name=?, orientation=?, country=?, country_iso=?, city=?, city_iso=?, date_of_birth=?, description=?, foto=?
      WHERE profile_id = ?
    ''', profile_data)
    # Committing Changes
    conn.commit()
    return JSONResponse(content={"message": "Profile updated successfully"}, status_code=200)
  except sqlite3.IntegrityError as e:
    return JSONResponse(content={"message": "Integrity error", "details": str(e)}, status_code=400)
  except sqlite3.Error as e:
    return JSONResponse(content={"message": "Database error", "details": str(e)}, status_code=500)

def get_profile(user_id):
  # Connecting to opened database connection
  conn = connect_db()
  cursor = conn.cursor()
  try:
    # Execute the query to select the profile based on user_id
    cursor.execute('''
      SELECT profile.*, user.username 
      FROM profile 
      JOIN user ON profile.profile_id = user.user_id 
      WHERE profile.profile_id = ?
    ''', (user_id,))
    profile = cursor.fetchone()
    # Check if profile is found
    if profile:
      profile_list = {
        'profile_id': profile[0],
        'first_name': profile[2],
        'last_name': profile[3],
        'orientation': profile[4],
        'country_iso': profile[5],
        'country': profile[6],
        'city': profile[7],
        'city_iso': profile[8],
        'date_of_birth': profile[9],
        'description': profile[10],
        'foto': profile[11],
        'username': profile[12]
      }
      return JSONResponse(content=profile_list, status_code=200)
    else:
      # Return a JSON response if profile is not found
      return JSONResponse(content={"message": "Profile not found"}, status_code=400)
  except sqlite3.IntegrityError as e:
    # Handle IntegrityError and return a JSON response with details
    return JSONResponse(content={"message": "Integrity error", "details": str(e)}, status_code=400)
  except sqlite3.Error as e:
    # Handle general SQLite errors and return a JSON response with details
    return JSONResponse(content={"message": "Database error", "details": str(e)}, status_code=500)

def update_network(user_id, instagram, snapchat, twitter, vk, discord, tiktok, twitch, bereal):
  # Validate links
  if (instagram):
    if not is_valid_url(instagram):
      return JSONResponse(content={"message": "Invalid Instagram URL format"}, status_code=400)
  if (snapchat):
    if not is_valid_url(snapchat):
      return JSONResponse(content={"message": "Invalid Snapchat URL format"}, status_code=400)
  if (twitter):
    if not is_valid_url(twitter):
      return JSONResponse(content={"message": "Invalid Twitter URL format"}, status_code=400)
  if (vk):
    if not is_valid_url(vk):
      return JSONResponse(content={"message": "Invalid VK URL format"}, status_code=400)
  if (tiktok):
    if not is_valid_url(tiktok):
      return JSONResponse(content={"message": "Invalid TikTok URL format"}, status_code=400)
  if (twitch):
    if not is_valid_url(twitch):
      return JSONResponse(content={"message": "Invalid Twitch URL format"}, status_code=400)
  if (bereal):
    if not is_valid_url(bereal):
      return JSONResponse(content={"message": "Invalid bereal URL format"}, status_code=400)
  # Connecting to opened database connection
  conn = connect_db()
  cursor = conn.cursor()
  # Prepare the data to be updated
  networks_data = (instagram, snapchat, twitter, vk, discord, tiktok, twitch, bereal, user_id)
  try:
    # Execute the SQL command to update the networks data
    cursor.execute('''
      UPDATE networks 
      SET instagram=?, snapchat=?, twitter=?, vk=?, discord=?, tiktok=?, twitch=?, bereal=? 
      WHERE profile_id=?
    ''', networks_data)
    conn.commit()
    # Return a successful JSON response
    return JSONResponse(content={"message": "Networks updated successfully"}, status_code=200)
  except sqlite3.IntegrityError as e:
    # Handle integrity errors (e.g., constraint violations)
    return JSONResponse(content={"message": "Integrity error", "details": str(e)}, status_code=400)
  except sqlite3.Error as e:
    # Handle generic database errors
    return JSONResponse(content={"message": "Database error", "details": str(e)}, status_code=500)

def get_network(profile_id):
  # Connecting to opened database connection
  conn = connect_db()
  cursor = conn.cursor()
  try:
    # Query to select the network information for the given user_id
    cursor.execute('''
      SELECT * FROM networks WHERE profile_id = ?
    ''', (profile_id,))
    network = cursor.fetchone()
    # If network information is found, construct a dictionary to return
    if network:
      network_list = {
        'profile_id': network[1],
        'instagram': network[2],
        'snapchat': network[3],
        'twitter': network[4],
        'vk': network[5],
        'discord': network[6],
        'tiktok': network[7],
        'twitch': network[8],
        'bereal': network[9]
      }
      return JSONResponse(content=network_list, status_code=200)
    else:
      # If no network information is found, return a JSON response indicating the issue
      return JSONResponse(content={"message": "No network information found for the user"}, status_code=400)
  except sqlite3.IntegrityError as e:
    # Handle integrity errors and return a JSON response with the error details
    return JSONResponse(content={"message": "Integrity error", "details": str(e)}, status_code=400)
  except sqlite3.Error as e:
    # Handle generic database errors and return a JSON response with the error details
    return JSONResponse(content={"message": "Database error", "details": str(e)}, status_code=500)


def all_channels(user_id):
  # Connect to the database
  conn = connect_db()
  cursor = conn.cursor()
  try:
    # Get all channels except those belonging to the user_id
    cursor.execute('SELECT * FROM channels WHERE user_id != ?', (user_id,))
    all_channels = cursor.fetchall()
    # Get channels followed by the user_id
    cursor.execute('SELECT channel_id FROM joined_channels WHERE user_id = ?', (user_id,))
    joined_channels = cursor.fetchall()
    # Filter channels to remove those already followed by the user_id
    joined_channels_ids = {channel[0] for channel in joined_channels}
    filtered_channels = [channel for channel in all_channels if channel[0] not in joined_channels_ids]
    # Convert the result into a list of dictionaries
    channels_list = [
      {
        'channel_id': channel[0],
        'user_id': channel[1],
        'foto': channel[2],
        'name': channel[3],
        'category': channel[4],
        'description': channel[5],
        'country': channel[6],
        'country_iso': channel[7],
        'price': channel[8],
        'link': channel[9]
      }
      for channel in filtered_channels
    ]
    # Return the filtered channels
    return JSONResponse(content={"channels": channels_list}, status_code=200)
  except sqlite3.Error as e:
    # Handle database errors
    return JSONResponse(content={"message": "Error retrieving channels", "details": str(e)}, status_code=500)

def search_channels(user_id, channel_name):
  conn = connect_db()
  cursor = conn.cursor()
  try:
    # Buscar canales que coincidan con el nombre proporcionado
    cursor.execute('SELECT * FROM channels WHERE name LIKE ? AND user_id != ?', (channel_name + '%', user_id))
    channels = cursor.fetchall()
    if not channels:
        return JSONResponse(content={"message": "No channels found with the given name"}, status_code=400)
    # Convertir los resultados en una lista de diccionarios
    channels_list = [
      {
        "channel_id": channel[0],
        "foto": channel[2],
        "name": channel[3],
        "category": channel[4],
        "description": channel[5],
        "country": channel[6],
        'country_iso': channel[7],
        'price': channel[8],
        'link': channel[9]
      }
      for channel in channels
    ]
    return JSONResponse(content={"channels": channels_list}, status_code=200)
  except sqlite3.Error as e:
    return JSONResponse(content={"message": "Error searching channels", "details": str(e)}, status_code=500)

def all_channels_country(user_id, country):
  # Connect to the database
  conn = connect_db()
  cursor = conn.cursor()
  try:
    # Get all channels except those belonging to the user_id
    cursor.execute('SELECT * FROM channels WHERE user_id != ? AND country = ?', (user_id, country,))
    all_channels = cursor.fetchall()
    # Get channels followed by the user_id
    cursor.execute('SELECT channel_id FROM joined_channels WHERE user_id = ?', (user_id,))
    joined_channels = cursor.fetchall()
    # Filter channels to remove those already followed by the user_id
    joined_channels_ids = {channel[0] for channel in joined_channels}
    filtered_channels = [channel for channel in all_channels if channel[0] not in joined_channels_ids]
    # Convert the result into a list of dictionaries
    channels_list = [
      {
        'channel_id': channel[0],
        'user_id': channel[1],
        'foto': channel[2],
        'name': channel[3],
        'category': channel[4],
        'description': channel[5],
        'country': channel[6],
        'country_iso': channel[7],
        'price': channel[8],
        'link': channel[9]
      }
      for channel in filtered_channels
    ]
    # Return the filtered channels
    return JSONResponse(content={"channels": channels_list}, status_code=200)
  except sqlite3.Error as e:
    # Handle database errors
    return JSONResponse(content={"message": "Error retrieving channels", "details": str(e)}, status_code=500)

def all_channels_category(user_id, categories):
    # Connect to the database
    conn = connect_db()
    cursor = conn.cursor()
    try:
        # Get all channels except those belonging to the user_id and filter by categories
        placeholders = ','.join(['?' for _ in categories])
        cursor.execute('SELECT * FROM channels WHERE user_id != ? AND category IN ({})'.format(placeholders), (user_id,) + tuple(categories))
        all_channels = cursor.fetchall()
        # Get channels followed by the user_id
        cursor.execute('SELECT channel_id FROM joined_channels WHERE user_id = ?', (user_id,))
        joined_channels = cursor.fetchall()
        # Filter channels to remove those already followed by the user_id
        joined_channels_ids = {channel[0] for channel in joined_channels}
        filtered_channels = [channel for channel in all_channels if channel[0] not in joined_channels_ids]
        # Check if there are no channels
        if not filtered_channels:
          return JSONResponse(content={"message": "No channels found for the given categories"}, status_code=200)
				# Convert the result into a list of dictionaries
        channels_list = [
            {
							'channel_id': channel[0],
							'user_id': channel[1],
							'foto': channel[2],
							'name': channel[3],
							'category': channel[4],
							'description': channel[5],
							'country': channel[6],
							'country_iso': channel[7],
							'price': channel[8],
							'link': channel[9]
            }
            for channel in filtered_channels
        ]
        # Return the filtered channels
        return JSONResponse(content={"channels": channels_list}, status_code=200)
    except sqlite3.Error as e:
        # Handle database errors
        return JSONResponse(content={"message": "Error retrieving channels", "details": str(e)}, status_code=500)

def create_channel(user_id, foto, name, category, description, country, country_iso, price, link):
  # Check if any required data is null or empty
  if any(field is None for field in [foto, name, category, description, country, country_iso, price, link]) or any(field == "" for field in [foto, name, category, description, country, link]):
      return JSONResponse(content={"message": "All fields are required and cannot be null or empty"}, status_code=400)
  # Validate URL format
  if not is_valid_url(link):
      return JSONResponse(content={"message": "Invalid URL format"}, status_code=400)
  # Connecting to opened database connection
  conn = connect_db()
  cursor = conn.cursor()
  try:
    # Check if the user already has 5 channels created
    cursor.execute('SELECT COUNT(*) FROM channels WHERE user_id = ?', (user_id,))
    channel_count = cursor.fetchone()[0]
    # If the user has 5 or more channels, return an error message
    if channel_count >= 5:
      return JSONResponse(content={"message": "Cannot create more than 5 channels"}, status_code=400)
    # Insert a new channel into the channels table
    cursor.execute('''
      INSERT INTO channels (user_id, foto, name, category, description, country, country_iso, price, link) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', (user_id, foto, name, category, description, country, country_iso, price, link))
    conn.commit()
    return JSONResponse(content={"message": "Channel created successfully"}, status_code=201)
  except sqlite3.IntegrityError as e:
      # Handle IntegrityError, such as when trying to insert a duplicate entry
      return JSONResponse(content={"message": "Error creating channel", "details": str(e)}, status_code=400)
  except sqlite3.Error as e:
      # Handle general database errors
      return JSONResponse(content={"message": "Database error", "details": str(e)}, status_code=500)

def update_channel(user_id, channel_id, foto, name, category, description, country, country_iso, price, link):
  # Check if any required data is null or empty
  if any(field is None for field in [channel_id, foto, name, category, description, country, country_iso, price, link]) or any(field == "" for field in [channel_id, foto, name, category, description, country, price, link]):
      return JSONResponse(content={"message": "All fields are required and cannot be null or empty"}, status_code=400)
  # Validate URL format
  if not is_valid_url(link):
      return JSONResponse(content={"message": "Invalid URL format"}, status_code=400)
  # Connecting to the open database connection
  conn = connect_db()
  cursor = conn.cursor()
  try:
    # Check if the channel belongs to the user
    cursor.execute('SELECT channel_id FROM channels WHERE channel_id = ? AND user_id = ?', (channel_id, user_id))
    channel = cursor.fetchone()
    # If the channel is not found or doesn't belong to the user, return 400
    if not channel:
      return JSONResponse(content={"message": "Channel not found or does not belong to the user"}, status_code=400)
    # Update the channel in the channels table
    cursor.execute('''
      UPDATE channels 
      SET foto = ?, name = ?, category = ?, description = ?, country = ?, country_iso = ?, price = ?, link = ? 
      WHERE channel_id = ? AND user_id = ?
    ''', (foto, name, category, description, country, country_iso, price, link, channel_id, user_id))
    conn.commit()
    # Return success message
    return JSONResponse(content={"message": "Channel updated successfully"}, status_code=200)
  except sqlite3.IntegrityError as e:
    # Handle integrity error
    return JSONResponse(content={"message": "Error updating channel", "details": str(e)}, status_code=500)

def get_channel(user_id):
  # Connecting to opened database connection
  conn = connect_db()
  cursor = conn.cursor()
  try:
    # Execute SQL query to fetch channels for given user_id
    cursor.execute('SELECT * FROM channels WHERE user_id = ?', (user_id,))
    channels = cursor.fetchall()
    # Convert the result into a list of dictionaries
    channel_list = [
      {
        "channel_id": channel[0],
        "foto": channel[2],
        "name": channel[3],
        "category": channel[4],
        "description": channel[5],
        "country": channel[6],
        'country_iso': channel[7],
        'price': channel[8],
        'link': channel[9]
      }
      for channel in channels
    ]
    # Return the list of channels as JSON response with status code 200
    return JSONResponse(content={"channels": channel_list}, status_code=200)
  except sqlite3.Error as e:
    # Return error message and details in case of database error
    return JSONResponse(content={"message": "Error retrieving channels", "details": str(e)}, status_code=500)

def delete_channel(user_id, channel_id):
  # Connect to the database
  conn = connect_db()
  cursor = conn.cursor()
  try:
    # Check if the channel exists in the user table
    cursor.execute('SELECT 1 FROM channels WHERE user_id = ?', (user_id,))
    channel_exists = cursor.fetchone()
    if not channel_exists:
      return JSONResponse(content={"message": "The channel that you are trying to delete does not exist"}, status_code=400)
    # Delete entries where user_id liked channel_id and vice versa
    cursor.execute('DELETE FROM channels WHERE user_id = ? AND channel_id = ?', (user_id, channel_id))
    # Commit changes to the database
    conn.commit()
    # Return success response
    return JSONResponse(content={"message": "Successfully deleted the channel"}, status_code=200)
  except sqlite3.Error as e:
    # If any error occurs during database operation, return error response
    return JSONResponse(content={"message": "Error deleting the channel", "details": str(e)}, status_code=500)

def join_channel(user_id, channel_id, status):
  # Connect to the opened database connection
  conn = connect_db()
  cursor = conn.cursor()
  try:
    # Check if the channel exists
    cursor.execute('SELECT * FROM channels WHERE channel_id = ?', (channel_id,))
    channel_exists = cursor.fetchone()
    # If the channel does not exist, return a 400 error
    if not channel_exists:
      return JSONResponse(content={"message": "Channel does not exist"}, status_code=400)
    # Check if the user has already joined the channel
    cursor.execute('SELECT * FROM joined_channels WHERE user_id = ? AND channel_id = ?', (user_id, channel_id))
    existing_join = cursor.fetchone()
    # If the user has already joined the channel, return a 200 message indicating this
    if existing_join:
      return JSONResponse(content={"message": "User already joined this channel"}, status_code=200)
    # Insert the relation into the joined_channels table
    cursor.execute('INSERT INTO joined_channels (user_id, channel_id, channel_status) VALUES (?, ?, ?)', (user_id, channel_id, status))
    conn.commit()
    # Return a success message
    return JSONResponse(content={"message": "User joined channel successfully"}, status_code=200)
  # Handle integrity errors (e.g., unique constraint violations)
  except sqlite3.IntegrityError as e:
    return JSONResponse(content={"message": "Integrity error", "details": str(e)}, status_code=400)
  except sqlite3.OperationalError as e:
    return JSONResponse(content={"message": "Operational error", "details": str(e)}, status_code=500)
  except sqlite3.Error as e:
    return JSONResponse(content={"message": "Error joining channel", "details": str(e)}, status_code=500)

def get_joined_channels(user_id):
  # Connect to the database
  conn = connect_db()
  cursor = conn.cursor()
  try:
    # Execute the SQL query to get channel IDs joined by the user
    cursor.execute('SELECT channel_id FROM joined_channels WHERE user_id = ? AND channel_status = ?', (user_id, True))
    joined_channels_id = cursor.fetchall()
    # Check if any channels were found
    if joined_channels_id:
      # Extract channel IDs into a list
      channels_id = [channel[0] for channel in joined_channels_id]
      # Create a placeholder string for the IN clause
      placeholders = ', '.join(['?'] * len(channels_id))
      # Execute the query to get the channels info
      cursor.execute(f'SELECT * FROM channels WHERE channel_id IN ({placeholders})', channels_id)
      joined_channels = cursor.fetchall()
      # Convert the result into a list of dictionaries
      joined_channels_list = [
        {
          "channel_id": channel[0],
          "foto": channel[2],
          "name": channel[3],
          "category": channel[4],
          "description": channel[5],
          "country": channel[6],
					'country_iso': channel[7],
					'price': channel[8],
					'link': channel[9]
        }
        for channel in joined_channels
      ]
      return JSONResponse(content={"joined_channels": joined_channels_list}, status_code=200)
    else:
      # Return a 400 response if no channels were found
      return JSONResponse(content={"message": "No joined channels found"}, status_code=201)
  # Handle database errors
  except sqlite3.Error as e:
    return JSONResponse(content={"message": "Error fetching joined channels", "details": str(e)}, status_code=500)

def delete_joined_channel(user_id, channel_id):
  # Connect to the database
  conn = connect_db()
  cursor = conn.cursor()
  try:
    # Check if the channel exists in the joined_channels table
    cursor.execute('SELECT 1 FROM joined_channels WHERE user_id = ?', (user_id,))
    channel_exists = cursor.fetchone()
    if not channel_exists:
      return JSONResponse(content={"message": "You didnt joined to this channel"}, status_code=400)
    # Delete entries where user_id liked channel_id and vice versa
    cursor.execute('DELETE FROM joined_channels WHERE user_id = ? AND channel_id = ?', (user_id, channel_id))
    # Commit changes to the database
    conn.commit()
    # Return success response
    return JSONResponse(content={"message": "The channel was uccessfully deleted from saves"}, status_code=200)
  except sqlite3.Error as e:
    # If any error occurs during database operation, return error response
    return JSONResponse(content={"message": "Error deleting the channel from saves", "details": str(e)}, status_code=500)


def all_groups(user_id):
  # Connect to the database
  conn = connect_db()
  cursor = conn.cursor()
  try:
    # Get all groups except those belonging to the user_id
    cursor.execute('SELECT * FROM groups WHERE user_id != ?', (user_id,))
    all_groups = cursor.fetchall()
    # Get groups followed by user_id
    cursor.execute('SELECT group_id FROM joined_groups WHERE user_id = ?', (user_id,))
    joined_groups = cursor.fetchall()
    # Filter groups to remove those already followed by user_id
    joined_groups_ids = {group[0] for group in joined_groups}
    filtered_groups = [group for group in all_groups if group[0] not in joined_groups_ids]
    # Convert the result into a list of dictionaries
    groups_list = [
      {
        'group_id': group[0],
        'user_id': group[1],
        'foto': group[2],
        'name': group[3],
        'category': group[4],
        'description': group[5],
        'country': group[6],
        'country_iso': group[7],
        'price': group[8],
        'link': group[9]
      }
      for group in filtered_groups
    ]
    #  Return response
    return JSONResponse(content={"groups": groups_list}, status_code=200)
  except sqlite3.Error as e:
    # Handle database errors
    return JSONResponse(content={"message": "Error retrieving groups", "details": str(e)}, status_code=500)

def search_groups(user_id, group_name):
  conn = connect_db()
  cursor = conn.cursor()
  try:
    # Buscar grupos que coincidan con el nombre proporcionado
    cursor.execute('SELECT * FROM groups WHERE name LIKE ? AND user_id != ?', (group_name + '%', user_id))
    groups = cursor.fetchall()
    if not groups:
        return JSONResponse(content={"message": "No groups found with the given name"}, status_code=400)
    # Convertir los resultados en una lista de diccionarios
    groups_list = [
      {
        "group_id": group[0],
        "foto": group[2],
        "name": group[3],
        "category": group[4],
        "description": group[5],
        "country": group[6],
        'country_iso': group[7],
        'price': group[8],
        'link': group[9]
      }
      for group in groups
    ]
    return JSONResponse(content={"groups": groups_list}, status_code=200)
  except sqlite3.Error as e:
    return JSONResponse(content={"message": "Error searching groups", "details": str(e)}, status_code=500)

def all_groups_country(user_id, country):
  # Connect to the database
  conn = connect_db()
  cursor = conn.cursor()
  try:
    # Get all groups except those belonging to the user_id
    cursor.execute('SELECT * FROM groups WHERE user_id != ? AND country = ?', (user_id, country,))
    all_groups = cursor.fetchall()
    # Get groups followed by the user_id
    cursor.execute('SELECT group_id FROM joined_groups WHERE user_id = ?', (user_id,))
    joined_groups = cursor.fetchall()
    # Filter groups to remove those already followed by the user_id
    joined_groups_ids = {group[0] for group in joined_groups}
    filtered_groups = [group for group in all_groups if group[0] not in joined_groups_ids]
    # Convert the result into a list of dictionaries
    groups_list = [
      {
        'channel_id': group[0],
        'user_id': group[1],
        'foto': group[2],
        'name': group[3],
        'category': group[4],
        'description': group[5],
        'country': group[6],
        'country_iso': group[7],
        'price': group[8],
        'link': group[9]
      }
      for group in filtered_groups
    ]
    # Return the filtered groups
    return JSONResponse(content={"groups": groups_list}, status_code=200)
  except sqlite3.Error as e:
    # Handle database errors
    return JSONResponse(content={"message": "Error retrieving groups", "details": str(e)}, status_code=500)

def all_groups_category(user_id, categories):
    # Connect to the database
    conn = connect_db()
    cursor = conn.cursor()
    try:
        # Get all groups except those belonging to the user_id and filter by categories
        placeholders = ','.join(['?' for _ in categories])
        cursor.execute('SELECT * FROM groups WHERE user_id != ? AND category IN ({})'.format(placeholders), (user_id,) + tuple(categories))
        all_groups = cursor.fetchall()
        # Get groups followed by the user_id
        cursor.execute('SELECT group_id FROM joined_groups WHERE user_id = ?', (user_id,))
        joined_groups = cursor.fetchall()
        # Filter groups to remove those already followed by the user_id
        joined_groups_ids = {group[0] for group in joined_groups}
        filtered_groups = [group for group in all_groups if group[0] not in joined_groups_ids]
        # Check if there are no groups
        if not filtered_groups:
          return JSONResponse(content={"message": "No groups found for the given categories"}, status_code=200)
				# Convert the result into a list of dictionaries
        groups_list = [
            {
              'channel_id': group[0],
              'user_id': group[1],
              'foto': group[2],
              'name': group[3],
              'category': group[4],
              'description': group[5],
              'country': group[6],
							'country_iso': group[7],
							'price': group[8],
							'link': group[9]
            }
            for group in filtered_groups
        ]
        # Return the filtered groups
        return JSONResponse(content={"groups": groups_list}, status_code=200)
    except sqlite3.Error as e:
        # Handle database errors
        return JSONResponse(content={"message": "Error retrieving groups", "details": str(e)}, status_code=500)

def create_group(user_id, foto, name, category, description, country, country_iso, price, link):
  # Check if any required data is null or empty
  if any(field is None for field in [foto, name, category, description, country, country_iso, price, link]) or any(field == "" for field in [foto, name, category, description, country, price, link]):
      return JSONResponse(content={"message": "All fields are required and cannot be null or empty"}, status_code=400)
  # Validate URL format
  if not is_valid_url(link):
      return JSONResponse(content={"message": "Invalid URL format"}, status_code=400)
  # Connecting to the open database connection
  conn = connect_db()
  cursor = conn.cursor()
  try:
    # Check if the user already has 5 groups created
    cursor.execute('SELECT COUNT(*) FROM groups WHERE user_id = ?', (user_id,))
    group_count = cursor.fetchone()[0]
    # Return a JSON response with an error message if the user has already created 5 groups
    if group_count >= 5:
      return JSONResponse(content={"message": "Cannot create more than 5 groups"}, status_code=400)
    # Insert a new group into the groups table
    cursor.execute('''
      INSERT INTO groups (user_id, foto, name, category, description, country, country_iso, price, link) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', (user_id, foto, name, category, description, country, country_iso, price, link))
    conn.commit()
    # Return a JSON response with a success message if the group is created successfully
    return JSONResponse(content={"message": "Group created successfully"}, status_code=201)
  except sqlite3.IntegrityError as e:
    # Return a JSON response with an error message if there is an integrity error
    return JSONResponse(content={"message": "Error creating group", "details": str(e)}, status_code=500)

def update_group(user_id, group_id, foto, name, category, description, country, country_iso, price, link):
  # Check if any required data is null or empty
  if any(field is None for field in [group_id, foto, name, category, description, country, country_iso, price, link]) or any(field == "" for field in [group_id, foto, name, category, description, country, price, link]):
      return JSONResponse(content={"message": "All fields are required and cannot be null or empty"}, status_code=400)
  # Validate URL format
  if not is_valid_url(link):
      return JSONResponse(content={"message": "Invalid URL format"}, status_code=400)
  # Connecting to the open database connection
  conn = connect_db()
  cursor = conn.cursor()
  try:
    # Check if the group belongs to the user
    cursor.execute('SELECT group_id FROM groups WHERE group_id = ? AND user_id = ?', (group_id, user_id))
    group = cursor.fetchone()
    # If the group is not found or doesn't belong to the user, return 400
    if not group:
        return JSONResponse(content={"message": "Group not found or does not belong to the user"}, status_code=400)
    # Update the group in the groups table
    cursor.execute('''
      UPDATE groups 
      SET foto = ?, name = ?, category = ?, description = ?, country = ?, country_iso = ?, price = ?, link = ? 
      WHERE group_id = ? AND user_id = ?
    ''', (foto, name, category, description, country, country_iso, price, link, group_id, user_id))
    conn.commit()
    return JSONResponse(content={"message": "Group updated successfully"}, status_code=200)
  except sqlite3.IntegrityError as e:
    # Return an error response if there's an integrity error
    return JSONResponse(content={"message": "Error updating group", "details": str(e)}, status_code=500)

def get_group(user_id):
  # Connecting to opened database connection
  conn = connect_db()
  cursor = conn.cursor()
  try:
    # Retrieve groups associated with the user_id
    cursor.execute('SELECT * FROM groups WHERE user_id = ?', (user_id,))
    groups = cursor.fetchall()
    # Convert the result into a list of dictionaries
    group_list = [
      {
        "group_id": group[0],
        "foto": group[2],
        "name": group[3],
        "category": group[4],
        "description": group[5],
        "country": group[6],
        'country_iso': group[7],
        'price': group[8],
        'link': group[9]
      }
      for group in groups
    ]
    # Return the list of groups as JSON response with status code 200
    return JSONResponse(content={"groups": group_list}, status_code=200)
  except sqlite3.Error as e:
    return JSONResponse(content={"message": "Error retrieving groups", "details": str(e)}, status_code=500)

def delete_group(user_id, group_id):
  # Connect to the database
  conn = connect_db()
  cursor = conn.cursor()
  try:
    # Check if the group exists in the user table
    cursor.execute('SELECT 1 FROM groups WHERE user_id = ?', (user_id,))
    channel_exists = cursor.fetchone()
    if not channel_exists:
      return JSONResponse(content={"message": "The group that you are trying to delete does not exist"}, status_code=400)
    # Delete entries where user_id liked group_id and vice versa
    cursor.execute('DELETE FROM groups WHERE user_id = ? AND group_id = ?', (user_id, group_id))
    # Commit changes to the database
    conn.commit()
    # Return success response
    return JSONResponse(content={"message": "Successfully deleted the group"}, status_code=200)
  except sqlite3.Error as e:
    # If any error occurs during database operation, return error response
    return JSONResponse(content={"message": "Error deleting the group", "details": str(e)}, status_code=500)

def join_group(user_id, group_id, status):
  # Connecting to opened database connection
  conn = connect_db()
  cursor = conn.cursor()
  try:
    # Verify if the group exists
    cursor.execute('SELECT * FROM groups WHERE group_id = ?', (group_id,))
    group_exists = cursor.fetchone()
    if not group_exists:
        return JSONResponse(content={"message": "Group does not exist"}, status_code=400)
    # Verify if the user has already joined the group
    cursor.execute('SELECT * FROM joined_groups WHERE user_id = ? AND group_id = ?', (user_id, group_id))
    existing_join = cursor.fetchone()
    if existing_join:
        return JSONResponse(content={"message": "User already joined this group"}, status_code=200)
    # Insert the relation into the joined_groups table
    cursor.execute('INSERT INTO joined_groups (user_id, group_id, group_status) VALUES (?, ?, ?)', (user_id, group_id, status))
    conn.commit()
    # Return a success message
    return JSONResponse(content={"message": "User joined group successfully"}, status_code=200)
  # Handle general database errors
  except sqlite3.IntegrityError as e:
    return JSONResponse(content={"message": "Integrity error", "details": str(e)}, status_code=400)
  except sqlite3.OperationalError as e:
    return JSONResponse(content={"message": "Operational error", "details": str(e)}, status_code=500)
  except sqlite3.Error as e:
    return JSONResponse(content={"message": "Database error", "details": str(e)}, status_code=500)

def get_joined_groups(user_id):
  # Establish a connection to the database
  conn = connect_db()
  cursor = conn.cursor()
  try:
    # Execute SQL query to select group_id based on user_id
    cursor.execute('SELECT group_id FROM joined_groups WHERE user_id = ? AND group_status = ?', (user_id, True))
    joined_groups_id = cursor.fetchall()
    # If joined groups are found
    if joined_groups_id:
      # Extract group_ids into a list
      groups_id = [group[0] for group in joined_groups_id]
      # Create a placeholder string for the IN clause
      placeholders = ', '.join(['?'] * len(groups_id))
      # Execute the query to get the groups info
      cursor.execute(f'SELECT * FROM groups WHERE group_id IN ({placeholders})', groups_id)
      joined_groups = cursor.fetchall()
      # Convert the result into a list of dictionaries
      joined_groups_list = [
        {
          "group_id": group[0],
          "foto": group[2],
          "name": group[3],
          "category": group[4],
          "description": group[5],
          "country": group[6],
					'country_iso': group[7],
					'price': group[8],
					'link': group[9]
        }
        for group in joined_groups
      ]
      # Return the list of joined groups with a 200 status code
      return JSONResponse(content={"joined_groups": joined_groups_list}, status_code=200)
    else:
      # If no joined groups are found, return a 400 status code
      return JSONResponse(content={"message": "No joined groups found"}, status_code=201)
  # Handle database errors and return a 500 status code along with details of the error
  except sqlite3.Error as e:
    return JSONResponse(content={"message": "Error fetching joined groups", "details": str(e)}, status_code=500)

def delete_joined_group(user_id, group_id):
  # Connect to the database
  conn = connect_db()
  cursor = conn.cursor()
  try:
    # Check if the group exists in the joined_groups table
    cursor.execute('SELECT 1 FROM joined_groups WHERE user_id = ?', (user_id,))
    channel_exists = cursor.fetchone()
    if not channel_exists:
      return JSONResponse(content={"message": "You didnt joined to this group"}, status_code=400)
    # Delete entries where user_id liked group_id and vice versa
    cursor.execute('DELETE FROM joined_groups WHERE user_id = ? AND group_id = ?', (user_id, group_id))
    # Commit changes to the database
    conn.commit()
    # Return success response
    return JSONResponse(content={"message": "The group was uccessfully deleted from saves"}, status_code=200)
  except sqlite3.Error as e:
    # If any error occurs during database operation, return error response
    return JSONResponse(content={"message": "Error deleting the group from saves", "details": str(e)}, status_code=500)


def all_users(user_id):
  # Connect to the database
  conn = connect_db()
  cursor = conn.cursor()
  try:
    # Check if the user's profile is complete
    cursor.execute('SELECT * FROM profile WHERE profile_id = ?', (user_id,))
    user_profile = cursor.fetchone()
    # Check if any of the required fields are None or empty
    required_fields = [user_profile[2], user_profile[3], user_profile[4], user_profile[5], user_profile[6], user_profile[7], user_profile[9]]
    if any(field is None or field == '' for field in required_fields):
      return JSONResponse(content={"message": "Complete your profile to see other users"}, status_code=201)
    # Get all users except the specified profile_id
    cursor.execute('SELECT * FROM profile WHERE profile_id != ?', (user_id,))
    all_users = cursor.fetchall()
    # Filter out users with incomplete profiles
    complete_users = [
      user for user in all_users 
      if all(user[2:8] + (user[9],))  # Check required fields are not None or empty
    ]
    # Get users who have match_status true with profile_id
    cursor.execute('SELECT match_profile_id FROM match WHERE profile_id = ?', (user_id,))
    matched_users = cursor.fetchall()
    # Filter users to remove those who already have a match_status true
    matched_users_id = {user[0] for user in matched_users}
    filtered_users = [user for user in complete_users if user[0] not in matched_users_id]
    # Convert the result into a list of dictionaries
    users_list = [
      {
				'profile_id': profile[0],
				'user_id': profile[1],
				'first_name': profile[2],
				'last_name': profile[3],
				'orientation': profile[4],
				'country': profile[5],
				'country_iso': profile[6],
				'city': profile[7],
				'city_iso': profile[8],
				'date_of_birth': calculate_age(profile[9]),
				'description': profile[10],
				'foto': profile[11],
			}
      for profile in filtered_users
    ]
    # Return response
    return JSONResponse(content={"users": users_list}, status_code=200)
  except sqlite3.Error as e:
    # Return error response if there's an issue with the database
    return JSONResponse(content={"message": "Error retrieving users", "details": str(e)}, status_code=500)

def random_users(user_id):
  # Connect to the database
  conn = connect_db()
  cursor = conn.cursor()
  try:
    # Check if the user's profile is complete
    cursor.execute('SELECT * FROM profile WHERE profile_id = ?', (user_id,))
    user_profile = cursor.fetchone()
    required_fields = [user_profile[2], user_profile[3], user_profile[4], user_profile[5], user_profile[6], user_profile[7], user_profile[9]]
    if any(field is None or field == '' for field in required_fields):
      return JSONResponse(content={"message": "Complete your profile to see other users"}, status_code=201)
    # Calculate date of birth range
    user_dob = datetime.strptime(user_profile[9], '%Y-%m-%d')
    min_dob = user_dob - timedelta(days=365*4)
    max_dob = user_dob + timedelta(days=365*4)
    # Get all users except the specified profile_id
    cursor.execute('SELECT * FROM profile WHERE profile_id != ?', (user_id,))
    all_users = cursor.fetchall()
    # Filter out users with incomplete profiles and date_of_birth out of range
    complete_users = [
      user for user in all_users 
      if all(user[2:8] + (user[9],))  # Check required fields are not None or empty
      and min_dob <= datetime.strptime(user[9], '%Y-%m-%d') <= max_dob
    ]
    # Get users who have match_status true with profile_id
    cursor.execute('SELECT match_profile_id FROM match WHERE profile_id = ?', (user_id,))
    matched_users = cursor.fetchall()
    # Get users who have like_status true with profile_id
    cursor.execute('SELECT liked_profile_id FROM likes WHERE profile_id = ?', (user_id,))
    liked_users = cursor.fetchall()
    # Filter users to remove those who already have a match_status true or like_status true
    matched_users_id = {user[0] for user in matched_users}
    liked_users_id = {user[0] for user in liked_users}
    filtered_users = [user for user in complete_users if user[0] not in matched_users_id and user[0] not in liked_users_id]
    # Filter users by city and country
    same_city_users = [user for user in filtered_users if user[7] == user_profile[7]]
    same_country_users = [user for user in filtered_users if user[5] == user_profile[5] and user[7] != user_profile[7]]
    other_users = [user for user in filtered_users if user[5] != user_profile[5]]
    # Combine filtered lists with priority: same city, then same country, then others
    prioritized_users = same_city_users + same_country_users + other_users
    # Check if prioritized_users is empty
    if not prioritized_users:
      return JSONResponse(content={"null": "No users available"}, status_code=201)
    # Select a random user from the prioritized list
    random_user = random.choice(prioritized_users)
    user_dict = {
      'profile_id': random_user[0],
      'user_id': random_user[1],
      'first_name': random_user[2],
      'last_name': random_user[3],
      'orientation': random_user[4],
      'country': random_user[5],
      'country_iso': random_user[6],
      'city': random_user[7],
      'city_iso': random_user[8],
      'date_of_birth': calculate_age(random_user[9]),
      'description': random_user[10],
      'foto': random_user[11],
    }
    # Return response
    return JSONResponse(content={"users": user_dict}, status_code=200)
  except sqlite3.Error as e:
    # Return error response if there's an issue with the database
    return JSONResponse(content={"message": "Error retrieving users", "details": str(e)}, status_code=500)

def search_users(user_id, username):
    # Connect to the database
    conn = connect_db()
    cursor = conn.cursor()
    try:
        # Execute the SQL query to get user_ids by username, excluding the current user
        cursor.execute('SELECT user_id FROM user WHERE username LIKE ? AND user_id != ?', (username, user_id))
        user_ids = cursor.fetchall()
        # Check if any user_ids were found
        if user_ids:
            # Extract user_ids into a list
            user_ids = [user[0] for user in user_ids]
            # Create a placeholder string for the IN clause
            placeholders = ', '.join(['?'] * len(user_ids))
            # Execute the query to get user profiles by user_id
            cursor.execute(f'SELECT * FROM profile WHERE profile_id IN ({placeholders})', user_ids)
            user_profiles = cursor.fetchall()
            # Convert the result into a list of dictionaries, filtering out incomplete profiles
            user_profiles_list = [
                {
									'profile_id': profile[0],
									'user_id': profile[1],
									'first_name': profile[2],
									'last_name': profile[3],
									'orientation': profile[4],
									'country': profile[5],
									'country_iso': profile[6],
									'city': profile[7],
									'city_iso': profile[8],
									'date_of_birth': calculate_age(profile[9]),
									'description': profile[10],
									'foto': profile[11],
                }
                for profile in user_profiles
                if all([profile[2], profile[3], profile[4], profile[5], profile[6], profile[7], profile[8], profile[9]])  # Check if all required fields are complete
            ]
            if user_profiles_list:
                return JSONResponse(content={"profiles": user_profiles_list}, status_code=200)
            else:
                return JSONResponse(content={"message": "This user deleted his profile :("}, status_code=400)
        else:
            return JSONResponse(content={"message": "No users found with this username"}, status_code=400)
    except sqlite3.Error as e:
        return JSONResponse(content={"message": "Error fetching user profiles", "details": str(e)}, status_code=500)

def like_user(user_id, liked_profile_id, status):
  # Check if the user is trying to like themselves
  if user_id == liked_profile_id:
      return JSONResponse(content={"message": "You can't like yourself"}, status_code=400)
  # Establish a connection to the database
  conn = connect_db()
  cursor = conn.cursor()
  try:
    # Check if the liked_profile_id exists in the match table
    cursor.execute('SELECT 1 FROM match WHERE profile_id = ? AND match_profile_id = ?', (liked_profile_id, user_id))
    matched_user_exists = cursor.fetchone()
    if matched_user_exists:
      return JSONResponse(content={"message": "You have been matched with the user you are trying to like"}, status_code=400)
    # Check if the liked_profile_id exists in the user table
    cursor.execute('SELECT 1 FROM user WHERE user_id = ?', (liked_profile_id,))
    liked_user_exists = cursor.fetchone()
    if not liked_user_exists:
      return JSONResponse(content={"message": "The user you are trying to like does not exist"}, status_code=400)
    # Check if a like relationship already exists in the likes table
    cursor.execute('SELECT like_status FROM likes WHERE profile_id = ? AND liked_profile_id = ?', (user_id, liked_profile_id))
    existing_like = cursor.fetchone()
    if existing_like:
      # If a like relationship exists and the status is the same, do nothing
      if existing_like[0] == status:
        return JSONResponse(content={"message": "Like status already set"}, status_code=200)
      # If the status is different, update it
      else:
        cursor.execute('UPDATE likes SET like_status = ? WHERE profile_id = ? AND liked_profile_id = ?', (status, user_id, liked_profile_id))
    else:
      # If no like relationship exists, insert the new relationship
      cursor.execute('INSERT INTO likes (profile_id, liked_profile_id, like_status) VALUES (?, ?, ?)', (user_id, liked_profile_id, status))
    # Commit the changes to the database
    conn.commit()
    return JSONResponse(content={"message": "Like status updated successfully"}, status_code=200)
  except sqlite3.Error as e:
    # Handle any SQLite database errors
    return JSONResponse(content={"message": "Error updating like status", "details": str(e)}, status_code=500)

def get_liked_users(user_id):
  # Establish a connection to the database
  conn = connect_db()
  cursor = conn.cursor()
  try:
    # Execute SQL query to retrieve liked users for a given user_id
    cursor.execute('SELECT profile_id FROM likes WHERE liked_profile_id = ? AND like_status = ?', (user_id, True))
    users = cursor.fetchall()
    # Convert the list of tuples to a list of IDs
    users_id = [user[0] for user in users]
    # Create a placeholder string for the IN clause
    placeholders = ', '.join(['?'] * len(users_id))
    # Execute the query to get the users info
    cursor.execute(f'SELECT * FROM profile WHERE profile_id IN ({placeholders})', users_id)
    liked_users = cursor.fetchall()
    # Convert the result into a list of dictionaries
    liked_users_list = [
      {
				'profile_id': profile[0],
				'user_id': profile[1],
				'first_name': profile[2],
				'last_name': profile[3],
				'orientation': profile[4],
				'country': profile[5],
				'country_iso': profile[6],
				'city': profile[7],
				'city_iso': profile[8],
				'date_of_birth': calculate_age(profile[9]),
				'description': profile[10],
				'foto': profile[11],
      }
      for profile in liked_users
    ]
    # Return the list of liked users
    return JSONResponse(content={"liked_users": liked_users_list}, status_code=200)
  # Handle database errors
  except sqlite3.Error as e:
    return JSONResponse(content={"message": "Error retrieving liked users", "details": str(e)}, status_code=500)

def unlike_user(user_id, liked_profile_id):
  # Check if the user is trying to unlike themselves
  if user_id == liked_profile_id:
    return JSONResponse(content={"message": "You can't unlike yourself"}, status_code=400)
  # Connect to the database
  conn = connect_db()
  cursor = conn.cursor()
  try:
    # Check if the liked_profile_id exists in the user table
    cursor.execute('SELECT 1 FROM likes WHERE profile_id = ?', (liked_profile_id,))
    liked_user_exists = cursor.fetchone()
    if not liked_user_exists:
      return JSONResponse(content={"message": "The user you are trying to unlike does not exist"}, status_code=400)
    # Delete entries where profile_id liked liked_profile_id and vice versa
    cursor.execute('DELETE FROM likes WHERE profile_id = ? AND liked_profile_id = ?', (user_id, liked_profile_id))
    cursor.execute('DELETE FROM likes WHERE profile_id = ? AND liked_profile_id = ?', (liked_profile_id, user_id))
    # Commit changes to the database
    conn.commit()
    # Return success response
    return JSONResponse(content={"message": "Successfully unliked the user"}, status_code=200)
  except sqlite3.Error as e:
    # If any error occurs during database operation, return error response
    return JSONResponse(content={"message": "Error unliking the user", "details": str(e)}, status_code=500)

def match_user(user_id, match_profile_id, status):
  # Check if the user is trying to match with themselves
  if user_id == match_profile_id:
    return JSONResponse(content={"message": "You can't match yourself"}, status_code=400)
  # Connect to the database
  conn = connect_db()
  cursor = conn.cursor()
  try:
    # Check if the liked_profile_id has liked profile_id
    cursor.execute('SELECT like_status FROM likes WHERE profile_id = ? AND liked_profile_id = ?', (match_profile_id, user_id))
    liked_user_like_status = cursor.fetchone()
    # If both users have liked each other, create a match and remove likes
    if liked_user_like_status and liked_user_like_status[0] == True:
      cursor.execute('INSERT INTO match (profile_id, match_profile_id, match_status) VALUES (?, ?, ?)', (user_id, match_profile_id, status))
      cursor.execute('INSERT INTO match (profile_id, match_profile_id, match_status) VALUES (?, ?, ?)', (match_profile_id, user_id, status))
      cursor.execute('DELETE FROM likes WHERE profile_id = ? AND liked_profile_id = ?', (user_id, match_profile_id))
      cursor.execute('DELETE FROM likes WHERE profile_id = ? AND liked_profile_id = ?', (match_profile_id, user_id))
      conn.commit()
      return JSONResponse(content={"message": "Match created successfully"}, status_code=200)
    else:
      # If the other user hasn't liked back yet
      return JSONResponse(content={"message": "Other user didn't like you yet!"}, status_code=200)
  except sqlite3.Error as e:
    # Catch any database errors
    return JSONResponse(content={"message": "Error updating match status", "details": str(e)}, status_code=500)

def get_matched_users(user_id):
  # Establish database connection
  conn = connect_db()
  cursor = conn.cursor()
  try:
    # Execute SQL query to fetch matched user IDs for given user_id
    cursor.execute(
      'SELECT match_profile_id FROM match WHERE profile_id = ?', (user_id,))
    matched_ids = cursor.fetchall()
    # If there are matched IDs
    if matched_ids:
      # Extract matched user IDs from fetched data
      matched_users_id = [user_id[0] for user_id in matched_ids]
      # Create a placeholder string for the IN clause
      placeholders = ', '.join(['?'] * len(matched_users_id))
      # Execute the query to get the users info
      cursor.execute(f'SELECT profile.*, user.username FROM profile INNER JOIN user ON profile.profile_id = user.user_id WHERE profile.profile_id IN ({placeholders})', matched_users_id)
      matched_users = cursor.fetchall()
      # Convert the result into a list of dictionaries
      matched_users_list = [
        {
					'profile_id': profile[0],
					'user_id': profile[1],
					'first_name': profile[2],
					'last_name': profile[3],
					'orientation': profile[4],
					'country': profile[5],
					'country_iso': profile[6],
					'city': profile[7],
					'city_iso': profile[8],
					'date_of_birth': calculate_age(profile[9]),
					'description': profile[10],
					'foto': profile[11],
          'username': 'https://t.me/'+profile[12]
        }
        for profile in matched_users
      ]
      # Return JSON response with matched user IDs and 200 status code
      return JSONResponse(content={"matched_users": matched_users_list}, status_code=200)
    else:
      # If no matched users found, return appropriate message with 400 status code
      return JSONResponse(content={"message": "No matched users found"}, status_code=200)
  except sqlite3.Error as e:
    # Return error message along with details and 500 status code
    return JSONResponse(content={"message": "Error fetching matched users", "details": str(e)}, status_code=500)

def get_matched_user(user_id):
    # Conectar a la base de datos
    conn = connect_db()
    cursor = conn.cursor()
    try:
        # Ejecutar consulta SQL para obtener match_profile_id para el user_id dado
        cursor.execute('SELECT match_profile_id FROM match WHERE match_profile_id = ?', (user_id,))
        match_profile_id = cursor.fetchone()
        if match_profile_id:
            # Ejecutar consulta SQL para obtener datos del perfil y nombre de usuario
            cursor.execute(
                'SELECT profile.*, user.username '
                'FROM profile '
                'INNER JOIN user ON profile.profile_id = user.user_id '
                'WHERE profile.profile_id = ?', (match_profile_id[0],)
            )
            profile = cursor.fetchone()
            
            if profile:
                profile_list = {
                    'profile_id': profile[0],
                    'user_id': profile[1],
                    'first_name': profile[2],
                    'last_name': profile[3],
                    'orientation': profile[4],
                    'country': profile[5],
                    'country_iso': profile[6],
                    'city': profile[7],
                    'city_iso': profile[8],
                    'date_of_birth': calculate_age(profile[9]),
                    'description': profile[10],
                    'foto': profile[11],
                    'username': 'https://t.me/' + profile[12]
                }
                return JSONResponse(content=profile_list, status_code=200)
            else:
                return JSONResponse(content={"message": "Profile not found"}, status_code=400)
        else:
            return JSONResponse(content={"message": "Match profile ID not found"}, status_code=400)
    except sqlite3.IntegrityError as e:
        return JSONResponse(content={"message": "Integrity error", "details": str(e)}, status_code=400)
    except sqlite3.Error as e:
        return JSONResponse(content={"message": "Database error", "details": str(e)}, status_code=500)

def unmatch_user(user_id, match_profile_id):
  # Check if the user is trying to match with themselves
  if user_id == match_profile_id:
    # Return an error response with status code 400
    return JSONResponse(content={"message": "You can't match yourself"}, status_code=400)
  # Connect to the database
  conn = connect_db()
  cursor = conn.cursor()
  try:
    # Delete the match between profile_id and liked_profile_id
    cursor.execute('DELETE FROM match WHERE profile_id = ? AND match_profile_id = ?', (user_id, match_profile_id))
    # Delete the match between liked_profile_id and profile_id (for bidirectional match deletion)
    cursor.execute('DELETE FROM match WHERE profile_id = ? AND match_profile_id = ?', (match_profile_id, user_id))
    # Commit the changes to the database
    conn.commit()
    # Return a success response with status code 200
    return JSONResponse(content={"message": "Successfully unmatched the user"}, status_code=200)
  except sqlite3.Error as e:
    # If any error occurs during the deletion process, return an error response with status code 500
    return JSONResponse(content={"message": "Error unmatching the user", "details": str(e)}, status_code=500)

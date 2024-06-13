import sqlite3
import bcrypt
from datetime import datetime

from database.database import connect_db, close_db
from middlewares.functions_jwt import *
from database.model import *

# Function to register a new user in the database
def register_user(role, username, password, gender, first_name, last_name):
    # Verify that no input values are null or empty
    if not all([role, username, password, gender, first_name, last_name]):
        return JSONResponse(content={"message": "All fields must be provided and non-empty."}, status_code=400)
    # Connect to the database
    conn = connect_db()
    cursor = conn.cursor()
    # Hash the password
    hashed_password = hash_password(password)
    # Prepare user and profile data
    date_of_registry = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    user_data = (role, username, hashed_password, gender, date_of_registry)
    try:
        # Insert user data into 'user' table
        cursor.execute('''
            INSERT INTO user (role, username, password, gender, date_of_registry) 
            VALUES (?, ?, ?, ?, ?)
        ''', user_data)
        conn.commit()
        # Get the last inserted user_id
        cursor.execute('SELECT last_insert_rowid()')
        user_id = cursor.fetchone()[0]
        if user_id:
            # Insert profile data into 'profile' table
            cursor.execute('''
                INSERT INTO profile (user_id, first_name, last_name) 
                VALUES (?, ?, ?)
            ''', (user_id, first_name, last_name))
            conn.commit()
            # Insert default values into 'networks' table
            cursor.execute('''
                INSERT INTO networks (profile_id) 
                VALUES (?)
            ''', (user_id,))
            conn.commit()
            # Return message upon successful registration
            return JSONResponse(content={"message": "You can now log in!"}, status_code=200)
    except sqlite3.IntegrityError:
        # Handle integrity errors, such as duplicate usernames
        return JSONResponse(content={"message": "User already created with this username!"}, status_code=400)
    except sqlite3.OperationalError as e:
        # Handle operational errors, such as issues with the database connection
        return JSONResponse(content={"message": "Something was wrong: " + str(e)})
    except sqlite3.Error as e:
        # Handle generic SQLite errors
        return JSONResponse(content={"message": "Database error: " + str(e)}, status_code=500)
    finally:
        # Close the database connection
        close_db()

# Function to login a user
def login_user(username, password):
  # Connect to the database
  conn = connect_db()
  cursor = conn.cursor()
  try:
    # Retrieve password and token from the database for the given username
    cursor.execute('SELECT password, token FROM user WHERE username = ?', (username,))
    result = cursor.fetchone()
    # Check if the result exists and the password matches
    if result and bcrypt.checkpw(password.encode('utf-8'), result[0].encode('utf-8') if isinstance(result[0], str) else result[0]):
      # Retrieve the user information from the database for the given username
      cursor.execute('SELECT user_id, role, username, gender, password FROM user WHERE username = ?', (username,))
      user = cursor.fetchone()
      user_id, role, username, gender, _ = user
      # Create data dictionary for the token
      user_dict = {
        'user_id': user_id,
        'role': role,
        'username': username,
        'gender': gender,
      }
      # generate token
      token = write_token(user_dict)
      # Update the current_id and token for the user
      cursor.execute('UPDATE user SET current_id = ?, token = ? WHERE user_id = ?', (user_id, token, user_id))
      conn.commit()
      # Return the token
      return {"token": token}
    else:
      # Return None if authentication fails
      return JSONResponse(content={"message": "Invalid username or password"}, status_code=400)
  except sqlite3.Error as e:
    return JSONResponse(content={"message": "Error logging in", "details": str(e)}, status_code=500)

# Update paswword
def update_password(user_id, old_password, new_password):
  # Connect to the database
  conn = connect_db()
  cursor = conn.cursor()
  try:
    # Retrieve the current password for the user
    cursor.execute('SELECT password FROM user WHERE user_id = ?', (user_id,))
    result = cursor.fetchone()
    # Check if the user exists and if the old password is correct
    if not result or not bcrypt.checkpw(old_password.encode('utf-8'), result[0].encode('utf-8') if isinstance(result[0], str) else result[0]):
      return JSONResponse(content={"message": "Old password is not correct"}, status_code=400)
    # Hash the new password
    hashed_new_password = hash_password(new_password)
    # Update the password in the database
    cursor.execute('UPDATE user SET password = ? WHERE user_id = ?', (hashed_new_password, user_id))
    conn.commit()
    return JSONResponse(content={"message": "Password updated successfully"}, status_code=200)
  except sqlite3.Error as e:
    # Handle any SQLite database errors
    return JSONResponse(content={"message": "Database error: " + str(e)}, status_code=500)

# Function to logout a user
def invalidate_token(user_id):
  # Connect to the database
  conn = connect_db()
  cursor = conn.cursor()
  try:
    # Delete token when user logout
    cursor.execute('UPDATE user SET token = NULL WHERE user_id = ?', (user_id,))
    conn.commit()
    return JSONResponse(content={"message": "Logged out successfully"}, status_code=200)
    # Error exception
  except sqlite3.Error as e:
    return JSONResponse(content={"message": "Error invalidating token"}, status_code=400)
  finally:
    # Close to the database
    close_db()

# Function support
def support_user(user_id, username, first_name, last_name, description):
  # Verify that no input values are null or empty
  if not all([user_id, username, first_name, last_name, description]):
    return JSONResponse(content={"message": "All fields must be provided and non-empty."}, status_code=400)
  # Connect to the database
  conn = connect_db()
  cursor = conn.cursor()
  # Create data dictionary for the token
  support_data = (user_id, username, first_name, last_name, description, True)
  try:
    # Insert user data into 'support' table
    cursor.execute('INSERT INTO support (user_id, username, first_name, last_name, description, support_status) VALUES (?, ?, ?, ?, ?, ?)', support_data)
    # Commit changes to the database
    conn.commit()
    # Return token upon successful registration
    return JSONResponse(content={"message": "Soon admin will chat with you!"}, status_code=200)
  except sqlite3.OperationalError as e:
    # Handle operational errors, such as issues with the database connection
    return JSONResponse(content={"message": "Something was wrong: " + str(e)})
  except sqlite3.Error as e:
    # Handle generic SQLite errors
    return JSONResponse(content={"message": "Database error: " + str(e)}, status_code=500)

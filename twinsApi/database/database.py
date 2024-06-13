import sqlite3

conn = None

def connect_db():
  global conn
  if conn is None:
    conn = sqlite3.connect('database/bot_database.db', check_same_thread=False)
  return conn

def close_db():
  global conn
  if conn:
    conn.close()
    conn = None

def setup_db():
  cursor = connect_db().cursor()

  cursor.execute('''
  CREATE TABLE IF NOT EXISTS user (
    user_id INTEGER PRIMARY KEY AUTOINCREMENT,
    current_id INTEGER,
    role TEXT,
    username TEXT UNIQUE,
    password TEXT,
    token TEXT UNIQUE,
    gender TEXT,
    date_of_registry DATETIME
  )
  ''')

  cursor.execute('''
  CREATE TABLE IF NOT EXISTS profile (
    profile_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    first_name TEXT,
    last_name TEXT,
    orientation TEXT,
    country TEXT,
    country_iso TEXT,
    city TEXT,
    city_iso TEXT,
    date_of_birth DATE,
    description TEXT,
    foto TEXT,
    FOREIGN KEY (user_id) REFERENCES user(user_id)
  )
  ''')

  cursor.execute('''
  CREATE TABLE IF NOT EXISTS networks (
    networks_id INTEGER PRIMARY KEY AUTOINCREMENT,
    profile_id INTEGER,
    instagram TEXT,
    snapchat TEXT,
    twitter TEXT,
    vk TEXT,
    discord TEXT,
    tiktok TEXT,
    twitch TEXT,
    bereal TEXT,
    FOREIGN KEY (profile_id) REFERENCES profile(profile_id)
  )
  ''')

  cursor.execute('''
  CREATE TABLE IF NOT EXISTS channels (
    channel_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    foto TEXT,
    name TEXT,
    category TEXT,
    description TEXT,
    country TEXT,
    country_iso TEXT,
    price INTEGER,
    link TEXT,
    FOREIGN KEY (user_id) REFERENCES user(user_id)
  )
  ''')

  cursor.execute('''
  CREATE TABLE IF NOT EXISTS joined_channels (
    joined_channel_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    channel_id INTEGER,
    channel_status BOOLEAN,
    FOREIGN KEY (user_id) REFERENCES user(user_id),
    FOREIGN KEY (channel_id) REFERENCES channels(channel_id)
  )
  ''')

  cursor.execute('''
  CREATE TABLE IF NOT EXISTS groups (
    group_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    foto TEXT,
    name TEXT,
    category TEXT,
    description TEXT,
    country TEXT,
    country_iso TEXT,
    price INTEGER,
    link TEXT,
    FOREIGN KEY (user_id) REFERENCES user(user_id)
  )
  ''')

  cursor.execute('''
  CREATE TABLE IF NOT EXISTS joined_groups (
    joined_groups_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    group_id INTEGER,
    group_status BOOLEAN,
    FOREIGN KEY (user_id) REFERENCES user(user_id),
    FOREIGN KEY (group_id) REFERENCES groups(group_id)
  )
  ''')

  cursor.execute('''
  CREATE TABLE IF NOT EXISTS likes (
    like_id INTEGER PRIMARY KEY AUTOINCREMENT,
    profile_id INTEGER,
    liked_profile_id INTEGER,
    like_status BOOLEAN,
    FOREIGN KEY (profile_id) REFERENCES profile(profile_id),
    FOREIGN KEY (liked_profile_id) REFERENCES profile(profile_id)
  )
  ''')

  cursor.execute('''
  CREATE TABLE IF NOT EXISTS match (
    match_id INTEGER PRIMARY KEY AUTOINCREMENT,
    profile_id INTEGER,
    match_profile_id INTEGER,
    match_status BOOLEAN,
    FOREIGN KEY (profile_id) REFERENCES profile(profile_id),
    FOREIGN KEY (match_profile_id) REFERENCES profile(profile_id)
  )
  ''')
  
  cursor.execute('''
  CREATE TABLE IF NOT EXISTS support (
    support_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    username TEXT,
    first_name TEXT,
    last_name TEXT,
    description TEXT,
    support_status BOOLEAN
  )
  ''')

  cursor.execute('''
  CREATE TABLE IF NOT EXISTS report (
    report_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    report_type_id INTEGER,
    report_type TEXT,
    report_category TEXT,
    description TEXT,
    report_status BOOLEAN
  )
  ''')

  conn.commit()
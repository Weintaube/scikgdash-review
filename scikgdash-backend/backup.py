import os
import shutil
from datetime import datetime
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

DATABASE_URL =  os.environ['DB_URL']
print(DATABASE_URL)

# Extract the actual file path from the DATABASE_URL
db_file = DATABASE_URL.replace("sqlite:///", "")

# Ensure the file exists
if not os.path.exists(db_file):
    print(f"Error: Database file '{db_file}' not found.")
    exit(1)

# Create a backup directory if it doesn't exist
backup_dir = "./backups"
if not os.path.exists(backup_dir):
    os.makedirs(backup_dir)

# Generate a backup file name with a timestamp
timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
backup_file = os.path.join(backup_dir, f"backup_{timestamp}.db")

# Copy the database file to the backup location
try:
    shutil.copy2(db_file, backup_file)
    print(f"Database backup successful: {backup_file}")
except Exception as e:
    print(f"Error during backup: {e}")

#winpty docker exec -it <container-name> python backup.py

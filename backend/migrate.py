import sqlite3
import os

# Path to database
db_path = 'backend/macrofactor.db'

if not os.path.exists(db_path):
    print(f"Database {db_path} not found. Skipping migration (will be created by app).")
    exit(0)

print(f"Migrating {db_path}...")
conn = sqlite3.connect(db_path)
c = conn.cursor()

# Add quantity and unit to food_logs
try:
    c.execute("ALTER TABLE food_logs ADD COLUMN quantity FLOAT")
    print("Added quantity to food_logs")
except sqlite3.OperationalError as e:
    if "duplicate column name" in str(e):
        print("quantity column already exists in food_logs")
    else:
        print(f"Error migrating food_logs (quantity): {e}")

try:
    c.execute("ALTER TABLE food_logs ADD COLUMN unit VARCHAR")
    print("Added unit to food_logs")
except sqlite3.OperationalError as e:
    if "duplicate column name" in str(e):
        print("unit column already exists in food_logs")
    else:
        print(f"Error migrating food_logs (unit): {e}")

# Add serving_weight to food_items
try:
    c.execute("ALTER TABLE food_items ADD COLUMN serving_weight FLOAT")
    print("Added serving_weight to food_items")
except sqlite3.OperationalError as e:
    if "duplicate column name" in str(e):
        print("serving_weight column already exists in food_items")
    else:
        print(f"Error migrating food_items: {e}")

conn.commit()
conn.close()
print("Migration complete.")

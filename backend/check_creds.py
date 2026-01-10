
import json
import os

file_path = os.path.abspath('service-account.json')
print(f"Reading file from: {file_path}")

if not os.path.exists(file_path):
    print("Error: File not found at this path.")
else:
    try:
        with open(file_path, 'r') as f:
            data = json.load(f)
            print(f"Project ID: {data.get('project_id')}")
            print(f"Client Email: {data.get('client_email')}")
    except Exception as e:
        print(f"Error reading service-account.json: {e}")

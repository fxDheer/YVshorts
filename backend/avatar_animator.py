import requests
import json
import os
import time

with open("config.json") as f:
    config = json.load(f)

DID_API_KEY = config["did_api_key"]

def animate_avatar(script: str, voice_file: str) -> str:
    output_file = "outputs/avatar.mp4"
    os.makedirs("outputs", exist_ok=True)
    
    try:
        # D-ID API call to create a talk
        url = "https://api.d-id.com/talks"
        headers = {
            "Authorization": f"Basic {DID_API_KEY}",
            "Content-Type": "application/json"
        }
        
        data = {
            "script": {
                "type": "text",
                "input": script
            },
            "config": {
                "stitch": True
            }
        }
        
        response = requests.post(url, json=data, headers=headers)
        
        if response.status_code == 201:
            result = response.json()
            talk_id = result.get("id")
            print(f"Talk created with ID: {talk_id}")
            
            # Poll for completion
            status_url = f"https://api.d-id.com/talks/{talk_id}"
            max_attempts = 30  # 5 minutes max
            
            for attempt in range(max_attempts):
                status_response = requests.get(status_url, headers=headers)
                if status_response.status_code == 200:
                    status_data = status_response.json()
                    status = status_data.get("status")
                    
                    if status == "done":
                        video_url = status_data.get("result_url")
                        if video_url:
                            # Download the video
                            video_response = requests.get(video_url)
                            if video_response.status_code == 200:
                                with open(output_file, "wb") as f:
                                    f.write(video_response.content)
                                print(f"Avatar video generated successfully: {output_file}")
                                return output_file
                    elif status == "error":
                        print(f"D-ID API error: {status_data}")
                        break
                    else:
                        print(f"Processing... Status: {status}")
                        time.sleep(10)  # Wait 10 seconds before checking again
                else:
                    print(f"Status check failed: {status_response.status_code}")
                    break
            
            print("Timeout waiting for video generation")
            
        else:
            print(f"D-ID API error: {response.status_code} - {response.text}")
            
    except Exception as e:
        print(f"Avatar animation error: {e}")
    
    # Create placeholder if API fails
    with open(output_file, "w") as f:
        f.write("")
    print(f"Avatar animation placeholder created: {output_file}")
    return output_file

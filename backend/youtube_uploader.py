import json
import googleapiclient.discovery
from google.oauth2.credentials import Credentials

with open("config.json") as f:
    config = json.load(f)

def upload_to_youtube(video_file: str, title: str, description: str):
    creds = Credentials.from_authorized_user_info({
        "client_id": config["youtube"]["client_id"],
        "client_secret": config["youtube"]["client_secret"],
        "refresh_token": config["youtube"]["refresh_token"],
        "token_uri": "https://oauth2.googleapis.com/token"
    })
    youtube = googleapiclient.discovery.build("youtube", "v3", credentials=creds)
    request = youtube.videos().insert(
        part="snippet,status",
        body={
            "snippet": {
                "title": title,
                "description": description,
                "tags": ["shorts", "AI"]
            },
            "status": {
                "privacyStatus": "public"
            }
        },
        media_body=video_file
    )
    response = request.execute()
    return response

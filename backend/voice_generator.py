import json
import requests
import os

with open("config.json") as f:
    config = json.load(f)

def generate_voice(script: str, voice_name="Rachel") -> str:
    output_file = "outputs/voice.mp3"
    os.makedirs("outputs", exist_ok=True)
    
    try:
        # ElevenLabs API call using requests
        url = "https://api.elevenlabs.io/v1/text-to-speech/21m00Tcm4TlvDq8ikWAM"
        headers = {
            "Accept": "audio/mpeg",
            "Content-Type": "application/json",
            "xi-api-key": config["elevenlabs_api_key"]
        }
        
        data = {
            "text": script,
            "model_id": "eleven_multilingual_v2",
            "voice_settings": {
                "stability": 0.5,
                "similarity_boost": 0.5
            }
        }
        
        response = requests.post(url, json=data, headers=headers)
        
        if response.status_code == 200:
            with open(output_file, "wb") as f:
                f.write(response.content)
            print(f"Voice generated successfully: {output_file}")
            return output_file
        else:
            print(f"ElevenLabs API error: {response.status_code} - {response.text}")
            # Create placeholder if API fails
            with open(output_file, "w") as f:
                f.write("")
            return output_file
            
    except Exception as e:
        print(f"Voice generation error: {e}")
        # Create placeholder if there's an error
        with open(output_file, "w") as f:
            f.write("")
        return output_file

import openai
import json
import os

config_path = os.path.join(os.path.dirname(__file__), "config.json")
with open(config_path) as f:
    config = json.load(f)

client = openai.OpenAI(api_key=config["openai_api_key"])

def generate_script(product_name: str) -> str:
    prompt = f"Write a short, catchy YouTube Shorts script under 60 seconds to promote {product_name}. Make it engaging and suitable for a 15-30 second video with clear call-to-action."
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}],
        max_tokens=150,
        temperature=0.8
    )
    return response.choices[0].message.content.strip()

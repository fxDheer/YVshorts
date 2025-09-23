from script_generator import generate_script
from voice_generator import generate_voice
from avatar_animator import animate_avatar
from video_editor import assemble_video

def generate_short(product_name, image_path=None):
    script = generate_script(product_name)
    voice_file = generate_voice(script)
    avatar_video = animate_avatar(script, voice_file)
    final_video = assemble_video(avatar_video, script, image_path)
    return final_video

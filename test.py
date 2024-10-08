from PIL import Image,ImageDraw,ImageFont
import sys
import os

def create_image(text):
    img=Image.new('RGB',(200,200),color=(255,255,255))
    d=ImageDraw.Draw(img)

    font=ImageFont.load_default()

    d.text((10,10),text,fill=(0,0,0),font=font)

    output_path=os.path.join(os.path.dirname(__file__),'Image','pil_text.png')
    img.save(output_path)

if __name__=='__main__':
    args=sys.argv
    text=args[1] 
    create_image(text)
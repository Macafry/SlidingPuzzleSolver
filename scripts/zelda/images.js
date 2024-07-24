function splitImageIntoTiles(imageSrc, tileCountX = 4, tileCountY = 4) {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = imageSrc;

    let imageSCRs = [];
  
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
  
      const tileWidth = img.width / tileCountX;
      const tileHeight = img.height / tileCountY;      
  
      for (let i = 0; i < tileCountY; i++) {
        for (let j = 0; j < tileCountX; j++) {
          const tileCanvas = document.createElement('canvas');
          tileCanvas.width = tileWidth;
          tileCanvas.height = tileHeight;
          const tileCtx = tileCanvas.getContext('2d');
          tileCtx.drawImage(canvas, j * tileWidth, i * tileHeight, tileWidth, tileHeight, 0, 0, tileWidth, tileHeight);
  
          imageSCRs.push(tileCanvas.toDataURL('image/png'));
        }
      }

     
    }; 
    
    return imageSCRs;
  }

const IMAGE_LINKS = {
    "Zill": "https://static.wikia.nocookie.net/zelda_gamepedia_en/images/d/d1/SP1_Zill.png/revision/latest/scale-to-width-down/120?cb=20100611081922&amp;format=original",
    "Aryll": "https://static.wikia.nocookie.net/zelda_gamepedia_en/images/e/eb/SP2_Aryll.png/revision/latest/scale-to-width-down/120?cb=20100611081922&amp;format=original",
    "Tingle": "https://static.wikia.nocookie.net/zelda_gamepedia_en/images/b/b3/TWW_Tingle_Sliding_Puzzle.png/revision/latest/scale-to-width-down/120?cb=20100611081922&amp;format=original",
    "Salvatore": "https://static.wikia.nocookie.net/zelda_gamepedia_en/images/7/75/SP4_TWW_Salvatore_Figurine_Model.png/revision/latest/scale-to-width-down/120?cb=20100611081922&amp;format=original",
    "Tetra": "https://static.wikia.nocookie.net/zelda_gamepedia_en/images/7/78/SP5_Tetra.png/revision/latest/scale-to-width-down/120?cb=20100611081922&amp;format=original",
    "Makar": "https://static.wikia.nocookie.net/zelda_gamepedia_en/images/c/c2/TWW_Makar_Sliding_Puzzle.png/revision/latest/scale-to-width-down/120?cb=20100611081923&amp;format=original",
    "Medli": "https://static.wikia.nocookie.net/zelda_gamepedia_en/images/3/3c/SP7_Medli.png/revision/latest/scale-to-width-down/120?cb=20100611081923&amp;format=original",
    "King of Red Lions": "https://static.wikia.nocookie.net/zelda_gamepedia_en/images/3/3b/SP8_King_of_Red_Lions.png/revision/latest/scale-to-width-down/120?cb=20100611081923&amp;format=original",
    "Orca": "https://static.wikia.nocookie.net/zelda_gamepedia_en/images/5/5b/SP9_Orca.png/revision/latest/scale-to-width-down/120?cb=20100611081923&amp;format=original",
    "Grandmother": "https://static.wikia.nocookie.net/zelda_gamepedia_en/images/0/0b/SP10_Link%27s_Grandmother.png/revision/latest/scale-to-width-down/120?cb=20100611081923&amp;format=original",
    "Doc Bandam": "https://static.wikia.nocookie.net/zelda_gamepedia_en/images/2/2c/SP11_Doc_Bandam.png/revision/latest/scale-to-width-down/120?cb=20100611081923&amp;format=original",
    "Quill": "https://static.wikia.nocookie.net/zelda_gamepedia_en/images/3/3b/SP12_Quill.png/revision/latest/scale-to-width-down/120?cb=20100611081923&amp;format=original",
    "Niko": "https://static.wikia.nocookie.net/zelda_gamepedia_en/images/3/3f/TWW_Niko_Sliding_Puzzle.png/revision/latest/scale-to-width-down/120?cb=20100611081923&amp;format=original",
    "Beedle": "https://static.wikia.nocookie.net/zelda_gamepedia_en/images/8/88/SP14_Beedle.png/revision/latest/scale-to-width-down/120?cb=20100611081923&amp;format=original",
    "Moblin": "https://static.wikia.nocookie.net/zelda_gamepedia_en/images/3/35/SP15_Moblin.png/revision/latest/scale-to-width-down/120?cb=20100611081923&amp;format=original",
    "Helmaroc King": "https://static.wikia.nocookie.net/zelda_gamepedia_en/images/a/aa/SP16_Helmaroc_King.png/revision/latest/scale-to-width-down/120?cb=20100611081923&amp;format=original",
}
















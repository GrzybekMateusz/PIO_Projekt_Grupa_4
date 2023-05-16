class GolfMap
{
  #width;
  #height;
  #map=[];

  constructor(input)
  {
    this.#handleFile(input);
  }

  async #handleFile(input)
  {
    if(input.files.length==0)
      throw new Error("No file!");
    const file=input.files[0];
    if(!file.type.startsWith("image/"))
      throw new Error("Invalid file type!");
    const bitmap=await createImageBitmap(file);
    this.#width=bitmap.width;
    this.#height=bitmap.height;
    const canvas=new OffscreenCanvas(this.#width,this.#height);
    const ctx=canvas.getContext("2d",{alpha:false});
    ctx.drawImage(bitmap,0,0);
    const image_data=ctx.getImageData(0,0,this.#width,this.#height);
    this.#generateMap(image_data);
  }

  #generateMap(image_data)
  {
    const width=image_data.width;
    const height=image_data.height;
    const data=image_data.data;
    for(let y=0;y<height;++y)
    {
      this.#map[y]=[];
      for(let x=0;x<width;++x)
      {
        let offset=(y*width+x)*4;
        if(data[offset]==0&&data[offset+1]==0&&data[offset+2]==0)
          this.#map[y][x]=0;
        else if(data[offset]==255&&data[offset+1]==255&&data[offset+2]==255)
          this.#map[y][x]=1;
        else
          this.#map[y][x]=2;
      }
    }
    console.log(this.#map);
  }
}

map_upload=document.getElementById("map_upload");
map_form=document.getElementById("map_form");
try
{
  map_form.addEventListener("submit",(e)=>{new GolfMap(map_upload);e.preventDefault();});
}
catch(e)
{
}


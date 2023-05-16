export default class GolfMap
{
  static ObjectType={
    Grass:0,
    Wall:1
  }

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
          this.#map[y][x]=GolfMap.ObjectType.Wall;
        else if(data[offset]==255&&data[offset+1]==255&&data[offset+2]==255)
          this.#map[y][x]=GolfMap.ObjectType.Grass;
        else
          throw new Error("Invalid color used!");
      }
    }
  }

  get width()
  {
    return this.#width;
  }

  get height()
  {
    return this.#height;
  }

  get map()
  {
    return this.#map;
  }
}

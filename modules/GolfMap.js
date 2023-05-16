export default class GolfMap
{
  static ObjectType={
    Grass:0,
    Wall:1
  }

  #width;
  #height;
  #map=[];

  constructor(bitmap)
  {
    this.#width=bitmap.width;
    this.#height=bitmap.height;
    const canvas=new OffscreenCanvas(this.#width,this.#height);
    const ctx=canvas.getContext("2d",{alpha:false});
    ctx.drawImage(bitmap,0,0);
    const image_data=ctx.getImageData(0,0,this.#width,this.#height);
    const data=image_data.data;
    for(let y=0;y<this.#height;++y)
    {
      this.#map[y]=[];
      for(let x=0;x<this.#width;++x)
      {
        let offset=(y*this.#width+x)*4;
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

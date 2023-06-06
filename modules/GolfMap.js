import Point from "./Point.js";

export default class GolfMap
{
  static ObjectType={
    Grass:0,
    Wall:1,
    Hole:2,
    Start:3
  }

  #width;
  #height;
  #map=[];

  constructor(width, height, map)
  {
    if(width!=null&&height!=null&&map!=null)
    {
      this.#width=width;
      this.#height=height;
      this.#map=map;
    }
  }

  fromBitmap(bitmap)
  {
    this.#width=bitmap.width;
    this.#height=bitmap.height;
    const canvas=new OffscreenCanvas(this.#width,this.#height);
    const ctx=canvas.getContext("2d",{alpha:false});
    ctx.drawImage(bitmap,0,0);
    const image_data=ctx.getImageData(0,0,this.#width,this.#height);
    const data=image_data.data;
    let hole_found=false, start_found=false;
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
        else if(data[offset]==255&&data[offset+1]==0&&data[offset+2]==0)
        {
          if(hole_found)
            throw new Error("Map can contain only one hole!");
          hole_found=true;
          this.#map[y][x]=GolfMap.ObjectType.Hole;
        }
        else if(data[offset]==0&&data[offset+1]==255&&data[offset+2]==0)
        {
          if(start_found)
            throw new Error("Map can contain only one starting point!");
          start_found=true;
          this.#map[y][x]=GolfMap.ObjectType.Start;
        }
        else
          throw new Error("Invalid color used!");
      }
    }
    if(!start_found)
      throw new Error("Map must contain a starting point!");
    if(!hole_found)
      throw new Error("Map must contain a hole!");
  }

  serialize()
  {
    return JSON.stringify({'width':this.#width,'height':this.#height,'map':this.#map});
  }

  static deserialize(json_string)
  {
    const map=JSON.parse(json_string);
    return new GolfMap(map.width,map.height,map.map);
  }

  typeAtPoint(p)
  {
    return this.#map[Math.floor(p.y/10)][Math.floor(p.x/10)];
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

  get startPoint()
  {
    for(let y=0;y<this.#height;++y)
    {
      for(let x=0;x<this.#width;++x)
        if(this.#map[y][x]==GolfMap.ObjectType.Start)
          return new Point(x*10+5,y*10+5);
    }
  }
}

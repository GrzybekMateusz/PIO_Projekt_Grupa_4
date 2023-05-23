import GolfMap from "./GolfMap.js"

export default class GameScreen
{
  #canvas_scale;
  #canvas;
  #ctx;
  #golf_map

  constructor()
  {
    const start_button=document.getElementById("start_button");
    start_button.addEventListener("click",async (e)=>{
      await this.#loadPage("PlayersMenu");
      const map_selection_button=document.getElementById("map_selection_button");
      map_selection_button.addEventListener("click",async (e)=>{
        await this.#loadPage("MapSelectionMenu");
        const start_game_button=document.getElementById("start_game_button");
        const map_upload=document.getElementById("map_upload");
        map_upload.addEventListener("change",async (e)=>{
          this.#golf_map=await this.#getMap(map_upload);
        });
        start_game_button.addEventListener("click",async (e)=>{
          if(this.#golf_map!=null)
          {
            await this.#loadPage("GameScreen");
            this.#canvas=document.getElementById("game_screen");
            this.#ctx=this.#canvas.getContext("2d");
            this.#drawMap();
            addEventListener("resize",(e)=>{
              this.#drawMap();
            });
          }
        });
      });
    });
  }

  //część do przeniesienia do kodu renderującego
  #drawMap()
  {
    this.#canvas_scale=Math.min(innerHeight/(this.#golf_map.height*10),innerWidth/(this.#golf_map.width*10));
    this.#canvas.width=this.#golf_map.width*10*this.#canvas_scale;
    this.#canvas.height=this.#golf_map.height*10*this.#canvas_scale;
    this.#ctx.scale(this.#canvas_scale,this.#canvas_scale);
    for(let y=0;y<this.#golf_map.height;++y)
    {
      for(let x=0;x<this.#golf_map.width;++x)
      {
        if(this.#golf_map.map[y][x]==GolfMap.ObjectType.Wall)
          this.#ctx.fillStyle="green";
        else
          this.#ctx.fillStyle="lime";
        this.#ctx.fillRect(x*10,y*10,10,10);
        if(this.#golf_map.map[y][x]==GolfMap.ObjectType.Hole)
        {
          this.#ctx.arc(x*10+5,y*10+5,3,0,2*Math.PI);
          this.#ctx.fillStyle="black";
          this.#ctx.fill();
        }
        else if(this.#golf_map.map[y][x]==GolfMap.ObjectType.Start)
        {
          this.#ctx.beginPath();
          this.#ctx.moveTo(x*10+2,y*10+5);
          this.#ctx.lineTo(x*10+8,y*10+5);
          this.#ctx.lineTo(x*10+5,y*10+10);
          this.#ctx.closePath();
          this.#ctx.fillStyle="white";
          this.#ctx.fill();
        }
      }
    }
  }

  async #getMap(input)
  {
    try
    {
      if(input.files.length==0)
        throw new Error("No file!");
      const file=input.files[0];
      if(!file.type.startsWith("image/"))
        throw new Error("Invalid file type!");
      const bitmap=await createImageBitmap(file);
      return new GolfMap(bitmap);
    }
    catch(e)
    {
      console.error(e);
    }
  }

  async #loadPage(page)
  {
    const html=await fetch("pages/"+page+".html").then((data)=>data.text());
    document.body.innerHTML=html;
  }
}

import GolfMap from "./GolfMap.js"
import Ball from "./Ball.js"
import Obstacle from "./Obstacle.js";

export default class GameScreen
{
  #canvas_scale;
  #canvas;
  #ctx;
  #golf_map;
  #ball;
  #obstacles;

  constructor()
  {
    this.#obstacles=[];
    const start_button=document.getElementById("start_button");
    start_button.addEventListener("click",async (e)=>{
       this.#loadPlayersMenu();
    });
  }

  #getObstacles(){
    for(let y=0;y<this.#golf_map.height;++y)
    {
      for(let x=0;x<this.#golf_map.width;++x)
      {
        if(this.#golf_map.map[y][x]==GolfMap.ObjectType.Wall){
          this.#obstacles.push(new Obstacle(x*10,y*10,10,10,1));
        }
      }
    }
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
          //this.#ctx.closePath();
          this.#ctx.fillStyle="white";
          this.#ctx.fill();
        }
      }
    }
      this.#drawBall();
  }
  #drawBall(){ 

    this.#ctx.beginPath();
    this.#ctx.arc(this.#ball.x, this.#ball.y, this.#ball.radius, 0, 2 * Math.PI);
    this.#ctx.fillStyle = "red";
    this.#ctx.fill();
    //this.ctx.closePath();
  }

  async #addMap(input,mapList)
  {
    try
    {
      if(input.files.length==0)
        throw new Error("No file!");
      const file=input.files[0];
      if(!file.type.startsWith("image/"))
        throw new Error("Invalid file type!");
      const map_name=file.name.substring(0,file.name.lastIndexOf('.'));
      const map_list=Object.keys(localStorage);
      if(map_list.includes("map_"+map_name))
        throw new Error("Map named \""+map_name+"\" ready in library!");
      const bitmap=await createImageBitmap(file);
      const map=new GolfMap(null,null,null);
      map.fromBitmap(bitmap);
      localStorage.setItem("map_"+map_name,map.serialize());
      this.#showMapList(mapList);
    }
    catch(e)
    {
      console.error(e);
      return e;
    }
  }

  #showMapList(parentBox)
  {
    parentBox.innerHTML="";
    const map_list=Object.keys(localStorage);
    if(map_list.length==0)
      parentBox.innerHTML="Brak wczytanych map";
    else
      map_list.forEach((map_name)=>{
        const field=document.createElement("div");
        field.className="map_field";
        const field_name=document.createElement("div");
        field_name.innerHTML=map_name.substr(4);
        field_name.className="map_field_name";
        const field_remove=document.createElement("div");
        field_remove.innerHTML="Remove";
        field_remove.className="map_field_remove";
        field.appendChild(field_name);
        field.appendChild(field_remove);
        parentBox.appendChild(field);
        field.addEventListener("click",()=>{
          this.#golf_map=GolfMap.deserialize(localStorage.getItem(map_name));
        });
        field_remove.addEventListener("click",()=>{
          localStorage.removeItem(map_name);
          this.#showMapList(parentBox);
        });
      });
  }

  async #loadPage(page)
  {
    const html=await fetch("pages/"+page+".html").then((data)=>data.text());
    document.body.innerHTML=html;
  }

  async #loadPlayersMenu() {
    await this.#loadPage("PlayersMenu");
    const map_selection_button=document.getElementById("map_selection_button");
    const go_back_button_players=document.getElementById("go_back_button_players");
    map_selection_button.addEventListener("click",async (e)=>{
      this.#loadMapSelectionMenu()
    });
    go_back_button_players.addEventListener("click", async(e)=>{
      this.#loadMainMenuScreen();
    });
  }


  async #loadMapSelectionMenu() {
    await this.#loadPage("MapSelectionMenu");
    const start_game_button=document.getElementById("start_game_button");
    const map_fields_container=document.getElementById("map_fields_container");
    const go_back_button_maps = document.getElementById("go_back_button_maps");
    var status_message=document.getElementById('status_message');
    const map_upload=document.getElementById("map_upload");
    this.#showMapList(map_fields_container);
    map_upload.addEventListener("change",async (e)=>{
      this.#loadMapLoadedPrompt(map_upload, map_fields_container);
    });
    start_game_button.addEventListener("click",async (e)=>{
      this.#loadGameScreen();
    });
    go_back_button_maps.addEventListener("click", async(e)=>{
      this.#loadPlayersMenu();
    });
  }

  async #loadMapLoadedPrompt(map_upload, map_fields_container) {
    this.#golf_map=await this.#addMap(map_upload, map_fields_container);
    if(this.#golf_map instanceof Error){
       status_message.style.visibility='visible';
       status_message.innerHTML = this.#golf_map.message;
    }
    else{
      status_message.style.visibility='visible';
      status_message.innerHTML = 'Załadowano mapę';
    }
  }

  async #loadGameScreen() {
    if(this.#golf_map!=null && this.#golf_map instanceof GolfMap)
    {
      await this.#loadPage("GameScreen");
      this.#canvas=document.getElementById("game_screen");
      this.#ctx=this.#canvas.getContext("2d");
      this.#canvas_scale=Math.min(innerHeight/(this.#golf_map.height*10),innerWidth/(this.#golf_map.width*10));
      this.#canvas.width=this.#golf_map.width*10*this.#canvas_scale;
      this.#canvas.height=this.#golf_map.height*10*this.#canvas_scale;
      this.#ctx.scale(this.#canvas_scale,this.#canvas_scale);
      this.#getObstacles();
      this.#ball= new Ball(this.#canvas,  0.95, 15, this.#ctx,this.#drawMap.bind(this),this.#obstacles);
      this.#ball.getScale(this.#canvas_scale);
      console.log(this.#ball);
      this.#drawMap();
      addEventListener("resize",(e)=>{
        this.#drawMap();
        this.#ball.getScale(this.#canvas_scale);
        this.#ball.rect = this.#canvas.getBoundingClientRect();;
      });
    }
  }

  async #loadMainMenuScreen() {
    await this.#loadPage("MainMenu");
    const start_button = document.getElementById("start_button");
    start_button.addEventListener("click", (e)=>{
      this.#loadPlayersMenu();
    })
  }
  
}

import GolfMap from "./GolfMap.js"
import GolfBall from "./GolfBall.js"
import Obstacle from "./Obstacle.js";

export default class GameScreen
{
  #canvas_scale;
  #canvas;
  #ctx;
  #golf_map;
  #balls=[];
  #obstacles=[];
  #playerCount=4;
  #activePlayers=4;
  #turn=0;
  #isMouseDown=false;

  constructor()
  {
    const start_button=document.getElementById("start_button");
    start_button.addEventListener("click",async ()=>{
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

  #renderMap()
  {
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
          this.#ctx.beginPath();
          this.#ctx.arc(x*10+5,y*10+5,3,0,2*Math.PI);
          this.#ctx.closePath();
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

  #resizeCallback()
  {
    this.#canvas_scale=Math.min(innerHeight/(this.#golf_map.height*10),innerWidth/(this.#golf_map.width*10));
    this.#canvas.width=this.#golf_map.width*10*this.#canvas_scale;
    this.#canvas.height=this.#golf_map.height*10*this.#canvas_scale;
    this.#ctx.scale(this.#canvas_scale,this.#canvas_scale);
  }

  #drawCallback()
  {
    this.#renderMap();
    if(!this.#balls[this.#turn].hasWon)
    {
      for(let i=this.#playerCount-1;i>=0;--i)
      {
        if(i==this.#turn||this.#balls[i].hasWon)
          continue;
        this.#ctx.beginPath();
        this.#ctx.arc(this.#balls[i].pos.x,this.#balls[i].pos.y,3,0,2*Math.PI);
        this.#ctx.closePath();
        this.#ctx.fillStyle=this.#balls[i].color;
        this.#ctx.fill();
      }
      this.#ctx.beginPath();
      this.#ctx.arc(this.#balls[this.#turn].pos.x,this.#balls[this.#turn].pos.y,3,0,2*Math.PI);
      this.#ctx.closePath();
      this.#ctx.fillStyle=this.#balls[this.#turn].color;
      this.#ctx.fill();
      if(this.#balls[this.#turn].isMoving)
      {
        this.#balls[this.#turn].move();
        if(!this.#balls[this.#turn].isMoving)
        {
          if(this.#isInsideBall(this.#golf_map.endPoint.x,this.#golf_map.endPoint.y,this.#balls[this.#turn]))
          {
            console.log("Gracz "+(this.#turn+1)+" wygrał wykonując "+this.#balls[this.#turn].strikeCount+" ruchów!");
            this.#balls[this.#turn].win();
          }
          let guard=0;
          do
          {
            ++this.#turn;
            this.#turn%=this.#playerCount;
            ++guard;
          }
          while(guard!=4&&this.#balls[this.#turn].hasWon);
          if(guard==4)
            console.log("Wszyscy gracze wygrali!");
          else
            console.log("turn "+this.#turn+"!");
        }
      }
    }
    requestAnimationFrame(()=>{this.#drawCallback()});
  }

  #isInsideBall(x, y, ball) {
    const distance = Math.sqrt((x - ball.pos.x) ** 2 + (y - ball.pos.y) ** 2);
    return distance <= 3;
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
        field_name.innerHTML=map_name.substring(4);
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
    map_selection_button.addEventListener("click",async ()=>{
      this.#loadMapSelectionMenu()
    });
    go_back_button_players.addEventListener("click", async ()=>{
      this.#loadMainMenuScreen();
    });
  }


  async #loadMapSelectionMenu() {
    await this.#loadPage("MapSelectionMenu");
    const start_game_button=document.getElementById("start_game_button");
    const map_fields_container=document.getElementById("map_fields_container");
    const go_back_button_maps = document.getElementById("go_back_button_maps");
    const map_upload=document.getElementById("map_upload");
    this.#showMapList(map_fields_container);
    map_upload.addEventListener("change",async ()=>{
      this.#loadMapLoadedPrompt(map_upload, map_fields_container);
    });
    start_game_button.addEventListener("click",async ()=>{
      this.#loadGameScreen();
    });
    go_back_button_maps.addEventListener("click", async ()=>{
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
      this.#getObstacles();
      for(let i=0;i<this.#playerCount;++i)
        this.#balls.push(new GolfBall(this.#golf_map,this.#obstacles));
      this.#canvas=document.getElementById("game_screen");
      this.#ctx=this.#canvas.getContext("2d");
      this.#resizeCallback();
      this.#drawCallback();
      addEventListener("resize",()=>{
        this.#resizeCallback();
      });
      this.#canvas.addEventListener("mousedown", (event) => {
        const mouseX = event.offsetX/this.#canvas_scale;
        const mouseY = event.offsetY/this.#canvas_scale;
        if (!this.#balls[this.#turn].isMoving&&this.#isInsideBall(mouseX, mouseY, this.#balls[this.#turn])) {
          this.#isMouseDown = true;
        }
      });
      document.addEventListener("mouseup", (event) => {
        if (this.#isMouseDown) {
          const mouseX = event.offsetX/this.#canvas_scale;
          const mouseY = event.offsetY/this.#canvas_scale;
          this.#balls[this.#turn].setSpeed(mouseX,mouseY);
          console.log("go "+this.#turn+"!")
        }
        this.#isMouseDown = false;
      });
    }
  }

  async #loadMainMenuScreen() {
    await this.#loadPage("MainMenu");
    const start_button = document.getElementById("start_button");
    start_button.addEventListener("click", ()=>{
      this.#loadPlayersMenu();
    })
  }
}

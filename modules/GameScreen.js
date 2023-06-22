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
  #playerCount=1;
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
          this.#ctx.fillStyle="#143506";
        else if(this.#golf_map.map[y][x]==GolfMap.ObjectType.Sand)
          this.#ctx.fillStyle="#d5cb98";
        else if(this.#golf_map.map[y][x]==GolfMap.ObjectType.Gravel)
          this.#ctx.fillStyle="#494949";
        else
          this.#ctx.fillStyle="#508928";
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
    this.#canvas_scale=Math.min(0.9*innerHeight/(this.#golf_map.height*10),innerWidth/(this.#golf_map.width*10));
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
        if(this.#isInsideBall(this.#golf_map.endPoint.x,this.#golf_map.endPoint.y,this.#balls[this.#turn]))
        {
          document.querySelector("#player"+this.#turn+" .player_info_ball svg").style.display="initial";
          this.#balls[this.#turn].win();
          this.#change_turn();
        }
        else if(!this.#balls[this.#turn].isMoving)
        {
          this.#change_turn();
        }
      }
    }
    requestAnimationFrame(()=>{this.#drawCallback()});
  }

  #change_turn()
  {
    document.querySelector("#player"+this.#turn+" .player_info_text").innerHTML=this.#balls[this.#turn].strikeCount;
    document.querySelector("#player"+this.#turn+" .player_info_ball").style.border="";
    let guard=0;
    do
    {
      ++this.#turn;
      this.#turn%=this.#playerCount;
      ++guard;
    }
    while(guard!=4&&this.#balls[this.#turn].hasWon);
    if(guard==4)
      this.#end_prompt();
    else
    {
      document.querySelector("#player"+this.#turn+" .player_info_ball").style.border="0.5vh solid black";
      document.querySelector("#player"+this.#turn+" .player_info_ball").style.borderRadius="3.5vh";
    }
    
  }

  #end_prompt()
  {
    const end=document.createElement("div");
    end.id="end_prompt";
    document.body.appendChild(end);
    const end_text=document.createElement("div");
    end_text.innerHTML="Wszyscy gracze wygrali";
    end.appendChild(end_text);
    end_text.id="end_text";
    const end_button=document.createElement("div");
    end_button.innerHTML="Powrót do menu";
    end.appendChild(end_button);
    end_button.id="end_button";
    end_button.addEventListener("click",()=>{
      location.reload();
    })
  }

  #tutorial_prompt()
  {
    const tutorial=document.createElement("div");
    tutorial.id="tutorial_prompt";
    document.body.appendChild(tutorial);
    const tutorial_text=document.createElement("div");
    tutorial_text.innerHTML="TUTORIAL<br/>Poruszaj swoją piłką przeciągając myszą<br/>Gra się kończy gdy wszyscy gracze trafią do dołka";
    tutorial.appendChild(tutorial_text);
    tutorial_text.id="tutorial_text";
    const begin_button=document.createElement("div");
    begin_button.innerHTML="OK";
    tutorial.appendChild(begin_button);
    begin_button.id="begin_button";
    begin_button.addEventListener("click",()=>{
      tutorial.remove();
    })
  }

  #isInsideBall(x, y, ball) {
    const distance = Math.sqrt((x - ball.pos.x) ** 2 + (y - ball.pos.y) ** 2);
    return distance <= 3;
  }
  
  async #addMap(input,mapList)
  {
    if(input.files.length==0)
      throw new Error("Brak pliku!");
    const file=input.files[0];
    if(!file.type.startsWith("image/"))
      throw new Error("Niepoprawny typ pliku!");
    const map_name=file.name.substring(0,file.name.lastIndexOf('.'));
    const map_list=Object.keys(localStorage);
    if(map_list.includes("map_"+map_name))
      throw new Error("Mapa nazwana \""+map_name+"\" już istnieje w bibliotece!");
    const bitmap=await createImageBitmap(file);
    const map=new GolfMap(null,null,null);
    map.fromBitmap(bitmap);
    localStorage.setItem("map_"+map_name,map.serialize());
    this.#showMapList(mapList);
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
        field_remove.innerHTML="Usuń";
        field_remove.className="map_field_remove";
        field.appendChild(field_name);
        field.appendChild(field_remove);
        parentBox.appendChild(field);
        field.addEventListener("click",()=>{
          this.#golf_map=GolfMap.deserialize(localStorage.getItem(map_name));
          parentBox.childNodes.forEach((e)=>{
            e.style="";
          });
          field.style="background-color:wheat";
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
    const remove_player_button=document.getElementById("remove_player_button");
    const add_player_button=document.getElementById("add_player_button");
    const player_number_display=document.getElementById("player_number_display");
    player_number_display.innerHTML=this.#playerCount;
    remove_player_button.addEventListener("click",()=>{
      if(this.#playerCount>1)
      {
        --this.#playerCount;
        player_number_display.innerHTML=this.#playerCount;
      }
    });
    add_player_button.addEventListener("click",()=>{
      if(this.#playerCount<4)
      {
        ++this.#playerCount;
        player_number_display.innerHTML=this.#playerCount;
      }
    });
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
    const status_message = document.getElementById("status_message");
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
    status_message.querySelector("#status_button").addEventListener("click",async ()=>{
      status_message.style.display="none";
    });
  }

  async #loadMapLoadedPrompt(map_upload, map_fields_container) {
    try
    {
      await this.#addMap(map_upload, map_fields_container);
    }
    catch(e)
    {
      status_message.querySelector("#status_text").innerHTML = e.message;
      status_message.style.display='initial';
    }
  }

  async #loadGameScreen() {
    if(this.#golf_map!=null && this.#golf_map instanceof GolfMap)
    {
      await this.#loadPage("GameScreen");
      this.#tutorial_prompt();
      this.#getObstacles();
      const colors=["red","magenta","orange","blue"];
      for(let i=0;i<this.#playerCount;++i)
      {
        this.#balls.push(new GolfBall(this.#golf_map,this.#obstacles,colors[i]));
        const player_info=document.getElementById("player_info");
        const player_info_box=document.createElement("div");
        player_info_box.className="player_info_box";
        player_info_box.id="player"+i;
        player_info.appendChild(player_info_box);
        const player_info_ball=document.createElement("div");
        player_info_ball.innerHTML="<svg viewBox='0 0 100 80' width='6vh' style='display:none;transform:translate(0,-4vh);'><polygon points='0,80 100,80 100,0 75,50 50,0 25,50 0,0' style='fill:yellow;'/></svg>";
        player_info_ball.className="player_info_ball";
        player_info_ball.style="background-color: "+colors[i];
        player_info_box.appendChild(player_info_ball);
        const player_info_text=document.createElement("div");
        player_info_text.className="player_info_text";
        player_info_text.innerHTML=this.#balls[i].strikeCount;
        player_info_box.appendChild(player_info_text);

      }
      document.querySelector("#player"+this.#turn+" .player_info_ball").style.border="0.5vh solid black";
      document.querySelector("#player"+this.#turn+" .player_info_ball").style.borderRadius="3.5vh";
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

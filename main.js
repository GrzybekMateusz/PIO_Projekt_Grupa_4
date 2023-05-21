import GolfMap from "./modules/GolfMap.js"

async function getMap(input)
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

//część do przeniesienia do kodu renderującego
function drawMap(gm)
{
  const canvas=document.createElement("canvas");
  const ctx=canvas.getContext("2d");
  let scale;
  if(innerWidth/(gm.width*40)>innerHeight/(gm.height*40))
    scale=innerHeight/(gm.height*40);
  else
    scale=innerWidth/(gm.width*40);
  canvas.width=gm.width*40*scale;
  canvas.height=gm.height*40*scale;
  ctx.scale(scale,scale);
  document.body.appendChild(canvas);
  addEventListener("resize",(e)=>{
    if(innerWidth/(gm.width*40)>innerHeight/(gm.height*40))
      scale=innerHeight/(gm.height*40);
    else
      scale=innerWidth/(gm.width*40);
    canvas.width=gm.width*40*scale;
    canvas.height=gm.height*40*scale;
    ctx.scale(scale,scale);
    for(let y=0;y<gm.height;++y)
    {
      for(let x=0;x<gm.width;++x)
      {
        if(gm.map[y][x]==GolfMap.ObjectType.Wall)
          ctx.fillStyle="green";
        else
          ctx.fillStyle="lime";
        ctx.fillRect(x*40,y*40,40,40);
        if(gm.map[y][x]==GolfMap.ObjectType.Hole)
        {
          ctx.arc(x*40+20,y*40+20,10,0,2*Math.PI);
          ctx.fillStyle="black";
          ctx.fill();
        }
        else if(gm.map[y][x]==GolfMap.ObjectType.Start)
        {
          ctx.beginPath();
          ctx.moveTo(x*40+10,y*40+20);
          ctx.lineTo(x*40+30,y*40+20);
          ctx.lineTo(x*40+20,y*40+40);
          ctx.closePath();
          ctx.fillStyle="white";
          ctx.fill();
        }
      }
    }
  });
  for(let y=0;y<gm.height;++y)
  {
    for(let x=0;x<gm.width;++x)
    {
      if(gm.map[y][x]==GolfMap.ObjectType.Wall)
        ctx.fillStyle="green";
      else
        ctx.fillStyle="lime";
      ctx.fillRect(x*40,y*40,40,40);
      if(gm.map[y][x]==GolfMap.ObjectType.Hole)
      {
        ctx.arc(x*40+20,y*40+20,10,0,2*Math.PI);
        ctx.fillStyle="black";
        ctx.fill();
      }
      else if(gm.map[y][x]==GolfMap.ObjectType.Start)
      {
        ctx.beginPath();
        ctx.moveTo(x*40+10,y*40+20);
        ctx.lineTo(x*40+30,y*40+20);
        ctx.lineTo(x*40+20,y*40+40);
        ctx.closePath();
        ctx.fillStyle="white";
        ctx.fill();
      }
    }
  }
}

async function loadPage(page)
{
  const html=await fetch("pages/"+page+".html").then((data)=>data.text());
  document.body.innerHTML=html;
}

const start_button=document.getElementById("start_button");
start_button.addEventListener("click",async (e)=>{
  await loadPage("PlayersMenu");
  const map_selection_button=document.getElementById("map_selection_button");
  map_selection_button.addEventListener("click",async (e)=>{
    await loadPage("MapSelectionMenu");
    const start_game_button=document.getElementById("start_game_button");
    const map_upload=document.getElementById("map_upload");
    let gm=null;
    start_game_button.addEventListener("click",async (e)=>{
      if(gm!=null)
      {
        await loadPage("GameScreen");
        drawMap(gm);
      }
    });
    map_upload.addEventListener("change",async (e)=>{
      gm=await getMap(map_upload);
      e.preventDefault();
    });
  });
});

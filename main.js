import GolfMap from "./modules/GolfMap.js"

async function handle(input)
{
  try
  {
    if(input.files.length==0)
      throw new Error("No file!");
    const file=input.files[0];
    if(!file.type.startsWith("image/"))
      throw new Error("Invalid file type!");
    const bitmap=await createImageBitmap(file);
    const gm=new GolfMap(bitmap);
    map_form.style="display:none;";
    const canvas=document.createElement("canvas");
    const ctx=canvas.getContext("2d");
    canvas.width=gm.width*40;
    canvas.height=gm.height*40;
    document.body.appendChild(canvas);
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
  catch(e)
  {
    console.error(e);
  }
}

const map_upload=document.getElementById("map_upload");
const map_form=document.getElementById("map_form");
map_form.addEventListener("submit",(e)=>{handle(map_upload);e.preventDefault()});

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
    let gm=new GolfMap(bitmap);
    console.log(gm);
  }
  catch(e)
  {
    console.error(e);
  }
}

const map_upload=document.getElementById("map_upload");
const map_form=document.getElementById("map_form");
map_form.addEventListener("submit",(e)=>{handle(map_upload);e.preventDefault()});

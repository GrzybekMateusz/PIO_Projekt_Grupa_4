import GolfMap from "./modules/GolfMap.js"

const map_upload=document.getElementById("map_upload");
const map_form=document.getElementById("map_form");
map_form.addEventListener("submit",(e)=>{let gm=new GolfMap(map_upload);console.log(gm.map);e.preventDefault();});

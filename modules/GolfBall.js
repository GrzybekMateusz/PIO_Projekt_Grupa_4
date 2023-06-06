import GolfMap from "./GolfMap.js";
import Point from "./Point.js";

export default class GolfBall
{
  #pos;
  #mapData;
  #obstacles;
  #xSpeed=0;
  #ySpeed=0;

  constructor(m,o)
  {
    this.#pos=m.startPoint;
    this.#mapData=m;
    this.#obstacles=o;
  }

  // zwraca true jeżeli piłka się zatrzyma
  move()
  {
    const ballRadius=3;
    if(this.#pos.x-ballRadius+this.#xSpeed<=0||this.#pos.x+ballRadius+this.#xSpeed>=this.#mapData.width*10)
      this.#xSpeed*=-1;
    if(this.#pos.y-ballRadius+this.#ySpeed<=0||this.#pos.y+ballRadius+this.#ySpeed>=this.#mapData.height*10)
      this.#ySpeed*=-1;
    for(let i in this.#obstacles){
      let check=this.#intersects(this.#obstacles[i],new Point(this.#pos.x+this.#xSpeed,this.#pos.y+this.#ySpeed));
      if(check==11)
        this.#xSpeed*=-1;
      else if(check==22)
        this.#ySpeed*=-1;
    }
    this.#pos.x+=this.#xSpeed;
    this.#pos.y+=this.#ySpeed;
    this.#xSpeed*=0.99;
    this.#ySpeed*=0.99;
    if(Math.abs(this.#xSpeed)<0.3&&Math.abs(this.#ySpeed)<0.3)
      return true;
    else
      return false;
  }

  setSpeed(mouseX,mouseY)
  {
    const maxSpeed=15;
    let xSpeed=mouseX-this.#pos.x;
    let ySpeed=mouseY-this.#pos.y;
    if(Math.abs(xSpeed)<=3)
      xSpeed=0;
    if(Math.abs(ySpeed)<=3)
      ySpeed=0;
    xSpeed/=20;
    ySpeed/=20;
    if(Math.abs(xSpeed)>maxSpeed)
      xSpeed=Math.sign(xSpeed)*maxSpeed;
    if(Math.abs(ySpeed)>maxSpeed)
      ySpeed=Math.sign(ySpeed)*maxSpeed;
    this.#xSpeed=xSpeed;
    this.#ySpeed=ySpeed;
  }

  #intersects(rect,pos) {
    const ballRadius=3;
    let circleDistancex = Math.abs(pos.x - rect.x-rect.width/2);
    let circleDistancey = Math.abs(pos.y - rect.y-rect.height/2);

    if (circleDistancex > (rect.width/2 + ballRadius)) { return false; }
    if (circleDistancey > (rect.height/2 + ballRadius)) { return false; }

    if (circleDistancex <= (rect.width/2)) { return 22; } 
    if (circleDistancey <= (rect.height/2)) { return 11; }

    let cornerDistanceSq = Math.sqrt(circleDistancex - rect.width/2) +
    Math.sqrt(circleDistancey - rect.height/2);

    if(cornerDistanceSq <= (Math.sqrt(ballRadius))) return 11;
  }

  get pos()
  {
    return this.#pos;
  }
}

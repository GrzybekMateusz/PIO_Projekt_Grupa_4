import GolfMap from "./GolfMap.js";
import Point from "./Point.js";

export default class GolfBall
{
  #pos;
  #mapData;
  #obstacles;
  #xSpeed=0;
  #ySpeed=0;
  #color='#'+(0x1000000+Math.random()*0xffffff).toString(16).substring(1,7);
  #hasWon=false;
  #isMoving=false;
  #strikeCount=0;
  #friction=0.99;

  constructor(m,o,c)
  {
    this.#pos=m.startPoint;
    this.#mapData=m;
    this.#obstacles=o;
    this.#color=c;
  }

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
    switch(this.#mapData.typeAtPoint(this.#pos))
    {
      case GolfMap.ObjectType.Sand:
        this.#friction=0.97;
        break;
      case GolfMap.ObjectType.Gravel:
        this.#friction=0.95;
        break;
      default:
        this.#friction=0.99;
        break;
    }
    this.#xSpeed*=this.#friction;
    this.#ySpeed*=this.#friction;
    if(Math.abs(this.#xSpeed)<0.01&&Math.abs(this.#ySpeed)<0.01)
      this.#isMoving=false;
    else
      this.#isMoving=true;
  }

  setSpeed(mouseX,mouseY)
  {
    const maxSpeed=15;
    const slope=1.5;
    const inputScale=0.1;
    let xSpeed=mouseX-this.#pos.x;
    let ySpeed=mouseY-this.#pos.y;
    if(Math.abs(xSpeed)<=3)
      xSpeed=0;
    if(Math.abs(ySpeed)<=3)
      ySpeed=0;
    xSpeed*=inputScale;
    ySpeed*=inputScale;
    if(Math.abs(xSpeed)>maxSpeed)
      xSpeed=maxSpeed;
    if(Math.abs(ySpeed)>maxSpeed)
      ySpeed=maxSpeed;
    this.#xSpeed=Math.sign(xSpeed)*(1/Math.pow(maxSpeed,slope-1))*Math.pow(Math.abs(xSpeed),slope);
    this.#ySpeed=Math.sign(ySpeed)*(1/Math.pow(maxSpeed,slope-1))*Math.pow(Math.abs(ySpeed),slope);
    ++this.#strikeCount;
    this.#isMoving=true;
  }

  win()
  {
    this.#hasWon=true;
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

  get isMoving()
  {
    return this.#isMoving;
  }

  get strikeCount()
  {
    return this.#strikeCount;
  }

  get color()
  {
    return this.#color;
  }

  get hasWon()
  {
    return this.#hasWon;
  }
}

import GolfMap from "./GolfMap.js";
import Point from "./Point.js";

export default class GolfBall
{
  #pos;
  #xDirection=1;
  #yDirection=1;
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

  move()
  {
    const ballRadius=3;
    let xs=Math.floor(this.#xSpeed);
    let ys=Math.floor(this.#ySpeed);
    if(xs==0&&ys==0)
      return;
    let tpos=new Point(this.#pos.x,this.#pos.y);
    while(xs!=0||ys!=0)
    {
      /*const t=Math.floor(tpos.y-ballRadius);
      const b=Math.floor(tpos.y+ballRadius);
      const l=Math.floor(tpos.x-ballRadius);
      const r=Math.floor(tpos.x+ballRadius);
      if(t%10==0)
      {
        if(t==0
        ||(l!=0
          &&this.#mapData.typeAtPoint(new Point(l-1,t-1))==GolfMap.ObjectType.Wall
          &&this.#mapData.typeAtPoint(new Point(l-1,b))!=GolfMap.ObjectType.Wall)
        ||(r!=this.#mapData.width*10
          &&this.#mapData.typeAtPoint(new Point(r,t-1))==GolfMap.ObjectType.Wall
          &&this.#mapData.typeAtPoint(new Point(r,b))==GolfMap.ObjectType.Wall))
            this.#yDirection*=-1;
      }
      if(b%10==0)
      {
        if(b==this.#mapData.height*10
        ||(l!=0
          &&this.#mapData.typeAtPoint(new Point(l-1,b))==GolfMap.ObjectType.Wall
          &&this.#mapData.typeAtPoint(new Point(l-1,t))!=GolfMap.ObjectType.Wall)
        ||(r!=this.#mapData.width*10
          &&this.#mapData.typeAtPoint(new Point(r,b))==GolfMap.ObjectType.Wall
          &&this.#mapData.typeAtPoint(new Point(r,t))!=GolfMap.ObjectType.Wall))
            this.#yDirection*=-1;
      }
      if(l%10==0)
      {
        if(l==0
        ||(t!=0
          &&this.#mapData.typeAtPoint(new Point(l-1,t-1))==GolfMap.ObjectType.Wall
          &&this.#mapData.typeAtPoint(new Point(r,t-1))!=GolfMap.ObjectType.Wall)
        ||(b!=this.#mapData.height*10
          &&this.#mapData.typeAtPoint(new Point(l-1,b))==GolfMap.ObjectType.Wall
          &&this.#mapData.typeAtPoint(new Point(r,b))!=GolfMap.ObjectType.Wall))
            this.#xDirection*=-1;
      }
      if(r%10==0)
      {
        if(r==this.#mapData.width*10
        ||(t!=0
          &&this.#mapData.typeAtPoint(new Point(r,t-1))==GolfMap.ObjectType.Wall
          &&this.#mapData.typeAtPoint(new Point(l,t-1))!=GolfMap.ObjectType.Wall)
        ||(b!=this.#mapData.height*10
          &&this.#mapData.typeAtPoint(new Point(r,b))==GolfMap.ObjectType.Wall
          &&this.#mapData.typeAtPoint(new Point(l,b))!=GolfMap.ObjectType.Wall))
            this.#xDirection*=-1;
      }*/
      if(tpos.x-ballRadius<=0||tpos.x+ballRadius>=this.#mapData.width*10)
          this.#xDirection*=-1;
      if(tpos.y-ballRadius<=0||tpos.y+ballRadius>=this.#mapData.height*10)
          this.#yDirection*=-1;
      for(let i in this.#obstacles){
        let check = this.#intersects(this.#obstacles[i],tpos);
    
        if(check == 11){
          this.#xDirection*=-1;
        }
        else if(check == 22){
          this.#yDirection*=-1;
        }
      }
      if(xs!=0)
      {
        tpos.x+=this.#xDirection;
        --xs;
      }
      if(ys!=0)
      {
        tpos.y+=this.#yDirection;
        --ys;
      }
    }
    this.#pos.x=tpos.x;
    this.#pos.y=tpos.y;
    console.log("x: "+this.#pos.x+" y:"+this.#pos.y);
    this.#xSpeed*=0.99;
    this.#ySpeed*=0.99;
  }

  setSpeed(mouseX,mouseY)
  {
    const distance = this.#getVectors(mouseX, mouseY);
    const speedValues = this.#calculateSpeed(distance[0], distance[1]);
    console.log("x: "+speedValues[0]+" y: "+speedValues[1]);
    this.#xDirection=Math.sign(speedValues[0]);
    this.#yDirection=Math.sign(speedValues[1]);
    this.#xSpeed=Math.abs(speedValues[0]);
    this.#ySpeed=Math.abs(speedValues[1]);
  }

  #getVectors(mouse_x, mouse_y) {
    let mouseX = mouse_x - this.#pos.x;
    let mouseY = mouse_y - this.#pos.y;

    if (Math.abs(mouseX) <= this.radius / 2) {
      mouseX = 0;
    }

    if (Math.abs(mouseY) <= this.radius / 2) {
      mouseY = 0;
    }

    return [mouseX, mouseY];
  }
  
  #calculateSpeed(speed_x, speed_y) {
    const max_speed=15;
    speed_x /= 2;
    speed_y /= 2;

    if (Math.abs(speed_x) < 1) {
      speed_x = 0;
    }

    if (Math.abs(speed_x) > max_speed) {
      if (speed_x < 0) {
        speed_x = -max_speed;
      } else {
        speed_x = max_speed;
      }
    }

    if (Math.abs(speed_y) < 1) {
      speed_y = 0;
    }

    if (Math.abs(speed_y) > max_speed) {
      if (speed_y < 0) {
        speed_y = -max_speed;
      } else {
        speed_y = max_speed;
      }
    }

    return [speed_x, speed_y];
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

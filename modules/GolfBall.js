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
    const ballRadius=1.5;
    if(this.#pos.x-ballRadius<=0||this.#pos.x+ballRadius>=this.#mapData.width*10)
      this.#xDirection*=-1;
    if(this.#pos.y-ballRadius<=0||this.#pos.y+ballRadius>=this.#mapData.height*10)
      this.#yDirection*=-1;
    for(let i in this.#obstacles){
      let check = this.#intersects(this.#obstacles[i]);
    
      if(check == 11){
        this.#xDirection*=-1;
      }
      else if(check == 22){
        this.#yDirection*=-1;
      }
    }
    this.#pos.y+=this.#yDirection*this.#ySpeed;
    this.#pos.x+=this.#xDirection*this.#xSpeed;
    //this.#xSpeed*=0.001;
    //this.#ySpeed*=0.001;
  }

  setSpeed(mouseX,mouseY)
  {
      const distance = this.#getVectors(mouseX, mouseY);
      const speedValues = this.#calculateSpeed(distance[0], distance[1]);
      this.#xSpeed=speedValues[0];
      this.#ySpeed=speedValues[1];
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

    if (Math.abs(speed_y) > this.max_speed) {
      if (speed_y < 0) {
        speed_y = -this.max_speed;
      } else {
        speed_y = this.max_speed;
      }
    }

    return [speed_x, speed_y];
  }

  #intersects(rect) {
    const ballRadius=1.5;
    let circleDistancex = Math.abs(this.#pos.x - rect.x-rect.width/2);
    let circleDistancey = Math.abs(this.#pos.y - rect.y-rect.height/2);

    if (circleDistancex > (rect.width/2 + ballRadius)) { return false; }
    if (circleDistancey > (rect.height/2 + ballRadius)) { return false; }

    if (circleDistancex <= (rect.width/2)) { return 22; } 
    if (circleDistancey <= (rect.height/2)) { return 11; }

    let cornerDistanceSq = Math.sqrt(circleDistancex - rect.width/2) +
    Math.sqrt(circleDistancey - rect.height/2);

    if(cornerDistanceSq <= (Math.sqrt(this.radius))) return 11;
  }

  get pos()
  {
    return this.#pos;
  }
}

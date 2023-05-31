export default class Obstacle {

    static ObjectType={
        Grass:0,
        Wall:1,
        Hole:2,
        Start:3
      }

    constructor(x,y,width,height,type){
        this.x=x;
        this.y=y;
        this.width=width;
        this.height=height;
        this.type=type;
    }
}
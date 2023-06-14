export default class Point
{
  #x;
  #y;

  constructor(x,y)
  {
    this.#x=x;
    this.#y=y;
  }

  get x()
  {
    return this.#x;
  }

  get y()
  {
    return this.#y;
  }

  set x(new_x)
  {
    this.#x=new_x;
  }

  set y(new_y)
  {
    return this.#y=new_y;
  }
}

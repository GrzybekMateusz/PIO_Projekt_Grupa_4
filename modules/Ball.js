export default class Ball {
    constructor(canvas, friction, max_speed, ctx_ball, drawMap) {
      this.isMouseDown = false;
      this.canvas = canvas;
      this.ctx = ctx_ball;
      this.isMoving = false;
      this.move = false;
      this.friction = friction;
      this.max_speed = max_speed;
      this.radius = 3;
      this.drawMap = drawMap;
      this.scale = 1;
      this.rect = canvas.getBoundingClientRect();
  
      this.x = 30;
      this.y = 30;
  
      this.canvas.addEventListener("mousedown", (event) => {
        const mouseX = (event.clientX - this.rect.left)/this.scale;
        const mouseY = (event.clientY - this.rect.top)/this.scale;
        if (this.isInsideBall(mouseX, mouseY)) {
          this.isMouseDown = true;
        }
        
      });
  
      document.addEventListener("mouseup", (event) => {
        if (this.isMouseDown) {
          
          const mouseX = (event.clientX - this.rect.left + this.radius)/this.scale;
          const mouseY = (event.clientY - this.rect.top + this.radius)/this.scale;
          const distance = this.getVectors(mouseX, mouseY);
          const speedValues = this.calculateSpeed(distance[0], distance[1]);
  
          this.move = true;
          this.moveBall(speedValues[0], speedValues[1]);
        }
        this.isMouseDown = false;
      });
  
    }
    isInsideBall(x, y) {
      const distance = Math.sqrt((x - this.x) ** 2 + (y - this.y) ** 2);
      return distance <= this.radius *this.scale;
    }
  
    getVectors(mouse_x, mouse_y) {
      let mouseX = mouse_x - this.x;
      let mouseY = mouse_y - this.y;
  
      if (Math.abs(mouseX) <= this.radius / 2) {
        mouseX = 0;
      }
  
      if (Math.abs(mouseY) <= this.radius / 2) {
        mouseY = 0;
      }
  
      return [mouseX, mouseY];
    }
  
    moveBall(speed_x, speed_y) {
      if (this.isMoving) return;
      this.isMoving = true;
      let directionX = 1;
      let directionY = 1;
  
      const updateCoordinates = () => {
        if (!this.move) return;
  
        this.x += speed_x * directionX;
        this.y += speed_y * directionY;
  
        //this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawMap();
  
        if (this.x - this.radius < 0 || this.x + this.radius > this.canvas.width/this.scale ) {
          directionX *= -1;
        }
  
        if (this.y - this.radius < 0 || this.y + this.radius > this.canvas.height/this.scale) {
          directionY *= -1;
        }
  
        speed_x *= this.friction;
        speed_y *= this.friction;
  
        if (Math.abs(speed_y) < 0.3 && Math.abs(speed_x) < 0.3) {
          this.move = false;
          this.isMoving = false;
        }
  
        requestAnimationFrame(updateCoordinates);
      };
  
      updateCoordinates();
    }
  
    calculateSpeed(speed_x, speed_y) {
      speed_x /= 2;
      speed_y /= 2;
  
      if (Math.abs(speed_x) < 1) {
        speed_x = 0;
      }
  
      if (Math.abs(speed_x) > this.max_speed) {
        if (speed_x < 0) {
          speed_x = -this.max_speed;
        } else {
          speed_x = this.max_speed;
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
    getScale(scale){
      this.scale = scale;
  
    }
  }
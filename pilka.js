class Ball {
  constructor(canvas_id, friction, max_speed) {
    this.isMouseDown = false;
    this.canvas = document.getElementById(canvas_id);
    this.ctx = this.canvas.getContext("2d");
    this.isMoving = false;
    this.move = false;
    this.friction = friction;
    this.max_speed = max_speed;
    this.radius = 15;

    this.x = this.canvas.width / 2;
    this.y = this.canvas.height / 2;

    this.canvas.addEventListener("mousedown", (event) => {
      this.isMouseDown = true;
    });

    document.addEventListener("mouseup", (event) => {
      if (this.isMouseDown) {
        const distance = this.getVectors(event.clientX, event.clientY);
        const speedValues = this.calculateSpeed(distance[0], distance[1]);

        this.move = true;
        this.moveBall(speedValues[0], speedValues[1]);
      }
      this.isMouseDown = false;
    });

    this.drawBall(); 
  }

  getVectors(mouse_x, mouse_y) {
    const rect = this.canvas.getBoundingClientRect();

    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

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

      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.drawBall();

      if (this.x - this.radius < 0 || this.x + this.radius > this.canvas.width ) {
        directionX *= -1;
      }

      if (this.y - this.radius < 0 || this.y + this.radius > this.canvas.height) {
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
    speed_x /= 8;
    speed_y /= 8;

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

  drawBall() {
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    this.ctx.fillStyle = "red";
    this.ctx.fill();
    this.ctx.closePath();
  }
}

const ball = new Ball("myCanvas", 0.99, 20);

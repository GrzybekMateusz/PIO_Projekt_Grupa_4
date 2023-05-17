class Ball {
  constructor(ball_id, friction, max_speed) {
    this.isMouseDown = false;
    this.div = document.getElementById(ball_id);
    this.isMoving = false;
    this.move = false;
    this.friction = friction;
    this.rect2 = this.div.getBoundingClientRect();
    this.max_speed = max_speed;

    this.x = this.rect2.top;
    this.y = this.rect2.left;

    this.div.addEventListener("mousedown", (event) => {
      if (event.target === this.div) {
        this.isMouseDown = true;
      }
    });

    document.addEventListener("mouseup", (event) => {
      if (this.isMouseDown) {
        const distance = this.get_vectors(event.clientX, event.clientY);
        const speedValues = this.speed_calculation(distance[0], distance[1]);

        this.move = true;
        this.moveBall(speedValues[0], speedValues[1]);
      }
      this.isMouseDown = false;
    });
  }

  get_vectors(mouse_x, mouse_y) {
    const rect = this.div.getBoundingClientRect();

    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    let mouseX = mouse_x - centerX;
    let mouseY = mouse_y - centerY;

    if (Math.abs(mouseX) <= rect.width / 2) {
      mouseX = 0;
    }

    if (Math.abs(mouseY) <= rect.height / 2) {
      mouseY = 0;
    }

    return [mouseX, mouseY];
  }

  moveBall(speed_x, speed_y) {
    if (this.isMoving) return;
    this.isMoving = true;
    let directionX = 1;
    let directionY = 1;
    const update_cor = () => {
      if (!this.move) return;
      this.x += speed_x * directionX;
      this.y += speed_y * directionY;

      this.div.style.left = this.x + "px";
      this.div.style.top = this.y + "px";

      if (this.x <= 0 || this.x >= window.innerWidth - this.div.offsetWidth) {
        directionX *= -1;
      }

      if (this.y <= 0 || this.y >= window.innerHeight - this.div.offsetHeight) {
        directionY *= -1;
      }
      speed_x *= this.friction;
      speed_y *= this.friction;
      if (Math.abs(speed_y) < 0.5 && Math.abs(speed_x) < 0.5) {
        this.move = false;
        this.isMoving = false;
      }
      requestAnimationFrame(update_cor);
    };

    update_cor();
  }

  speed_calculation(speed_x, speed_y) {
    speed_x /= -5;
    speed_y /= -5;

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
}

const ball = new Ball("ball", 0.99, 20);

//Attack_MovingCircle class
class Attack_MovingCircle extends Attack_Circle {
	constructor(startX, startY, color) {
		super(startX, startY, color);
		this.name = "Moving Circle Attack";
		this.direction = new Vector(1,0);
		this.speed = 0.5;
		this.delay = 100;
		this.bounceOffWalls = false;
	}

	extraUpdateLogic(player, boss, ctx) {
		var velocity = this.direction.normalize().multiply(this.speed);

		if (this.bounceOffWalls) {
			if (this.x < 0) {
				velocity.setX(Math.abs(velocity.getX()));
			} else if (this.x > ctx.canvas.width) {
				velocity.setX(-1 * Math.abs(velocity.getX()));
			}

			if (this.y < 0) {
				velocity.setY(Math.abs(velocity.getY()));
			} else if (this.y > ctx.canvas.height) {
				velocity.setY(-1 * Math.abs(velocity.getY()));
			}
		}

		this.x += velocity.getX();
		this.y += velocity.getY();

		this.direction = velocity;
	}
}

//SpawnEffect class
class SpawnEffect extends Effect {
	constructor(startX, startY, color) {
		super(startX, startY, color);

		this.color = color || "black";
		this.startRadius = 15;
		this.duration = 100;
	}

	//update projectile position
	update() {
		this.tickCount++;
		if (this.tickCount >= this.duration) {
			this.alive = false;
		}

		this.radius = this.startRadius * (this.tickCount / this.duration);
	}
}

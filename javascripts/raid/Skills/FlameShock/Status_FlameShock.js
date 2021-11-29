//Status_FlameShock class
class Status_FlameShock extends Status {
	constructor() {
		super();
		this.name = "Status_FlameShock";
		this.duration = 1080;
		this.damageTickDelay = 60;
		this.damagePerTick = 30;
	}

	handleStatus() {
		if (this.tickCount % this.damageTickDelay == 0) {
			this.parent.takeDamage(this.name, this.damagePerTick, this.color);
		}
	}
}

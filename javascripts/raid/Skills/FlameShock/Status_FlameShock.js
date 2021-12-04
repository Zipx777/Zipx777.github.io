//Status_FlameShock class
class Status_FlameShock extends Status {
	constructor() {
		super();
		this.name = "Status_FlameShock";
		this.duration = 18;
		this.damageTickDelay = 1;
		this.damagePerTick = 30;
	}

	handleStatus(dt) {
		if (this.timeSinceLastTick >= this.damageTickDelay) {
			this.parent.takeDamage(this.name, this.damagePerTick, this.color);
			this.timeSinceLastTick = this.timeSinceLastTick % this.damageTickDelay;
		}
	}
}

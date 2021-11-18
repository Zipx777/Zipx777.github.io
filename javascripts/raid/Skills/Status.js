//Status class
class Status {
	constructor(name) {
		this.name = name || "default_status";
		this.parent = null;
		this.damageTickDelay = 60;
		this.damagePerTick = 0;
		this.duration = 600;
		this.tickCount = 0; //can be set to negative to handle refresh overcharge buffer
		this.refreshBuffer = 180;//up to 3sec of an existing status will be saved when a new one refreshes it
		this.finished = false;
	}

	isFinished() {
		return this.finished;
	}

	//another instance of this status was applied, refresh duration with some buffer
	refresh() {
		this.tickCount -= this.duration;
		while (this.tickCount < -1 * this.refreshBuffer) {
			this.tickCount += this.damageTickDelay;
		}
	}

	//function for statuses inheriting this to override to handle specific status functionality like DoT/Debuff
	handleStatus() {

	}

	update() {
		this.tickCount++;
		this.handleStatus();
		if (this.tickCount > this.duration) {
			this.finished = true;
		}
	}
}

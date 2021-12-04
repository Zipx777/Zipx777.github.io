//Status class
class Status {
	constructor(name) {
		this.name = name || "default_status";
		this.parent = null;
		this.color = "pink";
		this.damageTickDelay = 1;
		this.timeSinceLastTick = 0;
		this.damagePerTick = 0;
		this.duration = 10;
		this.toggles = false;
		this.procChance = 1;
		this.timeElapsed = 0; //can be set to negative to handle refresh overcharge buffer
		this.refreshBuffer = 3;//up to 3sec of an existing status will be saved when a new one refreshes it
		this.finished = false;
	}

	isFinished() {
		return this.finished;
	}

	//another instance of this status was applied, refresh duration with some buffer
	refresh() {
		this.timeElapsed -= this.duration;
		while (this.timeElapsed < (-1 * this.refreshBuffer)) {
			this.timeElapsed += this.damageTickDelay;
		}
	}

	//function for statuses inheriting this to override to handle specific status functionality like DoT/Debuff
	handleStatus(dt) {

	}

	update(dt) {
		this.timeElapsed += dt;
		this.timeSinceLastTick += dt;
		this.handleStatus(dt);
		if (this.timeElapsed > this.duration && this.duration > 0) {
			this.finished = true;
		}
	}
}

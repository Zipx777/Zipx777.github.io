//Status_FeralSpirit class
class Status_FeralSpirit extends Status {
	constructor() {
		super();
		this.name = "Status_FeralSpirit";
		this.duration = 15;
		this.maelstromStackGenerateDelay = 3;
	}

	handleStatus(dt) {
		if (this.timeSinceLastTick >= this.maelstromStackGenerateDelay) {
			this.parent.addMaelstromStack();
			this.timeSinceLastTick = this.timeSinceLastTick % this.maelstromStackGenerateDelay;
		}
	}
}

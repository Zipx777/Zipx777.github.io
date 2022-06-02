//Keys class
//directionType indicates whether "wasd" or the "arrows" will be used for direction control

class RaidKeyTracker {
	constructor(startType) {
		this.type = null;
		if (startType == "arrows" || startType == "wasd") {
			this.type = startType;
		} else {
			console.log("Bad type passed to RaidKeyTracker");
			this.type = "arrows";
		}
		this.left = false;
		this.right = false;
		this.down = false;
		this.up = false;

		this.caseLeft = null;
		this.caseUp = null;
		this.caseRight = null;
		this.caseDown = null;
		this.setType(this.type);
	}

	setType(newType) {
		if (newType != "arrows" && newType != "wasd") {
			console.log("Tried to set bad type: " + newType + " on RaidKeyTracker");
			return;
		}
		this.type = newType;
		if (this.type == "arrows") {
			this.caseLeft = 37;
			this.caseUp = 38;
			this.caseRight = 39;
			this.caseDown = 40;
		} else if (this.type == "wasd") {
			this.caseLeft = 65;
			this.caseUp = 87;
			this.caseRight = 68;
			this.caseDown = 83;
		}
	}

	getType() {
		return this.type;
	}
	onKeyDown(e) {
		var keycode = e.which;
		switch(keycode) {
			case this.caseLeft:
				this.left = true;
				break;
			case this.caseUp:
				this.up = true;
				break;
			case this.caseRight:
				this.right = true;
				break;
			case this.caseDown:
				this.down = true;
				break;
		}
	}

	onKeyUp(e) {
		var keycode = e.which;
		switch(keycode) {
			case this.caseLeft:
				this.left = false;
				break;
			case this.caseUp:
				this.up = false;
				break;
			case this.caseRight:
				this.right = false;
				break;
			case this.caseDown:
				this.down = false;
				break;
		}
	}

	reset() {
		this.left = false;
		this.up = false;
		this.right = false;
		this.down = false;
	}
}

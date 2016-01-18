//Keys class
//directionType indicates whether "wasd" or the "arrows" will be used for direction control
var Keys = function(directionType) {
	var type = directionType,
		left = false,
		up = false,
		right = false,
		down = false;
	
	var caseLeft, caseUp, caseRight, caseDown;
	if (type == "arrows") {
		caseLeft = 37;
		caseUp = 38;
		caseRight = 39;
		caseDown = 40;
	} else if (type == "wasd") {
		caseLeft = 65;
		caseUp = 87;
		caseRight = 68;
		caseDown = 83;
	}
		
	var onKeyDown = function(e) {			
		var keycode = e.which;
		switch(keycode) {
			case caseLeft:
				this.left = true;
				break;
			case caseUp:
				this.up = true;
				break;
			case caseRight:
				this.right = true;
				break;
			case caseDown:
				this.down = true;
				break;
		}
	}
	
	var onKeyUp = function(e) {
		var keycode = e.which;
		switch(keycode) {
			case caseLeft:
				this.left = false;
				break;
			case caseUp:
				this.up = false;
				break;
			case caseRight:
				this.right = false;
				break;
			case caseDown:
				this.down = false;
				break;
		}
	}
	
	return {
		up: up,
		left: left,
		right: right,
		down: down,
		onKeyDown: onKeyDown,
		onKeyUp: onKeyUp
	};
}

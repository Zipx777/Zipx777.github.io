//Totem_WindfuryTotem class
class Totem_WindfuryTotem extends Totem {
	constructor(startX, startY) {
		super(startX, startY);
		this.name = "Totem_WindfuryTotem";
		this.color = "LightBlue";
		this.duration = 60;
		this.range = 200;
		this.statusToApply = Status_WindfuryTotem;
	}
}

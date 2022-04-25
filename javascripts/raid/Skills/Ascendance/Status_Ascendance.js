//Status_Ascendance class
class Status_Ascendance extends Status {
	constructor() {
		super();
		this.name = "Status_Ascendance";
		this.duration = 15;
		this.stormstrikeCooldownMultiplier = 0.4;
		this.stormstrikeDamageMultiplier = 1.5;
		this.autoAttackDamageMultiplier = 1.5;
		this.windfuryWeaponDamageMultiplier = 1.5;
		this.meleeRange = 300;
	}
}

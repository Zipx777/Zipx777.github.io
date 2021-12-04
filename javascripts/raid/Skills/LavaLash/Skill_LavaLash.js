//Skill_LavaLash class
class Skill_LavaLash extends Skill {
	constructor(skillId) {
		super(skillId);
		this.name = "Lava Lash";
		this.baseCooldown = 12;
		this.cooldown = 12;
		this.range = 100;
		this.isMelee = true;

		this.projectile = Projectile_LavaLash;
	}

	extraUpdateLogic(dt, player) {
		this.cooldown = this.baseCooldown * player.hasteMultiplier;
		this.cooldownTracker = Math.min(this.cooldownTracker, this.cooldown);
	}
}

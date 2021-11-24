//Skill_LavaLash class
class Skill_LavaLash extends Skill {
	constructor(skillId) {
		super(skillId);
		this.name = "Lava Lash";
		this.baseCooldown = 720;
		this.cooldown = 720;
		this.range = 100;
		this.isMelee = true;

		this.projectile = Projectile_LavaLash;
	}

	extraUpdateLogic(player) {
		this.cooldown = this.baseCooldown * player.hasteMultiplier;
		this.cooldownTracker = Math.min(this.cooldownTracker, this.cooldown);
	}
}

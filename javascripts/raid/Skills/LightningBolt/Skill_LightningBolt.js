//Skill_LightningBolt class
class Skill_LightningBolt extends Skill {
	constructor(skillId) {
		super(skillId);
		this.name = "Lightning Bolt";
		this.castTime = 2.5;
		this.noStacksCastTime = 2.5;
		this.range = 300;

		this.projectile = Projectile_LightningBolt;
	}

	extraActivateLogic(player) {
		player.maelstromStacks -= player.snapshotMaelstromStacks;
		console.log("Maelstrom Stacks after cast: " + player.maelstromStacks);
	}

	extraProjectileLogic(proj, player) {
		proj.modifyDamage(player.snapshotMaelstromStacks);
	}

	extraUpdateLogic(dt, player) {
		this.castTime = this.noStacksCastTime - (0.5 * player.snapshotMaelstromStacks);
		this.skillButtonElement.removeClass("skillProcced");
		if (player.maelstromStacks >= 5) {
			this.skillButtonElement.addClass("skillProcced");
		}
	}
}

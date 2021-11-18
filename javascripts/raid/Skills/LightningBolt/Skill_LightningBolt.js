//Skill_LightningBolt class
class Skill_LightningBolt extends Skill {
	constructor(skillId) {
		super(skillId);
		this.name = "Lightning Bolt";
		this.castTime = 150;
		this.noStacksCastTime = 150;
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

	extraUpdateLogic(player) {
		this.castTime = this.noStacksCastTime - (30 * player.snapshotMaelstromStacks);
		this.skillButtonElement.removeClass("skillProcced");
		if (player.maelstromStacks >= 5) {
			this.skillButtonElement.addClass("skillProcced");
		}
	}
}

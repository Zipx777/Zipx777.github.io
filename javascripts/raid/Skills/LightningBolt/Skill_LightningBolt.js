//Skill_LightningBolt class
class Skill_LightningBolt extends Skill {
	constructor(skillId) {
		super(skillId);
		this.name = "Lightning Bolt";
		this.backgroundImageFilePath = "javascripts/raid/Skills/LightningBolt/icon_lightningBolt.jpg";
		this.castTime = 2.5;
		this.noStacksCastTime = 2.5;
		this.range = 300;

		this.projectile = Projectile_LightningBolt;
	}

	extraActivateLogic(player) {
		player.maelstromStacks -= player.snapshotMaelstromStacks;
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

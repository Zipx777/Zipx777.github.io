//Attack_Rectangle class
class Attack_Rectangle {
	constructor(startX, startY, startWidth, startHeight, startRotationAngle) {
		this.name = "Rectangle Attack";
		this.x = startX || 0; //x coord of center point
		this.y = startY || 0; //y coord of center point
		this.width = startWidth || 100;
		this.height = startHeight || 100;
		this.rotationAngle = startRotationAngle || 0;

		//collection of the 4 corners of a rectangle, any orientation, centered at x,y
		this.points = [];
		this.calculatePoints();

		this.color = "pink";
		this.alpha = 1;
		this.timeElapsed = 0;
		this.delay = 1;
		this.duration = 1;
		this.damage = 100;
		this.triggered = false;

		this.finished = false;
	}

	isFinished() {
		return this.finished;
	}

	extraUpdateLogic(dt, player, boss, ctx) {

	}

	calculatePoints() {
		//start assuming center of rectangle is 0,0, and ignore rotation
		var originCenteredNoRotationPoint1 = new Vector(-1 * this.width/2, -1 * this.height/2);
		var originCenteredNoRotationPoint2 = new Vector(-1 * this.width/2, this.height/2);
		var originCenteredNoRotationPoint3 = new Vector(this.width/2, this.height/2);
		var originCenteredNoRotationPoint4 = new Vector(this.width/2, -1 * this.height/2);

		//rotate the rectangle
		var rotatedPoint1X = (originCenteredNoRotationPoint1.getX() * Math.cos(this.rotationAngle)) - (originCenteredNoRotationPoint1.getY() * Math.sin(this.rotationAngle));
		var rotatedPoint1Y = (originCenteredNoRotationPoint1.getY() * Math.cos(this.rotationAngle)) + (originCenteredNoRotationPoint1.getX() * Math.sin(this.rotationAngle));
		var originCenteredRotatedPoint1 = new Vector(rotatedPoint1X, rotatedPoint1Y);

		var rotatedPoint2X = (originCenteredNoRotationPoint2.getX() * Math.cos(this.rotationAngle)) - (originCenteredNoRotationPoint2.getY() * Math.sin(this.rotationAngle));
		var rotatedPoint2Y = (originCenteredNoRotationPoint2.getY() * Math.cos(this.rotationAngle)) + (originCenteredNoRotationPoint2.getX() * Math.sin(this.rotationAngle));
		var originCenteredRotatedPoint2 = new Vector(rotatedPoint2X, rotatedPoint2Y);

		var rotatedPoint3X = (originCenteredNoRotationPoint3.getX() * Math.cos(this.rotationAngle)) - (originCenteredNoRotationPoint3.getY() * Math.sin(this.rotationAngle));
		var rotatedPoint3Y = (originCenteredNoRotationPoint3.getY() * Math.cos(this.rotationAngle)) + (originCenteredNoRotationPoint3.getX() * Math.sin(this.rotationAngle));
		var originCenteredRotatedPoint3 = new Vector(rotatedPoint3X, rotatedPoint3Y);

		var rotatedPoint4X = (originCenteredNoRotationPoint4.getX() * Math.cos(this.rotationAngle)) - (originCenteredNoRotationPoint4.getY() * Math.sin(this.rotationAngle));
		var rotatedPoint4Y = (originCenteredNoRotationPoint4.getY() * Math.cos(this.rotationAngle)) + (originCenteredNoRotationPoint4.getX() * Math.sin(this.rotationAngle));
		var originCenteredRotatedPoint4 = new Vector(rotatedPoint4X, rotatedPoint4Y);

		//translate to set center point
		var finalPoint1 = new Vector(originCenteredRotatedPoint1.getX() + this.x, originCenteredRotatedPoint1.getY() + this.y);
		var finalPoint2 = new Vector(originCenteredRotatedPoint2.getX() + this.x, originCenteredRotatedPoint2.getY() + this.y);
		var finalPoint3 = new Vector(originCenteredRotatedPoint3.getX() + this.x, originCenteredRotatedPoint3.getY() + this.y);
		var finalPoint4 = new Vector(originCenteredRotatedPoint4.getX() + this.x, originCenteredRotatedPoint4.getY() + this.y);

		this.points = [];
		this.points.push(finalPoint1);
		this.points.push(finalPoint2);
		this.points.push(finalPoint3);
		this.points.push(finalPoint4);
	}

	checkIfPlayerWithinArea(player) {
		var pX = player.x;
		var pY = player.y;

		var dArr = [];

		var i = 0;
		for (i; i < this.points.length; i++) {
			var p1 = this.points[i];
			var p2;
			if (i == this.points.length - 1) {
				p2 = this.points[0];
			} else {
				p2 = this.points[i+1];
			}

			var d = (p2.getX() - p1.getX()) * (pY - p1.getY()) - (pX - p1.getX()) * (p2.getY() - p1.getY());
			dArr.push(d);
		}

		var insideCheck = true;
		for (var i = 0; i < dArr.length; i++) {
			if (dArr[i] > 0) {
				insideCheck = false;
			}
		}
		return insideCheck;
	}

	//update RectangleAttack position
	update(dt, player, boss, ctx) {
		this.extraUpdateLogic(dt, player, boss, ctx);

		if (this.timeElapsed > this.delay && !this.triggered) {
			this.triggered = true;
			//check for player getting hit and taking damage
			if (this.checkIfPlayerWithinArea(player)) {
				player.takeDamage(this.damage);
			}
		}

		if (this.timeElapsed > this.delay + this.duration) {
			this.finished = true;
		}

		this.timeElapsed += dt;
	}

	//draws CircleAttack on canvas context passed to it
	draw(ctx) {
		ctx.save();
		//ctx.translate(this.x,this.y);

		if (this.timeElapsed <= this.delay) {
			ctx.strokeStyle = this.color;
			ctx.globalAlpha = Math.min(1, Math.max(0.5, (this.timeElapsed / this.delay)));
			ctx.beginPath();
			ctx.moveTo(this.points[0].getX(), this.points[0].getY());
			var totalX = this.points[0].getX();
			var totalY = this.points[0].getY();
			for (var i = 1; i < this.points.length; i++) {
				ctx.lineTo(this.points[i].getX(), this.points[i].getY());
				totalX += this.points[i].getX();
				totalY += this.points[i].getY();
			}
			var averageX = totalX / 4;
			var averageY = totalY / 4;
			ctx.lineTo(this.points[0].getX(), this.points[0].getY());
			ctx.stroke();

			ctx.fillStyle = this.color;
			ctx.globalAlpha = Math.min(1, Math.max(0.5, (this.timeElapsed / this.delay)));
			ctx.beginPath();
			ctx.moveTo(averageX + ((this.points[0].getX() - averageX) * this.timeElapsed / this.delay), averageY + ((this.points[0].getY() - averageY) * this.timeElapsed / this.delay));
			for (var i = 1; i < this.points.length; i++) {
				ctx.lineTo(averageX + ((this.points[i].getX() - averageX) * this.timeElapsed / this.delay), averageY + ((this.points[i].getY() - averageY) * this.timeElapsed / this.delay));
			}
			ctx.lineTo(averageX + ((this.points[0].getX() - averageX) * this.timeElapsed / this.delay), averageY + ((this.points[0].getY() - averageY) * this.timeElapsed / this.delay));
			ctx.fill();

		} else {
			ctx.fillStyle = "red";
			ctx.globalAlpha = Math.min(Math.max(1 - ((this.timeElapsed - this.delay) / this.duration), 0), 1);
			ctx.beginPath();
			ctx.moveTo(this.points[0].getX(), this.points[0].getY());
			for (var i = 1; i < this.points.length; i++) {
				ctx.lineTo(this.points[i].getX(), this.points[i].getY());
			}
			ctx.lineTo(this.points[0].getX(), this.points[0].getY());
			ctx.fill();
		}

		ctx.restore();
	}
}

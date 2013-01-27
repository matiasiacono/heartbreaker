function Game() {
	var self = this;
	var pictureBag = [];
	var sacrificied = new Image();
	var heart = new Image();
	var powerBar = new Image();
	var bloodShot = new Image();
	var knife = new Image();
	
	var hurt = new Audio();
	var kill = new Audio();
	var heartBeat = new Audio();
	hurt.src = "fx/hurt.wav";
	kill.src = "fx/kill.wav";
	heartBeat.src = "fx/heartBeat.wav";
	
	function loadSacrified() {
		for (var i = 0; i < 7; i++) {
			var s = new Image();
			s.src = "graphics/sacrificied" + i + ".png";
			pictureBag.push(s);
		}
		selectRandomImage();
	}
	
	function selectRandomImage() {
		var selected = Math.floor(Math.random() * pictureBag.length);
		sacrificied = pictureBag[selected];
	}
	
	loadSacrified();
	
	heart.src = "graphics/heart.png";
	powerBar.src = "graphics/bar.png";
	bloodShot.src = "graphics/bloodShot.png";
	knife.src = "graphics/knife.png";
	
	var sacX = 200;
	var sacY = 80;
	var heartX = 250;
	var heartY = 70;
	var knifeX = 250;
	var knifeY = 70;
	var powerAcc = 150;
	var accumulator = 0;
	var levelFriction = 2;
	var points = 0;
	var lastKeyPressed = 0;
	var showBlood = false;
	var timerValue = 60;
	var accTimer = 0;
	
	this.init = function() {
		currentUpdater = normalUpdate;
		
		hurt.volume = 0.8;
		kill.volume = 0.8;
		heartBeat.volume = 1;
		
		if (document.addEventListener) {
			document.addEventListener("keypress", keyPress , false);
			var canvas = document.getElementById("canvas");
			canvas.addEventListener("click", onClick , false);
		}

	}
	
	function onClick() {
		if (powerAcc >= 240) {
			//Kill
			kill.play();
			heartBeat.play();
			currentUpdater = successKill;
		} else {
			//Fail
			hurt.play();
			currentUpdater = failKill;
		}
	}
	
	function keyPress(ev) {
		switch (ev.charCode) {
			//D
			case 100:
				if (lastKeyPressed === 97) {
					accumulator = 0;
					powerAcc += 15;
				} else { powerAcc -= 5; }
				break;
			//A
			case 97:
				if (lastKeyPressed === 100) {
					accumulator = 0;
					powerAcc += 15;
				} else { powerAcc -= 5;	}
				break;
			/*case 32:
				if (powerAcc >= 240) {
					//Kill
					kill.play();
					heartBeat.play();
					currentUpdater = successKill;
				} else {
					//Fail
					hurt.play();
					currentUpdater = failKill;
				}
				break;*/
		}
		
		if (powerAcc < 0) { powerAcc = 0; }
		if (powerAcc > 300) { powerAcc = 270; }
		
		lastKeyPressed = ev.charCode;
	}
	
	this.update = function(delta) {
		accTimer += delta;
		if (accTimer >= 1) {
			accTimer = 0;
			timerValue -= 1;
			if (timerValue <= 0) {
				clearInterval(intervalId);
			}
		}
		currentUpdater(delta);
	}
	
	this.draw = function(context) {
		context.drawImage(sacrificied, sacX, sacY);
		
		if (showBlood) {
			context.drawImage(bloodShot, sacX + 10, sacY + 5);
			context.drawImage(heart, heartX, heartY, 50, 65);
		}
		
		context.drawImage(knife, knifeX, knifeY);
		
		context.drawImage(powerBar, 0, 0, powerAcc, 10,
			10, 189, powerAcc, 10);
			
		for (var i = 0; i < points; i++) {
			context.drawImage(heart, (12 * i) + 10, 10, 25, 25);
		}
		
		drawInstructions(context);
		drawTimer(context);
	}
	
	function drawTimer(context) {
		context.save();
			context.fillStyle = "rgb(255,0,0)";
			context.font = "38pt arial";
			context.fillText(timerValue, 410, 75);
		context.restore();
	}
	
	function drawInstructions(context) {
		context.save();
			context.fillStyle = "rgb(0,0,0)";
			context.font = "11pt arial";
			context.fillText("Use A and D to energy the knife", 410, 160);
			context.fillText("Click to stab", 410, 175);
			context.fillText("Collect hearts before the time's up!", 410, 190);
		context.restore();
	}
	
	function normalUpdate(delta) {
		powerAcc -= levelFriction;
		if (powerAcc < 0) { powerAcc = 15; }
		if (powerAcc > 300) { powerAcc = 270; }
	}
	
	var successCounter = 0;
	
	var doBloodBath = bloodBath;
	
	function bloodBath(){
		fwk.add(new BloodSplash());
	};
	
	function successKill(delta) {
		successCounter += delta;
	
		doBloodBath();
		doBloodBath = function() {};
	
		showBlood = true;
		
		if (knifeX > 180) {
			knifeY += 5;
			knifeX -= 10;
		}
		
		heartY -= 0.2;
		
		if (successCounter >= 1.5) {
			successCounter = 0;
			selectRandomImage();
			timerValue += 2;
			heartY = 70;
			showBlood = false;
			knifeX = 250;
			knifeY = 70;
			
			points++;
			levelFriction += 0.5;
			
			currentUpdater = normalUpdate;
			doBloodBath = bloodBath;
		}
	}
	
	function failKill(delta) {
		knifeY += 5;
		knifeX -= 10;
		
		if (knifeX < 180) {
			knifeX = 250;
			knifeY = 70;
			
			timerValue -= 2;
			points--;
			levelFriction -= 0.5;
			
			if (levelFriction < 0) { levelFriction = 0; }
			if (points < 0) { points = 0; }
			
			currentUpdater = normalUpdate;
		}
	}
	
	var currentUpdater = function () {};
	
	this.zOrder = 100;
	this.visible = true;
}

function BloodSplash() {
	var splash = new Image();
	
	function loadBaths() {
		var pictureBag = [];
		for (var i = 0; i < 4; i++) {
			var s = new Image();
			s.src = "graphics/bloodSplash" + i + ".png";
			pictureBag.push(s);
		}
		var selected = Math.floor(Math.random() * pictureBag.length);
		splash = pictureBag[selected];
	}
	
	loadBaths();
	
	var x;
	var y;

	this.visible = true;
	
	this.init = function() {
		x = (Math.random() * 150) + 130;
		y = (Math.random() * 60) + 50;
	}
	
	this.update = function (delta) {
	}
	
	this.draw = function (context) {
		context.drawImage(splash, x, y);
	}
	
	this.zOrder = 1;
}
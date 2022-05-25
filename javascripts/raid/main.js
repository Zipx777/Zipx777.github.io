var canvas,
	ctx,
	player,
	boss,
	projectiles,
	effects,

	mouseX,
	mouseY,
	wasdKeys,

	gameOver,
	now,
	then,
	fpsInterval,
	startTime,
	timeElapsed,
	windowFocus,

	keybinds,
	skillButtons,

	skillSelectedID,
	skillSelectBuffer,
	skillSelectBufferTracker,

	changeKeybindState,
	buttonIdBeingChanged,

	playerName,
	maxPlayerNameLength,
	gameStarted,

	easyPosition,
	mediumPosition,
	hardPosition,
	difficultySelectorRadius,

	persistentStorage;

//document ready function
$(function() {
	initializeVariables();

	setEventHandlers();

	startAnimating();
});

function initializeVariables() {
	playerName = null;
	maxPlayerNameLength = 15;

	gameStarted = false;
	difficultySelectorRadius = 30;
	easyPosition = new Vector(100,200);
	mediumPosition = new Vector(300,300);
	hardPosition = new Vector(500,200);

	//can be local or session
	//local persists after browser close, but if something breaks, someone can be blocked without external help
	//session is safer cause they can just close and relaunch to unblock
	persistentStorage = window.sessionStorage;

	canvas = $("#raidCanvas");
	ctx = canvas[0].getContext("2d");

	var canvasWidth = canvas.width();
	var canvasHeight = canvas.height();

	//have to set height/width attributes to avoid weird canvas scaling issue
	//height and width set in the .css for #raidArea
	canvas.attr("width", canvasWidth).attr("height", canvasHeight);

	gameOver = false;

	player = new Player(0.5 * ctx.canvas.width, 0.3 * ctx.canvas.height);
	boss = new Boss(new BossAttackSequence(), 0.5 * ctx.canvas.width, -1 * ctx.canvas.height);

	projectiles = [];
	effects = [];

	//link buttons to keys
	keybinds = {
		"skill_1": 81,
		"skill_2": 69,
		"skill_3": 49,
		"skill_4": 50,
		"skill_5": 51,
		"skill_6": 52,
		"skill_7": 90,
		"skill_8": 88,
		"skill_9": 86,
		"skill_10": 82,
		"skill_11": 70,
		"skill_12": 67,
		"skill_13": 53
	};

	//check for locally saved keybinds and apply if found
	var savedKeybinds = JSON.parse(persistentStorage.getItem("savedKeybinds"));
	var savedHotkeyTextForChangedKeybinds = JSON.parse(persistentStorage.getItem("savedHotkeyTextForChangedKeybinds"));
	if (savedKeybinds) {
		if (savedHotkeyTextForChangedKeybinds) {
			try {
				console.log("Setting saved keybinds");
				$.each(savedHotkeyTextForChangedKeybinds, function(buttonId,hotkeyText) {
					setKeybindOnSkill(buttonId, savedKeybinds[buttonId], hotkeyText);
					if (hotkeyText == "null") {
						setKeybindToNull(buttonId);
					}
				});
			} catch(error) {
				console.log(error);
			}

		} else {
			console.log("We found saved keybinds, but no saved text for the keybinds");
		}
	} else {
		console.log("No saved keybinds detected");
	}

	//link buttons to skills
	skillButtons = {};
	for (var i = 0; i < player.skills.length; i++) {
		skillButtons[player.skills[i].buttonId] = player.skills[i];
	}

	//set up button backgrounds/hotkeys
	$.each(skillButtons, function(buttonId,skill) {
		skill.skillButtonElement.css("background-image", "url(\"" + skill.backgroundImageFilePath + "\")");
	});

	skillSelectedID = null;
	skillSelectBuffer = 0.5;
	skillSelectBufferTracker = 0;

	//set initial mouse position to the player so the player doesn't immediately start traveling somewhere
	mouseX = player.getX();
	mouseY = player.getY();

	wasdKeys = new Keys("wasd");

	changeKeybindState = false;
	buttonIdKeybindBeingChanged = null;

	windowFocus = true;

	timeElapsed = 0;

	playerName = persistentStorage.getItem("savedPlayerName");
	if (!playerName) {
		changePlayerName();
	} else {
		setPlayerName(playerName);
	}
}

function setPlayerName(name) {
	playerName = name;
	persistentStorage.setItem("savedPlayerName", name);
 	$("#playerNameDiv").text("Player: " + name);
}

function changePlayerName() {
	var newPlayerName = null;
	var loopCounter = 1;
	var nameEnterBasePrompt = "Enter a name/initials";
	var nameEnterPrompt = nameEnterBasePrompt;
	var nameEnteredIsEmpty = false;
	var nameEnteredIsTooLong = false;
	while (!newPlayerName || newPlayerName.length > maxPlayerNameLength) {
		if (loopCounter > 1) {
			if (nameEnteredIsEmpty) {
				nameEnterPrompt = nameEnterBasePrompt + "\nName/Initials cannot be empty."
			} else if (nameEnteredIsTooLong) {
				nameEnterPrompt = nameEnterBasePrompt + "\nName/Initials cannot be more than " + maxPlayerNameLength + " characters long";
			}
		}
		newPlayerName = prompt(nameEnterPrompt, "").trim();
		var nameEnteredIsEmpty = false;
		var nameEnteredIsTooLong = false;
		if (!newPlayerName) {
			nameEnteredIsEmpty = true;
		} else if (newPlayerName.length > maxPlayerNameLength) {
			nameEnteredIsTooLong = true;
		}
		loopCounter++
	}
	setPlayerName(newPlayerName);
}

function setEventHandlers() {
	$("body").mousemove(raidAreaMouseMove);
	$("#wasdButton").click(wasdButtonClick);
	$("#mouseButton").click(mouseButtonClick);
	$(".skillButton").click(skillButtonClick);

	$("#playerNameDiv").click(changePlayerName);

	$("#showLeaderboardButton").click(showLeaderboard);

	$("#testButton").click(testButtonClick);
	$("#test2Button").click(test2ButtonClick);

	$(document).keydown(keyDownHandler);
	$(document).keyup(keyUpHandler);
	$(document).mousedown(mouseDownHandler);

	$(window).focus(function() {
		then = Date.now();
		windowFocus = true;
	});
	$(window).blur(function() {
		windowFocus = false;
	});

	//$(document). bind("contextmenu",function(e){ return false; });
	$(window).contextmenu(function() {
		wasdKeys.reset();
	});
}

function testButtonClick() {
	console.log("test button click");
}

function test2ButtonClick() {
	console.log("test button 2 click");
}

//--------------------------------------
//---------LEADERBOARD LOGIC------------
//--------------------------------------

var submittingFetchRequest = false;

//adds new name/score to leaderboard
//also does some data verification/cleanup just in case
function addNewScoreToLeaderboard(leaderboardData, newName, newScore) {
	if (!leaderboardData) {
		leaderboardData = [[newName,newScore]];
		return leaderboardData;
	}
	//verify data is good, no blanks, delete leading/trailing whitespace
	for (var i = 0; i < leaderboardData.length; i++) {
		if (leaderboardData[i][0] && leaderboardData[i][1]) {
			leaderboardData[i][0] = leaderboardData[i][0].trim();
			leaderboardData[i][1] = Number(leaderboardData[i][1].trim());
		} else {
			//shift array up one, overwriting current index (bad/missing data, should never happen)
		}
	}

	//add new name/value onto the end of the array
	leaderboardData[leaderboardData.length] = [];
	leaderboardData[leaderboardData.length - 1][0] = newName;
	leaderboardData[leaderboardData.length - 1][1] = newScore;

	//sort names/values into decreasing order (first cell has highest value)
	var valuesOrdered = false;

	//used for unnecessary optimization of sorting algorithm
	var iterationDepth = leaderboardData.length - 1;

	var minScore = newScore;
	var maxScore = newScore;
	while (!valuesOrdered) {
		valuesOrdered = true;
		for (var i = 0; i < iterationDepth; i++) {
			minScore = Math.min(minScore, leaderboardData[i][1]);
			maxScore = Math.max(maxScore, leaderboardData[i][1]);
			if (leaderboardData[i][1] < leaderboardData[i+1][1]) {
				valuesOrdered = false;
				//swap values and names
				var tempStoreName = leaderboardData[i][0];
				var tempStoreValue = leaderboardData[i][1];

				leaderboardData[i][0] = leaderboardData[i+1][0];
				leaderboardData[i][1] = leaderboardData[i+1][1];

				leaderboardData[i+1][0] = tempStoreName;
				leaderboardData[i+1][1] = tempStoreValue;
			}
		}
		iterationDepth--;
	}

	var currentRunLeaderboardRank = getParseRank(newScore, leaderboardData);



	displayCurrentRunParse(currentRunLeaderboardRank);
	return leaderboardData;
}

function displayCurrentRunParse(currentRunRank) {
	//console.log(currentRunRank);
	var parseElement = $("#currentRunParse");
	addRankColorToElement(parseElement, currentRunRank);
	parseElement.text(currentRunRank);
	$("#currentRunParseLine").show();
}

//takes a score in the leaderboard, and the leaderboard
//returns the parse rank as a percent 0-100
function getParseRank(score, leaderboardData) {
	var parseRank = 100;

	//---1st method---
	//purely based on leaderboard position
	//decided against doing it this way, results were getting skewed towards the upper end
	//with more users and more diverse results, this method would be preferred
	/*
	for (var i = 0; i < leaderboardData.length; i++) {
		if (leaderboardData[i][1] == score) {
			parseRank = Math.floor(((leaderboardData.length - i) / leaderboardData.length) * 100);
			break;
		}
	}
	*/

	//---2nd method---
	//goes off of actual score value as a % between min and max scores
	//this is "nicer" for newer players while the user base is very small
	var maxScore = score;
	var minScore = score;
	for (var i = 0; i < leaderboardData.length; i++) {
		maxScore = Math.max(maxScore, leaderboardData[i][1]);
		minScore = Math.min(minScore, leaderboardData[i][1]);
	}
	var scoreDifferential = maxScore - minScore;
	parseRank = Math.floor(((score - minScore) / scoreDifferential) * 100);

	return parseRank;
}

//populate leaderboard data into html element
function displayLeaderboard(leaderboardData) {
	var condensedLeaderboardTableContainerElement = $("#condensedLeaderboardTableContainer");
	condensedLeaderboardTableContainerElement.text("");
	var fullLeaderboardTableContainerElement = $("#fullLeaderboardTableContainer");
	fullLeaderboardTableContainerElement.text("");

	//shows just each player's best result
	var condensedLeaderboard = constructLeaderboard(leaderboardData, true);
	condensedLeaderboardTableContainerElement.append(condensedLeaderboard);


	//shows every entry in the leaderboard
	var fullLeaderboard = constructLeaderboard(leaderboardData, false);
	fullLeaderboardTableContainerElement.append(fullLeaderboard);

	$("#leaderboardDiv").show();
	$("#showLeaderboardButton").hide();
}

//constructs html table element to display leaderboard based on passed array
//takes a bool that will cut the result down to just unique entries if true
function constructLeaderboard(leaderboardData, onlyUniqueEntries) {
	var leaderboardTableElement = $(document.createElement("table"));
	var leaderboardHeaderRowElement = $(document.createElement("tr"));
	var leaderboardHeaderRowRank = $(document.createElement("th"));
	leaderboardHeaderRowRank.text("Rank");
	var leaderboardHeaderRowName = $(document.createElement("th"));
	leaderboardHeaderRowName.text("Name");
	var leaderboardHeaderRowDPS = $(document.createElement("th"));
	leaderboardHeaderRowDPS.text("DPS");

	leaderboardHeaderRowElement.append(leaderboardHeaderRowRank);
	leaderboardHeaderRowElement.append(leaderboardHeaderRowName);
	leaderboardHeaderRowElement.append(leaderboardHeaderRowDPS);

	leaderboardTableElement.append(leaderboardHeaderRowElement);

	//used when "onlyUniqueEntries" is true
	var namesAddedToLeaderboard = [];

	for (var i = 0; i < leaderboardData.length; i++) {
		var addEntry = true;
		if (onlyUniqueEntries) {
			for (var j = 0; j < namesAddedToLeaderboard.length; j++) {
				if (namesAddedToLeaderboard[j] == leaderboardData[i][0]) {
					addEntry = false;
				}
			}
			if (addEntry) {
				namesAddedToLeaderboard.push(leaderboardData[i][0]);
			}
		}

		if (addEntry) {
			var leaderboardRowElement = $(document.createElement("tr"));
			if (i%2 == 0) {
				leaderboardRowElement.addClass("tableRowEven");
			} else {
				leaderboardRowElement.addClass("tableRowOdd");
			}
			var leaderboardRankElement = $(document.createElement("td"));
			leaderboardRankElement.addClass("leaderboardRank");
			var rank = getParseRank(leaderboardData[i][1], leaderboardData);
			leaderboardRankElement.text(rank);
			addRankColorToElement(leaderboardRankElement, rank);
			var leaderboardNameElement = $(document.createElement("td"));
			leaderboardNameElement.text(leaderboardData[i][0]);
			var leaderboardDPSElement = $(document.createElement("td"));
			leaderboardDPSElement.addClass("leaderboardDPS");
			var prettyNumber = Math.floor(leaderboardData[i][1]);
			leaderboardDPSElement.text(prettyNumber);
			leaderboardRowElement.append(leaderboardRankElement);
			leaderboardRowElement.append(leaderboardNameElement);
			leaderboardRowElement.append(leaderboardDPSElement);

			leaderboardTableElement.append(leaderboardRowElement);
		}
	}
	return leaderboardTableElement;
}

function addRankColorToElement(element, rank) {
	if (rank == 100) {
		element.addClass("goldParse");
	} else if (rank >= 99) {
		element.addClass("pinkParse");
	} else if (rank >= 95) {
		element.addClass("orangeParse");
	} else if (rank >= 75) {
		element.addClass("purpleParse");
	} else if (rank >= 50) {
		element.addClass("blueParse");
	} else if (rank >= 25) {
		element.addClass("greenParse");
	} else {
		element.addClass("grayParse");
	}
}

var GIST_ID = "6a361d54c3124969fb151a3f5f4a31b9";
var GIST_ACCESS_TOKEN_A = "ghp_jqrkt8x517p5d";
var GIST_ACCESS_TOKEN_B = "aCLY2q1DZMMdcX7X61rGv7r";
var GIST_FILE_NAME = "raidLeaderboard.csv";

//used to show leaderboard without submitting a score
showLeaderboard = async() => {
	var result = await getCurrentLeaderboard();
	if (result) {
		console.log("Received leaderboard data successfully");
		displayLeaderboard(result);
	}
}

//get csv data of current leaderboard
//return array converted from csv
getCurrentLeaderboard = async() => {
	var fetchRequestError = false;

	console.log("Fetching current leaderboard data...");

	const request = await fetch("https://api.github.com/gists/" + GIST_ID,
  {
    headers: {
      "Content-Type": "application/json",
      Authorization: "token " + GIST_ACCESS_TOKEN_A + GIST_ACCESS_TOKEN_B
  	}
	}).then(function(response) {
		if (!response.ok) {
	    console.log(response.statusText);
			fetchRequestError = true;
	  }
		return response;
	});
  const fetchRequestObject = await request.json();

	if (fetchRequestError) {
		$("#leaderboardErrorMessage").show();
		return null;
	}

	var csvData = fetchRequestObject.files[GIST_FILE_NAME].content;
	var arrayFromCSV = csvToArray(csvData);
	return arrayFromCSV;
}

//pushes new leaderboard data to the sheet, overwriting anything currently there
//only want to use this after pulling the existing data and updating it
function submitLeaderboardData(leaderboardData) {
	var newContent = arrayToCSV(leaderboardData);

	fetch("https://api.github.com/gists/" + GIST_ID, {
	  method: 'PATCH',
	  headers: {
	    "Content-Type": "application/json",
	    "Authorization": "token " + GIST_ACCESS_TOKEN_A + GIST_ACCESS_TOKEN_B
	  },
	  body: JSON.stringify({
	    "files": {
	      "this_value_is_irrelevant_so_why_does_it_exist???": {
	        "filename": GIST_FILE_NAME,
	        "content": newContent
		      }
		    }
		  })
	});
}

submitNewScoreToLeaderboard = async(newScore) => {
	if (submittingFetchRequest) {
		return;
	}
	submittingFetchRequest = true;

	var currentLeaderboard = await getCurrentLeaderboard();

	if (currentLeaderboard != null) {
		console.log("Received leaderboard data successfully");
		var updatedLeaderboard = addNewScoreToLeaderboard(currentLeaderboard, playerName, newScore);
		displayLeaderboard(updatedLeaderboard);
		submitLeaderboardData(updatedLeaderboard);
	}
	submittingFetchRequest = false;
}

//takes a CSV from the gist and converts it to an array
//      name,score\nzippy,999\nelephant,100\n
//skips over the header row
function csvToArray(csvInput) {
	var newArray = [];
	var splitCSV = csvInput.split("\n");
	for (var i = 1; i < splitCSV.length; i++) { //skip header row
		var nextRow = splitCSV[i].split(",");
		if (nextRow[0] != "") {
			newArray[i - 1] = [nextRow[0], nextRow[1]];
		}
	}
	return newArray;
}

//takes the leaderboard data array and converts it to csv to be submitted to the gist
//adds header row to it
function arrayToCSV(arrayInput) {
	var csvToExport = "name,score\n";
	for (var i = 0; i < arrayInput.length; i++) {
		csvToExport += (arrayInput[i][0] + "," + arrayInput[i][1] + "\n");
	}
	return csvToExport;
}
//-------END LEADERBOARD LOGIC----------

function raidAreaMouseMove(e) {
	var canvasElementOffset = $("#raidCanvas").offset();
	mouseX = e.pageX - canvasElementOffset.left;
	mouseY = e.pageY - canvasElementOffset.top;
}

function setSelectedSkill(skillID) {
	$(".skillSelected").removeClass("skillSelected");
	$("#" + skillID).addClass("skillSelected");
}

function setKeybindToNull(buttonId) {
	keybinds[buttonId] = null;
	$("#" + buttonId).addClass("noKeybindSet");
	$("#" + buttonId + " .skillButtonKeybindDisplay div").text("");
}

function setKeybindOnSkill(buttonElementId, keyNum, hotkeyText) {
	//remove keybind from other skills with that button to avoid duplicates
	$.each(keybinds, function(buttonID,thisKeyNum) {
		if (thisKeyNum == keyNum) {
			setKeybindToNull(buttonID);
			setPersistentStorageKeyValueInItem("savedHotkeyTextForChangedKeybinds", buttonID, "null");
		}
	});
	keybinds[buttonElementId] = keyNum;

	$("#" + buttonElementId + " .skillButtonKeybindDisplay div").text(hotkeyText);
	$("#" + buttonElementId).removeClass("noKeybindSet");
	$(".readyToChangeKeybind").removeClass("readyToChangeKeybind");

	persistentStorage.setItem("savedKeybinds", JSON.stringify(keybinds));

	setPersistentStorageKeyValueInItem("savedHotkeyTextForChangedKeybinds", buttonElementId, hotkeyText);
}

function setPersistentStorageKeyValueInItem(item, key, value) {
	var savedItem = JSON.parse(persistentStorage.getItem(item));
	if (!savedItem) {
		savedItem = {};
	}
	savedItem[key] = value;
	persistentStorage.setItem(item, JSON.stringify(savedItem));
}

//handler when a key is pressed
function keyDownHandler(e) {
	keyOrMousePressed(e, "key");
}

function mouseDownHandler(e) {
	if (e.which != 1) {
		keyOrMousePressed(e, "mouse");
	}
}

function keyOrMousePressed(e, source) {
	//console.log(source + ":" + e.which + "-" + e.key);
	var keycode = e.which;
	if (changeKeybindState) {
		var hotkeyText = "";
		if (e.key) {
			hotkeyText = e.key.toUpperCase();
		} else {
			hotkeyText = e.which;
		}
		if (source == "mouse") {
			hotkeyText = "m" + hotkeyText;
		}
		setKeybindOnSkill(buttonIdBeingChanged, e.which, hotkeyText);
		buttonIdBeingChanged = null;
		changeKeybindState = false;
	} else {
		wasdKeys.onKeyDown(e);
		$.each(keybinds, function(buttonID,keyNum) {
			if (keyNum == keycode) {
				skillSelectedID = buttonID;
				skillSelectBufferTracker = skillSelectBuffer;
				setSelectedSkill(skillSelectedID);
			}
		});
	}
}

//handler for when a key is released
function keyUpHandler(e) {
	wasdKeys.onKeyUp(e);
}

function skillButtonClick() {
	if (!boss.fightStarted && !changeKeybindState) {
		changeKeybindState = true;
		buttonIdBeingChanged = $(this).attr("id");
		$(".readyToChangeKeybind").removeClass("readyToChangeKeybind");
		$("#" + buttonIdBeingChanged).removeClass("noKeybindSet");
		$("#" + buttonIdBeingChanged).addClass("readyToChangeKeybind");
	}
}

function mouseButtonClick() {
	player.setControlMode(1);
}

function wasdButtonClick() {
	player.setControlMode(2);
}

//for manual use in case saved settings get messed up.
//Could make switching to the more persistent setting safe
function clearPersistentStorage() {
	alert(persistentStorage.clear());
	changePlayerName();
}

function collisionCheck(target1, target1Radius, target2, target2Radius) {
	var xDistBetween = target1.getX() - target2.getX();
	var yDistBetween = target1.getY() - target2.getY();
	var distBetweenSquared = Math.pow(xDistBetween, 2) + Math.pow(yDistBetween, 2);
	var combinedRadiiSquared = Math.pow(target1Radius, 2) + Math.pow(target2Radius, 2);

	return (distBetweenSquared <= combinedRadiiSquared);
}

function populateResultsReport() {
	var totalDamage = 0;
	for (var key in boss.damageReport) {
		totalDamage += boss.damageReport[key];
	}
	var totalDps = totalDamage / boss.timeElapsed;

	if (boss.difficulty == "hard" && !boss.isAlive()) {
		submitNewScoreToLeaderboard(totalDps);
	}

	var damageTaken = player.maxHealth - player.currentHealth;
	var damageTakenQuip = "Umm healers? Hello?!";
	if (damageTaken == 0) {
		damageTakenQuip = "Flawless! Exemplary raider, Matt and Chris are so happy.";
	} else if (damageTaken < 0.05 * player.maxHealth) {
		damageTakenQuip = "That hit me?!";
	} else if (damageTaken < 0.25 * player.maxHealth) {
		damageTakenQuip = "The healers love you.";
	} else if (damageTaken < 0.5 * player.maxHealth) {
		damageTakenQuip = "The healers are slightly concerned.";
	} else if (damageTaken < 0.75 * player.maxHealth) {
		damageTakenQuip = "The healers are very mad.";
	} else if (damageTaken < player.maxHealth) {
		damageTakenQuip = "Chris, I'm taking this. And this. And this. And that one too.";
	}
	$("#overallDpsResult").text(Math.floor(totalDps));
	$("#damageTakenResult").text(Math.floor(damageTaken));
	$("#damageTakenQuip").text(damageTakenQuip);

	//main stats bars
	//console.log("Auto Attack uptime: " + (player.autoAttackTotalUptime / boss.timeElapsed));
	//console.log("Maelstrom Stacks not wasted: " + ((player.maelstromStacksGenerated - player.maelstromStacksWasted) / player.maelstromStacksGenerated));
	//console.log("Flame Shock uptime: " + (player.flameShockTotalUptime / boss.timeElapsed));

	var autoAttackUptime = player.autoAttackTotalUptime / boss.timeElapsed;
	var maelstromStacksNotWasted = (Math.max(player.maelstromStacksGenerated, 1) - player.maelstromStacksWasted) / Math.max(player.maelstromStacksGenerated, 1);
	var flameShockUptime = player.flameShockTotalUptime / boss.timeElapsed;
	var gcdUptime = player.gcdUptime / boss.timeElapsed;
	var statsArray = {
		"Auto Attack uptime": autoAttackUptime,
		"Maelstrom gained": maelstromStacksNotWasted,
		"Flame Shock uptime": flameShockUptime,
		"GCD Uptime": gcdUptime
	};

	var statRowCounter = 0;
	for (var stat in statsArray) {
		var statTrackRowElement = $(document.createElement("tr"));
		if (statRowCounter%2 == 0) {
			statTrackRowElement.addClass("tableRowEven");
		} else {
			statTrackRowElement.addClass("tableRowOdd");
		}
		var statTrackNameElement = $(document.createElement("td"));
		statTrackNameElement.addClass("statTrackerNameCell");
		statTrackNameElement.text(stat);
		var statTrackNumberElement = $(document.createElement("td"));
		statTrackNumberElement.addClass("statTrackerNumberCell");
		var prettyNumber = (Math.floor(statsArray[stat] * 1000)) / 10;
		statTrackNumberElement.text(prettyNumber + " %");
		var statTrackBarContainerElement = $(document.createElement("td"));
		statTrackBarContainerElement.addClass("statTrackerBarCell");
		var statTrackBarElement = $(document.createElement("div"));
		statTrackBarElement.addClass("statTrackerBar");
		if (statsArray[stat] >= 0.95) {
			statTrackBarElement.css("background-color", "lime");
		} else if (statsArray[stat] >= 0.9) {
			statTrackBarElement.css("background-color", "green");
		} else if (statsArray[stat] >= 0.8) {
			statTrackBarElement.css("background-color", "orange");
		} else {
			statTrackBarElement.css("background-color", "firebrick");
		}
		var statTrackBarWidth = statsArray[stat] * 350;
		statTrackBarElement.width(Math.max(1, statTrackBarWidth));
		statTrackBarContainerElement.append(statTrackBarElement);
		statTrackRowElement.append(statTrackNameElement);
		statTrackRowElement.append(statTrackNumberElement);
		statTrackRowElement.append(statTrackBarContainerElement);

		$("#statTrackers").append(statTrackRowElement);
		statRowCounter++;
	}

	//damage breakdown
	var nextKey = "";
	var nextDamage = 0;
	var maxDamage = 0;
	var continuing = true;
	var damageRowCounter = 0;
	while (continuing) {
		for (var key in boss.damageReport) {
			if (boss.damageReport[key] > nextDamage) {
				nextDamage = boss.damageReport[key];
				nextKey = key;
			}
		}
		if (maxDamage == 0) {
			maxDamage = nextDamage;
		}
		if (nextDamage == 0) {
			continuing = false;
		} else {
			var barWidth = (nextDamage / maxDamage) * 320;
			var nextRowElement = $(document.createElement("tr"));
			if (damageRowCounter%2 == 0) {
				nextRowElement.addClass("tableRowEven");
			} else {
				nextRowElement.addClass("tableRowOdd");
			}
			var skillNameElement = $(document.createElement("td"));
			skillNameElement.text(nextKey);
			var skillDamageElement = $(document.createElement("td"));
			skillDamageElement.text(Math.floor(nextDamage));
			var skillDamageBarContainerElement = $(document.createElement("td"));
			var skillDamageBarElement = $(document.createElement("div"));
			skillDamageBarElement.addClass("damageBreakdownBar");
			skillDamageBarElement.width(Math.max(1, barWidth));
			skillDamageBarContainerElement.append(skillDamageBarElement);
			nextRowElement.append(skillNameElement);
			nextRowElement.append(skillDamageElement);
			nextRowElement.append(skillDamageBarContainerElement);
			//$("#damageBreakdown").append("<tr><td>" + nextKey + "</td><td>" + Math.floor(boss.damageReport[nextKey]) + "</td><td><div class=\"damageBreakdownBar\" width=\"10px\"></div></td></tr>");
			$("#damageBreakdown").append(nextRowElement);
			boss.damageReport[nextKey] = 0;
			nextDamage = 0;
			damageRowCounter++;
		}
	}
	$("#resultsReport").show();
}

function startAnimating() {
	fpsInterval = 1000 / 59;
  then = Date.now();
  startTime = then;
  animate();
}

//***************
//main game loop
//***************
function animate() {

	window.requestAnimFrame(animate);

	now = Date.now();
	elapsed = now - then;
	if (elapsed > 0 && windowFocus) { //>= fpsInterval) {
		then = now;// - (elapsed % fpsInterval);

		update(elapsed / 1000); //dt passed in seconds, average of about 0.016 for 60fps

		draw();

	}
}

//check for projectile hitting stuff
function checkProjForCollisions(proj) {
	var collisionHappened = false;

	//check projectile versus boss
	if (collisionCheck(proj, proj.getHitboxRadius(), boss, boss.getHitboxRadius())) {
		collisionHappened = true;
		//proj.parent = boss;
		boss.handleHitByProjectile(proj);

		player.handleProjectileImpactLogic(proj, projectiles);
	}

	return collisionHappened;
}

function checkForDifficultySelected() {
	if (collisionCheck(player, player.getHitboxRadius(), easyPosition, difficultySelectorRadius)) {
		//EASY
		player.setDifficulty("easy");
		boss.setDifficulty("easy");
		boss.triggerTeleport(new Vector(0.5 * ctx.canvas.width, 0.3 * ctx.canvas.height));
		var easySelectRingEffect = new DifficultySelectRingEffect(easyPosition.getX(), easyPosition.getY(), "green", difficultySelectorRadius);
		effects.push(easySelectRingEffect);
		gameStarted = true;
	} else if (collisionCheck(player, player.getHitboxRadius(), mediumPosition, difficultySelectorRadius)) {
		//MEDIUM
		player.setDifficulty("medium");
		boss.setDifficulty("medium");
		boss.triggerTeleport(new Vector(0.5 * ctx.canvas.width, 0.3 * ctx.canvas.height));
		var mediumSelectRingEffect = new DifficultySelectRingEffect(mediumPosition.getX(), mediumPosition.getY(), "orange", difficultySelectorRadius);
		effects.push(mediumSelectRingEffect);
		gameStarted = true;
	} else if (collisionCheck(player, player.getHitboxRadius(), hardPosition, difficultySelectorRadius)) {
		//HARD
		player.setDifficulty("hard");
		boss.setDifficulty("hard");
		boss.triggerTeleport(new Vector(0.5 * ctx.canvas.width, 0.3 * ctx.canvas.height));
		var hardSelectRingEffect = new DifficultySelectRingEffect(hardPosition.getX(), hardPosition.getY(), "red", difficultySelectorRadius);
		effects.push(hardSelectRingEffect);
		gameStarted = true;
	}

	if (gameStarted) {
		var easyFadeEffect = new DifficultySelectFadeEffect(easyPosition.getX(), easyPosition.getY(), "green", difficultySelectorRadius);
		effects.push(easyFadeEffect);

		var mediumFadeEffect = new DifficultySelectFadeEffect(mediumPosition.getX(), mediumPosition.getY(), "orange", difficultySelectorRadius);
		effects.push(mediumFadeEffect);

		var hardFadeEffect = new DifficultySelectFadeEffect(hardPosition.getX(), hardPosition.getY(), "red", difficultySelectorRadius);
		effects.push(hardFadeEffect);
	}
}

//update player and object states
function update(dt) {
	//show results info
	if (gameStarted && (!boss.isAlive() || !player.isAlive()) && !gameOver) {
		gameOver = true;
		populateResultsReport();
	}

	if (gameOver || changeKeybindState || !playerName) {
		return;
	}

	player.update(dt, mouseX, mouseY, wasdKeys, player, boss, projectiles, effects, gameStarted, ctx);
	boss.update(dt, player, boss, effects, ctx);


	if (!gameStarted) {
		checkForDifficultySelected();
	}

	if (skillSelectedID) {
		if (gameStarted) {
			player.attemptToActivateSkill(skillSelectedID);
		}
		skillSelectBufferTracker -= dt;
		if (skillSelectBufferTracker <= 0) {
			skillSelectedID = null;
			skillSelectBufferTracker = 0;
			$(".skillSelected").removeClass("skillSelected");
		}
	}

	//update projectiles
	var activeProjectiles = [];
	for (var i = 0; i < projectiles.length; i++) {
		if (projectiles[i].isInBounds()) {
			projectiles[i].update(dt, boss);

			if (checkProjForCollisions(projectiles[i])) {
					projectiles[i].explode(effects);
			} else {
					activeProjectiles.push(projectiles[i]);
			}
		} else {
			projectiles[i].explode(effects);
		}
	}
	projectiles = activeProjectiles;

	var activeEffects = [];
	$.each(effects, function(i,effect) {
		effect.update(dt);
		if (effect.isAlive()) {
			activeEffects.push(effect);
		}
	});
	effects = activeEffects;

	timeElapsed += dt;
}

//draw player and raid
function draw() {
	ctx.save();
	//clear the board
	ctx.fillStyle = "lightgray";
	ctx.clearRect(0, 0, canvas[0].width, canvas[0].height);

	//draw difficulty selector circles
	if (!gameStarted) {
		ctx.save();
		ctx.beginPath();
		ctx.fillStyle = "green";
		ctx.arc(easyPosition.getX(), easyPosition.getY(), difficultySelectorRadius, 0, 2 * Math.PI, true);
		ctx.fill();

		ctx.font = '24px Verdana';
		ctx.textAlign = "center";
		ctx.lineWidth=2;
		ctx.fillText("EASIER", easyPosition.getX(), easyPosition.getY() + difficultySelectorRadius + 30);

		ctx.beginPath();
		ctx.fillStyle = "orange";
		ctx.arc(mediumPosition.getX(), mediumPosition.getY(), difficultySelectorRadius, 0, 2 * Math.PI, true);
		ctx.fill();

		ctx.font = '24px Verdana';
		ctx.textAlign = "center";
		ctx.lineWidth=2;
		ctx.fillText("MEDIUMER", mediumPosition.getX(), mediumPosition.getY() + difficultySelectorRadius + 30);

		ctx.beginPath();
		ctx.fillStyle = "red";
		ctx.arc(hardPosition.getX(), hardPosition.getY(), difficultySelectorRadius, 0, 2 * Math.PI, true);
		ctx.fill();

		ctx.font = '24px Verdana';
		ctx.textAlign = "center";
		ctx.lineWidth=2;
		ctx.fillText("HARDER", hardPosition.getX(), hardPosition.getY() + difficultySelectorRadius + 30);
	}

	//draw the Boss
	boss.draw(ctx);

	//draw the player
	player.draw(ctx);

	$.each(projectiles, function(i, proj) {
		proj.draw(ctx);
	});

	$.each(effects, function(i, effect) {
		effect.draw(ctx);
	});

	//boss health bar
	if (boss.fightStarted) {
		ctx.beginPath();
		ctx.rect(20,15,Math.max(0,560 * (boss.currentHealth / boss.maxHealth)),10);
		ctx.fillStyle = "red";
		ctx.fill();

		ctx.beginPath();
		ctx.lineWidth = 2;
		ctx.strokeStyle = "black";
		ctx.rect(20,15,560,10);
		ctx.stroke();
	}

	//player health bar
	ctx.beginPath();
	ctx.rect(20,ctx.canvas.height - 15,Math.max(0,560 * (player.currentHealth / player.maxHealth)),10);
	ctx.fillStyle = "blue";
	if (player.currentHealth < player.maxHealth) {
		ctx.fillStyle = "green";
	}
	if (player.currentHealth / player.maxHealth < 0.75) {
		ctx.fillStyle = "gold";
	}
	if (player.currentHealth / player.maxHealth < 0.5) {
		ctx.fillStyle = "orange";
	}
	if (player.currentHealth / player.maxHealth < 0.25) {
		ctx.fillStyle = "red";
	}
	ctx.fill();

	ctx.beginPath();
	ctx.lineWidth = 2;
	ctx.strokeStyle = "black";
	ctx.rect(20,ctx.canvas.height - 15,560,10);
	ctx.stroke();

	//game over messages
	if (!boss.isAlive()) { //You Win!
		ctx.save();
		ctx.font = '100px serif';
		ctx.textAlign = "center";
		ctx.shadowColor="black";
		ctx.shadowBlur=1;
		ctx.lineWidth=3;
		ctx.strokeText("You Win!", ctx.canvas.width / 2, ctx.canvas.height / 2);
		ctx.shadowBlur=0;
		ctx.fillStyle = "orange";
		ctx.fillText("You Win!", ctx.canvas.width / 2, ctx.canvas.height / 2);
	} else if (!player.isAlive()) { //You Lose :(
		ctx.font = '100px serif';
		ctx.textAlign = "center";
		ctx.shadowColor="black";
		ctx.shadowBlur=1;
		ctx.lineWidth=3;
		ctx.strokeText("You Died :(", ctx.canvas.width / 2, ctx.canvas.height / 2);
		ctx.shadowBlur=0;
		ctx.fillStyle = "red";
		ctx.fillText("You Died :(", ctx.canvas.width / 2, ctx.canvas.height / 2);
	}

	if (changeKeybindState) {
		ctx.save();
		ctx.font = '100px serif';
		ctx.textAlign = "center";
		ctx.shadowColor="black";
		ctx.shadowBlur=1;
		ctx.lineWidth=3;
		ctx.strokeText("Set Keybind", ctx.canvas.width / 2, ctx.canvas.height / 2);
		ctx.shadowBlur=0;
		ctx.fillStyle = "yellow";
		ctx.fillText("Set Keybind", ctx.canvas.width / 2, ctx.canvas.height / 2);
	}

	if (gameOver) {
		ctx.font = '48px serif';
		ctx.fillStyle = "black";
		ctx.fillText("↡ Results below ↡", ctx.canvas.width / 2, (ctx.canvas.height/2) + 50);
		ctx.restore();
	}

	ctx.restore();
}

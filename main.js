require('prototype.spawn')();
require('prototype.creep');
require('prototype.tower');
require('RoomVisual');


/**
 *  Main iteration Loop.
 */
module.exports.loop = function () {

	//console.log("Server activity check");

	cleanMemory();

	triggerCreepsRoles();

	triggerTurretRole();

	triggerCreepSpawns();

	triggerTickCounter();

};

function triggerTickCounter() {
	let tickRate = 1500;
	//console.log(Game.time % tickRate);

	//Game.rooms[Game.spawns[allSpawns].room.name].memory.energyIncome

	if (Game.time % tickRate == 0) {
		for (let allSpawns in Game.spawns) {
			console.log("reset");
			Game.rooms[Game.spawns[allSpawns].room.name].memory.energyIncomePerTick = Game.rooms[Game.spawns[allSpawns].room.name].memory.energyIncome / tickRate;
			Game.rooms[Game.spawns[allSpawns].room.name].memory.energyIncome = 0;

			let controllerProgressOld = Game.rooms[Game.spawns[allSpawns].room.name].memory.controllerProgress;
			Game.rooms[Game.spawns[allSpawns].room.name].memory.controllerProgress = Game.rooms[Game.spawns[allSpawns].room.name].controller.progress;

			Game.rooms[Game.spawns[allSpawns].room.name].memory.controllerProgressPerTick = (Game.rooms[Game.spawns[allSpawns].room.name].controller.progress - controllerProgressOld) / tickRate;
		}
	}
}

/**
 * Run spawn logic.
 */
function triggerCreepSpawns() {
	// For each spawn
	for (let allSpawns in Game.spawns) {
		Game.spawns[allSpawns].room.visual.speechTransparent("   Income " + (Game.rooms[Game.spawns[allSpawns].room.name].memory.energyIncomePerTick).toFixed(3), 38, 17);
		Game.spawns[allSpawns].room.visual.speechTransparent("   Controller  " + Game.rooms[Game.spawns[allSpawns].room.name].memory.controllerProgressPerTick, 38, 18);

		// Run spawn logic.
		Game.spawns[allSpawns].spawnCreepsIfNecessary();
	}
}

/**
 * Run turret logic for each turret.
 */
function triggerTurretRole() {
	// Find all towers.
	var allTowers = _.filter(Game.structures, s => s.structureType == STRUCTURE_TOWER);
	// for each tower.
	for (let tower of allTowers) {
		// run tower logic
		tower.defend();
	}
}

/**
 * For each creep run role logic.
 */
function triggerCreepsRoles() {
	for (let oneCreep in Game.creeps) {
		if (oneCreep.spawning) {
			console.log("hio");
		}

		//	if (creep.spawning == false) {
		Game.creeps[oneCreep].runRole();
		//	}
	}
}

/**
 * Check for memory entries of died creeps by iterating over Memory.creeps.
 */
function cleanMemory() {
	for (let allSavedCreeps in Memory.creeps) {
		// Checking if the creep is still alive.
		if (Game.creeps[allSavedCreeps] == undefined) {
			// If not, delete the memory entry.
			delete Memory.creeps[allSavedCreeps];
		}
	}
}
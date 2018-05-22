require('prototype.spawn')();
require('prototype.creep');
require('prototype.tower');
require('RoomVisual');


/**
 *  Main iteration Loop.
 */
module.exports.loop = function () {
	cleanMemory();

	triggerCreepsRoles();

	triggerTurretRole();

	triggerCreepSpawns();
};

/**
 * Run spawn logic.
 */
function triggerCreepSpawns() {
	// For each spawn
	for (let allSpawns in Game.spawns) {
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
	for (let allCreeps in Game.creeps) {
		Game.creeps[allCreeps].runRole();
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

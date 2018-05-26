var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleRepairer = require('role.repairer');
var roleWallRepairer = require('role.wallRepairer');
var roleCarrier = require('role.carrier');
var roleMiner = require('role.miner');
var roleLongDistanceHarvester = require('role.longDistanceHarvester');


var listOfRoles = ['H', 'M', 'C', 'U', 'T', 'B', 'WR', 'LDH', 'R', 'CL', 'LDB'];

/**
 * Spawns a creep if it makes sense.
 */
StructureSpawn.prototype.spawnCreepsIfNecessary = function () {
	let room = this.room;
	let maxEnergy = room.energyCapacityAvailable;
	let creepsInRoom = room.find(FIND_MY_CREEPS);
	let numberOfCreeps = {};
	// Count existing creeps per role.
	for (let role of listOfRoles) {
		numberOfCreeps[role] = _.sum(creepsInRoom, (c) => c.memory.role == role);
	}


	// Setup some minimum numbers for different roles.
	var minimumNumberOfHarvesters = 2;
	var minimumNumberOfMiners = 2;
	var minimumNumberOfUpgraders = 3;
	var minimumNumberOfBuilders = 1;
	var minimumNumberOfRepairers = 1;
	var minimumNumberOfWallRepairers = 1;
	var minimumNumberOfLongDistanceHarvestersW7N4 = 3;
	var minimumNumberOfLongDistanceHarvestersW8N3 = 3;
	var minimumNumberOfLongDistanceHarvestersW6N3 = 3;
	var minimumNumberOfLongDistanceBuilderW7N4 = 2;
	var minimumNumberOfCarrier = 4;
	var minimumNumberOfClaimer = 0;



	// count the number of creeps alive for each role
	// _.sum will count the number of properties in Game.creeps filtered by the
	//  arrow function, which checks for the creep being a harvester

	var numberOfLongDistanceHarvestersW7N4 = _.sum(Game.creeps, (c) => c.memory.role == 'LDH' && c.memory.target == 'W7N4');
	var numberOfLongDistanceHarvestersW8N3 = _.sum(Game.creeps, (c) => c.memory.role == 'LDH' && c.memory.target == 'W8N3');
	var numberOfLongDistanceHarvestersW6N3 = _.sum(Game.creeps, (c) => c.memory.role == 'LDH' && c.memory.target == 'W6N3');

	var numberOfLongDistanceBuilderW7N4 = _.sum(Game.creeps, (c) => c.memory.role == 'LDB' && c.memory.target == 'W7N4');

	var roomEnergyCapacity = this.room.energyCapacityAvailable;
	var nameOfSpawnedCreep = null;


	// If non harvesers and carriers alive.
	if (numberOfCreeps['H'] < minimumNumberOfHarvesters && numberOfCreeps['C'] < 1) {
		// If non miners alive.
		if (numberOfCreeps['M'] < 1) {
			// Try to spawn harvester.
			nameOfSpawnedCreep = this.createCustomCreep(roomEnergyCapacity, 'H');
			// If spawning failed.
			if (nameOfSpawnedCreep == ERR_NOT_ENOUGH_ENERGY) {
				// Spawn one with what is available.
				nameOfSpawnedCreep = this.createCustomCreep(this.room.energyAvailable, 'H');
				console.log("@" + this.name + ": To less energy: " + this.room.energyAvailable);
			}
		} else {
			// Spawn a carrier if miner exists.

			nameOfSpawnedCreep = this.createCustomCreep(roomEnergyCapacity, 'C');
			// If spawning failed.
			if (nameOfSpawnedCreep == ERR_NOT_ENOUGH_ENERGY) {
				// Spawn one with what is available.
				nameOfSpawnedCreep = this.createCustomCreep(this.room.energyAvailable, 'C');
				console.log("@" + this.name + ": To less energy: " + this.room.energyAvailable);
			}
		}

	} else if (numberOfCreeps['M'] < minimumNumberOfMiners) {

		// Check if all sources have miners.
		let sources = room.find(FIND_SOURCES);
		// Iterate over all sources.
		for (let source of sources) {
			// If the source has no miner.
			if (!_.some(creepsInRoom, c => c.memory.role == 'M' && c.memory.sourceId == source.id)) {
				// Check whether or not the source has a container.
				let containers = source.pos.findInRange(FIND_STRUCTURES, 1, {
					filter: s => s.structureType == STRUCTURE_CONTAINER
				});
				// If there is a container next to the source.
				if (containers.length > 0) {
					// Spawn a miner.
					nameOfSpawnedCreep = this.createCustomCreep(roomEnergyCapacity, 'M', source.id);
				}
			}
		}
	} else if (numberOfCreeps['CL'] < minimumNumberOfClaimer) {
		nameOfSpawnedCreep = this.createClaimer('W7N4');
	} else if (numberOfCreeps['C'] < minimumNumberOfCarrier / 2) {
		nameOfSpawnedCreep = this.createCustomCreep(roomEnergyCapacity, 'C');
	} else if (numberOfLongDistanceBuilderW7N4 < minimumNumberOfLongDistanceBuilderW7N4) {
		nameOfSpawnedCreep = this.createCustomCreep(roomEnergyCapacity, 'LDB', null, 'W7N4');
	} else if (numberOfLongDistanceHarvestersW7N4 < minimumNumberOfLongDistanceHarvestersW7N4) {
		nameOfSpawnedCreep = this.createLongDistanceHarvester(roomEnergyCapacity, 3, 'W7N4', 0);
	} else if (numberOfLongDistanceHarvestersW8N3 < minimumNumberOfLongDistanceHarvestersW8N3) {
		nameOfSpawnedCreep = this.createLongDistanceHarvester(roomEnergyCapacity, 3, 'W8N3', 0);
	} else if (numberOfLongDistanceHarvestersW6N3 < minimumNumberOfLongDistanceHarvestersW6N3) {
		nameOfSpawnedCreep = this.createLongDistanceHarvester(roomEnergyCapacity, 3, 'W6N3', 0);

	} else if (numberOfCreeps['U'] < minimumNumberOfUpgraders) {
		nameOfSpawnedCreep = this.createCustomCreep(roomEnergyCapacity, 'U');
	} else if (numberOfCreeps['R'] < minimumNumberOfRepairers) {
		nameOfSpawnedCreep = this.createCustomCreep(roomEnergyCapacity, 'R');
	} else if (numberOfCreeps['B'] < minimumNumberOfBuilders) {
		nameOfSpawnedCreep = this.createCustomCreep(roomEnergyCapacity, 'B');
	} else if (numberOfCreeps['WR'] < minimumNumberOfWallRepairers) {
		nameOfSpawnedCreep = this.createCustomCreep(roomEnergyCapacity, 'WR');
	} else if (numberOfCreeps['C'] < minimumNumberOfCarrier) {
		nameOfSpawnedCreep = this.createCustomCreep(roomEnergyCapacity, 'C');
	} else {
		room.visual.speech('All creeps exists.', 39, 15);
	}
	// Print name to console if spawning was a success.
	if (nameOfSpawnedCreep != null && !(nameOfSpawnedCreep < 0)) {
		console.log("@" + this.name + ": Spawned new creep: " + nameOfSpawnedCreep);
		Memory.numberOfCreep++;
	}
}


module.exports = function () {
    /**
     * Spawns a creep.
     * @param energyAvailable Maximum energy for spawning.
     * @param roleName Name of role @see listOfRoles .
     * @param sourceId = null Source id for mining target.
     * @returns Spawned creep message.
     */
	StructureSpawn.prototype.createCustomCreep = function (energyAvailable, roleName, sourceId = null, target = null) {
		let creepNumber = Memory.numberOfCreep;
		let body = [];
		if (roleName == 'M') {
			var numberOfParts = Math.floor((energyAvailable - 50) / 100);
			// create maximum work-parts but maximal 10. For greatest efficency.
			for (let i = 0; (i < numberOfParts) && (i < 5); i++) {
				body.push(WORK);
			}
			body.push(MOVE);

		} else if (roleName == 'C') {
			let numberOfParts = Math.floor(energyAvailable / 200 / 2);

			for (let i = 0; i < numberOfParts * 2; i++) {
				body.push(CARRY);
			}
			for (let i = 0; i < numberOfParts; i++) {
				body.push(MOVE);
			}
		} else if (roleName == 'U') {
			let numberOfParts = Math.floor(energyAvailable / 200);

			for (let i = 0; i < numberOfParts; i++) {
				body.push(WORK);
			}
			for (let i = 0; i < numberOfParts; i++) {
				body.push(CARRY);
			}
			for (let i = 0; i < numberOfParts; i++) {
				body.push(MOVE);
			}
		} else if (roleName == 'H') {
			let numberOfParts = Math.floor(energyAvailable / 200);

			for (let i = 0; i < numberOfParts; i++) {
				body.push(WORK);
			}
			for (let i = 0; i < numberOfParts; i++) {
				body.push(CARRY);
			}
			for (let i = 0; i < numberOfParts; i++) {
				body.push(MOVE);
			}
		} else if (roleName == 'LDB') {
			let numberOfParts = Math.floor(energyAvailable / 300);

			for (let i = 0; i < numberOfParts; i++) {
				body.push(WORK);
			}
			for (let i = 0; i < numberOfParts*2; i++) {
				body.push(CARRY);
			}
			for (let i = 0; i < numberOfParts*2; i++) {
				body.push(MOVE);
			}
		} else {
			// Create a balanced body as big as possible with the given energy divided by two.
			let numberOfParts = Math.floor(energyAvailable / 200 / 2);

			for (let i = 0; i < numberOfParts; i++) {
				body.push(WORK);
			}
			for (let i = 0; i < numberOfParts; i++) {
				body.push(CARRY);
			}
			for (let i = 0; i < numberOfParts; i++) {
				body.push(MOVE);
			}
		}
		// Create creep with the created body and the given role.
		return this.createCreep(body, creepNumber + '-' + roleName, { role: roleName, working: false, home: this.room, target: target, sourceId: sourceId });
	};

	/**
	 * Spawns LDH Creep.
	 * @param energyAvailable Maximum energy for spawning.
	 * @param numberOfWorkParts Number of work body parts for creep.
	 * @param home Home room of creep.
	 * @param target Target room of creep.
	 * @param sourceIndex Target source for creep.
	 * @returns Spawned creep message.
	 */
	StructureSpawn.prototype.createLongDistanceHarvester = function (energyAvailable, numberOfWorkParts, target, sourceIndex) {
		let creepNumber = Memory.numberOfCreep;
		// create a body with the specified number of WORK parts and one MOVE part per non-MOVE part
		var body = [];
		for (let i = 0; i < numberOfWorkParts; i++) {
			body.push(WORK);
		}

		// 150 = 100 (cost of WORK) + 50 (cost of MOVE)
		energyAvailable -= 150 * numberOfWorkParts;
		energyAvailable -= 130
		var numberOfParts = Math.floor(energyAvailable / 100);
		for (let i = 0; i < numberOfParts; i++) {
			body.push(CARRY);
		}
		for (let i = 0; i < numberOfParts + numberOfWorkParts + 1; i++) {
			body.push(MOVE);
		}
		body.push(ATTACK);
		// Create creep with the created body
		return this.createCreep(body, creepNumber + '-' + 'LDH', {
			role: 'LDH',
			home: this.room,
			target: target,
			sourceIndex: sourceIndex,
			working: false
		});
	};

	/**
	 * Spawns claimer Creep.
	 * @param target Target room to claim.
	 * @returns Spawned creep message.
	 */
	StructureSpawn.prototype.createClaimer = function (target) {
		let creepNumber = Memory.numberOfCreep;
		roleName = 'CL';
		return this.createCreep([CLAIM, MOVE], creepNumber + '-' + roleName, { role: roleName, home: this.room, target: target });
	};
};
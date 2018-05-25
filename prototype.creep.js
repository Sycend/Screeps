var roles = {
	H: require('role.harvester'),
	M: require('role.miner'),
	U: require('role.upgrader'),
	B: require('role.builder'),
	R: require('role.repairer'),
	WR: require('role.wallRepairer'),
	C: require('role.carrier'),
	LDH: require('role.longDistanceHarvester'),
	CL: require('role.claimer')
};

/**
 * Execute role for each creep.
 */
Creep.prototype.runRole = function () {
	roles[this.memory.role].run(this);
};

/**
 * Attacks enemy if in room.
 */
Creep.prototype.attack = function () {
	var enemies = this.room.find(Game.HOSTILE_CREEPS);
	console.log('Attacker found @ ' + this.room.name + ': ' + Game.HOSTILE_CREEPS);
	this.moveTo(enemies[0]);
	this.attack(enemies[0]);
}

/**
 * Put energy in container/storage/base.
 * @param useContainer Can use Container.
 * @param useStorage Can use Storage.
 * @param useBase Can use Base.
 */
Creep.prototype.putEnergy = function (useContainer, useStorage, useBase) {
	let structure = null
	if (useBase) {
		structure = transferEnergyToBase(this, structure);
	}
	if (useContainer && structure == null) {
		structure = transferEnergyToContainer(this, structure);
	}
	if (useStorage && structure == null) {
		structure = transferEnergyToStorage(this, structure);
	}
	if (structure == null) {
		structure = transferEnergyToBase(this, structure);
	}

}
/**
 * Collect energy from loot/container/storage/source.
 * @param useContainer Can use Container.
 * @param useStorage Can use Storage.
 * @param useSource Can use Source.
 */
Creep.prototype.getEnergy = function (useContainer, useStorage, useSource) {
	let structure = null;
	structure = this.room.find(FIND_MY_STRUCTURES, { filter: s => (s.structureType == STRUCTURE_STORAGE) });
	if (structure == "") {
		useContainer = true;
	}
	structure = null;
	// If the creep should look for loot.
	useLoot = useContainer;
	if (useLoot && structure == undefined) {
		loot = this.pos.findClosestByRange(FIND_DROPPED_RESOURCES, { filter: s => (s.energy > 100) });
		if (this.pickup(loot) != OK) {
			this.moveTo(loot);
		} else {
			this.say("Loot! o.o")
		}
	}

	// If the creep should look for containers.
	if (useContainer && structure == undefined) {
		// find closest container.
		structure = this.pos.findClosestByPath(FIND_STRUCTURES, {
			filter: s => (s.structureType == STRUCTURE_CONTAINER)
				&& s.store[RESOURCE_ENERGY] > this.carryCapacity / 10
		});
	}

	// If the creep should look for storages.
	if (useStorage && structure == undefined) {
		// find closest storage.
		structure = this.pos.findClosestByPath(FIND_STRUCTURES, {
			filter: s => (s.structureType == STRUCTURE_STORAGE)
				&& s.store[RESOURCE_ENERGY] > this.carryCapacity / 10
		});
	}

	// If the creep should look for sources.
	if (useSource) {
		// find closest source
		var source = this.pos.findClosestByPath(FIND_SOURCES_ACTIVE);

		// try to harvest energy, if the source is not in range
		if (this.harvest(source) == ERR_NOT_IN_RANGE) {
			// move towards it
			this.moveTo(source, { maxRooms: 1 });
		}
	}

	// If creep found something.
	if (structure != undefined) {
		// try to withdraw energy, if the container is not in range
		if (this.withdraw(structure, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
			// move towards it
			this.moveTo(structure, { maxRooms: 1 });
		}
	} else {
		this.say("Zzz");
	}
};

function transferEnergyToStorage(creep, structure) {
	structure = creep.pos.findClosestByPath(FIND_STRUCTURES, {
		filter: (s) => (s.structureType == STRUCTURE_STORAGE
			// && s.energy < s.energyCapacity
		)
	});
	transferEnergyToStructure(creep, structure, true);
	return structure;
}

function transferEnergyToContainer(creep, structure) {
	structure = creep.pos.findClosestByPath(FIND_STRUCTURES, {
		filter: (s) => (s.structureType == STRUCTURE_CONTAINER
			&& _.sum(s.store) < s.storeCapacity)
	});
	transferEnergyToStructure(creep, structure, true);
	return structure;
}

function transferEnergyToBase(creep, structure) {
	if (creep.memory.role != 'H') {
		structure = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
			// the second argument for findClosestByPath is an object which takes
			// a property called filter which can be a function
			// we use the arrow operator to define it
			filter: (s) => ((s.structureType == STRUCTURE_SPAWN
				|| s.structureType == STRUCTURE_TOWER
				|| s.structureType == STRUCTURE_EXTENSION)
				&& s.energy < s.energyCapacity)
		});
	}
	else {
		structure = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
			// the second argument for findClosestByPath is an object which takes
			// a property called filter which can be a function
			// we use the arrow operator to define it
			filter: (s) => ((s.structureType == STRUCTURE_SPAWN
				|| s.structureType == STRUCTURE_EXTENSION)
				&& s.energy < s.energyCapacity)
		});
	}
	transferEnergyToStructure(creep, structure, false);
	return structure;
}

function transferEnergyToStructure(creep, structure, useCounter) {
	if (structure != null) {
		// Try to transfer energy.
		creepEnergyAmount = creep.energy;
		let transferReturnMessage = creep.transfer(structure, RESOURCE_ENERGY);
		if (transferReturnMessage == OK) {
			if (useCounter != true) {
				//Memory.rooms[this.memory.home].EnergyIncome = Memory.rooms[this.memory.home].EnergyIncome + creepEnergyAmount;
			}
		}
		else if (transferReturnMessage == ERR_NOT_IN_RANGE) {
			// If it is not in range move towards it.
			creep.moveTo(structure, { maxRooms: 1 });
		}
		else {
			creep.say("Error :" + transferReturnMessage);
		}
	}
}

/**
 * Finds structure spawn/tower/extension.
 * @param creep Creep that should do the job.
 * @param useBase Creep should use Base.
 * @param structure Previous structures.
 * @returns structure with spawn/tower/extension.
 */
function getBaseStructure(creep, useBase, structure) {
	if (useBase && structure == undefined) {
		if (creep.memory.role != 'H') {
			structure = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
				// the second argument for findClosestByPath is an object which takes
				// a property called filter which can be a function
				// we use the arrow operator to define it
				filter: (s) => ((s.structureType == STRUCTURE_SPAWN
					|| s.structureType == STRUCTURE_TOWER
					|| s.structureType == STRUCTURE_EXTENSION)
					&& s.energy < s.energyCapacity)
			});
		} else {
			structure = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
				// the second argument for findClosestByPath is an object which takes
				// a property called filter which can be a function
				// we use the arrow operator to define it
				filter: (s) => ((s.structureType == STRUCTURE_SPAWN
					|| s.structureType == STRUCTURE_EXTENSION)
					&& s.energy < s.energyCapacity)
			});
		}
	}
	return structure;
}

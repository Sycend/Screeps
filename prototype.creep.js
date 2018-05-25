/**
 * Define existing Roles here.
 */
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
	if (this.memory.energyCarried != null) {
		Game.rooms[this.memory.home.name].memory.energyIncome = Game.rooms[this.memory.home.name].memory.energyIncome + this.carry[RESOURCE_ENERGY] - this.memory.energyCarried;
		this.memory.energyCarried = null;
	}
	roles[this.memory.role].run(this);
	//this.say(this.carry[RESOURCE_ENERGY]);
};

/**
 * Attacks enemy if in room.
 */
Creep.prototype.attack = function () {
	var enemies = this.room.find(Game.HOSTILE_CREEPS);
	console.log('Attacker found @ ' + this.room.name + ': ' + Game.HOSTILE_CREEPS);
	this.moveTo(enemies[0], { maxRooms: 1 });
	this.attack(enemies[0], { maxRooms: 1 });
}

/**
 * Put energy in container/storage/base.
 * Creep will use Base if nothing is else is available.
 * @param useContainer Can use Container.
 * @param useStorage Can use Storage.
 * @param useBase Can use Base.
 */
Creep.prototype.putEnergy = function (useContainer, useStorage, useBase) {
	let transferReturnMessage = null
	if (useBase) {
		transferReturnMessage = transferEnergyToBase(this);
	}
	if (useContainer && transferReturnMessage == null) {
		transferReturnMessage = transferEnergyToContainer(this);
	}
	if (useStorage && transferReturnMessage == null) {
		transferReturnMessage = transferEnergyToStorage(this);
	}
	if (transferReturnMessage == null) {
		transferReturnMessage = transferEnergyToBase(this);
	}

}

/**
 * Collect energy from loot/container/storage/source.
 * @param useContainer Can use Container.
 * @param useStorage Can use Storage.
 * @param useSource Can use Source.
 */
Creep.prototype.getEnergy = function (useLoot, useContainer, useStorage, useSource) {
	let structures = null;
	// If no Storage exists, use Container instead.
	structures = this.room.find(FIND_MY_STRUCTURES, { filter: s => (s.structureType == STRUCTURE_STORAGE) });
	if (structures == null) {
		useContainer = true;
	}


	let withdrawReturnMessage = null;

	if (useLoot) {
		findAndPickUpLoot(this);
	}

	if (useContainer && withdrawReturnMessage == null) {
		withdrawReturnMessage = withdrawFromContainer(this);
	}

	if (useStorage && withdrawReturnMessage == null) {
		withdrawReturnMessage = withdrawFromStorage(this);
	}

	// If the creep should look for sources.
	if (useSource && withdrawReturnMessage == null) {
		// find closest source
		var source = this.pos.findClosestByPath(FIND_SOURCES_ACTIVE);

		// try to harvest energy, if the source is not in range
		if (this.harvest(source) == ERR_NOT_IN_RANGE) {
			// move towards it
			this.moveTo(source, { maxRooms: 1 });
		}
	}

};

function withdrawFromStorage(creep) {
	let structure = creep.pos.findClosestByPath(FIND_STRUCTURES, {
		filter: s => (s.structureType == STRUCTURE_STORAGE)
			&& s.store[RESOURCE_ENERGY] > creep.carryCapacity / 10
	});
	let withdrawReturnMessage = withdrawEnergyFromStructure(creep, structure);
	return withdrawReturnMessage;
}

function withdrawFromContainer(creep) {
	let structure = creep.pos.findClosestByPath(FIND_STRUCTURES, {
		filter: s => (s.structureType == STRUCTURE_CONTAINER)
			&& s.store[RESOURCE_ENERGY] > creep.carryCapacity / 3
	});
	let withdrawReturnMessage = withdrawEnergyFromStructure(creep, structure);
	return withdrawReturnMessage;
}
/**
 * Withdraws Energy from given Structure.
 * @param creep
 * @param structure
 * @returns
 */
function withdrawEnergyFromStructure(creep, structure) {
	if (structure != null) {


		let withdrawReturnMessage = creep.withdraw(structure, RESOURCE_ENERGY);
		if (withdrawReturnMessage == OK) {
			if (creep.memory.role == 'C') {
				creep.memory.energyCarried = creep.carry[RESOURCE_ENERGY];
			}
		} else if (withdrawReturnMessage == ERR_NOT_IN_RANGE) {
			// If the container is not in range, move towards it.
			creep.moveTo(structure, { maxRooms: 1 });
		} else {
			creep.say("Error: " + withdrawReturnMessage);
		}
		return withdrawReturnMessage;
	} else {
		creep.say("?");
		return null;
	}

}
/**
 * 
 * @param creep
 */
function findAndPickUpLoot(creep) {
	let loot = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES, { filter: s => (s.energy > 100) });
	if (creep.pickup(loot) != OK) {
		creep.moveTo(loot, { maxRooms: 1 });
	}
	else {
		creep.say("Loot! o.o");
	}
}

/**
 * Tries to transfer energy to storage.
 * @param creep
 * @param structure 
 * @returns transfer message.
 */
function transferEnergyToStorage(creep) {
	let structure = creep.pos.findClosestByPath(FIND_STRUCTURES, {
		filter: (s) => (s.structureType == STRUCTURE_STORAGE
			// && s.energy < s.energyCapacity
		)
	});
	transferReturnMessage = transferEnergyToStructure(creep, structure, true);
	return transferReturnMessage;
}

/**
 * Tries to transfer energy to container.
 * @param creep
 * @param structure 
 * @returns transfer message.
 */
function transferEnergyToContainer(creep) {
	let structure = creep.pos.findClosestByPath(FIND_STRUCTURES, {
		filter: (s) => (s.structureType == STRUCTURE_CONTAINER
			&& _.sum(s.store) < s.storeCapacity)
	});
	let transferReturnMessage = transferEnergyToStructure(creep, structure, true);
	return transferReturnMessage;
}

/**
 * Tries to transfer energy to base.
 * @param creep
 * @param structure 
 * @returns transfer message.
 */
function transferEnergyToBase(creep) {
	let structure;
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
	let transferReturnMessage = transferEnergyToStructure(creep, structure, false);
	return transferReturnMessage;
}

/**
 * Tries to transfer energy to structure.
 * @param creep
 * @param structure 
 * @param useCounter Defines if energy counter should be usesd.
 * @returns transfer message.
 */
function transferEnergyToStructure(creep, structure, useCounter) {
	if (structure != null) {
		// Try to transfer energy.
		creepEnergyAmount = creep.energy;
		let transferReturnMessage = creep.transfer(structure, RESOURCE_ENERGY);
		if (transferReturnMessage == OK) {
			return transferReturnMessage;
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
		return transferReturnMessage;
	} else {
		creep.say("!");
		return null;
	}
}


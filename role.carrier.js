module.exports = {
    /**
     * Logic of carrier.
     * @param creep Creep that should do that job.
     */
	run: function (creep) {
		if (creep.memory.working == true && creep.carry.energy == 0) {
			// Switch state.
			creep.memory.working = false;
		} else if (creep.memory.working == false && creep.carry.energy == creep.carryCapacity) {
			// If creep is harvesting energy but is full.
			// Switch state.
			creep.memory.working = true;
		}
		if (creep.memory.working == true) {
			creep.putEnergy(false, true, true);
		} else {
			// if creep is supposed to get energy from source.
			let structure = null;
			structure = creep.room.find(FIND_MY_STRUCTURES, {
				filter: s => (s.structureType == STRUCTURE_SPAWN
					|| s.structureType == STRUCTURE_TOWER
					|| s.structureType == STRUCTURE_EXTENSION)
					&& s.energy < s.energyCapacity
			});
			if (structure != "") {
				creep.getEnergy(true, true, true, false);
			} else {
				creep.getEnergy(true, true, false, false);
			}
		}
	}
};
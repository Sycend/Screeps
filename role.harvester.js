module.exports = {
	/**
	 * Logic of harvester.
	 * @param creep Creep that should do that job.
	 */
	run: function (creep) {
		// If creep is bringing energy to a structure but has no energy left.
		if (creep.memory.working == true && creep.carry.energy == 0) {
			// Switch state.
			creep.memory.working = false;
		}		else if (creep.memory.working == false && creep.carry.energy == creep.carryCapacity) {
			// If creep is harvesting energy but is full.
			// Switch state.
			creep.memory.working = true;
		}
		// If creep is supposed to transfer energy to a structure.
		if (creep.memory.working == true) {
			// Only if role Carrier exists.
			if (_.sum(Game.creeps, (c) => c.memory.role == 'C') > 0) {
				creep.putEnergy(true, false, false);
			} else {
				creep.putEnergy(false, false, true);
			}
		}
		// If creep is supposed to harvest energy from source.
		else {
			creep.getEnergy(false, false, true);
		}
	}
};
module.exports = {
	/**
	 * Logic of miner.
	 * @param creep Creep that should do that job.
	 */
    run: function (creep) {
        // Get source.
        let sourceId = Game.getObjectById(creep.memory.sourceId);
        // Find container next to source.
        let container = sourceId.pos.findInRange(FIND_STRUCTURES, 1, {
            filter: s => s.structureType == STRUCTURE_CONTAINER
        })[0];
		        
		if (creep.pos.isEqualTo(container.pos)) {
			// If creep is on top of the container.
            // Harvest source.
            creep.harvest(sourceId);
        }		else {
			 // If creep is not on top of the container.
            creep.moveTo(container);
        }
    }
};

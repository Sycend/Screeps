module.exports = {
	/**
	 * Logic of claimer.
	 * @param creep Creep that should do that job.
	 */
	run: function (creep) {
		// If in target room.
		if (creep.room.name != creep.memory.target) {
			// Find exit to target room.
			var exit = creep.room.findExitTo(creep.memory.target);
			// Move to exit.
			creep.moveTo(creep.pos.findClosestByRange(exit));
		} else {
			// Try to claim controller.
			if (creep.claimController(creep.room.controller) == ERR_NOT_IN_RANGE) {
				// Move towards the controller.
				creep.moveTo(creep.room.controller, { maxRooms: 1 });
			}
		}
	}
};
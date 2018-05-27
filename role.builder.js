var roleUpgrader = require('role.upgrader');

module.exports = {
	// a function to run the logic for this role
	run: function (creep) {




		// if creep is trying to complete a constructionSite but has no energy left
		if (creep.memory.working == true && creep.carry.energy == 0) {
			// switch state
			creep.memory.working = false;
		}
		// if creep is harvesting energy but is full
		else if (creep.memory.working == false && creep.carry.energy == creep.carryCapacity) {
			// switch state
			creep.memory.working = true;
		}

		// if creep is supposed to complete a constructionSite
		if (creep.memory.working == true) {
			if (creep.memory.target != undefined && creep.room.name != creep.memory.target) {
				// if target is defined and creep is not in target room
				// find exit to target room
				var exit = creep.room.findExitTo(creep.memory.target);
				// move to exit
				creep.moveTo(creep.pos.findClosestByRange(exit));
				// return the function to not do anything else
				return;
			}
			// find closest constructionSite
			var constructionSite = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
			// if one is found

			if (constructionSite != undefined) {
				// try to build, if the constructionSite is not in range
				if (creep.build(constructionSite) == ERR_NOT_IN_RANGE) {
					// move towards the constructionSite
					creep.moveTo(constructionSite, { maxRooms: 1 });
				}
			}
			// if no constructionSite is found
			else {
				// go upgrading the controller
				roleUpgrader.run(creep);
			}
		}

		// if creep is supposed to harvest energy from source
		else {
			if (creep.room.name != creep.memory.home.name) {
				
				// if target is defined and creep is not in target room
				// find exit to target room
				var exit = creep.room.findExitTo(creep.memory.home);
				// move to exit
				creep.moveTo(creep.pos.findClosestByRange(exit));
				// return the function to not do anything else
				return;
			}
			creep.getEnergy(false, false, true, false);
		}
	}
};
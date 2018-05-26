module.exports = {
	// a function to run the logic for this role
	run: function (creep) {
		// if creep is bringing energy to a structure but has no energy left
		if (creep.memory.working == true && creep.carry.energy == 0) {
			// switch state
			creep.memory.working = false;
		}
		// if creep is harvesting energy but is full
		else if (creep.memory.working == false && creep.carry.energy == creep.carryCapacity) {
			// switch state
			creep.memory.working = true;
		}
		// if attacker is in room -> Attack
		if (creep.room.find(Game.HOSTILE_CREEPS) > 0) {
			console.log(creep.room.find(Game.HOSTILE_CREEPS));
			creep.attack();
		}
		// if creep is supposed to transfer energy to a structure
		else if (creep.memory.working == true) {
            /* if (creep.pos.x * creep.pos.y === 0 || creep.pos.x === 49 || creep.pos.y === 49) {
                creep.moveTo(new RoomPosition(25, 25, creep.memory.workInRoom));
            }*/
			// if in home room
			if (creep.room.name == creep.memory.home.name) {
				creep.putEnergy(true, true, false);
			}
			// if not in home room...
			else {
				// find exit to home room
				var exit = creep.room.findExitTo(creep.memory.home.name);
				// and move to exit
				creep.moveTo(creep.pos.findClosestByRange(exit));
			}
		}
		// if creep is supposed to harvest energy from source
		else {
            /*  if (creep.pos.x * creep.pos.y === 0 || creep.pos.x === 49 || creep.pos.y === 49) {
                  creep.moveTo(new RoomPosition(25, 25, creep.memory.workInRoom));
              }*/
			// if in target room
			if (creep.room.name == creep.memory.target) {
				creep.getEnergy(false, false, false, true);
			}
			// if not in target room
			else {
				// find exit to target room
				var exit = creep.room.findExitTo(creep.memory.target);
				// move to exit
				creep.moveTo(creep.pos.findClosestByRange(exit));
			}
		}
	}
};
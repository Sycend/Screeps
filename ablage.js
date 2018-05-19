
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

        // if creep is supposed to transfer energy to a structure
        if (creep.room.name == creep.memory.home) {
            if (creep.memory.working == true) {
                creep.putEnergy();
            }
        } else {
            // find exit to home room
            var exit = creep.room.findExitTo(creep.memory.home);
            // move to exit
            creep.moveTo(creep.pos.findClosestByRange(exit));
        }
        // if creep is supposed to harvest energy from source
        else {
        // if in target room
        if(creep.room.name == creep.memory.target) {

    creep.getEnergy(false, true);
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
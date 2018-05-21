module.exports = {
    run: function (creep) {
        if (creep.memory.working == true && creep.carry.energy == 0) {
            // switch state
            creep.memory.working = false;
        }
        // if creep is harvesting energy but is full
        else if (creep.memory.working == false && creep.carry.energy == creep.carryCapacity) {
            // switch state
            creep.memory.working = true;
        }
        if (creep.memory.working == true) {


            creep.putEnergy(false, true, true);

        }
        // if creep is supposed to get energy from source
        else {
            let structure = null;
            structure = creep.room.find(FIND_MY_STRUCTURES, {
                filter: s => (s.structureType == STRUCTURE_SPAWN
                    || s.structureType == STRUCTURE_TOWER
                    || s.structureType == STRUCTURE_EXTENSION)
                    && s.energy < s.energyCapacity
            });

            if (structure != "") {
                creep.getEnergy(true, true, false);
            } else {
                creep.getEnergy(true, false, false);
            }
        }
    }
};
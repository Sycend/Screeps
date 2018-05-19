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
        if (creep.memory.working == true) {
            //only if role Carrier exists
            if (_.sum(Game.creeps, (c) => c.memory.role == 'C') > 0) {
                creep.putEnergy(true,false,false);
            } else {
                creep.putEnergy(false,false,true);
            }
        }
        // if creep is supposed to harvest energy from source
        else {
            creep.getEnergy(false, false, true);
        }
    }
};
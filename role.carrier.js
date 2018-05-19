/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.carrier');
 * mod.thing == 'a thing'; // true
 */

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
            creep.putEnergy(false,true,true);
        }
        // if creep is supposed to get energy from source
        else {
            creep.getEnergy(true, true, false);
        }
    }
};
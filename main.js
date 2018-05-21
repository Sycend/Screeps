// import modules
require('prototype.spawn')();
require('prototype.creep');
require('prototype.tower');
require('RoomVisual');
//require('screeps');

module.exports.loop = function () {
    /// <summary>
    /// Main iteration Loop
    /// </summary>
    cleanMemory();

    triggerCreepsRoles();

    triggerTurretRole();

    triggerCreepSpawns();
};

function triggerCreepSpawns() {
    /// <summary>
    /// Run spawn logic.
    /// </summary>
    // for each spawn
    for (let spawnName in Game.spawns) {
        // run spawn logic
        Game.spawns[spawnName].spawnCreepsIfNecessary();
    }
}

function triggerTurretRole() {
    /// <summary>
    /// Run turret logic for each turret.
    /// </summary>
    // find all towers
    var towers = _.filter(Game.structures, s => s.structureType == STRUCTURE_TOWER);
    // for each tower
    for (let tower of towers) {
        // run tower logic
        tower.defend();
    }
}

function triggerCreepsRoles() {
    /// <summary>
    /// for each creep run role logic.
    /// </summary>
    for (let name in Game.creeps) {
        Game.creeps[name].runRole();
    }
}

function cleanMemory() {
    /// <summary>
    /// Check for memory entries of died creeps by iterating over Memory.creeps.
    /// </summary>
    for (let name in Memory.creeps) {
        // and checking if the creep is still alive
        if (Game.creeps[name] == undefined) {
            // if not, delete the memory entry
            delete Memory.creeps[name];
        }
    }
}

var roles = {
    H: require('role.harvester'),
    M: require('role.miner'),
    U: require('role.upgrader'),
    B: require('role.builder'),
    R: require('role.repairer'),
    WR: require('role.wallRepairer'),
    C: require('role.carrier'),
    LDH: require('role.longDistanceHarvester'),
    CL: require('role.claimer')
};

Creep.prototype.runRole = function () {
    roles[this.memory.role].run(this);
};


Creep.prototype.attack = function () {
    var enemies = this.room.find(Game.HOSTILE_CREEPS);
    console.log('Attacker found @ ' + this.room.name + ': ' + Game.HOSTILE_CREEPS);
    this.moveTo(enemies[0]);
    this.attack(enemies[0]);
}


Creep.prototype.putEnergy = function (useContainer, useStorage, useBase, ) {
    /// <summary>
    /// 
    /// </summary>
    /// <param name="useContainer"></param>
    let structure = null
    structure = putInBase(this, useBase, structure);
    if (useStorage && structure == undefined) {
        structure = this.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: (s) => (s.structureType == STRUCTURE_STORAGE
                // && s.energy < s.energyCapacity
            )
        });
        if (structure != undefined) {
            useContainer = true;
        }
    }
    if (useContainer && structure == undefined) {
        // find closest spawn, extension or tower which is not full
        structure = this.pos.findClosestByPath(FIND_STRUCTURES, {
            // the second argument for findClosestByPath is an object which takes
            // a property called filter which can be a function
            // we use the arrow operator to define it

            filter: (s) => (s.structureType == STRUCTURE_CONTAINER
                && _.sum(s.store) < s.storeCapacity
            )
        });
        if (structure != undefined) {
            structure = putInBase(this, true, structure);
        }
    }


    // if we found one
    if (structure != undefined) {
        // try to transfer energy, if it is not in range
        if (this.transfer(structure, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            // move towards it
            this.moveTo(structure, { maxRooms: 1 });
        }
    }
}

Creep.prototype.getEnergy = function (useContainer, useStorage, useSource) {
    let structure = null;
    structure = this.room.find(FIND_MY_STRUCTURES, { filter: s => (s.structureType == STRUCTURE_STORAGE) });
    if (structure == "") {
        useContainer = true;
    }


    structure = null;
    // if the Creep should look for loot
    useLoot = useContainer;
    if (useLoot && structure == undefined) {
        loot = this.pos.findClosestByRange(FIND_DROPPED_RESOURCES, { filter: s => (s.energy > 100) });

        if (this.pickup(loot) != OK) {

            this.moveTo(loot);
        } else {
            this.say("Loot! o.o")
        }

    }
    // if the Creep should look for containers
    if (useContainer && structure == undefined) {
        // find closest container
        structure = this.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: s => (s.structureType == STRUCTURE_CONTAINER)
                && s.store[RESOURCE_ENERGY] > this.carryCapacity / 10
        });

    }
    if (useStorage && structure == undefined) {
        // find closest container
        structure = this.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: s => (s.structureType == STRUCTURE_STORAGE)
                && s.store[RESOURCE_ENERGY] > this.carryCapacity / 10
        });
        // if one was found
        if (structure != undefined) {
            // try to withdraw energy, if the container is not in range

        }
    }
    // if no container was found and the Creep should look for Sources
    if (useSource) {
        // find closest source
        var source = this.pos.findClosestByPath(FIND_SOURCES_ACTIVE);

        // try to harvest energy, if the source is not in range
        if (this.harvest(source) == ERR_NOT_IN_RANGE) {
            // move towards it
            this.moveTo(source, { maxRooms: 1 });
        }
    }
    // if one was found

    if (structure != undefined) {
        // try to withdraw energy, if the container is not in range
        if (this.withdraw(structure, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            // move towards it
            this.moveTo(structure, { maxRooms: 1 });
        }
    }

};

function putInBase(creep, useBase, structure) {
    if (useBase && structure == undefined) {
        structure = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
            // the second argument for findClosestByPath is an object which takes
            // a property called filter which can be a function
            // we use the arrow operator to define it
            filter: (s) => ((s.structureType == STRUCTURE_SPAWN
                || s.structureType == STRUCTURE_TOWER
                || s.structureType == STRUCTURE_EXTENSION)
                && s.energy < s.energyCapacity)
        });
    }
    return structure;
}

// create a new function for StructureTower
StructureTower.prototype.defend =
    function () {
        // find closes hostile creep
        var target = this.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        // if one is found...
        if (target != undefined) {
            // ...FIRE!
            this.attack(target);
        } else {
            if (this.energy > ((this.energyCapacity / 10) * 5)) {
                var closestDamagedStructure = this.pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: (s) => s.hits < s.hitsMax && s.structureType != STRUCTURE_WALL && s.structureType != STRUCTURE_RAMPART
                });
                if (closestDamagedStructure) {
                    this.repair(closestDamagedStructure);
                }
            }
        }
    };
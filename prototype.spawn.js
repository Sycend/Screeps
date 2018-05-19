var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleRepairer = require('role.repairer');
var roleWallRepairer = require('role.wallRepairer');
var roleCarrier = require('role.carrier');
var roleLongDistanceHarvester = require('role.longDistanceHarvester');
var HOME = Game.spawns.Spawn_Zero.pos.roomName;


var listOfRoles = ['H', 'HH', 'C', 'U', 'T', 'B', 'WR', 'LDH' ,'R'];
StructureSpawn.prototype.spawnCreepsIfNecessary =
    function () {
        let room = this.room;
        let creepsInRoom = room.find(FIND_MY_CREEPS);
        let numberOfCreeps = {};
        for (let role of listOfRoles) {
            numberOfCreeps[role] = _.sum(creepsInRoom, (c) => c.memory.role == role);
        }
        let maxEnergy = room.energyCapacityAvailable;
        //let name = undefined;


        // setup some minimum numbers for different roles
        var minimumNumberOfHarvesters = 2;
        var minimumNumberOfHollowHarvesters = 2;
        var minimumNumberOfUpgraders = 2;
        var minimumNumberOfBuilders = 1;
        var minimumNumberOfRepairers = 2;
        var minimumNumberOfWallRepairers = 1;
        var minimumNumberOfLongDistanceHarvestersW7N4 = 2;
        var minimumNumberOfLongDistanceHarvestersW8N3 = 2;
        var minimumNumberOfLongDistanceHarvestersW6N3 = 2;
        var minimumNumberOfCarrier = 2;

        // count the number of creeps alive for each role
        // _.sum will count the number of properties in Game.creeps filtered by the
        //  arrow function, which checks for the creep being a harvester
        var numberOfHarvesters = _.sum(Game.creeps, (c) => c.memory.role == 'H');
        var numberOfHollowHarvesters = _.sum(Game.creeps, (c) => c.memory.role == 'HH');
        var numberOfUpgraders = _.sum(Game.creeps, (c) => c.memory.role == 'U');
        var numberOfBuilders = _.sum(Game.creeps, (c) => c.memory.role == 'B');
        var numberOfRepairers = _.sum(Game.creeps, (c) => c.memory.role == 'R');
        var numberOfWallRepairers = _.sum(Game.creeps, (c) => c.memory.role == 'WR');
        var numberOfLongDistanceHarvestersW7N4 = _.sum(Game.creeps, (c) => c.memory.role == 'LDH' && c.memory.target == 'W7N4');
        var numberOfLongDistanceHarvestersW8N3 = _.sum(Game.creeps, (c) => c.memory.role == 'LDH' && c.memory.target == 'W8N3');
        var numberOfLongDistanceHarvestersW6N3 = _.sum(Game.creeps, (c) => c.memory.role == 'LDH' && c.memory.target == 'W6N3');
        var numberOfCarriers = _.sum(Game.creeps, (c) => c.memory.role == 'C');
        var energy = this.room.energyCapacityAvailable;
        var name = null;
        var totalNumberCreepsSpawned = Memory.numberOfCreep;

        // if not enough harvesters
        if (numberOfCreeps['HH'] < 1 && numberOfCreeps['H'] < minimumNumberOfHarvesters && numberOfCreeps['C'] < 1) {
            // try to spawn one
            name = this.createCustomCreep(energy, 'H', totalNumberCreepsSpawned);
            // if spawning failed and we have no harvesters left
            if (name == ERR_NOT_ENOUGH_ENERGY && numberOfHarvesters == 0) {
                // spawn one with what is available
                name = this.createCustomCreep(this.room.energyAvailable, 'H', totalNumberCreepsSpawned);
               
            }
            
        } else if (numberOfCreeps['HH'] < minimumNumberOfHollowHarvesters) {
            // try to spawn one

            // check if all sources have miners
            let sources = room.find(FIND_SOURCES);
            // iterate over all sources
            for (let source of sources) {
                // if the source has no miner
                if (!_.some(creepsInRoom, c => c.memory.role == 'HH' && c.memory.sourceId == source.id)) {
                    // check whether or not the source has a container
                    let containers = source.pos.findInRange(FIND_STRUCTURES, 1, {
                        filter: s => s.structureType == STRUCTURE_CONTAINER
                    });
                    // if there is a container next to the source
                    if (containers.length > 0) {
                        // spawn a miner
                        name = this.createCustomCreep(energy, 'HH', totalNumberCreepsSpawned);

                    }
                    break;
                }
            }
        }
        // if not enough carriers
        else if (numberOfCreeps['C'] < minimumNumberOfCarrier) {
            // try to spawn one
            name = this.createCustomCreep(energy, 'C', totalNumberCreepsSpawned);
        }
        // if not enough longDistanceHarvesters for W7N4
        else if (numberOfLongDistanceHarvestersW7N4 < minimumNumberOfLongDistanceHarvestersW7N4) {

            // try to spawn one
            name = this.createLongDistanceHarvester(energy, 4, HOME, 'W7N4', 0, totalNumberCreepsSpawned);

        }
       
        // if not enough upgraders
        else if (numberOfCreeps['U'] < minimumNumberOfUpgraders) {
            // try to spawn one
            name = this.createCustomCreep(energy, 'U', totalNumberCreepsSpawned);
        }
        // if not enough repairers
        else if (numberOfCreeps['R'] < minimumNumberOfRepairers) {
            // try to spawn one
            name = this.createCustomCreep(energy, 'R', totalNumberCreepsSpawned);
        }
        // if not enough builders
        else if (numberOfCreeps['B'] < minimumNumberOfBuilders) {
            // try to spawn one
            name = this.createCustomCreep(energy, 'B', totalNumberCreepsSpawned);
        }
        else if (numberOfLongDistanceHarvestersW8N3 < minimumNumberOfLongDistanceHarvestersW8N3) {
            // try to spawn one
            name = this.createLongDistanceHarvester(energy, 4, HOME, 'W8N3', 0, totalNumberCreepsSpawned);
        }
        else if (numberOfLongDistanceHarvestersW6N3 < minimumNumberOfLongDistanceHarvestersW6N3) {
            // try to spawn one
            name = this.createLongDistanceHarvester(energy, 4, HOME, 'W6N3', 0, totalNumberCreepsSpawned);
        }
        // if not enough wallRepairers
        else if (numberOfCreeps['WR'] < minimumNumberOfWallRepairers) {
            // try to spawn one
            name = this.createCustomCreep(energy, 'WR', totalNumberCreepsSpawned);
        }
        /*
        else {
            // else try to spawn a builder
            name = this.createCustomCreep(energy, 'builder',creepNumber);
        }*/
        // print name to console if spawning was a success
        // name > 0 would not work since string > 0 returns false
        if (name != null && !(name < 0)) {
            console.log("Spawned new creep: " + name);
            Memory.numberOfCreep++;
        }
    }


module.exports = function () {
    // create a new function for StructureSpawn
    StructureSpawn.prototype.createCustomCreep = function (energy, roleName, creepNumber) {
        if (roleName == 'HH') {
            var numberOfParts = Math.floor(energy / 250);
            var body = [];
            for (let i = 0; i < numberOfParts * 2; i++) {
                body.push(WORK);
            }
            for (let i = 0; i < numberOfParts; i++) {
                body.push(MOVE);
            }
        } else if (roleName == 'C') {
            var numberOfParts = Math.floor(energy / 150);
            var body = [];
            for (let i = 0; i < numberOfParts * 2; i++) {
                body.push(CARRY);
            }
            for (let i = 0; i < numberOfParts; i++) {
                body.push(MOVE);
            }
        } else {
            // create a balanced body as big as possible with the given energy
            var numberOfParts = Math.floor(energy / 200);
            var body = [];
            for (let i = 0; i < numberOfParts; i++) {
                body.push(WORK);
            }
            for (let i = 0; i < numberOfParts; i++) {
                body.push(CARRY);
            }
            for (let i = 0; i < numberOfParts; i++) {
                body.push(MOVE);
            }
        }
        // create creep with the created body and the given role
        return this.createCreep(body, creepNumber + '-' + roleName, { role: roleName, working: false });
    };
    // create a new function for StructureSpawn
    StructureSpawn.prototype.createLongDistanceHarvester = function (energy, numberOfWorkParts, home, target, sourceIndex, creepNumber) {

        // create a body with the specified number of WORK parts and one MOVE part per non-MOVE part
        var body = [];
        for (let i = 0; i < numberOfWorkParts; i++) {
            body.push(WORK);
        }

        // 150 = 100 (cost of WORK) + 50 (cost of MOVE)
        energy -= 150 * numberOfWorkParts;
        energy -= 130
        var numberOfParts = Math.floor(energy / 100);
        for (let i = 0; i < numberOfParts; i++) {
            body.push(CARRY);
        }
        for (let i = 0; i < numberOfParts + numberOfWorkParts + 1; i++) {
            body.push(MOVE);
        }
        body.push(ATTACK);
        // create creep with the created body
        return this.createCreep(body, creepNumber + '-' + 'LDH', {
            role: 'LDH',
            home: home,
            target: target,
            sourceIndex: sourceIndex,
            working: false
        });
    };
};
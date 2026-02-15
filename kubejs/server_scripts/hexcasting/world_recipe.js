//阿卡夏
BlockEvents.rightClicked(event => {
    let { player, block, level, server, item} = event
    if (player.isCrouching() ||
        block.properties.charges !== '4' || 
        item.id !== 'minecraft:totem_of_undying' || 
        block.id !== 'minecraft:respawn_anchor' || 
        level.dimension !== "minecraft:overworld" ) return
        
    let abovePos = block.offset(0, 1, 0)
    let aboveBlock = level.getBlock(abovePos)
    if (aboveBlock.id !== 'chunkloaders:basic_chunk_loader') return
    
    let abovePos1 = block.offset(0, -1, 0)
    let aboveBlock1 = level.getBlock(abovePos1)
    if (aboveBlock1.id !== 'minecraft:budding_amethyst') return
    
    function checkBlock(offset, expectedId) {
        let targetBlock = level.getBlock(block.pos.x + offset[0], block.pos.y + offset[1], block.pos.z + offset[2])
        return targetBlock.id === expectedId
    }
    
    let quenchedOffsets = [
        [1, -1, 0],[-1, -1, 0],[0, -1, 1],[0, -1, -1]
    ]

    let focusOffsets = [
        [1, -1, 1],[-1, -1, 1],[-1, -1, 1],[-1, -1, -1]
    ]

    let sconceOffsets = [
        [1, 0, 1],[-1, 0, 1],[-1, 0, 1],[-1, 0, -1]
    ]

    let allConditionsMet = true
    
    for (let offset of quenchedOffsets) {
        if (!checkBlock(offset, "hexcasting:quenched_allay")) {
            allConditionsMet = false
            break
        }
    }
    if (allConditionsMet) {
        for (let offset of focusOffsets) {
            if (!checkBlock(offset, "hexdebug:focus_holder")) {
                allConditionsMet = false
                break
            }
        }
    }
    if (allConditionsMet) {
        for (let offset of sconceOffsets) {
            if (!checkBlock(offset, "hexcasting:amethyst_sconce")) {
                allConditionsMet = false
                break
            }
        }
    }
    let x = block.x
    let y = block.y
    let z = block.z

    let aabb = AABB.of(
        x - 3, y - 3, z - 3,
        x + 3, y + 3, z + 3
    )

    let entities = level.getEntities().filter(entity => {
        let pos = {
            x: entity.x,
            y: entity.y,
            z: entity.z
        }
        if (typeof pos.x !== 'number' || typeof pos.y !== 'number' || typeof pos.z !== 'number') {
            return false
        }
        return aabb.contains(pos.x, pos.y, pos.z)
    })

    let ConditionsMet = false

    if (allConditionsMet) {
        for (let entity of entities) {
            let type = entity.type
            if (type == "hexal:wisp/ticking") {
                ConditionsMet = true
                break
            }
        }
    }
    
    if (allConditionsMet && ConditionsMet) {
        server.scheduleInTicks(1, () => {
            let X = block.pos.x - 6
            let Y = block.pos.y - 2
            let Z = block.pos.z - 5
            player.mainHandItem.count -= 1
            server.runCommandSilent(`place template lootjs:empty_test_structure ${X} ${Y} ${Z}`)
        })
    }
})

//法术书合成
BlockEvents.rightClicked(event => {
    let item = event.item
    let block = event.block
    let player = event.player
    let level = event.level
    if (item.id !== 'minecraft:shulker_shell') return
    if (block.id !== 'minecraft:budding_amethyst') return

    function checkBlock(offset, expectedId) {
        let targetBlock = level.getBlock(block.pos.x + offset[0], block.pos.y + offset[1], block.pos.z + offset[2]);
        return targetBlock.id === expectedId;
    }
    
    let crystalOffsets = [
        [1, 0, 1],[-1, 0, -1],[-1, 0, 1],[1, 0, -1],[1, 1, 0],[-1, 1, 0],[0, 1, 1],[0, 1, -1],[1, -1, 0],[-1, -1, 0],[0, -1, 1],[0, -1, -1]
    ]

    
    let duskyOffsets = [
        [1, 1, 1],[1, 1, -1],[-1, 1, 1],[-1, 1, -1],[1, -1, 1],[1, -1, -1],[-1, -1, 1],[-1, -1, -1]
    ]
    
    let allConditionsMet = true
    
    for (let offset of crystalOffsets) {
        if (!checkBlock(offset, "quark:myalite_crystal")) {
            allConditionsMet = false
            break
        }
    }
    
    if (allConditionsMet) {
        for (let offset of duskyOffsets) {
            if (!checkBlock(offset, "quark:dusky_myalite")) {
                allConditionsMet = false;
                break;
            }
        }
    }
    
    if (allConditionsMet) {
        let x1 = block.pos.x + 1
        let y1 = block.pos.y + 1
        let z1 = block.pos.z + 1
        let x2 = block.pos.x - 1
        let y2 = block.pos.y - 1
        let z2 = block.pos.z - 1
        event.player.mainHandItem.count-=1
        event.getPlayer().getInventory().add('hexcasting:spellbook')
        player.runCommandSilent(`fill ${x1} ${y1} ${z1} ${x2} ${y2} ${z2} minecraft:air`)}})

//媒质瓶
BlockEvents.rightClicked(event => {
    let block = event.block
    let player = event.player
    let world = block.getLevel()
    if (block.id !== 'minecraft:polished_blackstone_button') return


    function checkBlock(offset, expectedId) {
        let targetBlock = world.getBlock(block.pos.x + offset[0], block.pos.y - 3 + offset[1], block.pos.z + offset[2])
        return targetBlock.id === expectedId
    }
    
    function checkSmoothSlabIsTop(offset) {
        let targetBlock = world.getBlock(block.pos.x + offset[0], block.pos.y - 3 + offset[1], block.pos.z + offset[2])
        return targetBlock.id === "minecraft:smooth_stone_slab" && 
               targetBlock.properties.type === 'top'
    }
    
    function checkBlackSlabIsBottom(offset) {
        let targetBlock = world.getBlock(block.pos.x + offset[0], block.pos.y - 3 + offset[1], block.pos.z + offset[2])
        return targetBlock.id === "minecraft:polished_blackstone_slab" && 
               targetBlock.properties.type === 'bottom'
    }
    

    let slipwayOffsets = [
        [0, 0, 0]
    ]

    let blackstoneOffsets = [
        [0, 2, 0]
    ]

    let glassOffsets = [
        [1, 0, 0],[-1, 0, 0],[0, 0, 1],[0, 0, -1]
    ]

    let duskyOffsets = [
        [1, 1, 1],[1, 1, -1],[-1, 1, 1],[-1, 1, -1],[1, -1, 1],[1, -1, -1],[-1, -1, 1],[-1, -1, -1]
    ]

    let crystalOffsets = [
        [1, 0, 1],[-1, 0, -1],[-1, 0, 1],[1, 0, -1],[1, 1, 0],[-1, 1, 0],[0, 1, 1],[0, 1, -1],[1, -1, 0],[-1, -1, 0],[0, -1, 1],[0, -1, -1]
    ]

    let blackslabOffsets = [
        [1, 2, 0],[1, 2, 1],[1, 2, -1],[-1, 2, 0],[-1, 2, 1],[-1, 2, -1],[0, 2, -1],[0, 2, 1]
    ]

    let smoothslabOffsets = [
        [1, -2, 0],[1, -2, 1],[1, -2, -1],[-1, -2, 0],[-1, -2, 1],[-1, -2, -1],[0, -2, -1],[0, -2, 0],[0, -2, 1]
    ]

    let allConditionsMet = true
    

    for (let offset of slipwayOffsets) {
        if (!checkBlock(offset, "hexal:slipway")) {
            allConditionsMet = false
            break
        }
    }
    
    if (allConditionsMet) {
            for (let offset of blackstoneOffsets) {
                if (!checkBlock(offset, "minecraft:chiseled_polished_blackstone")) {
                    allConditionsMet = false;
                    break;
                }
            }
        }

    if (allConditionsMet) {
        for (let offset of glassOffsets) {
            if (!checkBlock(offset, "minecraft:glass")) {
                allConditionsMet = false;
                break;
            }
        }
    }

    if (allConditionsMet) {
        for (let offset of duskyOffsets) {
            if (!checkBlock(offset, "quark:dusky_myalite")) {
                allConditionsMet = false;
                break;
            }
        }
    }

    if (allConditionsMet) {
        for (let offset of crystalOffsets) {
            if (!checkBlock(offset, "quark:myalite_crystal")) {
                allConditionsMet = false;
                break;
            }
        }
    }

    if (allConditionsMet) {
        for (let offset of blackslabOffsets) {
            if (!checkBlackSlabIsBottom(offset)) {
                allConditionsMet = false;
                break;
            }
        }
    }

    if (allConditionsMet) {
        for (let offset of smoothslabOffsets) {
            if (!checkSmoothSlabIsTop(offset)) {
                allConditionsMet = false;
                break;
            }
        }
    }

    if (allConditionsMet) {
        let x1 = block.pos.x + 1
        let y1 = block.pos.y
        let z1 = block.pos.z + 1
        let x2 = block.pos.x - 1
        let y2 = block.pos.y - 5
        let z2 = block.pos.z - 1
        event.getPlayer().getInventory().add(Item.of('hexcasting:battery', '{"hexcasting:media":0L,"hexcasting:start_media":9223372036854775807L}'))
        player.runCommandSilent(`fill ${x1} ${y1} ${z1} ${x2} ${y2} ${z2} minecraft:air`)
    }
})

LevelEvents.beforeExplosion(event => {
    let x = event.getX()
    let y = event.getY()
    let z = event.getZ()
    let size = event.getSize()
    let level = event.getLevel()
    let server = event.getServer()
    let aabb = AABB.of(
        x - size, y - size, z - size,
        x + size, y + size, z + size
    )
    let circuitCount = 0
    let entities = level.getEntities().filter(entity => {
        if (entity.type !== 'minecraft:item') return false
        let pos = { x: entity.x, y: entity.y, z: entity.z }
        return aabb.contains(pos.x, pos.y, pos.z)
    })
    entities.forEach(entity => {
        let item = entity.getItem()
        let itemId = item.id
        if (itemId === 'short_circuit:circuit') {
            circuitCount += item.count
        }
    })
    if (circuitCount >= 2) {
        server.runCommandSilent(`fill ${Math.floor(x)} ${Math.floor(y)} ${Math.floor(z)} ${Math.floor(x)} ${Math.floor(y)} ${Math.floor(z)} hexal:slipway`)
    }
})
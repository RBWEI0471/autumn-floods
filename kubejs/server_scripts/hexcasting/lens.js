//被动技能
PlayerEvents.tick(event => {
    if (event.getServer().getTickCount() % 20 !== 0) return
    const player = event.player
    if (player.getHeadArmorItem().id !== 'hexcasting:lens') return
    player.potionEffects.add("minecraft:invisibility", 240, 0, true, true)
    player.potionEffects.add("minecraft:night_vision", 240, 0, true, true)
    if (event.player.getMainHandItem().id === 'patchouli:guide_book' && 
        event.player.getMainHandItem().nbt["patchouli:book"] === "hexcasting:thehexbook") {
        event.player.potionEffects.add("minecraft:regeneration", 40, 1, true, true)
    }
    if (event.player.getMainHandItem().id !== 'hexcasting:staff/quenched') return
    let box = event.player.boundingBox.inflate(12)
    
    for (let entity of event.level.getEntitiesWithin(box)) {
        if (entity == event.player || !entity.isLiving()) continue
        
        if (entity.persistentData.contains('hex_controlled') || 
            entity.persistentData.contains('hex_controlled_forever')) {
            continue
        }
        
        if (entity.isMonster()) {
            if (!entity.persistentData.contains('hex_orig_follow_range')) {
                entity.persistentData.putDouble('hex_orig_follow_range', entity.getAttribute('generic.follow_range').getBaseValue())
            }
            if (entity.type == "minecraft:creeper") {
                entity.remove("killed")
            }
            entity.getAttribute('generic.follow_range').setBaseValue(0)
            entity.potionEffects.add("minecraft:glowing", 20, 0, true, true)
            entity.persistentData.putBoolean('hex_controlled', true)
        }
    }
})

//主动技能
PlayerEvents.tick(event => {
    let player = event.player
    let item = player.getHeadArmorItem()
    
    if (item.id === 'hexcasting:lens' && 
        item.nbt && item.nbt.display && item.nbt.display.Name === '{"text":"质念透镜(っ﹏-) .｡~oƪ"}') {
        
        if (!player.isCrouching()) return
        if (player.level.getTime() % 5 !== 0) return
        
        let mainHand = player.getMainHandItem()
        
        if (mainHand.id === 'hexcasting:staff/quenched') {
            if (player.rayTrace(16, false).entity) {
                let E1 = player.rayTrace(12, false).entity
                if (!E1.isLiving() || E1.type === "minecraft:player" || E1.type === "minecraft:villager") return
                E1.setPosition(0, 0, 0)
                player.level.runCommandSilent(`particle minecraft:enchant ${player.x} ${player.y} ${player.z} 1 1 1 0.5 60`)
            } else if (player.rayTrace(12, false).type === 'BLOCK') {
                let B1 = player.rayTrace(12, false).block
                if (B1.id == "minecraft:water" || B1.id == "minecraft:lava") return
                B1.getDrops().forEach(drop => player.give(drop))
                let sourcePos = new BlockPos(Math.floor(B1.x), Math.floor(B1.y), Math.floor(B1.z))
                player.level.setBlock(sourcePos, Blocks.AIR.defaultBlockState(), 3)
                player.level.runCommandSilent(`particle minecraft:white_ash ${B1.x} ${B1.y} ${B1.z} 1 1 1 0.5 60`)
            }
        } else if (mainHand.id === 'patchouli:guide_book' && mainHand.nbt["patchouli:book"] === "hexcasting:thehexbook") {
            if (player.rayTrace(12, false).entity) {
                let E2 = player.rayTrace(12, false).entity
                if (!E2.isLiving() || E2 === player) return
                if (E2.glowing) return
                
                if (E2.persistentData.getBoolean("NoAI")) {
                    E2.setNoAi(false)
                    E2.persistentData.remove("NoAI")
                    player.level.runCommandSilent(`particle minecraft:enchant ${E2.x} ${E2.y} ${E2.z} 1 1 1 0.5 60`)
                } else {
                    E2.setNoAi(true)
                    E2.persistentData.putBoolean("NoAI", true)
                    player.level.runCommandSilent(`particle minecraft:lava ${E2.x} ${E2.y} ${E2.z} 1 1 1 0.5 60`)
                }
                E2.potionEffects.add("minecraft:glowing", 60, 0, true, true)
            } else if (player.rayTrace(32, false).block) {
                let B2 = player.rayTrace(32, false).block
                if (B2.id == "minecraft:water" || B2.id == "minecraft:lava") return
                if (player.glowing) return
                player.potionEffects.add("minecraft:glowing", 10, 0, true, true)
                player.setPosition(B2.x + 0.5, B2.y + 1, B2.z + 0.5)
                player.level.runCommandSilent(`particle minecraft:portal ${player.x} ${player.y} ${player.z} 1 1 1 0.5 60`)
            } else {
                let lookVec = player.getLookAngle()
                let distance = 16
                let destX = player.x + lookVec.x() * distance
                let destY = player.y + lookVec.y() * distance
                let destZ = player.z + lookVec.z() * distance
                if (player.glowing) return
                player.potionEffects.add("minecraft:glowing", 20, 0, true, true)
                player.setPosition(destX + 0.5, destY + 1, destZ + 0.5)
                player.level.runCommandSilent(`particle minecraft:portal ${player.x} ${player.y} ${player.z} 1 1 1 0.5 60`)
            }
        }
    }
})

//受击解除
EntityEvents.hurt(event => {
    if (!event.entity.isLiving()) return
    if (!event.source || !event.source.player) return
    
    let entity = event.entity
    
    if (entity.persistentData.contains('hex_controlled') && !entity.persistentData.contains('hex_controlled_forever')) {
        
        if (entity.persistentData.contains('hex_orig_follow_range')) {
            entity.getAttribute('generic.follow_range').setBaseValue(
                entity.persistentData.getDouble('hex_orig_follow_range')
            )
            entity.persistentData.remove('hex_orig_follow_range')
        }
        
        entity.persistentData.putBoolean('hex_controlled_forever', true)
        entity.persistentData.remove('hex_controlled')
    }
})

//没关就是开了？
BlockEvents.leftClicked(event => {
    let player = event.player
    let item = player.getMainHandItem()
    if (item.id === 'hexcasting:staff/quenched') {
        let IXplatAbstractions = Java.loadClass('at.petrak.hexcasting.xplat.IXplatAbstractions')
        IXplatAbstractions.INSTANCE.setPatterns(player, [])
    }
})

//开了就是开了？
EntityEvents.hurt(event => {
    if (event.source.actual && event.source.actual.isPlayer()) {
        let item = event.source.actual.getMainHandItem()
        if (item.id === 'hexcasting:staff/quenched' && item.nbt && item.nbt.display && item.nbt.display.Name === '{"text":"淬灵法杖(ゝ∀･)~"}') {
            let level = event.level
            let entity = event.entity
            let player = event.source.actual
            avada_kedavra(player, entity, level)
        }
    }
})

//开了就是开了。
ItemEvents.rightClicked(event => {
    let player = event.player
    if (!player) return
    if (event.hand == "OFF_HAND") return
    let item = event.item
    if (item.id === 'patchouli:guide_book' && item.nbt && item.nbt.display && item.nbt.display.Name === '{"text":"《 ☀ ☾ 🙵 ≋ △ 》"}') {
        player.setMainHandItem(Item.of('hexcasting:creative_unlocker'))
    }
})

// 阿瓦达啃大瓜
function avada_kedavra(player, entity, level) {
    if (entity?.health) {
        let max_health = entity.getMaxHealth()
        entity.health = 1
        typeHurt(level, player, entity, "hexcasting:overcast", 6)
        if (entity.isAlive()) {
            entity.health = 0
            entity.maxHealth = 0
            if (entity.isAlive()) {
                let nbt = entity.nbt
                let allKeys = nbt.getAllKeys()
                let keysList = []
                for (let key of allKeys) {
                    keysList.push(key)
                }
                for (let key of keysList) {
                    let sub = nbt.get(key)
                    let tagHealth = 0
                    if (sub instanceof DoubleTag) {
                        tagHealth = sub.getAsDouble()
                    } else if (sub instanceof FloatTag) {
                        tagHealth = sub.getAsFloat()
                    }
                    let mediahealth = entity.getHealth()
                    if (Math.abs(tagHealth - mediahealth) < 1 || Math.abs(tagHealth - max_health) < 1) {
                        if (sub instanceof DoubleTag) {
                            nbt.putDouble(key, 0.0)
                        } else if (sub instanceof FloatTag) {
                            nbt.putFloat(key, 0.0)
                        }
                    }
                }
                entity.setNbt(nbt)
                for (let i = 0; i < max_health / 6; i++) {
                    entity.health = 0
                }
                entity.maxHealth = 0
                if (entity.isAlive() && entity.health !== 0) {
                    let maxAttacks = Math.ceil(max_health) * 6
                    let executions = 0
                    let executeLoop = () => {
                        if (executions >= maxAttacks) {
                            entity.kill()
                            entity.discard()
                            entity.remove("killed")
                            player.server.runCommandSilent(`loot spawn ${entity.x} ${entity.y} ${entity.z} loot ${entity.lootTable}`)
                            entity.setPos(3000000, 3000000, 3000000)
                            let listTag = new ListTag()
                            listTag.add(DoubleTag.valueOf(3000000))
                            listTag.add(DoubleTag.valueOf(3000000))
                            listTag.add(DoubleTag.valueOf(3000000))
                            nbt.put("Pos", listTag)
                            entity.setNbt(nbt)
                            return
                        }
                        if (!entity.isAlive() || entity.health == 0) return
                        typeHurt(level, player, entity, "hexcasting:overcast", max_health)
                        player.server.scheduleInTicks(1, executeLoop)
                        executions++
                    }
                    executeLoop()
                }
            }
        }
    } else {
        entity.kill()
        entity.discard()
        entity.remove("killed")
        entity.setPos(3000000, 3000000, 3000000)
        let listTag = new ListTag()
        listTag.add(DoubleTag.valueOf(3000000))
        listTag.add(DoubleTag.valueOf(3000000))
        listTag.add(DoubleTag.valueOf(3000000))
        let nbt = entity.nbt
        nbt.put("Pos", listTag)
        entity.setNbt(nbt)
    }
}
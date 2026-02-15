//爆炸合成媒质瓶
LevelEvents.beforeExplosion(event => {
    let x = event.getX()
    let y = event.getY()
    let z = event.getZ()
    
    let hasC = 0
    let hasR = 0
    let hasA = 0
    let size = event.getSize()
    let level = event.getLevel()
    let server = event.getServer()
    let time = server.getTickCount()

    let aabb = AABB.of(
        x - size, y - size, z - size,
        x + size, y + size, z + size
    )
    
    let entities = level.getEntities().filter(entity => {
        if (entity.type !== 'minecraft:item') return false;
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
    
    entities.forEach(entity => {
        let item = entity.getItem()
        if (item.id === 'minecraft:copper_block') hasC += item.count
        if (item.id === 'minecraft:redstone_block') hasR += item.count
        if (item.id === 'minecraft:amethyst_block') hasA += item.count
    })
    
    let num = Math.min(hasC, hasR, hasA)
    if (num == 0) return
    
    entities.forEach(entity => {
        let item = entity.getItem()
        if (item.id === 'minecraft:copper_block' || 
            item.id === 'minecraft:redstone_block' || 
            item.id === 'minecraft:amethyst_block') {
            entity.kill()
        }
    })
    
    let nbtString = `{Item:{id:"hexcasting:battery",tag:{"hexcasting:media":6400000L,"hexcasting:start_media":6400000L,decay:1,spawnTime:${time}L},Count:${num}}}`
    let command = `/summon item ${x} ${y} ${z} ${nbtString}`
    server.scheduleInTicks(1 , () => {
        server.runCommandSilent(command)
    })
})

//衰变事件
PlayerEvents.inventoryChanged(event => {
    let player = event.player
    let item = event.getItem()
    let inventory = player.getInventory()
    if (item.id !== 'hexcasting:battery' || !item.nbt?.decay || item.nbt.decay !== 1) return
    for (let slot = 0; slot < inventory.getContainerSize(); slot++) {
        let stack = inventory.getItem(slot)
        if (stack.id === 'hexcasting:battery' && stack.nbt?.decay === 1) {
            startDecay(player, slot)
        }
    }
})

function startDecay(player, slot) {
    let time = 20 - player.server.getTickCount() % 20
    Utils.server.scheduleInTicks(time, () => {
        let inventory = player.getInventory()
        let stack = inventory.getItem(slot)
        if (stack.id !== 'hexcasting:battery' || !stack.nbt?.decay || stack.nbt.decay !== 1) return
            let count = 0
            for (let t = 0; t < inventory.getContainerSize(); t++) {
                let battery = inventory.getItem(t);
                if (battery.id === 'hexcasting:battery' && battery.nbt?.decay === 1) {
                    count ++
                }
            }
            let media = 6400000 - (5000 * (player.server.getTickCount() - stack.nbt.spawnTime))
            if (media <= 0) {
                inventory.setItem(slot, 'minecraft:air')
                return
            }
            let NBT = stack.nbt
            NBT['hexcasting:media'] = media
            inventory.setItem(slot, stack.withNBT(NBT))
            player.attack(count * count)
    })
}

//副手充能
BlockEvents.leftClicked('hexcasting:battery', (event) => {
    let player = event.player
    let off = player.offHandItem
    let main = player.mainHandItem
    if (main.id != 'hexcasting:battery' && main.id != 'hexcasting:trinket' && main.id != 'hexcasting:artifact') return

    let media = 0
    if (main.nbt["hexcasting:media"] !== undefined) {
        media = main.nbt["hexcasting:media"]
    }

    let start = main.nbt["hexcasting:start_media"]
    const mana = {
        'hexcasting:amethyst_dust': { value: 10000 },
        'minecraft:amethyst_shard': { value: 50000 },
        'hexcasting:charged_amethyst': { value: 100000 },
        'hexcasting:quenched_allay_shard': { value: 300000 }}

    if (off != null && mana[off.id]) {
        const eta = mana[off.id]
        let alpha = off.count
        let delta = Math.floor((start - media) / eta.value)
        if ((start - media) % eta.value != 0) { delta += 1 }
        let omega = media + (Math.min(delta, alpha) * eta.value)
        if (omega > start) { omega = start }
        main.nbt["hexcasting:media"] = omega
        off.count = off.count - Math.min(delta, alpha)
    }
})

//农田踩踏
BlockEvents.farmlandTrampled(e => { e.cancel() })

//禁止生成
EntityEvents.spawned(e => {
    if(e.entity.type == 'minecraft:glow_squid' || e.entity.type == 'minecraft:phantom'){
        e.cancel()
    }
})

//究极苹果
ItemEvents.foodEaten(event => {
  let player = event.player
  let item = event.item
  if (item.id == 'minecraft:enchanted_golden_apple') {
      player.potionEffects.add('minecraft:resistance', 160, 4)
      player.potionEffects.add('minecraft:saturation', 160, 4)}})

//云瓶升天
BlockEvents.rightClicked('quark:cloud', event => {
  if (event.hand == "OFF_HAND") return
  let player = event.getPlayer()
  if (player == null) return
  if(event.item === 'minecraft:glass_bottle') {
    player.potionEffects.add('minecraft:levitation', 160, 2)
    player.potionEffects.add('minecraft:slow_falling', 320, 0)}})

PlayerEvents.tick(event => {
    if (event.getServer().getTickCount() % 20 !== 0) return
    let player = event.player
    let Item = player.getMainHandItem()
    if (Item.id !== 'quark:bottled_cloud') return
    player.potionEffects.add("minecraft:slow_falling", 60, 2, true, true)})

//草！
EntityEvents.drops(event => {
    let entity = event.entity
    if (entity.type !== 'minecraft:blaze') return
    if (entity.isSilent()) {
        event.cancel
    }
})

//草？
BlockEvents.rightClicked(event => {
    let { player, block, item, hand, level } = event
    if (hand !== 'MAIN_HAND') return
    if (item.id !== 'minecraft:bucket' || item.count < 1) return
    if (block.id !== 'minecraft:pitcher_crop') return
    
    let lowerPos
    if (block.properties.half === 'upper') {
        lowerPos = block.pos.offset(0, -1, 0)
    } else {
        lowerPos = block.pos
    }
    
    let lowerBlock = level.getBlock(lowerPos)
    if (lowerBlock.id !== 'minecraft:pitcher_crop' || lowerBlock.properties.half !== 'lower') return
    if (lowerBlock.properties.age !== '4') return
    
    let upperPos = lowerPos.offset(0, 1, 0)
    player.runCommandSilent(`fill ${lowerPos.x} ${lowerPos.y} ${lowerPos.z} ${upperPos.x} ${upperPos.y} ${upperPos.z} minecraft:air replace`)
    player.runCommandSilent(`setblock ${lowerPos.x} ${lowerPos.y} ${lowerPos.z} minecraft:pitcher_crop[half=lower,age=0]`)
    
    item.count -= 1
    
    player.runCommandSilent(`particle minecraft:splash ${lowerPos.x} ${lowerPos.y} ${lowerPos.z} 0.5 0.5 0.5 0.5 10`)
    player.runCommandSilent(`playsound minecraft:item.bucket.fill block @a ${lowerPos.x} ${lowerPos.y} ${lowerPos.z} 0.5 1`)
    
    event.server.scheduleInTicks(4, () => {
        let random = Math.random()
        let bucketType
        
        if (random < 0.07) bucketType = 'minecraft:cod_bucket'
        else if (random < 0.14) bucketType = 'minecraft:salmon_bucket'
        else if (random < 0.21) bucketType = 'minecraft:tropical_fish_bucket'
        else if (random < 0.28) bucketType = 'minecraft:pufferfish_bucket'
        else if (random < 0.35) bucketType = 'minecraft:axolotl_bucket'
        else if (random < 0.42) bucketType = 'minecraft:tadpole_bucket'
        else if (random < 0.49) bucketType = 'minecraft:water_bucket'
        else if (random < 1.00) bucketType = 'quark:slime_in_a_bucket'
        
        player.give(bucketType)
    })
})

//念力发波
global.ender = new Map()
ItemEvents.rightClicked('minecraft:spyglass', event => {
  let { player, level } = event
  let slot = player.inventory.findSlotMatchingItem('minecraft:ender_pearl')
  if (slot >= 0 && slot <= 8) {
    global.ender.set(player.id, level.getTime() + 100)}})

PlayerEvents.tick(event => {
  let { player, level } = event
  let time = global.ender.get(player.id)
  if (time && level.getTime() <= time && player.isCrouching()) {
    let pearl = level.createEntity("minecraft:ender_pearl")
    pearl.owner = player
    pearl.noGravity = true
    pearl.deltaMovement = player.lookAngle.scale(4)
    pearl.setPosition(player.x, player.y + 1.5, player.z)
    pearl.spawn()
    let slot = player.inventory.findSlotMatchingItem('minecraft:ender_pearl')
    if (slot >= 0) { player.inventory.getStackInSlot(slot).count-- }
    global.ender.delete(player.id)}})
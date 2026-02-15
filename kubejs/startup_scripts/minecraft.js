let EquipmentSlot = Java.loadClass("net.minecraft.world.entity.EquipmentSlot")
let AttributeModifier = Java.loadClass("net.minecraft.world.entity.ai.attributes.AttributeModifier")

//升华
ForgeEvents.onEvent('net.minecraftforge.event.entity.living.LivingHurtEvent', event => {
    if (event.entity.persistentData.contains('infinite')) {
        let infinite = event.entity.persistentData.getDouble('infinite')
        event.setAmount(infinite)
    }
})

//重力
ForgeEvents.onEvent('net.minecraftforge.event.entity.living.LivingHurtEvent', event => {
    let { entity, source, amount } = event
    let isFall = source.getType() === 'fall'
    if (entity.persistentData.contains('fall')) {
        if (isFall) {
            let add = entity.getDeltaMovement()
            let g = Math.sqrt(
                add.x() * add.x() + 
                add.y() * add.y() + 
                add.z() * add.z()
            )
            event.setAmount(amount * g)
            entity.persistentData.remove('g')
        }
    }
})

//凋零
ForgeEvents.onEvent('net.minecraftforge.event.entity.living.LivingHurtEvent', event => {
    let { entity, source, amount } = event
    let isWither = source.getType() === 'wither'
    let health = entity.getHealth()
    if (isWither && health > 2) {
        let truth = entity.getMaxHealth() / 100
        if (truth < amount) return
        entity.setHealth(health - truth)
        event.setCanceled(true)
    }
})

//终结
ForgeEvents.onEvent('net.minecraftforge.event.entity.living.LivingHurtEvent', event => {
    let { entity, source, amount } = event
    let isExplode = source.getType() === 'explosion'
    if (entity.persistentData.contains('omega')) {
        if(isExplode) {
            let health = entity.getHealth()
            if (health > amount * 6) {
                entity.setHealth(health - amount * 6)
                event.setCanceled(true)
            } else {
                entity.setHealth(1)
                event.setAmount(amount * 6 - health + 1)
            }
            
        }
    }
})

//质念法杖
ForgeEvents.onEvent('net.minecraftforge.event.ItemAttributeModifierEvent', event => {
    let itemStack = event.getItemStack()
    let slot = event.getSlotType()
    let ModifyUUID = UUID.fromString("550e8400-e29b-41d4-a716-446655440003")
    if (itemStack.getId() == "hexcasting:staff/quenched" && slot == EquipmentSlot.MAINHAND) {
        event.addModifier(
            "minecraft:generic.attack_damage",
            new AttributeModifier(
                ModifyUUID,
                "hammer_damage",
                8,
                AttributeModifier.Operation.ADDITION
            )
        )
        event.addModifier(
            "minecraft:generic.attack_speed",
            new AttributeModifier(
                ModifyUUID,
                "hammer_speed",
                2,
                AttributeModifier.Operation.ADDITION
            )
        )
    }
})

//质念透镜
ForgeEvents.onEvent('net.minecraftforge.event.ItemAttributeModifierEvent', event => {
    let itemStack = event.getItemStack()
    let slot = event.getSlotType()
    let ModifyUUID = UUID.fromString("550e8400-e29b-41d4-a716-446655440004")
    if (itemStack.getId() == "hexcasting:lens" && slot == EquipmentSlot.HEAD) {
        event.addModifier(
            "minecraft:generic.armor",
            new AttributeModifier(
                ModifyUUID,
                "lens_armor",
                16,
                AttributeModifier.Operation.ADDITION
            )
        )
        event.addModifier(
            "minecraft:generic.armor_toughness",
            new AttributeModifier(
                ModifyUUID,
                "lens_toughness",
                16,
                AttributeModifier.Operation.ADDITION
            )
        )
        event.addModifier(
            "minecraft:generic.knockback_resistance",
            new AttributeModifier(
                ModifyUUID,
                "lens_knockback",
                1,
                AttributeModifier.Operation.ADDITION
            )
        )
    }
})

//书籍免疫伤害
ForgeEvents.onEvent('net.minecraftforge.event.entity.living.LivingAttackEvent', event => {
    if (!event.entity.isPlayer()) return
    if (event.source.getType() == 'fall' || event.source.getType() == 'inWall' || event.source.getType() == 'lava' || event.source.getType() == 'inFire') {
        let player = event.entity
        let mainHand = player.getMainHandItem()
        if (mainHand.id === 'patchouli:guide_book' && mainHand.nbt === '{"patchouli:book":"hexcasting:thehexbook"}') {
            event.setCanceled(true)
        }
    }
})

//作物注册
StartupEvents.registry('block', event => {
    event.create("torchflower","crop")
        .age(2)
        .displayName("火把花")
        .crop(Item.of('minecraft:blaze_powder'))
        .crop(Item.of('minecraft:torchflower'), 0.2)
        .texture("0","kubejs:block/torchflower_crop_stage0")
        .texture("1","kubejs:block/torchflower_crop_stage1")
        .texture("2","kubejs:block/torchflower_crop_stage2")
        .bonemeal(cb =>{
            let b = cb.block
            let level = cb.getLevel()
            let blaze = level.createEntity("minecraft:blaze")
            blaze.setPosition(b.getX() + 0.5, b.getY() + 1, b.getZ() + 0.5)
            blaze.spawn()
            return 1
        })
        .survive((blockstate, level, pos) => {
            if (level.isAreaLoaded(pos,1)){
                if (level.getBlockState(pos.below()).getBlock().getId() == "minecraft:farmland"){
                    return true
                }
            }
            return false
        })
        .growTick((blockState,level,blockPos) => {
            return 25})
        .item(seed =>{
            seed.texture("kubejs:item/torchflower_seeds")
            .displayName("火把花种子")
        })
        .dropSeed(false)
})

StartupEvents.registry('block', event => {
    event.create("hexmedia","crop")
        .age(2)
        .displayName("水晶花")
        .texture("0", "kubejs:block/hexmedia_stage0")
        .texture("1", "kubejs:block/hexmedia_stage1")
        .texture("2", "kubejs:block/hexmedia_stage2")
        .bonemeal(media =>{
            let player = media.entity
            player.attack(8)
            return 0
        })
        .survive((blockstate, level, pos) => {
            if (level.isAreaLoaded(pos,1)){
                if (level.getBlockState(pos.below()).getBlock().getId() == "hexcasting:slate_block"){
                    return true
                }
            }
            return false
        })
        .growTick((blockState,level,blockPos) => {
            return 25})
        .item(seed =>{
            seed.texture("kubejs:item/hexmedia_seeds")
            .displayName("水晶花种子")
        })
        .dropSeed(false)
})

//微操药水
MoreJSEvents.registerPotionBrewing(event => {
    event.removeByPotion(
        'minecraft:awkward',
        'hexcasting:amethyst_dust',
        "hexcasting:enlarge_grid")})
        
MoreJSEvents.registerPotionBrewing(event => {
    event.removeByPotion(
        'minecraft:awkward',
        'minecraft:rabbit_foot',
        "minecraft:leaping")})
                
MoreJSEvents.registerPotionBrewing(event => {
    event.removeByPotion(
        'minecraft:awkward',
        'minecraft:phantom_membrane',
        "minecraft:slow_falling")})

MoreJSEvents.registerPotionBrewing(event => {
    event.addPotionBrewing(
        'minecraft:rabbit_foot',
        'minecraft:awkward',
        "minecraft:luck")})

MoreJSEvents.registerPotionBrewing(event => {
    event.addPotionBrewing(
        'minecraft:feather',
        'minecraft:awkward',
        "minecraft:leaping")})

MoreJSEvents.registerPotionBrewing(event => {
    event.addPotionBrewing(
        'minecraft:wheat',
        'minecraft:awkward',
        "minecraft:slow_falling")})
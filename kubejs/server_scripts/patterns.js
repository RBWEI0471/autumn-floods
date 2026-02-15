//法术标签
const removeList = [
    "hexcasting:lightning",
    "hexcasting:create_lava",
    "hexcasting:potion/regeneration",
    "hexcasting:potion/night_vision",
    "hexcasting:potion/absorption",
    "hexcasting:potion/haste",
    "hexcasting:potion/strength",
    "hexcasting:teleport/great",
    "hexcasting:flight",
    "hexcasting:craft/battery",
    "hexcasting:summon_rain",
    "hexcasting:dispel_rain",
    "hexal:wisp/consume",
    "hexal:wisp/seon/set",
    "hexcasting:sentinel/create/great",
    "hexoverpowered:yjsp_media",
    "hexparse:compile",
    "hexal:tick",
    "hexoverpowered:factor_cut",
    "hexcasting:brainsweep",
    "hexal:gate/make"
]

const addList = [
    "homo:avada_kedavra",
    "homo:roulette",
    "homo:infinite",
    "homo:space",
    "homo:kcit",
    "homo:reflection",
    "homo:fusion",
    "homo:otto",
    "homo:focus",
    "homo:eye_of_providence",
    "hexal:wisp/summon/ticking",
    "hexal:wisp/summon/projectile",
    "hexal:wisp/consume",
    "homo:ever_read",
    "homo:ever_write",
    "homo:ever_dele",
    "homo:ever_meta",
    "hexcasting:akashic/write",
    "hexcasting:akashic/read",
    "hexcellular:create_property",
    "hexcellular:observe_property",
    "hexcellular:set_property",
    "homo:let_in",
    "homo:let_read",
    "homo:let_out",
    "hexal:gate/make"
]

const enlightenList = [
    "homo:media",
    "homo:enlightenment"
]

const tags = [
    'hexcasting:can_start_enlighten',
    'hexcasting:requires_enlightenment',
    'hexcasting:per_world_pattern'
]

ServerEvents.tags("hexcasting:action", e => {
    tags.forEach(tag => {
        removeList.forEach(id => e.remove(tag, id))
        
        if (tag === 'hexcasting:requires_enlightenment') {
            e.remove(tag, "hexdebug:splicing/enlightened/hex/read")
            e.remove(tag, "hexdebug:splicing/enlightened/hex/write")
        }

        enlightenList.forEach(id => e.add(tag, id))
    })
    addList.forEach(id => e.add('hexcasting:requires_enlightenment', id))
})

//厄洛斯之策略
NetworkEvents.dataReceived("global.GKey.consumeClick", (event) => {
    let player = event.player
    let level = player.getLevel()
    let env = new StaffCastEnv(player, InteractionHand.MAIN_HAND)
    if (player.persistentData.contains('hex_key')) {
        let hex_key = player.persistentData.getCompound('hex_key')
        if (!hex_key.contains('G_key')) return
        let G_key = hex_key.getCompound('G_key')
        let img = G_key.getCompound('image')
        let iota = G_key.getCompound('spell')
        let spell = IotaType.deserialize(iota, level)
        let harness = CastingVM.empty(env)
        let Tag = new CompoundTag()
        Tag.put("userdata", img)
        let image = harness.image.loadFromNbt(Tag, level)
        harness.setImage(image)
        harness.queueExecuteAndWrapIotas(spell.list, level)
    }
})

//狄俄尼索斯之策略
ServerEvents.tick(event => {
    let FOR = global.ForLoopTasks
    for (let [id, task] of FOR) {
        let player = event.server.getPlayer(task.playerId)
        let level = player.getLevel()
        let staffEnv = new StaffCastEnv(player, InteractionHand.MAIN_HAND)
        let env = SilencedCastingEnv.Companion.from(staffEnv)
        if (task.stopped) {
            FOR.delete(id)
            continue
        }
        if (!player || !player.isAlive()) {
            FOR.delete(id)
            continue
        }
        let harness = CastingVM.empty(env)
        let Tag = new CompoundTag()
        Tag.put("userdata", task.img)
        let image = harness.image.loadFromNbt(Tag, level)
        harness.setImage(image)
        harness.queueExecuteAndWrapIotas(task.code, level)
    }
})

//流转
ServerEvents.tick(event => {
    let server = event.server
    let currentTick = server.getTickCount()
    for (let [uuid, data] of global.ZERO.entries()) {
        if (currentTick >= data.restoreTick) {
            let entity = data.entity
            if (!entity || !entity.isAlive()) continue
            let vec = entity.getDeltaMovement().add(data.velocity)
            entity.setDeltaMovement(vec)
            entity.hurtMarked = true
            global.ZERO.delete(uuid)
        }
    }
})

//禅定
EntityEvents.spawned(event => {
    let server = event.server
    if (server.persistentData.contains('noSpawnEnabled') && server.persistentData.getBoolean('noSpawnEnabled')) {
        let mob = event.entity
        if (mob.isMonster()) {
            event.cancel()
        }
    }
})

//示现
EntityEvents.spawned(event => {
    let allay = event.entity
    if (allay.type == "minecraft:allay" && allay.isGlowing() && allay.isInvulnerable()) {
        event.cancel()
    }
})

//升华
EntityEvents.hurt(event => {
    let entity = event.entity
    let amount = Math.max(event.damage, 1)
    if (entity.persistentData.contains('finite') && entity.persistentData.getBoolean('finite')) {
        entity.persistentData.putDouble('infinite', amount)
        entity.persistentData.remove('finite')
        server.scheduleInTicks(180, () => {
            entity.persistentData.remove('infinite')
        })
    }
})

//反制
EntityEvents.hurt(event => {
    let player = event.entity
    let entity = event.source.actual
    if (!player.isPlayer()) return
    if (player.persistentData.contains('reflection')) {
        if (entity && entity.isAlive() && !entity.isPlayer()) {
            entity.attack(player.damageSources().generic(), event.damage)
            player.persistentData.putBoolean('reflect', true)
        }
        event.cancel()
    }
})

//溯洄
EntityEvents.death(event => {
    let player = event.entity
    if (!player.isPlayer()) return
    if (player.persistentData.contains('from_spirit')) {
        event.cancel()
    }
    if (player.persistentData.contains('the_spirit')) {
        let stateTag = player.persistentData.getCompound('the_spirit')
        let type = player.persistentData.getList('type', 8)
        let long = player.persistentData.getList('long', 3)
        let deep = player.persistentData.getList('deep', 3)
        player.maxHealth = stateTag.getDouble('max_health')
        player.health = stateTag.getDouble('health')
        player.teleportTo(
            stateTag.getString('dimension'), 
            stateTag.getDouble('pos_x'), 
            stateTag.getDouble('pos_y'), 
            stateTag.getDouble('pos_z'), 
            stateTag.getDouble('yaw'), 
            stateTag.getDouble('pitch')
        )
        player.foodLevel = stateTag.getDouble('food')
        player.airSupply = stateTag.getDouble('air')
        let zero = new Vec3d(0, 0, 0)
        player.setDeltaMovement(zero)
        player.removeAllEffects()
        player.hurtMarked = true
        player.extinguish()
        
        for (let i = 0; i < type.size(); i++) {
            let effectId = type.getString(i)
            let duration = long.getInt(i)
            let amplifier = deep.getInt(i)
            if (effectId) {
                player.potionEffects.add(effectId, duration, amplifier)
            }
        }
        player.persistentData.remove('type')
        player.persistentData.remove('long')
        player.persistentData.remove('deep')
        player.persistentData.remove('the_spirit')
        player.persistentData.putBoolean('from_spirit', true)
        server.scheduleInTicks(120 , () => {
            if (player.persistentData.contains('from_spirit')) {
                player.persistentData.remove('from_spirit')
            }
        })
        event.cancel()
    }
})

//初始套件
PlayerEvents.loggedIn(event => {
    let player = event.player
    let server = player.server
    if (player.persistentData.contains('omega')) {
        player.persistentData.remove('omega')
    }
    if (player.persistentData.contains('from_spirit')) {
        player.persistentData.remove('from_spirit')
    }
    player.getAttribute('hexcasting:media_consumption').setBaseValue(1)
    let hasStage = player.stages.has("oneInGame")
    if (!hasStage) {
        player.stages.add("oneInGame")
        player.give('8x hexcasting:sub_sandwich')
        player.getAttribute('hexcasting:ambit_radius').setBaseValue(64)
        player.getAttribute('hexcasting:sentinel_radius').setBaseValue(32)
        player.give(Item.of("hexcasting:lens").enchant('minecraft:protection', 10))
        server.runCommandSilent(`gamerule commandModificationBlockLimit 2147483647`)
        player.give(Item.of("hexcasting:staff/quenched").enchant('minecraft:looting', 10))
        player.give(Item.of('hexcasting:scroll', '{pattern:{angles:[B;1B,2B,1B,0B,0B,5B,5B,5B,4B,0B,0B,0B,4B,5B,4B,0B,5B,0B,4B,0B,5B,1B,0B,0B,4B,5B,5B,5B,0B,0B,1B,2B,1B,0B,0B,1B,0B,4B,5B,4B,0B,5B,0B,4B,0B,5B,1B,0B,0B,4B,5B,5B,5B,0B,0B,1B,2B,1B,0B,0B,1B,0B,4B,5B,4B,0B,5B,0B,4B,0B,5B,1B,1B,0B],start_dir:5b}}'))
    }
})

//心灵感应
NetworkEvents.dataReceived("global.LEFT_SHIFTKey.consumeClick", (event) => {
    let player = event.player
    player.persistentData.putLong("last_shift_press_time", Date.now())
})

NetworkEvents.dataReceived("global.WKey.consumeClick", (event) => {
    let player = event.player
    player.persistentData.putLong("last_w_press_time", Date.now())
})

NetworkEvents.dataReceived("global.AKey.consumeClick", (event) => {
    let player = event.player
    player.persistentData.putLong("last_a_press_time", Date.now())
})

NetworkEvents.dataReceived("global.SKey.consumeClick", (event) => {
    let player = event.player
    player.persistentData.putLong("last_s_press_time", Date.now())
})

NetworkEvents.dataReceived("global.DKey.consumeClick", (event) => {
    let player = event.player
    player.persistentData.putLong("last_d_press_time", Date.now())
})

NetworkEvents.dataReceived("global.SPACEKey.consumeClick", (event) => {
    let player = event.player
    player.persistentData.putLong("last_space_press_time", Date.now())
})

ItemEvents.rightClicked(event => {
    let player = event.player
    player.persistentData.putLong("last_mouse_right_press_time", Date.now())
})

//零参

//玩家维度改变事件.1
CommonAddedEvents.playerChangeDimension(event => {
    let player = event.player
    if (!player) return
    let level = player.getLevel()
    let env = new StaffCastEnv(player, InteractionHand.MAIN_HAND)
    if (player.persistentData.contains('HexEvent_1')) {
        let HexEvent = player.persistentData.getCompound('HexEvent_1')
        let keys = HexEvent.getAllKeys()
        for (let key of keys) {
            let subCompound = HexEvent.getCompound(key)
            if (subCompound.contains('enabled') && !subCompound.getBoolean('enabled')) {
                continue
            }
            let iota = subCompound.getCompound('spell')
            let spell = IotaType.deserialize(iota, level)
            let harness = CastingVM.empty(env)
            harness.queueExecuteAndWrapIotas(spell.list, level)
        }
    }
})

//玩家重生事件.2
CommonAddedEvents.playerRespawn(event => {
    let player = event.player
    if (!player) return
    let level = player.getLevel()
    let env = new StaffCastEnv(player, InteractionHand.MAIN_HAND)
    if (player.persistentData.contains('HexEvent_2')) {
        let HexEvent = player.persistentData.getCompound('HexEvent_2')
        let keys = HexEvent.getAllKeys()
        for (let key of keys) {
            let subCompound = HexEvent.getCompound(key)
            if (subCompound.contains('enabled') && !subCompound.getBoolean('enabled')) {
                continue
            }
            let iota = subCompound.getCompound('spell')
            let spell = IotaType.deserialize(iota, level)
            let harness = CastingVM.empty(env)
            harness.queueExecuteAndWrapIotas(spell.list, level)
        }
    }
})

//玩家登入游戏事件.3
PlayerEvents.loggedIn(event => {
    let player = event.player
    if (!player) return
    let level = player.getLevel()
    let env = new StaffCastEnv(player, InteractionHand.MAIN_HAND)
    if (player.persistentData.contains('HexEvent_3')) {
        let HexEvent = player.persistentData.getCompound('HexEvent_3')
        let keys = HexEvent.getAllKeys()
        for (let key of keys) {
            let subCompound = HexEvent.getCompound(key)
            if (subCompound.contains('enabled') && !subCompound.getBoolean('enabled')) {
                continue
            }
            let iota = subCompound.getCompound('spell')
            let spell = IotaType.deserialize(iota, level)
            let harness = CastingVM.empty(env)
            harness.queueExecuteAndWrapIotas(spell.list, level)
        }
    }
})

//玩家退出游戏事件.4
PlayerEvents.loggedOut(event => {
    let player = event.player
    if (!player) return
    let level = player.getLevel()
    let env = new StaffCastEnv(player, InteractionHand.MAIN_HAND)
    if (player.persistentData.contains('HexEvent_4')) {
        let HexEvent = player.persistentData.getCompound('HexEvent_4')
        let keys = HexEvent.getAllKeys()
        for (let key of keys) {
            let subCompound = HexEvent.getCompound(key)
            if (subCompound.contains('enabled') && !subCompound.getBoolean('enabled')) {
                continue
            }
            let iota = subCompound.getCompound('spell')
            let spell = IotaType.deserialize(iota, level)
            let harness = CastingVM.empty(env)
            harness.queueExecuteAndWrapIotas(spell.list, level)
        }
    }
})

//一参

//物品右键事件，接收物品名称.5
ItemEvents.rightClicked(event => {
    let player = event.player
    if (!player) return
    if (event.hand == "OFF_HAND") return
    let item = event.item.id
    let level = player.getLevel()
    let env = new StaffCastEnv(player, InteractionHand.MAIN_HAND)
    if (player.persistentData.contains('HexEvent_5')) {
        let HexEvent = player.persistentData.getCompound('HexEvent_5')
        let keys = HexEvent.getAllKeys()
        for (let key of keys) {
            let subCompound = HexEvent.getCompound(key)
            if (subCompound.contains('enabled') && !subCompound.getBoolean('enabled')) {
                continue
            }
            let cond0 = subCompound.getString('condition_0')
            let iota = subCompound.getCompound('spell')
            if ((cond0 == item || cond0 == "null")) {
                let spell = IotaType.deserialize(iota, level)
                let str0 = StringIota.makeUnchecked(item)
                let escape = PatternIota(HexPattern.fromAnglesUnchecked("qqqaww", HexDir.WEST))
                let newIotaList = []
                newIotaList.push(escape)
                newIotaList.push(str0)
                let originalList = spell.getList().list
                for (let i = 0; i < originalList.size(); i++) {
                    newIotaList.push(originalList[i])
                }
                let harness = CastingVM.empty(env)
                harness.queueExecuteAndWrapIotas(newIotaList, level)
            }
        }
    }
})

//玩家聊天事件，接收聊天内容.6
PlayerEvents.chat(event => {
    let player = event.player
    if (!player) return
    let message = event.message
    let level = player.getLevel()
    let env = new StaffCastEnv(player, InteractionHand.MAIN_HAND)
    if (player.persistentData.contains('HexEvent_6')) {
        let HexEvent = player.persistentData.getCompound('HexEvent_6')
        let keys = HexEvent.getAllKeys()
        for (let key of keys) {
            let subCompound = HexEvent.getCompound(key)
            if (subCompound.contains('enabled') && !subCompound.getBoolean('enabled')) {
                continue
            }
            let cond0 = subCompound.getString('condition_0')
            let iota = subCompound.getCompound('spell')
            if ((cond0 == message || cond0 == "null")) {
                let spell = IotaType.deserialize(iota, level)
                let str0 = StringIota.makeUnchecked(message)
                let escape = PatternIota(HexPattern.fromAnglesUnchecked("qqqaww", HexDir.WEST))
                let newIotaList = []
                newIotaList.push(escape)
                newIotaList.push(str0)
                let originalList = spell.getList().list
                for (let i = 0; i < originalList.size(); i++) {
                    newIotaList.push(originalList[i])
                }
                let harness = CastingVM.empty(env)
                harness.queueExecuteAndWrapIotas(newIotaList, level)
            }
        }
    }
})

//物品捡起事件，接收物品名称.7
ItemEvents.pickedUp(event => {
    let player = event.player
    if (!player) return
    let item = event.item.id
    let level = player.getLevel()
    let env = new StaffCastEnv(player, InteractionHand.MAIN_HAND)
    if (player.persistentData.contains('HexEvent_7')) {
        let HexEvent = player.persistentData.getCompound('HexEvent_7')
        let keys = HexEvent.getAllKeys()
        for (let key of keys) {
            let subCompound = HexEvent.getCompound(key)
            if (subCompound.contains('enabled') && !subCompound.getBoolean('enabled')) {
                continue
            }
            let cond0 = subCompound.getString('condition_0')
            let iota = subCompound.getCompound('spell')
            if ((cond0 == item || cond0 == "null")) {
                let spell = IotaType.deserialize(iota, level)
                let str0 = StringIota.makeUnchecked(item)
                let escape = PatternIota(HexPattern.fromAnglesUnchecked("qqqaww", HexDir.WEST))
                let newIotaList = []
                newIotaList.push(escape)
                newIotaList.push(str0)
                let originalList = spell.getList().list
                for (let i = 0; i < originalList.size(); i++) {
                    newIotaList.push(originalList[i])
                }
                let harness = CastingVM.empty(env)
                harness.queueExecuteAndWrapIotas(newIotaList, level)
            }
        }
    }
})

//物品丢弃事件，接收物品名称.8
ItemEvents.dropped(event => {
    let player = event.player
    if (!player) return
    let item = event.item.id
    let level = player.getLevel()
    let env = new StaffCastEnv(player, InteractionHand.MAIN_HAND)
    if (player.persistentData.contains('HexEvent_8')) {
        let HexEvent = player.persistentData.getCompound('HexEvent_8')
        let keys = HexEvent.getAllKeys()
        for (let key of keys) {
            let subCompound = HexEvent.getCompound(key)
            if (subCompound.contains('enabled') && !subCompound.getBoolean('enabled')) {
                continue
            }
            let cond0 = subCompound.getString('condition_0')
            let iota = subCompound.getCompound('spell')
            if ((cond0 == item || cond0 == "null")) {
                let spell = IotaType.deserialize(iota, level)
                let str0 = StringIota.makeUnchecked(item)
                let escape = PatternIota(HexPattern.fromAnglesUnchecked("qqqaww", HexDir.WEST))
                let newIotaList = []
                newIotaList.push(escape)
                newIotaList.push(str0)
                let originalList = spell.getList().list
                for (let i = 0; i < originalList.size(); i++) {
                    newIotaList.push(originalList[i])
                }
                let harness = CastingVM.empty(env)
                harness.queueExecuteAndWrapIotas(newIotaList, level)
            }
        }
    }
})

//两参

//实体交互事件，接收实体名称/物品名称.9
ItemEvents.entityInteracted(event => {
    let player = event.player
    if (!player) return
    if (event.hand == "OFF_HAND") return
    let entity = event.entity.type
    let item = event.item.id
    let level = player.getLevel()
    let env = new StaffCastEnv(player, InteractionHand.MAIN_HAND)
    if (player.persistentData.contains('HexEvent_9')) {
        let HexEvent = player.persistentData.getCompound('HexEvent_9')
        let keys = HexEvent.getAllKeys()
        for (let key of keys) {
            let subCompound = HexEvent.getCompound(key)
            if (subCompound.contains('enabled') && !subCompound.getBoolean('enabled')) {
                continue
            }
            let cond0 = subCompound.getString('condition_0')
            let cond1 = subCompound.getString('condition_1')
            let iota = subCompound.getCompound('spell')
            if ((cond0 == entity || cond0 == "null") && (cond1 == item || cond1 == "null")) {
                let spell = IotaType.deserialize(iota, level)
                let str0 = StringIota.makeUnchecked(entity)
                let str1 = StringIota.makeUnchecked(item)
                let conditionList = ListIota([str0, str1])
                let escape = PatternIota(HexPattern.fromAnglesUnchecked("qqqaww", HexDir.WEST))
                let newIotaList = []
                newIotaList.push(escape)
                newIotaList.push(conditionList)
                let originalList = spell.getList().list
                for (let i = 0; i < originalList.size(); i++) {
                    newIotaList.push(originalList[i])
                }
                let harness = CastingVM.empty(env)
                harness.queueExecuteAndWrapIotas(newIotaList, level)
            }
        }
    }
})

//方块放置事件，接收方块名称/方块坐标.10
BlockEvents.placed(event => {
    let player = event.player
    if (!player) return
    let block = event.block.id
    let pos = `(${(event.block.x + 0.5).toFixed(2)}, ${(event.block.y + 0.5).toFixed(2)}, ${(event.block.z + 0.5).toFixed(2)})`
    let vec3 = new Vec3d(event.block.x + 0.5, event.block.y + 0.5, event.block.z + 0.5)
    let level = player.getLevel()
    let env = new StaffCastEnv(player, InteractionHand.MAIN_HAND)
    if (player.persistentData.contains('HexEvent_10')) {
        let HexEvent = player.persistentData.getCompound('HexEvent_10')
        let keys = HexEvent.getAllKeys()
        for (let key of keys) {
            let subCompound = HexEvent.getCompound(key)
            if (subCompound.contains('enabled') && !subCompound.getBoolean('enabled')) {
                continue
            }
            let cond0 = subCompound.getString('condition_0')
            let cond1 = subCompound.getString('condition_1')
            let iota = subCompound.getCompound('spell')
            if ((cond0 == block || cond0 == "null") && (cond1 == pos || cond1 == "null")) {
                let spell = IotaType.deserialize(iota, level)
                let str0 = StringIota.makeUnchecked(block)
                let str1 = Vec3Iota(vec3)
                let conditionList = ListIota([str0, str1])
                let escape = PatternIota(HexPattern.fromAnglesUnchecked("qqqaww", HexDir.WEST))
                let newIotaList = []
                newIotaList.push(escape)
                newIotaList.push(conditionList)
                let originalList = spell.getList().list
                for (let i = 0; i < originalList.size(); i++) {
                    newIotaList.push(originalList[i])
                }
                let harness = CastingVM.empty(env)
                harness.queueExecuteAndWrapIotas(newIotaList, level)
            }
        }
    }
})

//方块破坏事件，接收方块名称/方块坐标.11
BlockEvents.broken(event => {
    let player = event.player
    if (!player) return
    let block = event.block.id
    let pos = `(${(event.block.x + 0.5).toFixed(2)}, ${(event.block.y + 0.5).toFixed(2)}, ${(event.block.z + 0.5).toFixed(2)})`
    let vec3 = new Vec3d(event.block.x + 0.5, event.block.y + 0.5, event.block.z + 0.5)
    let level = player.getLevel()
    let env = new StaffCastEnv(player, InteractionHand.MAIN_HAND)
    if (player.persistentData.contains('HexEvent_11')) {
        let HexEvent = player.persistentData.getCompound('HexEvent_11')
        let keys = HexEvent.getAllKeys()
        for (let key of keys) {
            let subCompound = HexEvent.getCompound(key)
            if (subCompound.contains('enabled') && !subCompound.getBoolean('enabled')) {
                continue
            }
            let cond0 = subCompound.getString('condition_0')
            let cond1 = subCompound.getString('condition_1')
            let iota = subCompound.getCompound('spell')
            if ((cond0 == block || cond0 == "null") && (cond1 == pos || cond1 == "null")) {
                let spell = IotaType.deserialize(iota, level)
                let str0 = StringIota.makeUnchecked(block)
                let str1 = Vec3Iota(vec3)
                let conditionList = ListIota([str0, str1])
                let escape = PatternIota(HexPattern.fromAnglesUnchecked("qqqaww", HexDir.WEST))
                let newIotaList = []
                newIotaList.push(escape)
                newIotaList.push(conditionList)
                let originalList = spell.getList().list
                for (let i = 0; i < originalList.size(); i++) {
                    newIotaList.push(originalList[i])
                }
                let harness = CastingVM.empty(env)
                harness.queueExecuteAndWrapIotas(newIotaList, level)
            }
        }
    }
})

//三参

//方块右键事件，接收方块名称/物品名称/方块坐标.12
BlockEvents.rightClicked(event => {
    let player = event.player
    if (!player) return
    if (event.hand == "OFF_HAND") return
    let block = event.block.id
    let item = event.item.id
    let pos = `(${(event.block.x + 0.5).toFixed(2)}, ${(event.block.y + 0.5).toFixed(2)}, ${(event.block.z + 0.5).toFixed(2)})`
    let vec3 = new Vec3d(event.block.x + 0.5, event.block.y + 0.5, event.block.z + 0.5)
    let level = player.getLevel()
    let env = new StaffCastEnv(player, InteractionHand.MAIN_HAND)
    if (player.persistentData.contains('HexEvent_12')) {
        let HexEvent = player.persistentData.getCompound('HexEvent_12')
        let keys = HexEvent.getAllKeys()
        for (let key of keys) {
            let subCompound = HexEvent.getCompound(key)
            if (subCompound.contains('enabled') && !subCompound.getBoolean('enabled')) {
                continue
            }
            let cond0 = subCompound.getString('condition_0')
            let cond1 = subCompound.getString('condition_1')
            let cond2 = subCompound.getString('condition_2')
            let iota = subCompound.getCompound('spell')
            if ((cond0 == block || cond0 == "null") && (cond1 == item || cond1 == "null") && (cond2 == pos || cond2 == "null")) {
                let spell = IotaType.deserialize(iota, level)
                let str0 = StringIota.makeUnchecked(block)
                let str1 = StringIota.makeUnchecked(item)
                let str2 = Vec3Iota(vec3)
                let conditionList = ListIota([str0, str1, str2])
                let escape = PatternIota(HexPattern.fromAnglesUnchecked("qqqaww", HexDir.WEST))
                let newIotaList = []
                newIotaList.push(escape)
                newIotaList.push(conditionList)
                let originalList = spell.getList().list
                for (let i = 0; i < originalList.size(); i++) {
                    newIotaList.push(originalList[i])
                }
                let harness = CastingVM.empty(env)
                harness.queueExecuteAndWrapIotas(newIotaList, level)
            }
        }
    }
})

//方块左键事件，接收方块名称/物品名称.13
BlockEvents.leftClicked(event => {
    let player = event.player
    if (!player) return
    if (event.hand == "OFF_HAND") return
    let block = event.block.id
    let item = event.item.id
    let pos = `(${(event.block.x + 0.5).toFixed(2)}, ${(event.block.y + 0.5).toFixed(2)}, ${(event.block.z + 0.5).toFixed(2)})`
    let vec3 = new Vec3d(event.block.x + 0.5, event.block.y + 0.5, event.block.z + 0.5)
    let level = player.getLevel()
    let env = new StaffCastEnv(player, InteractionHand.MAIN_HAND)
    if (player.persistentData.contains('HexEvent_13')) {
        let HexEvent = player.persistentData.getCompound('HexEvent_13')
        let keys = HexEvent.getAllKeys()
        for (let key of keys) {
            let subCompound = HexEvent.getCompound(key)
            if (subCompound.contains('enabled') && !subCompound.getBoolean('enabled')) {
                continue
            }
            let cond0 = subCompound.getString('condition_0')
            let cond1 = subCompound.getString('condition_1')
            let cond2 = subCompound.getString('condition_2')
            let iota = subCompound.getCompound('spell')
            if ((cond0 == block || cond0 == "null") && (cond1 == item || cond1 == "null") && (cond2 == pos || cond2 == "null")) {
                let spell = IotaType.deserialize(iota, level)
                let str0 = StringIota.makeUnchecked(block)
                let str1 = StringIota.makeUnchecked(item)
                let str2 = Vec3Iota(vec3)
                let conditionList = ListIota([str0, str1, str2])
                let escape = PatternIota(HexPattern.fromAnglesUnchecked("qqqaww", HexDir.WEST))
                let newIotaList = []
                newIotaList.push(escape)
                newIotaList.push(conditionList)
                let originalList = spell.getList().list
                for (let i = 0; i < originalList.size(); i++) {
                    newIotaList.push(originalList[i])
                }
                let harness = CastingVM.empty(env)
                harness.queueExecuteAndWrapIotas(newIotaList, level)
            }
        }
    }
})

//实体受伤事件，接收实体名称/伤害类型/伤害数值.14
EntityEvents.hurt(event => {
    if (event.source.actual && event.source.actual.isPlayer()) {
        let player = event.source.actual
        let entity = event.entity.type
        let typeHolder = event.source.typeHolder()
        let resourceKey = typeHolder.unwrapKey().orElse(null)
        let type = resourceKey.location().toString()
        let num = event.damage.toString()
        let level = player.getLevel()
        let env = new StaffCastEnv(player, InteractionHand.MAIN_HAND)
        if (player.persistentData.contains('HexEvent_14')) {
            let HexEvent = player.persistentData.getCompound('HexEvent_14')
            let keys = HexEvent.getAllKeys()
            for (let key of keys) {
                let subCompound = HexEvent.getCompound(key)
                console.log(subCompound);
                
                if (subCompound.contains('enabled') && !subCompound.getBoolean('enabled')) {
                    continue
                }
                let cond0 = subCompound.getString('condition_0')
                let cond1 = subCompound.getString('condition_1')
                let cond2 = subCompound.getString('condition_2')
                let iota = subCompound.getCompound('spell')
                if ((cond0 == entity || cond0 == "null") && (cond1 == type || cond1 == "null") && (cond2 == num || cond2 == "null")) {
                    let spell = IotaType.deserialize(iota, level)
                    let str0 = EntityIota(event.entity)
                    let str1 = StringIota.makeUnchecked(type)
                    let str2 = DoubleIota(num)
                    let conditionList = ListIota([str0, str1, str2])
                    let escape = PatternIota(HexPattern.fromAnglesUnchecked("qqqaww", HexDir.WEST))
                    let newIotaList = []
                    newIotaList.push(escape)
                    newIotaList.push(conditionList)
                    let originalList = spell.getList().list
                    for (let i = 0; i < originalList.size(); i++) {
                        newIotaList.push(originalList[i])
                    }
                    let harness = CastingVM.empty(env)
                    harness.queueExecuteAndWrapIotas(newIotaList, level)
                }
            }
        }
    } else if (event.entity.isPlayer()) {
        let player = event.entity
        let entity = event.entity.type
        let typeHolder = event.source.typeHolder()
        let resourceKey = typeHolder.unwrapKey().orElse(null)
        let type = resourceKey.location().toString()
        let num = event.damage.toString()
        let level = player.getLevel()
        let env = new StaffCastEnv(player, InteractionHand.MAIN_HAND)
        if (player.persistentData.contains('HexEvent_14')) {
            let HexEvent = player.persistentData.getCompound('HexEvent_14')
            let keys = HexEvent.getAllKeys()
            for (let key of keys) {
                let subCompound = HexEvent.getCompound(key)
                if (subCompound.contains('enabled') && !subCompound.getBoolean('enabled')) {
                    continue
                }
                let cond0 = subCompound.getString('condition_0')
                let cond1 = subCompound.getString('condition_1')
                let cond2 = subCompound.getString('condition_2')
                let iota = subCompound.getCompound('spell')
                if ((cond0 == entity || cond0 == "null") && (cond1 == type || cond1 == "null") && (cond2 == num || cond2 == "null")) {
                    let spell = IotaType.deserialize(iota, level)
                    let str0 = event.source.actual ? EntityIota(event.source.actual) : NullIota()
                    let str1 = StringIota.makeUnchecked(type)
                    let str2 = DoubleIota(num)
                    let conditionList = ListIota([str0, str1, str2])
                    let escape = PatternIota(HexPattern.fromAnglesUnchecked("qqqaww", HexDir.WEST))
                    let newIotaList = []
                    newIotaList.push(escape)
                    newIotaList.push(conditionList)
                    let originalList = spell.getList().list
                    for (let i = 0; i < originalList.size(); i++) {
                        newIotaList.push(originalList[i])
                    }
                    let harness = CastingVM.empty(env)
                    harness.queueExecuteAndWrapIotas(newIotaList, level)
                }
            }
        }
    }
})
global.ForLoopTasks = new Map()
global.ZERO = new Map()
global.PatternOperateMap = {

    // ？？？
    "media": (stack, env, img, cont) => {
        let player = env.caster
        if (player && player.isPlayer()) {
            if (!player.stages.has('everBook')) {
                let url = 'https://www.mcmod.cn/post/4857.html'
                player.tell(
                    Text.of('真 · 永恒之书')
                    .gold()
                    .underlined()
                    .clickOpenUrl(url)
                    .hover('咒术机理的书写艺术')
                )
                player.stages.add('everBook')
            }
        }
        let args = new Args(stack, 1)
        let bool = args.bool(0)
        let year, month, day, hour

        if (bool) {
            let now = new Date(Utils.getSystemTime())
            year = now.getFullYear()
            month = now.getMonth() + 1
            day = now.getDate()
            hour = now.getHours()
        } else {
            let random = Math.random()
            year = Math.floor(2024 * random) + 1
            month = Math.floor(11 * random) + 1
            day = Math.floor(27 * random) + 1
            hour = Math.floor(22 * random) + 1
        }
        let sweet = hexagram(year, month, day, hour)
        stack.push(StringIota.makeUnchecked(sweet))
    },

// ==== spells ====

    // 傀影
    "simulation": (stack, env) => {
        let args = new Args(stack, 3)
        let entity = args.entity(0)
        let named = args.string(1)
        let num = args.double(2)
        let level = env.world
        let name = RL(named)
        ActionJS.helpers.assertEntityInRange(env, entity)
        let damageTotal = entity.persistentData.contains('simulation') ? entity.persistentData.getDouble('simulation') : 0
        if (!(entity instanceof Mob)) throw MishapInvalidIota.of(args.get(0), 2, 'class.mob')
        if (num > (4 - damageTotal)) throw MishapInvalidIota.of(args.get(2), 0, 'class.simulation')
        if (num < 1 || !Number.isInteger(num)) throw MishapInvalidIota.of(args.get(2), 0, 'class.simulation')
        entity.persistentData.putDouble('simulation', damageTotal + num)
        let overcast = ResourceKey.create(Registries.DAMAGE_TYPE, new ResourceLocation("hexcasting:overcast"))
        let dmgTypeRegistry = level.registryAccess().registryOrThrow(Registries.DAMAGE_TYPE)
        let dmgType = dmgTypeRegistry.getHolderOrThrow(overcast)
        let simulation = level.createEntity(name)
        let source = new DamageSource(dmgType, simulation, simulation)
        entity.attack(source, num)
        let effects = [
            OperatorSideEffect.ConsumeMedia(100),
            OperatorSideEffect.Particles(ParticleSpray.burst(entity.position(), 0.5, 20))
        ]
        return effects
    },

    // 拆解
    "uncrafting": (stack, env) => {
        let args = new Args(stack, 1)
        let entity = args.entity(0)
        let level = env.world
        if (entity.getType() !== "minecraft:item") throw MishapInvalidIota.of(args.get(0), 0, 'class.uncrafting')
        ActionJS.helpers.assertEntityInRange(env, entity)
        let itemStack = entity.getItem()
        let itemStackCount = itemStack.count
        let itemPosition = entity.position()
        let recipeManager = level.getRecipeManager()
        let craftingRecipes = recipeManager.getAllRecipesFor(RecipeType.CRAFTING)
        let matchingRecipes = []
        let iterator = craftingRecipes.iterator()
        while (iterator.hasNext()) {
            let recipe = iterator.next()
            let resultItem = recipe.getResultItem(level.registryAccess())
            let count = recipe.getResultItem(level.registryAccess()).count
            if (resultItem.getItem().getId() === itemStack.getItem().getId() && count === 1) {
                matchingRecipes.push(recipe)
            }
        }
        if (matchingRecipes.length === 0) throw MishapInvalidIota.of(args.get(0), 0, 'class.uncrafting')
        let randomIndex = Math.floor(Math.random() * matchingRecipes.length)
        let selectedRecipe = matchingRecipes[randomIndex]
        let ingredients = selectedRecipe.getIngredients()
        const RARITY_PROBABILITIES = {
            "COMMON": 0.8,
            "UNCOMMON": 0.6,
            "RARE": 0.4,
            "EPIC": 0.2
        }
        for (let i = 0; i < ingredients.size(); i++) {
            let ingredient = ingredients.get(i)
            if (ingredient.isEmpty()) {
                continue
            }
            let itemStack = ingredient.getFirst()
            itemStack = new ItemStack(itemStack.getItem(), itemStackCount)
            let rarity = itemStack.getRarity()
            let probability = RARITY_PROBABILITIES[rarity] || 0
            if (Math.random() < probability) {
                entity.remove("killed")
                level.getBlock(itemPosition).popItem(itemStack)
            }
        }
        let effects = [
            OperatorSideEffect.ConsumeMedia(10000),
            OperatorSideEffect.Particles(ParticleSpray.burst(itemPosition, 0.5, 10))
        ]
        return effects
    },

    // 剥离意识
    "enlightenment": (stack, env) => {
        let args = new Args(stack, 2)
        let entity = args.entity(0)
        let vec = args.vec3(1)
        let level = env.world
        let player = env.caster
        let x = Math.floor(vec.x())
        let y = Math.floor(vec.y())
        let z = Math.floor(vec.z())
        let blockpos = new BlockPos(x, y, z)
        if (!(entity instanceof Mob)) throw MishapInvalidIota.of(args.get(0), 1, 'class.mob')
        if (IXplatAbstractions.INSTANCE.isBrainswept(entity)) throw MishapAlreadyBrainswept(entity)
        let state = level.getBlockState(blockpos)
        let recman = level.recipeManager
        let recipes = recman.getAllRecipesFor(HexRecipeStuffRegistry.BRAINSWEEP_TYPE)
        let matchedRecipe = null
        let iterator = recipes.iterator()
        while (iterator.hasNext()) {
            let recipe = iterator.next()
            if (recipe.matches(state, entity, level)) {
                matchedRecipe = recipe
                break
            }
        }
        if (!matchedRecipe) {
            typeHurt(level, player, entity, "hexcasting:overcast", 2)
            throw MishapBadBrainsweep(entity, vec)
        }
        let block = matchedRecipe.result()
        let cost = matchedRecipe.mediaCost()
        level.setBlock(blockpos, block, 3)
        IXplatAbstractions.INSTANCE.setBrainsweepAddlData(entity)
        let effects = [
            OperatorSideEffect.ConsumeMedia(cost),
            OperatorSideEffect.Particles(ParticleSpray.burst(blockpos, 0.5, 10))
        ]
        return effects
    },

    // 聚变
    "kcit": (stack, env) => {
        let args = new Args(stack, 1)
        let vec = args.vec3(0)
        let level = env.world
        ActionJS.helpers.assertVecInRange(env, vec)
        let x = Math.floor(vec.x())
        let y = Math.floor(vec.y())
        let z = Math.floor(vec.z())
        let blockpos = new BlockPos(x, y, z)
        let entity = level.getBlockEntity(blockpos)
        let state = level.getBlockState(blockpos)
        if (entity) {
            state.getTicker(level, entity.type).tick(level, blockpos, state, entity)
        } 
        if (state.isRandomlyTicking) {
            if (level.random.nextInt(64) == 0) {
                state.randomTick(level, blockpos, level.random)
            }
            state.randomTick(level, blockpos, level.random)
        }
        let effects = [
            OperatorSideEffect.ConsumeMedia(10),
            OperatorSideEffect.Particles(ParticleSpray.burst(blockpos, 0.5, 10))
        ]
        return effects
    },

    // 撕裂
    "tear": (stack, env) => {
        let args = new Args(stack, 2)
        let entity = args.entity(0)
        let force = args.vec3(1)
        let player = env.caster
        if (!(entity instanceof Mob)) throw MishapInvalidIota.of(args.get(0), 1, 'class.mob')
        ActionJS.helpers.assertEntityInRange(env, entity)
        let alpha_v = entity.deltaMovement
        let alpha_s = alpha_v.length()
        let tearForce = 0
        if (alpha_s > 0.001) {
            let unitAlpha = alpha_v.normalize()
            let projection = force.dot(unitAlpha)
            if (projection < 0) {
                tearForce = Math.min(alpha_s, Math.abs(projection))
            }
        }
        if (player.isPlayer()) {
            entity.attack(player.damageSources().generic(), tearForce * tearForce)
        } else {
            entity.attack(tearForce * tearForce)
        }
        let omega_v = alpha_v.add(force)
        entity.setDeltaMovement(omega_v)
        entity.hurtMarked = true
        let omega_s = omega_v.length()
        let delta
        if ((omega_s - alpha_s) >= 0.1) {
            delta = (omega_s - alpha_s) * 30000
        } else {
            delta = 100
        }
        let effects = [
            OperatorSideEffect.ConsumeMedia(delta),
            OperatorSideEffect.Particles(ParticleSpray.burst(entity.position(), 0.5, 60))
        ]
        env.world.runCommandSilent(`playsound minecraft:item.shears.shear ambient @a ${entity.x} ${entity.y} ${entity.z} 0.5 0.8`)
        return effects
    },

    // 反制
    "reflection": (stack, env) => {
        let player = env.caster
        if (player == null) throw MishapBadCaster()
        if (!player.isPlayer()) throw MishapBadCaster()
        let server = player.server
        if (!player.persistentData.contains('reflection') && !player.persistentData.contains('re_cold')) {
            player.persistentData.putBoolean('reflection', true)
            server.scheduleInTicks(20, () => {
                player.persistentData.remove('reflection')
                if (player.persistentData.contains('reflect')) {
                    player.persistentData.remove('reflect')
                    return
                }
                player.persistentData.putBoolean('re_cold', true)
                server.scheduleInTicks(120, () => {
                    player.persistentData.remove('re_cold')
                })
            })
            let effects =  [
                OperatorSideEffect.ConsumeMedia(64000),
                OperatorSideEffect.Particles(ParticleSpray.burst(player.position(), 0.5, 60))
            ]
            return effects
        } else {
            player.potionEffects.add("minecraft:wither", 20, 1)
        }
    },

    // 爆炸
    "creeper": (stack, env) => {
        let args = new Args(stack, 2)
        let pos = args.vec3(0)
        ActionJS.helpers.assertVecInRange(env, pos)
        let strength = args.double(1)
        let player = env.caster
        let server = env.caster?.server??Utils.server
        let level = env.world
        if (strength < 0) throw MishapInvalidIota.of(args.get(1), 0, 'class.zero_')

        if (strength <= 1) {
            level.createExplosion(pos.x(), pos.y(), pos.z())
                .exploder(player)
                .strength(strength)
                .explosionMode("tnt")
                .explode()
        } 
        if (3 >= strength && strength > 1) {
            let delayTicks = Math.floor(strength * 20)
            server.scheduleInTicks(delayTicks, () => {
                level.createExplosion(pos.x(), pos.y(), pos.z())
                    .exploder(player)
                    .strength(strength)
                    .explosionMode("tnt")
                    .explode()
            })
        }
        if (10 >= strength && strength > 3) {
            let delayTicks = Math.floor(strength * 20)
            server.scheduleInTicks(delayTicks, () => {
                level.createExplosion(pos.x(), pos.y(), pos.z())
                    .exploder(player)
                    .causesFire(true)
                    .strength(strength)
                    .explosionMode("tnt")
                    .explode()
            })
        } 
        if (strength > 10) {
            let delayTicks = Math.floor(strength * 20)
            server.scheduleInTicks(delayTicks, () => {
                level.createExplosion(pos.x(), pos.y(), pos.z())
                    .causesFire(true)
                    .strength(strength)
                    .explosionMode("tnt")
                    .explode()
            })
        }
        let effects = [
            OperatorSideEffect.ConsumeMedia(Math.min(strength * strength * 10000, 360000))
        ]
        
        return effects
    },

    // 罅隙
    "space": (stack, env) => {
        let args = new Args(stack, 5)
        let sourcePos1 = args.vec3(0)
        let sourcePos2 = args.vec3(1)
        let destPos = args.vec3(2)
        let filter = args.list(3).list
        let bool = args.bool(4)
        let destPos1_x = sourcePos1.x() + destPos.x()
        let destPos1_y = sourcePos1.y() + destPos.y()
        let destPos1_z = sourcePos1.z() + destPos.z()
        let destPos2_x = sourcePos2.x() + destPos.x()
        let destPos2_y = sourcePos2.y() + destPos.y()
        let destPos2_z = sourcePos2.z() + destPos.z()
        let level = env.world
        let server = env.caster?.server??Utils.server
        let sourceMinX = Math.min(Math.floor(sourcePos1.x()), Math.floor(sourcePos2.x()))
        let sourceMaxX = Math.max(Math.floor(sourcePos1.x()), Math.floor(sourcePos2.x()))
        let sourceMinY = Math.min(Math.floor(sourcePos1.y()), Math.floor(sourcePos2.y()))
        let sourceMaxY = Math.max(Math.floor(sourcePos1.y()), Math.floor(sourcePos2.y()))
        let sourceMinZ = Math.min(Math.floor(sourcePos1.z()), Math.floor(sourcePos2.z()))
        let sourceMaxZ = Math.max(Math.floor(sourcePos1.z()), Math.floor(sourcePos2.z()))
        let destMinX = Math.min(Math.floor(destPos1_x), Math.floor(destPos2_x))
        let destMinY = Math.min(Math.floor(destPos1_y), Math.floor(destPos2_y))
        let destMinZ = Math.min(Math.floor(destPos1_z), Math.floor(destPos2_z))
        let width = sourceMaxX - sourceMinX + 1
        let height = sourceMaxY - sourceMinY + 1
        let depth = sourceMaxZ - sourceMinZ + 1
        let copied = 0
        let skipped = 0
        let filterSet = new Set()
        if (filter.length > 0) {
            for (let id of filter) {
                if (!(id?.string)) continue
                let filtId = RL(id.string)
                filterSet.add(filtId)
            }
        }
        for (let x = 0; x < width; x++) {
            for (let y = 0; y < height; y++) {
                for (let z = 0; z < depth; z++) {
                    let sourcePos = new BlockPos(sourceMinX + x, sourceMinY + y, sourceMinZ + z)
                    let blockId = level.getBlock(sourcePos).id.toString()
                    if (filterSet.size > 0) {
                        let isInList = Array.from(filterSet).some(f => String(f) === blockId)
                        if ((bool && !isInList) || (!bool && isInList)) {
                            skipped++
                            continue
                        }
                    }
                    let destBlockPos = new BlockPos(destMinX + x, destMinY + y, destMinZ + z)
                    let sourceState = level.getBlockState(sourcePos)
                    let sourceEntity = level.getBlockEntity(sourcePos)
                    level.setBlock(destBlockPos, sourceState, 3)
                    if (sourceEntity) {
                        let entityData = sourceEntity.saveWithFullMetadata()
                        let newEntity = level.getBlockEntity(destBlockPos)
                        if (newEntity) {
                            newEntity.load(entityData)
                        }
                    }
                    copied++
                }
            }
        }
        server.runCommandSilent(`fill ${sourceMinX} ${sourceMinY} ${sourceMinZ} ${sourceMaxX} ${sourceMaxY} ${sourceMaxZ} air`)
        let mediaCost = 0
        if (copied > 0) {
            mediaCost += (Math.log10(copied) + 1) * (Math.log10(copied) + 1) * 100000
        }
        mediaCost += skipped * 10
        let effects = [
            OperatorSideEffect.ConsumeMedia(mediaCost)
        ]
        return effects
    },

    // 升华
    "infinite": (stack, env) => {
        let args = new Args(stack, 1)
        let entity = args.entity(0)
        entity.persistentData.putBoolean('finite', true)
        let effects =  [
            OperatorSideEffect.ConsumeMedia(64000),
            OperatorSideEffect.Particles(ParticleSpray.burst(entity.position(), 0.5, 60))
        ]
        return effects
    },

    // 吸星大法
    "effect": (stack, env) => {
        let args = new Args(stack, 2);
        let source = args.entity(0)
        let target = args.entity(1)
        if (!(source instanceof Mob)) throw MishapInvalidIota.of(args.get(0), 1, 'class.mob')
        if (!(target instanceof Mob)) throw MishapInvalidIota.of(args.get(1), 0, 'class.mob')
        ActionJS.helpers.assertEntityInRange(env, source)
        ActionJS.helpers.assertEntityInRange(env, target)
        
        let effects = source.getActiveEffects()
        if (effects.isEmpty()) return
        
        effects.forEach(effect => {
            let effectType = effect.getEffect()
            let duration = effect.getDuration()
            let amplifier = effect.getAmplifier()
            target.potionEffects.add(effectType, duration, amplifier)
        })
        source.removeAllEffects()
        let effectsList = [
            OperatorSideEffect.ConsumeMedia(100000),
            OperatorSideEffect.Particles(ParticleSpray.burst(source.position(), 1, 20)),
            OperatorSideEffect.Particles(ParticleSpray.burst(target.position(), 1, 20))
        ]
        
        return effectsList
    },

    // 心灵控制
    "control": (stack, env) => {
        let args = new Args(stack, 2)
        let mob = args.entity(0)
        let target = args.entity(1)
        ActionJS.helpers.assertEntityInRange(env, mob)
        ActionJS.helpers.assertEntityInRange(env, target)
        if (!mob.isMonster()) throw MishapInvalidIota.of(args.get(0), 1, 'class.control')
        if (!target.isLiving()) throw MishapInvalidIota.of(args.get(1), 0, 'class.mob')
        let num = Math.floor(Math.min(mob.getHealth(), target.getHealth()))
        let effects = [
            OperatorSideEffect.ConsumeMedia(num * 1000),
            OperatorSideEffect.Particles(ParticleSpray.burst(mob.eyePosition, 1, 20))
        ]
        let data = mob.getPersistentData()
        let targetUUID = target.getUuid().toString()
        data.putString('hex_target_uuid', targetUUID)
        mob.stopUsingItem()
        mob.setTarget(null)
        if (!data.getBoolean('hex_controlled')) {
            mob.targetSelector.addGoal(0,
                new NearestAttackableTargetGoal(mob, LivingEntity, 10, true,false, (e) =>
                e.getUuid().toString().equals(mob.getPersistentData().getString('hex_target_uuid'))
            ))

            if (!mob.type.includes('skeleton') && !mob.type.includes('stray')) {
                mob.goalSelector.addGoal(1, new MeleeAttackGoal(mob, 1.2, true))
            }
            data.putBoolean('hex_controlled', true)
        }
        mob.setTarget(target)
        mob.setAggressive(true)
        return effects
    },

    // 冲刺
    "otto": (stack, env) => {
        let args = new Args(stack, 2)
        let target = args.entity(0)
        let num = args.double(1)
        if (num <= 0) throw MishapInvalidIota.of(args.get(1), 0, 'class.zero_')
        ActionJS.helpers.assertEntityInRange(env, target)
        let currentVelocity = target.getDeltaMovement()
        let currentSpeed = currentVelocity.length()
        let lookVec = target.getLookAngle()
        let triggerChance = Math.min(currentSpeed / 100, 1)
        let triggerTeleport = Math.random() < triggerChance
        if (triggerTeleport) {
            let teleportDistance = Math.min(currentSpeed / num, 64)
            if (teleportDistance == 64) {
                if (!target.isPlayer()) {
                    target.remove("killed")
                    throw MishapInvalidIota.of(args.get(0), 1, 'class.0tt0')
                }
            }
            let teleportVec = lookVec.scale(teleportDistance)
            let newPosition = target.position().add(teleportVec)
            let newVelocity = currentVelocity.scale(num)
            target.setPosition(newPosition.x(), newPosition.y(), newPosition.z())
            target.setDeltaMovement(newVelocity)
            target.hurtMarked = true
        } else {
            let acceleration = lookVec.scale(num)
            let newVelocity = currentVelocity.add(acceleration)
            target.setDeltaMovement(newVelocity)
            target.hurtMarked = true
        }
        let effects = [
            OperatorSideEffect.ConsumeMedia(Math.round(num / Math.max(currentSpeed, 1) * 10000))
        ]
        return effects
    },

    // 湮灭
    "annihilation": (stack, env) => {
        let args = new Args(stack, 1)
        let vec = args.vec3(0)
        ActionJS.helpers.assertVecInRange(env, vec)
        let level = env.world
        let effects = [
            OperatorSideEffect.ConsumeMedia(10)
        ]
        
        let x = Math.floor(vec.x())
        let y = Math.floor(vec.y())
        let z = Math.floor(vec.z())
        
        let blockPos = new BlockPos(x, y, z)
        let blockState = level.getBlockState(blockPos)

        if (blockState.isAir()) return

        level.setBlock(blockPos, Blocks.AIR.defaultBlockState(), 3)
        return effects
    },

    // 俄罗斯轮盘
    "roulette": (stack, env) => {
        let player = env.caster
        if (player == null) throw MishapBadCaster()
        if (!player.isPlayer()) throw MishapBadCaster()
        let server = player.server
        let mediaConsumptionAttr = player.getAttribute('hexcasting:media_consumption')
        let effects = [
            OperatorSideEffect.ConsumeMedia(Math.ceil(60000)),
            OperatorSideEffect.Particles(ParticleSpray.burst(player.eyePosition, 1, 20))
        ]
        if (player.persistentData.contains('roulette')) return
        let originalValue = 1
        let totalReduction = player.persistentData.contains('hexcasting:total_reduction') 
            ? player.persistentData.getDouble('hexcasting:total_reduction') 
            : 0
        let randomValue = Math.random()
        let isIncrease = randomValue < 1/6
        let newValue
        if (isIncrease) {
            newValue = totalReduction * totalReduction
            player.persistentData.putDouble('hexcasting:total_reduction', 0)
        } else {
            newValue = Math.random() * (1 - 0.16) + 0.16
            newValue = Math.round(newValue * 100) / 100
            let currentReduction = 1 - newValue
            totalReduction += currentReduction
            player.persistentData.putDouble('hexcasting:total_reduction', totalReduction)
        }
        mediaConsumptionAttr.setBaseValue(newValue)
        player.persistentData.putBoolean('roulette', true)
        player.persistentData.putDouble('hexcasting:media_consumption_original', originalValue)
        server.scheduleInTicks(120 , () => {
            if (player.persistentData.contains('roulette')) {
                let original = player.persistentData.getDouble('hexcasting:media_consumption_original')
                let currentAttr = player.getAttribute('hexcasting:media_consumption')
                currentAttr.setBaseValue(original)
                player.persistentData.remove('roulette')
                player.persistentData.remove('hexcasting:media_consumption_original')
            }
        })
        return effects
    },

    // 补货
    "restock": (stack, env) => {
        let args = new Args(stack, 1)
        let villager = args.villager(0)
        ActionJS.helpers.assertEntityInRange(env, villager)
        if (IXplatAbstractions.INSTANCE.isBrainswept(villager)) 
        throw MishapAlreadyBrainswept(target)
        let data = villager.getNbt()
        let effects = [
            OperatorSideEffect.ConsumeMedia(Math.ceil(10000)),
            OperatorSideEffect.Particles(ParticleSpray.burst(villager.eyePosition, 1, 20))
        ]
        if (data.Offers) {
            for (var i = 0; i < data.Offers.Recipes.length; i++) {
                data.Offers.Recipes[i].maxUses = NBT.i(32)
                data.Offers.Recipes[i].uses = NBT.i(0)
                data.Offers.Recipes[i].remove('demand')
            }
        }
        villager.setNbt(data)
        let pos = `${villager.x} ${villager.y} ${villager.z}`
        env.world.runCommandSilent(`playsound minecraft:entity.player.levelup ambient @a ${pos} 0.5 0.8`)
        return effects
    },

    // 时序
    "again": (stack, env) => {
        let args = new Args(stack, 1)
        let num = args.double(0)
        let server = env.caster?.server??Utils.server
        let effects = [
            OperatorSideEffect.ConsumeMedia(Math.ceil(100000))
        ]
        server.runCommandSilent(`time set ${num}`)
        return effects
    },
    
    // 让度
    "merge": (stack, env) => {
        let args = new Args(stack, 4)
        let victim = args.brainmerge_target(0)
        ActionJS.helpers.assertEntityInRange(env, victim)
        let inject = args.villager(1)
        let Index1 = args.double(2)
        let Index2 = args.double(3)
        let tradeIndex1 = Math.floor(Index1)
        let tradeIndex2 = Math.floor(Index2)
        
        for (let target of [victim, inject]) if (IXplatAbstractions.INSTANCE.isBrainswept(target)) throw MishapAlreadyBrainswept(target)
        let sideEffects = [
            OperatorSideEffect.ConsumeMedia(100000),
            OperatorSideEffect.Particles(ParticleSpray.cloud(victim.eyePosition, 1, 20)),
            OperatorSideEffect.Particles(ParticleSpray.burst(inject.eyePosition, 1, 100))
        ]

        let oldData = inject.getVillagerData && inject.getVillagerData()
        if (oldData.level < 5 && oldData.profession.name() !== 'none') {
            let newLevel = oldData.getLevel() + 1
            inject.setVillagerData(oldData.setLevel(newLevel))
            inject.setVillagerXp([10, 70, 150, 250][newLevel - 2])
            inject.potionEffects.add('regeneration', 40, 0)
            let newOffers = inject.offers
            if (victim instanceof AbstractVillager) {
                let extOffers = victim.offers
                if (extOffers.length > 0) {
                    let actualIndex1 = Math.max(0, Math.min(tradeIndex1, extOffers.length - 1))
                    let actualIndex2 = Math.max(0, Math.min(tradeIndex2, extOffers.length - 1))
                    let offer1 = extOffers[actualIndex1]
                    let offer2 = extOffers[actualIndex2]
                    if (offer1 && offer2) {
                        newOffers.push(offer1)
                        newOffers.push(offer2)
                    }
                }
                extOffers.clear()
                if (victim.setOffers) victim.setOffers(extOffers)
            }
            inject.setOffers(newOffers)
            let pos = `${victim.x} ${victim.y} ${victim.z}`
            env.world.runCommandSilent(`playsound minecraft:entity.player.levelup ambient @a ${pos} 0.5 0.8`)
        }
        return sideEffects
    },

    // 箭矢
    "arrow": (stack, env) => {
        let args = new Args(stack, 2)
        let pos = args.vec3(0)
        let num = args.double(1)
        let player = env.caster
        if (player == null) throw MishapBadCaster()
        if (!player.isPlayer()) throw MishapBadCaster()

        if (num != 1 && num != 2 && num != 3 && num != 4 && num != 5) throw MishapInvalidIota.of(args.get(1), 0, 'class.arrow')

        ActionJS.helpers.assertVecInRange(env, pos)
        
        let uuid = player.uuid
        let effects = [
            OperatorSideEffect.ConsumeMedia(Math.ceil(num * num * 1000)),
            OperatorSideEffect.Particles(ParticleSpray.burst(pos, 1, 20))
        ]
        let arrow = new SpectralArrow(env.world, player)
        arrow.mergeNbt({
            NoGravity: true,
            PierceLevel: 6,
            Owner: uuid,
            damage: num,
            pickup: 0,
            life: 1
        })
        arrow.setPos(pos)
        arrow.spawn()
        stack.push(EntityIota(arrow))
        return effects
    },

    // 坠落
    "fall": (stack, env) => {
        let args = new Args(stack, 1)
        let entity = args.entity(0)
        if (!(entity instanceof Mob)) throw MishapInvalidIota.of(args.get(0), 0, 'class.mob')
        if (!entity.persistentData.contains('fall')) {
            entity.persistentData.putBoolean('fall', true)
            let add = entity.getDeltaMovement()
            let g = add.length()
            entity.fallDistance(entity.fallDistance() + g)
        }
        let effects = [
            OperatorSideEffect.ConsumeMedia(Math.ceil(10000)),
            OperatorSideEffect.Particles(ParticleSpray.burst(entity.eyePosition, 1, 20))
        ]
        return effects
    },

    // 旅者传送
    "pos": (stack, env) => {
        let args = new Args(stack, 2)
        let entity = args.entity(0)
        let pos = args.vec3(1)
        let level = env.world
        let distance = Math.sqrt(Math.pow(entity.x - pos.x(), 2) + Math.pow(entity.y - pos.y(), 2) + Math.pow(entity.z - pos.z(), 2))
        let effects = [
                OperatorSideEffect.ConsumeMedia(Math.ceil((Math.pow(distance, 2)) * 1000)),
                OperatorSideEffect.Particles(ParticleSpray.burst(pos, 1, 20))
            ]
        if (distance <= 16) {
            entity.setPosition(pos.x(), pos.y(), pos.z())
        }

        if (16 <= distance) {
            let random1 = Math.floor(Math.random() * 100000) - 50000
            let random2 = Math.floor(Math.random() * 100000) - 50000
            let random = new Vec3d(
                pos.x() + random1,
                pos.y(),
                pos.z() + random2
            )
            let x = Math.floor(random.x())
            let y = Math.floor(random.y())
            let z = Math.floor(random.z())
            if (!level.isEmptyBlock(random)) {
                for (let dy = 1; dy <= 256; dy++) {
                    let Y = y + dy
                    let emptypos = new BlockPos(x, Y, z)
                    if (level.isEmptyBlock(emptypos)) {
                        entity.setPosition(x, Y, z)
                        break
                    }
                }
            } else{
                entity.setPosition(random.x(), random.y(), random.z())
            }
        }
        return effects
    },

    // 重力
    "gravity": (stack, env) => {
        let args = new Args(stack, 2)
        let entity = args.entity(0)
        let num = args.double(1)
        let cost
        if (num >= 0 && num <= 8) {
            cost = 100
        } else if (num < 0) {
            cost = num * num * 10000
        } else {
            cost = (num - 8) * 10000
        }
        entity.getAttribute('forge:entity_gravity').setBaseValue(num * 0.01)
        let effects = [
            OperatorSideEffect.ConsumeMedia(cost),
            OperatorSideEffect.Particles(ParticleSpray.burst(entity.position(), 0.5, 20))
        ]
        return effects
    },

    // 阿瓦达索命
    "avada_kedavra": (stack, env) => {
        let player = env.caster
        if (player == null) throw MishapBadCaster()
        if (!player.isPlayer()) throw MishapBadCaster()
        if (player.mainHandItem.id !== "hexcasting:staff/quenched") throw MishapBadCaster()
        let args = new Args(stack, 2)
        let entity = args.entity(0)
        let condition = args.get(1)
        let level = env.world
        let prime = true
        if (condition instanceof DoubleIota) {
            prime = condition.double
        } else if (condition instanceof StringIota && condition.string == "淬灵法杖(ゝ∀･)~") {
            prime = "淬灵法杖(ゝ∀･)~"
        } else throw MishapInvalidIota.of(args.get(1), 0, 'class.prime')
        const PRIME_NUMBERS = [
            3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97, 101, 103, 107, 109, 113, 127, 131, 137, 139, 149, 151, 157, 163, 167, 173, 179, 181, 191, 193, 197, 199, 211, 223, 227, 229, 233, 239, 241, 251, 257, 263, 269, 271, 277, 281, 283, 293, 307, 311, 313, 317, 331, 337, 347, 349, 353, 359, 367, 373, 379, 383, 389, 397, 401, 409, 419, 421, 431, 433, 439, 443, 449, 457, 461, 463, 467, 479, 487, 491, 499, 503, 509, 521, 523, 541, 547, 557, 563, 569, 571, 577, 587, 593, 599, 601, 607, 613, 617, 619, 631, 641, 643, 647, 653, 659, 661, 673, 677, 683, 691, 701, 709, 719, 727, 733, 739, 743, 751, 757, 761, 769, 773, 787, 797, 809, 811, 821, 823, 827, 829, 839, 853, 857, 859, 863, 877, 881, 883, 887, 907, 911, 919, 929, 937, 941, 947, 953, 967, 971, 977, 983, 991, 997
        ]
        if ((entity instanceof Mob && condition instanceof DoubleIota) && prime !== "淬灵法杖(ゝ∀･)~") {
            let health = Math.floor(entity.getHealth())
            let attack_player = Math.min(prime, health / prime)
            if (!PRIME_NUMBERS.includes(prime) || health % prime !== 0) throw MishapInvalidIota.of(args.get(1), 0, 'class.prime')
            if (IXplatAbstractions.INSTANCE.isBrainswept(entity)) {
                if (health / prime <= 4) {
                    avada_kedavra(player, entity, level)
                    player.attack(entity.damageSources().mobAttack(entity), attack_player)
                    throw MishapAlreadyBrainswept(entity)
                } else {
                    typeHurt(level, player, entity, "hexcasting:overcast", prime)
                    player.attack(entity.damageSources().mobAttack(entity), attack_player)
                    player.server.runCommandSilent(`loot spawn ${entity.x} ${entity.y} ${entity.z} loot ${entity.lootTable}`)
                }
            } else {
                if (health == prime) {
                    IXplatAbstractions.INSTANCE.setBrainsweepAddlData(entity)
                    player.attack(entity.damageSources().mobAttack(entity), attack_player)
                } else {
                    let d_e = health / prime + prime
                    typeHurt(level, player, entity, "hexcasting:overcast", d_e)
                    player.attack(entity.damageSources().mobAttack(entity), attack_player)
                    entity.setMaxHealth(health - d_e)
                }
            }
        } else {
            avada_kedavra(player, entity, level)
            if (entity?.health) {
                throw MishapAlreadyBrainswept(entity)
            }
        }
    },

    // 溯洄
    "the_spirit": (stack, env) => {
        let player = env.caster
        if (player == null) throw MishapBadCaster()
        if (!player.isPlayer()) throw MishapBadCaster()
        let hasStage = player.stages.has("oneInSpirit")
        if (!hasStage) {
            player.stages.add("oneInSpirit")
            player.tell("溯洄时刻印于此，可能或谬误时回溯")
            player.tell("在时间中逆流而上，直至抵达曾经的自我")
            player.tell("再来一次，然后，忘记他……")
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
        } else {
            let stateTag = player.persistentData.getCompound('the_spirit')
            stateTag.putDouble('max_health', player.getMaxHealth())
            stateTag.putString('dimension', env.world.dimension)
            stateTag.putDouble('health', player.getHealth())
            stateTag.putDouble('food', player.foodLevel)
            stateTag.putDouble('air', player.airSupply)
            stateTag.putDouble('pitch', player.pitch)
            stateTag.putDouble('yaw', player.yaw)
            stateTag.putDouble('pos_x', player.x)
            stateTag.putDouble('pos_y', player.y)
            stateTag.putDouble('pos_z', player.z)

            let type = player.persistentData.getList('type', 8)
            let long = player.persistentData.getList('long', 3)
            let deep = player.persistentData.getList('deep', 3)
            let potions = player.getActiveEffects().toArray()
            let size = potions.length
            for (let i = 0; i < size; i++) {
                let result = String(potions[i]).substring(7)
                let xIndex = result.indexOf(' x ')
                if (xIndex !== -1) {
                    result = result.substring(0, xIndex)
                }
                let commaIndex = result.indexOf(',')
                if (commaIndex !== -1) {
                    result = result.substring(0, commaIndex)
                }
                let dotIndex = result.indexOf('.')
                if (dotIndex !== -1) {
                    result = result.substring(0, dotIndex) + ':' + result.substring(dotIndex + 1)
                }
                type.add(i, result)
                long.add(i, potions[i].duration)
                deep.add(i, potions[i].amplifier)
            }
            player.persistentData.put('type', type)
            player.persistentData.put('long', long)
            player.persistentData.put('deep', deep)
            player.persistentData.put('the_spirit', stateTag)
        }
    },

    // 全视
    "eye_of_providence": (stack, env) => {
        let args = new Args(stack, 2)
        let dimension = args.string(0)
        let infinite = args.bool(1)
        let server = env.caster?.server??Utils.server
        let dimensionKeys = server.levelKeys()
        let dimensionNames = []
        dimensionKeys.forEach(key => {
            dimensionNames.push(key.location().toString())
        })
        let namespace = RL(dimension)
        if (!dimensionNames.includes(namespace)) throw MishapInvalidIota.of(args.get(0), 1, 'class.level')
        let locals = global.PatternOperateMap.eye_of_providence
        if (!locals.protoComp) {
            let key = new JavaAdapter(CastingEnvironmentComponent.Key, {})
            locals.protoComp = {
                onIsVecInRange(vec, current) {
                    return true
                },
                getKey() {
                    return key
                }
            }
        }
        let effects = []
        if (infinite) {
            let player = env.caster
            if (player !== null && player.health) {
                player.health = 0.0001
            }
        } else {
            effects = [
                OperatorSideEffect.ConsumeMedia(Math.ceil(100000))
            ]
        }
        env.addExtension(new JavaAdapter(CastingEnvironmentComponent.IsVecInRange, locals.protoComp))
        global.unsafeSetField(env, 'world', server.getLevel(namespace))
        return effects
    },

    // 流转
    "focus": (stack, env) => {
        let args = new Args(stack, 2)
        let entity = args.entity(0)
        ActionJS.helpers.assertEntityInRange(env, entity)
        let movement = args.get(1)
        if (movement instanceof Vec3Iota) {
            let direction = movement.vec3
            let currentVelocity = entity.getDeltaMovement()
            let currentSpeed = Math.sqrt(Math.pow(currentVelocity.x(), 2) + Math.pow(currentVelocity.y(), 2) + Math.pow(currentVelocity.z(), 2))
            let directionLength = Math.sqrt(Math.pow(direction.x(), 2) + Math.pow(direction.y(), 2) + Math.pow(direction.z(), 2))
            if (directionLength < 0.0001) return
            let vec = new Vec3d(
                direction.x() * currentSpeed / directionLength,
                direction.y() * currentSpeed / directionLength,
                direction.z() * currentSpeed / directionLength
            )
            entity.setDeltaMovement(vec)
            entity.hurtMarked = true
        } else if (movement instanceof EntityIota) {
            let target = movement.entity
            ActionJS.helpers.assertEntityInRange(env, target)
            let velocityA = entity.getDeltaMovement()
            let velocityB = target.getDeltaMovement()
            entity.setDeltaMovement(velocityB)
            target.setDeltaMovement(velocityA)
            entity.hurtMarked = true
            target.hurtMarked = true
        } else if (movement instanceof DoubleIota) {
            let time = movement.double
            if (time < 1 || !Number.isInteger(time)) throw MishapInvalidIota.of(args.get(1), 0, 'class.zero')
            let server = env.caster?.server ?? Utils.server
            let currentTick = server.getTickCount()
            let restoreTick = currentTick + time
            let uuid = entity.uuid.toString()
            let currentVelocity = entity.getDeltaMovement()
            if (global.ZERO.has(uuid)) {
                let entry = global.ZERO.get(uuid)
                entry.velocity = new Vec3d(
                    entry.velocity.x() + currentVelocity.x(),
                    entry.velocity.y() + currentVelocity.y(),
                    entry.velocity.z() + currentVelocity.z()
                )
                entry.restoreTick = restoreTick
            } else {
                global.ZERO.set(uuid, {
                    velocity: currentVelocity,
                    restoreTick: restoreTick,
                    entity : entity
                })
            }
            entity.setDeltaMovement(Vec3d.ZERO)
            entity.hurtMarked = true
        } else throw MishapInvalidIota.of(args.get(1), 0, 'class.foucs')
    },

    // 黑死神
    "plague": (stack, env) => {
        let args = new Args(stack, 2)
        let List = args.list(0).list
        let beneficial = args.bool(1)
        let effect = []
        for (let entityIota of List) {
            let entity = entityIota?.entity
            if (!(entity instanceof Mob)) throw MishapInvalidIota.of(args.get(0), 0, 'class.entitylist')
            let activeEffects = entity.getActiveEffects()
            for (let effectInstance of activeEffects) {
                let effectType = effectInstance.getEffect()
                let duration = effectInstance.getDuration()
                let amplifier = effectInstance.getAmplifier()
                if (effectType.isBeneficial() == beneficial) {
                    let existingIndex = -1
                    for (let i = 0; i < effect.length; i++) {
                        if (effect[i].effectType === effectType) {
                            existingIndex = i
                            break
                        }
                    }
                    if (existingIndex >= 0) {
                        if (duration > effect[existingIndex].duration) {
                            effect[existingIndex].duration = duration
                        }
                        if (amplifier > effect[existingIndex].amplifier) {
                            effect[existingIndex].amplifier = amplifier
                        }
                    } else {
                        effect.push({
                            effectType: effectType,
                            duration: duration,
                            amplifier: amplifier
                        })
                    }
                }
            }
        }
        
        for (let entityIota of List) {
            let entity = entityIota?.entity
            if (!(entity instanceof Mob)) continue
            let activeEffects = entity.getActiveEffects()
            let currentHarmfulEffects = []
            for (let effectInstance of activeEffects) {
                let effectType = effectInstance.getEffect()
                if (effectType.isBeneficial() == beneficial) {
                    currentHarmfulEffects.push({
                        type: effectType,
                        instance: effectInstance
                    })
                }
            }
            if (Math.random() < 0.5) {
                let availableEffects = effect.filter(globalEff => 
                    !currentHarmfulEffects.some(currEff => 
                        currEff.type === globalEff.effectType
                    )
                )
                if (availableEffects.length > 0) {
                    let selected = availableEffects[
                        Math.floor(Math.random() * availableEffects.length)
                    ]
                    entity.potionEffects.add(
                        selected.effectType,
                        Math.floor(selected.duration / 2),
                        Math.min(selected.amplifier + 1, 255)
                    )
                }
            }
            else {
                if (currentHarmfulEffects.length > 0) {
                    let selected = currentHarmfulEffects[
                        Math.floor(Math.random() * currentHarmfulEffects.length)
                    ]
                    let currentInstance = selected.instance
                    let newDuration = Math.min(currentInstance.getDuration() * 2, 1000000)
                    let newAmplifier = currentInstance.getAmplifier() - 1
                    if (newAmplifier >= 0) {
                        entity.removeEffect(selected.type)
                        entity.potionEffects.add(selected.type, newDuration, newAmplifier)
                    } else {
                        for (let entityIota of List) {
                            let entity = entityIota?.entity
                            if (!(entity instanceof Mob)) continue
                            entity.removeEffect(selected.type)
                        } return
                    }
                }
            }
        }
    },

    // 飞升
    "high": (stack, env) => {
        let args = new Args(stack, 2)
        let entity = args.entity(0)
        let high = args.double(1)
        let vec = entity.getDeltaMovement()
        let effects = [
            OperatorSideEffect.Particles(ParticleSpray.burst(entity.eyePosition, 1, 20))
        ]
        entity.setPosition(entity.x, entity.y + high, entity.z)
        entity.setDeltaMovement(vec)
        entity.hurtMarked = true
        return effects
    },

    // 骑乘
    "ride": (stack, env) => {
        let args = new Args(stack, 2)
        let entity_0 = args.entity(0)
        let entity_1 = args.entity(1)
        if (entity_0.isPassenger() && entity_0.getVehicle() === entity_1) {
            entity_0.stopRiding()
            return
        }
        if (entity_1.isPassenger() && entity_1.getVehicle() === entity_0) {
            entity_1.stopRiding()
            return
        }
        entity_0.startRiding(entity_1, true)
        let effects = [
            OperatorSideEffect.Particles(ParticleSpray.burst(entity_0.footPosition, 1, 20))
        ]
        return effects
    },

    // 标识
    "tags": (stack, env) => {
        let args = new Args(stack, 3)
        let entity = args.entity(0)
        let tagName = args.string(1)
        let condition = args.get(2)
        if (condition instanceof BooleanIota) {
            condition = args.bool(2)
        } else if (condition instanceof NullIota) {
            condition = null
        } else throw MishapInvalidIota.of(args.get(2), 0, 'class.bool_null')
        if (tagName === "") {
            if (!(entity instanceof Mob)) throw MishapInvalidIota.of(args.get(0), 2, 'class.name')
            if (condition == true) {
                entity.potionEffects.add("minecraft:glowing", -1, 0, false, false)
            } else if (condition == false) {
                entity.removeEffect("minecraft:glowing")
            } else if (condition == null) {
                stack.push(BooleanIota(entity.glowing))
            }
        } else {
            let fullTagName = "T_" + tagName
            if (condition == true && !entity.persistentData.contains(fullTagName)) {
                entity.persistentData.putBoolean(fullTagName, true)
            } else if (condition == false && entity.persistentData.contains(fullTagName)) {
                entity.persistentData.remove(fullTagName)
            } else if (condition == null) {
                let potions = entity.getActiveEffects().toArray()
                let size = potions.length
                let hasEffect = false
                for (let i = 0; i < size; i++) {
                    let result = String(potions[i]).substring(7)
                    let xIndex = result.indexOf(' x ')
                    if (xIndex !== -1) {
                        result = result.substring(0, xIndex)
                    }
                    let commaIndex = result.indexOf(',')
                    if (commaIndex !== -1) {
                        result = result.substring(0, commaIndex)
                    }
                    let dotIndex = result.indexOf('.')
                    if (dotIndex !== -1) {
                        result = result.substring(dotIndex + 1)
                    }
                    if (tagName == result) {
                        hasEffect = true
                        let duration = potions[i].getDuration()
                        stack.push(DoubleIota(duration))
                        return
                    }
                }
                if (!hasEffect) {
                    let tag = entity.persistentData.contains(tagName)
                    stack.push(BooleanIota(tag))
                }
            }
        }
    },

    // 维录
    "world_set": (stack, env) => {
        let args = new Args(stack, 1)
        let set = args.get(0)
        let player = env.caster
        if (set instanceof Vec3Iota) {
            let vec = set.vec3
            let world_set = player.persistentData.getCompound('world_set')
            world_set.putDouble('pos_x', vec.x())
            world_set.putDouble('pos_y', vec.y())
            world_set.putDouble('pos_z', vec.z())
            player.persistentData.put('world_set', world_set)
        } else if (set instanceof EntityIota) {
            let entity = set.entity
            let world_set = player.persistentData.getCompound('world_set')
            entity.teleportTo(
                "short_circuit:circuit_board", 
                world_set.getDouble('pos_x') ? world_set.getDouble('pos_x') : 1, 
                world_set.getDouble('pos_y') ? world_set.getDouble('pos_y') : 1, 
                world_set.getDouble('pos_z') ? world_set.getDouble('pos_z') : 1, 
                entity.yaw,
                entity.pitch
            )
        } else throw MishapInvalidIota.of(args.get(0), 0, 'class.world_set')
    },

    // 维路
    "world_to": (stack, env) => {
        let args = new Args(stack, 3)
        let entity = args.entity(0)
        let dimension = args.string(1)
        let vec = args.vec3(2)
        let server = env.caster?.server??Utils.server
        let dimensionKeys = server.levelKeys()
        let dimensionNames = []
        dimensionKeys.forEach(key => {
            dimensionNames.push(key.location().toString())
        })
        let namespace = RL(dimension)
        if (!dimensionNames.includes(namespace)) throw MishapInvalidIota.of(args.get(1), 1, 'class.level')
        let level = entity.level.dimension
        let effects = []
        if (level !== "short_circuit:circuit_board") throw MishapInvalidIota.of(args.get(0), 2, 'class.world_to')
        if (dimension !== "short_circuit:circuit_board") {
            effects = [
                OperatorSideEffect.ConsumeMedia(100000)
            ]
        }
        entity.teleportTo(dimension, vec.x(), vec.y(), vec.z(), entity.yaw, entity.pitch)
        return effects
    },

    // 相位
    "dimension": (stack, env) => {
        let args = new Args(stack, 2)
        let entity = args.entity(0)
        let dimension = args.string(1)
        let server = env.caster?.server??Utils.server
        let dimensionKeys = server.levelKeys()
        let dimensionNames = []
        dimensionKeys.forEach(key => {
            dimensionNames.push(key.location().toString())
        })
        let namespace = RL(dimension)
        if (!dimensionNames.includes(namespace)) throw MishapInvalidIota.of(args.get(0), 1, 'class.level')
        entity.teleportTo(dimension, entity.x, entity.y, entity.z, entity.yaw, entity.pitch)
    },

    // 造物
    "artifact": (stack, env) => {
        let player = env.caster
        if (player == null) throw MishapBadCaster()
        if (!player.isPlayer()) throw MishapBadCaster()
        let args = new Args(stack, 2)
        let slot = args.double(0)
        let patterns = args.list(1)
        
        let artifact = player.offHandItem
        if (artifact.isEmpty()) {
            throw MishapBadOffhandItem.of(artifact, 'class.artifact1')
        }
        let media = player.getInventory().getItem(slot)

        let mana = {
            'hexcasting:amethyst_dust': { value: 10000 },
            'minecraft:amethyst_shard': { value: 50000 },
            'hexcasting:charged_amethyst': { value: 100000 }
        }

        if (artifact.id !== "hexcasting:trinket" && artifact.id !== "hexcasting:artifact") {
            throw MishapBadOffhandItem.of(artifact, 'class.artifact1')
        }

        let hexHolder = IXplatAbstractions.INSTANCE.findHexHolder(artifact)
        if (!hexHolder) {
            throw MishapBadOffhandItem.of(artifact, 'class.artifact2')
        }

        let hexmedia = 0
        let nbt = artifact.nbt || {}
        if (nbt["hexcasting:media"] !== undefined) {
            hexmedia = nbt["hexcasting:media"]
        }

        if (media != null && mana[media.id]) {
            let omega = mana[media.id].value * media.count + hexmedia
            hexHolder.writeHex(patterns, env.pigment, omega)
            player.getInventory().setItem(slot, 'minecraft:air')
        } else {
            throw MishapInvalidIota.of(args.get(0), 1, 'class.media')
        }
    },

    // 制作试剂瓶
    "battery": (stack, env) => {
        let player = env.caster
        if (player == null) throw MishapBadCaster()
        if (!player.isPlayer()) throw MishapBadCaster()
        let args = new Args(stack, 1)
        let slot = args.double(0)
        
        let media = player.getInventory().getItem(slot)
        let mana = {
            'hexcasting:amethyst_dust': { value: 10000 },
            'minecraft:amethyst_shard': { value: 50000 },
            'hexcasting:charged_amethyst': { value: 100000 }
        }

        if (media != null && mana[media.id]) {
            let omega = mana[media.id].value * media.count
            let battery = Item.of('hexcasting:battery', {
                    "hexcasting:media": omega,
                    "hexcasting:start_media": omega
                }
            )
            player.getInventory().setItem(slot, battery)
        } else {
            throw MishapInvalidIota.of(args.get(0), 0, 'class.media')
        }
    },

    // 阐述
    "tell": (stack, env) => {
        let args = new Args(stack, 2)
        let entity = args.entity(0)
        let any = args.get(1)
        if (entity.isPlayer()) {
            entity.sendSystemMessage(any.display())
        } else {
            entity.setCustomNameVisible(true)
            entity.customName = any.display()
        }
    },

    //加载
    "chunk": (stack, env) => {
        let args = new Args(stack, 2)
        let blockPos = args.vec3(0)
        let ForceLoad = args.get(1)
        let level = env.world
        let chunkX = Math.floor(blockPos.x() / 16)
        let chunkZ = Math.floor(blockPos.z() / 16)
        if (ForceLoad instanceof BooleanIota) {
            level.chunkSource.updateChunkForced(level.getChunk(chunkX, chunkZ).getPos(), ForceLoad.bool)
        } else if (ForceLoad instanceof NullIota) {
            let bool = level.getChunk(chunkX, chunkZ).getFullStatus()
            if (bool == "FULL") {
                stack.push(BooleanIota(false))
            } else if (bool == "ENTITY_TICKING") {
                stack.push(BooleanIota(true))
            } else {
                stack.push(NullIota())
            }
        } else if (ForceLoad instanceof DoubleIota) {
            let pos = new BlockPos(
                Math.floor(blockPos.x()),
                Math.floor(blockPos.y()),
                Math.floor(blockPos.z())
            )
            let chunk = level.getChunkAt(pos).getPos()
            level.getChunkSource().addRegionTicket(
                TicketType.FORCED,
                chunk,
                ForceLoad,double,
                level.getChunk(chunkX, chunkZ).getPos()
            )
        } else throw MishapInvalidIota.of(args.get(1), 0, 'class.bool_null_num')
    },

    // 交互
    "interaction": (stack, env) => {
        let args = new Args(stack, 1)
        let mode = args.get(0)
        let level = env.world
        let player = env.caster
        if (player == null) throw MishapBadCaster()
        if (!player.isPlayer()) throw MishapBadCaster()
        if (mode instanceof EntityIota) {
            let entity = mode.entity 
            entity.interact(player, InteractionHand.OFF_HAND)
        } else if (mode instanceof Vec3Iota) {
            let vec = mode.vec3
            let blockPos = new BlockPos(Math.floor(vec.x()), Math.floor(vec.y()), Math.floor(vec.z()))
            let BlockHit =  new BlockHitResult(
                vec,
                "up",
                blockPos,
                false
            )
            let blockstate = level.getBlockState(vec)
            let block = blockstate.getBlock()
            block.use(blockstate, level, blockPos, player, InteractionHand.OFF_HAND, BlockHit)
        } else throw MishapInvalidIota.of(args.get(0), 0, 'class.interaction')
    },

    // 使用
    "use": (stack, env) => {
        let args = new Args(stack, 2)
        let slot = args.double(0)
        let mode = args.get(1)
        let level = env.world
        let player = env.caster
        if (player == null) throw MishapBadCaster()
        if (!player.isPlayer()) throw MishapBadCaster()
        let itemstack = player.getInventory().getItem(slot)
        if (mode instanceof Vec3Iota) {
            let vec = mode.vec3
            let blockPos = new BlockPos(Math.floor(vec.x()), Math.floor(vec.y()), Math.floor(vec.z()))
            let BlockHit =  new BlockHitResult(
                vec,
                "up",
                blockPos,
                false
            )
            let Context = new UseOnContext(
                level,
                player,
                InteractionHand.MAIN_HAND,
                itemstack,
                BlockHit
            )
            itemstack.useOn(Context).consumesAction()
        } else if (mode instanceof ListIota && mode.list.list.length == 2) {
            let list = mode.list.list
            let vec = list[0].vec3
            let side = list[0].vec3
            let direction = Direction.getNearest(side.x(), side.y(), side.z())
            let blockPos = new BlockPos(Math.floor(vec.x()), Math.floor(vec.y()), Math.floor(vec.z()))
            let BlockHit =  new BlockHitResult(
                vec,
                direction,
                blockPos,
                false
            )
            let Context = new UseOnContext(
                level,
                player,
                InteractionHand.MAIN_HAND,
                itemstack,
                BlockHit
            )
            itemstack.useOn(Context).consumesAction()
        } else throw MishapInvalidIota.of(args.get(1), 0, 'class.use')
    },

    // 明晰
    "grid": (stack, env) => {
        let args = new Args(stack, 1)
        let num = args.double(0)
        let player = env.caster
        if (player == null) throw MishapBadCaster()
        if (!player.isPlayer()) throw MishapBadCaster()
        player.getAttribute('hexcasting:grid_zoom').setBaseValue(num)
    },

    // 禅定
    "peace": (stack, env) => {
        let server = env.caster?.server??Utils.server
        let data = !server.persistentData.getBoolean('noSpawnEnabled')
        server.persistentData.putBoolean('noSpawnEnabled', data)
    },

    // 视向
    "yaw": (stack, env) => {
        let args = new Args(stack, 2)
        let target = args.entity(0)
        ActionJS.helpers.assertEntityInRange(env, target)
        let vec = args.vec3(1)
        target.lookAt("eyes", vec)
    },

    // 命名
    "name": (stack, env) => {
        let args = new Args(stack, 2)
        let entity = args.entity(0)
        let nameComponent = args.string(1)
        ActionJS.helpers.assertEntityInRange(env, entity)
        if (entity.type === "minecraft:item") {
            let itemStack = entity.getItem()
            itemStack.setHoverName(nameComponent)
        } else if (entity instanceof Mob) {
            entity.customName = nameComponent
            entity.setPersistenceRequired()
        } else throw MishapInvalidIota.of(args.get(0), 1, 'class.name')
    },

    // 示现
    "vex": (stack, env) => {
        let args = new Args(stack, 2)
        let pos = args.vec3(0)
        let num = args.double(1)
        if (num < 0) return
        let level = env.world
        ActionJS.helpers.assertVecInRange(env, pos)
        let allay = level.createEntity('minecraft:allay')
        allay.mergeNbt({
            Health: 1.0,
            NoAI: true,
            PersistenceRequired: false,
            Silent: true,
            Invulnerable: true,
            ForgeData: {
                "hexcasting:brainswept": true
            },
            ActiveEffects: [
                {
                    Id: 14,
                    Duration: -1,
                    Amplifier: 0,
                    ShowParticles: false
                }
            ],
            Attributes: [
                {
                    Name: "minecraft:generic.max_health",
                    Base: 1.0
                }
            ]
        })
        allay.setPos(pos)
        allay.spawn()
        let server = env.caster?.server??Utils.server
        server.scheduleInTicks(1, () => {
            allay.potionEffects.add("minecraft:glowing", -1, 0, false, false)
        })
        server.scheduleInTicks(num, () => {
            allay.remove("killed")
        })
    },

    // 显象
    "eye": (stack, env) => {
        let args = new Args(stack, 2)
        let paramList = args.list(0).list
        let text = args.string(1)
        let player = env.caster
        if (player == null) throw MishapBadCaster()
        if (!player.isPlayer()) throw MishapBadCaster()
        
        let defaults = {
            x: 0,
            y: 80,
            id: null,
            duration: 8,
            scale: 1.5,
            color: 0xCCCCFF
        }
        
        let colorMap = {
            0: 0x000000,
            1: 0xFF0000,
            2: 0xFFA500,
            3: 0xFFFF00,
            4: 0x00FF00,
            5: 0x00FFFF,
            6: 0x0000FF,
            7: 0x800080,
            8: 0xFFFFFF
        }
        
        if (paramList && paramList.length > 0) {
            if (paramList.length > 0 && paramList[0] !== null) {
                let xVal = paramList[0]
                if (xVal.double >= -200 && xVal.double <= 200) {
                    defaults.x = xVal.double
                }
            }
            
            if (paramList.length > 1 && paramList[1] !== null) {
                let yVal = paramList[1]
                if (yVal.double >= -125 && yVal.double <= 125) {
                    defaults.y = yVal.double
                }
            }
            
            if (paramList.length > 2 && paramList[2] !== null) {
                defaults.id = String(paramList[2])
            }
            
            if (paramList.length > 3 && paramList[3] !== null) {
                let durationVal = paramList[3]
                if (durationVal.double > 0) {
                    defaults.duration = durationVal.double
                }
            }
            
            if (paramList.length > 4 && paramList[4] !== null) {
                let scaleVal = paramList[4]
                if (scaleVal.double > 0) {
                    defaults.scale = scaleVal.double
                }
            }
            
            if (paramList.length > 5 && paramList[5] !== null) {
                let colorVal = paramList[5]
                if (colorVal.double !== undefined) {
                    let colorNum = Math.round(colorVal.double)
                    if (colorNum >= 0 && colorNum <= 8) {
                        defaults.color = colorMap[colorNum]
                    }
                }
            }
        }
        
        if (!defaults.id) {
            defaults.id = 'eye_' + Date.now() + '_' + Math.floor(Math.random() * 1000)
        }
        
        let DX = defaults.x
        let DY = defaults.y
        let DC = defaults.color
        let DS = defaults.scale
        let DI = defaults.id
        let DT = Math.floor(defaults.duration * 20)
        
        let paintObj = {}
        
        paintObj[DI] = {
            type: 'text',
            text: text,
            x: DX,
            y: DY,
            alignX: 'center',
            color: DC,
            scale: DS,
            draw: 'always'
        }
        
        player.paint(paintObj)

        player.server.scheduleInTicks(DT, () => {
            let removeObj = {}
            removeObj[DI] = { remove: true }
            player.paint(removeObj)
        })
    },

// ==== meta ====

    // 狄俄尼索斯之策略
    "forever": (stack, env, img) => {
        let player = env.caster
        if (player == null) throw MishapBadCaster()
        if (!player.isPlayer()) throw MishapBadCaster()
        let size = img.getStack().size()
        if (size < 1) throw MishapNotEnoughArgs(1, size)
        let pre_first = img.getStack().get(size - 1)
        if (pre_first instanceof NullIota) {
            let args = new Args(stack, 1)
            let FOR = global.ForLoopTasks
            let list = []
            for (let [id] of FOR) {
                list.push(StringIota.makeUnchecked(id))
            }
            stack.push(ListIota(list))
        } else if (pre_first instanceof StringIota || pre_first instanceof DoubleIota) {
            if (size < 2) throw MishapNotEnoughArgs(2, size)
            let pre_second = img.getStack().get(size - 2)
            if (pre_second instanceof BooleanIota && pre_second.bool) {
                let args = new Args(stack, 3)
                let code = args.list(0)
                let id = args.string(2)
                let uuid = player.uuid
                let FOR = global.ForLoopTasks
                FOR.set(id, { playerId: uuid, code: code, stopped: false, img: img.userData})
            } else if (pre_second instanceof BooleanIota && !pre_second.bool) {
                let args = new Args(stack, 2)
                let sid = args.string(1)
                let FOR = global.ForLoopTasks
                for (let [id] of FOR) {
                    if (id == sid) {
                        FOR.get(id).stopped = true
                    }
                }
            } else if (pre_second instanceof NullIota) {
                let args = new Args(stack, 2)
                let sid = args.string(1)
                let FOR = global.ForLoopTasks
                for (let [id] of FOR) {
                    if (id == sid) {
                        stack.push(BooleanIota(true))
                        return
                    }
                }
                stack.push(BooleanIota(false))
            } else if (pre_second instanceof ListIota) {
                let args = new Args(stack, 2)
                let code = args.list(0)
                let num = args.double(1)
                let executions = 0
                let server = env.caster?.server??Utils.server
                let staffEnv = new StaffCastEnv(player, InteractionHand.MAIN_HAND)
                let silencedEnv = SilencedCastingEnv.Companion.from(staffEnv)
                let executeLoop = () => {
                    if (executions >= num) return
                    let harness = CastingVM.empty(silencedEnv)
                    harness.queueExecuteAndWrapIotas(code, env.world)
                    server.scheduleInTicks(1, executeLoop)
                    executions++
                }
                executeLoop()
            } else throw MishapInvalidIota.of(pre_second, 1, 'class.bool_null_list') 
        } else throw MishapInvalidIota.of(pre_first, 0, 'class.null_str_double') 
    },

    // 匝格瑞俄斯之策略
    "event": (stack, env, img) => {
        let player = env.caster
        if (!player) throw MishapBadCaster()
        if (!player.isPlayer()) throw MishapBadCaster()
        let size = img.getStack().size()
        if (size < 2) throw MishapNotEnoughArgs(2, size)
        let pre_first = img.getStack().get(size - 1)
        let pre_second = img.getStack().get(size - 2)
        let pre_third = 0
        if (pre_second instanceof StringIota) {
            if (size < 3) throw MishapNotEnoughArgs(3, size)
            if (!(pre_first instanceof DoubleIota)) throw MishapInvalidIota.of(img.getStack().get(size - 1), 0, 'class.pre_event1')
            pre_third = img.getStack().get(size - 3)
        } else if (pre_second instanceof DoubleIota) {
            if (!(pre_first instanceof BooleanIota) && !(pre_first instanceof NullIota) && !(pre_first instanceof StringIota)) throw MishapInvalidIota.of(pre_first, 0, 'class.pre_event2')
        } else throw MishapInvalidIota.of(pre_second, 1, 'class.num_str')
        if (pre_third instanceof ListIota && pre_second instanceof StringIota && pre_first instanceof DoubleIota) {
            let pre_en = pre_first.double
            if (pre_en == 1 || pre_en == 2 || pre_en == 3 || pre_en == 4) {
                let args = new Args(stack, 3)
                let event = args.double(2)
                let spell = IotaType.serialize(args.get(0))
                let idoub = args.string(1)
                let HexEvent = new CompoundTag()
                    HexEvent.put('spell', spell)
                    HexEvent.put('enabled', true)
                    let eventKey = 'HexEvent_' + event
                    let EventHex = player.persistentData.getCompound(eventKey)
                    EventHex.put(idoub, HexEvent)
                    player.persistentData.put(eventKey, EventHex)
            } else if (pre_en == 5 || pre_en == 6 || pre_en == 7 || pre_en == 8) {
                let args = new Args(stack, 4)
                let event = args.double(3)
                let condition_0 = args.get(0)
                let spell = IotaType.serialize(args.get(1))
                let idoub = args.string(2)
                if (condition_0 instanceof NullIota) {
                    condition_0 = "null"
                } else if (condition_0 instanceof StringIota) {
                    condition_0 = condition_0.string
                } else throw MishapInvalidIota.of(args.get(0), 3, 'class.null_str')
                let HexEvent = new CompoundTag()
                    HexEvent.put('condition_0', condition_0)
                    HexEvent.put('spell', spell)
                    HexEvent.put('enabled', true)
                    let eventKey = 'HexEvent_' + event
                    let EventHex = player.persistentData.getCompound(eventKey)
                    EventHex.put(idoub, HexEvent)
                    player.persistentData.put(eventKey, EventHex)
            } else if (pre_en == 9 || pre_en == 10 || pre_en == 11) {
                let args = new Args(stack, 5)
                let event = args.double(4)
                let condition_0 = args.get(0)
                let condition_1 = args.get(1)
                let spell = IotaType.serialize(args.get(2))
                let idoub = args.string(3)
                if (condition_0 instanceof NullIota) {
                    condition_0 = "null"
                } else if (condition_0 instanceof StringIota) {
                    condition_0 = condition_0.string
                } else throw MishapInvalidIota.of(args.get(0), 4, 'class.null_str')
                if (condition_1 instanceof NullIota) {
                    condition_1 = "null"
                } else if (condition_1 instanceof StringIota) {
                    condition_1 = condition_1.string
                } else throw MishapInvalidIota.of(args.get(1), 3, 'class.null_str')
                let HexEvent = new CompoundTag()
                    HexEvent.put('condition_0', condition_0)
                    HexEvent.put('condition_1', condition_1)
                    HexEvent.put('spell', spell)
                    HexEvent.put('enabled', true)
                    let eventKey = 'HexEvent_' + event
                    let EventHex = player.persistentData.getCompound(eventKey)
                    EventHex.put(idoub, HexEvent)
                    player.persistentData.put(eventKey, EventHex)
            } else if (pre_en == 12 || pre_en == 13 || pre_en == 14) {
                let args = new Args(stack, 6)
                let event = args.double(5)
                let condition_0 = args.get(0)
                let condition_1 = args.get(1)
                let condition_2 = args.get(2)
                let spell = IotaType.serialize(args.get(3))
                let idoub = args.string(4)
                if (condition_0 instanceof NullIota) {
                    condition_0 = "null"
                } else if (condition_0 instanceof StringIota) {
                    condition_0 = condition_0.string
                } else throw MishapInvalidIota.of(args.get(0), 5, 'class.null_str')
                if (condition_1 instanceof NullIota) {
                    condition_1 = "null"
                } else if (condition_1 instanceof StringIota) {
                    condition_1 = condition_1.string
                } else throw MishapInvalidIota.of(args.get(1), 4, 'class.null_str')
                if (condition_2 instanceof NullIota) {
                    condition_2 = "null"
                } else if (condition_2 instanceof StringIota) {
                    condition_2 = condition_2.string
                } else throw MishapInvalidIota.of(args.get(2), 3, 'class.null_str')
                let HexEvent = new CompoundTag()
                    HexEvent.put('condition_0', condition_0)
                    HexEvent.put('condition_1', condition_1)
                    HexEvent.put('condition_2', condition_2)
                    HexEvent.put('spell', spell)
                    HexEvent.put('enabled', true)
                    let eventKey = 'HexEvent_' + event
                    let EventHex = player.persistentData.getCompound(eventKey)
                    EventHex.put(idoub, HexEvent)
                    player.persistentData.put(eventKey, EventHex)
            }
        } else if (pre_third instanceof BooleanIota && pre_second instanceof StringIota && pre_first instanceof DoubleIota) {
            let args = new Args(stack, 3)
            let enabled = args.bool(0)
            let idoub = args.string(1)
            let event = args.double(2)
            let eventKey = 'HexEvent_' + event
            if (player.persistentData.contains(eventKey)) {
                let eventData = player.persistentData.getCompound(eventKey)
                if (eventData.contains(idoub)) {
                    let subCompound = eventData.getCompound(idoub)
                    subCompound.putBoolean('enabled', enabled)
                    eventData.put(idoub, subCompound)
                    player.persistentData.put(eventKey, eventData)
                }
            }
        } else if (pre_third instanceof NullIota && pre_second instanceof StringIota && pre_first instanceof DoubleIota) {
            let args = new Args(stack, 3)
            let idoub = args.string(1)
            let event = args.double(2)
            let eventKey = 'HexEvent_' + event
            if (player.persistentData.contains(eventKey)) {
                let eventData = player.persistentData.getCompound(eventKey)
                if (eventData.contains(idoub)) {
                    eventData.remove(idoub)
                    player.persistentData.put(eventKey, eventData)
                }
            }
        } else if (pre_second instanceof DoubleIota && pre_first instanceof BooleanIota) {
            let args = new Args(stack, 2)
            let event = args.double(0)
            let enabled = args.bool(1)
            let eventKey = 'HexEvent_' + event
            let idList = []
            if (player.persistentData.contains(eventKey)) {
                let eventData = player.persistentData.getCompound(eventKey)
                let keys = eventData.getAllKeys()
                for (let key of keys) {
                    let subCompound = eventData.getCompound(key)
                    if (subCompound.contains('enabled') && subCompound.getBoolean('enabled') === enabled) {
                        idList.push(StringIota.makeUnchecked(key))
                    }
                }
            }
            stack.push(ListIota(idList))
        } else if (pre_second instanceof DoubleIota && pre_first instanceof NullIota) {
            let args = new Args(stack, 2)
            let event = args.double(0)
            let eventKey = 'HexEvent_' + event
            let idList = []
            if (player.persistentData.contains(eventKey)) {
                let eventData = player.persistentData.getCompound(eventKey)
                let keys = eventData.getAllKeys()
                for (let key of keys) {
                    idList.push(StringIota.makeUnchecked(key))
                }
            }
            stack.push(ListIota(idList))
        } else if (pre_second instanceof DoubleIota && pre_first instanceof StringIota) {
            let args = new Args(stack, 2)
            let event = args.double(0)
            let id = args.string(1)
            let eventKey = 'HexEvent_' + event
            if (player.persistentData.contains(eventKey)) {
                let eventData = player.persistentData.getCompound(eventKey)
                if (eventData.contains(id)) {
                    let subCompound = eventData.getCompound(id)
                    if (subCompound.contains('spell')) {
                        let spell = subCompound.getCompound('spell')
                        stack.push(IotaType.deserialize(spell, env.world))
                    }
                }
            }
        }
    },

    // 厄科之策略
    "echo": (stack, env, img, cont) => {
        let args = new Args(stack, 2)
        let iota = args.list(0)
        let num = args.double(1)
        if (num < 1 || !Number.isInteger(num)) throw MishapInvalidIota.of(args.get(1), 0, 'class.zero')
        let evaluatable = args.get(0)
        let instrs = OperatorUtils.evaluatable(evaluatable, 0)
        let newCont = cont
            if (instrs.left().isPresent || (cont instanceof SpellContinuation.NotDone && cont.frame instanceof FrameFinishEval)) {
                newCont = cont
            } else {
                newCont = cont.pushFrame(FrameFinishEval)
            }
        for (let i = 0; i < num; i++) {
            let frame = FrameEvaluate(iota, true)
            newCont = newCont.pushFrame(frame)
        }
        return {
            newCont: newCont,
            sideEffects: [],
            opsConsumed: img.opsConsumed + 1,
            newData: img.copy(
                stack,
                img.parenCount,
                img.parenthesized,
                img.escapeNext,
                img.opsConsumed + 1,
                img.userData
            )
        }
    },

    // 伊西斯之策略
    "isis": (stack, env, img, cont) => {
        stack.push(ContinuationIota(cont))
    },

    // 厄洛斯之策略
    "key": (stack, env, img) => {
        let player = env.caster
        if (!player) throw MishapBadCaster()
        if (!player.isPlayer()) throw MishapBadCaster()
        let args = new Args(stack, 1)
        let spell = args.get(0)
        
        let bindingData = new CompoundTag()
        bindingData.put('image', img.userData)
        bindingData.put('spell', IotaType.serialize(spell))

        let bindings = player.persistentData.getCompound('hex_key')
        bindings.put('G_key', bindingData)
        player.persistentData.put('hex_key', bindings)
    },

    // 赫柏之策略
    "depth": (stack, env, img) => {
        return { opsConsumed: 0 }
    },

    //卡厄斯之策略
    "otherworld": (stack, env, img, cont) => {
        while (cont.next) cont = cont.next
        let holder = ListIota([ContinuationIota(cont)])
        global.setField(holder, 'size', Integer('-1024'))
        stack.push(holder)
    },

    // 修普诺斯之策略
    "time": (stack, env, img) => {
        let args = new Args(stack, 2)
        let code = args.list(0)
        let timeout = args.double(1)
        let server = env.caster?.server??Utils.server
        let executor = () => {
            let Env = env
            if (env instanceof PlayerBasedCastEnv) {
                Env = new StaffCastEnv(env.caster, InteractionHand.MAIN_HAND)
            }
            let harness = CastingVM.empty(Env)
            let Tag = new CompoundTag()
            Tag.put("userdata", img.userData)
            let image = harness.image.loadFromNbt(Tag, env.world)
            harness.setImage(image)
            harness.queueExecuteAndWrapIotas(code, env.world)
        }
        if (timeout <= 0) {
            executor()
            return
        }
        server.scheduleInTicks(timeout, () => {
            executor()
        })
    },

// ==== read_and_write ====

    // 入栈之策略
    "stack/push": (stack, env) => {
        let args = new Args(stack, 1)
        let player = env.caster
        if (player == null) throw MishapBadCaster()
        if (!player.isPlayer()) throw MishapBadCaster()
        let img = IXplatAbstractions.INSTANCE.getStaffcastVM(player, env.castingHand).image
        img.stack.add(args.get(0))
        IXplatAbstractions.INSTANCE.setStaffcastImage(player, img)
    },

    // 出栈之策略
    'stack/pop': (stack, ctx) => {
        let player = env.caster
        if (player == null) throw MishapBadCaster()
        if (!player.isPlayer()) throw MishapBadCaster()
        let img = IXplatAbstractions.INSTANCE.getStaffcastVM(player, ctx.castingHand).image
        let removeIdx = img.stack.length - 1
        if (removeIdx < 0) throw MishapNotEnoughArgs(1, 0)
        stack.push(img.stack.remove(img.stack.length - 1))
        IXplatAbstractions.INSTANCE.setStaffcastImage(player, img)
    },

    // 信笔之精思
    "read_str": (stack, env) => {
        let player = env.caster
        if (player == null) throw MishapBadCaster()
        if (!player.isPlayer()) throw MishapBadCaster()
        let book = player.offHandItem
        if (book.isEmpty() || book.id != "minecraft:writable_book") {
            stack.push(NullIota())
            return
        }
        let nbt = book.nbt
        if (!nbt || !nbt.pages || nbt.pages.length === 0) {
            stack.push(NullIota())
            return
        }
        let pageContent = nbt.pages[0]
        if (!pageContent || pageContent.trim() === "") {
            stack.push(NullIota())
            return
        }
        stack.push(StringIota.makeUnchecked(pageContent));
    },

    // 信笔之策略
    "write_str": (stack, env) => {
        let player = env.caster
        if (player == null) throw MishapBadCaster()
        if (!player.isPlayer()) throw MishapBadCaster()
        let args = new Args(stack, 1)
        let str = args.string(0)
        let string = String(str)
        let book = player.offHandItem
        if (book.isEmpty() || book.id != "minecraft:writable_book") return
        let newBookNBT = {
            pages: [
                string
            ]
        }
        let newBook = Item.of('minecraft:writable_book', newBookNBT)
        player.offHandItem = newBook
    },

    // 数读之纯化
    "num_read": (stack, env) => {
        let player = env.caster
        if (player == null) throw MishapBadCaster()
        if (!player.isPlayer()) throw MishapBadCaster()
        let args = new Args(stack, 1)
        let num = args.double(0)
        let hotbarStack = player.getInventory().getItem(num)
        if (hotbarStack.isEmpty()) {
            stack.push(NullIota())
            return
        }
        let dataHolder = IXplatAbstractions.INSTANCE.findDataHolder(hotbarStack)
        if (!dataHolder) {
            stack.push(NullIota())
            return
        }
        let iota = dataHolder.readIota(env.world)
        if (iota) {
            stack.push(iota);
        } else {
            stack.push(NullIota())
        }
    },

    // 数写之纯化
    "num_write": (stack, env) => {
        let player = env.caster
        if (player == null) throw MishapBadCaster()
        if (!player.isPlayer()) throw MishapBadCaster()
        let args = new Args(stack, 2)
        let any = args.get(0)
        let num = args.double(1)
        let hotbarStack = player.getInventory().getItem(num)
        if (hotbarStack.isEmpty()) return
        
        let dataHolder = IXplatAbstractions.INSTANCE.findDataHolder(hotbarStack)
        if (!dataHolder) return
        
        dataHolder.writeIota(any, false)
    },

    // 博尔颂之策略
    "id_write": (stack, env, img) => {
        let args = new Args(stack, 2)
        let id = args.double(0)
        let iota = args.get(1)
        let userData = img.userData
        let localBindings
        if (userData.contains("local_bindings")) {
            localBindings = userData.getCompound("local_bindings")
        } else {
            localBindings = new CompoundTag()
        }
        let serializedTag = IotaType.serialize(iota)
        let bindingData = new CompoundTag()
        bindingData.put("iota", serializedTag)
        localBindings.put(id, bindingData)
        userData.put("local_bindings", localBindings)
    },

    // 密米尔之纯化
    "id_read": (stack, env, img) => {
        let args = new Args(stack, 1)
        let id = args.double(0)
        let userData = img.userData
        if (!userData.contains("local_bindings")) {
            stack.push(NullIota())
            return
        }
        let localBindings = userData.getCompound("local_bindings")
        if (!localBindings.contains(id)) {
            stack.push(NullIota())
            return
        }
        let bindingData = localBindings.getCompound(id)
        let iotaTag = bindingData.getCompound("iota")
        let level = env.world
        let iota = IotaType.deserialize(iotaTag, level)
        stack.push(iota)
    },

    // 克洛托之策略
    "let_in": (stack, env) => {
        let args = new Args(stack, 2)
        let iota = args.get(0)
        let id = args.get(1)
        let server = env.caster?.server??Utils.server
        let idStr
        if (id instanceof DoubleIota) {
            idStr = id.double.toString()
        } else if (id instanceof StringIota) {
            idStr = id.getString()
        } else throw MishapInvalidIota.of(args.get(1), 0, 'class.num_str')
        if (iota instanceof NullIota) {
            let bindings = server.persistentData.getCompound('hex_let')
            bindings.remove(idStr)
            return
        }
        let serializedTag = IotaType.serialize(iota)
        let bindingData = new CompoundTag()
        bindingData.put('iota', serializedTag)
        bindingData.putString('count', 'infinite')
        let bindings = server.persistentData.getCompound('hex_let')
        bindings.put(idStr, bindingData)
        server.persistentData.put('hex_let', bindings)
    },

    // 拉克西丝之馏化
    "let_read": (stack, env) => {
        let args = new Args(stack, 2)
        let id = args.get(0)
        let num = args.double(1)
        let server = env.caster?.server??Utils.server
        if (num < 1 || !Number.isInteger(num)) throw MishapInvalidIota.of(args.get(1), 0, 'class.zero')
        let idStr
        if (id instanceof DoubleIota) {
            idStr = id.double.toString()
        } else if (id instanceof StringIota) {
            idStr = id.getString()
        } else throw MishapInvalidIota.of(args.get(0), 1, 'class.num_str')
        let bindings = server.persistentData.getCompound('hex_let')
        if (!bindings.contains(idStr)) {
            stack.push(NullIota())
            return
        }
        let bindingData = bindings.getCompound(idStr)
        let countType = bindingData.getString('count')
        if (countType === 'infinite') {
            bindingData.putDouble('count', num)
            bindings.put(idStr, bindingData)
            server.persistentData.put('hex_let', bindings)
            stack.push(DoubleIota(num))
            return
        }
        let currentCount = bindingData.getDouble('count')
        let newCount = currentCount + num
        bindingData.putDouble('count', newCount)
        bindings.put(idStr, bindingData)
        server.persistentData.put('hex_let', bindings)
        stack.push(DoubleIota(newCount))
    },

    // 阿特洛波斯之纯化
    "let_out": (stack, env) => {
        let args = new Args(stack, 1)
        let id = args.get(0)
        let server = env.caster?.server??Utils.server
        let level = env.world
        let idStr
        if (id instanceof DoubleIota) {
            idStr = id.double.toString()
        } else if (id instanceof StringIota) {
            idStr = id.getString()
        } else {
            throw MishapInvalidIota.of(args.get(0), 0, 'class.num_str')
        }
        let bindings = server.persistentData.getCompound('hex_let')
        if (!bindings.contains(idStr)) {
            stack.push(NullIota())
            return
        }
        let bindingData = bindings.getCompound(idStr)
        let countType = bindingData.getString('count')
        if (countType === 'infinite') {
            let iotaTag = bindingData.getCompound('iota')
            let iota = IotaType.deserialize(iotaTag, level)
            stack.push(iota)
            return
        }
        let currentCount = bindingData.getDouble('count')
        let newCount = currentCount - 1
        if (newCount <= 0) {
            bindings.remove(idStr)
        } else {
            bindingData.putDouble('count', newCount)
            bindings.put(idStr, bindingData)
        }
        server.persistentData.put('hex_let', bindings)
        let iotaTag = bindingData.getCompound('iota')
        let iota = IotaType.deserialize(iotaTag, level)
        stack.push(iota)
    },

    // 唯识
    "ever_read": (stack, env) => {
        let args = new Args(stack, 1)
        let key = args.pattern(0)
        let iota = HexalIXplatAbstractions.INSTANCE.getEverbookIota(env.caster, key)
        stack.push(iota)
    },

    // 我执
    "ever_write": (stack, env) => {
        let args = new Args(stack, 2)
        let key = args.pattern(0)
        let any = args.get(1)
        HexalIXplatAbstractions.INSTANCE.setEverbookIota(env.caster, key, any)
    },

    // 忘川
    "ever_dele": (stack, env) => {
        let args = new Args(stack, 1)
        let key = args.pattern(0)
        HexalIXplatAbstractions.INSTANCE.removeEverbookIota(env.caster, key)
    },

    // 秋水
    "ever_meta": (stack, env) => {
        let args = new Args(stack, 1)
        let key = args.pattern(0)
        HexalIXplatAbstractions.INSTANCE.toggleEverbookMacro(env.caster, key)
    },

// ==== stack ====

    "16": (stack, env) => {
        stack.push(DoubleIota(16))
    },
    "32": (stack, env) => {
        stack.push(DoubleIota(32))
    },
    "64": (stack, env) => {
        stack.push(DoubleIota(64))
    },
    "128": (stack, env) => {
        stack.push(DoubleIota(128))
    },
    "256": (stack, env) => {
        stack.push(DoubleIota(256))
    },
    "512": (stack, env) => {
        stack.push(DoubleIota(512))
    },
    "1024": (stack, env) => {
        stack.push(DoubleIota(1024))
    },

    // 限有之精思
    "stack/size": (stack, env, img) => {
        stack.push(DoubleIota(img.stack.length))
    },

    // 实存之精思
    "stack/all_size": (stack, env, img) => {
        let totalSize = 0
        let size = img.stack.length
        for (let i = 0; i < size; i++) {
            let iota = img.stack[i]
            totalSize += iota.size()
        }
        stack.push(DoubleIota(totalSize))
    },

    // 手性之精思
    "get_hand": (stack, env) => {
        let hand = env.getCastingHand()
        stack.push(BooleanIota(hand == InteractionHand.MAIN_HAND))
    },

    // 物性之精思
    "get_hand_slot": (stack, env) => {
        let player = env.caster
        if (player == null) throw MishapBadCaster()
        if (!player.isPlayer()) throw MishapBadCaster()
        let hand = player.selectedSlot
        stack.push(DoubleIota(hand))
    },

    // 媒质之精思
    "get_max_media": (stack, env) => {
        let media = 2147483647 - env.extractMedia(2147483647, true)
        stack.push(DoubleIota(media))
    },

    // 干涉之纯化
    "range": (stack, env) => {
        let args = new Args(stack, 1)
        let range = args.get(0)
        if (range instanceof Vec3Iota) {
            stack.push(
                BooleanIota(
                    env.isVecInAmbit(range.vec3)
                )
            )
        } else if (range instanceof EntityIota) {
            stack.push(
                BooleanIota(
                    env.isEntityInRange(range.entity)
                )
            )
        } else throw MishapInvalidIota.of(args.get(0), 0, 'class.world_set')
    },

    // 制图之馏化
    "exhaustive": (stack, env) => {
        let args = new Args(stack, 2)
        let pattern = args.pattern(0)
        let num = args.double(1)
        stack.push(PatternIota(EulerPathFinder.findAltDrawing(pattern, num)))
    },

    // 潜行之纯化
    "shift": (stack, env) => {
        let args = new Args(stack, 1)
        let player = args.entity(0)
        if (!player.isPlayer()) throw MishapBadCaster()
        stack.push(BooleanIota(player.isCrouching()))
    },

    // 射线之提整
    "ray_block": (stack, env) => {
        let args = new Args(stack, 3)
        let startPos = args.vec3(0)
        let secondVec = args.vec3(1)
        let isDirection = args.bool(2)

        let dirVec
        if (isDirection) {
            dirVec = secondVec
        } else {
            dirVec = new Vec3d(
                secondVec.x() - startPos.x(),
                secondVec.y() - startPos.y(),
                secondVec.z() - startPos.z()
            )
        }

        let dirMagnitude = Math.sqrt(dirVec.x() * dirVec.x() + dirVec.y() * dirVec.y() + dirVec.z() * dirVec.z())

        if (isDirection && dirMagnitude < 0.0001) throw MishapInvalidIota.of(args.get(1), 1, 'class.zero_vec')

        if (!isDirection && dirMagnitude < 1e-10) {
            let startBlock = new BlockPos(
                Math.floor(startPos.x() + 1e-10),
                Math.floor(startPos.y() + 1e-10),
                Math.floor(startPos.z() + 1e-10)
            )
            stack.push(ListIota([Vec3Iota(startBlock)]))
            return
        }

        let unitDir = new Vec3d(
            dirVec.x() / dirMagnitude,
            dirVec.y() / dirMagnitude,
            dirVec.z() / dirMagnitude
        )

        let startBlock = new BlockPos(
            Math.floor(startPos.x() + 1e-10),
            Math.floor(startPos.y() + 1e-10),
            Math.floor(startPos.z() + 1e-10)
        )

        let blocks = []
        blocks.push(Vec3Iota(startBlock))
        let currentBlock = startBlock
        let count = 1

        let targetCount = null
        let targetBlockPos = null
        if (isDirection) {
            targetCount = Math.round(dirMagnitude)
            if (targetCount <= 0) {
                stack.push(ListIota([]))
                return
            }
            if (targetCount === 1) {
                stack.push(ListIota(blocks))
                return
            }
        } else {
            targetBlockPos = new BlockPos(
                Math.floor(secondVec.x() + 1e-10),
                Math.floor(secondVec.y() + 1e-10),
                Math.floor(secondVec.z() + 1e-10)
            )
        }

        let stepX = unitDir.x() > 0 ? 1 : (unitDir.x() < 0 ? -1 : 0)
        let stepY = unitDir.y() > 0 ? 1 : (unitDir.y() < 0 ? -1 : 0)
        let stepZ = unitDir.z() > 0 ? 1 : (unitDir.z() < 0 ? -1 : 0)

        let tMaxX, tMaxY, tMaxZ
        if (stepX !== 0) {
            let nextBoundary = stepX > 0 ? Math.floor(startPos.x()) + 1 : Math.floor(startPos.x())
            tMaxX = (nextBoundary - startPos.x()) / unitDir.x()
        } else {
            tMaxX = Infinity
        }
        if (stepY !== 0) {
            let nextBoundary = stepY > 0 ? Math.floor(startPos.y()) + 1 : Math.floor(startPos.y())
            tMaxY = (nextBoundary - startPos.y()) / unitDir.y()
        } else {
            tMaxY = Infinity
        }
        if (stepZ !== 0) {
            let nextBoundary = stepZ > 0 ? Math.floor(startPos.z()) + 1 : Math.floor(startPos.z())
            tMaxZ = (nextBoundary - startPos.z()) / unitDir.z()
        } else {
            tMaxZ = Infinity
        }

        let tDeltaX = stepX !== 0 ? Math.abs(1 / unitDir.x()) : Infinity
        let tDeltaY = stepY !== 0 ? Math.abs(1 / unitDir.y()) : Infinity
        let tDeltaZ = stepZ !== 0 ? Math.abs(1 / unitDir.z()) : Infinity

        let t = 0
        let iter = 0
        const maxIter = 1024

        while (iter < maxIter) {
            iter++

            let axis
            if (tMaxX <= tMaxY && tMaxX <= tMaxZ) {
                axis = 'x'
                t = tMaxX
                tMaxX += tDeltaX
            } else if (tMaxY <= tMaxX && tMaxY <= tMaxZ) {
                axis = 'y'
                t = tMaxY
                tMaxY += tDeltaY
            } else {
                axis = 'z'
                t = tMaxZ
                tMaxZ += tDeltaZ
            }

            if (t > dirMagnitude + 1e-10) break

            if (axis === 'x') {
                currentBlock = new BlockPos(currentBlock.getX() + stepX, currentBlock.getY(), currentBlock.getZ())
            } else if (axis === 'y') {
                currentBlock = new BlockPos(currentBlock.getX(), currentBlock.getY() + stepY, currentBlock.getZ())
            } else {
                currentBlock = new BlockPos(currentBlock.getX(), currentBlock.getY(), currentBlock.getZ() + stepZ)
            }

            blocks.push(Vec3Iota(currentBlock))
            count++

            if (isDirection && count >= targetCount) break
            if (!isDirection && currentBlock.equals(targetBlockPos)) {
                reachedTarget = true
                break
            }
        }

        stack.push(ListIota(blocks))
    },

    // 光圈之提整
    "circle_block": (stack, env) => {
        let args = new Args(stack, 3)
        let center = args.vec3(0)
        let radius = args.double(1)
        let isSolid = args.bool(2)
        
        if (radius < 1 || !Number.isInteger(radius)) throw MishapInvalidIota.of(args.get(1), 1, 'class.zero')
        
        let minX = Math.floor(center.x() - radius - 1)
        let maxX = Math.floor(center.x() + radius + 1)
        let minY = Math.floor(center.y() - radius - 1)
        let maxY = Math.floor(center.y() + radius + 1)
        let minZ = Math.floor(center.z() - radius - 1)
        let maxZ = Math.floor(center.z() + radius + 1)
        
        let blockPositions = []
        for (let x = minX; x <= maxX; x++) {
            for (let y = minY; y <= maxY; y++) {
                for (let z = minZ; z <= maxZ; z++) {
                    let blockCenter = new Vec3d(x + 0.5, y + 0.5, z + 0.5)
                    
                    let distance = blockCenter.distanceTo(center)
                    
                    if (isSolid) {
                        if (distance <= radius) {
                            blockPositions.push(Vec3Iota(blockCenter))
                        }
                    } else {
                        if (distance >= radius - 0.5 && distance <= radius + 0.5) {
                            blockPositions.push(Vec3Iota(blockCenter))
                        }
                    }
                }
            }
        }
        stack.push(ListIota(blockPositions))
    },

    // 合焦之提整
    "square_block": (stack, env) => {
        let args = new Args(stack, 3)
        let center = args.vec3(0)
        let sideLength = args.double(1)
        let mode = args.get(2)
        if (mode instanceof BooleanIota) {
            mode = mode.bool
        } else if (mode instanceof NullIota) {
            mode = null
        } else throw MishapInvalidIota.of(args.get(2), 0, 'class.bool_null')
        
        if (sideLength < 1 || !Number.isInteger(sideLength)) throw MishapInvalidIota.of(args.get(1), 1, 'class.zero')

        let halfSide = sideLength
        let minX = center.x() - halfSide
        let maxX = center.x() + halfSide
        let minY = center.y() - halfSide
        let maxY = center.y() + halfSide
        let minZ = center.z() - halfSide
        let maxZ = center.z() + halfSide
        
        let blockPositions = []
        
        let minBlockX = Math.floor(minX)
        let maxBlockX = Math.floor(maxX)
        let minBlockY = Math.floor(minY)
        let maxBlockY = Math.floor(maxY)
        let minBlockZ = Math.floor(minZ)
        let maxBlockZ = Math.floor(maxZ)
        
        for (let x = minBlockX; x <= maxBlockX; x++) {
            for (let y = minBlockY; y <= maxBlockY; y++) {
                for (let z = minBlockZ; z <= maxBlockZ; z++) {
                    let blockCenter = new Vec3d(x + 0.5, y + 0.5, z + 0.5)
                    
                    if (mode) {
                        blockPositions.push(Vec3Iota(blockCenter))
                    } else if (mode) {
                        let onSurface = 
                            Math.abs(blockCenter.x() - minX) < 0.5 || 
                            Math.abs(blockCenter.x() - maxX) < 0.5 ||
                            Math.abs(blockCenter.y() - minY) < 0.5 || 
                            Math.abs(blockCenter.y() - maxY) < 0.5 ||
                            Math.abs(blockCenter.z() - minZ) < 0.5 || 
                            Math.abs(blockCenter.z() - maxZ) < 0.5
                        
                        if (onSurface) {
                            blockPositions.push(Vec3Iota(blockCenter))
                        }
                    } else if (mode === null) {
                        let onEdge = 
                            (Math.abs(blockCenter.x() - minX) < 0.5 && 
                            Math.abs(blockCenter.y() - minY) < 0.5) ||
                            (Math.abs(blockCenter.x() - minX) < 0.5 && 
                            Math.abs(blockCenter.y() - maxY) < 0.5) ||
                            (Math.abs(blockCenter.x() - minX) < 0.5 && 
                            Math.abs(blockCenter.z() - minZ) < 0.5) ||
                            (Math.abs(blockCenter.x() - minX) < 0.5 && 
                            Math.abs(blockCenter.z() - maxZ) < 0.5) ||
                            (Math.abs(blockCenter.x() - maxX) < 0.5 && 
                            Math.abs(blockCenter.y() - minY) < 0.5) ||
                            (Math.abs(blockCenter.x() - maxX) < 0.5 && 
                            Math.abs(blockCenter.y() - maxY) < 0.5) ||
                            (Math.abs(blockCenter.x() - maxX) < 0.5 && 
                            Math.abs(blockCenter.z() - minZ) < 0.5) ||
                            (Math.abs(blockCenter.x() - maxX) < 0.5 && 
                            Math.abs(blockCenter.z() - maxZ) < 0.5) ||
                            (Math.abs(blockCenter.y() - minY) < 0.5 && 
                            Math.abs(blockCenter.z() - minZ) < 0.5) ||
                            (Math.abs(blockCenter.y() - minY) < 0.5 && 
                            Math.abs(blockCenter.z() - maxZ) < 0.5) ||
                            (Math.abs(blockCenter.y() - maxY) < 0.5 && 
                            Math.abs(blockCenter.z() - minZ) < 0.5) ||
                            (Math.abs(blockCenter.y() - maxY) < 0.5 && 
                            Math.abs(blockCenter.z() - maxZ) < 0.5)
                        
                        if (onEdge) {
                            blockPositions.push(Vec3Iota(blockCenter))
                        }
                    }
                }
            }
        }
        
        stack.push(ListIota(blockPositions))
    },

    // 对焦之提整
    "rectangle_block": (stack, env) => {
        let args = new Args(stack, 3)
        let pos1 = args.vec3(0)
        let pos2 = args.vec3(1)
        let mode = args.get(2)
        if (mode instanceof BooleanIota) {
            mode = mode.bool
        } else if (mode instanceof NullIota) {
            mode = null
        } else throw MishapInvalidIota.of(args.get(2), 0, 'class.bool_null')
        
        let minX = Math.min(Math.floor(pos1.x()), Math.floor(pos2.x()))
        let maxX = Math.max(Math.floor(pos1.x()), Math.floor(pos2.x()))
        let minY = Math.min(Math.floor(pos1.y()), Math.floor(pos2.y()))
        let maxY = Math.max(Math.floor(pos1.y()), Math.floor(pos2.y()))
        let minZ = Math.min(Math.floor(pos1.z()), Math.floor(pos2.z()))
        let maxZ = Math.max(Math.floor(pos1.z()), Math.floor(pos2.z()))
        
        let coords = []
        
        for (let x = minX; x <= maxX; x++) {
            for (let y = minY; y <= maxY; y++) {
                for (let z = minZ; z <= maxZ; z++) {
                    if (mode) {
                        let centerX = x + 0.5
                        let centerY = y + 0.5
                        let centerZ = z + 0.5
                        let blockPos = new BlockPos(centerX, centerY, centerZ)
                        coords.push(Vec3Iota(blockPos))
                    } else if (mode) {
                        if (x === minX || x === maxX || 
                            y === minY || y === maxY || 
                            z === minZ || z === maxZ) {
                            let centerX = x + 0.5
                            let centerY = y + 0.5
                            let centerZ = z + 0.5
                            let blockPos = new BlockPos(centerX, centerY, centerZ)
                            coords.push(Vec3Iota(blockPos))
                        }
                    } else if (mode === null) {
                        let onEdge = false
                        
                        if (x === minX || x === maxX) {
                            if (y === minY || y === maxY) {
                                onEdge = true
                            }
                            else if (z === minZ || z === maxZ) {
                                onEdge = true
                            }
                        }
                        else if (y === minY || y === maxY) {
                            if (z === minZ || z === maxZ) {
                                onEdge = true
                            }
                        }
                        
                        if (onEdge) {
                            let centerX = x + 0.5
                            let centerY = y + 0.5
                            let centerZ = z + 0.5
                            let blockPos = new BlockPos(centerX, centerY, centerZ)
                            coords.push(Vec3Iota(blockPos))
                        }
                    }
                }
            }
        }
        
        stack.push(ListIota(coords))
    },

    // 区域之馏化：方块实体
    "zone_block": (stack, env) => {
        let args = new Args(stack, 2)
        let pos = args.vec3(0)
        ActionJS.helpers.assertVecInRange(env, pos)
        let x = pos.x(),
            y = pos.y(),
            z = pos.z()
        let distSq = args.double(1)
        distSq *= distSq
        let chunkX = x >> 4,
            chunkY = z >> 4
        let level = env.world
        let targets = []
        for (let cx = chunkX - 1; cx <= chunkX + 1; cx++) {
            for (let cy = chunkY - 1; cy <= chunkY + 1; cy++) {
                let chunk = level.getChunk(cx, cy)
                for (let bpos of chunk.getBlockEntitiesPos()) {
                    if (!env.isVecInRange(bpos)) continue
                    let dsq = Math.pow(x - bpos.x, 2) + Math.pow(y - bpos.y, 2) + Math.pow(z - bpos.z, 2)
                    if (dsq <= distSq) targets.push(Vec3Iota(bpos))
                }
            }
        }
        stack.push(ListIota(targets))
    },

    // 遥感之纯化
    "mind": (stack, env) => {
        let args = new Args(stack, 1)
        let index = args.double(0)
        let player = env.caster
        if (player == null) throw MishapBadCaster()
        if (!player.isPlayer()) throw MishapBadCaster()
        
        if (index !== 0 && index !== 1 && index !== 2 && index !== 3 && index !== 4 && index !== 5 && index !== 6) throw MishapInvalidIota.of(args.get(0), 0, 'class.mind')
        
        let keyMap = [
            { name: "mouse_right", dataKey: "last_mouse_right_press_time" },
            { name: "shift", dataKey: "last_shift_press_time" },
            { name: "space", dataKey: "last_space_press_time" },
            { name: "w", dataKey: "last_w_press_time" },
            { name: "a", dataKey: "last_a_press_time" },
            { name: "s", dataKey: "last_s_press_time" },
            { name: "d", dataKey: "last_d_press_time" }
        ]
        
        let keyInfo = keyMap[index]
        let dataKey = keyInfo.dataKey
        
        let lastPressTime = player.persistentData.contains(dataKey) ? player.persistentData.getLong(dataKey) : 0
        
        let currentTime = Date.now()
        let timeDiff = currentTime - lastPressTime
        let isPressed = timeDiff <= 600

        stack.push(BooleanIota(isPressed))
    },

    // 选择之馏化
    "all_index": (stack, env) => {
        let args = new Args(stack, 2)
        let str_list = args.get(0)
        let any = args.get(1)
        if (str_list instanceof ListIota) {
            let input = str_list.list.list
            let output = []
            for (let i = 0; i < input.length; i++) {
                let out = input[i]
                if (String(out) == String(any)) {
                    output.push(DoubleIota(i))
                }
            }
            stack.push(ListIota(output))
        } else if (str_list instanceof StringIota && any instanceof StringIota) {
            let input = str_list.getString()
            let anyput = any.getString()
            let inp = String(input)
            let anyp = String(anyput)
            if (anyp.length !== 1) throw MishapInvalidIota.of(args.get(1), 0, 'class.astr')
            let output = []
            for (let i = 0; i < inp.length; i++) {
                if (inp[i] == anyput) {
                    output.push(DoubleIota(i))
                }
            }
            stack.push(ListIota(output))
        } else throw MishapInvalidIota.of(args.get(0), 1, 'class.str_list')
    },

    // 标位之馏化
    "all_index_of": (stack, env) => {
        let args = new Args(stack, 2)
        let str_list = args.get(0)
        let numlist = args.list(1).list
        
        if (str_list instanceof ListIota) {
            let inputList = str_list.list.list
            let outputList = []
            for (let numIota of numlist) {
                let index = numIota?.double
                if (index >= 0 && index < inputList.length && Number.isInteger(index)) {
                    let element = inputList[index]
                    outputList.push(element)
                } else throw MishapInvalidIota.of(args.get(0), 1, 'class.listnum')
            }
            stack.push(ListIota(outputList))
        } else if (str_list instanceof StringIota) {
            let inputString = String(str_list.getString())
            let outputString = ""
            for (let numIota of numlist) {
                let index = numIota?.double
                if (index >= 0 && index < inputString.length && Number.isInteger(index)) {
                    outputString += inputString[index]
                }
            }
            stack.push(StringIota.makeUnchecked(outputString))
        } else throw MishapInvalidIota.of(args.get(0), 1, 'class.list_or_string')
    },

    // 重组之纯化
    "transposed_list": (stack, env) => {
        let args = new Args(stack, 1)
        let outerList = args.list(0).list
        
        if (outerList.length === 0 || outerList.length === 1) {
            stack.push(ListIota([]))
            return
        }
        
        let innerLists = []
        for (let i = 0; i < outerList.length; i++) {
            let item = outerList[i]
            
            if (!(item instanceof ListIota)) {
                stack.push(ListIota([]))
                return
            }
            
            let javaList = item.list
            innerLists.push(javaList)
        }
        
        let refLength = innerLists[0].size()
        
        for (let i = 1; i < innerLists.length; i++) {
            if (innerLists[i].size() !== refLength) {
                stack.push(ListIota([]))
                return
            }
        }
        
        let transposed = []
        for (let j = 0; j < refLength; j++) {
            let newRow = []
            for (let i = 0; i < innerLists.length; i++) {
                let inLists = innerLists[i]
                let iLists = inLists.list[j]
                newRow.push(iLists)
            }
            transposed.push(ListIota(newRow))
        }
        
        stack.push(ListIota(transposed))
    },

    // 骑手之精思
    "ride_bool": (stack, env) => {
        let args = new Args(stack, 1)
        let entity = args.entity(0)
        ActionJS.helpers.assertEntityInRange(env, entity)
        let isRiding = entity.isPassenger()
        let isRidden = entity.isVehicle()
        stack.push(BooleanIota(isRiding || isRidden))
    },

    // 符数之纯化
    "str_to_num": (stack, env) => {
        let args = new Args(stack, 1)
        let jsString = String(args.string(0))
        let result = []
        for (let i = 0; i < jsString.length; i++) {
            let charCode = jsString.codePointAt(i)
            if ((charCode >= 65 && charCode <= 90) || (charCode >= 97 && charCode <= 122)) {
                let numValue = charCode % 32
                result.push(DoubleIota(numValue))
            }
        }
        stack.push(ListIota(result))
    },

    // 数符之纯化
    "num_to_str": (stack, env) => {
        let args = new Args(stack, 1)
        let nums = args.get(0)
        if (nums instanceof ListIota) {
            let list = nums.list.list
            let n = list.length
            let result = ""
            for (let i = 0; i < n; i++) {
                let num = Math.round(list[i].double)
                if (num >= 1 && num <= 26 && Number.isInteger(num)) {
                    let char = String.fromCodePoint(96 + num)
                    result += char
                }
            }
            stack.push(StringIota.makeUnchecked(result))
        } else if (nums instanceof DoubleIota) {
            let num = nums.double
            if (num >= 1 && num <= 26 && Number.isInteger(num)) {
                let char = String.fromCodePoint(96 + num)
                stack.push(StringIota.makeUnchecked(char))
            }
        }
    },

    // 维度之精思
    "world": (stack, env) => {
        let level = env.world
        stack.push(StringIota.makeUnchecked(level.dimension))
    },

    // 实体之纯化：非玩家
    "get_entity/not_player": (stack, env) => {
        let args = new Args(stack, 1)
        let targetPos = args.vec3(0)
        let level = env.world
        ActionJS.helpers.assertVecInRange(env, targetPos)
        let aabb = new AABB(
            targetPos.x() - 0.5, targetPos.y() - 0.5, targetPos.z() - 0.5,
            targetPos.x() + 0.5, targetPos.y() + 0.5, targetPos.z() + 0.5
        )
        let entities = level.getEntities()
        let entitiesInRange = []
        for (let i = 0; i < entities.size(); i++) {
            let entity = entities.get(i)
            if (entity.isPlayer()) {
                continue
            }
            if (typeof entity.x !== 'number' || typeof entity.y !== 'number' || typeof entity.z !== 'number') {
                continue
            }
            if (!aabb.contains(entity.x, entity.y, entity.z)) {
                continue
            }
            let dx = entity.x - targetPos.x()
            let dy = entity.y - targetPos.y()
            let dz = entity.z - targetPos.z()
            let distanceSqr = dx*dx + dy*dy + dz*dz
            entitiesInRange.push({
                entity: entity,
                distanceSqr: distanceSqr
            })
        }
        if (entitiesInRange.length > 0) {
            for (let i = 0; i < entitiesInRange.length - 1; i++) {
                for (let j = 0; j < entitiesInRange.length - 1 - i; j++) {
                    if (entitiesInRange[j].distanceSqr > entitiesInRange[j + 1].distanceSqr) {
                        let temp = entitiesInRange[j]
                        entitiesInRange[j] = entitiesInRange[j + 1]
                        entitiesInRange[j + 1] = temp
                    }
                }
            }
            let targetEntity = entitiesInRange[0].entity
            stack.push(EntityIota(targetEntity))
        } else {
            stack.push(NullIota())
        }
    },

    

    // 累进之策略
    "data_add": (stack, env, img) => {
        let userData = img.userData
        let currentCount = 0
        if (userData.contains("use_count")) {
            currentCount = userData.getInt("use_count")
        }
        let newCount = currentCount + 1
        userData.putInt("use_count", newCount)
    },

    // 消减之策略
    "data_sub": (stack, env, img) => {
        let userData = img.userData
        let currentCount = 0
        if (userData.contains("use_count")) {
            currentCount = userData.getInt("use_count")
        }
        let newCount = currentCount - 1
        userData.putInt("use_count", newCount)
    },

    // 计量之精思
    "data_get": (stack, env, img) => {
        let userData = img.userData
        let currentCount = 0
        if (userData.contains("use_count")) {
            currentCount = userData.getInt("use_count")
        }
        stack.push(DoubleIota(currentCount))
    },

    // 覆写之纯化
    "data_set": (stack, env, img) => {
        let args = new Args(stack, 1)
        let num = args.double(0)
        if (!Number.isInteger(num)) throw MishapInvalidIota.of(args.get(0), 0, 'class.integer')
        let userData = img.userData
        if (userData.contains("use_count")) {
            userData.putInt("use_count", num)
        }
    },

    // 天光之纯化
    "sky": (stack, env) => {
        let args = new Args(stack, 1)
        let pos = args.vec3(0)
        ActionJS.helpers.assertVecInRange(env, pos)
        let level = env.world
        
        let blockPos = new BlockPos(
            Math.floor(pos.x()),
            Math.floor(pos.y()),
            Math.floor(pos.z())
        )
        
        let isOpenSky = level.canSeeSky(blockPos)
        stack.push(BooleanIota(isOpenSky))
    },

    // 地势之纯化
    "block_id": (stack, env) => {
        let args = new Args(stack, 1)
        let vec = args.vec3(0)
        ActionJS.helpers.assertVecInRange(env, vec)
        let level = env.world
        let block = level.getBlock(vec)
        let id = block.id
        if (id == "minecraft:air") {
            stack.push(NullIota())
            return
        }
        stack.push(StringIota.makeUnchecked(id))
    },

    // 地质之纯化
    "block_data": (stack, env) => {
        let args = new Args(stack, 1)
        let vec = args.vec3(0)
        ActionJS.helpers.assertVecInRange(env, vec)
        let level = env.world
        let block = level.getBlock(vec)
        let data = block.getEntityData()
        if (!data) {
            stack.push(NullIota())
            return
        }
        stack.push(StringIota.makeUnchecked(data))
    },

    // 地貌之纯化
    "block_state": (stack, env) => {
        let args = new Args(stack, 1)
        let block = args.vec3(0)
        ActionJS.helpers.assertVecInRange(env, block)
        if (!env.world.getBlock(block).getBlockState()) {
            stack.push(NullIota())
            return
        }
        stack.push(StringIota.makeUnchecked(env.world.getBlock(block).getBlockState()))
    },

    // 判空之纯化
    "is_air": (stack, env) => {
        let args = new Args(stack, 1)
        let vec = args.vec3(0)
        ActionJS.helpers.assertVecInRange(env, vec)
        let level = env.world
        let block = level.getBlock(vec).getBlockState()
        let air = block.isAir()
        stack.push(BooleanIota(air))
    },

    // 占位之纯化
    "replaceable": (stack, env) => {
        let args = new Args(stack, 1)
        let vec = args.vec3(0)
        ActionJS.helpers.assertVecInRange(env, vec)
        let level = env.world
        let block = level.getBlock(vec).getBlockState()
        let replaced = block.canBeReplaced()
        stack.push(BooleanIota(replaced))
    },

    // 推敲之纯化
    "shape": (stack, env) => {
        let args = new Args(stack, 1)
        let vec = args.vec3(0)
        ActionJS.helpers.assertVecInRange(env, vec)
        let level = env.world
        let blockPos = new BlockPos(
            Math.floor(vec.x()),
            Math.floor(vec.y()),
            Math.floor(vec.z())
        )
        let block = level.getBlock(vec).getBlockState()
        let shape = block.getCollisionShape(level, blockPos)
        if (shape.isEmpty()) {
            stack.push(Vec3Iota(new Vec3d(0, 0, 0)))
            return
        }
        let aabb = shape.bounds()
        let shaped = new Vec3d(aabb.maxX - aabb.minX, aabb.maxY - aabb.minY, aabb.maxZ - aabb.minZ)
        stack.push(Vec3Iota(shaped))
    },

    // 俯仰之纯化
    "head": (stack, env) => {
        let args = new Args(stack, 1)
        let entity = args.entity(0)
        ActionJS.helpers.assertEntityInRange(env, entity)
        let upPitch = (-entity.pitch + 90) * (KMath.PI / 180)
        let yaw = -entity.yaw * (KMath.PI / 180)
        let j = Math.cos(upPitch)
        let head = new Vec3d(Math.sin(yaw) * j,Math.sin(upPitch),Math.cos(yaw) * j)
        stack.push(Vec3Iota(head))
    },

    // 标签之纯化
    "get_tag": (stack, env) => {
        let args = new Args(stack, 1)
        let target = args.get(0)
        let level = env.world
        let tagsStream
        if (target instanceof Vec3Iota) {
            let vec = target.vec3
            ActionJS.helpers.assertVecInRange(env, vec)
            let block = level.getBlock(vec).getBlockState()
            tagsStream = block.getTags()
        } else if (target instanceof DoubleIota) {
            let player = env.caster
            if (player == null) throw MishapBadCaster()
            if (!player.isPlayer()) throw MishapBadCaster()
            let slot = target.double
            let item = player.getInventory().getItem(slot)
            tagsStream = item.getTags()
        } else if (target instanceof EntityIota && target.entity.getType() == "minecraft:item") {
            let entity = target.entity
            ActionJS.helpers.assertEntityInRange(env, entity)
            tagsStream = entity.getItem().getTags()
        } else if (target instanceof MoteIota) {
            let item = new ItemStack(target.getItem().getId(), 1)
            tagsStream = item.getTags()
        } else if (target instanceof StringIota) {
            let item = Item.of(target.string)
            if (!item.isEmpty()) {
                tagsStream = item.getTags()
            } else throw MishapInvalidIota.of(args.get(0), 0, 'class.tag')
        } else throw MishapInvalidIota.of(args.get(0), 0, 'class.tag')
        let tagsArray = []
        let iterator = tagsStream.iterator()
        while (iterator.hasNext()) {
            let tag = iterator.next()
            tagsArray.push(StringIota.makeUnchecked(tag.location().toString()))
        }
        stack.push(ListIota(tagsArray))
    },

    // 标签之馏化
    "has_tag": (stack, env) => {
        let args = new Args(stack, 2)
        let target = args.get(0)
        let tags = args.string(1)
        let level = env.world
        let tagsStream
        if (target instanceof Vec3Iota) {
            let vec = target.vec3
            ActionJS.helpers.assertVecInRange(env, vec)
            let block = level.getBlock(vec).getBlockState()
            tagsStream = block.getTags()
        } else if (target instanceof DoubleIota) {
            let player = env.caster
            if (player == null) throw MishapBadCaster()
            if (!player.isPlayer()) throw MishapBadCaster()
            let slot = target.double
            let item = player.getInventory().getItem(slot)
            tagsStream = item.getTags()
        } else if (target instanceof EntityIota && target.entity.getType() == "minecraft:item") {
            let entity = target.entity
            ActionJS.helpers.assertEntityInRange(env, entity)
            tagsStream = entity.getItem().getTags()
        } else if (target instanceof MoteIota) {
            let item = new ItemStack(target.getItem().getId(), 1)
            tagsStream = item.getTags()
        } else if (target instanceof StringIota) {
            let item = Item.of(target.string)
            if (!item.isEmpty()) {
                tagsStream = item.getTags()
            } else throw MishapInvalidIota.of(args.get(0), 1, 'class.tag')
        } else throw MishapInvalidIota.of(args.get(0), 1, 'class.tag')
        let iterator = tagsStream.iterator()
        while (iterator.hasNext()) {
            let tag = iterator.next()
            if (tag.location().toString() == tags) {
                stack.push(BooleanIota(true))
                return
            }
        }
        stack.push(BooleanIota(false))
    },

    // 法相之纯化
    "entity_nbt": (stack, env) => {
        let args = new Args(stack, 1)
        let entity = args.entity(0)
        ActionJS.helpers.assertEntityInRange(env, entity)
        if (!entity.nbt) {
            stack.push(NullIota())
            return
        }
        stack.push(StringIota.makeUnchecked(entity.nbt))
    },

    // 名相之纯化
    "entity_name": (stack, env) => {
        let args = new Args(stack, 1)
        let entity = args.entity(0)
        ActionJS.helpers.assertEntityInRange(env, entity)
        if (entity.type === "minecraft:item") {
            let itemStack = entity.getItem()
            if (itemStack) {
                stack.push(StringIota.makeUnchecked(itemStack.id))
                return
            }
        }
        stack.push(StringIota.makeUnchecked(entity.type))
    },

    // 分物之纯化
    "slot_count": (stack, env) => {
        let player = env.caster
        if (player == null) throw MishapBadCaster()
        if (!player.isPlayer()) throw MishapBadCaster()
        let args = new Args(stack, 1)
        let num = args.double(0)
        let item = player.getInventory().getItem(num)
        if (item.isEmpty()) {
            stack.push(NullIota())
            return
        }
        stack.push(DoubleIota(item.count))
    },

    // 观物之纯化
    "slot_name": (stack, env) => {
        let player = env.caster
        if (player == null) throw MishapBadCaster()
        if (!player.isPlayer()) throw MishapBadCaster()
        let args = new Args(stack, 1)
        let target = args.get(0)
        let item
        if (target instanceof DoubleIota) {
            item = player.getInventory().getItem(target.double)
        } else if (target instanceof MoteIota) {
            item = new ItemStack(target.getItem().getId(), 1)
        } else throw MishapInvalidIota.of(args.get(0), 0, 'class.mote_num')
        if (item.isEmpty()) {
            stack.push(NullIota())
            return
        }
        stack.push(StringIota.makeUnchecked(item.id))
    },

    // 格物之纯化
    "slot_nbt": (stack, env) => {
        let player = env.caster
        if (player == null) throw MishapBadCaster()
        if (!player.isPlayer()) throw MishapBadCaster()
        let args = new Args(stack, 1)
        let target = args.get(0)
        let item
        if (target instanceof DoubleIota) {
            item = player.getInventory().getItem(target.double)
        } else if (target instanceof MoteIota) {
            item = new ItemStack(target.getItem().getId(), 1)
        } else throw MishapInvalidIota.of(args.get(0), 0, 'class.mote_num')
        if (item.isEmpty()) {
            stack.push(NullIota())
            return
        }
        let nbt = [
            StringIota.makeUnchecked(item.item.getId()),
            item.nbt ? StringIota.makeUnchecked(item.nbt) : StringIota.makeUnchecked("null")
        ]
        stack.push(ListIota(nbt))
    },

    // 页码之精思
    "page_num": (stack, env) => {
        let player = env.caster
        if (player == null) throw MishapBadCaster()
        if (!player.isPlayer()) throw MishapBadCaster()
        let spellbook = player.offHandItem
        if (spellbook.isEmpty() || spellbook.id != "hexcasting:spellbook") {
            stack.push(NullIota())
            return
        }
        let currentPage = ItemSpellbook.getPage(spellbook, 0)
        stack.push(DoubleIota(currentPage))
    },

    // 落笔之精思
    "page_highest": (stack, env) => {
        let player = env.caster
        if (player == null) throw MishapBadCaster()
        if (!player.isPlayer()) throw MishapBadCaster()
        let spellbook = player.offHandItem
        if (spellbook.isEmpty() || spellbook.id != "hexcasting:spellbook") {
            stack.push(NullIota())
            return
        }
        let currentPage = ItemSpellbook.highestPage(spellbook)
        stack.push(DoubleIota(currentPage))
    },

    // 书签之纯化
    "page_name": (stack, env) => {
        let player = env.caster
        if (player == null) throw MishapBadCaster()
        if (!player.isPlayer()) throw MishapBadCaster()
        let args = new Args(stack, 1)
        let pageNum = args.double(0)
        let spellbook = player.offHandItem
        
        if (spellbook.isEmpty() || spellbook.id != "hexcasting:spellbook") {
            stack.push(NullIota())
            return
        }
        
        let maxPage = ItemSpellbook.highestPage(spellbook)
        
        if (!Number.isInteger(pageNum) || pageNum < 1 || pageNum > maxPage) {
            stack.push(NullIota())
            return
        }
        
        let nbt = spellbook.getNbt()
        
        let pageNamesTag = nbt.getCompound("page_names")
        let pageNumStr = String(pageNum)
        if (!pageNamesTag.contains(pageNumStr)) {
            stack.push(NullIota())
            return
        }
        
        let nameJson = pageNamesTag.getString(pageNumStr)
        
        let pageName = null
        
        if (nameJson.includes('"text":"')) {
            let startIndex = nameJson.indexOf('"text":"') + 8
            let endIndex = nameJson.indexOf('"', startIndex)
            
            if (startIndex >= 8 && endIndex > startIndex) {
                pageName = nameJson.substring(startIndex, endIndex)
            }
        }

        stack.push(StringIota.makeUnchecked(pageName))
    },

    // 书签之策略
    "page_to": (stack, env) => {
        let args = new Args(stack, 1)
        let targetPage = args.double(0)
        let player = env.caster
        if (player == null) throw MishapBadCaster()
        if (!player.isPlayer()) throw MishapBadCaster()
        let spellbook = player.offHandItem

        if (spellbook.id != "hexcasting:spellbook") return

        if (!Number.isInteger(targetPage) || targetPage < 1) return

        let highestPage = ItemSpellbook.highestPage(spellbook)
        if (targetPage > highestPage) return

        let currentPage = ItemSpellbook.getPage(spellbook, 1)

        let flipCount = Math.abs(targetPage - currentPage)
        let flipDirection = targetPage > currentPage

        for (let i = 0; i < flipCount; i++) {
            ItemSpellbook.rotatePageIdx(spellbook, flipDirection)
        }
    },

    // 单引之精思
    "mark_a": (stack, env) => {
        stack.push(StringIota.makeUnchecked("\'"));
    },

    // 双引之精思
    "mark_b": (stack, env) => {
        stack.push(StringIota.makeUnchecked("\""));
    },

    // 侦察之精思
    "raye": (stack, env) => {
        let player = env.caster
        if (player == null) throw MishapBadCaster()
        if (!player.isPlayer()) throw MishapBadCaster()
        if (player.rayTrace(64, false).entity) {
            stack.push(EntityIota(player.rayTrace(64, false).entity))
        } else {
            stack.push(NullIota());
        }
    },

    // 建筑之精思
    "rayb": (stack, env) => {
        let player = env.caster
        if (player == null) throw MishapBadCaster()
        if (!player.isPlayer()) throw MishapBadCaster()
        if (player.rayTrace(64, false).block) {
            stack.push(Vec3Iota(player.rayTrace(64, false).block.pos))
        } else {
            stack.push(NullIota());
        }
    },

    // 波谱之纯化
    "iota_str": (stack, env) => {
        let args = new Args(stack, 1)
        let iota = args.get(0)
        let nbt = IotaType.serialize(iota)
        stack.push(StringIota.makeUnchecked(nbt.getString("hexcasting:type")))
    },

    // 等差之纯化
    "range_list": (stack, env) => {
        let args = new Args(stack, 1)
        let start = args.double(0)
        let n = Math.floor(start)
        if (n >= 0) {
            let resultList = []
            for (let i = 0; i <= n; i++) {
                resultList.push(DoubleIota(i))
            }
            stack.push(ListIota(resultList))
        } else {
            let resultList = []
            for (let i = 0; i >= n; i--) {
                resultList.push(DoubleIota(i))
            }
            stack.push(ListIota(resultList))
        }
    },

    // 等差之提整
    "sequence_list": (stack, env) => {
        let args = new Args(stack, 3)
        let start = args.double(0)
        let end = args.double(1)
        let step = args.double(2)
        if (step === 0) {
            stack.push(ListIota([]))
            return
        }
        if ((step > 0 && start > end) || (step < 0 && start < end)) {
            stack.push(ListIota([]))
            return
        }
        let resultList = []
        if (step > 0) {
            for (let i = start; i <= end; i += step) {
                resultList.push(DoubleIota(i))
            }
        } else {
            for (let i = start; i >= end; i += step) {
                resultList.push(DoubleIota(i))
            }
        }
        stack.push(ListIota(resultList))
    },

    // 勘探之提整
    "found": (stack, env) => {
        let args = new Args(stack, 3)
        let position = args.vec3(0)
        let radius = args.double(1)
        let BlockName = args.string(2)
        let targetBlockName = RL(BlockName)
        let level = env.world
        
        let centerX = Math.floor(position.x())
        let centerY = Math.floor(position.y())
        let centerZ = Math.floor(position.z())
        
        let found = false

        for (let dy = 0; dy <= 384; dy++) {
            let y = centerY - dy
            
            if (y < -64) {
                break
            }
            
            for (let dx = -radius; dx <= radius; dx++) {
                for (let dz = -radius; dz <= radius; dz++) {
                    let x = centerX + dx
                    let z = centerZ + dz
                    let pos = new BlockPos(x, y, z)
                    let block = level.getBlock(pos)
                    if (block.id === targetBlockName) {
                        found = true
                        break
                    }
                }
                if (found) break
            }
            if (found) break
        }
        stack.push(BooleanIota(found))
    },

    // 风蚀之提整
    "_nbt_": (stack, env) => {
        let args = new Args(stack, 3)
        let nbtString = args.string(0)
        let key = args.string(1)
        let filter = args.string(2)
        
        let nbt = String(nbtString)
        let keyToFind = String(key).replace(/\s/g, '')
        let filterString = String(filter).replace(/\s/g, '')
        
        if (nbt === "null") {
            stack.push(NullIota())
            return
        }
        
        let whiteList = []
        let blackList = []
        let filterError = false
        
        if (filterString && filterString.trim() !== "") {
            let parts = filterString.split("||")
            
            if (parts.length > 2) {
                filterError = true
            } else {
                if (parts.length > 0 && parts[0].trim() !== "") {
                    whiteList = parts[0].split("&&")
                        .map(item => item.trim())
                        .filter(item => item !== "")
                }
                
                if (parts.length > 1 && parts[1].trim() !== "") {
                    blackList = parts[1].split("&&")
                        .map(item => item.trim())
                        .filter(item => item !== "")
                }
            }
        }
        
        if (filterError) {
            stack.push(NullIota())
            return
        }
        
        if (nbt.startsWith('{') && nbt.endsWith('}')) {
            nbt = nbt.substring(1, nbt.length - 1)
        }
        
        if (nbt.startsWith("Block")) {
            let blockIdStart = nbt.indexOf('{') + 1
            let blockIdEnd = nbt.indexOf('}', blockIdStart)
            
            if (blockIdStart < 1 || blockIdEnd < blockIdStart) {
                stack.push(NullIota())
                return
            }
            
            let blockId = nbt.substring(blockIdStart, blockIdEnd)
            
            if (!keyToFind || keyToFind.trim() === "") {
                stack.push(StringIota.makeUnchecked(blockId))
                return
            }
            
            let propsStart = nbt.indexOf('[', blockIdEnd)
            let propsEnd = nbt.indexOf(']', propsStart)
            
            if (propsStart < 0 || propsEnd < propsStart) {
                stack.push(NullIota())
                return
            }
            
            let properties = nbt.substring(propsStart + 1, propsEnd)
            let propPairs = properties.split(',')
            let valueFound = null
            
            for (let pair of propPairs) {
                let [key, value] = pair.split('=')
                key = key.trim()
                value = value ? value.trim() : ""
                
                if (key === keyToFind) {
                    valueFound = value
                    break
                }
            }
            
            if (valueFound !== null) {
                stack.push(StringIota.makeUnchecked(valueFound))
            } else {
                stack.push(NullIota())
            }
            return
        }
        
        keyToFind = keyToFind
            .replace(/^"|"$/g, '')
            .replace(/:/g, '')
        
        let foundValue = null
        let inQuotes = false
        let escapeNext = false
        let currentKey = ""
        let currentValue = ""
        let depth = 0
        let collectingValue = false
        
        for (let i = 0; i < nbt.length; i++) {
            let char = nbt.charAt(i)
            
            if (escapeNext) {
                if (collectingValue) {
                    currentValue += char
                }
                escapeNext = false
                continue
            }
            
            if (char === '\\') {
                if (collectingValue) {
                    currentValue += char
                }
                escapeNext = true
                continue
            }
            
            if (char === '"') {
                inQuotes = !inQuotes
                if (collectingValue) {
                    currentValue += char
                }
                continue
            }
            
            if (!inQuotes) {
                if (char === '{' || char === '[') {
                    depth++
                    if (collectingValue) {
                        currentValue += char
                    }
                    continue
                }
                
                if (char === '}' || char === ']') {
                    depth--
                    if (collectingValue) {
                        currentValue += char
                    }
                    continue
                }
                
                if (char === ':' && depth === 0 && !collectingValue) {
                    let cleanKey = currentKey
                        .replace(/^"|"$/g, '')
                        .replace(/:/g, '')
                    
                    if (cleanKey === keyToFind) {
                        collectingValue = true;
                        continue
                    } else {
                        currentKey = ""
                    }
                    continue
                }
                
                if (char === ',' && depth === 0) {
                    if (collectingValue) {
                        foundValue = currentValue
                        break
                    }
                    currentKey = ""
                    continue
                }
            }
            
            if (depth === 0 && !collectingValue && char !== ':') {
                currentKey += char
            } else if (collectingValue) {
                currentValue += char
            }
        }
        
        if (collectingValue && foundValue === null) {
            foundValue = currentValue
        }
        
        if (foundValue === null) {
            stack.push(NullIota())
        } else {
            if (foundValue.startsWith('[') && foundValue.endsWith(']')) {
                if (whiteList.length === 0 && blackList.length === 0) {
                    stack.push(StringIota.makeUnchecked(foundValue))
                    return
                }
                
                let arrayContent = foundValue.substring(1, foundValue.length - 1)
                let arrayElements = []
                let inArrayQuotes = false
                let arrayEscapeNext = false
                let arrayDepth = 0
                let currentElement = ""
                
                if (!arrayContent) {
                    stack.push(NullIota());
                    return;
                }
                
                for (let i = 0; i < arrayContent.length; i++) {
                    let char = arrayContent.charAt(i)
                        
                    if (arrayEscapeNext) {
                        currentElement += char
                        arrayEscapeNext = false
                        continue
                    }
                        
                    if (char === '\\') {
                        currentElement += char
                        arrayEscapeNext = true
                        continue
                    }
                        
                    if (char === '"') {
                        inArrayQuotes = !inArrayQuotes
                        currentElement += char
                        continue
                    }
                        
                    if (!inArrayQuotes) {
                        if (char === '{' || char === '[') {
                            arrayDepth++
                            currentElement += char
                            continue
                        }
                            
                        if (char === '}' || char === ']') {
                            arrayDepth--
                            currentElement += char
                            continue
                        }
                            
                        if (char === ',' && arrayDepth === 0) {
                            arrayElements.push(currentElement.trim())
                            currentElement = ""
                            continue
                        }
                    }
                        
                    currentElement += char
                }
                
                if (currentElement.trim() !== "") {
                    arrayElements.push(currentElement.trim())
                }
                
                let matchedElements = []
                
                for (let i = 0; i < arrayElements.length; i++) {
                    let element = arrayElements[i]
                    
                    let passesWhiteList = true
                    if (whiteList.length > 0) {
                        for (let j = 0; j < whiteList.length; j++) {
                            if (!element.includes(whiteList[j])) {
                                passesWhiteList = false
                                break
                            }
                        }
                    }
                    
                    let passesBlackList = true
                    if (blackList.length > 0) {
                        for (let j = 0; j < blackList.length; j++) {
                            if (element.includes(blackList[j])) {
                                passesBlackList = false
                                break
                            }
                        }
                    }
                    
                    if (passesWhiteList && passesBlackList) {
                        matchedElements.push(element)
                    }
                }
                
                if (matchedElements.length === 1) {
                    stack.push(StringIota.makeUnchecked(matchedElements[0]))
                } else {
                    stack.push(NullIota())
                }
            } else {
                stack.push(StringIota.makeUnchecked(foundValue))
            }
        }
    },

// ==== contain ====

    // 上传
    "cloud": (stack, env, img) => {
        let player = env.caster
        if (player == null) throw MishapBadCaster()
        if (!player.isPlayer()) throw MishapBadCaster()
        let args = new Args(stack, 1)
        let num = args.double(0)

        let userData = img.userData
        let boundStorage
        if (userData && userData.contains(MoteIota.TAG_TEMP_STORAGE)) {
            boundStorage = userData.getUUID(MoteIota.TAG_TEMP_STORAGE)
        } else {
            boundStorage = MediafiedItemManager.getBoundStorage(player)
            if (!boundStorage) throw MishapNoBoundStorage()
        }
        if (MediafiedItemManager.isStorageFull(boundStorage) != false) throw MishapStorageFull(boundStorage)
        
        let itemStack = player.getInventory().getStackInSlot(num)
        if (itemStack.isEmpty()) return
        
        let mote = MoteIota.makeIfStorageLoaded(itemStack, boundStorage)
        player.getInventory().setStackInSlot(num, "minecraft:air")
        stack.push(mote)
    },

    // 下载
    "download": (stack, env) => {
        let args = new Args(stack, 2)
        let mote = args.get(0)
        let num = args.double(1)
        let player = env.caster
        if (player == null) throw MishapBadCaster()
        if (!player.isPlayer()) throw MishapBadCaster()
        
        if (mote instanceof MoteIota) {
            let stacks = mote.getStacksToDrop(num)
            for (let stack of stacks) {
                player.give(stack)
            }
        } else {
            throw MishapInvalidIota.of(args.get(0), 1, 'class.mote')
        }
    },

    // 质元之精思
    "motes": (stack, env, img) => {
        let player = env.caster
        if (player == null) throw MishapBadCaster()
        if (!player.isPlayer()) throw MishapBadCaster()

        let userData = img.userData
        let boundStorage
        if (userData && userData.contains(MoteIota.TAG_TEMP_STORAGE)) {
            boundStorage = userData.getUUID(MoteIota.TAG_TEMP_STORAGE)
        } else {
            boundStorage = MediafiedItemManager.getBoundStorage(player)
            if (!boundStorage) throw MishapNoBoundStorage()
        }
        
        let allRecords = MediafiedItemManager.getAllRecords(boundStorage)
        if (!allRecords || allRecords.isEmpty()) {
            stack.push(ListIota([]))
            return
        }
        
        let results = []
        let keys = allRecords.keySet().toArray()
        for (let i = 0; i < keys.length; i++) {
            let index = keys[i]
            let mote = new MoteIota(index)
            if (mote) results.push(mote)
        }
        
        stack.push(ListIota(results))
    },

    // 合质之精思
    "get_all_motes": (stack, env, img) => {
        let player = env.caster
        if (player == null) throw MishapBadCaster()
        if (!player.isPlayer()) throw MishapBadCaster()

        let userData = img.userData
        let boundStorage
        if (userData && userData.contains(MoteIota.TAG_TEMP_STORAGE)) {
            boundStorage = userData.getUUID(MoteIota.TAG_TEMP_STORAGE)
        } else {
            boundStorage = MediafiedItemManager.getBoundStorage(player)
            if (!boundStorage) throw MishapNoBoundStorage()
        }
        let itemTypes = MediafiedItemManager.getAllContainedItemTypes(boundStorage)
        if (!itemTypes) {
            stack.push(ListIota([]))
            return
        }
        let nameList = []
        let iterator = itemTypes.iterator()
        while (iterator.hasNext()) {
            let itemType = iterator.next()
            if (itemType && itemType.id) {
                nameList.push(StringIota.makeUnchecked(itemType.id))
            }
        }
        stack.push(ListIota(nameList))
    },

    // 合质之纯化
    "get_contained_motes": (stack, env, img) => {
        let args = new Args(stack, 1)
        let input = args.get(0)
        let player = env.caster
        if (player == null) throw MishapBadCaster()
        if (!player.isPlayer()) throw MishapBadCaster()

        let userData = img.userData
        let boundStorage
        if (userData && userData.contains(MoteIota.TAG_TEMP_STORAGE)) {
            boundStorage = userData.getUUID(MoteIota.TAG_TEMP_STORAGE)
        } else {
            boundStorage = MediafiedItemManager.getBoundStorage(player)
            if (!boundStorage) throw MishapNoBoundStorage()
        }
        
        let itemId = null
        if (input instanceof MoteIota && input.record && input.record.item) {
            let str = input.record.item.toString()
            let match = str.match(/\[(.*?)\]/)
            itemId = match ? match[1] : str
        } else if (input instanceof StringIota) {
            itemId = input.getString()
        } else throw MishapInvalidIota.of(args.get(0), 0, 'class.motes')
        if (!itemId) {
            stack.push(ListIota([]))
            return
        }
        let matchingRecords = MediafiedItemManager.getItemRecordsMatching(boundStorage, itemId)
        if (!matchingRecords) {
            stack.push(ListIota([]))
            return
        }
        let results = []
        let iterator = matchingRecords.keySet().iterator()
        while (iterator.hasNext()) {
            let index = iterator.next()
            let mote = new MoteIota(index)
            if (mote) results.push(mote)
        }
        stack.push(ListIota(results))
    },

    // 重新充能
    "charge": (stack, env) => {
        let player = env.caster
        if (player == null) throw MishapBadCaster()
        if (!player.isPlayer()) throw MishapBadCaster()
        let args = new Args(stack, 1)
        let input = args.get(0)
        let artifact = player.offHandItem
        if (artifact.isEmpty()) {
            throw MishapBadOffhandItem.of(artifact, 'class.recharge1')
        }
        
        if (artifact.id !== "hexcasting:trinket" && artifact.id !== "hexcasting:artifact" && artifact.id !== "hexcasting:battery") {
            throw MishapBadOffhandItem.of(artifact, 'class.recharge1')
        }
        
        let nbt = artifact.nbt || {}
        if (nbt["hexcasting:start_media"] === undefined) {
            throw MishapBadOffhandItem.of(artifact, 'class.recharge2')
        }
        
        let media = 0
        if (artifact.nbt["hexcasting:media"] !== undefined) {
            media = artifact.nbt["hexcasting:media"]
        }

        let start = artifact.nbt["hexcasting:start_media"]
        
        let mana = {
            'hexcasting:amethyst_dust': { value: 10000 },
            'minecraft:amethyst_shard': { value: 50000 },
            'hexcasting:charged_amethyst': { value: 100000 }
        }
        
        if (input instanceof MoteIota) {
            let itemId = input.getItem().getId()
            if (!mana[itemId]) {
                throw MishapInvalidIota.of(args.get(0), 0, 'class.media')
            }
            let count = input.getCount()
            let eta = mana[itemId]
            let needed = Math.ceil((start - media) / eta.value)
            let actualUse = Math.min(needed, count)
            if (actualUse <= 0) {
                return
            }
            
            let newMedia = media + (actualUse * eta.value)
            if (newMedia > start) {
                newMedia = start
            }

            artifact.nbt["hexcasting:media"] = newMedia
            input.removeItems(actualUse)

        } else throw MishapInvalidIota.of(args.get(0), 0, 'class.mote')
    },

    // 冲积之提整
    "get_contain": (stack, env) => {
        let args = new Args(stack, 3)
        let vec = args.get(0)
        let mode = args.get(1)
        let bool = args.get(2)
        
        let pos
        let side
        if (vec instanceof Vec3Iota) {
            pos = vec.vec3
            side = Vec3d.ZERO
        } else if (vec instanceof ListIota && vec.list.list.length == 2) {
            pos = vec.list.list[0].vec3
            side = vec.list.list[1].vec3
        } else throw MishapInvalidIota.of(args.get(0), 2, 'class.container')
        let condition
        if (bool instanceof NullIota) {
            condition = null
        } else if (bool instanceof BooleanIota) {
            condition = bool.bool
        } else throw MishapInvalidIota.of(args.get(1), 1, 'class.bool_null')
        let modes
        if (mode instanceof DoubleIota) {
            modes = mode.double
        } else if (mode instanceof ListIota) {
            modes = mode.list.list
        } else if (mode instanceof StringIota) {
            modes = mode.getString()
        } else throw MishapInvalidIota.of(args.get(2), 0, 'class.num_str_list')
        let blockpos = new BlockPos(Math.floor(pos.x()), Math.floor(pos.y()), Math.floor(pos.z()))
        let container = env.world.getBlockEntity(blockpos)
        if (!container || !(container instanceof Container)) throw MishapInvalidIota.of(args.get(0), 2, 'class.containers')
        let slots = []
        if (side.distanceToSqr(Vec3d.ZERO) < 0.01) {
            for (let i = 0; i < container.containerSize; i++) {
                slots.push(i)
            }
        } else if (container instanceof WorldlyContainer) {
            let direction1 = Direction.getNearest(side.x(), side.y(), side.z())
            slots = container.getSlotsForFace(direction1).asIterable()
        } else throw MishapInvalidIota.of(args.get(0), 2, 'class.containers')
        if (condition == null) {
            if (mode instanceof DoubleIota) {
                let num = mode.double
                if (mode instanceof DoubleIota) {
                    if (num == 0) {
                        let slotList = slots.map(slot => DoubleIota(slot))
                        stack.push(ListIota(slotList))
                    } else if (num > 0) {
                        let nonEmptySlots = []
                        for (let slot of slots) {
                            let itemStack = container.getItem(slot)
                            if (!itemStack.isEmpty()) {
                                nonEmptySlots.push(DoubleIota(slot))
                            }
                        }
                        stack.push(ListIota(nonEmptySlots))
                    } else {
                        let emptySlots = []
                        for (let slot of slots) {
                            let itemStack = container.getItem(slot)
                            if (itemStack.isEmpty()) {
                                emptySlots.push(DoubleIota(slot))
                            }
                        }
                        stack.push(ListIota(emptySlots))
                    }
                }
            } else if (mode instanceof StringIota) {
                let name = []
                for (let slot of slots) {
                    let itemStack = container.getItem(slot)
                    if (!itemStack.isEmpty()) {
                        name.push(StringIota.makeUnchecked(itemStack.item.getId()))
                    }
                }
                stack.push(ListIota(name))
            } else if (mode instanceof ListIota) {
                let nbts = []
                for (let slot of slots) {
                    let itemStack = container.getItem(slot)
                    if (!itemStack.isEmpty()) {
                        let nbt = [
                            StringIota.makeUnchecked(itemStack.item.getId()),
                            itemStack.nbt ? StringIota.makeUnchecked(itemStack.nbt) : StringIota.makeUnchecked("null")
                        ]
                        nbts.push(ListIota(nbt))
                    }
                }
                stack.push(ListIota(nbts))
            }
        } else {
            if (mode instanceof DoubleIota) {
                if (!slots.includes(modes)) {
                    stack.push(NullIota())
                    return
                }
                let itemStack = container.getItem(modes)
                if (itemStack.isEmpty()) {
                    stack.push(NullIota())
                    return
                }
                if (!condition) {
                    stack.push(StringIota.makeUnchecked(itemStack.item.getId()))
                } else {
                    let nbt = [
                        StringIota.makeUnchecked(itemStack.item.getId()),
                        itemStack.nbt ? StringIota.makeUnchecked(itemStack.nbt) : StringIota.makeUnchecked("null")
                    ]
                    stack.push(ListIota(nbt))
                }
            } else if (mode instanceof StringIota) {
                let foundItems = []
                for (let slot of slots) {
                    let itemStack = container.getItem(slot)
                    if (!itemStack.isEmpty() && itemStack.item.getId() == modes) {
                        if (!condition) {
                            foundItems.push(DoubleIota(slot))
                        } else {
                            let nbt = [
                                StringIota.makeUnchecked(itemStack.item.getId()),
                                itemStack.nbt ? StringIota.makeUnchecked(itemStack.nbt) : StringIota.makeUnchecked("null")
                            ]
                            foundItems.push(ListIota(nbt))
                        }
                    }
                }
                stack.push(ListIota(foundItems))
            } else if (mode instanceof ListIota && modes.length == 2 && modes[0] instanceof StringIota && modes[1] instanceof StringIota) {
                let itemId = modes[0].getString()
                let nbtString = modes[1].getString()
                let foundSlots = []
                
                for (let slot of slots) {
                    let itemStack = container.getItem(slot)
                    let nbt = itemStack.nbt ? itemStack.nbt.toString() : "null"
                    if (!itemStack.isEmpty() && itemStack.item.getId() == itemId) {
                        if (nbt == nbtString) {
                            if (!condition) {
                                foundSlots.push(DoubleIota(slot))
                            } else {
                                foundSlots.push(StringIota.makeUnchecked(itemStack.item.getId()))
                            }
                        }
                    }
                }
                stack.push(ListIota(foundSlots))
            } else throw MishapInvalidIota.of(args.get(2), 0, 'class.strlist')
        }
    },

    // 容止
    "contain_contain": (stack, env) => {
        let args = new Args(stack, 5)
        let vec1 = args.get(0)
        let vec2 = args.get(1)
        let mode = args.get(2)
        let toslot = args.get(3)
        let count = args.double(4)
        let pos1, side1
        if (vec1 instanceof Vec3Iota) {
            pos1 = vec1.vec3
            side1 = Vec3d.ZERO
        } else if (vec1 instanceof ListIota && vec1.list.list.length == 2) {
            pos1 = vec1.list.list[0].vec3
            side1 = vec1.list.list[1].vec3
        } else throw MishapInvalidIota.of(args.get(0), 4, 'class.container')
        let pos2, side2
        if (vec2 instanceof Vec3Iota) {
            pos2 = vec2.vec3
            side2 = Vec3d.ZERO
        } else if (vec2 instanceof ListIota && vec2.list.list.length == 2) {
            pos2 = vec2.list.list[0].vec3
            side2 = vec2.list.list[1].vec3
        } else throw MishapInvalidIota.of(args.get(1), 3, 'class.container')
        let modes
        if (mode instanceof DoubleIota) {
            modes = mode.double
        } else if (mode instanceof ListIota && mode.list.list.length == 2 && mode.list.list[0] instanceof StringIota && mode.list.list[1] instanceof StringIota) {
            modes = mode.list.list
        } else if (mode instanceof StringIota) {
            modes = mode.getString()
        } else throw MishapInvalidIota.of(args.get(3), 1, 'class.num_str_strlist')
        let condition
        if (toslot instanceof BooleanIota) {
            condition = toslot.bool
        } else if (toslot instanceof DoubleIota) {
            condition = toslot.double
        } else throw MishapInvalidIota.of(args.get(3), 1, 'class.num_null')
        let blockPos1 = new BlockPos(Math.floor(pos1.x()), Math.floor(pos1.y()), Math.floor(pos1.z()))
        let blockPos2 = new BlockPos(Math.floor(pos2.x()), Math.floor(pos2.y()), Math.floor(pos2.z()))
        let container1 = env.world.getBlockEntity(blockPos1)
        let container2 = env.world.getBlockEntity(blockPos2)
        if (!container1 || !(container1 instanceof Container)) throw MishapInvalidIota.of(args.get(0), 4, 'class.containers')
        if (!container2 || !(container2 instanceof Container)) throw MishapInvalidIota.of(args.get(1), 4, 'class.containers')
        let slots1 = []
        let slots2 = []
        if (side1.distanceToSqr(Vec3d.ZERO) < 0.01) {
            for (let i = 0; i < container1.containerSize; i++) {
                slots1.push(i)
            }
        } else if (container1 instanceof WorldlyContainer) {
            let direction1 = Direction.getNearest(side1.x(), side1.y(), side1.z())
            slots1 = container1.getSlotsForFace(direction1)
        } else throw MishapInvalidIota.of(args.get(0), 4, 'class.containers')
        if (side2.distanceToSqr(Vec3d.ZERO) < 0.01) {
            for (let i = 0; i < container2.containerSize; i++) {
                slots2.push(i)
            }
        } else if (container2 instanceof WorldlyContainer) {
            let direction2 = Direction.getNearest(side2.x(), side2.y(), side2.z())
            slots2 = container2.getSlotsForFace(direction2)
        } else throw MishapInvalidIota.of(args.get(1), 3, 'class.containers')
        let itemStacks = []
        if (mode instanceof DoubleIota) {
            if (!slots1.includes(modes)) {
                stack.push(DoubleIota(0))
                return
            }
            let items = container1.getItem(modes)
            if (!items.isEmpty()) {
                itemStacks.push({ slot: modes, stack: items })
            }
        } else if (mode instanceof StringIota) {
            for (let slotIdx of slots1) {
                let items = container1.getItem(slotIdx)
                if (!items.isEmpty() && items.item.getId() == modes) {
                    itemStacks.push({ slot: slotIdx, stack: items })
                }
            }
        } else if (mode instanceof ListIota) {
            let idString = modes[0].getString()
            let nbtString = modes[1].getString()
            for (let slotIdx of slots1) {
                let items = container1.getItem(slotIdx)
                let nbt = items.nbt ? items.nbt.toString() : "null"
                if (!items.isEmpty() && items.item.getId() == idString) {
                    if (nbt == nbtString) {
                        itemStacks.push({ slot: slotIdx, stack: items })
                    }
                }
            }
        }
        let totalTransferred = 0
        for (let itemInfo of itemStacks) {
            let sourceSlot = itemInfo.slot
            let sourceStack = itemInfo.stack
            let remaining = Math.min(count - totalTransferred, sourceStack.getCount())
            if (toslot instanceof DoubleIota) {
                if (slots2.includes(condition)) {
                    let targetStack = container2.getItem(condition)
                    if (targetStack.isEmpty() || ItemStack.isSameItemSameTags(targetStack, sourceStack)) {
                        let space = targetStack.isEmpty() ? sourceStack.getMaxStackSize() : targetStack.getMaxStackSize() - targetStack.getCount()
                        if (space > 0) {
                            let toTransfer = Math.min(remaining, space)
                            if (targetStack.isEmpty()) {
                                let newStack = sourceStack.copy()
                                newStack.setCount(toTransfer)
                                container2.setItem(condition, newStack)
                            } else {
                                let newTargetStack = targetStack.copy()
                                newTargetStack.grow(toTransfer)
                                container2.setItem(condition, newTargetStack)
                            }
                            sourceStack.shrink(toTransfer)
                            container1.setItem(sourceSlot, sourceStack.isEmpty() ? ItemStack.EMPTY : sourceStack)
                            remaining -= toTransfer
                            totalTransferred += toTransfer
                            if (remaining <= 0) {
                                continue
                            }
                        }
                        condition = false
                    }
                }
            }
            if (condition == false) {
                let transferred = 0
                for (let targetSlot of slots2) {
                    if (transferred >= remaining) break
                    let targetStack = container2.getItem(targetSlot)
                    let toTransfer = 0
                    if (targetStack.isEmpty()) {
                        toTransfer = Math.min(remaining - transferred, sourceStack.getMaxStackSize())
                    } else if (ItemStack.isSameItemSameTags(targetStack, sourceStack)) {
                        let space = targetStack.getMaxStackSize() - targetStack.getCount()
                        toTransfer = Math.min(remaining - transferred, space)
                    }
                    if (toTransfer > 0) {
                        if (targetStack.isEmpty()) {
                            let newStack = sourceStack.copy()
                            newStack.setCount(toTransfer)
                            container2.setItem(targetSlot, newStack)
                        } else {
                            let newTargetStack = targetStack.copy()
                            newTargetStack.grow(toTransfer)
                            container2.setItem(targetSlot, newTargetStack)
                        }
                        transferred += toTransfer
                    }
                }
                if (transferred > 0) {
                    sourceStack.shrink(transferred)
                    container1.setItem(sourceSlot, sourceStack.isEmpty() ? ItemStack.EMPTY : sourceStack)
                    totalTransferred += transferred
                }
                if (totalTransferred >= count) break
            } else if (condition == true) {
                let transferred = 0
                for (let targetSlot of slots2) {
                    if (transferred >= remaining) break
                    let targetStack = container2.getItem(targetSlot)
                    if (targetStack.isEmpty() || !ItemStack.isSameItemSameTags(targetStack, sourceStack)) continue
                    
                    let space = targetStack.getMaxStackSize() - targetStack.getCount()
                    if (space > 0) {
                        let toTransfer = Math.min(remaining - transferred, space)
                        let newTargetStack = targetStack.copy()
                        newTargetStack.grow(toTransfer)
                        container2.setItem(targetSlot, newTargetStack)
                        transferred += toTransfer
                    }
                }
                if (transferred < remaining) {
                    for (let targetSlot of slots2) {
                        if (transferred >= remaining) break
                        let targetStack = container2.getItem(targetSlot)
                        if (!targetStack.isEmpty()) continue
                        let toTransfer = Math.min(remaining - transferred, sourceStack.getMaxStackSize())
                        let newStack = sourceStack.copy()
                        newStack.setCount(toTransfer)
                        container2.setItem(targetSlot, newStack)
                        transferred += toTransfer
                    }
                }
                if (transferred > 0) {
                    sourceStack.shrink(transferred)
                    if (sourceStack.isEmpty()) {
                        container1.setItem(sourceSlot, ItemStack.EMPTY)
                    } else {
                        container1.setItem(sourceSlot, sourceStack)
                    }
                    
                    totalTransferred += transferred
                }
                if (totalTransferred >= count) break
            }
        }
        stack.push(DoubleIota(totalTransferred))
    },

    // 物流
    "contain_mote": (stack, env, img) => {
        let args = new Args(stack, 3)
        let vec1 = args.get(0)
        let mode = args.get(1)
        let count = args.double(2)

        let player = env.caster
        if (player == null) throw MishapBadCaster()
        if (!player.isPlayer()) throw MishapBadCaster()
        let userData = img.userData
        let boundStorage
        if (userData && userData.contains(MoteIota.TAG_TEMP_STORAGE)) {
            boundStorage = userData.getUUID(MoteIota.TAG_TEMP_STORAGE)
        } else {
            boundStorage = MediafiedItemManager.getBoundStorage(player)
            if (!boundStorage) throw MishapNoBoundStorage()
        }
        if (MediafiedItemManager.isStorageFull(boundStorage) != false) throw MishapStorageFull(boundStorage)

        let pos1, side1
        if (vec1 instanceof Vec3Iota) {
            pos1 = vec1.vec3
            side1 = Vec3d.ZERO
        } else if (vec1 instanceof ListIota && vec1.list.list.length == 2) {
            pos1 = vec1.list.list[0].vec3
            side1 = vec1.list.list[1].vec3
        } else throw MishapInvalidIota.of(args.get(0), 4, 'class.container')

        let modes
        if (mode instanceof DoubleIota) {
            modes = mode.double
        } else if (mode instanceof ListIota && mode.list.list.length == 2 && mode.list.list[0] instanceof StringIota && mode.list.list[1] instanceof StringIota) {
            modes = mode.list.list
        } else if (mode instanceof StringIota) {
            modes = mode.getString()
        } else throw MishapInvalidIota.of(args.get(3), 1, 'class.num_str_strlist')

        let blockPos1 = new BlockPos(Math.floor(pos1.x()), Math.floor(pos1.y()), Math.floor(pos1.z()))
        let container1 = env.world.getBlockEntity(blockPos1)
        
        if (!container1 || !(container1 instanceof Container)) throw MishapInvalidIota.of(args.get(0), 4, 'class.containers')
        
        let slots1 = []
        if (side1.distanceToSqr(Vec3d.ZERO) < 0.01) {
            for (let i = 0; i < container1.containerSize; i++) {
                slots1.push(i)
            }
        } else if (container1 instanceof WorldlyContainer) {
            let direction1 = Direction.getNearest(side1.x(), side1.y(), side1.z())
            slots1 = container1.getSlotsForFace(direction1)
        } else throw MishapInvalidIota.of(args.get(0), 4, 'class.containers')
        
        let itemStacks = []
        if (mode instanceof DoubleIota) {
            if (!slots1.includes(modes)) return
            let items = container1.getItem(modes)
            if (!items.isEmpty()) {
                itemStacks.push({ slot: modes, stack: items })
            }
        } else if (mode instanceof StringIota) {
            for (let slotIdx of slots1) {
                let items = container1.getItem(slotIdx)
                if (!items.isEmpty() && items.item.getId() == modes) {
                    itemStacks.push({ slot: slotIdx, stack: items })
                }
            }
        } else if (mode instanceof ListIota) {
            let idString = modes[0].getString()
            let nbtString = modes[1].getString()
            for (let slotIdx of slots1) {
                let items = container1.getItem(slotIdx)
                let nbt = items.nbt ? items.nbt.toString() : "null"
                if (!items.isEmpty() && items.item.getId() == idString) {
                    if (nbt == nbtString) {
                        itemStacks.push({ slot: slotIdx, stack: items })
                    }
                }
            }
        }
        let totalItemsToTransfer = 0
        for (let itemInfo of itemStacks) {
            if (itemInfo.stack.isEmpty()) continue
            totalItemsToTransfer += Math.min(count - totalItemsToTransfer, itemInfo.stack.getCount())
        }
        let moteList = []
        for (let itemInfo of itemStacks) {
            let allRecords = MediafiedItemManager.getAllRecords(boundStorage)
            let usedSlots = allRecords ? allRecords.size() : 0
            if (totalItemsToTransfer <= 0 || usedSlots >= 1023) break
            let sourceSlot = itemInfo.slot
            let sourceStack = itemInfo.stack
            let toTransfer = Math.min(totalItemsToTransfer, sourceStack.getCount())
            let transferStack = sourceStack.copy()
            transferStack.setCount(toTransfer)
            let mote = MoteIota.makeIfStorageLoaded(transferStack, boundStorage)
            if (mote) {
                sourceStack.shrink(toTransfer)
                if (sourceStack.isEmpty()) {
                    container1.setItem(sourceSlot, ItemStack.EMPTY)
                } else {
                    container1.setItem(sourceSlot, sourceStack)
                }
                moteList.push(mote)
                totalItemsToTransfer -= toTransfer
            }
        }
        stack.push(ListIota(moteList))
    },

    // 枢送
    "mote_contain": (stack, env, img) => {
        let args = new Args(stack, 4)
        let vec1 = args.get(0)
        let mote = args.get(1)
        let toslot = args.get(2)
        let count = args.double(3)
        let player = env.caster
        if (player == null) throw MishapBadCaster()
        if (!player.isPlayer()) throw MishapBadCaster()
        let userData = img.userData
        let boundStorage
        if (userData && userData.contains(MoteIota.TAG_TEMP_STORAGE)) {
            boundStorage = userData.getUUID(MoteIota.TAG_TEMP_STORAGE)
        } else {
            boundStorage = MediafiedItemManager.getBoundStorage(player)
            if (!boundStorage) throw MishapNoBoundStorage()
        }
        let pos1, side1
        if (vec1 instanceof Vec3Iota) {
            pos1 = vec1.vec3
            side1 = Vec3d.ZERO
        } else if (vec1 instanceof ListIota && vec1.list.list.length == 2) {
            pos1 = vec1.list.list[0].vec3
            side1 = vec1.list.list[1].vec3
        } else throw MishapInvalidIota.of(args.get(0), 3, 'class.container')
        let condition
        if (toslot instanceof BooleanIota) {
            condition = toslot.bool
        } else if (toslot instanceof DoubleIota) {
            condition = toslot.double
        } else throw MishapInvalidIota.of(args.get(2), 1, 'class.num_null')
        let blockPos1 = new BlockPos(Math.floor(pos1.x()), Math.floor(pos1.y()), Math.floor(pos1.z()))
        let container1 = env.world.getBlockEntity(blockPos1)
        if (!container1 || !(container1 instanceof Container)) throw MishapInvalidIota.of(args.get(0), 3, 'class.containers')
        let slots1 = []
        if (side1.distanceToSqr(Vec3d.ZERO) < 0.01) {
            for (let i = 0; i < container1.containerSize; i++) {
                slots1.push(i)
            }
        } else if (container1 instanceof WorldlyContainer) {
            let direction1 = Direction.getNearest(side1.x(), side1.y(), side1.z())
            slots1 = container1.getSlotsForFace(direction1)
        } else throw MishapInvalidIota.of(args.get(0), 3, 'class.containers')
        let MoteStacks = []
        if (mote instanceof MoteIota) {
            let stack = new ItemStack(mote.getItem().getId(), mote.getCount())
            MoteStacks.push({ mote: mote, stack: stack })
        } else if (mote instanceof StringIota) {
            let records = MediafiedItemManager.getItemRecordsMatching(boundStorage, mote.getString())
            if (!records) {
                stack.push(DoubleIota(0))
                return
            }
            let iterator = records.keySet().iterator()
            while (iterator.hasNext()) {
                let index = iterator.next()
                let mote = new MoteIota(index)
                if (mote) {
                    let stack = new ItemStack(mote.getItem().getId(), mote.getCount())
                    MoteStacks.push({ mote: mote, stack: stack })
                }
            }
        } else if (mote instanceof ListIota && mote.list.list.length == 2 && mote.list.list[0] instanceof StringIota && mote.list.list[1] instanceof StringIota) {
            let idString = mote.list.list[0].getString()
            let nbtString = mote.list.list[1].getString()
            let records = MediafiedItemManager.getItemRecordsMatching(boundStorage, idString)
            if (!records) {
                stack.push(DoubleIota(0))
                return
            }
            let iterator = records.keySet().iterator()
            while (iterator.hasNext()) {
                let index = iterator.next()
                let mote = new MoteIota(index)
                if (mote) {
                    let itemNbt = mote.getTag() ? mote.getTag().toString() : "null"
                    if (nbtString == itemNbt) {
                        let itemstack = new ItemStack(mote.getItem(), mote.getCount())
                        itemstack.setNbt(mote.getTag())
                        MoteStacks.push({ mote: mote, stack: itemstack })
                    }
                }
            }
        } else throw MishapInvalidIota.of(args.get(2), 1, 'class.mote_str_strlist')
        let totalTransferred = 0
        for (let itemInfo of MoteStacks) {
            let mote = itemInfo.mote
            let stack = itemInfo.stack
            let remaining = Math.min(count - totalTransferred, stack.getCount())
            if (toslot instanceof DoubleIota) {
                if (slots1.includes(condition)) {
                    let targetStack = container1.getItem(condition)
                    if (targetStack.isEmpty() || ItemStack.isSameItemSameTags(targetStack, stack)) {
                        let space = targetStack.isEmpty() ? 
                            stack.getMaxStackSize() : 
                            targetStack.getMaxStackSize() - targetStack.getCount()
                        if (space > 0) {
                            let toTransfer = Math.min(remaining, space)
                            if (targetStack.isEmpty()) {
                                let newStack = stack.copy()
                                newStack.setCount(toTransfer)
                                container1.setItem(condition, newStack)
                            } else {
                                let newTargetStack = targetStack.copy()
                                newTargetStack.grow(toTransfer)
                                container1.setItem(condition, newTargetStack)
                            }
                            mote.removeItems(toTransfer)
                            remaining -= toTransfer
                            totalTransferred += toTransfer
                            
                            if (remaining <= 0) {
                                continue
                            }
                        }
                        condition = false
                    }
                }
            }
            if (condition == false) {
                let transferred = 0
                for (let targetSlot of slots1) {
                    if (transferred >= remaining) break
                    let targetStack = container1.getItem(targetSlot)
                    let toTransfer = 0
                    if (targetStack.isEmpty()) {
                        toTransfer = Math.min(remaining - transferred, stack.getMaxStackSize())
                    } else if (ItemStack.isSameItemSameTags(targetStack, stack)) {
                        let space = targetStack.getMaxStackSize() - targetStack.getCount()
                        toTransfer = Math.min(remaining - transferred, space)
                    }
                    if (toTransfer > 0) {
                        if (targetStack.isEmpty()) {
                            let newStack = stack.copy()
                            newStack.setCount(toTransfer)
                            container1.setItem(targetSlot, newStack)
                        } else {
                            let newTargetStack = targetStack.copy()
                            newTargetStack.grow(toTransfer)
                            container1.setItem(targetSlot, newTargetStack)
                        }
                        transferred += toTransfer
                    }
                }
                if (transferred > 0) {
                    mote.removeItems(transferred)
                    totalTransferred += transferred
                }
            }
            else if (condition == true) {
                let transferred = 0
                for (let targetSlot of slots1) {
                    if (transferred >= remaining) break
                    
                    let targetStack = container1.getItem(targetSlot)
                    if (targetStack.isEmpty() || !ItemStack.isSameItemSameTags(targetStack, stack)) {
                        continue
                    }
                    
                    let space = targetStack.getMaxStackSize() - targetStack.getCount()
                    if (space > 0) {
                        let toTransfer = Math.min(remaining - transferred, space)
                        let newTargetStack = targetStack.copy()
                        newTargetStack.grow(toTransfer)
                        container1.setItem(targetSlot, newTargetStack)
                        transferred += toTransfer
                    }
                }
                if (transferred < remaining) {
                    for (let targetSlot of slots1) {
                        if (transferred >= remaining) break
                        
                        let targetStack = container1.getItem(targetSlot)
                        if (!targetStack.isEmpty()) continue
                        
                        let toTransfer = Math.min(remaining - transferred, stack.getMaxStackSize())
                        let newStack = stack.copy()
                        newStack.setCount(toTransfer)
                        container1.setItem(targetSlot, newStack)
                        transferred += toTransfer
                    }
                }
                if (transferred > 0) {
                    mote.removeItems(transferred)
                    totalTransferred += transferred
                }
            }
            if (totalTransferred >= count) break
        }
        stack.push(DoubleIota(totalTransferred))
    },

    // 检验
    "recipes": (stack, env) => {
        let args = new Args(stack, 1)
        let string = args.string(0)
        string = RL(string)
        let level = env.world
        let recipeManager = level.getRecipeManager()
        let craftingRecipes = recipeManager.getAllRecipesFor(RecipeType.CRAFTING)
        let matchingRecipes = []
        let iterator = craftingRecipes.iterator()
        while (iterator.hasNext()) {
            let recipe = iterator.next()
            let resultItem = recipe.getResultItem(level.registryAccess())
            if (resultItem.getItem().getId() === string) {
                matchingRecipes.push(recipe)
            }
        }
        if (matchingRecipes.length === 0) {
            stack.push(NullIota())
            return
        }
        let list = []
        for (let i = 0; i < matchingRecipes.length; i++) {
            let result = ""
            let selectedRecipe = matchingRecipes[i]
            let ingredients = selectedRecipe.getIngredients()
            for (let i = 0; i < ingredients.size(); i++) {
                if (i !== 0) {
                    result += ","
                }
                let ingredient = ingredients.get(i)
                if (ingredient.isEmpty()) {
                    result += "*"
                }
                let itemStack = ingredient.getFirst().getItem().getId()
                result += `${itemStack}`
            }
            list.push(StringIota.makeUnchecked(result))
        }
        stack.push(ListIota(list))
    },

    // 集成
    "recipe": (stack, env, img) => {
        let args = new Args(stack, 2)
        let recipeString = args.string(0)
        let recipeCount = args.double(1)
        let player = env.caster
        if (player == null) throw MishapBadCaster()
        if (!player.isPlayer()) throw MishapBadCaster()
        let level = env.world

        let userData = img.userData
        let boundStorage
        if (userData && userData.contains(MoteIota.TAG_TEMP_STORAGE)) {
            boundStorage = userData.getUUID(MoteIota.TAG_TEMP_STORAGE)
        } else {
            boundStorage = MediafiedItemManager.getBoundStorage(player)
            if (!boundStorage) throw MishapNoBoundStorage()
        }
        if (MediafiedItemManager.isStorageFull(boundStorage) != false) throw MishapStorageFull(boundStorage)
        
        let itemTypes = MediafiedItemManager.getAllContainedItemTypes(boundStorage)
        if (!itemTypes) return
        let nameList = []
        let iterator = itemTypes.iterator()
        while (iterator.hasNext()) {
            let itemType = iterator.next()
            if (itemType) {
                nameList.push(itemType.id)
            }
        }

        let inputItems = recipeString.split(',')
        if (inputItems.length > 9) {
            stack.push(NullIota())
            return
        }

        let items = new Array(9).fill("*")
        for (let i = 0; i < inputItems.length && i < 9; i++) {
            items[i] = inputItems[i]
        }

        let recipeList = []
        for (let row = 0; row < 3; row++) {
            let rowItems = []
            for (let col = 0; col < 3; col++) {
                let itemId = items[row * 3 + col]
                if (itemId === "*") {
                    rowItems.push(null)
                } else {
                    if (itemId.startsWith('"') && itemId.endsWith('"')) {
                        itemId = itemId.substring(1, itemId.length - 1)
                    }
                    rowItems.push(itemId)
                }
            }
            recipeList.push(rowItems)
        }

        let containerAccess = ContainerLevelAccess.create(level, player.blockPosition())
        let craftingMenu = new CraftingMenu(0, player.getInventory(), containerAccess)
        let container = new TransientCraftingContainer(craftingMenu, 3, 3)
        
        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 3; col++) {
                let itemId = recipeList[row][col]
                let stack = ItemStack.EMPTY
                
                if (itemId !== null) {
                    if (!/^[a-z0-9/:._-]*$/.test(itemId)) throw MishapInvalidIota.of(args.get(0), 1, 'class.RL')
                    stack = Item.of(itemId).withCount(1)
                }
                
                container.setItem(row * 3 + col, stack)
            }
        }
        
        let recipeManager = level.recipeManager
        let recipes = recipeManager.getAllRecipesFor(RecipeType.CRAFTING)
        let recipeIterator = recipes.iterator()
        let matchedRecipe = null

        while (recipeIterator.hasNext()) {
            let recipe = recipeIterator.next()
            if (recipe.matches(container, level)) {
                matchedRecipe = recipe
                break
            }
        }
        
        if (!matchedRecipe) {
            stack.push(NullIota())
            return
        }
        
        let resultStack = matchedRecipe.assemble(container, level.registryAccess())

        let materialCounts = {}
        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 3; col++) {
                let itemId = recipeList[row][col]
                if (itemId !== null) {
                    materialCounts[itemId] = (materialCounts[itemId] || 0) + 1
                }
            }
        }
        
        let totalMaterialCost = {}
        for (let itemId in materialCounts) {
            totalMaterialCost[itemId] = materialCounts[itemId] * recipeCount;
        }
        
        let missingMaterials = {}
        let hasAllMaterials = true
        let itemCache = {}

        for (let itemId in totalMaterialCost) {
            let requiredCount = totalMaterialCost[itemId];
            
            if (!itemCache[itemId]) {
                let matchingRecords = MediafiedItemManager.getItemRecordsMatching(boundStorage, itemId);
                itemCache[itemId] = {
                    records: matchingRecords,
                    totalCount: 0
                }
                
                if (matchingRecords && !matchingRecords.isEmpty()) {
                    let iterator = matchingRecords.values().iterator()
                    while (iterator.hasNext()) {
                        let record = iterator.next()
                        itemCache[itemId].totalCount += record.count
                    }
                }
            }
            
            let availableCount = itemCache[itemId].totalCount
            
            if (availableCount < requiredCount) {
                missingMaterials[itemId] = requiredCount - availableCount
                hasAllMaterials = false
            }
        }

        if (!hasAllMaterials) {
            
            let missingList = []
            for (let itemId in missingMaterials) {
                let count = missingMaterials[itemId]
                
                for (let i = 0; i < count; i++) {
                    missingList.push(StringIota.makeUnchecked(itemId))
                }
            }
            stack.push(ListIota(missingList))
            return
        }
        
        for (let itemId in totalMaterialCost) {
            let toRemove = totalMaterialCost[itemId]
            
            let matchingRecords = MediafiedItemManager.getItemRecordsMatching(boundStorage, itemId)
            if (!matchingRecords || matchingRecords.isEmpty()) {
                continue
            }
            
            let iterator = matchingRecords.keySet().iterator()
            let removedCount = 0
            
            while (iterator.hasNext() && toRemove > 0) {
                let index = iterator.next()
                let mote = new MoteIota(index)
                let currentCount = mote.getCount()
                let removeAmount = Math.min(toRemove, currentCount)
                
                if (removeAmount > 0) {
                    mote.removeItems(removeAmount)
                    toRemove -= removeAmount
                    removedCount += removeAmount
                }
            }
        }
        
        let maxStackSize = resultStack.maxStackSize
        let totalCount = recipeCount * resultStack.count
        
        let stacks = []
        let remainingCount = totalCount
        
        while (remainingCount > 0) {
            let stackSize = Math.min(remainingCount, maxStackSize)
            let newStack = resultStack.copy()
            newStack.count = stackSize
            stacks.push(newStack)
            remainingCount -= stackSize
        }
        
        let moteList = []
        for (let i = 0; i < stacks.length; i++) {
            let stackItem = stacks[i]
            let mote = MoteIota.makeIfStorageLoaded(stackItem, boundStorage)
            if (mote) {
                moteList.push(mote)
            }
        }

        stack.push(ListIota(moteList))
    },

// ==== 完结撒花~ ====

    // 万物之终结
    "omega": (stack, env) => {
        let player = env.caster
        let args = new Args(stack, 1)
        let omega_entity = args.entity(0)
        if (!(omega_entity instanceof Mob)) throw MishapInvalidIota.of(args.get(0), 0, 'class.mob')
        let level = env.world
        let server = env.caster?.server??Utils.server
        
        // 爆点半径
        let searchRadius = 64
        // 额外点位
        let explosionCount = 6
        // 爆破次数
        let totalExplosions = 81
        // 粒子强度
        let particleIntensityFactor = 1.0
        // 爆炸间隔
        let baseDelayBetweenExplosions = 120
        // 狂暴间隔
        let crazyExplosions = 6
        // 最小间隔
        let minDelayBetweenExplosions = 6
        // 间隔浮动
        let delayFluctuation = 60
        // 中心爆炸
        let mainExplosionStrength = 8
        // 次级爆炸
        let secondaryExplosionStrength = 3
        // 闪电数量
        let lightningCount = 16
        // 闪电半径
        let lightningRadius = 32
        // 闪电位置
        let lightningYOffset = 4
        // 岩浆概率
        let lavaRandom = 0.05
        // 矿物半径
        let oreGenerationRadius = 5
        // 矿物位置
        let oreGenerationYOffset = -11

        omega_entity.persistentData.putBoolean('omega', true)

        // 你牛小了
        let index = 0
        let omega = () => {

            // 难逃一杀
            if (index >= totalExplosions) {
                avada_kedavra(player, omega_entity, level)
                return
            }
            if (!omega_entity || !omega_entity.isAlive()) {
                omega_entity.persistentData.remove('omega')
                return
            }

            // 陨石粒子
            for (let t = 0; t < 32; t += 2) {
                server.scheduleInTicks(t + 10, () => {
                    let x = omega_entity.x
                    let y = omega_entity.y + 24
                    let z = omega_entity.z
                    let count1 = Math.round(200 * particleIntensityFactor)
                    let count2 = Math.round(200 * particleIntensityFactor)
                    server.runCommandSilent(`particle minecraft:lava ${x} ${y - t * 0.8} ${z} 0.8 0.8 0.8 0.2 ${count1} force`)
                    server.runCommandSilent(`particle minecraft:lava ${x} ${y - t * 0.6} ${z} 6 3 6 2 ${count2} force`)
                })
            }
            
            // 爆炸闪电
            let ox = omega_entity.x
            let oy = omega_entity.y
            let oz = omega_entity.z

            if (level.isEmptyBlock(new BlockPos(ox, oy, oz))) {
                for (let dy = 1; dy <= searchRadius; dy++) {
                    oy = oy - dy
                    if (!level.isEmptyBlock(new BlockPos(ox, oy, oz))) break
                }
            }

            for (let t = 0; t < 6; t++) {
                server.scheduleInTicks(t * 3 + 32, () => {
                    let x = omega_entity.x
                    let y = omega_entity.y
                    let z = omega_entity.z

                    omega_entity.removeAllEffects()
                    level.createExplosion(x, y - 3, z)
                        .causesFire(true)
                        .strength(mainExplosionStrength)
                        .explosionMode("tnt")
                        .explode()

                    level.createExplosion(ox, oy - 3, oz)
                    .causesFire(true)
                    .strength(mainExplosionStrength)
                    .explosionMode("tnt")
                    .explode()
                    
                    let count1 = Math.round(200 * particleIntensityFactor)
                    let count2 = Math.round(400 * particleIntensityFactor)
                    server.runCommandSilent(`particle minecraft:lava ${x} ${y + 2} ${z} ${4} ${4} ${4} ${0.5} ${count2} force`)
                    server.runCommandSilent(`particle minecraft:explosion_emitter ${x} ${y - 2} ${z} ${6} ${6} ${6} ${2} ${count1} force`)
                    
                    let LP = new Set()
                    for (let i = 0; i < lightningCount; i++) {
                        let LX, LZ, LY, LPXYZ
                        do {
                            let angle = Math.random() * KMath.PI * 2
                            let radius = Math.sqrt(Math.random()) * lightningRadius
                            LX = Math.floor(Math.cos(angle) * radius) + x
                            LZ = Math.floor(Math.sin(angle) * radius) + z
                            LY = Math.floor(Math.random() * (lightningYOffset * 2 + 1)) - lightningYOffset + y
                            LPXYZ = `${LX},${LZ},${LY}`
                        } while (LP.has(LPXYZ))
                        LP.add(LPXYZ)
                        let blockPos = new BlockPos(LX, LY, LZ)
                        let randomLava = Math.random()
                        if (lavaRandom > randomLava) {
                            level.setBlock(blockPos, Blocks.LAVA.defaultBlockState(), 3)
                            server.runCommandSilent(`summon lightning_bolt ${LX} ${LY} ${LZ}`)
                            if (0.95 > randomLava) {
                                server.scheduleInTicks(120, () => {
                                    level.setBlock(blockPos, Blocks.AIR.defaultBlockState(), 3)
                                })
                            }
                        } else {
                            level.setBlock(blockPos, Blocks.AIR.defaultBlockState(), 3)
                            server.runCommandSilent(`summon lightning_bolt ${LX} ${LY} ${LZ}`)
                        }
                        let count3 = Math.round(200 * particleIntensityFactor)
                        server.runCommandSilent(`particle minecraft:electric_spark ${LX} ${LY + 2} ${LZ} 0.8 0.8 0.8 0.3 ${count3} force`)
                        
                        level.createExplosion(LX, LY - 3, LZ)
                            .strength(secondaryExplosionStrength)
                            .explosionMode("tnt")
                            .explode()
                    }
                })
            }

            // 矿物生成
            server.scheduleInTicks(47, () => {
                let R = oreGenerationRadius
                let ORE = [
                    { block: 'deepslate_coal_ore', weight: 15 },
                    { block: 'nether_quartz_ore', weight: 15 },
                    { block: 'deepslate_lapis_ore', weight: 15 },
                    { block: 'deepslate_copper_ore', weight: 15 },
                    { block: 'deepslate_iron_ore', weight: 12 },
                    { block: 'deepslate_gold_ore', weight: 12 },
                    { block: 'deepslate_redstone_ore', weight: 12 },
                    { block: 'deepslate_emerald_ore', weight: 2 },
                    { block: 'deepslate_diamond_ore', weight: 1 },
                    { block: 'ancient_debris', weight: 1 }
                ]
                
                let centerY = oy - 1
                
                for (let dx = -R; dx <= R; dx++) {
                    for (let dy = -R; dy <= R; dy++) {
                        for (let dz = -R; dz <= R; dz++) {
                            if (dx * dx + dy * dy + dz * dz > R * R) continue
                            
                            let blockPos = new BlockPos(ox + dx, centerY + dy, oz + dz)
                            let selected = Block.BLACKSTONE
                            if (Math.random() < 0.6) {
                                let rand = Math.random() * 100
                                let accumulated = 0
                                for (let ore of ORE) {
                                    accumulated += ore.weight
                                    if (rand <= accumulated) {
                                        selected = Block[ore.block.toUpperCase()]
                                        break
                                    }
                                }
                            }
                            level.setBlock(blockPos, selected.defaultBlockState(), 3)
                        }
                    }
                }
            })
            
            // 额外爆点
            for (let i = 0; i < explosionCount; i++) {
                let x = omega_entity.x
                let y = omega_entity.y
                let z = omega_entity.z
                let angle = Math.random() * KMath.PI * 2
                let radius = Math.sqrt(Math.random()) * searchRadius
                let offsetX = Math.floor(Math.cos(angle) * radius)
                let offsetZ = Math.floor(Math.sin(angle) * radius)
                let ex = x + offsetX
                let ez = z + offsetZ
                
                // 高度搜索
                let extraPos = new BlockPos(ex, y, ez)
                let foundValidPos = false
                
                if (!level.isEmptyBlock(extraPos)) {
                    for (let dy = 1; dy <= searchRadius; dy++) {
                        let newY = y + dy
                        let testPos = new BlockPos(ex, newY, ez)
                        if (level.isEmptyBlock(testPos)) {
                            extraPos = testPos
                            foundValidPos = true
                            break
                        }
                    }
                } else {
                    for (let dy = 1; dy <= searchRadius; dy++) {
                        let newY = y - dy
                        let testPos = new BlockPos(ex, newY, ez)
                        if (!level.isEmptyBlock(testPos)) {
                            extraPos = new BlockPos(ex, newY + 1, ez)
                            foundValidPos = true
                            break
                        }
                    }
                }
                
                if (!foundValidPos) {
                    extraPos = new BlockPos(ex, y, ez)
                }
                
                let extraY = extraPos.getY()
                
                // 陨石粒子
                for (let t = 0; t < 32; t += 2) {
                    server.scheduleInTicks(t + 10, () => {
                        let particleStartY = extraPos.getY() + 24
                        let count1 = Math.round(60 * particleIntensityFactor)
                        let count2 = Math.round(600 * particleIntensityFactor)
                        server.runCommandSilent(`particle minecraft:lava ${ex} ${particleStartY - t * 0.8} ${ez} 0.8 0.8 0.8 0.2 ${count1} force`)
                        server.runCommandSilent(`particle minecraft:lava ${ex} ${particleStartY - t * 0.6} ${ez} 8 6 8 4 ${count2} force`)
                    })
                }
                
                // 爆炸闪电
                for (let t = 0; t < 6; t++) {
                    server.scheduleInTicks(t * 3 + 32, () => {
                        let centerX = ex
                        let centerZ = ez
                        let centerY = extraY
                        level.createExplosion(ex, extraY - 3, ez)
                            .causesFire(true)
                            .strength(mainExplosionStrength)
                            .explosionMode("tnt")
                            .explode()
                        
                        let count1 = Math.round(60 * particleIntensityFactor)
                        let count2 = Math.round(20 * particleIntensityFactor)
                        server.runCommandSilent(`particle minecraft:lava ${ex} ${extraPos.getY()+2} ${ez} 4 4 4 0.5 ${count2} force`)
                        server.runCommandSilent(`particle minecraft:explosion_emitter ${ex} ${extraPos.getY() - 2} ${ez} 6 6 6 2 ${count1} force`)
                        
                        let LP = new Set()
                        for (let j = 0; j < lightningCount; j++) {
                            let LX, LZ, LY, LPXYZ
                            do {
                                let angle = Math.random() * KMath.PI * 2
                                let radius = Math.sqrt(Math.random()) * lightningRadius
                                LX = Math.floor(Math.cos(angle) * radius) + centerX
                                LZ = Math.floor(Math.sin(angle) * radius) + centerZ
                                LY = Math.floor(Math.random() * (lightningYOffset * 2 + 1)) - lightningYOffset + centerY
                                LPXYZ = `${LX},${LZ},${LY}`
                            } while (LP.has(LPXYZ))
                            
                            LP.add(LPXYZ)
                            
                            let blockPos = new BlockPos(LX, LY, LZ)
                            if (Math.random() < lavaRandom) {
                                level.setBlock(blockPos, Blocks.LAVA.defaultBlockState(), 3)
                                server.runCommandSilent(`summon lightning_bolt ${LX} ${LY} ${LZ}`)
                                if (0.95 > Math.random()) {
                                    server.scheduleInTicks(120, () => {
                                        level.setBlock(blockPos, Blocks.AIR.defaultBlockState(), 3)
                                    })
                                }
                            } else {
                                level.setBlock(blockPos, Blocks.AIR.defaultBlockState(), 3)
                                server.runCommandSilent(`summon lightning_bolt ${LX} ${LY} ${LZ}`)
                            }
                            
                            let count3 = Math.round(50 * particleIntensityFactor)
                            server.runCommandSilent(`particle minecraft:electric_spark ${LX} ${LY + 2} ${LZ} 0.8 0.8 0.8 0.3 ${count3} force`)
                            
                            level.createExplosion(LX, LY - 3, LZ)
                                .strength(secondaryExplosionStrength)
                                .explosionMode("tnt")
                                .explode()
                        }
                    })
                }
                
                // 矿物生成
                server.scheduleInTicks(47, () => {
                    let R = oreGenerationRadius - 2
                    let ORE = [
                        { block: 'deepslate_coal_ore', weight: 15 },
                        { block: 'nether_quartz_ore', weight: 15 },
                        { block: 'deepslate_lapis_ore', weight: 15 },
                        { block: 'deepslate_copper_ore', weight: 15 },
                        { block: 'deepslate_iron_ore', weight: 12 },
                        { block: 'deepslate_gold_ore', weight: 12 },
                        { block: 'deepslate_redstone_ore', weight: 12 },
                        { block: 'deepslate_emerald_ore', weight: 2 },
                        { block: 'deepslate_diamond_ore', weight: 1 },
                        { block: 'ancient_debris', weight: 1 }
                    ]
                    
                    let centerY = extraPos.getY() + oreGenerationYOffset
                    
                    for (let dx = -R; dx <= R; dx++) {
                        for (let dy = -R; dy <= R; dy++) {
                            for (let dz = -R; dz <= R; dz++) {
                                if (dx * dx + dy * dy + dz * dz > R * R) continue
                                
                                let blockPos = new BlockPos(ex + dx, centerY + dy, ez + dz)
                                let selected = Block.BLACKSTONE
                                if (Math.random() < 0.6) {
                                    let rand = Math.random() * 100
                                    let accumulated = 0
                                    for (let ore of ORE) {
                                        accumulated += ore.weight
                                        if (rand <= accumulated) {
                                            selected = Block[ore.block.toUpperCase()]
                                            break
                                        }
                                    }
                                }
                                level.setBlock(blockPos, selected.defaultBlockState(), 3)
                            }
                        }
                    }
                })
            }
            server.scheduleInTicks(Math.max(minDelayBetweenExplosions, baseDelayBetweenExplosions + Math.random() * delayFluctuation * 2 - delayFluctuation - crazyExplosions * index), () => {
                index++
                omega()
            })
        }
        // 你牛大了
        omega()
    }
}
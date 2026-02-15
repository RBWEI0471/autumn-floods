// priority:10

// 命名空间
function RL(string) {
    let length = string.length()
    let firstChar = string.charAt(0)
    let lastChar = string.charAt(length - 1)
    if (firstChar !== lastChar) {
        return string
    }
    if (firstChar === "'" || firstChar === '"') {
        return string.substring(1, length - 1)
    }
    return string
}

// 指定伤害
function typeHurt(level, player, entity, type, num) {
    if (player !== null && player.isPlayer()) {
        let overcast = ResourceKey.create(Registries.DAMAGE_TYPE, new ResourceLocation(type))
        let dmgTypeRegistry = level.registryAccess().registryOrThrow(Registries.DAMAGE_TYPE)
        let dmgType = dmgTypeRegistry.getHolderOrThrow(overcast)
        let source = new DamageSource(dmgType, player, player)
        entity.attack(source, num)
    } else {
        entity.attack(num)
    }
}

// 强制死亡
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

function Args(stack, n, keep) {
    if (stack.length < n) throw MishapNotEnoughArgs(n, stack.length)
    this.data = stack[keep ? 'slice' : 'splice'](-n)
}

let _buildGetter = (key, keyMishap) => {
    keyMishap = keyMishap || key
    keyMishap = 'class.' + keyMishap
    return function (i) {
        let iota = this.data[i]
        let res = iota[key]
        if (res === undefined) throw MishapInvalidIota.of(iota, this.data.length - i - 1, keyMishap)
        return res
    }
}

Args.prototype = {
    get(i) {
        return this.data[i]
    },
    brainmerge_target(i) {
        let entity = this.entity(i)
        if (entity instanceof AbstractVillager || entity instanceof Raider) return entity
        throw MishapInvalidIota.of(this.data[i], this.data.length - i - 1, 'class.entity.brainmerge_target')
    },
    villager(i) {
        let entity = this.entity(i)
        if (entity instanceof Villager) return entity
        throw MishapInvalidIota.of(this.data[i], this.data.length - i - 1, 'class.entity.villager')
    }
}

for (let pair of ['double', 'entity', 'list', 'string', 'pattern', 'vec3/vector', 'bool/boolean']) {
    let [key, keyMishap] = pair.split('/')
    Args.prototype[key] = _buildGetter(key, keyMishap)
}

function ActionJS(id, pattern, options) {
    const { sound } = options || {}
    let actionProto = {
        operate(env, img, cont) {
            let stack = img.stack
            if (stack.toArray) stack = stack.toArray()
            stack = Array.from(stack) // always copy for mishap recover
            try {
                let returnObject = global.PatternOperateMap[id](stack, env, img, cont) || [] // for evil purpose
                let sideEffects
                if (returnObject.push) sideEffects = returnObject
                else {
                    cont = returnObject.newCont || cont
                    sideEffects = returnObject.sideEffects || []
                }
                let newImg = img.copy(
                    stack,
                    img.parenCount,
                    img.parenthesized,
                    img.escapeNext,
                    returnObject.opsConsumed || img.opsConsumed + 1,
                    img.userData,
                )
                return OperationResult(newImg, sideEffects, cont, sound || HexEvalSounds.NORMAL_EXECUTE)
            } catch (e) {
                if (e instanceof Mishap) {
                    let mishapName = Text.translate(`hexcasting.action.homo:${id}`).aqua()
                    let mishapEffect = OperatorSideEffect.DoMishap(e, Mishap.Context(pattern, mishapName))
                    mishapEffect.performEffect(CastingVM(img, env))
                    let newImg = img.copy(img.stack, img.parenCount, img.parenthesized, img.escapeNext, 0, img.userData)
                    while (cont.next) cont = cont.next // stop anyway
                    return OperationResult(newImg, [mishapEffect], cont, HexEvalSounds.MISHAP)
                }
                throw e
            }
        },
    }
    return new JavaAdapter(Action, actionProto)
}

ActionJS.helpers = {
    assertVecInRange(ctx, vec) {
        if (!ctx.isVecInWorld(vec)) throw new MishapBadLocation(vec, 'out_of_world')
        if (!ctx.isVecInRange(vec)) throw new MishapBadLocation(vec, 'too_far')
    },
    assertEntityInRange(ctx, entity) {
        if (!ctx.isEntityInRange(entity)) throw new MishapEntityTooFarAway(entity)
    }
}
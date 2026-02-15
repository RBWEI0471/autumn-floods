// priority:10

// net.minecraft 相关
let Blocks = Java.loadClass('net.minecraft.world.level.block.Blocks')
let LivingEntity = Java.loadClass('net.minecraft.world.entity.LivingEntity')
let NearestAttackableTargetGoal = Java.loadClass('net.minecraft.world.entity.ai.goal.target.NearestAttackableTargetGoal')
let TicketType = Java.loadClass('net.minecraft.server.level.TicketType')
let ServerLevel = Java.loadClass('net.minecraft.server.level.ServerLevel')
let Level = Java.loadClass('net.minecraft.world.level.Level')
let LazyOptional = Java.loadClass('net.minecraftforge.common.util.LazyOptional')
let SoundEvents = Java.loadClass('net.minecraft.sounds.SoundEvents')
let SoundSource = Java.loadClass('net.minecraft.sounds.SoundSource')
let Mob = Java.loadClass('net.minecraft.world.entity.Mob')
let SpectralArrow = Java.loadClass('net.minecraft.world.entity.projectile.SpectralArrow')
let Raider = Java.loadClass('net.minecraft.world.entity.raid.Raider')
let AbstractVillager = Java.loadClass('net.minecraft.world.entity.npc.AbstractVillager')
let Villager = Java.loadClass('net.minecraft.world.entity.npc.Villager')
let VillagerTrades = Java.loadClass('net.minecraft.world.entity.npc.VillagerTrades')
let IntegerProperty = Java.loadClass('net.minecraft.world.level.block.state.properties.IntegerProperty')
let DoubleTag = Java.loadClass('net.minecraft.nbt.DoubleTag')
let FloatTag = Java.loadClass('net.minecraft.nbt.FloatTag')
let LongTag = Java.loadClass('net.minecraft.nbt.LongTag')
let ShortTag = Java.loadClass('net.minecraft.nbt.ShortTag')
let ByteTag = Java.loadClass('net.minecraft.nbt.ByteTag')
let TagParser = Java.loadClass('net.minecraft.nbt.TagParser')
let StringTag = Java.loadClass('net.minecraft.nbt.StringTag')
let ListTag = Java.loadClass('net.minecraft.nbt.ListTag')
let IntTag = Java.loadClass('net.minecraft.nbt.IntTag')
let NbtUtils = Java.loadClass('net.minecraft.nbt.NbtUtils')
let BlockPos = Java.loadClass('net.minecraft.core.BlockPos')
let Direction = Java.loadClass('net.minecraft.core.Direction')
let Container = Java.loadClass('net.minecraft.world.Container')
let UseOnContext = Java.loadClass('net.minecraft.world.item.context.UseOnContext')
let Block = Java.loadClass('net.minecraft.world.level.block.Blocks')
let ItemStack = Java.loadClass('net.minecraft.world.item.ItemStack')
let MobEffect = Java.loadClass('net.minecraft.world.effect.MobEffect')
let Rarity = Java.loadClass("net.minecraft.world.item.Rarity")
let InteractionHand = Java.loadClass('net.minecraft.world.InteractionHand')
let BlockHitResult = Java.loadClass('net.minecraft.world.phys.BlockHitResult')
let WorldlyContainer = Java.loadClass('net.minecraft.world.WorldlyContainer')
let RecipeType = Java.loadClass('net.minecraft.world.item.crafting.RecipeType')
let CraftingMenu = Java.loadClass('net.minecraft.world.inventory.CraftingMenu')
let MeleeAttackGoal = Java.loadClass("net.minecraft.world.entity.ai.goal.MeleeAttackGoal")
let ContainerLevelAccess = Java.loadClass('net.minecraft.world.inventory.ContainerLevelAccess')
let CompoundTag = Java.loadClass("net.minecraft.nbt.CompoundTag")
let DamageSource = Java.loadClass('net.minecraft.world.damagesource.DamageSource')
let Registries = Java.loadClass('net.minecraft.core.registries.Registries')
let ResourceKey = Java.loadClass('net.minecraft.resources.ResourceKey')
let ResourceLocation = Java.loadClass('net.minecraft.resources.ResourceLocation')
let BlockEntity = Java.loadClass('net.minecraft.world.level.block.entity.BlockEntity')
let BlockEntityType = Java.loadClass('net.minecraft.world.level.block.entity.BlockEntityType')
let EntityTypeTags = Java.loadClass('net.minecraft.tags.EntityTypeTags')
let MobType = Java.loadClass('net.minecraft.world.entity.MobType')
let AABB = Java.loadClass('net.minecraft.world.phys.AABB')
let TransientCraftingContainer = Java.loadClass('net.minecraft.world.inventory.TransientCraftingContainer')

// java 相关
let Long = Java.loadClass('java.lang.Long')
let Boolean = Java.loadClass('java.lang.Boolean')
let Integer = Java.loadClass('java.lang.Integer')
let WeakHashMap = Java.loadClass('java.util.WeakHashMap')

// at.petrak.hexcasting.common 相关
let HexIotaTypes = Java.loadClass('at.petrak.hexcasting.common.lib.hex.HexIotaTypes')
let BrainsweepRecipe = Java.loadClass('at.petrak.hexcasting.common.recipe.BrainsweepRecipe')
let HexRecipeStuffRegistry = Java.loadClass('at.petrak.hexcasting.common.recipe.HexRecipeStuffRegistry')
let ItemSpellbook = Java.loadClass('at.petrak.hexcasting.common.items.storage.ItemSpellbook')
let AccessorWrappers = Java.loadClass('at.petrak.hexcasting.ktxt.AccessorWrappers')
let HexCapabilities = Java.loadClass('at.petrak.hexcasting.forge.cap.HexCapabilities')
let CapStaticMediaHolder = Java.loadClass('at.petrak.hexcasting.forge.cap.adimpl.CapStaticMediaHolder')
let IXplatAbstractions = Java.loadClass('at.petrak.hexcasting.xplat.IXplatAbstractions')
let HexEvalSounds = Java.loadClass('at.petrak.hexcasting.common.lib.hex.HexEvalSounds')

// at.petrak.hexcasting.api.casting 相关
let ParticleSpray = Java.loadClass('at.petrak.hexcasting.api.casting.ParticleSpray')
let SpellList = Java.loadClass('at.petrak.hexcasting.api.casting.SpellList')
let RenderedSpell = Java.loadClass('at.petrak.hexcasting.api.casting.RenderedSpell')
let OperatorUtils = Java.loadClass('at.petrak.hexcasting.api.casting.OperatorUtils')
let ActionRegistryEntry = Java.loadClass('at.petrak.hexcasting.api.casting.ActionRegistryEntry')

// at.petrak.hexcasting.api.casting.castables 相关
let Action = Java.loadClass('at.petrak.hexcasting.api.casting.castables.Action')
let ConstMediaAction = Java.loadClass('at.petrak.hexcasting.api.casting.castables.ConstMediaAction')
let OperationAction = Java.loadClass('at.petrak.hexcasting.api.casting.castables.OperationAction')
let SpecialHandler = Java.loadClass('at.petrak.hexcasting.api.casting.castables.SpecialHandler')
let SpellAction = Java.loadClass('at.petrak.hexcasting.api.casting.castables.SpellAction')

// at.petrak.hexcasting.api.casting.eval 相关
let CastingEnvironment = Java.loadClass('at.petrak.hexcasting.api.casting.eval.CastingEnvironment')
let OperationResult = Java.loadClass('at.petrak.hexcasting.api.casting.eval.OperationResult')
let CastResult = Java.loadClass('at.petrak.hexcasting.api.casting.eval.CastResult')
let CastingEnvironmentComponent = Java.loadClass('at.petrak.hexcasting.api.casting.eval.CastingEnvironmentComponent')

// at.petrak.hexcasting.api.casting.eval.vm 相关
let CastingImage = Java.loadClass('at.petrak.hexcasting.api.casting.eval.vm.CastingImage')
let CastingVM = Java.loadClass('at.petrak.hexcasting.api.casting.eval.vm.CastingVM')
let FrameEvaluate = Java.loadClass('at.petrak.hexcasting.api.casting.eval.vm.FrameEvaluate')
let FrameFinishEval = Java.loadClass('at.petrak.hexcasting.api.casting.eval.vm.FrameFinishEval')
let SpellContinuation = Java.loadClass('at.petrak.hexcasting.api.casting.eval.vm.SpellContinuation')

// at.petrak.hexcasting.api.casting.eval.sideeffects 相关
let EvalSound = Java.loadClass('at.petrak.hexcasting.api.casting.eval.sideeffects.EvalSound')
let OperatorSideEffect = Java.loadClass('at.petrak.hexcasting.api.casting.eval.sideeffects.OperatorSideEffect')

// at.petrak.hexcasting.api.casting.eval.env 相关
let PackagedItemCastEnv = Java.loadClass('at.petrak.hexcasting.api.casting.eval.env.PackagedItemCastEnv')
let PlayerBasedCastEnv = Java.loadClass('at.petrak.hexcasting.api.casting.eval.env.PlayerBasedCastEnv')
let StaffCastEnv = Java.loadClass('at.petrak.hexcasting.api.casting.eval.env.StaffCastEnv')
let CircleCastEnv = Java.loadClass('at.petrak.hexcasting.api.casting.eval.env.CircleCastEnv')

// at.petrak.hexcasting.api.casting.iota 相关
let Iota = Java.loadClass('at.petrak.hexcasting.api.casting.iota.Iota')
let IotaType = Java.loadClass('at.petrak.hexcasting.api.casting.iota.IotaType')
let NullIota = Java.loadClass('at.petrak.hexcasting.api.casting.iota.NullIota')
let GarbageIota = Java.loadClass('at.petrak.hexcasting.api.casting.iota.GarbageIota')
let BooleanIota = Java.loadClass('at.petrak.hexcasting.api.casting.iota.BooleanIota')
let ContinuationIota = Java.loadClass('at.petrak.hexcasting.api.casting.iota.ContinuationIota')
let EntityIota = Java.loadClass('at.petrak.hexcasting.api.casting.iota.EntityIota')
let Vec3Iota = Java.loadClass('at.petrak.hexcasting.api.casting.iota.Vec3Iota')
let ListIota = Java.loadClass('at.petrak.hexcasting.api.casting.iota.ListIota')
let DoubleIota = Java.loadClass('at.petrak.hexcasting.api.casting.iota.DoubleIota')
let PatternIota = Java.loadClass('at.petrak.hexcasting.api.casting.iota.PatternIota')

// at.petrak.hexcasting.api.casting.mishaps 相关
let Mishap = Java.loadClass('at.petrak.hexcasting.api.casting.mishaps.Mishap')
let MishapAlreadyBrainswept = Java.loadClass('at.petrak.hexcasting.api.casting.mishaps.MishapAlreadyBrainswept')
let MishapBadBlock = Java.loadClass('at.petrak.hexcasting.api.casting.mishaps.MishapBadBlock')
let MishapBadBrainsweep = Java.loadClass('at.petrak.hexcasting.api.casting.mishaps.MishapBadBrainsweep')
let MishapBadCaster = Java.loadClass('at.petrak.hexcasting.api.casting.mishaps.MishapBadCaster')
let MishapBadEntity = Java.loadClass('at.petrak.hexcasting.api.casting.mishaps.MishapBadEntity')
let MishapBadItem = Java.loadClass('at.petrak.hexcasting.api.casting.mishaps.MishapBadItem')
let MishapBadLocation = Java.loadClass('at.petrak.hexcasting.api.casting.mishaps.MishapBadLocation')
let MishapBadOffhandItem = Java.loadClass('at.petrak.hexcasting.api.casting.mishaps.MishapBadOffhandItem')
let MishapDisallowedSpell = Java.loadClass('at.petrak.hexcasting.api.casting.mishaps.MishapDisallowedSpell')
let MishapDivideByZero = Java.loadClass('at.petrak.hexcasting.api.casting.mishaps.MishapDivideByZero')
let MishapEntityTooFarAway = Java.loadClass('at.petrak.hexcasting.api.casting.mishaps.MishapEntityTooFarAway')
let MishapEvalTooMuch = Java.loadClass('at.petrak.hexcasting.api.casting.mishaps.MishapEvalTooMuch')
let MishapImmuneEntity = Java.loadClass('at.petrak.hexcasting.api.casting.mishaps.MishapImmuneEntity')
let MishapInternalException = Java.loadClass('at.petrak.hexcasting.api.casting.mishaps.MishapInternalException')
let MishapInvalidIota = Java.loadClass('at.petrak.hexcasting.api.casting.mishaps.MishapInvalidIota')
let MishapInvalidOperatorArgs = Java.loadClass('at.petrak.hexcasting.api.casting.mishaps.MishapInvalidOperatorArgs')
let MishapInvalidPattern = Java.loadClass('at.petrak.hexcasting.api.casting.mishaps.MishapInvalidPattern')
let MishapInvalidSpellDatumType = Java.loadClass('at.petrak.hexcasting.api.casting.mishaps.MishapInvalidSpellDatumType')
let MishapLocationInWrongDimension = Java.loadClass('at.petrak.hexcasting.api.casting.mishaps.MishapLocationInWrongDimension')
let MishapNoAkashicRecord = Java.loadClass('at.petrak.hexcasting.api.casting.mishaps.MishapNoAkashicRecord')
let MishapNotEnoughArgs = Java.loadClass('at.petrak.hexcasting.api.casting.mishaps.MishapNotEnoughArgs')
let MishapNotEnoughMedia = Java.loadClass('at.petrak.hexcasting.api.casting.mishaps.MishapNotEnoughMedia')
let MishapOthersName = Java.loadClass('at.petrak.hexcasting.api.casting.mishaps.MishapOthersName')
let MishapStackSize = Java.loadClass('at.petrak.hexcasting.api.casting.mishaps.MishapStackSize')
let MishapTooManyCloseParens = Java.loadClass('at.petrak.hexcasting.api.casting.mishaps.MishapTooManyCloseParens')
let MishapUnenlightened = Java.loadClass('at.petrak.hexcasting.api.casting.mishaps.MishapUnenlightened')
let MishapUnescapedValue = Java.loadClass('at.petrak.hexcasting.api.casting.mishaps.MishapUnescapedValue')

// ram.talia.hexal.xplat.IXplatAbstractions 相关
let HexalIXplatAbstractions = Java.loadClass('ram.talia.hexal.xplat.IXplatAbstractions')

// at.petrak.hexcasting.api.casting.math 相关
let HexDir = Java.loadClass('at.petrak.hexcasting.api.casting.math.HexDir')
let HexPattern = Java.loadClass('at.petrak.hexcasting.api.casting.math.HexPattern')
let EulerPathFinder = Java.loadClass('at.petrak.hexcasting.api.casting.math.EulerPathFinder')

// ram.talia.hexal.api.casting.mishaps 相关
let MishapNoBoundStorage = Java.loadClass('ram.talia.hexal.api.casting.mishaps.MishapNoBoundStorage')
let MishapStorageFull = Java.loadClass('ram.talia.hexal.api.casting.mishaps.MishapStorageFull')

// ram.talia.hexal.api.casting.castables 相关
let UserDataConstMediaAction = Java.loadClass('ram.talia.hexal.api.casting.castables.UserDataConstMediaAction')

// ram.talia.hexal.api.casting.iota 相关
let GateIota = Java.loadClass('ram.talia.hexal.api.casting.iota.GateIota')
let MoteIota = Java.loadClass('ram.talia.hexal.api.casting.iota.MoteIota')

// ram.talia.hexal.api.mediafieditems 相关
let ItemRecord = Java.loadClass('ram.talia.hexal.api.mediafieditems.ItemRecord')
let MediafiedItemManager = Java.loadClass('ram.talia.hexal.api.mediafieditems.MediafiedItemManager')

// ram.talia.moreiotas.common.lib.hex 相关
let MoreIotasActions = Java.loadClass('ram.talia.moreiotas.common.lib.hex.MoreIotasActions')
let MoreIotasArithmetics = Java.loadClass('ram.talia.moreiotas.common.lib.hex.MoreIotasArithmetics')

// ram.talia.moreiotas.api.mod 相关
let MoreIotasConfig = Java.loadClass('ram.talia.moreiotas.api.mod.MoreIotasConfig')

// ram.talia.moreiotas.api.casting.iota 相关
let MatrixIota = Java.loadClass('ram.talia.moreiotas.api.casting.iota.MatrixIota')
let StringIota = Java.loadClass('ram.talia.moreiotas.api.casting.iota.StringIota')

// io.yukkuric.hexop.ext.SilencedCastingEnv 相关
let SilencedCastingEnv = Java.loadClass('io.yukkuric.hexop.ext.SilencedCastingEnv')
// Open Menu Button - server_scripts

let $SimpleMenuProvider = Java.loadClass("net.minecraft.world.SimpleMenuProvider")
let $CraftingMenu = Java.loadClass("net.minecraft.world.inventory.CraftingMenu")
let $StonecutterMenu = Java.loadClass("net.minecraft.world.inventory.StonecutterMenu")
let $AnvilMenu = Java.loadClass("net.minecraft.world.inventory.AnvilMenu")
let $ChestMenu = Java.loadClass("net.minecraft.world.inventory.ChestMenu")
let $Optional = Java.loadClass("java.util.Optional")

//工作台
NetworkEvents.dataReceived("crafting_table", (event) => {
    const { player, level } = event
    player.openMenu(
        new $SimpleMenuProvider(
            (i, inv, p) =>
                new $CraftingMenu(i, inv, (func) => {
                    func.apply(level, player.blockPosition())
                    return $Optional.empty()
                }),
            Component.translatable("工作台")
        )
    )
})

//末影箱
NetworkEvents.dataReceived("enderchest", (event) => {
    const { player, level } = event
    player.openInventoryGUI(player.enderChestInventory, Component.translatable("container.enderchest"))
})

//垃圾桶
NetworkEvents.dataReceived("trashcan", (event) => {
    const { player, level } = event
    player.openMenu(
        new $SimpleMenuProvider(
            (i, inv, p) => $ChestMenu.sixRows(i, inv),
            Component.translatable("垃圾桶")
        )
    )
})

//切石机
NetworkEvents.dataReceived("stonecutter", (event) => {
    const { player, level } = event
    player.openMenu(
        new $SimpleMenuProvider(
            (i, inv, p) =>
                new $StonecutterMenu(i, inv, (func) => {
                    func.apply(level, player.blockPosition())
                    return $Optional.empty()
                }),
            Component.translatable("切石机")
        )
    )
})


//铁砧
NetworkEvents.dataReceived("anvil", (event) => {
    const { player, level } = event
    player.openMenu(
        new $SimpleMenuProvider(
            (i, inv, p) =>
                new $AnvilMenu(i, inv, (func) => {
                    func.apply(level, player.blockPosition())
                    return $Optional.empty()
                }),
            Component.translatable("铁砧")
        )
    )
})
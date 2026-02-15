ItemEvents.entityInteracted(event => {
    const { player, target, hand } = event

    if (hand === 'MAIN_HAND' && player.mainHandItem.id === 'hexcasting:uuid_colorizer') {
        console.log(target.type)
        if (target.type == "minecraft:parrot") {
            event.player.mainHandItem.count-=1
            event.getPlayer().getInventory().add('hexcasting:pride_colorizer_aroace')
        }
        if (target.type == "minecraft:axolotl") {
            event.player.mainHandItem.count-=1
            event.getPlayer().getInventory().add('hexcasting:pride_colorizer_pansexual')
        }
        if (target.type == "minecraft:cat") {
            event.player.mainHandItem.count-=1
            event.getPlayer().getInventory().add('hexcasting:pride_colorizer_lesbian')
        }
        if (target.type == "minecraft:snow_golem") {
            event.player.mainHandItem.count-=1
            event.getPlayer().getInventory().add('hexcasting:pride_colorizer_genderfluid')
        }
        if (target.type == "minecraft:dolphin") {
            event.player.mainHandItem.count-=1
            event.getPlayer().getInventory().add('hexcasting:pride_colorizer_bisexual')
        }
        if (target.type == "minecraft:fox") {
            event.player.mainHandItem.count-=1
            event.getPlayer().getInventory().add('hexcasting:pride_colorizer_gay')
        }
        if (target.type == "minecraft:ocelot") {
            event.player.mainHandItem.count-=1
            event.getPlayer().getInventory().add('hexcasting:pride_colorizer_intersex')
        }
    }
})

ServerEvents.recipes(event => {
    event.shaped(
        Item.of('hexcasting:dye_colorizer_red'),
        [
            ' A ',
            'ABA',
            ' A '
        ],
        {
            B: 'hexcasting:amethyst_dust',
            A: 'minecraft:redstone'
        }
    )
    event.shaped(
        Item.of('hexcasting:dye_colorizer_orange'),
        [
            ' A ',
            'ABA',
            ' A '
        ],
        {
            B: 'hexcasting:amethyst_dust',
            A: 'minecraft:copper_ingot'
        }
    )
    event.shaped(
        Item.of('hexcasting:dye_colorizer_yellow'),
        [
            ' A ',
            'ABA',
            ' A '
        ],
        {
            A: 'minecraft:gold_ingot',
            B: 'hexcasting:amethyst_dust'
        }
    )
    event.shaped(
        Item.of('hexcasting:dye_colorizer_green'),
        [
            ' A ',
            'ABA',
            ' A '
        ],
        {
            B: 'hexcasting:amethyst_dust',
            A: 'minecraft:emerald'
        }
    )
    event.shaped(
        Item.of('hexcasting:dye_colorizer_cyan'),
        [
            ' A ',
            'ABA',
            ' A '
        ],
        {
            A: 'minecraft:prismarine_crystals',
            B: 'hexcasting:amethyst_dust'
        }
    )
    event.shaped(
        Item.of('hexcasting:dye_colorizer_blue'),
        [
            ' A ',
            'ABA',
            ' A '
        ],
        {
            B: 'hexcasting:amethyst_dust',
            A: 'minecraft:lapis_lazuli'
        }
    )
    event.shaped(
        Item.of('hexcasting:dye_colorizer_purple'),
        [
            ' A ',
            'ABA',
            ' A '
        ],
        {
            B: 'hexcasting:amethyst_dust',
            A: 'minecraft:amethyst_shard'
        }
    )
    event.shaped(
        Item.of('hexcasting:dye_colorizer_white'),
        [
            ' A ',
            'ABA',
            ' A '
        ],
        {
            B: 'hexcasting:amethyst_dust',
            A: 'minecraft:quartz'
        }
    )
    event.shaped(
        Item.of('hexcasting:dye_colorizer_black'),
        [
            ' A ',
            'ABA',
            ' A '
        ],
        {
            B: 'hexcasting:amethyst_dust',
            A: 'minecraft:coal'
        }
    )
});
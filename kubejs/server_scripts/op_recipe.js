//原版配方
ServerEvents.recipes(event => {
    
    //珠宝匠锤
    event.shaped(Item.of('hexcasting:jeweler_hammer', '{Unbreakable:1b}').enchant('minecraft:fortune', 2),
            [
                    ' AB',
                    ' ED',
                    'E  '
            ],
            {
                    B: 'minecraft:flint',
                    D: 'minecraft:leather',
                    A: 'minecraft:iron_ingot',
                    E: 'minecraft:amethyst_shard'
            }
    )
    //钓竿
    event.shaped(
            Item.of('minecraft:fishing_rod').enchant('minecraft:lure', 3),
            [
                    '  A',
                    ' AB',
                    'A B'
            ],
            {
                    A: 'minecraft:stick',
                    B: 'minecraft:string'
            }
    )
    
    //不毁石镐
    event.shaped(
            Item.of('minecraft:stone_pickaxe', '{Unbreakable:1b}').enchant('minecraft:silk_touch', 1),
            [
                    'AAA',
                    ' B ',
                    ' B '
            ],
            {
                    A: 'hexcasting:slate',
                    B: 'minecraft:bone'
            }
    )
    
    //鞘翅
    event.shapeless(
        Item.of('minecraft:elytra', '{Unbreakable:1b}'),
        [
            'minecraft:elytra',
            'minecraft:dragon_head'
        ]
    )
    
    //末影珍珠
    event.shapeless(
        Item.of('minecraft:ender_pearl'),
        [
            'minecraft:diamond',
            'minecraft:redstone',
            'minecraft:amethyst_shard',
            'minecraft:lapis_lazuli'
        ]
    )
})

//模组配方
ServerEvents.recipes(event => {
    //制念台
    event.shaped(
        Item.of('hexdebug:enlightened_splicing_table'),
        [
            'ABA',
            'CDC',
            'EFE'
        ],
        {
            E: 'hexcasting:slate_block',
            D: 'hexcasting:quenched_allay_shard',
            C: 'minecraft:gold_ingot',
            A: 'hexcasting:charged_amethyst',
            B: 'hexcasting:artifact',
            F: 'minecraft:crying_obsidian'
        }
    )
    
    //无尽手杖
    event.shapeless(
        Item.of('constructionwand:infinity_wand', '{wand_options:{cores:["constructionwand:core_angel","constructionwand:core_destruction"],cores_sel:0b,lock:"nolock"}}'),
        [
            'minecraft:wooden_axe'
        ]
    )
})
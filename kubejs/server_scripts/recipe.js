//原版配方
ServerEvents.recipes(event => {
    //岩浆
    event.smelting(
        Item.of('minecraft:lava_bucket'),
        'quark:slime_in_a_bucket'
    )
    //鞍
    event.shaped(
            Item.of('minecraft:saddle'),
            [
                    '   ',
                    'AAA',
                    '   '
            ],
            {
                    A: 'minecraft:leather'
            }
    )
    //铁粒
    event.shaped(
            Item.of('minecraft:iron_nugget', 9),
            [
                    '   ',
                    ' A ',
                    '   '
            ],
            {
                    A: 'minecraft:iron_ingot'
            }
    )
    //荧光墨囊
    event.shapeless(
            Item.of('minecraft:glow_ink_sac'),
            [
                    'minecraft:ink_sac',
                    'minecraft:glowstone_dust'
            ]
    )
    //火把花
    event.shapeless(
            Item.of('kubejs:torchflower_seed', 3),
            [
                    'minecraft:torchflower'
            ]
    )
    //兔子皮
    event.shapeless(
            Item.of('minecraft:rabbit_hide', 4),
            [
                    'minecraft:leather'
            ]
    )
    //幻翼膜
    event.shapeless(
            Item.of('minecraft:phantom_membrane'),
            [
                    'minecraft:feather',
                    'minecraft:string'
            ]
    )
    //糖
    event.shapeless(
            Item.of('minecraft:sugar'),
            [
                    'minecraft:beetroot'
            ]
    )
    //甜菜根汤
    event.shapeless(
            Item.of('minecraft:beetroot_soup'),
            [
                    'minecraft:beetroot',
                    'minecraft:beetroot',
                    'minecraft:bowl'
            ]
    )
    //磁石
    event.shaped(
            Item.of('minecraft:lodestone', 2),
            [
                    ' A ',
                    ' B ',
                    ' A '
            ],
            {
                    A: 'minecraft:raw_iron',
                    B: 'minecraft:redstone'
            }
    )
    //灯笼
    event.shaped(
        Item.of('minecraft:lantern', 4),
        [
            ' A ',
            ' B ',
            ' C '
        ],
        {
            A: 'minecraft:iron_ingot',
            B: 'minecraft:chain',
            C: 'minecraft:coal',
        }
    )
    //灵魂灯笼
    event.shaped(
        Item.of('minecraft:soul_lantern', 4),
        [
            ' A ',
            ' B ',
            ' C '
        ],
        {
            C: 'minecraft:soul_sand',
            A: 'minecraft:iron_ingot',
            B: 'minecraft:chain',
        }
    )
    //铁链
    event.shaped(
        Item.of('minecraft:chain', 16),
        [
            '   ',
            ' A ',
            ' A '
        ],
        {
            A: 'minecraft:iron_ingot',
        }
    )
    //赭黄蛙明灯
    event.shapeless(
        Item.of('minecraft:ochre_froglight', 2),
        [
            'minecraft:horn_coral_block',
            'minecraft:ochre_froglight',
            'minecraft:horn_coral_block'
        ]
    )
    //青翠蛙明灯
    event.shapeless(
        Item.of('minecraft:verdant_froglight', 2),
        [
            'minecraft:tube_coral_block',
            'minecraft:verdant_froglight',
            'minecraft:tube_coral_block'
        ]
    )
    //珠光蛙明灯
    event.shapeless(
        Item.of('minecraft:pearlescent_froglight', 2),
        [
            'minecraft:brain_coral_block',
            'minecraft:pearlescent_froglight',
            'minecraft:brain_coral_block'
        ]
    )
    //物品展示框
    event.shaped(
        Item.of('minecraft:item_frame', 8),
        [
            'AAA',
            'ABA',
            'AAA'
        ],
        {
            A: 'hexcasting:slate',
            B: 'hexcasting:default_colorizer'
        }
    )
    //荧光物品展示框
    event.shaped(
        Item.of('minecraft:glow_item_frame', 8),
        [
            'ABA',
            'CDC',
            'EDE'
        ],
        {
            B: 'minecraft:glowstone_dust',
            C: 'minecraft:ink_sac',
            E: 'minecraft:leather',
            D: 'minecraft:paper',
            A: 'minecraft:stick'
        }
    )
    //深板岩
    event.shaped(
        Item.of('minecraft:deepslate', 8),
        [
            'AAA',
            'ABA',
            'AAA'
        ],
        {
            A: 'minecraft:stone',
            B: 'minecraft:coal'
        }
    )
    //切制铜块
    event.shaped(
        Item.of('minecraft:exposed_cut_copper', 4),
        [
            '   ',
            ' A ',
            '   '
        ],
        {
            A: 'minecraft:exposed_copper'
        }
    )
    //切制铜块
    event.shaped(
        Item.of('minecraft:weathered_cut_copper', 4),
        [
            '   ',
            ' A ',
            '   '
        ],
        {
            A: 'minecraft:weathered_copper'
        }
    )
    //切制铜块
    event.shaped(
        Item.of('minecraft:oxidized_cut_copper', 4),
        [
            '   ',
            ' A ',
            '   '
        ],
        {
            A: 'minecraft:oxidized_copper'
        }
    )
    //切制铜块
    event.shaped(
        Item.of('minecraft:waxed_cut_copper', 4),
        [
            '   ',
            ' A ',
            '   '
        ],
        {
            A: 'minecraft:waxed_copper_block'
        }
    )
    //切制铜块
    event.shaped(
        Item.of('minecraft:waxed_exposed_cut_copper', 4),
        [
            '   ',
            ' A ',
            '   '
        ],
        {
            A: 'minecraft:waxed_exposed_copper'
        }
    )
    //切制铜块
    event.shaped(
        Item.of('minecraft:waxed_weathered_cut_copper', 4),
        [
            '   ',
            ' A ',
            '   '
        ],
        {
            A: 'minecraft:waxed_weathered_copper'
        }
    )
    //切制铜块
    event.shaped(
        Item.of('minecraft:waxed_oxidized_cut_copper', 4),
        [
            '   ',
            ' A ',
            '   '
        ],
        {
            A: 'minecraft:waxed_oxidized_copper'
        }
    )
    //锁链头盔
    event.shaped(
        Item.of('minecraft:chainmail_helmet'),
        [
            'AAA',
            'A A',
            '   '
        ],
        {
            A: 'minecraft:copper_ingot'
        }
    )
    //锁链胸甲
    event.shaped(
        Item.of('minecraft:chainmail_chestplate'),
        [
            'A A',
            'AAA',
            'AAA'
        ],
        {
            A: 'minecraft:copper_ingot'
        }
    )
    //锁链护腿
    event.shaped(
        Item.of('minecraft:chainmail_leggings'),
        [
            'AAA',
            'A A',
            'A A'
        ],
        {
            A: 'minecraft:copper_ingot'
        }
    )
    //锁链靴子
    event.shaped(
        Item.of('minecraft:chainmail_boots'),
        [
            '   ',
            'A A',
            'A A'
        ],
        {
            A: 'minecraft:copper_ingot'
        }
    )
    //桶
    event.shaped(
        Item.of('minecraft:bucket'),
        [
            '   ',
            'A A',
            ' A '
        ],
        {
            A: 'minecraft:copper_ingot'
        }
    )
    //炼药锅
    event.shaped(
        Item.of('minecraft:cauldron'),
        [
            'A A',
            'A A',
            'AAA'
        ],
        {
            A: 'minecraft:copper_ingot'
        }
    )
    //漏斗
    event.shaped(
        Item.of('minecraft:hopper'),
        [
            'A A',
            'ABA',
            ' A '
        ],
        {
            B: '#minecraft:logs',
            A: 'minecraft:copper_ingot'
        }
    )
    //打火石
    event.shaped(
        Item.of('minecraft:flint_and_steel'),
        [
            ' A ',
            'B  ',
            '   '
        ],
        {
            B: 'minecraft:iron_ingot',
            A: 'minecraft:copper_ingot'
        }
    )
    //剪刀
    event.shaped(
        Item.of('minecraft:shears'),
        [
            ' A ',
            'A  ',
            '   '
        ],
        {
            A: 'minecraft:copper_ingot'
        }
    )
    //切石机
    event.shaped(
        Item.of('minecraft:stonecutter'),
        [
            '   ',
            'ABA',
            'CDC'
        ],
        {
            D: 'minecraft:stone',
            C: '#minecraft:planks',
            A: 'minecraft:iron_ingot',
            B: 'minecraft:piston'
        }
    )
});

//模组配方
ServerEvents.recipes(event => {
    //紫水晶碎片
    event.shaped(
        Item.of('minecraft:amethyst_shard', 2),
        [
            '   ',
            ' A ',
            '   '
        ],
        {
            A: 'hexcasting:charged_amethyst'
        }
    )
    //紫水晶粉
    event.shaped(
        Item.of('hexcasting:amethyst_dust', 5),
        [
            '   ',
            ' A ',
            '   '
        ],
        {
            A: 'minecraft:amethyst_shard'
        }
    )
    //远古绘彩
    event.shaped(
        Item.of('hexcasting:ancient_colorizer'),
        [
            ' A ',
            'ABA',
            ' A '
        ],
        {
            B: 'minecraft:torchflower',
            A: 'hexcasting:amethyst_dust'
        }
    )
    //枢纽
    event.shaped(
        Item.of('hexal:mediafied_storage'),
        [
            ' A ',
            ' B ',
            ' A '
        ],
        {
            B: 'minecraft:ender_pearl',
            A: 'minecraft:shulker_shell'
        }
    )
    //传送石
    event.shaped(
            Item.of('waystones:warp_stone'),
            [
                    '   ',
                    ' A ',
                    '   '
            ],
            {
                    A: 'minecraft:amethyst_block'
            }
    )
    //促动石
    event.shaped(
        Item.of('hexcasting:impetus/rightclick'),
        [
            'ABA',
            'CDC',
            'AEA'
        ],
        {
            B: 'minecraft:quartz',
            E: 'hexcasting:charged_amethyst',
            D: 'minecraft:redstone',
            C: 'minecraft:paper',
            A: 'hexcasting:slate'
        }
    )
    //制动石
    event.shaped(
        Item.of('hexcasting:impetus/redstone'),
        [
            'ABA',
            'CDC',
            'AEA'
        ],
        {
            A: 'hexcasting:slate_block',
            C: 'hexcasting:charged_amethyst',
            B: 'minecraft:quartz',
            E: 'hexdebug:focus_holder',
            D: 'minecraft:dispenser'
        }
    )
    //区块加载器
    event.shaped(
        Item.of('chunkloaders:basic_chunk_loader'),
        [
            '   ',
            ' A ',
            ' B '
        ],
        {
            A: 'minecraft:calibrated_sculk_sensor',
            B: 'minecraft:observer'
        }
    )
    //调试杖
    event.shaped(
        Item.of('hexdebug:debugger'),
        [
            '   ',
            'CDC',
            'ABA'
        ],
        {
            B: 'hexcasting:charged_amethyst',
            D: 'hexcasting:trinket',
            C: 'hexcasting:amethyst_dust',
            A: 'minecraft:amethyst_shard'
        }
    )
    //运行杖
    event.shaped(
        Item.of('hexdebug:evaluator'),
        [
            '   ',
            'CDC',
            'ABA'
        ],
        {
            B: 'hexcasting:charged_amethyst',
            D: 'hexcasting:artifact',
            C: 'hexcasting:amethyst_dust',
            A: 'minecraft:amethyst_shard'
        }
    )
    //红石导向石
    event.shaped(
        Item.of('hexcasting:directrix/redstone'),
        [
            'ABA',
            'CDC',
            'ABA'
        ],
        {
            B: 'hexcasting:slate_block',
            D: 'minecraft:repeater',
            C: 'minecraft:amethyst_shard',
            A: 'minecraft:deepslate_bricks'
        }
    )
    //布尔导向石
    event.shaped(
        Item.of('hexcasting:directrix/boolean'),
        [
            'ABA',
            'CDC',
            'ABA'
        ],
        {
            B: 'hexcasting:slate_block',
            D: 'minecraft:comparator',
            C: 'minecraft:amethyst_shard',
            A: 'minecraft:deepslate_bricks'
        }
    )
    //板条箱
    event.shaped(
        Item.of('quark:crate'),
        [
            'AAA',
            'A A',
            'AAA'
        ],
        {
            A: 'minecraft:copper_ingot'
        }
    )
    //启迪木
    event.shaped(
            Item.of('hexcasting:edified_wood', 16),
            [
                    'AAA',
                    'ABA',
                    'AAA'
            ],
            {
                    A: 'hexcasting:edified_log',
                    B: 'hexcasting:default_colorizer'
            }
    )
    //阿卡夏桥接
    event.shaped(
            Item.of('hexcasting:akashic_connector', 2),
            [
                    '   ',
                    ' B ',
                    '   '
            ],
            {
                    B: 'hexcasting:akashic_connector'
            }
    )
    //阿卡夏书架
    event.shaped(
            Item.of('hexcasting:akashic_bookshelf', 2),
            [
                    '   ',
                    ' C ',
                    '   '
            ],
            {
                    C: 'hexcasting:akashic_bookshelf'
            }
    )
    //阿卡夏记录
    event.shaped(
            Item.of('hexcasting:akashic_record', 2),
            [
                    '   ',
                    ' C ',
                    '   '
            ],
            {
                    C: 'hexcasting:akashic_record'
            }
    )
    //维路复制
    event.shaped(
            Item.of('short_circuit:circuit', 2),
            [
                    '   ',
                    'ABC',
                    '   '
            ],
            {
                    A: 'hexcasting:uuid_colorizer',
                    C: 'hexcasting:default_colorizer',
                    B: 'short_circuit:circuit'
            }
    )
    //维路制作
    event.shapeless(
            Item.of('short_circuit:circuit'),
            [
                    'hexcasting:pride_colorizer_aroace',
                    'hexcasting:pride_colorizer_gay',
                    'hexcasting:pride_colorizer_bisexual',
                    'hexcasting:default_colorizer',
                    'hexcasting:pride_colorizer_intersex',
                    'hexcasting:uuid_colorizer',
                    'hexcasting:pride_colorizer_genderfluid',
                    'hexcasting:pride_colorizer_lesbian',
                    'hexcasting:pride_colorizer_pansexual'
            ]
    )
    //末影观察者
    event.shaped(
            Item.of('quark:ender_watcher'),
            [
                    '   ',
                    'ABA',
                    '   '
            ],
            {
                    B: 'minecraft:ender_eye',
                    A: 'minecraft:observer'
            }
    )
    //灵魂闪光绘彩
    event.shaped(
            Item.of('hexcasting:uuid_colorizer', 4),
            [
                    ' A ',
                    'BCD',
                    ' E '
            ],
            {
                    A: 'minecraft:sugar',
                    C: 'minecraft:ender_pearl',
                    D: 'minecraft:gunpowder',
                    E: 'hexcasting:amethyst_dust',
                    B: 'minecraft:redstone'
            }
    )
    //空无绘彩
    event.shaped(
            Item.of('hexcasting:default_colorizer', 4),
            [
                    ' A ',
                    'BCD',
                    ' E '
            ],
            {
                    B: 'minecraft:gunpowder',
                    E: 'minecraft:sugar',
                    A: 'hexcasting:amethyst_dust',
                    D: 'minecraft:redstone',
                    C: 'minecraft:charcoal'
            }
    )
    //焊铁
    event.shaped(
            Item.of('short_circuit:poking_stick'),
            [
                    '  A',
                    ' B ',
                    'C  '
            ],
            {
                    B: 'minecraft:iron_ingot',
                    A: 'minecraft:redstone',
                    C: 'minecraft:copper_ingot'
            }
    )
    //深板岩指路石
    event.shaped(
        Item.of('waystones:deepslate_waystone'),
        [
            ' A ',
            ' B ',
            'CDC'
        ],
        {
            D: 'minecraft:chiseled_deepslate',
            B: 'minecraft:ender_pearl',
            A: 'minecraft:cobbled_deepslate',
            C: 'hexcasting:slate'
        }
    )
    //黑石指路石
    event.shaped(
        Item.of('waystones:blackstone_waystone'),
        [
            ' A ',
            ' B ',
            'CDC'
        ],
        {
            D: 'minecraft:gilded_blackstone',
            A: 'minecraft:blackstone',
            B: 'minecraft:ender_pearl',
            C: 'hexcasting:slate'
        }
    )
    //砂岩指路石
    event.shaped(
        Item.of('waystones:sandy_waystone'),
        [
            ' A ',
            ' B ',
            'CDC'
        ],
        {
            A: 'minecraft:sand',
            B: 'minecraft:ender_pearl',
            C: 'hexcasting:slate',
            D: 'minecraft:sandstone'
        }
    )
    //打包带
    event.shapeless(
        Item.of('packingtape:tape'),
        [
            'minecraft:kelp',
            'minecraft:string'
        ]
    )
    //缀品
    event.shaped(
        Item.of('hexcasting:trinket'),
        [
            ' AB',
            ' CA',
            'D  '
        ],
        {
            B: 'hexcasting:amethyst_dust',
            A: 'minecraft:amethyst_shard',
            D: 'minecraft:flint_and_steel',
            C: 'hexcasting:thought_knot'
        }
    )
    //造物
    event.shaped(
        Item.of('hexcasting:artifact'),
        [
            ' A ',
            'ABA',
            ' C '
        ],
        {
            B: 'hexcasting:charged_amethyst',
            A: 'minecraft:gold_ingot',
            C: 'minecraft:nautilus_shell'
        }
    )
    //核心
    event.shaped(
        Item.of('hexcasting:focus'),
        [
            'A A',
            'BCB',
            'A A'
        ],
        {
            C: 'hexcasting:default_colorizer',
            A: 'minecraft:copper_ingot',
            B: 'hexcasting:thought_knot'
        }
    )
    //淬灵晶瓦
    event.shaped(
            '8x hexcasting:quenched_allay_tiles', 
            [
                    'AAA',
                    'ABA',
                    'AAA'
            ], 
            {
                    A: 'hexcasting:slate_tiles',
                    B: 'hexcasting:quenched_allay_shard'
            }
    )
    //淬灵晶砖
    event.shaped(
            '8x hexcasting:quenched_allay_bricks', 
            [
                    'AAA',
                    'ABA',
                    'AAA'
            ], 
            {
                    A: 'hexcasting:slate_bricks',
                    B: 'hexcasting:quenched_allay_shard'
            }
    )
    //玻璃展示框
    event.shaped(
            Item.of('quark:glass_item_frame'),
            [
                    'AAA',
                    'A A',
                    'AAA'
            ],
            {
                    A: 'minecraft:glass_pane'
            }
    )
    //荧光玻璃展示框
    event.shaped(
        Item.of('quark:glowing_glass_item_frame', 8),
        [
            'AAA',
            'ABA',
            'AAA'
        ],
        {
            A: 'quark:glass_item_frame',
            B: 'minecraft:glowstone_dust'
        }
    )
    //紫水晶瓦
    event.shaped(
        Item.of('hexcasting:amethyst_tiles', 8),
        [
            'AAA',
            'ABA',
            'AAA'
        ],
        {
            A: 'minecraft:amethyst_block',
            B: 'hexcasting:slate_tiles',
        }
    )
    //紫水晶砖
    event.shaped(
        Item.of('hexcasting:amethyst_bricks', 8),
        [
            'AAA',
            'ABA',
            'AAA'
        ],
        {
            A: 'minecraft:amethyst_block',
            B: 'hexcasting:slate_bricks',
        }
    )
    //板岩紫晶砖
    event.shaped(
        Item.of('hexcasting:slate_amethyst_bricks', 8),
        [
            'AAA',
            'ABA',
            'AAA'
        ],
        {
            B: 'minecraft:amethyst_block',
            A: 'hexcasting:slate_bricks'
        }
    )
    //板岩砖
    event.shaped(
        Item.of('hexcasting:slate_bricks', 4),
        [
            'AA ',
            'AA ',
            '   '
        ],
        {
            A: 'hexcasting:slate_block'
        }
    )
    //板岩瓦
    event.shaped(
        Item.of('hexcasting:slate_tiles', 4),
        [
            'AA ',
            'AA ',
            '   '
        ],
        {
            A: 'hexcasting:slate_bricks'
        }
    )
    //板岩柱
    event.shaped(
        Item.of('hexcasting:slate_pillar', 3),
        [
            ' A ',
            ' A ',
            ' A '
        ],
        {
            A: 'hexcasting:slate_block'
        }
    )
    //板岩小型砖
    event.shaped(
        Item.of('hexcasting:slate_bricks_small', 3),
        [
            '   ',
            'AAA',
            '   '
        ],
        {
            A: 'hexcasting:slate_block'
        }
    )
    //板岩紫晶瓦
    event.shaped(
        Item.of('hexcasting:slate_amethyst_tiles', 8),
        [
            'AAA',
            'ABA',
            'AAA'
        ],
        {
            B: 'minecraft:amethyst_block',
            A: 'hexcasting:slate_tiles'
        }
    )
    //板岩紫晶小型砖
    event.shaped(
        Item.of('hexcasting:slate_amethyst_bricks_small', 8),
        [
            'AAA',
            'ABA',
            'AAA'
        ],
        {
            B: 'minecraft:amethyst_block',
            A: 'hexcasting:slate_bricks_small'
        }
    )
    //板岩紫晶柱
    event.shaped(
        Item.of('hexcasting:slate_amethyst_pillar', 8),
        [
            'AAA',
            'ABA',
            'AAA'
        ],
        {
            B: 'minecraft:amethyst_block',
            A: 'hexcasting:slate_pillar'
        }
    )
    //界炎镖
    event.shaped(
        Item.of('quark:flamerang'),
        [
            'ABC',
            '  B',
            '  A'
        ],
        {
            A: 'minecraft:nether_brick',
            B: 'minecraft:leather',
            C: 'minecraft:netherite_ingot'
        }
    )
    //板岩紫晶（？）台阶
    event.shaped(
        Item.of('hexcasting:edified_slab', 6),
        [
            '   ',
            'AAA',
            '   '
        ],
        {
            A: 'hexcasting:slate_amethyst_pillar'
        }
    )
    //山海经
    event.shaped(
        Item.of('patchouli:guide_book', '{"patchouli:book":"hexcasting:thehexbook"}'),
        [
            '   ',
            ' A ',
            '   '
        ],
        {
            A: 'minecraft:writable_book'
        }
    )
    //透镜
    event.shaped(
        Item.of('hexcasting:lens'),
        [
            '   ',
            ' A ',
            '   '
        ],
        {
            A: 'minecraft:diamond'
        }
    )
    //淬灵法杖
    event.shaped(
        Item.of('hexcasting:staff/quenched'),
        [
            '   ',
            ' A ',
            '   '
        ],
        {
            A: 'hexcasting:quenched_allay_shard'
        }
    )
    //紫水晶灯
    event.shaped(
        Item.of('hexcasting:amethyst_sconce', 8),
        [
            ' A ',
            'BCB',
            'DED'
        ],
        {
            C: 'hexcasting:slate_amethyst_tiles',
            B: 'minecraft:amethyst_shard',
            A: 'hexcasting:default_colorizer',
            E: 'minecraft:copper_block',
            D: 'hexcasting:slate_amethyst_bricks'
        }
    )
    //原动磁方
    event.shaped(
        Item.of('quark:magnet', 2),
        [
            'ABA',
            'CDE',
            'ABA'
        ],
        {
            B: 'hexcasting:edified_slab',
            D: 'minecraft:iron_ingot',
            E: 'hexcasting:dye_colorizer_red',
            A: 'minecraft:cut_copper_slab',
            C: 'hexcasting:dye_colorizer_blue'
        }
    )
    //核心框架
    event.shaped(
        Item.of('hexdebug:focus_holder', 8),
        [
            'ABA',
            'B B',
            'ABA'
        ],
        {
            A: 'hexcasting:slate_block',
            B: 'minecraft:gold_ingot'
        }
    )
    //纸卷轴
    event.shapeless(
        Item.of('hexcasting:scroll_paper', 8),
        [
            'hexcasting:scroll_small',
            '#minecraft:logs'
        ]
    )
});

//配方移除
ServerEvents.recipes(event => {
    for (var i of [
	//原版
	"minecraft:torchflower",'minecraft:pitcher_plant','quark:glass_item_frame','quark:ender_watcher','minecraft:soul_lantern','minecraft:lantern','minecraft:chain','quark:flamerang','quark:crate','quark:pickarang','quark:magnet','quark:glowing_glass_item_frame','minecraft:glow_item_frame','minecraft:item_frame','minecraft:lodestone','minecraft:leather','minecraft:beetroot_soup','minecraft:stonecutter','minecraft:furnace_minecart','minecraft:fishing_rod','minecraft:iron_nugget',
    //经验之书
    'xpbook:xp_tome',
    //微电路
    'short_circuit:labelling_stick','short_circuit:circuit','short_circuit:truth_assigner','short_circuit:poking_stick',
    //区块加载器
    'chunkloaders:advanced_chunk_loader', 'chunkloaders:ultimate_chunk_loader', 'chunkloaders:single_chunk_loader', 'chunkloaders:basic_chunk_loader',
    //建筑手杖
    'constructionwand:core_angel', 'constructionwand:iron_wand', 'constructionwand:stone_wand', 'constructionwand:core_destruction', 'constructionwand:diamond_wand','constructionwand:infinity_wand',
    //打包带
    'packingtape:tape',
    //帕秋莉手册
    'patchouli:guide_book',
	//指路石碑
	'@waystones',
	//咒法学
	'hexcasting:akashic_connector','hexcasting:akashic_bookshelf','hexcasting:lens','hexcasting:jeweler_hammer','hexcasting:spellbook','hexcasting:amethyst_sconce','hexcasting:sub_sandwich','hexcasting:focus','hexcasting:cypher','hexcasting:trinket',"hexcasting:impetus/empty","hexcasting:directrix/empty",'hexcasting:scroll_paper',
    //咒法扩展
    'hexal:relay',
    //咒法调试
    "hexdebug:splicing_table","hexdebug:focus_holder",'hexdebug:debugger','hexdebug:evaluator','hexdebug:quenched_debugger', 'hexdebug:quenched_evaluator',
	//咒法装饰
	'hexcasting:amethyst_bricks', 'hexcasting:amethyst_dust_block', 'hexcasting:quenched_allay_bricks_small', 'hexcasting:quenched_allay_bricks', 'hexcasting:slate_tiles', 'hexcasting:quenched_allay_tiles', 'hexcasting:amethyst_tiles', 'hexcasting:scroll_paper_lantern', 'hexcasting:amethyst_pillar', 'hexcasting:amethyst_bricks_small', 'hexcasting:ancient_scroll_paper_lantern','hexcasting:ancient_scroll_paper',
	//启迪木材
	 'hexcasting:edified_log_aventurine', 'hexcasting:edified_log_citrine', 'hexcasting:edified_log_purple','hexcasting:edified_log_amethyst','hexcasting:stripped_edified_wood','hexcasting:edified_fence_gate', 'hexcasting:edified_planks',  'hexcasting:edified_pressure_plate', 'hexcasting:edified_fence', 'hexcasting:edified_trapdoor', 'hexcasting:edified_slab', 'hexcasting:edified_button', 'hexcasting:edified_door', 'hexcasting:edified_stairs','hexcasting:edified_panel','hexcasting:edified_tile',
	//咒法法杖
	'hexcasting:staff/oak', 'hexcasting:staff/birch', 'hexcasting:staff/jungle', 'hexcasting:staff/acacia', 'hexcasting:staff/crimson', 'hexcasting:staff/warped', 'hexcasting:staff/cherry', 'hexcasting:staff/edified', 'hexcasting:staff/bamboo','hexcasting:staff/bamboo','hexcasting:staff/dark_oak','hexcasting:staff/spruce','hexcasting:staff/quenched','hexcasting:staff/mangrove','hexcasting:staff/mindsplice',
	//染色剂
	'hexcasting:pride_colorizer_demigirl','hexcasting:pride_colorizer_aroace','hexcasting:pride_colorizer_intersex','hexcasting:pride_colorizer_gay', 'hexcasting:pride_colorizer_pansexual', 'hexcasting:pride_colorizer_genderfluid', 'hexcasting:pride_colorizer_plural', 'hexcasting:pride_colorizer_nonbinary', 'hexcasting:pride_colorizer_lesbian', 'hexcasting:uuid_colorizer', 'hexcasting:default_colorizer', 'hexcasting:pride_colorizer_bisexual', 'hexcasting:pride_colorizer_genderqueer', 'hexcasting:pride_colorizer_agender', 'hexcasting:pride_colorizer_aromantic', 'hexcasting:pride_colorizer_transgender', 'hexcasting:pride_colorizer_asexual', 'hexcasting:pride_colorizer_demiboy','hexcasting:dye_colorizer_red', 'hexcasting:dye_colorizer_orange', 'hexcasting:dye_colorizer_yellow', 'hexcasting:dye_colorizer_green', 'hexcasting:dye_colorizer_cyan', 'hexcasting:dye_colorizer_blue', 'hexcasting:dye_colorizer_purple', 'hexcasting:dye_colorizer_black', 'hexcasting:dye_colorizer_white','hexcasting:dye_colorizer_magenta','hexcasting:dye_colorizer_light_blue','hexcasting:dye_colorizer_lime','hexcasting:dye_colorizer_pink','hexcasting:dye_colorizer_gray','hexcasting:dye_colorizer_light_gray','hexcasting:dye_colorizer_brown','hexcasting:ancient_colorizer'])
    event.remove({output : i})});

ServerEvents.recipes(event => {
    for (var i of [
	"minecraft:iron_ingot_from_nuggets","minecraft:cyan_dye_from_pitcher_plant","minecraft:cut_copper","minecraft:exposed_cut_copper","minecraft:weathered_cut_copper","minecraft:oxidized_cut_copper","minecraft:waxed_cut_copper","minecraft:waxed_exposed_cut_copper","minecraft:waxed_weathered_cut_copper","quark:tweaks/crafting/slab_to_block"
	])
    event.remove({id : i})});

ServerEvents.recipes(event => {
	for (var i of [
	"minecraft:torchflower"])
	event.remove({input : i})});

//切石配方
ServerEvents.recipes(event => {
    const woodTypes = [
        'oak', 'spruce', 'birch', 'jungle', 
        'acacia', 'dark_oak', 'mangrove', 'cherry', 'bamboo'
    ]
    woodTypes.forEach(wood => {
        const logId = wood === 'bamboo' ? 'bamboo_block' : `${wood}_log`
        event.stonecutting(Item.of(`minecraft:${wood}_trapdoor`, 2), `minecraft:${logId}`)
        event.stonecutting(Item.of(`minecraft:${wood}_door`, 2), `minecraft:${logId}`)
        event.stonecutting(Item.of(`minecraft:${wood}_fence_gate`), `minecraft:${logId}`)
        event.stonecutting(Item.of(`minecraft:${wood}_fence`, 3), `minecraft:${logId}`)
        event.stonecutting(Item.of(`minecraft:${wood}_stairs`, 4), `minecraft:${logId}`)
        event.stonecutting(Item.of(`minecraft:${wood}_slab`, 8), `minecraft:${logId}`)
        event.stonecutting(Item.of(`minecraft:${wood}_sign`, 2), `minecraft:${logId}`)
    })
    event.stonecutting(
        Item.of('hexcasting:scroll_paper', 6),
        'minecraft:birch_log'
    )
    event.stonecutting(
        Item.of('minecraft:sand', 4),
        'minecraft:sandstone'
    )
    event.stonecutting(
        Item.of('minecraft:red_sand', 4),
        'minecraft:red_sandstone'
    )
    event.stonecutting(
        Item.of('minecraft:bone_meal', 6),
        'minecraft:bone'
    )
    event.stonecutting(
        Item.of('minecraft:blaze_powder', 4),
        'minecraft:blaze_rod'
    )
    event.stonecutting(
        Item.of('minecraft:iron_trapdoor', 2),
        'minecraft:iron_block'
    )
    event.stonecutting(
        Item.of('minecraft:heavy_weighted_pressure_plate', 5),
        'minecraft:iron_block'
    )
    event.stonecutting(
        Item.of('minecraft:iron_door', 5),
        'minecraft:iron_block'
    )
    event.stonecutting(
        Item.of('minecraft:iron_bars', 24),
        'minecraft:iron_block'
    )
    event.stonecutting(
        Item.of('minecraft:glowstone_dust', 4),
        'minecraft:glowstone'
    )
    event.stonecutting(
        Item.of('minecraft:nether_brick', 4),
        'minecraft:nether_bricks'
    )
    event.stonecutting(
        Item.of('minecraft:brick', 4),
        'minecraft:bricks'
    )
    event.stonecutting(
        Item.of('hexcasting:slate_tiles'),
        'hexcasting:slate_block'
    )
    event.stonecutting(
        Item.of('hexcasting:slate_bricks'),
        'hexcasting:slate_block'
    )
    event.stonecutting(
        Item.of('hexcasting:slate_bricks_small'),
        'hexcasting:slate_block'
    )
    event.stonecutting(
        Item.of('hexcasting:slate_pillar'),
        'hexcasting:slate_block'
    )
    event.stonecutting(
        Item.of('hexcasting:amethyst_tiles'),
        'minecraft:amethyst_block'
    )
    event.stonecutting(
        Item.of('hexcasting:amethyst_bricks'),
        'minecraft:amethyst_block'
    )
    event.stonecutting(
        Item.of('hexcasting:slate_amethyst_tiles'),
        'hexcasting:slate_amethyst_bricks'
    )
    event.stonecutting(
        Item.of('hexcasting:slate_amethyst_bricks_small'),
        'hexcasting:slate_amethyst_bricks'
    )
    event.stonecutting(
        Item.of('hexcasting:slate_amethyst_pillar'),
        'hexcasting:slate_amethyst_bricks'
    )
    event.stonecutting(
        Item.of('hexcasting:scroll_paper'),
        'hexcasting:ancient_scroll_paper'
    )
    event.stonecutting(
        Item.of('hexcasting:ancient_scroll_paper'),
        'hexcasting:scroll_paper'
    )
    event.stonecutting(
        Item.of('minecraft:string', 4),
        'minecraft:white_wool'
    )
    event.stonecutting(
        Item.of('minecraft:bone', 6),
        'minecraft:skeleton_skull'
    )
    event.stonecutting(
        Item.of('minecraft:coal', 6),
        'minecraft:wither_skeleton_skull'
    )
    event.stonecutting(
        Item.of('minecraft:amethyst_shard', 6),
        'minecraft:player_head'
    )
    event.stonecutting(
        Item.of('minecraft:gunpowder', 6),
        'minecraft:creeper_head'
    )
    event.stonecutting(
        Item.of('minecraft:gold_ingot', 6),
        'minecraft:piglin_head'
    )
    event.stonecutting(
        Item.of('minecraft:rotten_flesh', 6),
        'minecraft:zombie_head'
    )
    event.stonecutting(
        Item.of('hexcasting:slate', 2),
        'minecraft:deepslate'
    )
})
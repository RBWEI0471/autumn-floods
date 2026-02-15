global.perWorldPatterns = []
StartupEvents.registry('hexcasting:action', e => {
    function registerPatternWrap(seq, dir, id, isGreat, options) {
        isGreat = !!isGreat
        if (!id in global.PatternOperateMap) {
            throw new Error('missing operate: ' + id)
        }
        let resourceKey = 'homo:' + id
        if (isGreat) {
            global.perWorldPatterns.push(resourceKey)
        }
        let pattern = HexPattern.fromAngles(seq, dir)
        e.custom(resourceKey, ActionRegistryEntry(pattern, new ActionJS(id, pattern, options)))}
    
// 测试图案
    registerPatternWrap('dew', HexDir.NORTH_EAST, 'test')

// 未完成法术

    // 发射 registerPatternWrap('qqqe', HexDir.SOUTH_WEST, 'dispenser')
    // 聚变 registerPatternWrap('qwqwqwqwqwqqeaeaeaeaeaewqqqdwqqqwdqqqdwqqqwdqqqdwqqaqeeawqdwedewdwewdadqwaeeqeeawqdwedewdwewdadqwaeeqeeawqdwedewdwewdadqwaeqqdwedewdwewdadqawdeawewaedwaqdwedewdwewdadqawdeawewaedwaqdwedewdwewdadqawdeawewaedwew', HexDir.WEST, 'fusion')

// 启迪

    // 剥离意识
    registerPatternWrap('aeqqqeqqwqwqwqeqqqeqqqad', HexDir.SOUTH_WEST, 'enlightenment')

// 栈操作

    // 标签之纯化
    registerPatternWrap('dwedewq', HexDir.EAST, 'get_tag')
    // 标签之馏化
    registerPatternWrap('dwedewd', HexDir.EAST, 'has_tag')
    // 判空之纯化
    registerPatternWrap('wwaqqqq', HexDir.NORTH_EAST, 'is_air')
    // 占位之纯化
    registerPatternWrap('wwaqqqqe', HexDir.NORTH_EAST, 'replaceable')
    // 推敲之纯化
    registerPatternWrap('wwaqqqqee', HexDir.NORTH_EAST, 'shape')
    // 俯仰之纯化
    registerPatternWrap('wd', HexDir.EAST, 'head')
    // 制图之馏化
    registerPatternWrap('qqaawwqa', HexDir.SOUTH_WEST, 'exhaustive')
    // 干涉之纯化
    registerPatternWrap('qae', HexDir.SOUTH_WEST, 'range')
    // 累进之策略
    registerPatternWrap('dwqae', HexDir.EAST, 'data_add')
    // 消减之策略
    registerPatternWrap('awedq', HexDir.WEST, 'data_sub')
    // 计量之精思
    registerPatternWrap('dqae', HexDir.EAST, 'data_get')
    // 覆写之纯化
    registerPatternWrap('aedq', HexDir.WEST, 'data_set')
    // 博尔颂之策略
    registerPatternWrap('qaeede', HexDir.WEST, 'id_write')
    // 密米尔之纯化
    registerPatternWrap('edqqaq', HexDir.EAST, 'id_read')
    // 手性之精思
    registerPatternWrap('wdde', HexDir.SOUTH_WEST, 'get_hand')
    // 物性之精思
    registerPatternWrap('waaq', HexDir.SOUTH_EAST, 'get_hand_slot')
    // 媒质之精思
    registerPatternWrap('wawa', HexDir.SOUTH_WEST, 'get_max_media')
    // 潜行之纯化
    registerPatternWrap('qad', HexDir.SOUTH_WEST, 'shift')
    // 射线之提整
    registerPatternWrap('dwaad', HexDir.EAST, 'ray_block')
    // 光圈之提整
    registerPatternWrap('dwaadq', HexDir.EAST, 'circle_block')
    // 合焦之提整
    registerPatternWrap('dwaadw', HexDir.EAST, 'square_block')
    // 对焦之提整
    registerPatternWrap('dwaade', HexDir.EAST, 'rectangle_block')
    // 风蚀之提整
    registerPatternWrap('qwddw', HexDir.SOUTH_WEST, '_nbt_')
    // 实体之纯化：非玩家
    registerPatternWrap('qqqqqwdedd', HexDir.SOUTH_EAST, 'get_entity/not_player')
    // 区域之馏化：方块
    registerPatternWrap('qqqqqwdeddwww', HexDir.SOUTH_EAST, 'zone_block')
    // 勘探之提整
    registerPatternWrap('wwa', HexDir.SOUTH_EAST, 'found')
    // 限有之精思
    registerPatternWrap('edwaq', HexDir.NORTH_EAST, 'stack/size')
    // 实存之精思
    registerPatternWrap('qedwaqe', HexDir.EAST, 'stack/all_size')
    // 天光之纯化
    registerPatternWrap('eeee', HexDir.EAST, 'sky')
    // 维度之精思
    registerPatternWrap('dwaq', HexDir.EAST, 'world')
    // 骑手之精思
    registerPatternWrap('edwwde', HexDir.WEST, 'ride_bool')
    // 侦察之精思
    registerPatternWrap('qqqq', HexDir.WEST, 'raye')
    // 建筑之精思
    registerPatternWrap('qqqqa', HexDir.WEST, 'rayb')
    // 数读之纯化
    registerPatternWrap('qeeeeed', HexDir.EAST, 'num_read')
    // 数写之纯化
    registerPatternWrap('eqqqqqa', HexDir.EAST, 'num_write')
    // 书签之策略
    registerPatternWrap('waqqqq', HexDir.SOUTH_WEST, 'page_to')
    // 书签之纯化
    registerPatternWrap('wdeee', HexDir.SOUTH_EAST, 'page_num')
    // 落笔之精思
    registerPatternWrap('waqqq', HexDir.SOUTH_WEST, 'page_highest')
    // 页码之精思
    registerPatternWrap('wdeeee', HexDir.SOUTH_EAST, 'page_name')
    // 波谱之纯化
    registerPatternWrap('qaeqde', HexDir.SOUTH_WEST, 'iota_str')
    // 信笔之策略
    registerPatternWrap('wddwq', HexDir.NORTH_WEST, 'write_str')
    // 信笔之精思
    registerPatternWrap('ewaaw', HexDir.NORTH_WEST, 'read_str')
    // 数符之纯化
    registerPatternWrap('edewqa', HexDir.NORTH_WEST, 'num_to_str')
    // 符数之纯化
    registerPatternWrap('dewqaq', HexDir.NORTH_EAST, 'str_to_num')
    // 地势之纯化
    registerPatternWrap('qaqqqq', HexDir.EAST, 'block_id')
    // 地貌之纯化
    registerPatternWrap('qaqqqqqe', HexDir.EAST, 'block_state')
    // 地质之纯化
    registerPatternWrap('qaqqqqqee', HexDir.EAST, 'block_data')
    // 观物之纯化
    registerPatternWrap('awdee', HexDir.WEST, 'slot_name')
    // 分物之纯化
    registerPatternWrap('aawdee', HexDir.NORTH_EAST, 'slot_count')
    // 格物之纯化
    registerPatternWrap('qaawdee', HexDir.EAST, 'slot_nbt')
    // 名相之纯化
    registerPatternWrap('aqawdewd', HexDir.NORTH_WEST, 'entity_name')
    // 法相之纯化
    registerPatternWrap('aqawdewdd', HexDir.NORTH_WEST, 'entity_nbt')
    // 遥感之纯化
    registerPatternWrap('dewdwedeeedwwwde', HexDir.NORTH_EAST, 'mind')
    // 标位之馏化
    registerPatternWrap('wdewdqdwe', HexDir.EAST, 'all_index')
    // 选择之馏化
    registerPatternWrap('dweeewd', HexDir.NORTH_WEST, 'all_index_of')
    // 等差之纯化
    registerPatternWrap('qwaeawqa', HexDir.NORTH_WEST, 'range_list')
    // 等差之提整
    registerPatternWrap('ewdqdwed', HexDir.SOUTH_WEST, 'sequence_list')
    // 重组之纯化
    registerPatternWrap('qwed', HexDir.NORTH_WEST, 'transposed_list')
    // 入栈之策略
    registerPatternWrap('wdwddwe', HexDir.EAST, 'stack/push')
    // 单引之精思
    registerPatternWrap('waawaqwe', HexDir.EAST, 'mark_a')
    // 双引之精思
    registerPatternWrap('waawaqwed', HexDir.EAST, 'mark_b')

// 法术

    // 傀影
    registerPatternWrap('ddwedewdd', HexDir.WEST, 'simulation')
    // 拆解
    registerPatternWrap('qaqqqqqwqqqeqqqeqqq', HexDir.SOUTH_EAST, 'uncrafting')
    // 明晰
    registerPatternWrap('eeedeee', HexDir.NORTH_EAST, 'grid')
    // 维路
    registerPatternWrap('eawe', HexDir.EAST, 'world_to')
    // 维录
    registerPatternWrap('ewae', HexDir.EAST, 'world_set')
    // 阐述
    registerPatternWrap('dq', HexDir.EAST, 'tell')
    // 黑死神
    registerPatternWrap('qeeqweewweedqewqqe', HexDir.NORTH_WEST, 'plague')
    // 使用
    registerPatternWrap('qqqqee', HexDir.WEST, 'use')
    // 交互
    registerPatternWrap('qqqqe', HexDir.WEST, 'interaction')
    // 加载
    registerPatternWrap('aqawqwawq', HexDir.SOUTH_WEST, 'chunk')
    // 撕裂
    registerPatternWrap('wwewwedeadwdaedewweww', HexDir.SOUTH_EAST, 'tear')
    // 飞升
    registerPatternWrap('ewaad', HexDir.EAST, 'high')
    // 标识
    registerPatternWrap('dwwedwe', HexDir.EAST, 'tags')
    // 命名
    registerPatternWrap('dwede', HexDir.EAST, 'name')
    // 精神控制
    registerPatternWrap('weeeweedwaqaaq', HexDir.EAST, 'control')
    // 吸星大法
    registerPatternWrap('eeeeeddwdwd', HexDir.NORTH_WEST, 'effect')
    // 坠落
    registerPatternWrap('wqqqwqawaa', HexDir.WEST, 'fall')
    // 视向
    registerPatternWrap('wad', HexDir.SOUTH_EAST, 'yaw')
    // 示现
    registerPatternWrap('wddeaeddw', HexDir.SOUTH_WEST, 'vex')
    // 显象
    registerPatternWrap('qaqqaeawaea', HexDir.SOUTH_WEST, 'eye')
    // 重力
    registerPatternWrap('weeeeewq', HexDir.SOUTH_WEST, 'gravity')
    // 箭矢
    registerPatternWrap('awwwqaqw', HexDir.SOUTH_WEST, 'arrow')
    // 骑乘
    registerPatternWrap('qaeeaq', HexDir.SOUTH_WEST, 'ride')
    // 时序
    registerPatternWrap('eawdwawdq', HexDir.SOUTH_WEST, 'again')
    // 湮灭
    registerPatternWrap('edeeeee', HexDir.SOUTH_WEST, 'annihilation')
    // 制作试剂瓶
    registerPatternWrap('qaqwedeeeeweewee', HexDir.EAST, 'battery')
    // 造物
    registerPatternWrap('aeaeaeaeaea', HexDir.WEST, 'artifact')
    // 禅定
    registerPatternWrap('eewdeqqwedewwded', HexDir.SOUTH_EAST, 'peace')
    // 相位
    registerPatternWrap('dwaqe', HexDir.EAST, 'dimension')
    
// 物元

    // 检验
    registerPatternWrap('edeedqdweee', HexDir.SOUTH_EAST, 'recipes')
    // 补货
    registerPatternWrap('wwedewqqqqqwed', HexDir.WEST, 'restock')
    // 让度
    registerPatternWrap('wwqaqweeeeewqa', HexDir.EAST, 'merge')
    // 集成
    registerPatternWrap('qaqqaeawqqq', HexDir.SOUTH_WEST, 'recipe')
    // 上传
    registerPatternWrap('eaqaweeeee', HexDir.WEST, 'cloud')
    // 下载
    registerPatternWrap('qdedwqqqqq', HexDir.WEST, 'download')
    // 重新充能
    registerPatternWrap('waqqqqqwaeaeaeaeaea', HexDir.EAST, 'charge')
    // 质元之精思
    registerPatternWrap('qaqdqaqdqaq', HexDir.NORTH_WEST, 'motes')
    // 合质之精思
    registerPatternWrap('wwaqqwdedwqq', HexDir.EAST, 'get_all_motes')
    // 合质之纯化
    registerPatternWrap('wwdeewaqawee', HexDir.EAST, 'get_contained_motes')

// 物流

    // 冲积之提整
    registerPatternWrap('eeeeedewdwd', HexDir.NORTH_EAST, 'get_contain')
    // 容止
    registerPatternWrap('eeeeedwwdwd', HexDir.EAST, 'contain_contain')
    // 物流
    registerPatternWrap('eeeeedawdwd', HexDir.SOUTH_WEST, 'contain_mote')
    // 枢送
    registerPatternWrap('eeeeedqwdwd', HexDir.SOUTH_EAST, 'mote_contain')

// 数字

    registerPatternWrap('aaqa', HexDir.EAST, '16')
    registerPatternWrap('aaqaw', HexDir.EAST, '32')
    registerPatternWrap('aaqae', HexDir.EAST, '64')
    registerPatternWrap('aaqad', HexDir.EAST, '128')
    registerPatternWrap('aaqaww', HexDir.EAST, '256')
    registerPatternWrap('aaqaew', HexDir.EAST, '512')
    registerPatternWrap('aaqadw', HexDir.EAST, '1024')
    
// 策略

    // 唯识
    registerPatternWrap('qdeddwdeweeewe', HexDir.EAST, 'ever_read')
    // 我执
    registerPatternWrap('eaqaawaqwqqqwq', HexDir.EAST, 'ever_write')
    // 忘川
    registerPatternWrap('wwaqqqaqqqqqwq', HexDir.EAST, 'ever_dele')
    // 秋水
    registerPatternWrap('wwdeeedeeeeewe', HexDir.EAST, 'ever_meta')
    // 匝格瑞俄斯之策略
    registerPatternWrap('wawqwaqawqwaa', HexDir.SOUTH_WEST, 'event')
    // 厄科之策略
    registerPatternWrap('deaqqeawqwqwqwqwq', HexDir.SOUTH_EAST, 'echo')
    // 伊西斯之策略
    registerPatternWrap('qaawedee', HexDir.EAST, 'isis')
    // 狄俄尼索斯之策略
    registerPatternWrap('qqqqqweeeee', HexDir.NORTH_WEST, 'forever')
    // 厄洛斯之策略
    registerPatternWrap('qqqqaaw', HexDir.WEST, 'key')
    // 修普诺斯之策略
    registerPatternWrap('dqa', HexDir.EAST, 'time')
    // 赫柏之策略
    registerPatternWrap('eedqa', HexDir.SOUTH_WEST, 'depth')
    // 克洛托之策略
    registerPatternWrap('dwdd', HexDir.EAST, 'let_in')
    // 拉克西丝之馏化
    registerPatternWrap('dwaa', HexDir.EAST, 'let_read')
    // 阿特洛波斯之纯化
    registerPatternWrap('ewaa', HexDir.EAST, 'let_out')
    // 卡厄斯之策略
    registerPatternWrap('ewdqdwedqdedd', HexDir.SOUTH_WEST, 'otherworld')
    
// 卓越

    // 爆破
    registerPatternWrap('eeeeeqdwdwawdwdwawdwdwa', HexDir.NORTH_EAST, 'creeper')
    // 流转
    registerPatternWrap('wwwwwawwwwwawwwqwwwawwwwwawwwwwaqwqdqdqdqdwedeewq', HexDir.WEST, 'focus')
    // 旅者传送
    registerPatternWrap('aawqqaqwdwqaqq', HexDir.NORTH_EAST, 'pos')
    // 万物之终结
    registerPatternWrap('aeeeea', HexDir.EAST, 'omega')
    // 俄罗斯轮盘
    registerPatternWrap
    ('qaqqqqqewewwwwwwwdeqeeedeewwwwawdedqqqwqeqwqwawaed', HexDir.EAST, 'roulette')
    // 冲刺
    registerPatternWrap
    ('wewqwwwaqwwawwwqwawqwqwqwqwqwwqqqqwqwedeeeweqedwewweeedwwwwwweweqwqwawq', HexDir.EAST, 'otto')
    // 反制
    registerPatternWrap
    ('wqwawqwweeeqeewqweeqeeedeeeqeewqweeqeedqweqqqewqqweqqqewaawdwqwdwwwdwqwdw', HexDir.NORTH_EAST, 'reflection')
    // 溯洄
    registerPatternWrap
    ('edewwqqqawwwaqawqwawqewwaqqqwwedewwewaqawqwawqewwaqqqwwedewwewaqawqwawqeew', HexDir.NORTH_WEST, 'the_spirit')
    // 升华
    registerPatternWrap
    ('daqwawqdqwqaeqdqeaqwqaqwwddwdweqedweweqwqeqeaeqeqwqewewdeqewaeeqwdadwqeedqdawwadqwwddw', HexDir.SOUTH_WEST, 'infinite')
    // 全视
    registerPatternWrap('wwwdwwwdwewdwdwewwwewewewawqwawwwewewwwwwdwwdwdwewdwqdwwwwwewewwwawawwwewewwwwwdwwdwdwewdwqdwwwwwewewwwawqwawewewew', HexDir.NORTH_WEST, 'eye_of_providence')
    // 阿瓦达索命
    registerPatternWrap('wwwewwwwewwwwewwwewqaqwqaeqwweweeweeewdqeewwqedqqqqedwewqwewdeqqqqwqwqwwwqqqqqaeqwwqwqdqqeqwqwwawwdedwwawwqwdwewwewwewqeq', HexDir.NORTH_WEST, 'avada_kedavra')
    // ？？？
    registerPatternWrap
    ('wewdwewwqaqqwedeweewaqwedewwqwwedewwqeewaqawwedewewewdwewewedeweewaqwedewwqwwedewwqeeewedewewewdwewewedewwaqawewaqwedewwqwwedewwqeeewedew', HexDir.SOUTH_WEST, 'media')
    // 罅隙
    registerPatternWrap
    ('wwwwwqwwwwwqwwwwwqwwwwwqwwwwwqwwwwwawwwwwqwwawwqwwqwwqwwqwwqwedewwwewwwedwaewwwedwewwqawwqeewwwedwwaewawwqawwweeeawqeeewwewdedwewwewdedwewwewdedwewweqewwewdedwewweaw', HexDir.SOUTH_WEST, 'space')
    // 聚变
    registerPatternWrap('qwqwqwqwqwqqeaeaeaeaeaewqqqdwqqqwdqqqdwqqqwdqqqdwqqaqeeawqdwedewdwewdadqwaeeqeeawqdwedewdwewdadqwaeeqeeawqdwedewdwewdadqwaeqqdwedewdwewdadqawdeawewaedwaqdwedewdwewdadqawdeawewaedwaqdwedewdwewdadqawdeawewaedwew', HexDir.WEST, 'kcit')
})
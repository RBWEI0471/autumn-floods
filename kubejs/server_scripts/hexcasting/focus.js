//核心的连接与写入
const HEX_API = Java.loadClass('at.petrak.hexcasting.xplat.IXplatAbstractions')

ServerEvents.recipes(e => {
    function convertDataToList(nbt) {
        if (!nbt.data) nbt.data = {}
        if (nbt.data['hexcasting:type'] != 'hexcasting:list') {
            if (nbt.data['hexcasting:type']) {
                let oldData = Object.assign({}, nbt.data)
                nbt.data['hexcasting:data'] = [oldData]
            } else nbt.data['hexcasting:data'] = []
            nbt.data['hexcasting:type'] = 'hexcasting:list'
        }
    }

    e.shapeless('hexcasting:focus', ['hexcasting:focus']).modifyResult((grid, item) => {
        let { player, width, height } = grid

        let src_item,
            total = width * height
        for (let i = 0; i < total; i++) {
            src_item = grid.get(i)
            if (src_item.id == 'hexcasting:focus') break
        }

        item.nbt = src_item.nbt
        if (player) {
            let offItem = player.offHandItem
            if (offItem.nbt?.data && offItem.nbt.data['hexcasting:type']) {
                if (offItem.nbt.data['hexcasting:type'] == 'hexcasting:list') {
                    convertDataToList(item.nbt)
                    for (let obj of offItem.nbt.data['hexcasting:data']) item.nbt.data['hexcasting:data'].push(obj)
                } else {
                    convertDataToList(item.nbt)
                    item.nbt.data['hexcasting:data'].push(offItem.nbt.data['hexcasting:data'])
                }
            } else if (offItem.nbt?.patterns?.length > 0) {
                convertDataToList(item.nbt)
                for (let obj of offItem.nbt.patterns) item.nbt.data['hexcasting:data'].push(obj)
            }
        }

        return item
    })
    
    for (let target_out of [
        'hexcasting:focus',
        'hexcasting:trinket',
        'hexcasting:artifact'
    ]) {
        let target = target_out
        if (!Platform.isLoaded(target.split(':')[0])) continue
        if (target === 'hexcasting:focus') continue
        e.shapeless(target, [target, 'hexcasting:focus'])
            .modifyResult((grid, item) => {
                let { width, height } = grid
                let focus,
                    original,
                    total = width * height
                for (let i = 0; i < total; i++) {
                    let ii = grid.get(i)
                    if (ii.id == 'hexcasting:focus') focus = ii
                    else if (ii.id == target) original = ii
                }

                item.orCreateTag.merge(original.orCreateTag)
                convertDataToList(focus.orCreateTag)

                item.nbt.patterns = focus.nbt.data['hexcasting:data']
                if ((item.nbt['hexcasting:start_media'] || 0) <= 0) {
                    item.nbt.putLong('hexcasting:start_media', 64e4)
                    item.nbt.putLong('hexcasting:media', 0)
                }
                return item
            })
            .keepIngredient('hexcasting:focus')
    }
})

//当讲台中有书时，手持有内容之核心潜行右击以将核心内容写入书与笔中，手持无内容之核心右击以从书中读取内容。
const ParserMain = Java.loadClass("io.yukkuric.hexparse.parsers.ParserMain");

BlockEvents.rightClicked('minecraft:lectern', event => {
    const alpha = []
    const { item, block, player } = event
    if (event.hand != 'MAIN_HAND' || block.entityData == null || !block.entityData.contains("Book") || !player.isCrouching() || item.id != 'hexcasting:focus') return
    if (item.nbt != null && item.nbt.contains("data")) {
        let linenum = 0
        let linenow = ""
        let pagenow = []
        let StringProcessors=Java.tryLoadClass('io.yukkuric.hexparse.misc.StringProcessors')
        let text = ParserMain.ParseIotaNbt(item.nbt["data"], player, StringProcessors.READ_DEFAULT)
        for (const char of text) {
            if (char === ',' || char === '(' || char === ')') {
                linenow += char
                pagenow.push(linenow)
                linenow = ""
                linenum ++
                if (linenum >= 14) {
                    alpha.push(pagenow.join('\n'))
                    pagenow = []
                    linenum = 0
                }
            } else {
                linenow += char
            }
        }
        if (linenow.length > 0) {
            pagenow.push(linenow)
            linenum++
        }
        if (pagenow.length > 0) {
            alpha.push(pagenow.join('\n'))
        }
        let book = Item.of('minecraft:writable_book', {pages: alpha.map(p => p.replace(/\n$/, ""))})
        block.setEntityData({"pages": 114514})
        player.give(book)}
    else {
        let omega = []
        let tag = block.entityData.getCompound("Book").getCompound("tag")
        for (let i = 0; i < tag.getList("pages", 8).size(); i++) {
        let lines = tag.getList("pages", 8).getString(i).split('\n')
        for (let I = 0; I < lines.length; I++) {omega.push(lines[I].trim())
        if (I < lines.length - 1 && !/[,\\)]$/.test(lines[I].trim())) {omega.push(' ')}}}
        player.runCommandSilent(`hexParse ${'"' + omega.join('') + '"'}`)}})
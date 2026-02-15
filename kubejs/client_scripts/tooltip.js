//淬灵法杖
ItemEvents.tooltip((event) => {
    event.addAdvanced("hexcasting:staff/quenched", (item, advanced, text) => {
        if (event.shift && event.alt && event.ctrl) {
            text.remove(0)
            text.add(0, Text.darkPurple("淬灵法杖(ゝ∀･)~"))
            text.add(1, Text.gold("传说中恶魔如果被人知道了真名就会签卖身契嘤，所以骚年快写下我的名字获取无穷无尽的力量吧！"))
            text.add(2, {
                text: '\u0067',
                font: 'kubejs:texture_font'
            })
        } else if (event.shift && event.alt) {
            text.remove(0)
            text.add(0, Text.blue("启迪法杖(*´･д･)?"))
            text.add(1, {
                text: '\u0066',
                font: 'kubejs:texture_font'
            })
        } else if (event.shift&& event.ctrl) {
            text.remove(0)
            text.add(0, Text.blue("制念法杖(／‵Д′)／~ ╧╧"))
            text.add(1, {
                text: '\u0065',
                font: 'kubejs:texture_font'
            })
        } else if (event.alt && event.ctrl) {
            text.remove(0)
            text.add(0, Text.blue("紫晶法杖σ(´∀｀*)"))
            text.add(1, {
                text: '\u0064',
                font: 'kubejs:texture_font'
            })
        } else if (event.shift) {
            text.remove(0)
            text.add(0, Text.yellow("质念法杖？"))
            text.add(1, {
                text: '\u0063',
                font: 'kubejs:texture_font'
            })
        } else if (event.ctrl) {
            text.remove(0)
            text.add(0, Text.yellow("质念法杖！"))
            text.add(1, {
                text: '\u0062',
                font: 'kubejs:texture_font'
            })
        } else if (event.alt) {
            text.remove(0)
            text.add(0, Text.yellow("质念法杖？！"))
            text.add(1, {
                text: '\u0061',
                font: 'kubejs:texture_font'
            })
        }
    })
})

//山海经
ItemEvents.tooltip((event) => {
    event.addAdvanced("patchouli:guide_book", (item,advanced,text) => {
        if (event.shift && event.alt && event.ctrl) {
            text.remove(0)
            text.add(0, Text.darkPurple("《 ☀ ☾ 🙵 ≋ △ 》"))
            text.add(1, Text.gold("薄暮雷电，归何忧"))
            text.add(2, {
                text: '\u0074',
                font: 'kubejs:texture_font'
            })
        } else if(event.shift && event.alt) {
            text.remove(0)
            text.add(0, Text.blue("认识的事物被阐释"))
            text.add(1, {
                text: '\u0073',
                font: 'kubejs:texture_font'
            })
        } else if(event.shift&& event.ctrl) {
            text.remove(0)
            text.add(0, Text.blue("知道的事物被讲述"))
            text.add(1, {
                text: '\u0073',
                font: 'kubejs:texture_font'
            })
        } else if(event.alt && event.ctrl) {
            text.remove(0)
            text.add(0, Text.blue("推算的事物被预言"))
            text.add(1, {
                text: '\u0073',
                font: 'kubejs:texture_font'
            })
        } else if(event.shift) {
            text.remove(0)
            text.add(0, Text.yellow("过去的被知道"))
            text.add(1, {
                text: '\u0072',
                font: 'kubejs:texture_font'
            })
        } else if(event.ctrl) {
            text.remove(0)
            text.add(0, Text.yellow("现在的被认识"))
            text.add(1, {
                text: '\u0072',
                font: 'kubejs:texture_font'
            })
        } else if (event.alt) {
            text.remove(0)
            text.add(0, Text.yellow("未来的被推算"))
            text.add(1, {
                text: '\u0072',
                font: 'kubejs:texture_font'
            })
        }
    })
})

//质念透镜
ItemEvents.tooltip((event) => {
    event.addAdvanced("hexcasting:lens", (item,advanced,text) => {
        if (event.shift && event.alt && event.ctrl){
            text.remove(0)
            text.add(0, Text.darkPurple("质念透镜(っ﹏-) .｡~oƪ"))
            text.add(1, Text.gold("芦雪归身天忘我，白露横江此未名"))
            text.add(2, {
                text: '\u0077',
                font: 'kubejs:texture_font'
            })
        } else if(event.shift && event.alt) {
            text.remove(0)
            text.add(0, Text.blue("水反辅太一，是以成天"))
            text.add(1, {
                text: '\u0076',
                font: 'kubejs:texture_font'
            })
        } else if(event.shift && event.ctrl) {
            text.remove(0)
            text.add(0, Text.blue("天反辅太一，是以成地"))
            text.add(1, {
                text: '\u0076',
                font: 'kubejs:texture_font'
            })
        } else if(event.alt && event.ctrl) {
            text.remove(0)
            text.add(0, Text.blue("天地相辅也，是以成神明"))
            text.add(1, {
                text: '\u0076',
                font: 'kubejs:texture_font'
            })
        } else if(event.shift){
            text.remove(0)
            text.add(0, Text.yellow("太一生水"))
            text.add(1, {
                text: '\u0075',
                font: 'kubejs:texture_font'
            })
        } else if(event.ctrl){
            text.remove(0)
            text.add(0, Text.yellow("太一藏于水"))
            text.add(1, {
                text: '\u0075',
                font: 'kubejs:texture_font'
            })
        } else if(event.alt){
            text.remove(0)
            text.add(0, Text.yellow("行于时，周而或万物母"))
            text.add(1, {
                text: '\u0075',
                font: 'kubejs:texture_font'
            })
        }
    })
})
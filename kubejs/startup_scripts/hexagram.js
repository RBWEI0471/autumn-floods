// 梅花占
function hexagram(year, month, day, hour) {
    // 五行名称
    let elemNames = ["金", "木", "水", "火", "土"]

    // 旺衰等级
    let powerDesc = ["死", "囚", "休", "相", "旺"]

    // 五行映射
    let elemMap = {1: 0, 2: 0, 3: 3, 4: 1, 5: 1, 6: 2, 7: 4, 8: 4}

    // 动爻权重
    let moveWeightMap = {1: 0.85, 2: 1.05, 3: 0.95, 4: 0.95, 5: 1.1, 6: 0.9}

    // 爻位名称
    let lineNames = {1: "初爻", 2: "二爻", 3: "三爻", 4: "四爻", 5: "五爻", 6: "上爻"}

    // 卦名映射
    let trigramNames = {1: "乾 ☰", 2: "兑 ☱", 3: "离 ☲", 4: "震 ☳", 5: "巽 ☴", 6: "坎 ☵", 7: "艮 ☶", 8: "坤 ☷"}

    // 五行生克
    let to = {0:2, 2:1, 1:3, 3:4, 4:0}
    let fo = {0:1, 1:4, 4:2, 2:3, 3:0}

    // 易经排布
    let book = {
        "1-1": 1, "8-8": 2, "6-4": 3, "7-6": 4, "6-1": 5, "1-6": 6, "8-6": 7, "6-8": 8,
        "5-1": 9, "1-2": 10,"8-1": 11,"1-8": 12,"1-3": 13,"3-1": 14,"8-7": 15,"4-8": 16,
        "2-4": 17,"7-5": 18,"8-2": 19,"5-8": 20,"3-4": 21,"7-3": 22,"7-8": 23,"8-4": 24,
        "1-4": 25,"7-1": 26,"7-4": 27,"2-5": 28,"6-6": 29,"3-3": 30,"2-7": 31,"4-5": 32,
        "1-7": 33,"4-1": 34,"3-8": 35,"8-3": 36,"5-3": 37,"3-2": 38,"6-7": 39,"4-6": 40,
        "7-2": 41,"5-4": 42,"2-1": 43,"1-5": 44,"2-8": 45,"8-5": 46,"2-6": 47,"6-5": 48,
        "2-3": 49,"3-5": 50,"4-4": 51,"7-7": 52,"5-7": 53,"4-2": 54,"4-3": 55,"3-7": 56,
        "5-5": 57,"2-2": 58,"5-6": 59,"6-2": 60,"5-2": 61,"4-7": 62,"6-3": 63,"3-6": 64
    }

    // 互变推演
    function deriveHexagramInfo(outNum, innNum, moveNum, curPow) {
        // 八卦数组
        let symbol = {1: [1,1,1], 2: [1,1,0], 3: [1,0,1], 4: [1,0,0], 5: [0,1,1], 6: [0,1,0], 7: [0,0,1], 8: [0,0,0]}

        // 1. 内外卦象
        let outer = symbol[outNum]
        let inner = symbol[innNum]
        
        // 2. 体用卦象
        let used, body
        if (moveNum <= 3) {
            used = inner
            body = outer
        } else {
            used = outer
            body = inner
        }
        
        // 3. 体用卦数
        let usedNum = symToNum(used)
        let bodyNum = symToNum(body)
        
        // 4. 体用五行
        let uElem = elemMap[usedNum]
        let bElem = elemMap[bodyNum]
        
        // 5. 体用卦气
        let uBase = curPow[uElem]
        let bBase = curPow[bElem]
        
        // 6. 变卦卦象
        let change
        if (moveNum <= 3) {
            let pos = moveNum - 1
            let copy = used.slice()
            copy[pos] = copy[pos] === 0 ? 1 : 0
            change = copy
        } else {
            let pos = moveNum - 4
            let copy = used.slice()
            copy[pos] = copy[pos] === 0 ? 1 : 0
            change = copy
        }
        
        // 7. 变卦卦数
        let changeNum = symToNum(change)
        
        // 8. 变卦五行
        let cElem = elemMap[changeNum]
        
        // 9. 变卦卦气
        let cBase = curPow[cElem]
        
        // 10. 互卦卦象
        let interIn = [inner[1], inner[2], outer[0]]
        let interOut = [inner[2], outer[0], outer[1]]
        let interInNum = symToNum(interIn)
        let interOutNum = symToNum(interOut)
        let bodyInter, usedInter
        if (moveNum <= 3) {
            bodyInter = interOut
            usedInter = interIn
        } else {
            bodyInter = interIn
            usedInter = interOut
        }
        
        // 11. 互卦卦数
        let bodyInterNum = symToNum(bodyInter)
        let usedInterNum = symToNum(usedInter)
        
        // 12. 互卦五行
        let bodyInterElem = elemMap[bodyInterNum]
        let usedInterElem = elemMap[usedInterNum]
        
        // 13. 互卦卦气
        let bodyInterBase = curPow[bodyInterElem]
        let usedInterBase = curPow[usedInterElem]
        
        return {
            // 本卦信息
            outer: {
                num: outNum,
                sym: outer,
                elem: elemMap[outNum],
                base: curPow[elemMap[outNum]]
            },
            inner: {
                num: innNum,
                sym: inner,
                elem: elemMap[innNum],
                base: curPow[elemMap[innNum]]
            },
            
            // 体用信息
            used: {
                num: usedNum,
                sym: used,
                elem: uElem,
                base: uBase,
                trigramNum: usedNum
            },
            body: {
                num: bodyNum,
                sym: body,
                elem: bElem,
                base: bBase,
                trigramNum: bodyNum
            },
            
            // 变卦信息
            change: {
                num: changeNum,
                sym: change,
                elem: cElem,
                base: cBase,
                trigramNum: changeNum
            },
            
            // 互卦信息
            bodyInter: {
                num: bodyInterNum,
                sym: bodyInter,
                elem: bodyInterElem,
                base: bodyInterBase,
                trigramNum: bodyInterNum
            },
            usedInter: {
                num: usedInterNum,
                sym: usedInter,
                elem: usedInterElem,
                base: usedInterBase,
                trigramNum: usedInterNum
            },
            interInNum: interInNum,
            interOutNum: interOutNum
        }
    }

    // 卦气旺衰
    let dailyPow = {
        1:  {"1-4": [3,4,5,1,4],"5-19": [3,4,5,1,5],"20-31": [3,4,5,1,5]},
        2:  {"1-3": [3,4,5,1,5],"4-18": [2,5,3,4,5],"19-28": [2,5,3,4,4]},
        3:  {"1-5": [2,5,3,4,4],"6-20": [2,5,3,4,3],"21-31": [2,5,3,4,2]},
        4:  {"1-4": [2,5,3,4,2],"5-19": [2,5,3,4,3],"20-30": [2,5,3,4,4]},
        5:  {"1-5": [2,5,3,4,4],"6-20": [2,3,2,5,4],"21-31": [2,3,2,5,5]},
        6:  {"1-5": [2,3,2,5,5],"6-21": [2,2,2,5,5],"22-30": [2,2,2,5,5]},
        7:  {"1-6": [2,2,2,5,5],"7-22": [2,2,2,5,5],"23-31": [2,2,2,5,5]},
        8:  {"1-7": [2,2,2,5,5],"8-22": [5,2,4,2,5],"23-31": [5,2,4,2,4]},
        9:  {"1-7": [5,2,4,2,4],"8-22": [5,2,4,2,5],"23-30": [5,2,4,2,5]},
        10: {"1-8": [5,2,4,2,5],"9-23": [5,2,5,2,4],"24-31": [4,2,5,2,3]},
        11: {"1-7": [4,2,5,2,3],"8-22": [3,4,5,1,2],"23-30": [3,4,5,1,2]},
        12: {"1-6": [3,4,5,1,2],"7-21": [3,4,5,1,3],"22-31": [3,4,5,1,5]}
    }
    
    // 爻辞映射
    let merged = {
        1: [null, "初九，潜龙勿用"],
        2: [true, "九二，见龙在田，利见大人"],
        3: [null, "九三，君子终日乾乾，夕惕若，厉无咎"],
        4: [null, "九四，或跃在渊，无咎"],
        5: [true, "九五，飞龙在天，利见大人"],
        6: [false, "上九，亢龙有悔"],
        7: [null, "初六，履霜，坚冰至"],
        8: [true, "六二，直方大，不习无不利"],
        9: [null, "六三，含章可贞，或从王事，无成有终"],
        10: [null, "六四，括囊，无咎无誉"],
        11: [true, "六五，黄裳元吉"],
        12: [false, "上六，龙战于野，其血玄黄"],
        13: [true, "初九，磐桓，利居贞，利建侯"],
        14: [null, "六二，屯如邍如，乘马班如。匪寇婚媾，女子贞不字，十年乃字"],
        15: [false, "六三，即鹿无虞，惟入于林中，君子几不如舍，往吝"],
        16: [true, "六四，乘马班如，求婚媾，往吉，无不利"],
        17: [null, "九五，屯其膏，小贞吉，大贞凶"],
        18: [false, "上六，乘马班如，泣血涟如"],
        19: [false, "初六，发蒙，利用刑人，用说桎梏，以往吝"],
        20: [true, "九二，包蒙吉，纳妇吉，子克家"],
        21: [false, "六三，勿用取女，见金夫，不有躬，无攸利"],
        22: [false, "六四，困蒙，吝"],
        23: [true, "六五，童蒙，吉"],
        24: [null, "上九，击蒙，不利为寇，利御寇"],
        25: [null, "初九，需于郊，利用恒，无咎"],
        26: [true, "九二，需于沙，小有言，终吉"],
        27: [false, "九三，需于泥，致寇至"],
        28: [null, "六四，需于血，出自穴"],
        29: [true, "九五，需于酒食，贞吉"],
        30: [true, "上六，入于穴，有不速之客三人来，敬之终吉"],
        31: [true, "初六，不永所事，小有言，终吉"],
        32: [null, "九二，不克讼，归而逋，其邑人三百户，无眚"],
        33: [true, "六三，食旧德，贞厉，终吉；或从王事，无成"],
        34: [true, "九四，不克讼，复即命，渝安贞，吉"],
        35: [true, "九五，讼元吉"],
        36: [false, "上九，或锡之鞶带，终朝三褫之"],
        37: [false, "初六，师出以律，否臧凶"],
        38: [true, "九二，在师中，吉，无咎；王三锡命"],
        39: [false, "六三，师或舆尸，凶"],
        40: [null, "六四，师左次，无咎"],
        41: [false, "六五，田有禽，利执言，无咎。长子帅师，弟子舆尸，贞凶"],
        42: [true, "上六，大君有命，开国承家，小人勿用"],
        43: [true, "初六，有孚比之，无咎；有孚盈缶，终来有他吉"],
        44: [true, "六二，比之自内，贞吉"],
        45: [false, "六三，比之匪人"],
        46: [true, "六四，外比之，贞吉"],
        47: [true, "九五，显比，王用三驱，失前禽，邑人不诫，吉"],
        48: [false, "上六，比之无首，凶"],
        49: [true, "初九，复自道，何其咎？吉"],
        50: [true, "九二，牵复，吉"],
        51: [false, "九三，舆说辐，夫妻反目"],
        52: [null, "六四，有孚，血去惕出，无咎"],
        53: [true, "九五，有孚挛如，富以其邻"],
        54: [false, "上九，既雨既处，尚德载，妇贞厉。月几望，君子征凶"],
        55: [null, "初九，素履，往无咎"],
        56: [true, "九二，履道坦坦，幽人贞吉"],
        57: [false, "六三，眇能视，跛能履，履虎尾，咥人，凶；武人为于大君"],
        58: [true, "九四，履虎尾，愬愬终吉"],
        59: [false, "九五，夬履，贞厉"],
        60: [true, "上九，视履考祥，其旋元吉"],
        61: [true, "初九，拔茅茹，以其汇，征吉"],
        62: [true, "九二，包荒，用冯河，不遐遗；朋亡，得尚于中行"],
        63: [null, "九三，无平不陂，无往不复，艰贞无咎。勿恤其孚，于食有福"],
        64: [null, "六四，翩翩不富以其邻，不戒以孚"],
        65: [true, "六五，帝乙归妹，以祉元吉"],
        66: [false, "上六，城复于隍，勿用师。自邑告命，贞吝"],
        67: [true, "初六，拔茅茹，以其汇，贞吉"],
        68: [false, "六二，包承，小人吉，大人否"],
        69: [false, "六三，包羞"],
        70: [true, "九四，有命无咎，畴离祉"],
        71: [true, "九五，休否，大人吉。其亡其亡，系于苞桑"],
        72: [true, "上九，倾否，先否后喜"],
        73: [null, "初九，同人于门，无咎"],
        74: [false, "六二，同人于宗，吝"],
        75: [false, "九三，伏戎于莽，升其高陵，三岁不兴"],
        76: [true, "九四，乘其墉，弗克攻，吉"],
        77: [true, "九五，同人，先号咷而后笑，大师克相遇"],
        78: [null, "上九，同人于郊，无悔"],
        79: [null, "初九，无交害，匪咎，艰则无咎"],
        80: [null, "九二，大车以载，有攸往，无咎"],
        81: [true, "九三，公用亨于天子，小人弗克"],
        82: [null, "九四，匪其彭，无咎"],
        83: [true, "六五，厥孚交如，威如，吉"],
        84: [true, "上九，自天祐之，吉无不利"],
        85: [true, "初六，谦谦君子，用涉大川，吉"],
        86: [true, "六二，鸣谦，贞吉"],
        87: [true, "九三，劳谦，君子有终，吉"],
        88: [true, "六四，无不利，撝谦"],
        89: [true, "六五，不富以其邻，利用侵伐，无不利"],
        90: [true, "上六，鸣谦，利用行师，征邑国"],
        91: [false, "初六，鸣豫，凶"],
        92: [true, "六二，介于石，不终日，贞吉"],
        93: [false, "六三，盱豫，悔；迟有悔"],
        94: [true, "九四，由豫，大有得；勿疑，朋盍簪"],
        95: [null, "六五，贞疾，恒不死"],
        96: [null, "上六，冥豫，成有渝，无咎"],
        97: [true, "初九，官有渝，贞吉；出门交有功"],
        98: [false, "六二，系小子，失丈夫"],
        99: [true, "六三，系丈夫，失小子；随有求得，利居贞"],
        100: [false, "九四，随有获，贞凶；有孚在道，以明，何咎？"],
        101: [true, "九五，孚于嘉，吉"],
        102: [false, "上六，拘系之，乃从维之；王用亨于西山"],
        103: [true, "初六，干父之蛊，有子，考无咎，厉终吉"],
        104: [false, "九二，干母之蛊，不可贞"],
        105: [null, "九三，干父之蛊，小有悔，无大咎"],
        106: [false, "六四，裕父之蛊，往见吝"],
        107: [true, "六五，干父之蛊，用誉"],
        108: [null, "上九，不事王侯，高尚其事"],
        109: [true, "初九，咸临，贞吉"],
        110: [true, "九二，咸临，吉，无不利"],
        111: [false, "六三，甘临，无攸利；既忧之，无咎"],
        112: [null, "六四，至临，无咎"],
        113: [true, "六五，知临，大君之宜，吉"],
        114: [true, "上六，敦临，吉，无咎"],
        115: [false, "初六，童观，小人无咎，君子吝"],
        116: [false, "六二，窥观，利女贞"],
        117: [null, "六三，观我生，进退"],
        118: [true, "六四，观国之光，利用宾于王"],
        119: [null, "九五，观我生，君子无咎"],
        120: [null, "上九，观其生，君子无咎"],
        121: [null, "初九，屦校灭趾，无咎"],
        122: [null, "六二，噬肤灭鼻，无咎"],
        123: [null, "六三，噬腊肉，遇毒；小吝，无咎"],
        124: [true, "九四，噬干胏，得金矢；利艰贞，吉"],
        125: [null, "六五，噬干肉，得黄金；贞厉，无咎"],
        126: [false, "上九，何校灭耳，凶"],
        127: [null, "初九，贲其趾，舍车而徒"],
        128: [null, "六二，贲其须"],
        129: [true, "六三，贲如濡如，永贞吉"],
        130: [null, "六四，贲如皤如，白马翰如，匪寇婚媾"],
        131: [null, "六五，贲于丘园，束帛戋戋，吝，终吉"],
        132: [null, "上九，白贲，无咎"],
        133: [false, "初六，剥床以足，蔑贞凶"],
        134: [false, "六二，剥床以辨，蔑贞凶"],
        135: [null, "六三，剥之，无咎"],
        136: [false, "六四，剥床以肤，凶"],
        137: [null, "六五，贯鱼，以宫人宠，无不利"],
        138: [true, "上九，硕果不食，君子得舆，小人剥庐"],
        139: [true, "初九，不远复，无祗悔，元吉"],
        140: [true, "六二，休复，吉"],
        141: [null, "六三，频复，厉无咎"],
        142: [null, "六四，中行独复"],
        143: [null, "六五，敦复，无悔"],
        144: [false, "上六，迷复，凶，有灾眚"],
        145: [null, "初九，无妄，往吉"],
        146: [true, "六二，不耕获，不菑畲，则利有攸往"],
        147: [null, "六三，无妄之灾，或系之牛，行人之得，邑人之灾"],
        148: [true, "九四，可贞，无咎"],
        149: [null, "九五，无妄之疾，勿药有喜"],
        150: [false, "上九，无妄，行有眚，无攸利"],
        151: [null, "初九，有厉，利已"],
        152: [null, "九二，舆说輹"],
        153: [true, "九三，良马逐，利艰贞，曰闲舆卫，利有攸往"],
        154: [true, "六四，童牛之牿，元吉"],
        155: [true, "六五，豮豕之牙，吉"],
        156: [true, "上九，何天之衢，亨"],
        157: [false, "初九，舍尔灵龟，观我朵颐，凶"],
        158: [false, "六二，颠颐，拂经于丘颐，征凶"],
        159: [false, "六三，拂颐，贞凶，十年勿用，无攸利"],
        160: [true, "六四，颠颐，吉，虎视眈眈，其欲逐逐，无咎"],
        161: [null, "六五，拂经，居贞吉，不可涉大川"],
        162: [true, "上九，由颐，厉吉，利涉大川"],
        163: [null, "初六，藉用白茅，无咎"],
        164: [true, "九二，枯杨生稊，老夫得其女妻，无不利"],
        165: [false, "九三，栋桡，凶"],
        166: [true, "九四，栋隆，吉，有它吝"],
        167: [true, "九五，枯杨生华，老妇得其士夫，无咎无誉"],
        168: [false, "上六，过涉灭顶，凶，无咎"],
        169: [false, "初六，习坎，入于坎窞，凶"],
        170: [null, "九二，坎有险，求小得"],
        171: [false, "六三，来之坎坎，险且枕，入于坎窞，勿用"],
        172: [null, "六四，樽酒簋贰，用缶，纳约自牖，终无咎"],
        173: [null, "九五，坎不盈，祗既平，无咎"],
        174: [false, "上六，系用徽纆，寘于丛棘，三岁不得，凶"],
        175: [null, "初九，履错然，敬之无咎"],
        176: [true, "六二，黄离，元吉"],
        177: [false, "九三，日昃之离，不鼓缶而歌，则大耋之嗟，凶"],
        178: [false, "九四，突如其来如，焚如，死如，弃如"],
        179: [true, "六五，出涕沱若，戚嗟若，吉"],
        180: [true, "上九，王用出征，有嘉折首，获匪其丑，无咎"],
        181: [null, "初六，咸其拇"],
        182: [null, "六二，咸其腓，凶，居吉"],
        183: [null, "九三，咸其股，执其随，往吝"],
        184: [null, "九四，贞吉悔亡，憧憧往来，朋从尔思"],
        185: [null, "九五，咸其脢，无悔"],
        186: [null, "上六，咸其辅颊舌"],
        187: [false, "初六，浚恒，贞凶，无攸利"],
        188: [null, "九二，悔亡"],
        189: [false, "九三，不恒其德，或承之羞，贞吝"],
        190: [false, "九四，田无禽"],
        191: [null, "六五，恒其德，贞，妇人吉，夫子凶"],
        192: [false, "上六，振恒，凶"],
        193: [null, "初六，遁尾，厉，勿用有攸往"],
        194: [null, "六二，执之用黄牛之革，莫之胜说"],
        195: [false, "九三，系遁，有疾厉，畜臣妾吉"],
        196: [true, "九四，好遁，君子吉，小人否"],
        197: [true, "九五，嘉遁，贞吉"],
        198: [true, "上九，肥遁，无不利"],
        199: [false, "初九，壮于趾，征凶，有孚"],
        200: [true, "九二，贞吉"],
        201: [false, "九三，小人用壮，君子用罔，贞厉，羝羊触藩，羸其角"],
        202: [true, "九四，贞吉悔亡，藩决不羸，壮于大舆之輹"],
        203: [false, "六五，丧羊于易，无悔"],
        204: [null, "上六，羝羊触藩，不能退，不能遂，无攸利，艰则吉"],
        205: [null, "初六，晋如摧如，贞吉，罔孚，裕无咎"],
        206: [true, "六二，晋如愁如，贞吉，受兹介福于其王母"],
        207: [null, "六三，众允，悔亡"],
        208: [false, "九四，晋如鼫鼠，贞厉"],
        209: [null, "六五，悔亡，失得勿恤，往吉无不利"],
        210: [true, "上九，晋其角，维用伐邑，厉吉无咎，贞吝"],
        211: [false, "初九，明夷于飞，垂其翼，君子于行，三日不食，有攸往，主人有言"],
        212: [true, "六二，明夷，夷于左股，用拯马壮，吉"],
        213: [false, "九三，明夷于南狩，得其大首，不可疾贞"],
        214: [null, "六四，入于左腹，获明夷之心，于出门庭"],
        215: [true, "六五，箕子之明夷，利贞"],
        216: [false, "上六，不明晦，初登于天，后入于地"],
        217: [null, "初九，闲有家，悔亡"],
        218: [null, "六二，无攸遂，在中馈，贞吉"],
        219: [null, "九三，家人嗃嗃，悔厉吉，妇子嘻嘻，终吝"],
        220: [true, "六四，富家，大吉"],
        221: [true, "九五，王假有家，勿恤吉"],
        222: [true, "上九，有孚威如，终吉"],
        223: [null, "初九，悔亡，丧马勿逐自复，见恶人无咎"],
        224: [null, "九二，遇主于巷，无咎"],
        225: [null, "六三，见舆曳，其牛掣，其人天且劓，无初有终"],
        226: [null, "九四，睽孤，遇元夫，交孚，厉无咎"],
        227: [true, "六五，悔亡，厥宗噬肤，往何咎"],
        228: [null, "上九，睽孤，见豕负涂，载鬼一车，先张之弧，后说之弧，匪寇婚媾，往遇雨则吉"],
        229: [null, "初六，往蹇来誉"],
        230: [true, "六二，王臣蹇蹇，匪躬之故"],
        231: [false, "九三，往蹇来反"],
        232: [true, "六四，往蹇来连"],
        233: [true, "九五，大蹇朋来"],
        234: [true, "上六，往蹇来硕，吉，利见大人"],
        235: [true, "初六，无咎"],
        236: [true, "九二，田获三狐，得黄矢，贞吉"],
        237: [false, "六三，负且乘，致寇至，贞吝"],
        238: [null, "九四，解而拇，朋至斯孚"],
        239: [true, "六五，君子维有解，吉，有孚于小人"],
        240: [null, "上六，公用射隼于高墉之上，获之无不利"],
        241: [null, "初九，已事遄往，无咎，酌损之"],
        242: [true, "九二，利贞，征凶，弗损益之"],
        243: [null, "六三，三人行，则损一人，一人行，则得其友"],
        244: [true, "六四，损其疾，使遄有喜，无咎"],
        245: [true, "六五，或益之十朋之龟，弗克违，元吉"],
        246: [true, "上九，弗损益之，无咎，贞吉，利有攸往，得臣无家"],
        247: [true, "初九，利用为大作，元吉，无咎"],
        248: [true, "六二，或益之十朋之龟，弗克违，永贞吉，王用享于帝，吉"],
        249: [null, "六三，益之用凶事，无咎，有孚中行，告公用圭"],
        250: [null, "六四，中行告公从，利用为依迁国"],
        251: [true, "九五，有孚惠心，勿问元吉，有孚惠我德"],
        252: [false, "上九，莫益之，或击之，立心勿恒，凶"],
        253: [false, "初九，壮于前趾，往不胜为吝"],
        254: [null, "九二，惕号，莫夜有戎，勿恤"],
        255: [false, "九三，壮于頄，有凶，君子夬夬独行，遇雨若濡，有愠无咎"],
        256: [null, "九四，臀无肤，其行次且，牵羊悔亡，闻言不信"],
        257: [true, "九五，苋陆夬夬，中行无咎"],
        258: [false, "上六，无号，终有凶"],
        259: [null, "初六，系于金柅，贞吉，有攸往，见凶，羸豕孚蹢躅"],
        260: [null, "九二，包有鱼，无咎，不利宾"],
        261: [false, "九三，臀无肤，其行次且，厉，无大咎"],
        262: [false, "九四，包无鱼，起凶"],
        263: [true, "九五，以杞包瓜，含章，有陨自天"],
        264: [null, "上九，姤其角，吝，无咎"],
        265: [true, "初六，有孚不终，乃乱乃萃，若号一握为笑，勿恤，往无咎"],
        266: [true, "六二，引吉，无咎，孚乃利用禴"],
        267: [null, "六三，萃如嗟如，无攸利，往无咎，小吝"],
        268: [true, "九四，大吉无咎"],
        269: [true, "九五，萃有位，无咎，匪孚，元永贞，悔亡"],
        270: [null, "上六，赍咨涕洟，无咎"],
        271: [true, "初六，允升，大吉"],
        272: [true, "九二，孚乃利用禴，无咎"],
        273: [null, "九三，升虚邑"],
        274: [true, "六四，王用亨于岐山，吉无咎"],
        275: [true, "六五，贞吉，升阶"],
        276: [null, "上六，冥升，利于不息之贞"],
        277: [false, "初六，臀困于株木，入于幽谷，三岁不觌"],
        278: [true, "九二，困于酒食，朱绂方来，利用享祀，征凶无咎"],
        279: [false, "六三，困于石，据于蒺藜，入于其宫，不见其妻，凶"],
        280: [null, "九四，来徐徐，困于金车，吝，有终"],
        281: [true, "九五，劓刖，困于赤绂，乃徐有说，利用祭祀"],
        282: [true, "上六，困于葛藟，于臲卼，曰动悔有悔，征吉"],
        283: [false, "初六，井泥不食，旧井无禽"],
        284: [null, "九二，井谷射鲋，瓮敝漏"],
        285: [null, "九三，井渫不食，为我心恻，可用汲，王明，并受其福"],
        286: [true, "六四，井甃，无咎"],
        287: [true, "九五，井冽寒泉，食"],
        288: [true, "上六，井收勿幕，有孚元吉"],
        289: [true, "初九，巩用黄牛之革"],
        290: [null, "六二，己日乃革之，征吉无咎"],
        291: [false, "九三，征凶，贞厉，革言三就，有孚"],
        292: [true, "九四，悔亡，有孚改命，吉"],
        293: [true, "九五，大人虎变，未占有孚"],
        294: [null, "上六，君子豹变，小人革面，征凶，居贞吉"],
        295: [true, "初六，鼎颠趾，利出否，得妾以其子，无咎"],
        296: [true, "九二，鼎有实，我仇有疾，不我能即，吉"],
        297: [true, "九三，鼎耳革，其行塞，雉膏不食，方雨亏悔，终吉"],
        298: [false, "六四，鼎折足，覆公餗，其形渥，凶"],
        299: [true, "六五，鼎黄耳金铉，利贞"],
        300: [true, "上九，鼎玉铉，大吉，无不利"],
        301: [true, "初九，震来虩虩，后笑言哑哑，吉"],
        302: [null, "六二，震来厉，亿丧贝，跻于九陵，勿逐，七日得"],
        303: [null, "六三，震苏苏，震行无眚"],
        304: [false, "九四，震遂泥"],
        305: [null, "六五，震往来厉，亿无丧，有事"],
        306: [null, "上六，震索索，视矍矍，征凶，震不于其躬，于其邻，无咎，婚媾有言"],
        307: [true, "初六，艮其趾，无咎，利永贞"],
        308: [false, "六二，艮其腓，不拯其随，其心不快"],
        309: [false, "九三，艮其限，列其夤，厉薰心"],
        310: [true, "六四，艮其身，无咎"],
        311: [true, "六五，艮其辅，言有序，悔亡"],
        312: [true, "上九，敦艮，吉"],
        313: [true, "初六，鸿渐于干，小子厉，有言，无咎"],
        314: [null, "六二，鸿渐于磐，饮食衎衎，吉"],
        315: [false, "九三，鸿渐于陆，夫征不复，妇孕不育，凶，利御寇"],
        316: [null, "六四，鸿渐于木，或得其桷，无咎"],
        317: [true, "九五，鸿渐于陵，妇三岁不孕，终莫之胜，吉"],
        318: [true, "上九，鸿渐于陆，其羽可用为仪，吉"],
        319: [true, "初九，归妹以娣，跛能履，征吉"],
        320: [null, "九二，眇能视，利幽人之贞"],
        321: [false, "六三，归妹以须，反归以娣"],
        322: [null, "九四，归妹愆期，迟归有时"],
        323: [true, "六五，帝乙归妹，其君之袂不如其娣之袂良，月几望，吉"],
        324: [false, "上六，女承筐无实，士刲羊无血，无攸利"],
        325: [true, "初九，遇其配主，虽旬无咎，往有尚"],
        326: [true, "六二，丰其蔀，日中见斗，往得疑疾，有孚发若，吉"],
        327: [null, "九三，丰其沛，日中见沬，折其右肱，无咎"],
        328: [true, "九四，丰其蔀，日中见斗，遇其夷主，吉"],
        329: [true, "六五，来章，有庆誉，吉"],
        330: [false, "上六，丰其屋，蔀其家，窥其户，阒其无人，三岁不觌，凶"],
        331: [null, "初六，旅琐琐，斯其所取灾"],
        332: [true, "六二，旅即次，怀其资，得童仆贞"],
        333: [false, "九三，旅焚其次，丧其童仆贞，厉"],
        334: [null, "九四，旅于处，得其资斧，我心不快"],
        335: [true, "六五，射雉一矢亡，终以誉命"],
        336: [false, "上九，鸟焚其巢，旅人先笑后号咷，丧牛于易，凶"],
        337: [null, "初六，进退，利武人之贞"],
        338: [true, "九二，巽在床下，用史巫纷若，吉无咎"],
        339: [false, "九三，频巽，吝"],
        340: [true, "六四，悔亡，田获三品"],
        341: [true, "九五，贞吉悔亡，无不利，无初有终，先庚三日，后庚三日，吉"],
        342: [false, "上九，巽在床下，丧其资斧，贞凶"],
        343: [true, "初九，和兑，吉"],
        344: [true, "九二，孚兑，吉，悔亡"],
        345: [false, "六三，来兑，凶"],
        346: [true, "九四，商兑未宁，介疾有喜"],
        347: [false, "九五，孚于剥，有厉"],
        348: [null, "上六，引兑"],
        349: [true, "初六，用拯马壮，吉"],
        350: [true, "九二，涣奔其机，悔亡"],
        351: [null, "六三，涣其躬，无悔"],
        352: [true, "六四，涣其群，元吉，涣有丘，匪夷所思"],
        353: [true, "九五，涣汗其大号，涣王居，无咎"],
        354: [null, "上九，涣其血去逖出，无咎"],
        355: [null, "初九，不出户庭，无咎"],
        356: [false, "九二，不出门庭，凶"],
        357: [null, "六三，不节若，则嗟若，无咎"],
        358: [true, "六四，安节，亨"],
        359: [true, "九五，甘节，吉，往有尚"],
        360: [false, "上六，苦节，贞凶，悔亡"],
        361: [true, "初九，虞吉，有它不燕"],
        362: [true, "九二，鸣鹤在阴，其子和之，我有好爵，吾与尔靡之"],
        363: [null, "六三，得敌，或鼓或罢，或泣或歌"],
        364: [true, "六四，月几望，马匹亡，无咎"],
        365: [true, "九五，有孚挛如，无咎"],
        366: [false, "上九，翰音登于天，贞凶"],
        367: [false, "初六，飞鸟以凶"],
        368: [null, "六二，过其祖，遇其妣，不及其君，遇其臣，无咎"],
        369: [false, "九三，弗过防之，从或戕之，凶"],
        370: [null, "九四，无咎，弗过遇之，往厉必戒，勿用永贞"],
        371: [null, "六五，密云不雨，自我西郊，公弋取彼在穴"],
        372: [false, "上六，弗遇过之，飞鸟离之，凶，是谓灾眚"],
        373: [null, "初九，曳其轮，濡其尾，无咎"],
        374: [false, "六二，妇丧其茀，勿逐，七日得"],
        375: [false, "九三，高宗伐鬼方，三年克之，小人勿用"],
        376: [null, "六四，繻有衣袽，终日戒"],
        377: [true, "九五，东邻杀牛，不如西邻之禴祭，实受其福"],
        378: [false, "上六，濡其首，厉"],
        379: [false, "初六，濡其尾，吝"],
        380: [true, "九二，曳其轮，贞吉"],
        381: [null, "六三，未济征凶，利涉大川"],
        382: [true, "九四，贞吉悔亡，震用伐鬼方，三年有赏于大国"],
        383: [true, "六五，贞吉无悔，君子之光，有孚吉"],
        384: [null, "上九，有孚于饮酒，无咎，濡其首，有孚失是"]
    }

    // 先天序号
    function symToNum(arr) {
        return 8 - (arr[0] * 4 + arr[1] * 2 + arr[2])
    }

    // 生克输出
    function getRelationType(elem1, elem2) {
        if (elem1 === elem2) return "比和"
        if (to[elem1] === elem2) return "体生用"
        if (to[elem2] === elem1) return "用生体"
        if (fo[elem1] === elem2) return "体克用"
        if (fo[elem2] === elem1) return "用克体"
    }

    // 全局生克
    function getRelScore(bodyElem, otherElem, bodyNum, trigramNum, bodyStrength, otherStrength) {
        // 体用比和
        if (bodyElem === otherElem) {
            let effect = (bodyStrength - 3) * 0.05 + 0.8
            // 坎卦比和
            if (trigramNum === 6) effect -= 0.05
            // 乾卦比和
            if (trigramNum === 1) effect += 0.05
            return effect
        }
        
        // 用克体
        if (fo[otherElem] === bodyElem) {
            let deltaNum = otherStrength - bodyStrength
            let baseEffect = -0.6
            let strengthFactor = 0.08
            let effect = baseEffect - (strengthFactor * deltaNum)
            // 坎卦克体
            if (trigramNum === 6) effect -= 0.1
            // 坤卦克体
            if (trigramNum === 8) effect += 0.05
            return effect
        }
        // 体生用
        else if (to[bodyElem] === otherElem) {
            // 体弱泄凶
            return (0.1 * (bodyStrength - 3)) - 0.4
        }
        // 体克用
        else if (fo[bodyElem] === otherElem) {
            let effect = 0.4
            let deltaNum = bodyStrength - otherStrength
            // 体旺克弱
            if (deltaNum >= 3) effect += 0.3
            // 体弱克旺
            if (deltaNum <= -3) effect -= 0.5
            // 中度体旺
            if (deltaNum >= 1 && deltaNum < 3) effect += 0.1
            // 中度体弱
            if (deltaNum > -3 && deltaNum <= -1) effect -= 0.3
            // 体卦为乾
            if (bodyNum === 1) effect += 0.05
            // 体卦为坤
            if (bodyNum === 8) effect -= 0.05
            return effect
        }
        // 用生体
        else if (to[otherElem] === bodyElem) {
            let effect = 0.4 + 0.1 * (otherStrength - 1)
            // 坎卦生体
            if (trigramNum === 6) effect -= 0.1
            // 乾卦生体
            if (trigramNum === 1) effect += 0.05
            // 坤卦生体
            if (trigramNum === 8) effect += 0.05
            // 体弱生体
            if (bodyStrength <= 2) effect *= 0.5 / bodyStrength + 1
            return effect
        }
    }

    // 时辰换算
    let time = Math.floor((hour + 1) / 2) % 12 + 1

    // 内外卦数
    let out = (year + month + day) % 8
    let inn = (year + month + day + time) % 8
    out = out == 0 ? 8 : out
    inn = inn == 0 ? 8 : inn

    // 动爻爻数
    let move = (year + month + day + time) % 6
    move = move == 0 ? 6 : move

    // 农历拟合
    let curPow
    let monthData = dailyPow[month]
    for (let range in monthData) {
        let [start, end] = range.split("-").map(Number)
        if (day >= start && day <= end) {
            curPow = monthData[range]
        }
    }

    // 全局计算
    let hexInfo = deriveHexagramInfo(out, inn, move, curPow)

    let usedNum = hexInfo.used.num               // 用卦卦数
    let bodyNum = hexInfo.body.num               // 体卦卦数
    let uElem = hexInfo.used.elem                // 用卦五行
    let bElem = hexInfo.body.elem                // 体卦五行
    let uBase = hexInfo.used.base                // 用卦卦气
    let bBase = hexInfo.body.base                // 体卦卦气
    let change = hexInfo.change.sym              // 变卦卦象
    let changeNum = hexInfo.change.num           // 变卦卦数
    let cElem = hexInfo.change.elem              // 变卦五行
    let cBase = hexInfo.change.base              // 变卦卦气
    let interOutNum = hexInfo.interOutNum        // 上互卦数
    let interInNum = hexInfo.interInNum          // 下互卦数
    let bodyInterNum = hexInfo.bodyInter.num     // 体互卦数
    let usedInterNum = hexInfo.usedInter.num     // 用互卦数
    let bodyInterElem = hexInfo.bodyInter.elem   // 体互五行
    let usedInterElem = hexInfo.usedInter.elem   // 用互五行
    let bodyInterBase = hexInfo.bodyInter.base   // 体互卦气
    let usedInterBase = hexInfo.usedInter.base   // 用互卦气

    let usedRelation = getRelationType(bElem, uElem)              // 用卦关系
    let changeRelation = getRelationType(bElem, cElem)            // 变卦关系
    let bodyInterRelation = getRelationType(bElem, bodyInterElem) // 体互关系
    let usedInterRelation = getRelationType(bElem, usedInterElem) // 用互关系

    // 各卦影响
    let uInfluence = getRelScore(bElem, uElem, bodyNum, usedNum, bBase, uBase)
    let cInfluence = getRelScore(bElem, cElem, bodyNum, changeNum, bBase, cBase)
    let bodyInterInfluence = getRelScore(bElem, bodyInterElem, bodyNum, bodyInterNum, bBase, bodyInterBase)
    let usedInterInfluence = getRelScore(bElem, usedInterElem, bodyNum, usedInterNum, bBase, usedInterBase)

    // 1.全局权重
    let weights = {used: 1.6, change: 0.8, bodyInter: 0.3, usedInter: 0.2}
    let unuInfluencable = Math.abs(uInfluence) <= 0.2
    if (unuInfluencable) {
        weights = {used: 1.6, change: 1.0, bodyInter: 0.5, usedInter: 0.3}
    }

    // 2. 比和叠加
    let sameBonus = 0
    let sameCount = 0
    if (usedRelation === "比和" || usedRelation === "用生体") sameCount += weights.used
    if (changeRelation === "比和" || changeRelation === "用生体") sameCount += weights.change
    if (bodyInterRelation === "比和" || bodyInterRelation === "用生体") sameCount += weights.bodyInter
    if (usedInterRelation === "比和" || usedInterRelation === "用生体") sameCount += weights.usedInter

    sameBonus = (sameCount / 2.4) * (bBase / 4) * 0.95

    // 3. 凶象惩罚
    let negHBonus = 0
    let negHCount = 0
    if (uInfluence < 0) negHCount += weights.used
    if (cInfluence < 0) negHCount += weights.change
    if (bodyInterInfluence < 0) negHCount += weights.bodyInter
    if (usedInterInfluence < 0) negHCount += weights.usedInter

    negHBonus = -(negHCount / 2.4) * ((6 - bBase) / 4) * 1.21

    // 4. 汇总得分
    let prmscore = 5 + uInfluence * weights.used + cInfluence * weights.change * moveWeightMap[move] + bodyInterInfluence * weights.bodyInter + usedInterInfluence * weights.usedInter + sameBonus + negHBonus

    // 变爻卦数
    let changeOutNum, changeInnNum;
    if (move <= 3) {
        changeOutNum = out
        changeInnNum = symToNum(change)
    } else {
        changeInnNum = inn
        changeOutNum = symToNum(change)
    }

    // 爻辞判定
    let score
    let hexAdjust = 0
    let bodyhexIndex = 0
    let changehexIndex = 0
    let usedHex = (prmscore >= 4.4 && prmscore <= 5.6)
    if (usedHex) {
        // 重排卦序
        let bodyKey = `${out}-${inn}`
        let changeKey = `${changeOutNum}-${changeInnNum}`
        let bodyHexagram64 = book[bodyKey]
        let changeHexagram64 = book[changeKey]
        if (bodyHexagram64 && changeHexagram64) {
            // 爻辞索引
            bodyhexIndex = (bodyHexagram64 - 1) * 6 + move
            changehexIndex = (changeHexagram64 - 1) * 6 + move
            // 本爻权重
            if (merged[bodyhexIndex][0]) {
                hexAdjust += 0.5
            } else if (merged[bodyhexIndex][0] === false) {
                hexAdjust -= 0.5
            } else {
                // 变爻权重
                if (merged[changehexIndex][0]) {
                    hexAdjust += 0.3
                }
                else if (merged[changehexIndex][0] === false) {
                    hexAdjust -= 0.3
                }
            }
            score = hexAdjust + prmscore
        }
    } else {
        score = prmscore
    }

    // 构建输出
    let resultStr = ""
    let finalScore = Math.round(score * 100) / 100

    // 1. 起卦信息
    resultStr += "==== 落梅之精思 ====\n"
    resultStr += `\n`
    resultStr += `日期：${year}年${month}月${day}日${hour}时\n`
    resultStr += `\n`

    // 2. 卦气旺衰
    resultStr += `【卦气旺衰】\n`
    resultStr += `   金：${powerDesc[curPow[0]-1]}（${curPow[0]}/5）\n`
    resultStr += `   木：${powerDesc[curPow[1]-1]}（${curPow[1]}/5）\n`
    resultStr += `   水：${powerDesc[curPow[2]-1]}（${curPow[2]}/5）\n`
    resultStr += `   火：${powerDesc[curPow[3]-1]}（${curPow[3]}/5）\n`
    resultStr += `   土：${powerDesc[curPow[4]-1]}（${curPow[4]}/5）\n`
    resultStr += `\n`

    // 3. 起卦计算
    resultStr += `【起卦计算】\n`
    resultStr += `1. 上卦：(${year}+${month}+${day}) mod 8 = ${out} → ${trigramNames[out]}\n`
    resultStr += `2. 下卦：(${year}+${month}+${day}+${time}) mod 8 = ${inn} → ${trigramNames[inn]}\n`
    resultStr += `3. 动爻：(${year}+${month}+${day}+${time}) mod 6 = ${move} → ${lineNames[move]}\n`
    if (move <= 3) {
        resultStr += `   • 体卦为上卦：${trigramNames[out]}（${elemNames[elemMap[out]]}）\n`
        resultStr += `   • 用卦为下卦：${trigramNames[inn]}（${elemNames[elemMap[inn]]}）\n`
    } else {
        resultStr += `   • 体卦为下卦：${trigramNames[inn]}（${elemNames[elemMap[inn]]}）\n`
        resultStr += `   • 用卦为上卦：${trigramNames[out]}（${elemNames[elemMap[out]]}）\n`
    }
    resultStr += `\n`

    // 4. 卦象信息
    resultStr += `【卦象信息】\n`
    resultStr += `   本卦：上 ${trigramNames[out]} 下 ${trigramNames[inn]}\n`
    resultStr += `   变卦：上 ${trigramNames[changeOutNum]} 下 ${trigramNames[changeInnNum]}\n`
    resultStr += `   互卦：上 ${trigramNames[interOutNum]} 下 ${trigramNames[interInNum]}\n`
    resultStr += `\n`

    // 5. 生克旺衰
    resultStr += `【全局生克】\n`

    // 体卦信息
    resultStr += `1. 体卦五行：${trigramNames[bodyNum]}，${elemNames[bElem]}\n`
    resultStr += `   卦气旺衰：${powerDesc[Math.round(bBase)-1]}，${bBase.toFixed(0)}/5\n\n`

    // 用卦分析
    resultStr += `2. 用卦五行：${trigramNames[usedNum]}，${elemNames[uElem]}\n`
    resultStr += `   卦气旺衰：${powerDesc[Math.round(uBase)-1]}，${uBase.toFixed(0)}/5\n`
    resultStr += `   生克关系：${usedRelation}\n`
    resultStr += `   理论强度：${uInfluence.toFixed(2)}\n`
    resultStr += `\n`

    if (!unuInfluencable) {
        resultStr += `体用生克趋势明显，体用为主统览全局\n`
    } else {
        resultStr += `体用生克趋势不显，提升互变参考权重\n`
    }
    resultStr += `\n`

    resultStr += `   用卦权重：${weights.used.toFixed(2)}\n`
    resultStr += `   变卦权重：${weights.change.toFixed(2)}\n`
    resultStr += `   变爻权重：${moveWeightMap[move].toFixed(2)}\n`
    resultStr += `   体互权重：${weights.bodyInter.toFixed(2)}\n`
    resultStr += `   用互权重：${weights.usedInter.toFixed(2)}\n`
    resultStr += `\n`

    // 变卦分析
    resultStr += `3. 变卦五行：${trigramNames[changeNum]}，${elemNames[cElem]}\n`
    resultStr += `   卦气旺衰：${powerDesc[Math.round(cBase)-1]}，${cBase.toFixed(0)}/5\n`
    resultStr += `   生克关系：${changeRelation}\n`
    resultStr += `   理论强度：${cInfluence.toFixed(2)}\n`
    resultStr += `\n`

    // 体互分析
    resultStr += `4. 体互五行：${trigramNames[bodyInterNum]}，${elemNames[bodyInterElem]}\n`
    resultStr += `   卦气旺衰：${powerDesc[Math.round(bodyInterBase)-1]}，${bodyInterBase.toFixed(0)}/5\n`
    resultStr += `   生克关系：${bodyInterRelation}\n`
    resultStr += `   理论强度：${bodyInterInfluence.toFixed(2)}\n`
    resultStr += `\n`

    // 用互分析
    resultStr += `5. 用互五行：${trigramNames[usedInterNum]}，${elemNames[usedInterElem]}\n`
    resultStr += `   卦气旺衰：${powerDesc[Math.round(usedInterBase)-1]}，${usedInterBase.toFixed(0)}/5\n`
    resultStr += `   生克关系：${usedInterRelation}\n`
    resultStr += `   理论强度：${usedInterInfluence.toFixed(2)}\n`
    resultStr += `\n`

    // 6. 详细计算
    resultStr += `【数术演算】\n`
    resultStr += `   初始赋分：5.00\n`
    resultStr += `   体用生克：${(uInfluence * weights.used).toFixed(2)}\n`
    resultStr += `   变卦生克：${(cInfluence * weights.change * moveWeightMap[move]).toFixed(2)}\n`
    resultStr += `   体互生克：${(bodyInterInfluence * weights.bodyInter).toFixed(2)}\n`
    resultStr += `   用互生克：${(usedInterInfluence * weights.usedInter).toFixed(2)}\n`
    resultStr += `   比和加成：${sameBonus.toFixed(2)}\n`
    resultStr += `   凶象惩罚：${negHBonus.toFixed(2)}\n`
    resultStr += `   演算得数：${prmscore.toFixed(2)}\n\n`

    // 7. 爻辞判定
    if (usedHex) {
        resultStr += `演算得数趋势不显，引入爻辞判定吉凶\n`
        if (merged[bodyhexIndex][0]) {
            resultStr += `   本爻判定：吉，+0.5\n`
        } else if (merged[bodyhexIndex][0] === false) {
            resultStr += `   本爻判定：凶，-0.5\n`
        } else {
            resultStr += `   本爻判定：平，+0.0\n`
            resultStr += `\n本爻判定趋势不显，引入变爻判定吉凶\n`
            if (merged[changehexIndex][0]) {
                resultStr += `   变爻判定：吉，+0.3\n`
            } else if (merged[changehexIndex][0] === false) {
                resultStr += `   变爻判定：凶，-0.3\n`
            } else {
                resultStr += `   变爻判定：平，+0.0\n`
                resultStr += `变爻判定趋势不显，参考爻辞决断吉凶\n\n`
            }
        }
        resultStr += `   爻辞调整：${hexAdjust.toFixed(2)}\n`
        resultStr += `   本爻内容：${merged[bodyhexIndex][1]}\n`
        resultStr += `   变爻内容：${merged[changehexIndex][1]}\n\n`
    } else {
        resultStr += `   演算得数趋势明显，无需爻辞判定吉凶\n\n`
    }

    let result
    if (finalScore <= 2) {
        result = "大凶"
    } else if (finalScore <= 3.2) {
        result = "凶"
    } else if (finalScore <= 4.4) {
        result = "小凶"
    } else if (finalScore <= 5.6) {
        result = "平"
    } else if (finalScore <= 6.8) {
        result = "小吉"
    } else if (finalScore <= 8.0) {
        result = "吉"
    } else {
        result = "大吉"
    }

    // 8. 最终结果
    resultStr += `【最终得分】：${finalScore}/10，【${result}】\n\n`
    resultStr += "==== 拟合完毕 ===="
    
    return resultStr
}
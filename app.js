class SpacedRepetitionApp {
    constructor() {
        this.cards = [];
        this.categories = [];
        this.selectedCategory = 'all';
        this.currentReviewCards = [];
        this.currentCardIndex = 0;
        this.isShowingBack = false;
        this.editingCardId = null;
        this.editingCategoryId = null;
        this.currentReviewCard = null;
        this.geminiApiKey = localStorage.getItem('geminiApiKey') || '';
        
        // Dictionary system
        this.syllables = {};
        this.currentSyllable = null;
        this.filteredSyllables = [];
        
        // Card image generation
        this.currentImageSide = null;
        this.tempCardImages = { front: null, back: null };
        
        this.initializePinyinSyllables();
        this.init();
    }

    initializePinyinSyllables() {
        // Complete Pinyin syllables with tones and example words
        const syllableData = {
            'a': {
                tones: {
                    1: { syllable: 'ā', examples: ['阿 (ā) - prefix for names'] },
                    2: { syllable: 'á', examples: ['啊 (á) - exclamation'] },
                    3: { syllable: 'ǎ', examples: ['啊 (ǎ) - what'] },
                    4: { syllable: 'à', examples: ['啊 (à) - oh'] },
                    5: { syllable: 'a', examples: ['啊 (a) - particle'] }
                }
            },
            'ai': {
                tones: {
                    1: { syllable: 'āi', examples: ['哀 (āi) - sorrow'] },
                    2: { syllable: 'ái', examples: ['癌 (ái) - cancer'] },
                    3: { syllable: 'ǎi', examples: ['矮 (ǎi) - short'] },
                    4: { syllable: 'ài', examples: ['爱 (ài) - love', '艾 (ài) - wormwood'] }
                }
            },
            'an': {
                tones: {
                    1: { syllable: 'ān', examples: ['安 (ān) - peaceful'] },
                    2: { syllable: 'án', examples: ['岸 (án) - shore'] },
                    3: { syllable: 'ǎn', examples: ['俺 (ǎn) - I (dialectal)'] },
                    4: { syllable: 'àn', examples: ['案 (àn) - case'] }
                }
            },
            'ang': {
                tones: {
                    1: { syllable: 'āng', examples: ['肮 (āng) - dirty'] },
                    2: { syllable: 'áng', examples: ['昂 (áng) - high'] },
                    3: { syllable: 'ǎng', examples: ['仰 (ǎng) - look up'] },
                    4: { syllable: 'àng', examples: ['盎 (àng) - abundant'] }
                }
            },
            'ao': {
                tones: {
                    1: { syllable: 'āo', examples: ['凹 (āo) - concave'] },
                    2: { syllable: 'áo', examples: ['熬 (áo) - endure'] },
                    3: { syllable: 'ǎo', examples: ['袄 (ǎo) - jacket'] },
                    4: { syllable: 'ào', examples: ['奥 (ào) - mysterious'] }
                }
            },
            'ba': {
                tones: {
                    1: { syllable: 'bā', examples: ['八 (bā) - eight', '巴 (bā) - cling to'] },
                    2: { syllable: 'bá', examples: ['拔 (bá) - pull out'] },
                    3: { syllable: 'bǎ', examples: ['把 (bǎ) - handle'] },
                    4: { syllable: 'bà', examples: ['爸 (bà) - dad'] }
                }
            },
            'bai': {
                tones: {
                    2: { syllable: 'bái', examples: ['白 (bái) - white'] },
                    3: { syllable: 'bǎi', examples: ['百 (bǎi) - hundred'] },
                    4: { syllable: 'bài', examples: ['拜 (bài) - worship'] }
                }
            },
            'ban': {
                tones: {
                    1: { syllable: 'bān', examples: ['班 (bān) - class'] },
                    3: { syllable: 'bǎn', examples: ['板 (bǎn) - board'] },
                    4: { syllable: 'bàn', examples: ['半 (bàn) - half'] }
                }
            },
            'bang': {
                tones: {
                    1: { syllable: 'bāng', examples: ['帮 (bāng) - help'] },
                    3: { syllable: 'bǎng', examples: ['榜 (bǎng) - list'] },
                    4: { syllable: 'bàng', examples: ['棒 (bàng) - stick'] }
                }
            },
            'bao': {
                tones: {
                    1: { syllable: 'bāo', examples: ['包 (bāo) - wrap'] },
                    2: { syllable: 'báo', examples: ['薄 (báo) - thin'] },
                    3: { syllable: 'bǎo', examples: ['宝 (bǎo) - treasure'] },
                    4: { syllable: 'bào', examples: ['报 (bào) - report'] }
                }
            },
            'bei': {
                tones: {
                    1: { syllable: 'bēi', examples: ['杯 (bēi) - cup', '悲 (bēi) - sad'] },
                    2: { syllable: 'béi', examples: ['北 (běi) - north'] },
                    3: { syllable: 'běi', examples: ['北 (běi) - north'] },
                    4: { syllable: 'bèi', examples: ['被 (bèi) - by/passive', '背 (bèi) - back'] }
                }
            },
            'ben': {
                tones: {
                    1: { syllable: 'bēn', examples: ['奔 (bēn) - run'] },
                    3: { syllable: 'běn', examples: ['本 (běn) - book/root'] },
                    4: { syllable: 'bèn', examples: ['笨 (bèn) - stupid'] }
                }
            },
            'beng': {
                tones: {
                    1: { syllable: 'bēng', examples: ['崩 (bēng) - collapse'] },
                    2: { syllable: 'béng', examples: ['绷 (béng) - stretch'] },
                    3: { syllable: 'běng', examples: ['蹦 (běng) - jump'] },
                    4: { syllable: 'bèng', examples: ['迸 (bèng) - burst'] }
                }
            },
            'bi': {
                tones: {
                    1: { syllable: 'bī', examples: ['逼 (bī) - force'] },
                    2: { syllable: 'bí', examples: ['鼻 (bí) - nose'] },
                    3: { syllable: 'bǐ', examples: ['比 (bǐ) - compare', '笔 (bǐ) - pen'] },
                    4: { syllable: 'bì', examples: ['必 (bì) - must', '闭 (bì) - close'] }
                }
            },
            'bian': {
                tones: {
                    1: { syllable: 'biān', examples: ['边 (biān) - side/edge'] },
                    2: { syllable: 'bián', examples: ['辩 (biàn) - argue'] },
                    3: { syllable: 'biǎn', examples: ['扁 (biǎn) - flat'] },
                    4: { syllable: 'biàn', examples: ['变 (biàn) - change', '便 (biàn) - convenient'] }
                }
            },
            'biao': {
                tones: {
                    1: { syllable: 'biāo', examples: ['标 (biāo) - mark/standard'] },
                    2: { syllable: 'biáo', examples: ['雹 (báo) - hail'] },
                    3: { syllable: 'biǎo', examples: ['表 (biǎo) - watch/form'] },
                    4: { syllable: 'biào', examples: ['镖 (biāo) - dart'] }
                }
            },
            'bie': {
                tones: {
                    1: { syllable: 'biē', examples: ['憋 (biē) - hold back'] },
                    2: { syllable: 'bié', examples: ['别 (bié) - don\'t/other'] },
                    3: { syllable: 'biě', examples: ['瘪 (biě) - flat/deflated'] },
                    4: { syllable: 'biè', examples: ['蹩 (bié) - awkward'] }
                }
            },
            'bin': {
                tones: {
                    1: { syllable: 'bīn', examples: ['宾 (bīn) - guest'] },
                    3: { syllable: 'bǐn', examples: ['品 (pǐn) - product'] },
                    4: { syllable: 'bìn', examples: ['殡 (bìn) - funeral'] }
                }
            },
            'bing': {
                tones: {
                    1: { syllable: 'bīng', examples: ['冰 (bīng) - ice', '兵 (bīng) - soldier'] },
                    3: { syllable: 'bǐng', examples: ['丙 (bǐng) - third', '饼 (bǐng) - cake'] },
                    4: { syllable: 'bìng', examples: ['病 (bìng) - sick', '并 (bìng) - and'] }
                }
            },
            'bo': {
                tones: {
                    1: { syllable: 'bō', examples: ['波 (bō) - wave', '播 (bō) - broadcast'] },
                    2: { syllable: 'bó', examples: ['博 (bó) - broad', '薄 (báo) - thin'] },
                    3: { syllable: 'bǒ', examples: ['跛 (bǒ) - limp'] },
                    4: { syllable: 'bò', examples: ['泊 (bó) - anchor'] }
                }
            },
            'bu': {
                tones: {
                    1: { syllable: 'bū', examples: ['不 (bù) - not'] },
                    2: { syllable: 'bú', examples: ['不 (bù) - not (tone change)'] },
                    3: { syllable: 'bǔ', examples: ['补 (bǔ) - supplement'] },
                    4: { syllable: 'bù', examples: ['不 (bù) - not', '布 (bù) - cloth', '步 (bù) - step'] }
                }
            },
            'ca': {
                tones: {
                    1: { syllable: 'cā', examples: ['擦 (cā) - wipe'] },
                    2: { syllable: 'cá', examples: ['察 (chá) - examine'] },
                    3: { syllable: 'cǎ', examples: ['擦 (cā) - wipe (tone 3)'] },
                    4: { syllable: 'cà', examples: ['蹭 (cèng) - rub against'] }
                }
            },
            'cai': {
                tones: {
                    1: { syllable: 'cāi', examples: ['猜 (cāi) - guess'] },
                    2: { syllable: 'cái', examples: ['才 (cái) - just/talent', '财 (cái) - wealth'] },
                    3: { syllable: 'cǎi', examples: ['采 (cǎi) - pick/gather', '彩 (cǎi) - color'] },
                    4: { syllable: 'cài', examples: ['菜 (cài) - vegetable/dish'] }
                }
            },
            'can': {
                tones: {
                    1: { syllable: 'cān', examples: ['参 (cān) - participate'] },
                    2: { syllable: 'cán', examples: ['残 (cán) - remain/cruel'] },
                    3: { syllable: 'cǎn', examples: ['惨 (cǎn) - miserable'] },
                    4: { syllable: 'càn', examples: ['灿 (càn) - brilliant'] }
                }
            },
            'cang': {
                tones: {
                    1: { syllable: 'cāng', examples: ['苍 (cāng) - blue/grey'] },
                    2: { syllable: 'cáng', examples: ['藏 (cáng) - hide'] },
                    3: { syllable: 'cǎng', examples: ['舱 (cāng) - cabin'] },
                    4: { syllable: 'càng', examples: ['仓 (cāng) - warehouse'] }
                }
            },
            'cao': {
                tones: {
                    1: { syllable: 'cāo', examples: ['操 (cāo) - operate'] },
                    2: { syllable: 'cáo', examples: ['曹 (cáo) - surname'] },
                    3: { syllable: 'cǎo', examples: ['草 (cǎo) - grass'] },
                    4: { syllable: 'cào', examples: ['糙 (cāo) - rough'] }
                }
            },
            'ce': {
                tones: {
                    4: { syllable: 'cè', examples: ['册 (cè) - book', '侧 (cè) - side', '测 (cè) - measure'] }
                }
            },
            'cen': {
                tones: {
                    2: { syllable: 'cén', examples: ['岑 (cén) - small hill'] }
                }
            },
            'ceng': {
                tones: {
                    1: { syllable: 'cēng', examples: ['蹭 (cèng) - rub'] },
                    2: { syllable: 'céng', examples: ['曾 (céng) - once'] },
                    4: { syllable: 'cèng', examples: ['蹭 (cèng) - rub against'] }
                }
            },
            'cha': {
                tones: {
                    1: { syllable: 'chā', examples: ['叉 (chā) - fork', '插 (chā) - insert'] },
                    2: { syllable: 'chá', examples: ['茶 (chá) - tea', '查 (chá) - check'] },
                    3: { syllable: 'chǎ', examples: ['岔 (chà) - branch'] },
                    4: { syllable: 'chà', examples: ['差 (chà) - poor/lack'] }
                }
            },
            'chai': {
                tones: {
                    1: { syllable: 'chāi', examples: ['拆 (chāi) - tear down'] },
                    2: { syllable: 'chái', examples: ['柴 (chái) - firewood'] },
                    4: { syllable: 'chài', examples: ['差 (chāi) - differ'] }
                }
            },
            'chan': {
                tones: {
                    1: { syllable: 'chān', examples: ['搀 (chān) - support'] },
                    2: { syllable: 'chán', examples: ['蝉 (chán) - cicada', '缠 (chán) - wind around'] },
                    3: { syllable: 'chǎn', examples: ['产 (chǎn) - produce', '铲 (chǎn) - shovel'] },
                    4: { syllable: 'chàn', examples: ['颤 (chàn) - tremble'] }
                }
            },
            'chang': {
                tones: {
                    1: { syllable: 'chāng', examples: ['昌 (chāng) - flourish'] },
                    2: { syllable: 'cháng', examples: ['长 (cháng) - long', '常 (cháng) - often'] },
                    3: { syllable: 'chǎng', examples: ['场 (chǎng) - field', '厂 (chǎng) - factory'] },
                    4: { syllable: 'chàng', examples: ['唱 (chàng) - sing'] }
                }
            },
            'chao': {
                tones: {
                    1: { syllable: 'chāo', examples: ['超 (chāo) - exceed'] },
                    2: { syllable: 'cháo', examples: ['潮 (cháo) - tide', '朝 (cháo) - dynasty'] },
                    3: { syllable: 'chǎo', examples: ['炒 (chǎo) - stir-fry'] },
                    4: { syllable: 'chào', examples: ['朝 (zhāo) - toward'] }
                }
            },
            'che': {
                tones: {
                    1: { syllable: 'chē', examples: ['车 (chē) - vehicle'] },
                    3: { syllable: 'chě', examples: ['扯 (chě) - pull'] },
                    4: { syllable: 'chè', examples: ['彻 (chè) - thorough'] }
                }
            },
            'chen': {
                tones: {
                    1: { syllable: 'chēn', examples: ['嗔 (chēn) - anger'] },
                    2: { syllable: 'chén', examples: ['沉 (chén) - sink', '尘 (chén) - dust', '晨 (chén) - morning'] },
                    3: { syllable: 'chěn', examples: ['碜 (chěn) - ugly'] },
                    4: { syllable: 'chèn', examples: ['趁 (chèn) - take advantage'] }
                }
            },
            'cheng': {
                tones: {
                    1: { syllable: 'chēng', examples: ['撑 (chēng) - support'] },
                    2: { syllable: 'chéng', examples: ['成 (chéng) - become', '城 (chéng) - city', '程 (chéng) - process'] },
                    3: { syllable: 'chěng', examples: ['逞 (chěng) - show off'] },
                    4: { syllable: 'chèng', examples: ['秤 (chèng) - scale/balance'] }
                }
            },
            'chi': {
                tones: {
                    1: { syllable: 'chī', examples: ['吃 (chī) - eat', '痴 (chī) - foolish'] },
                    2: { syllable: 'chí', examples: ['池 (chí) - pond', '持 (chí) - hold', '迟 (chí) - late'] },
                    3: { syllable: 'chǐ', examples: ['尺 (chǐ) - ruler', '齿 (chǐ) - teeth'] },
                    4: { syllable: 'chì', examples: ['赤 (chì) - red'] }
                }
            },
            'chong': {
                tones: {
                    1: { syllable: 'chōng', examples: ['冲 (chōng) - rush', '充 (chōng) - fill'] },
                    2: { syllable: 'chóng', examples: ['虫 (chóng) - insect', '重 (chóng) - repeat'] },
                    3: { syllable: 'chǒng', examples: ['宠 (chǒng) - pamper'] },
                    4: { syllable: 'chòng', examples: ['冲 (chòng) - toward'] }
                }
            },
            'chou': {
                tones: {
                    1: { syllable: 'chōu', examples: ['抽 (chōu) - draw out'] },
                    2: { syllable: 'chóu', examples: ['愁 (chóu) - worry', '仇 (chóu) - hatred'] },
                    3: { syllable: 'chǒu', examples: ['丑 (chǒu) - ugly'] },
                    4: { syllable: 'chòu', examples: ['臭 (chòu) - smelly'] }
                }
            },
            'chu': {
                tones: {
                    1: { syllable: 'chū', examples: ['出 (chū) - out', '初 (chū) - beginning'] },
                    2: { syllable: 'chú', examples: ['除 (chú) - remove', '厨 (chú) - kitchen'] },
                    3: { syllable: 'chǔ', examples: ['处 (chǔ) - place', '楚 (chǔ) - clear'] },
                    4: { syllable: 'chù', examples: ['触 (chù) - touch', '处 (chù) - place'] }
                }
            },
            'chuai': {
                tones: {
                    1: { syllable: 'chuāi', examples: ['揣 (chuāi) - put in pocket'] },
                    3: { syllable: 'chuǎi', examples: ['揣 (chuǎi) - estimate'] },
                    4: { syllable: 'chuài', examples: ['踹 (chuài) - kick'] }
                }
            },
            'chuan': {
                tones: {
                    1: { syllable: 'chuān', examples: ['川 (chuān) - river', '穿 (chuān) - wear'] },
                    2: { syllable: 'chuán', examples: ['传 (chuán) - transmit', '船 (chuán) - boat'] },
                    3: { syllable: 'chuǎn', examples: ['喘 (chuǎn) - pant'] },
                    4: { syllable: 'chuàn', examples: ['串 (chuàn) - string together'] }
                }
            },
            'chuang': {
                tones: {
                    1: { syllable: 'chuāng', examples: ['窗 (chuāng) - window', '床 (chuáng) - bed'] },
                    2: { syllable: 'chuáng', examples: ['床 (chuáng) - bed'] },
                    3: { syllable: 'chuǎng', examples: ['闯 (chuǎng) - rush'] },
                    4: { syllable: 'chuàng', examples: ['创 (chuàng) - create'] }
                }
            },
            'chui': {
                tones: {
                    1: { syllable: 'chuī', examples: ['吹 (chuī) - blow'] },
                    2: { syllable: 'chuí', examples: ['垂 (chuí) - hang down', '锤 (chuí) - hammer'] },
                    4: { syllable: 'chuì', examples: ['啜 (chuò) - sip'] }
                }
            },
            'chun': {
                tones: {
                    1: { syllable: 'chūn', examples: ['春 (chūn) - spring'] },
                    2: { syllable: 'chún', examples: ['纯 (chún) - pure', '唇 (chún) - lips'] },
                    3: { syllable: 'chǔn', examples: ['蠢 (chǔn) - stupid'] }
                }
            },
            'chuo': {
                tones: {
                    1: { syllable: 'chuō', examples: ['戳 (chuō) - poke'] },
                    4: { syllable: 'chuò', examples: ['绰 (chuò) - ample'] }
                }
            },
            'ci': {
                tones: {
                    1: { syllable: 'cī', examples: ['疵 (cī) - flaw'] },
                    2: { syllable: 'cí', examples: ['词 (cí) - word', '磁 (cí) - magnetic', '慈 (cí) - kind'] },
                    3: { syllable: 'cǐ', examples: ['此 (cǐ) - this'] },
                    4: { syllable: 'cì', examples: ['次 (cì) - time/order', '刺 (cì) - thorn'] }
                }
            },
            'cong': {
                tones: {
                    1: { syllable: 'cōng', examples: ['葱 (cōng) - green onion', '聪 (cōng) - intelligent'] },
                    2: { syllable: 'cóng', examples: ['从 (cóng) - from', '丛 (cóng) - cluster'] },
                    4: { syllable: 'còng', examples: ['凑 (còu) - gather'] }
                }
            },
            'cou': {
                tones: {
                    4: { syllable: 'còu', examples: ['凑 (còu) - gather together'] }
                }
            },
            'cu': {
                tones: {
                    1: { syllable: 'cū', examples: ['粗 (cū) - rough/thick'] },
                    2: { syllable: 'cú', examples: ['卒 (zú) - soldier'] },
                    4: { syllable: 'cù', examples: ['醋 (cù) - vinegar', '促 (cù) - urge'] }
                }
            },
            'cuan': {
                tones: {
                    1: { syllable: 'cuān', examples: ['蹿 (cuān) - leap'] },
                    2: { syllable: 'cuán', examples: ['攒 (cuán) - save up'] },
                    4: { syllable: 'cuàn', examples: ['窜 (cuàn) - flee'] }
                }
            },
            'cui': {
                tones: {
                    1: { syllable: 'cuī', examples: ['催 (cuī) - urge'] },
                    3: { syllable: 'cuǐ', examples: ['脆 (cuì) - crisp'] },
                    4: { syllable: 'cuì', examples: ['翠 (cuì) - jade green', '脆 (cuì) - crisp'] }
                }
            },
            'cun': {
                tones: {
                    1: { syllable: 'cūn', examples: ['村 (cūn) - village'] },
                    2: { syllable: 'cún', examples: ['存 (cún) - exist'] },
                    3: { syllable: 'cǔn', examples: ['寸 (cùn) - inch'] }
                }
            },
            'cuo': {
                tones: {
                    1: { syllable: 'cuō', examples: ['搓 (cuō) - rub'] },
                    2: { syllable: 'cuó', examples: ['嵯 (cuó) - lofty'] },
                    3: { syllable: 'cuǒ', examples: ['撮 (cuō) - pinch'] },
                    4: { syllable: 'cuò', examples: ['错 (cuò) - wrong', '措 (cuò) - measure'] }
                }
            },
            'da': {
                tones: {
                    1: { syllable: 'dā', examples: ['搭 (dā) - put up'] },
                    2: { syllable: 'dá', examples: ['达 (dá) - reach', '答 (dá) - answer'] },
                    3: { syllable: 'dǎ', examples: ['打 (dǎ) - hit'] },
                    4: { syllable: 'dà', examples: ['大 (dà) - big'] }
                }
            },
            'dai': {
                tones: {
                    1: { syllable: 'dāi', examples: ['呆 (dāi) - dull'] },
                    3: { syllable: 'dǎi', examples: ['歹 (dǎi) - bad'] },
                    4: { syllable: 'dài', examples: ['代 (dài) - substitute', '带 (dài) - belt/bring', '待 (dài) - wait'] }
                }
            },
            'dan': {
                tones: {
                    1: { syllable: 'dān', examples: ['单 (dān) - single', '担 (dān) - carry'] },
                    2: { syllable: 'dán', examples: ['弹 (dàn) - bullet'] },
                    3: { syllable: 'dǎn', examples: ['胆 (dǎn) - gall bladder'] },
                    4: { syllable: 'dàn', examples: ['但 (dàn) - but', '蛋 (dàn) - egg', '淡 (dàn) - light'] }
                }
            },
            'dang': {
                tones: {
                    1: { syllable: 'dāng', examples: ['当 (dāng) - should', '党 (dǎng) - party'] },
                    3: { syllable: 'dǎng', examples: ['党 (dǎng) - party'] },
                    4: { syllable: 'dàng', examples: ['当 (dàng) - suitable'] }
                }
            },
            'dao': {
                tones: {
                    1: { syllable: 'dāo', examples: ['刀 (dāo) - knife'] },
                    2: { syllable: 'dáo', examples: ['捣 (dǎo) - pound'] },
                    3: { syllable: 'dǎo', examples: ['导 (dǎo) - guide', '岛 (dǎo) - island'] },
                    4: { syllable: 'dào', examples: ['道 (dào) - way', '到 (dào) - arrive'] }
                }
            },
            'de': {
                tones: {
                    1: { syllable: 'dē', examples: ['得 (de) - particle'] },
                    2: { syllable: 'dé', examples: ['德 (dé) - virtue', '得 (dé) - get'] },
                    5: { syllable: 'de', examples: ['的 (de) - possessive particle'] }
                }
            },
            'deng': {
                tones: {
                    1: { syllable: 'dēng', examples: ['灯 (dēng) - lamp'] },
                    3: { syllable: 'děng', examples: ['等 (děng) - wait/equal'] },
                    4: { syllable: 'dèng', examples: ['瞪 (dèng) - stare'] }
                }
            },
            'di': {
                tones: {
                    1: { syllable: 'dī', examples: ['滴 (dī) - drop'] },
                    2: { syllable: 'dí', examples: ['敌 (dí) - enemy', '笛 (dí) - flute'] },
                    3: { syllable: 'dǐ', examples: ['底 (dǐ) - bottom'] },
                    4: { syllable: 'dì', examples: ['地 (dì) - earth', '第 (dì) - ordinal', '弟 (dì) - brother'] }
                }
            },
            'dian': {
                tones: {
                    1: { syllable: 'diān', examples: ['颠 (diān) - upside down'] },
                    3: { syllable: 'diǎn', examples: ['点 (diǎn) - point/dot'] },
                    4: { syllable: 'diàn', examples: ['电 (diàn) - electricity', '店 (diàn) - shop'] }
                }
            },
            'diao': {
                tones: {
                    1: { syllable: 'diāo', examples: ['雕 (diāo) - carve'] },
                    3: { syllable: 'diǎo', examples: ['鸟 (niǎo) - bird'] },
                    4: { syllable: 'diào', examples: ['调 (diào) - tune'] }
                }
            },
            'die': {
                tones: {
                    1: { syllable: 'diē', examples: ['爹 (diē) - dad'] },
                    2: { syllable: 'dié', examples: ['叠 (dié) - stack', '蝶 (dié) - butterfly'] }
                }
            },
            'ding': {
                tones: {
                    1: { syllable: 'dīng', examples: ['丁 (dīng) - man', '钉 (dīng) - nail'] },
                    3: { syllable: 'dǐng', examples: ['顶 (dǐng) - top'] },
                    4: { syllable: 'dìng', examples: ['定 (dìng) - decide', '订 (dìng) - book/order'] }
                }
            },
            'diu': {
                tones: {
                    1: { syllable: 'diū', examples: ['丢 (diū) - lose'] }
                }
            },
            'dong': {
                tones: {
                    1: { syllable: 'dōng', examples: ['东 (dōng) - east', '冬 (dōng) - winter'] },
                    3: { syllable: 'dǒng', examples: ['懂 (dǒng) - understand'] },
                    4: { syllable: 'dòng', examples: ['动 (dòng) - move', '冻 (dòng) - freeze'] }
                }
            },
            'dou': {
                tones: {
                    1: { syllable: 'dōu', examples: ['都 (dōu) - all'] },
                    3: { syllable: 'dǒu', examples: ['斗 (dǒu) - fight'] },
                    4: { syllable: 'dòu', examples: ['豆 (dòu) - bean'] }
                }
            },
            'du': {
                tones: {
                    1: { syllable: 'dū', examples: ['都 (dū) - capital'] },
                    2: { syllable: 'dú', examples: ['读 (dú) - read', '独 (dú) - alone', '毒 (dú) - poison'] },
                    3: { syllable: 'dǔ', examples: ['赌 (dǔ) - gamble', '堵 (dǔ) - block'] },
                    4: { syllable: 'dù', examples: ['度 (dù) - degree', '肚 (dù) - belly'] }
                }
            },
            'duan': {
                tones: {
                    1: { syllable: 'duān', examples: ['端 (duān) - end/carry'] },
                    3: { syllable: 'duǎn', examples: ['短 (duǎn) - short'] },
                    4: { syllable: 'duàn', examples: ['断 (duàn) - break', '段 (duàn) - section'] }
                }
            },
            'dui': {
                tones: {
                    1: { syllable: 'duī', examples: ['堆 (duī) - pile'] },
                    4: { syllable: 'duì', examples: ['对 (duì) - correct/pair', '队 (duì) - team'] }
                }
            },
            'dun': {
                tones: {
                    1: { syllable: 'dūn', examples: ['墩 (dūn) - mound'] },
                    3: { syllable: 'dǔn', examples: ['盾 (dùn) - shield'] },
                    4: { syllable: 'dùn', examples: ['顿 (dùn) - pause', '钝 (dùn) - blunt'] }
                }
            },
            'duo': {
                tones: {
                    1: { syllable: 'duō', examples: ['多 (duō) - many'] },
                    2: { syllable: 'duó', examples: ['夺 (duó) - seize'] },
                    3: { syllable: 'duǒ', examples: ['朵 (duǒ) - flower', '躲 (duǒ) - hide'] },
                    4: { syllable: 'duò', examples: ['堕 (duò) - fall'] }
                }
            },
            'e': {
                tones: {
                    1: { syllable: 'ē', examples: ['哎 (āi) - hey'] },
                    2: { syllable: 'é', examples: ['鹅 (é) - goose', '额 (é) - forehead'] },
                    3: { syllable: 'ě', examples: ['恶 (è) - evil'] },
                    4: { syllable: 'è', examples: ['恶 (è) - evil', '饿 (è) - hungry'] }
                }
            },
            'ei': {
                tones: {
                    2: { syllable: 'éi', examples: ['诶 (éi) - hey'] }
                }
            },
            'en': {
                tones: {
                    1: { syllable: 'ēn', examples: ['恩 (ēn) - grace'] },
                    4: { syllable: 'èn', examples: ['嗯 (èn) - mm'] }
                }
            },
            'eng': {
                tones: {
                    2: { syllable: 'éng', examples: ['嗯 (ng) - mm'] }
                }
            },
            'er': {
                tones: {
                    2: { syllable: 'ér', examples: ['儿 (ér) - child', '而 (ér) - and'] },
                    3: { syllable: 'ěr', examples: ['尔 (ěr) - you', '耳 (ěr) - ear'] },
                    4: { syllable: 'èr', examples: ['二 (èr) - two'] }
                }
            },
            'fa': {
                tones: {
                    1: { syllable: 'fā', examples: ['发 (fā) - send/hair'] },
                    2: { syllable: 'fá', examples: ['罚 (fá) - punish'] },
                    3: { syllable: 'fǎ', examples: ['法 (fǎ) - law'] },
                    4: { syllable: 'fà', examples: ['发 (fà) - hair'] }
                }
            },
            'fan': {
                tones: {
                    1: { syllable: 'fān', examples: ['翻 (fān) - turn over'] },
                    2: { syllable: 'fán', examples: ['凡 (fán) - ordinary', '烦 (fán) - annoyed'] },
                    3: { syllable: 'fǎn', examples: ['反 (fǎn) - opposite'] },
                    4: { syllable: 'fàn', examples: ['饭 (fàn) - rice/meal'] }
                }
            },
            'fang': {
                tones: {
                    1: { syllable: 'fāng', examples: ['方 (fāng) - square/direction'] },
                    2: { syllable: 'fáng', examples: ['房 (fáng) - house', '防 (fáng) - prevent'] },
                    3: { syllable: 'fǎng', examples: ['访 (fǎng) - visit'] },
                    4: { syllable: 'fàng', examples: ['放 (fàng) - put/release'] }
                }
            },
            'fei': {
                tones: {
                    1: { syllable: 'fēi', examples: ['飞 (fēi) - fly', '非 (fēi) - not'] },
                    2: { syllable: 'féi', examples: ['肥 (féi) - fat'] },
                    3: { syllable: 'fěi', examples: ['匪 (fěi) - bandit'] },
                    4: { syllable: 'fèi', examples: ['费 (fèi) - cost', '废 (fèi) - waste'] }
                }
            },
            'fen': {
                tones: {
                    1: { syllable: 'fēn', examples: ['分 (fēn) - divide', '芬 (fēn) - fragrant'] },
                    2: { syllable: 'fén', examples: ['坟 (fén) - grave'] },
                    3: { syllable: 'fěn', examples: ['粉 (fěn) - powder'] },
                    4: { syllable: 'fèn', examples: ['份 (fèn) - portion', '奋 (fèn) - strive'] }
                }
            },
            'feng': {
                tones: {
                    1: { syllable: 'fēng', examples: ['风 (fēng) - wind', '封 (fēng) - seal'] },
                    2: { syllable: 'féng', examples: ['逢 (féng) - meet'] },
                    3: { syllable: 'fěng', examples: ['讽 (fěng) - satirize'] },
                    4: { syllable: 'fèng', examples: ['凤 (fèng) - phoenix'] }
                }
            },
            'fo': {
                tones: {
                    2: { syllable: 'fó', examples: ['佛 (fó) - Buddha'] }
                }
            },
            'fou': {
                tones: {
                    3: { syllable: 'fǒu', examples: ['否 (fǒu) - no'] }
                }
            },
            'fu': {
                tones: {
                    1: { syllable: 'fū', examples: ['夫 (fū) - husband'] },
                    2: { syllable: 'fú', examples: ['福 (fú) - fortune', '扶 (fú) - support'] },
                    3: { syllable: 'fǔ', examples: ['府 (fǔ) - government'] },
                    4: { syllable: 'fù', examples: ['父 (fù) - father', '富 (fù) - rich', '复 (fù) - repeat'] }
                }
            },
            'ga': {
                tones: {
                    1: { syllable: 'gā', examples: ['嘎 (gā) - sound'] },
                    2: { syllable: 'gá', examples: ['嘎 (gá) - sound'] },
                    3: { syllable: 'gǎ', examples: ['嘎 (gǎ) - sound'] }
                }
            },
            'gai': {
                tones: {
                    1: { syllable: 'gāi', examples: ['该 (gāi) - should'] },
                    3: { syllable: 'gǎi', examples: ['改 (gǎi) - change'] },
                    4: { syllable: 'gài', examples: ['盖 (gài) - cover'] }
                }
            },
            'gan': {
                tones: {
                    1: { syllable: 'gān', examples: ['干 (gān) - dry'] },
                    3: { syllable: 'gǎn', examples: ['感 (gǎn) - feel', '敢 (gǎn) - dare'] },
                    4: { syllable: 'gàn', examples: ['干 (gàn) - do'] }
                }
            },
            'gang': {
                tones: {
                    1: { syllable: 'gāng', examples: ['刚 (gāng) - just', '钢 (gāng) - steel'] },
                    3: { syllable: 'gǎng', examples: ['港 (gǎng) - port'] },
                    4: { syllable: 'gàng', examples: ['杠 (gàng) - pole'] }
                }
            },
            'gao': {
                tones: {
                    1: { syllable: 'gāo', examples: ['高 (gāo) - tall'] },
                    2: { syllable: 'gáo', examples: ['膏 (gāo) - paste'] },
                    3: { syllable: 'gǎo', examples: ['搞 (gǎo) - do'] },
                    4: { syllable: 'gào', examples: ['告 (gào) - tell'] }
                }
            },
            'ge': {
                tones: {
                    1: { syllable: 'gē', examples: ['歌 (gē) - song', '哥 (gē) - brother'] },
                    2: { syllable: 'gé', examples: ['格 (gé) - pattern'] },
                    3: { syllable: 'gě', examples: ['舸 (gě) - boat'] },
                    4: { syllable: 'gè', examples: ['个 (gè) - individual'] }
                }
            },
            'gei': {
                tones: {
                    3: { syllable: 'gěi', examples: ['给 (gěi) - give'] }
                }
            },
            'gen': {
                tones: {
                    1: { syllable: 'gēn', examples: ['根 (gēn) - root'] },
                    2: { syllable: 'gén', examples: ['跟 (gēn) - follow'] },
                    4: { syllable: 'gèn', examples: ['亘 (gèn) - extend'] }
                }
            },
            'geng': {
                tones: {
                    1: { syllable: 'gēng', examples: ['更 (gēng) - more'] },
                    3: { syllable: 'gěng', examples: ['梗 (gěng) - stem'] },
                    4: { syllable: 'gèng', examples: ['更 (gèng) - more'] }
                }
            },
            'gong': {
                tones: {
                    1: { syllable: 'gōng', examples: ['工 (gōng) - work', '公 (gōng) - public'] },
                    3: { syllable: 'gǒng', examples: ['巩 (gǒng) - consolidate'] },
                    4: { syllable: 'gòng', examples: ['共 (gòng) - together'] }
                }
            },
            'gou': {
                tones: {
                    1: { syllable: 'gōu', examples: ['勾 (gōu) - hook'] },
                    3: { syllable: 'gǒu', examples: ['狗 (gǒu) - dog'] },
                    4: { syllable: 'gòu', examples: ['够 (gòu) - enough'] }
                }
            },
            'gu': {
                tones: {
                    1: { syllable: 'gū', examples: ['孤 (gū) - lonely', '姑 (gū) - aunt'] },
                    2: { syllable: 'gú', examples: ['骨 (gú) - bone'] },
                    3: { syllable: 'gǔ', examples: ['古 (gǔ) - ancient', '鼓 (gǔ) - drum'] },
                    4: { syllable: 'gù', examples: ['故 (gù) - story', '顾 (gù) - look after'] }
                }
            },
            'gua': {
                tones: {
                    1: { syllable: 'guā', examples: ['瓜 (guā) - melon', '刮 (guā) - scrape'] },
                    3: { syllable: 'guǎ', examples: ['寡 (guǎ) - few'] },
                    4: { syllable: 'guà', examples: ['挂 (guà) - hang'] }
                }
            },
            'guai': {
                tones: {
                    1: { syllable: 'guāi', examples: ['乖 (guāi) - obedient'] },
                    3: { syllable: 'guǎi', examples: ['拐 (guǎi) - turn'] },
                    4: { syllable: 'guài', examples: ['怪 (guài) - strange'] }
                }
            },
            'guan': {
                tones: {
                    1: { syllable: 'guān', examples: ['关 (guān) - close', '观 (guān) - watch'] },
                    3: { syllable: 'guǎn', examples: ['管 (guǎn) - manage', '馆 (guǎn) - hall'] },
                    4: { syllable: 'guàn', examples: ['贯 (guàn) - pierce through'] }
                }
            },
            'guang': {
                tones: {
                    1: { syllable: 'guāng', examples: ['光 (guāng) - light'] },
                    2: { syllable: 'guáng', examples: ['广 (guǎng) - broad'] },
                    3: { syllable: 'guǎng', examples: ['广 (guǎng) - broad'] },
                    4: { syllable: 'guàng', examples: ['逛 (guàng) - stroll'] }
                }
            },
            'gui': {
                tones: {
                    1: { syllable: 'guī', examples: ['归 (guī) - return', '龟 (guī) - turtle'] },
                    3: { syllable: 'guǐ', examples: ['鬼 (guǐ) - ghost'] },
                    4: { syllable: 'guì', examples: ['贵 (guì) - expensive', '跪 (guì) - kneel'] }
                }
            },
            'gun': {
                tones: {
                    3: { syllable: 'gǔn', examples: ['滚 (gǔn) - roll'] },
                    4: { syllable: 'gùn', examples: ['棍 (gùn) - stick'] }
                }
            },
            'guo': {
                tones: {
                    1: { syllable: 'guō', examples: ['锅 (guō) - pot'] },
                    2: { syllable: 'guó', examples: ['国 (guó) - country'] },
                    3: { syllable: 'guǒ', examples: ['果 (guǒ) - fruit'] },
                    4: { syllable: 'guò', examples: ['过 (guò) - pass'] }
                }
            },
            'ha': {
                tones: {
                    1: { syllable: 'hā', examples: ['哈 (hā) - ha'] },
                    2: { syllable: 'há', examples: ['哈 (há) - what'] },
                    3: { syllable: 'hǎ', examples: ['哈 (hǎ) - breathe on'] },
                    4: { syllable: 'hà', examples: ['哈 (hà) - ha'] }
                }
            },
            'hai': {
                tones: {
                    2: { syllable: 'hái', examples: ['还 (hái) - still', '孩 (hái) - child'] },
                    3: { syllable: 'hǎi', examples: ['海 (hǎi) - sea'] },
                    4: { syllable: 'hài', examples: ['害 (hài) - harm'] }
                }
            },
            'han': {
                tones: {
                    1: { syllable: 'hān', examples: ['憨 (hān) - simple'] },
                    2: { syllable: 'hán', examples: ['含 (hán) - contain', '寒 (hán) - cold'] },
                    4: { syllable: 'hàn', examples: ['汉 (hàn) - Chinese', '汗 (hàn) - sweat'] }
                }
            },
            'hang': {
                tones: {
                    2: { syllable: 'háng', examples: ['行 (háng) - profession', '航 (háng) - navigate'] },
                    4: { syllable: 'hàng', examples: ['巷 (xiàng) - alley'] }
                }
            },
            'hao': {
                tones: {
                    1: { syllable: 'hāo', examples: ['豪 (háo) - heroic'] },
                    2: { syllable: 'háo', examples: ['好 (hǎo) - good', '毫 (háo) - hair'] },
                    3: { syllable: 'hǎo', examples: ['好 (hǎo) - good'] },
                    4: { syllable: 'hào', examples: ['号 (hào) - number'] }
                }
            },
            'he': {
                tones: {
                    1: { syllable: 'hē', examples: ['喝 (hē) - drink'] },
                    2: { syllable: 'hé', examples: ['和 (hé) - and', '河 (hé) - river', '何 (hé) - what'] },
                    4: { syllable: 'hè', examples: ['贺 (hè) - congratulate'] }
                }
            },
            'hei': {
                tones: {
                    1: { syllable: 'hēi', examples: ['黑 (hēi) - black'] }
                }
            },
            'hen': {
                tones: {
                    3: { syllable: 'hěn', examples: ['很 (hěn) - very'] },
                    4: { syllable: 'hèn', examples: ['恨 (hèn) - hate'] }
                }
            },
            'heng': {
                tones: {
                    1: { syllable: 'hēng', examples: ['哼 (hēng) - hum'] },
                    2: { syllable: 'héng', examples: ['横 (héng) - horizontal'] },
                    4: { syllable: 'hèng', examples: ['恒 (héng) - constant'] }
                }
            },
            'hong': {
                tones: {
                    1: { syllable: 'hōng', examples: ['烘 (hōng) - bake'] },
                    2: { syllable: 'hóng', examples: ['红 (hóng) - red', '洪 (hóng) - flood'] },
                    3: { syllable: 'hǒng', examples: ['哄 (hǒng) - coax'] },
                    4: { syllable: 'hòng', examples: ['哄 (hòng) - roar'] }
                }
            },
            'hou': {
                tones: {
                    2: { syllable: 'hóu', examples: ['猴 (hóu) - monkey'] },
                    3: { syllable: 'hǒu', examples: ['吼 (hǒu) - roar'] },
                    4: { syllable: 'hòu', examples: ['后 (hòu) - after', '厚 (hòu) - thick'] }
                }
            },
            'hu': {
                tones: {
                    1: { syllable: 'hū', examples: ['呼 (hū) - call'] },
                    2: { syllable: 'hú', examples: ['湖 (hú) - lake', '胡 (hú) - nonsense', '狐 (hú) - fox'] },
                    3: { syllable: 'hǔ', examples: ['虎 (hǔ) - tiger'] },
                    4: { syllable: 'hù', examples: ['户 (hù) - household', '护 (hù) - protect'] }
                }
            },
            'hua': {
                tones: {
                    1: { syllable: 'huā', examples: ['花 (huā) - flower'] },
                    2: { syllable: 'huá', examples: ['华 (huá) - splendid', '滑 (huá) - slippery'] },
                    4: { syllable: 'huà', examples: ['话 (huà) - speech', '画 (huà) - painting'] }
                }
            },
            'huai': {
                tones: {
                    2: { syllable: 'huái', examples: ['怀 (huái) - embrace', '淮 (huái) - river name'] },
                    4: { syllable: 'huài', examples: ['坏 (huài) - bad'] }
                }
            },
            'huan': {
                tones: {
                    1: { syllable: 'huān', examples: ['欢 (huān) - happy'] },
                    2: { syllable: 'huán', examples: ['还 (huán) - return', '环 (huán) - ring'] },
                    3: { syllable: 'huǎn', examples: ['缓 (huǎn) - slow'] },
                    4: { syllable: 'huàn', examples: ['换 (huàn) - change'] }
                }
            },
            'huang': {
                tones: {
                    1: { syllable: 'huāng', examples: ['荒 (huāng) - barren'] },
                    2: { syllable: 'huáng', examples: ['黄 (huáng) - yellow', '皇 (huáng) - emperor'] },
                    3: { syllable: 'huǎng', examples: ['恍 (huǎng) - suddenly'] },
                    4: { syllable: 'huàng', examples: ['晃 (huàng) - sway'] }
                }
            },
            'hui': {
                tones: {
                    1: { syllable: 'huī', examples: ['灰 (huī) - grey', '挥 (huī) - wave'] },
                    2: { syllable: 'huí', examples: ['回 (huí) - return'] },
                    3: { syllable: 'huǐ', examples: ['悔 (huǐ) - regret', '毁 (huǐ) - destroy'] },
                    4: { syllable: 'huì', examples: ['会 (huì) - can/meeting', '汇 (huì) - gather'] }
                }
            },
            'hun': {
                tones: {
                    1: { syllable: 'hūn', examples: ['昏 (hūn) - dark', '婚 (hūn) - marriage'] },
                    2: { syllable: 'hún', examples: ['魂 (hún) - soul'] },
                    4: { syllable: 'hùn', examples: ['混 (hùn) - mix'] }
                }
            },
            'huo': {
                tones: {
                    2: { syllable: 'huó', examples: ['活 (huó) - live'] },
                    3: { syllable: 'huǒ', examples: ['火 (huǒ) - fire'] },
                    4: { syllable: 'huò', examples: ['或 (huò) - or', '货 (huò) - goods'] }
                }
            }
        };

        // Load saved syllable data or initialize empty
        const savedSyllables = localStorage.getItem('pinyinSyllables');
        if (savedSyllables) {
            this.syllables = JSON.parse(savedSyllables);
        } else {
            // Initialize syllables without images
            this.syllables = {};
            Object.keys(syllableData).forEach(base => {
                Object.keys(syllableData[base].tones).forEach(tone => {
                    const toneData = syllableData[base].tones[tone];
                    const syllableKey = `${base}_${tone}`;
                    this.syllables[syllableKey] = {
                        base: base,
                        tone: parseInt(tone),
                        syllable: toneData.syllable,
                        examples: toneData.examples,
                        description: '',
                        imageUrl: null,
                        imagePrompt: ''
                    };
                });
            });
        }

        this.filteredSyllables = Object.keys(this.syllables);
    }

    async init() {
        await this.loadData();
        this.bindEvents();
        this.updateUI();
    }

    // Data Loading Methods
    async loadData() {
        try {
            // Load cards from API
            const cardsData = await apiClient.getCards();
            this.cards = cardsData.map(card => ({
                id: card.id,
                front: card.front,
                back: card.back,
                categoryId: card.category_id,
                frontImage: card.front_image,
                backImage: card.back_image,
                interval: card.interval,
                repetitions: card.repetitions,
                easeFactor: card.ease_factor,
                nextReview: new Date(card.next_review)
            }));

            // Load categories from API
            const categoriesData = await apiClient.getCategories();
            this.categories = categoriesData.map(cat => ({
                id: cat.id,
                name: cat.name,
                color: cat.color
            }));

            // Load syllables from API or initialize
            await this.loadSyllables();
            
        } catch (error) {
            console.error('Failed to load data from API:', error);
            // Fallback to localStorage if API fails
            this.loadDataFromLocalStorage();
        }
    }

    async loadSyllables() {
        try {
            const syllablesData = await apiClient.getSyllables();
            this.syllables = {};
            
            syllablesData.forEach(syllable => {
                const key = `${syllable.base}_${syllable.tone}`;
                this.syllables[key] = {
                    base: syllable.base,
                    tone: syllable.tone,
                    syllable: syllable.syllable,
                    examples: syllable.examples || [],
                    description: syllable.description || '',
                    imageUrl: syllable.image_url,
                    imagePrompt: syllable.image_prompt || ''
                };
            });

            this.filteredSyllables = Object.keys(this.syllables);
            
            // If no syllables found, initialize them
            if (syllablesData.length === 0) {
                await this.initializePinyinSyllablesInDB();
            }
        } catch (error) {
            console.error('Failed to load syllables from API:', error);
            // Initialize syllables locally
            this.initializePinyinSyllables();
        }
    }

    async saveCard(card) {
        try {
            const cardData = {
                id: card.id,
                front: card.front,
                back: card.back,
                categoryId: card.categoryId,
                frontImage: card.frontImage,
                backImage: card.backImage,
                interval: card.interval,
                repetitions: card.repetitions,
                easeFactor: card.easeFactor,
                nextReview: card.nextReview
            };

            if (this.editingCardId) {
                await apiClient.updateCard(card.id, cardData);
            } else {
                await apiClient.createCard(cardData);
            }
        } catch (error) {
            console.error('Failed to save card:', error);
            throw error;
        }
    }

    async saveCategories() {
        // Categories are saved individually through the API
    }

    // Fallback method for localStorage
    loadDataFromLocalStorage() {
        const savedCards = localStorage.getItem('flashcards');
        if (savedCards) {
            this.cards = JSON.parse(savedCards);
        }
        
        const savedCategories = localStorage.getItem('categories');
        if (savedCategories) {
            this.categories = JSON.parse(savedCategories);
        } else {
            this.categories = [{ id: 'general', name: 'General', color: '#4CAF50' }];
        }
        
        this.initializePinyinSyllables();
    }

    // Event Binding
    bindEvents() {
        // Tab switching
        document.getElementById('manage-tab').addEventListener('click', () => this.switchTab('manage'));
        document.getElementById('review-tab').addEventListener('click', () => this.switchTab('review'));
        document.getElementById('dictionary-tab').addEventListener('click', () => this.switchTab('dictionary'));

        // Card management
        document.getElementById('add-card-btn').addEventListener('click', () => this.openCardModal());
        document.getElementById('close-modal').addEventListener('click', () => this.closeCardModal());
        document.getElementById('cancel-btn').addEventListener('click', () => this.closeCardModal());
        document.getElementById('save-card-btn').addEventListener('click', () => this.saveCard());

        // Review interface
        document.getElementById('flip-btn').addEventListener('click', () => this.flipCard());
        document.getElementById('hard-btn').addEventListener('click', () => this.rateCard(0));
        document.getElementById('good-btn').addEventListener('click', () => this.rateCard(1));
        document.getElementById('easy-btn').addEventListener('click', () => this.rateCard(2));

        // AI Image generation
        document.getElementById('add-image-btn').addEventListener('click', () => this.openImageModal());
        document.getElementById('close-image-modal').addEventListener('click', () => this.closeImageModal());
        document.getElementById('cancel-image-btn').addEventListener('click', () => this.closeImageModal());
        document.getElementById('generate-image-btn').addEventListener('click', () => this.generateImage());
        document.getElementById('save-image-btn').addEventListener('click', () => this.saveGeneratedImage());

        // Category management
        document.getElementById('manage-categories-btn').addEventListener('click', () => this.openCategoryModal());
        document.getElementById('close-category-modal').addEventListener('click', () => this.closeCategoryModal());
        document.getElementById('close-category-modal-btn').addEventListener('click', () => this.closeCategoryModal());
        document.getElementById('save-category-btn').addEventListener('click', () => this.saveCategory());
        document.getElementById('category-filter').addEventListener('change', (e) => this.filterByCategory(e.target.value));
        document.getElementById('review-category-filter').addEventListener('change', (e) => this.filterReviewByCategory(e.target.value));

        // Modal close on backdrop click
        document.getElementById('card-modal').addEventListener('click', (e) => {
            if (e.target.id === 'card-modal') this.closeCardModal();
        });
        document.getElementById('image-modal').addEventListener('click', (e) => {
            if (e.target.id === 'image-modal') this.closeImageModal();
        });
        document.getElementById('category-modal').addEventListener('click', (e) => {
            if (e.target.id === 'category-modal') this.closeCategoryModal();
        });

        // Dictionary events
        document.getElementById('syllable-search').addEventListener('input', (e) => this.filterSyllables());
        document.getElementById('tone-filter').addEventListener('change', (e) => this.filterSyllables());
        document.getElementById('completion-filter').addEventListener('change', (e) => this.filterSyllables());
        document.getElementById('close-syllable-modal').addEventListener('click', () => this.closeSyllableModal());
        document.getElementById('close-syllable-modal-btn').addEventListener('click', () => this.closeSyllableModal());
        document.getElementById('generate-syllable-image-btn').addEventListener('click', () => this.generateSyllableImage());
        document.getElementById('save-syllable-btn').addEventListener('click', () => this.saveSyllableMnemonic());
        document.getElementById('remove-syllable-image-btn').addEventListener('click', () => this.removeSyllableImage());
        document.getElementById('syllable-modal').addEventListener('click', (e) => {
            if (e.target.id === 'syllable-modal') this.closeSyllableModal();
        });

        // Card image generation events
        document.getElementById('add-front-image-btn').addEventListener('click', () => this.openCardImageGeneration('front'));
        document.getElementById('add-back-image-btn').addEventListener('click', () => this.openCardImageGeneration('back'));
        document.getElementById('remove-front-image-btn').addEventListener('click', () => this.removeCardImage('front'));
        document.getElementById('remove-back-image-btn').addEventListener('click', () => this.removeCardImage('back'));
        document.getElementById('generate-card-image-btn').addEventListener('click', () => this.generateCardImage());
        document.getElementById('save-card-image-btn').addEventListener('click', () => this.saveCardImage());
        document.getElementById('cancel-card-image-btn').addEventListener('click', () => this.cancelCardImageGeneration());
    }

    // Tab Management
    switchTab(tab) {
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.section').forEach(section => section.classList.remove('active'));

        if (tab === 'manage') {
            document.getElementById('manage-tab').classList.add('active');
            document.getElementById('manage-section').classList.add('active');
            this.renderCardList();
        } else if (tab === 'review') {
            document.getElementById('review-tab').classList.add('active');
            document.getElementById('review-section').classList.add('active');
            this.startReview();
        } else if (tab === 'dictionary') {
            document.getElementById('dictionary-tab').classList.add('active');
            document.getElementById('dictionary-section').classList.add('active');
            this.renderDictionary();
        }
    }

    // Card Management
    openCardModal(cardId = null) {
        this.editingCardId = cardId;
        const modal = document.getElementById('card-modal');
        const title = document.getElementById('modal-title');
        const frontText = document.getElementById('front-text');
        const backText = document.getElementById('back-text');
        const categorySelect = document.getElementById('card-category');

        this.populateCategorySelect(categorySelect);

        if (cardId) {
            const card = this.cards.find(c => c.id === cardId);
            title.textContent = 'Edit Card';
            frontText.value = card.front;
            backText.value = card.back;
            categorySelect.value = card.categoryId || 'general';
            
            // Set temporary images for editing
            this.tempCardImages.front = card.frontImage;
            this.tempCardImages.back = card.backImage;
        } else {
            title.textContent = 'Add New Card';
            frontText.value = '';
            backText.value = '';
            categorySelect.value = this.selectedCategory === 'all' ? 'general' : this.selectedCategory;
            
            // Clear temporary images
            this.tempCardImages.front = null;
            this.tempCardImages.back = null;
        }

        // Update image previews
        this.updateCardImagePreviews();
        
        // Hide image generation section
        document.getElementById('card-image-generation').classList.add('hidden');

        modal.classList.add('active');
        frontText.focus();
    }

    closeCardModal() {
        document.getElementById('card-modal').classList.remove('active');
        this.editingCardId = null;
    }

    async saveCard() {
        const front = document.getElementById('front-text').value.trim();
        const back = document.getElementById('back-text').value.trim();

        if (!front || !back) {
            alert('Please fill in both front and back of the card.');
            return;
        }

        try {
            let cardData;
            
            if (this.editingCardId) {
                // Edit existing card
                const cardIndex = this.cards.findIndex(c => c.id === this.editingCardId);
                cardData = { 
                    ...this.cards[cardIndex], 
                    front, 
                    back,
                    categoryId: document.getElementById('card-category').value || 'general',
                    frontImage: this.tempCardImages.front,
                    backImage: this.tempCardImages.back
                };
                this.cards[cardIndex] = cardData;
                
                await apiClient.updateCard(cardData.id, {
                    front: cardData.front,
                    back: cardData.back,
                    categoryId: cardData.categoryId,
                    frontImage: cardData.frontImage,
                    backImage: cardData.backImage,
                    interval: cardData.interval,
                    repetitions: cardData.repetitions,
                    easeFactor: cardData.easeFactor,
                    nextReview: cardData.nextReview
                });
            } else {
                // Add new card
                const now = new Date();
                now.setSeconds(now.getSeconds() - 1); // Ensure it's immediately available
                cardData = {
                    id: Date.now().toString(),
                    front,
                    back,
                    categoryId: document.getElementById('card-category').value || 'general',
                    frontImage: this.tempCardImages.front,
                    backImage: this.tempCardImages.back,
                    interval: 1,
                    repetitions: 0,
                    easeFactor: 2.5,
                    nextReview: now
                };
                this.cards.push(cardData);
                
                await apiClient.createCard(cardData);
            }

            this.closeCardModal();
            this.updateUI();
        } catch (error) {
            console.error('Failed to save card:', error);
            alert('Failed to save card. Please try again.');
        }
    }

    async deleteCard(cardId) {
        if (confirm('Are you sure you want to delete this card?')) {
            try {
                await apiClient.deleteCard(cardId);
                this.cards = this.cards.filter(c => c.id !== cardId);
                this.updateUI();
            } catch (error) {
                console.error('Failed to delete card:', error);
                alert('Failed to delete card. Please try again.');
            }
        }
    }

    renderCardList() {
        const cardList = document.getElementById('card-list');
        const cardCount = document.getElementById('card-count');
        
        // Filter cards based on selected category
        const filteredCards = this.selectedCategory === 'all' 
            ? this.cards 
            : this.cards.filter(card => (card.categoryId || 'general') === this.selectedCategory);
        
        cardCount.textContent = `${filteredCards.length} card${filteredCards.length !== 1 ? 's' : ''}`;

        if (filteredCards.length === 0) {
            const message = this.selectedCategory === 'all' 
                ? 'No cards yet. Click "Add Card" to get started!'
                : `No cards in this category yet.`;
            cardList.innerHTML = `<div class="message">${message}</div>`;
            return;
        }

        cardList.innerHTML = filteredCards.map(card => {
            const category = this.categories.find(cat => cat.id === (card.categoryId || 'general'));
            const categoryName = category ? category.name : 'General';
            const categoryColor = category ? category.color : '#4CAF50';
            
            return `
                <div class="card-item">
                    <div class="card-item-header">
                        <div>
                            <div class="card-category-badge" style="background-color: ${categoryColor}">${categoryName}</div>
                            <div class="card-front"><strong>Front:</strong> ${this.escapeHtml(card.front)}</div>
                            <div class="card-back"><strong>Back:</strong> ${this.escapeHtml(card.back)}</div>
                        </div>
                        <div class="card-item-actions">
                            <button class="btn secondary" onclick="app.openCardModal('${card.id}')">Edit</button>
                            <button class="btn secondary" onclick="app.deleteCard('${card.id}')">Delete</button>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }

    // Spaced Repetition Algorithm (SM-2)
    calculateNextReview(card, quality) {
        let { interval, repetitions, easeFactor } = card;

        if (quality >= 3) {
            if (repetitions === 0) {
                interval = 1;
            } else if (repetitions === 1) {
                interval = 6;
            } else {
                interval = Math.round(interval * easeFactor);
            }
            repetitions++;
        } else {
            repetitions = 0;
            interval = 1;
        }

        easeFactor = easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
        if (easeFactor < 1.3) easeFactor = 1.3;

        const nextReview = new Date();
        nextReview.setDate(nextReview.getDate() + interval);

        return { interval, repetitions, easeFactor, nextReview };
    }

    // Review System
    startReview() {
        this.currentReviewCards = this.getCardsForReview();
        this.currentCardIndex = 0;
        this.isShowingBack = false;

        const noCardsMessage = document.getElementById('no-cards-message');
        const cardReview = document.getElementById('card-review');

        if (this.currentReviewCards.length === 0) {
            noCardsMessage.classList.remove('hidden');
            cardReview.classList.add('hidden');
        } else {
            noCardsMessage.classList.add('hidden');
            cardReview.classList.remove('hidden');
            this.showCurrentCard();
        }
    }

    getCardsForReview() {
        const now = new Date();
        let cards = this.cards.filter(card => new Date(card.nextReview) <= now);
        
        // Filter by selected category if not "all"
        if (this.selectedCategory !== 'all') {
            cards = cards.filter(card => (card.categoryId || 'general') === this.selectedCategory);
        }
        
        return cards;
    }

    showCurrentCard() {
        if (this.currentCardIndex >= this.currentReviewCards.length) {
            this.completeReview();
            return;
        }

        const card = this.currentReviewCards[this.currentCardIndex];
        this.currentReviewCard = card;
        
        document.getElementById('progress-text').textContent = 
            `Card ${this.currentCardIndex + 1} of ${this.currentReviewCards.length}`;
        
        this.displayCardSide('front');
        
        document.getElementById('flip-btn').textContent = 'Show Answer';
        document.getElementById('flip-btn').classList.remove('hidden');
        document.getElementById('review-actions').classList.add('hidden');
        
        this.isShowingBack = false;
    }

    displayCardSide(side) {
        const card = this.currentReviewCard;
        const cardText = document.getElementById('card-text');
        const cardImage = document.getElementById('card-image');
        
        if (side === 'front') {
            cardText.textContent = card.front;
            if (card.frontImage) {
                cardImage.innerHTML = `<img src="${card.frontImage}" alt="Front image">`;
                cardImage.classList.remove('hidden');
            } else {
                cardImage.classList.add('hidden');
            }
        } else {
            cardText.textContent = card.back;
            if (card.backImage) {
                cardImage.innerHTML = `<img src="${card.backImage}" alt="Back image">`;
                cardImage.classList.remove('hidden');
            } else {
                cardImage.classList.add('hidden');
            }
        }
    }

    flipCard() {
        if (!this.isShowingBack) {
            this.displayCardSide('back');
            document.getElementById('flip-btn').classList.add('hidden');
            document.getElementById('review-actions').classList.remove('hidden');
            this.isShowingBack = true;
        }
    }

    rateCard(quality) {
        const card = this.currentReviewCard;
        const qualityMap = { 0: 3, 1: 4, 2: 5 }; // Hard, Good, Easy -> SM-2 quality
        
        const updates = this.calculateNextReview(card, qualityMap[quality]);
        Object.assign(card, updates);

        // Update card in main array
        const cardIndex = this.cards.findIndex(c => c.id === card.id);
        this.cards[cardIndex] = card;

        this.saveCards();
        this.currentCardIndex++;
        this.showCurrentCard();
    }

    completeReview() {
        document.getElementById('card-review').innerHTML = `
            <div class="message">
                <h2>🎉 Review Complete!</h2>
                <p>Great job! You've reviewed all your cards for now.</p>
                <button class="btn primary" onclick="app.switchTab('manage')">Manage Cards</button>
            </div>
        `;
    }

    // AI Image Generation
    openImageModal() {
        if (!this.currentReviewCard) return;
        
        document.getElementById('image-modal').classList.add('active');
        document.getElementById('image-prompt').value = '';
        document.getElementById('gemini-api-key').value = this.geminiApiKey;
        document.getElementById('image-preview').classList.add('hidden');
        document.getElementById('generate-image-btn').classList.remove('hidden');
        document.getElementById('save-image-btn').classList.add('hidden');
    }

    closeImageModal() {
        document.getElementById('image-modal').classList.remove('active');
    }

    async generateImage() {
        const prompt = document.getElementById('image-prompt').value.trim();
        const apiKey = document.getElementById('gemini-api-key').value.trim();
        
        if (!prompt) {
            alert('Please enter a description for the image.');
            return;
        }
        
        if (!apiKey) {
            alert('Please enter your Google Gemini API key.');
            return;
        }

        // Save API key for future use
        this.geminiApiKey = apiKey;
        localStorage.setItem('geminiApiKey', apiKey);

        const generateBtn = document.getElementById('generate-image-btn');
        const preview = document.getElementById('image-preview');
        
        generateBtn.textContent = 'Generating with Gemini...';
        generateBtn.disabled = true;

        try {
            const imageUrl = await this.generateImageWithGemini(prompt, apiKey);
            
            preview.innerHTML = `<img src="${imageUrl}" alt="Generated image">`;
            preview.classList.remove('hidden');
            
            generateBtn.classList.add('hidden');
            document.getElementById('save-image-btn').classList.remove('hidden');
            
        } catch (error) {
            alert(`Failed to generate image: ${error.message}`);
            console.error('Image generation error:', error);
        } finally {
            generateBtn.textContent = 'Generate Image';
            generateBtn.disabled = false;
        }
    }

    async generateImageWithGemini(prompt, apiKey) {
        const requestBody = {
            contents: [{
                parts: [{
                    text: `Generate an image: ${prompt}. Make it colorful, clear, and suitable for educational flash cards.`
                }]
            }],
            generationConfig: {
                temperature: 0.7,
                candidateCount: 1
            }
        };

        try {
            const response = await fetch(
                'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image-preview:generateContent',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-goog-api-key': apiKey
                    },
                    body: JSON.stringify(requestBody)
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error?.message || `HTTP ${response.status}`);
            }

            const data = await response.json();
            console.log('Gemini API Response:', data); // Debug log
            
            // Extract the image data from the response
            const candidate = data.candidates?.[0];
            const parts = candidate?.content?.parts || [];
            
            // Find the part with image data
            let imagePart = null;
            for (const part of parts) {
                if (part.inline_data?.data || part.inlineData?.data) {
                    imagePart = part;
                    break;
                }
            }
            
            if (imagePart) {
                // Handle both possible field names
                const imageData = imagePart.inline_data || imagePart.inlineData;
                const mimeType = imageData.mime_type || imageData.mimeType || 'image/png';
                const base64Data = imageData.data;
                
                if (!base64Data) {
                    throw new Error('No base64 image data found in response');
                }
                
                // Return data URL
                const dataUrl = `data:${mimeType};base64,${base64Data}`;
                
                return dataUrl;
            } else {
                throw new Error(`No image data found in API response. Response structure: ${JSON.stringify(data, null, 2)}`);
            }
        } catch (error) {
            throw new Error(`API request failed: ${error.message}`);
        }
    }

    saveGeneratedImage() {
        const img = document.querySelector('#image-preview img');
        if (!img) return;

        const side = document.querySelector('input[name="image-side"]:checked').value;
        const imageUrl = img.src;

        if (side === 'front') {
            this.currentReviewCard.frontImage = imageUrl;
        } else {
            this.currentReviewCard.backImage = imageUrl;
        }

        // Update main cards array
        const cardIndex = this.cards.findIndex(c => c.id === this.currentReviewCard.id);
        this.cards[cardIndex] = this.currentReviewCard;

        this.saveCards();
        this.displayCardSide(this.isShowingBack ? 'back' : 'front');
        this.closeImageModal();
    }

    // Category Management
    openCategoryModal() {
        document.getElementById('category-modal').classList.add('active');
        document.getElementById('category-name').value = '';
        document.getElementById('category-color').value = '#4CAF50';
        this.renderExistingCategories();
    }

    closeCategoryModal() {
        document.getElementById('category-modal').classList.remove('active');
        this.editingCategoryId = null;
    }

    saveCategory() {
        const name = document.getElementById('category-name').value.trim();
        const color = document.getElementById('category-color').value;

        if (!name) {
            alert('Please enter a category name.');
            return;
        }

        if (this.categories.some(cat => cat.name.toLowerCase() === name.toLowerCase() && cat.id !== this.editingCategoryId)) {
            alert('A category with this name already exists.');
            return;
        }

        if (this.editingCategoryId) {
            // Edit existing category
            const categoryIndex = this.categories.findIndex(c => c.id === this.editingCategoryId);
            this.categories[categoryIndex] = { ...this.categories[categoryIndex], name, color };
        } else {
            // Add new category
            const newCategory = {
                id: Date.now().toString(),
                name,
                color
            };
            this.categories.push(newCategory);
        }

        this.saveCategories();
        this.renderExistingCategories();
        this.populateAllCategorySelects();
        document.getElementById('category-name').value = '';
        this.editingCategoryId = null;
    }

    deleteCategory(categoryId) {
        if (categoryId === 'general') {
            alert('Cannot delete the General category.');
            return;
        }

        const cardsInCategory = this.cards.filter(card => card.categoryId === categoryId).length;
        if (cardsInCategory > 0) {
            if (!confirm(`This category contains ${cardsInCategory} cards. Deleting it will move those cards to the General category. Continue?`)) {
                return;
            }
            // Move cards to General category
            this.cards.forEach(card => {
                if (card.categoryId === categoryId) {
                    card.categoryId = 'general';
                }
            });
            this.saveCards();
        }

        this.categories = this.categories.filter(c => c.id !== categoryId);
        this.saveCategories();
        this.renderExistingCategories();
        this.populateAllCategorySelects();
        this.updateUI();
    }

    renderExistingCategories() {
        const container = document.getElementById('existing-categories');
        container.innerHTML = this.categories.map(category => `
            <div class="existing-category-item">
                <div class="category-info">
                    <div class="category-color-dot" style="background-color: ${category.color}"></div>
                    <span>${this.escapeHtml(category.name)}</span>
                </div>
                <div class="category-actions">
                    <button class="btn secondary small" onclick="app.editCategory('${category.id}')">Edit</button>
                    ${category.id !== 'general' ? `<button class="btn secondary small" onclick="app.deleteCategory('${category.id}')">Delete</button>` : ''}
                </div>
            </div>
        `).join('');
    }

    editCategory(categoryId) {
        const category = this.categories.find(c => c.id === categoryId);
        if (category) {
            this.editingCategoryId = categoryId;
            document.getElementById('category-name').value = category.name;
            document.getElementById('category-color').value = category.color;
            document.getElementById('save-category-btn').textContent = 'Update Category';
        }
    }

    populateCategorySelect(selectElement) {
        selectElement.innerHTML = this.categories.map(category => 
            `<option value="${category.id}">${this.escapeHtml(category.name)}</option>`
        ).join('');
    }

    populateAllCategorySelects() {
        // Populate card category select
        this.populateCategorySelect(document.getElementById('card-category'));
        
        // Populate filter selects
        const categoryFilter = document.getElementById('category-filter');
        const reviewCategoryFilter = document.getElementById('review-category-filter');
        
        const categoryOptions = this.categories.map(category => 
            `<option value="${category.id}">${this.escapeHtml(category.name)}</option>`
        ).join('');
        
        categoryFilter.innerHTML = '<option value="all">All Categories</option>' + categoryOptions;
        reviewCategoryFilter.innerHTML = '<option value="all">Review All Categories</option>' + categoryOptions;
        
        // Maintain current selection
        categoryFilter.value = this.selectedCategory;
        reviewCategoryFilter.value = this.selectedCategory;
    }

    filterByCategory(categoryId) {
        this.selectedCategory = categoryId;
        this.renderCardList();
    }

    filterReviewByCategory(categoryId) {
        this.selectedCategory = categoryId;
        document.getElementById('category-filter').value = categoryId;
        this.startReview();
    }

    // Dictionary System
    renderDictionary() {
        this.filterSyllables();
        this.updateSyllableStats();
    }

    filterSyllables() {
        const searchTerm = document.getElementById('syllable-search').value.toLowerCase();
        const toneFilter = document.getElementById('tone-filter').value;
        const completionFilter = document.getElementById('completion-filter').value;

        this.filteredSyllables = Object.keys(this.syllables).filter(key => {
            const syllable = this.syllables[key];
            
            // Search filter
            if (searchTerm && !syllable.syllable.toLowerCase().includes(searchTerm) && 
                !syllable.base.toLowerCase().includes(searchTerm)) {
                return false;
            }
            
            // Tone filter
            if (toneFilter !== 'all' && syllable.tone.toString() !== toneFilter) {
                return false;
            }
            
            // Completion filter
            if (completionFilter === 'complete' && !syllable.imageUrl) {
                return false;
            }
            if (completionFilter === 'incomplete' && syllable.imageUrl) {
                return false;
            }
            
            return true;
        });

        this.renderSyllableGrid();
        this.updateSyllableStats();
    }

    renderSyllableGrid() {
        const grid = document.getElementById('syllable-grid');
        
        if (this.filteredSyllables.length === 0) {
            grid.innerHTML = '<div class="message">No syllables match your filters.</div>';
            return;
        }

        grid.innerHTML = this.filteredSyllables.map(key => {
            const syllable = this.syllables[key];
            const hasImage = syllable.imageUrl ? 'has-image' : 'no-image';
            const toneClass = `tone-${syllable.tone}`;
            
            return `
                <div class="syllable-card ${hasImage} ${toneClass}" onclick="app.openSyllableModal('${key}')">
                    <div class="syllable-display">
                        <div class="syllable-text">${syllable.syllable}</div>
                        <div class="syllable-tone">Tone ${syllable.tone}</div>
                    </div>
                    ${syllable.imageUrl ? 
                        `<div class="syllable-image"><img src="${syllable.imageUrl}" alt="${syllable.syllable}"></div>` :
                        '<div class="syllable-placeholder">No image</div>'
                    }
                    ${syllable.description ? 
                        `<div class="syllable-description">${this.escapeHtml(syllable.description)}</div>` :
                        ''
                    }
                </div>
            `;
        }).join('');
    }

    updateSyllableStats() {
        const total = Object.keys(this.syllables).length;
        const completed = Object.values(this.syllables).filter(s => s.imageUrl).length;
        document.getElementById('syllable-stats').textContent = `${completed} / ${total} syllables complete`;
    }

    openSyllableModal(syllableKey) {
        this.currentSyllable = syllableKey;
        const syllable = this.syllables[syllableKey];
        
        document.getElementById('syllable-modal-title').textContent = `Create Mnemonic for: ${syllable.syllable}`;
        document.getElementById('current-syllable').textContent = syllable.syllable;
        document.getElementById('current-tone').textContent = `Tone ${syllable.tone}`;
        
        // Show examples
        const exampleWords = document.querySelector('#syllable-examples .example-words');
        exampleWords.innerHTML = syllable.examples.map(example => 
            `<div class="example-word">${example}</div>`
        ).join('');
        
        // Populate form
        document.getElementById('mnemonic-description').value = syllable.description || '';
        document.getElementById('syllable-image-prompt').value = syllable.imagePrompt || '';
        document.getElementById('syllable-gemini-api-key').value = this.geminiApiKey;
        
        // Show current image or placeholder
        const currentImage = document.getElementById('current-syllable-image');
        if (syllable.imageUrl) {
            currentImage.innerHTML = `<img src="${syllable.imageUrl}" alt="${syllable.syllable}">`;
            document.getElementById('remove-syllable-image-btn').classList.remove('hidden');
        } else {
            currentImage.innerHTML = '<div class="no-image-placeholder">No mnemonic image yet</div>';
            document.getElementById('remove-syllable-image-btn').classList.add('hidden');
        }
        
        // Reset modal state
        document.getElementById('generate-syllable-image-btn').classList.remove('hidden');
        document.getElementById('save-syllable-btn').classList.add('hidden');
        document.getElementById('syllable-image-preview').classList.add('hidden');
        
        document.getElementById('syllable-modal').classList.add('active');
    }

    closeSyllableModal() {
        document.getElementById('syllable-modal').classList.remove('active');
        this.currentSyllable = null;
    }

    async generateSyllableImage() {
        const prompt = document.getElementById('syllable-image-prompt').value.trim();
        const apiKey = document.getElementById('syllable-gemini-api-key').value.trim();
        
        if (!prompt) {
            alert('Please enter a description for the mnemonic image.');
            return;
        }
        
        if (!apiKey) {
            alert('Please enter your Google Gemini API key.');
            return;
        }

        // Save API key for future use
        this.geminiApiKey = apiKey;
        localStorage.setItem('geminiApiKey', apiKey);

        const generateBtn = document.getElementById('generate-syllable-image-btn');
        const preview = document.getElementById('syllable-image-preview');
        
        generateBtn.textContent = 'Generating mnemonic image...';
        generateBtn.disabled = true;

        try {
            const syllable = this.syllables[this.currentSyllable];
            const enhancedPrompt = `Create a memorable mnemonic image for the Chinese Pinyin syllable "${syllable.syllable}" (tone ${syllable.tone}). ${prompt}. Make it vivid, clear, and easy to remember for language learning.`;
            
            const imageUrl = await this.generateImageWithGemini(enhancedPrompt, apiKey);
            
            preview.innerHTML = `<img src="${imageUrl}" alt="Generated mnemonic for ${syllable.syllable}">`;
            preview.classList.remove('hidden');
            
            generateBtn.classList.add('hidden');
            document.getElementById('save-syllable-btn').classList.remove('hidden');
            
        } catch (error) {
            alert(`Failed to generate image: ${error.message}`);
            console.error('Syllable image generation error:', error);
        } finally {
            generateBtn.textContent = 'Generate Mnemonic Image';
            generateBtn.disabled = false;
        }
    }

    saveSyllableMnemonic() {
        const img = document.querySelector('#syllable-image-preview img');
        const description = document.getElementById('mnemonic-description').value.trim();
        const imagePrompt = document.getElementById('syllable-image-prompt').value.trim();
        
        if (!img) return;

        // Update syllable data
        this.syllables[this.currentSyllable] = {
            ...this.syllables[this.currentSyllable],
            description: description,
            imagePrompt: imagePrompt,
            imageUrl: img.src
        };

        this.saveSyllables();
        
        // Update current image display
        document.getElementById('current-syllable-image').innerHTML = `<img src="${img.src}" alt="${this.syllables[this.currentSyllable].syllable}">`;
        document.getElementById('remove-syllable-image-btn').classList.remove('hidden');
        
        // Reset form
        document.getElementById('generate-syllable-image-btn').classList.remove('hidden');
        document.getElementById('save-syllable-btn').classList.add('hidden');
        document.getElementById('syllable-image-preview').classList.add('hidden');
        
        this.renderSyllableGrid();
        this.updateSyllableStats();
    }

    removeSyllableImage() {
        if (!confirm('Are you sure you want to remove this mnemonic image?')) {
            return;
        }

        this.syllables[this.currentSyllable] = {
            ...this.syllables[this.currentSyllable],
            imageUrl: null
        };

        this.saveSyllables();
        
        // Update displays
        document.getElementById('current-syllable-image').innerHTML = '<div class="no-image-placeholder">No mnemonic image yet</div>';
        document.getElementById('remove-syllable-image-btn').classList.add('hidden');
        
        this.renderSyllableGrid();
        this.updateSyllableStats();
    }

    saveSyllables() {
        localStorage.setItem('pinyinSyllables', JSON.stringify(this.syllables));
    }

    // Card Image Generation
    updateCardImagePreviews() {
        // Update front image preview
        const frontPreview = document.getElementById('card-front-image-preview');
        const removeFrontBtn = document.getElementById('remove-front-image-btn');
        
        if (this.tempCardImages.front) {
            frontPreview.innerHTML = `<img src="${this.tempCardImages.front}" alt="Front image">`;
            removeFrontBtn.classList.remove('hidden');
        } else {
            frontPreview.innerHTML = '<div class="no-image-placeholder">No image</div>';
            removeFrontBtn.classList.add('hidden');
        }
        
        // Update back image preview
        const backPreview = document.getElementById('card-back-image-preview');
        const removeBackBtn = document.getElementById('remove-back-image-btn');
        
        if (this.tempCardImages.back) {
            backPreview.innerHTML = `<img src="${this.tempCardImages.back}" alt="Back image">`;
            removeBackBtn.classList.remove('hidden');
        } else {
            backPreview.innerHTML = '<div class="no-image-placeholder">No image</div>';
            removeBackBtn.classList.add('hidden');
        }
    }

    openCardImageGeneration(side) {
        this.currentImageSide = side;
        
        // Show generation section
        const generationSection = document.getElementById('card-image-generation');
        generationSection.classList.remove('hidden');
        
        // Update title
        document.getElementById('generating-for-side').textContent = `Generating image for: ${side === 'front' ? 'Front' : 'Back'}`;
        
        // Clear previous values
        document.getElementById('card-image-prompt').value = '';
        document.getElementById('card-gemini-api-key').value = this.geminiApiKey;
        
        // Reset buttons
        document.getElementById('generate-card-image-btn').classList.remove('hidden');
        document.getElementById('save-card-image-btn').classList.add('hidden');
        document.getElementById('card-image-generation-preview').classList.add('hidden');
        
        // Scroll to generation section
        generationSection.scrollIntoView({ behavior: 'smooth' });
    }

    cancelCardImageGeneration() {
        document.getElementById('card-image-generation').classList.add('hidden');
        this.currentImageSide = null;
    }

    async generateCardImage() {
        const prompt = document.getElementById('card-image-prompt').value.trim();
        const apiKey = document.getElementById('card-gemini-api-key').value.trim();
        
        if (!prompt) {
            alert('Please enter a description for the image.');
            return;
        }
        
        if (!apiKey) {
            alert('Please enter your Google Gemini API key.');
            return;
        }

        // Save API key for future use
        this.geminiApiKey = apiKey;
        localStorage.setItem('geminiApiKey', apiKey);

        const generateBtn = document.getElementById('generate-card-image-btn');
        const preview = document.getElementById('card-image-generation-preview');
        
        generateBtn.textContent = 'Generating with Gemini...';
        generateBtn.disabled = true;

        try {
            const enhancedPrompt = `Create an educational flash card image. ${prompt}. Make it clear, colorful, and suitable for learning.`;
            const imageUrl = await this.generateImageWithGemini(enhancedPrompt, apiKey);
            
            preview.innerHTML = `<img src="${imageUrl}" alt="Generated card image">`;
            preview.classList.remove('hidden');
            
            generateBtn.classList.add('hidden');
            document.getElementById('save-card-image-btn').classList.remove('hidden');
            
        } catch (error) {
            alert(`Failed to generate image: ${error.message}`);
            console.error('Card image generation error:', error);
        } finally {
            generateBtn.textContent = 'Generate Image';
            generateBtn.disabled = false;
        }
    }

    saveCardImage() {
        const img = document.querySelector('#card-image-generation-preview img');
        if (!img) return;

        // Save to temporary card images
        this.tempCardImages[this.currentImageSide] = img.src;
        
        // Update preview
        this.updateCardImagePreviews();
        
        // Hide generation section
        this.cancelCardImageGeneration();
    }

    removeCardImage(side) {
        if (!confirm(`Are you sure you want to remove the ${side} image?`)) {
            return;
        }
        
        this.tempCardImages[side] = null;
        this.updateCardImagePreviews();
    }

    // Utility Methods
    updateUI() {
        this.populateAllCategorySelects();
        this.renderCardList();
        if (document.getElementById('review-section').classList.contains('active')) {
            this.startReview();
        }
        if (document.getElementById('dictionary-section').classList.contains('active')) {
            this.renderDictionary();
        }
    }

    escapeHtml(text) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, m => map[m]);
    }
}

// Initialize the app
const app = new SpacedRepetitionApp();
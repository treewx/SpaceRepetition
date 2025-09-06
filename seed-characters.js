// Seed script to populate character mnemonics database
const characters = [
    {
        id: 'char_wo',
        character: '我',
        pinyin: 'wǒ',
        meaning: 'I, me',
        imagePrompt: 'A person pointing to themselves with confidence',
        mnemonicStory: 'The character 我 looks like a person with a weapon (戈) defending themselves - representing "I" or "me".',
        examples: ['我是中国人 - I am Chinese', '我爱你 - I love you'],
        frequencyRank: 1
    },
    {
        id: 'char_ni',
        character: '你',
        pinyin: 'nǐ',
        meaning: 'you',
        imagePrompt: 'A person reaching out to point at someone else',
        mnemonicStory: 'The character 你 has the person radical (亻) plus 尔, representing "you" - the person you are talking to.',
        examples: ['你好 - hello', '你是谁 - who are you'],
        frequencyRank: 2
    },
    {
        id: 'char_ta',
        character: '他',
        pinyin: 'tā',
        meaning: 'he, him',
        imagePrompt: 'A male figure standing in the distance',
        mnemonicStory: 'The character 他 has the person radical (亻) plus 也 (also), meaning "he" - another person (male).',
        examples: ['他是老师 - he is a teacher', '他很高 - he is tall'],
        frequencyRank: 3
    },
    {
        id: 'char_de',
        character: '的',
        pinyin: 'de',
        meaning: 'possessive particle',
        imagePrompt: 'Arrows showing ownership or connection between objects',
        mnemonicStory: 'The character 的 is like a target (白 + 勺) - it targets or points to what belongs to whom.',
        examples: ['我的书 - my book', '他的朋友 - his friend'],
        frequencyRank: 4
    },
    {
        id: 'char_shi',
        character: '是',
        pinyin: 'shì',
        meaning: 'to be, am, is, are',
        imagePrompt: 'An equals sign connecting two things',
        mnemonicStory: 'The character 是 combines 日 (sun) and 正 (correct) - the sun makes things correct and clear, like "is".',
        examples: ['我是学生 - I am a student', '这是书 - this is a book'],
        frequencyRank: 5
    },
    {
        id: 'char_zai',
        character: '在',
        pinyin: 'zài',
        meaning: 'at, in, on, to be at',
        imagePrompt: 'A person standing at a specific location marked with a pin',
        mnemonicStory: 'The character 在 shows 土 (earth/ground) with 才 - talent existing "at" or "in" a place.',
        examples: ['我在家 - I am at home', '书在桌子上 - the book is on the table'],
        frequencyRank: 6
    },
    {
        id: 'char_you',
        character: '有',
        pinyin: 'yǒu',
        meaning: 'to have, there is/are',
        imagePrompt: 'Hands holding or grasping something valuable',
        mnemonicStory: 'The character 有 looks like a hand (又) reaching for the moon (月) - to "have" or possess.',
        examples: ['我有书 - I have a book', '有问题 - there is a problem'],
        frequencyRank: 7
    },
    {
        id: 'char_bu',
        character: '不',
        pinyin: 'bù',
        meaning: 'not, no',
        imagePrompt: 'A big red X or stop sign',
        mnemonicStory: 'The character 不 looks like a bird that cannot fly up (一 blocks it) - representing "not" or negation.',
        examples: ['不好 - not good', '不是 - is not'],
        frequencyRank: 8
    },
    {
        id: 'char_le',
        character: '了',
        pinyin: 'le',
        meaning: 'completed action particle',
        imagePrompt: 'A checkmark showing something is finished',
        mnemonicStory: 'The character 了 looks like a person with arms raised in completion - "finished!" or "done!"',
        examples: ['我吃了 - I ate (completed)', '好了 - okay/done'],
        frequencyRank: 9
    },
    {
        id: 'char_ren',
        character: '人',
        pinyin: 'rén',
        meaning: 'person, people',
        imagePrompt: 'A simple stick figure of a person walking',
        mnemonicStory: 'The character 人 literally looks like a person walking with two legs - very easy to remember!',
        examples: ['中国人 - Chinese person', '好人 - good person'],
        frequencyRank: 10
    }
];

// Function to add characters to database
async function seedCharacters() {
    for (const char of characters) {
        try {
            const response = await fetch('http://localhost:3000/api/characters', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(char)
            });
            
            if (response.ok) {
                console.log(`✅ Added character: ${char.character} (${char.pinyin})`);
            } else {
                console.error(`❌ Failed to add character: ${char.character}`, await response.text());
            }
        } catch (error) {
            console.error(`❌ Error adding character ${char.character}:`, error);
        }
    }
    console.log('🎉 Finished seeding characters!');
}

// Run the seeding if this script is executed directly
if (typeof window === 'undefined') {
    // Node.js environment
    const fetch = require('node-fetch');
    seedCharacters();
} else {
    // Browser environment - expose function globally
    window.seedCharacters = seedCharacters;
}
const fs = require('fs');
const https = require('https');
const dotenv = require('dotenv');

// Load environment variables from .env file (only in local development)
if (process.env.NODE_ENV !== 'production') {
    dotenv.config();
}

const USER_AGENT = process.env.USER_AGENT;

const urls = {
    summons: "https://gbf.wiki/index.php?title=Special:CargoExport&format=json&limit=5000&tables=summons&fields=id%2C_pageName%3DpageName%2Cname%2Cevo_max%3DmaxUncap%2Crarity%2Celement&formatversion=2",
    characters: "https://gbf.wiki/index.php?title=Special:CargoExport&format=json&limit=5000&tables=characters&fields=_pageName%3DpageName%2Cid%2Cseries%2Cstyle_name%3DstyleName%2Cstyle_id%3DstyleId%2Cjpname%2Cname%2Crelease_date%3DreleaseDate%2Cgender%2Cobtain%2C5star_date%3DflbDate%2Cmax_evo%3DmaxUncap%2Cexpedition_type%3DexpeditionType%2Crarity%2Celement%2Ctype%2Ccustomtype%2Crace%2Cjoin_weapon%3DrecruitWeapon%2Cweapon&formatversion=2",
    weapons: "https://gbf.wiki/index.php?title=Special:CargoExport&format=json&limit=5000&tables=weapons&fields=id%2C_pageName%3DpageName%2Cevo_max%3DmaxUncap%2Crarity%2Cseries%2Celement%2Cs1_icon%2Cs2_icon%2Cs3_icon%2Ctype%2Cawakening%2Cawakening_type1%3DawakeningType1%2Cawakening_type2%3DawakeningType2&formatversion=2",
    abilities: "https://gbf.wiki/index.php?title=Special:CargoExport&format=json&limit=5000&tables=class_skill&fields=icon%2Cname%2C&formatversion=2"
};

const files = {
    summons: "summons.json",
    minSummons: "summons-min.json",
    characters: "characters.json",
    minCharacters: "characters-min.json",
    weapons: "weapons.json",
    minWeapons: "weapons-min.json",
    abilities: "abilities.json"
};

const jqQueries = {
    summons: data => data.map(item => ({
        [item.id]: {
            pageName: item.pageName.replace(/&#039;/g, "'"),
            name: item.name.replace(/&#039;/g, "'"),
            maxUncap: item.maxUncap,
            rarity: item.rarity,
            element: item.element
        }
    })).reduce((acc, curr) => Object.assign(acc, curr), {}),
    minSummons: data => data.map(item => ({
        [item.id]: {
            pageName: item.pageName.replace(/&#039;/g, "'"),
            name: item.name.replace(/&#039;/g, "'"),
            maxUncap: item.maxUncap
        }
    })).reduce((acc, curr) => Object.assign(acc, curr), {}),
    characters: data => data.map(item => ({
        [item.id]: {
            pageName: item.pageName.replace(/&#039;/g, "'"),
            maxUncap: item.maxUncap,
            rarity: item.rarity,
            element: item.element,
            series: item.series,
            styleName: item.styleName,
            styleId: item.styleId,
            jpname: item.jpname,
            releaseDate: item.releaseDate,
            gender: item.gender,
            obtain: item.obtain,
            flbDate: item.flbDate,
            expeditionType: item.expeditionType,
            type: item.type,
            customType: item.customType,
            race: item.race,
            recruitWeapon: item.recruitWeapon ? item.recruitWeapon.replace(/&#039;/g, "'") : null,
            weapon: item.weapon
        }
    })).reduce((acc, curr) => Object.assign(acc, curr), {}),
    minCharacters: data => data.map(item => ({
        [item.id]: {
            pageName: item.pageName.replace(/&#039;/g, "'")
        }
    })).reduce((acc, curr) => Object.assign(acc, curr), {}),
    weapons: data => data.map(item => ({
        [item.id]: {
            pageName: item.pageName.replace(/&#039;/g, "'"),
            maxUncap: item.maxUncap,
            rarity: item.rarity,
            series: item.series,
            element: item.element,
            "s1 icon": item["s1 icon"],
            "s2 icon": item["s2 icon"],
            "s3 icon": item["s3 icon"],
            type: item.type,
            awakening: item.awakening,
            awakeningType1: item.awakeningType1,
            awakeningType2: item.awakeningType2
        }
    })).reduce((acc, curr) => Object.assign(acc, curr), {}),
    minWeapons: data => data.map(item => ({
        [item.id]: {
            maxUncap: item.maxUncap
        }
    })).reduce((acc, curr) => Object.assign(acc, curr), {}),
    abilities: data => data.map(item => ({
        [item.name.replace(/&#039;/g, "'")]: {
            icon: item.icon,
            name: item.name.replace(/&#039;/g, "'")
        }
    })).reduce((acc, curr) => Object.assign(acc, curr), {})
};

function fetchData(url) {
    return new Promise((resolve, reject) => {
        https.get(url, { headers: { 'User-Agent': USER_AGENT } }, res => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => resolve(JSON.parse(data)));
        }).on('error', reject);
    });
}

async function processData() {
    for (const [key, url] of Object.entries(urls)) {
        console.log(`Fetching data for ${key}...`);
        const data = await fetchData(url);
        const query = jqQueries[key](data);
        fs.writeFileSync(files[key], JSON.stringify(query, null, 2));
        console.log(`Saved ${key} data to ${files[key]}`);
    }
}

processData().catch(err => {
    console.error('Error processing data:', err);
    process.exit(1);
});
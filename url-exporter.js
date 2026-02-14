javascript: (async function () {
const V = 3.71;
let v;
await fetch("https://raw.githubusercontent.com/cajunwildcat/GBF-Party-Parser/main/version", { cache: 'no-store' })
    .then(function(response){return response.json();})
    .then(function(response){if (v = parseFloat(response)) ;});
if (V < v) {
    if (confirm("There is an update to the bookmarklet, please copy the new version to ensure the copied data is as accurate as possible.\nClick Cancel to ignore this update.")) {
        open("https://github.com/cajunwildcat/GBF-Party-Parser", "_blank");
        return;
    }
}
if (!window.location.hash.startsWith("#party/index/")) {
    alert('Please go to a GBF Party screen');
    return;
}
let summons, weapons, abilities;
await fetch("https://raw.githubusercontent.com/cajunwildcat/The-GrandCypher/main/summons-min.json", { next: 43200 })
    .then(function(response){return response.json();})
    .then((response)=>summons=response);
await fetch("https://raw.githubusercontent.com/cajunwildcat/The-GrandCypher/main/weapons-min.json", { next: 43200 })
    .then(function(response){return response.json();})
    .then((response)=>weapons=response);
await fetch("https://raw.githubusercontent.com/cajunwildcat/The-GrandCypher/main/abilities-min.json", { next: 43200 })
    .then(function(response){return response.json();})
    .then((response)=>abilities=response);
const specialWepSeries = [
    "3",   //opus
    "13",  //ultima
    "17",  //superlative
    "19",  //ccw
    "27",  //draconic
    "40",  //draconic providence
    "44",  //destroyer
];
const shields = ["Round Shield","Buckler","Knight Shield","Scutum","Mythril Shield","Holy Shield","Tiamat Shield","Rose Crystal Shield","Spartan Shield","Malice Adarga","Archangel's Shield","Colossus Wall","Bahamut Shield","Soul of Oneness","Eutr Nogadr Ldeysh","Hero's Shield","Shield of Lamentation","Huanglong Shield","Qilin Shield","Nibelung Mauer","Obelisk","Shield of the Enthroned","Lustrous Wall","Eth Ldog Ldeysh","Eth Ckalb Ldeysh","Moonhill","Shield of Tenets","New World Shield","Anima Animus Shield","ESV Shield (Man-Portable)"];
const getShieldByID = (shieldId) => {
    let shieldID = (shieldId-1).toString();
    const shieldRarity = shieldID[0];
    shieldID = shields[parseInt(shieldID.substring(1)) + (shieldRarity == "2"? 0 : shieldRarity == "3"? 3 : 8)];
    return shieldID;
}
const auxilaryWeaponClasses = ["Gladiator", "Chrysaor", "Iatromantis", "Street King", "Viking"];
const splitskillNames = {"Execration":"Execration / Five-Phase Seal", "Assault Drive" : "Assault Drive / Weapon Discharge"}
const suppSAssumptions = ["Lucifer", "Bahamut", "Agni", "Varuna", "Titan", "Zephyrus", "Zeus", "Hades", "Colossus Omega", "Leviathan Omega", "Yggdrasil Omega", "Tiamat Omega", "Luminiera Omega", "Celeste Omega"];
const minos = ["burlona", "schalk", "levi", "yggy", "baha", "luwoh", "mimic", "ouro", "europa", "wilnas", "agastia", "faa", "chachazero", "perfida", "qilin", "cocomimi"];
const keyMap = { /*ultima 1*/ "Dominion": "will", "Parity": "strife", "Utopia": "vitality", "Plenum": "strength", "Ultio": "zeal", "Ars": "courage", /*ultima 2*/ "Aggressio": "auto", "Facultas": "skill", "Arcanum": "ougi", "Catena": "cb", /*ultima 3*/ "Fortis": "cap", "Sanatio": "healing", "Impetus": "seraphic", "Elatio": "cbgain", /*dopus 2*/ "α": "auto", "β": "skill", "γ": "ougi", "Δ": "cb", /*dopus 3*/ "Fruit": "apple", "Conduct": "depravity ", "Fallacy": "echo", /*draconic 2*/ "True": "def", "Vermillion": "fire", "Azure": "water", "Golden": "earth", "Emerald": "wind", "White": "light", "Black": "dark" };
const elements = ["Fire", "Water", "Earth", "Wind", "Light", "Dark"];
const uncaps = [40,60,80,100,150,200];
const transcendences = [200, 210, 220, 230, 240];
const arcarumSums = {"Justice": [2030081000, 2040236000],"The Hanged Man": [2030085000, 2040237000],"Death": [2030089000, 2040238000],"Temperance": [2030093000, 2040239000],"The Devil": [2030097000, 2040240000],"The Tower": [2030101000, 2040241000],"The Star": [2030105000, 2040242000],"The Moon": [2030109000, 2040243000],"The Sun": [2030113000, 2040244000],"Judgement": [2030117000, 2040245000]}
arcarumIndices = [];
const final = {
    mcclass: window.Game.view.deck_model.attributes.deck.pc.job.master.id,
    mcskills: [],
    mino: null,

    characters: [],
    charactersUncap: [],
    charactersTrans: [],
    charactersRing: [],
    charactersAwks: [],

    summons: [],
    summonsImg: [],
    summonsUncap: [],
    summonsMaxUncap: [],
    summonsTrans: [],

    weapons: [],
    weaponsUncap: [],
    weaponsMaxUncap: [],
    weaponsAwaken: [],
    weaponsKeys: {
        opus: [],
        ccw: null,
        draconic: [],
        ultima: [],
        destroyer: []
    }
};
//mc skills
Object.values(window.Game.view.deck_model.attributes.deck.pc.set_action).forEach(e => {
    final.mcskills.push(e.name ? splitskillNames[e.name.trim()]? splitskillNames[e.name.trim()] : e.name.trim() : null);
});
//manadiver mino
if (final.mcclass == "Manadiver") final.mino = minos[window.Game.view.deck_model.attributes.deck.pc.familiar_id-1];
if (final.mcclass == "Paladin" || final.mcclass == "Shieldsworn") final.shield = getShieldByID(window.Game.view.deck_model.attributes.deck.pc.shield_id);
//characters
Object.values(window.Game.view.deck_model.attributes.deck.npc).forEach(e => {
    final.characters.push(e.master.id? e.master.id : null);
    final.charactersRing.push(e.param ? e.param.has_npcaugment_constant : null);
    final.charactersUncap.push(e.param ? e.param.evolution : null);
    final.charactersTrans.push(e.param? e.param.phase : null);
    final.charactersAwks.push(e.param? e.param.npc_arousal_form : null)
});
//summons
let quick = window.Game.view.deck_model.attributes.deck.pc.quick_user_summon_id;
const fillSummonData = (e,i) => {
    let id = e.master ? parseInt(e.master.id, 10) : null;
    if (e.master && Object.keys(arcarumSums).includes(e.master.name.trim())) {
        id = arcarumSums[e.master.name][parseInt(e.master.id[2])-3];
    }
    final.summons.push(id);
    let trans = e.param ? (parseInt(e.param.level, 10) - 200) / 10: null;
    final.summonsTrans.push(trans);
    final.summonsMaxUncap.push(e.param? summons[id].maxUncap : null);
    final.summonsUncap.push(e.param ? e.param.evolution : null);
    final.summonsImg.push((function(u,t){
        if (u <= 4 || Object.keys(arcarumSums).includes(e.master.name)) return null;
        else if (u == 5) return "B";
        else if (u == 6 && t < 5) return "C";
        else return "D";
    })(final.summonsUncap.slice(-1), final.summonsTrans.slice(-1)));
    if (e.param && e.param.id == quick) i == 0? quick = "main" : quick = i;
}
//main summons
Object.values(window.Game.view.deck_model.attributes.deck.pc.summons).forEach(fillSummonData);
//sub summons
Object.values(window.Game.view.deck_model.attributes.deck.pc.sub_summons).forEach(fillSummonData);
//support summon
let suppS = window.Game.view.expectancyDamageData;
//no detailed support summon data available
if (!suppS) {
    let summon = Object.keys(summons).find(s=>summons[s].name==window.Game.view.deck_model.attributes.deck.pc.damage_info.summon_name);
    final.summons.push(summon? summon : null);
}
else {
    final.summons.push(suppS.summonId);
    final.summonsTrans.push(parseInt(suppS.evolution) == 6? 5 : 0);
    final.summonsUncap.push(parseInt(suppS.evolution));
}

//weapons
Object.values(window.Game.view.deck_model.attributes.deck.pc.weapons).forEach((e,i) => {
    final.weapons.push(e.master ? e.master.id : null);
    final.weaponsUncap.push(e.param ? (function() {
        //TODO: change to compare uncap vs maxUncap
        let uncap = 0;
        const lvl = e.param.level;
        uncaps.forEach(u => lvl>u? uncap++ : null);
        if (uncap>5)  {
            let trans = 0;
            transcendences.forEach(t=>lvl>t? trans++ : null);
            return `t${trans}`;
        }
        return uncap;
    })() : 0);
    final.weaponsMaxUncap.push(e.master? weapons[parseInt(e.master.id)].maxUncap : null);
    if (e.param && e.param.arousal.form_name && e.param.arousal.level > 1) {
        final.weaponsAwaken.push(e.param.arousal.form);
    }
    else {
        final.weaponsAwaken.push(null);
    }
    if (e.master && specialWepSeries.includes(e.master["series_id"])) {
        switch (e.master["series_id"]) {
            //opus - s2 first word, s3 last word unless II or III, then word before
            case "3":
                if (e.skill2) final.weaponsKeys.opus.push(keyMap[e.skill2.name.trim().split(" ")[0]]);
                if (e.skill3) {
                    let fullName = e.skill3.name.trim().split(" ");
                    let skill = (fullName[fullName.length-1] == "II" || fullName[fullName.length-1] == "III")? fullName[fullName.length-2] : fullName.pop();
                    final.weaponsKeys.opus.push(keyMap[skill]? keyMap[skill] : skill);
                }
            break;
            //ultima - last word
            case "13":
                if (e.skill1) final.weaponsKeys.ultima.push(keyMap[e.skill1.name.trim().split(" ").pop()]);
                if (e.skill2) final.weaponsKeys.ultima.push(keyMap[e.skill2.name.trim().split(" ").pop()]);
                if (e.skill3) final.weaponsKeys.ultima.push(keyMap[e.skill3.name.trim().split(" ").pop()]);
            break;
            case "17":
            //superlative - only for element
            break;
            //ccw - last word
            case "19": 
                if (e.skill2 && ["Humanity", "Divinity", "Devilry"].some(s=>e.skill2.name.includes(s))) final.weaponsKeys.ccw = e.skill2.name.trim().split(" ").pop();
            break;
            //draconic
            case "27":
            case "40": 
                if (e.skill2) {
                    let fullName = e.skill2.name.trim().split(" ");
                    let skill = (fullName[fullName.length-1] === "Barrier")? keyMap[fullName[0]] : fullName.pop();
                    final.weaponsKeys.draconic.push(skill);
                }
                if (e.skill3) e.skill3.name.trim().split(" ").pop() === "III"? final.weaponsKeys.draconic.push("magna") : final.weaponsKeys.draconic.push("primal");
            break;
            //destroyer
            case "44":
                if (e.skill3) e.skill3.name.trim().split(" ")[1] === "Godstrike"? final.weaponsKeys.destroyer.push("auto") : (e.skill3.name.trim().split(" ")[1] === "Godflair"? final.weaponsKeys.destroyer.push("skill") : final.weaponsKeys.destroyer.push("ougi"));
            break;
        }
    }
});

const getMC = () => {
    let cl = decimalToBase62(final.mcclass);
    let skills = final.mcskills.map(s => {
        let id = abilities[s].id.split("_");
        id[0] = decimalToBase62(id[0]);
        id = id.join("_");
        return id;
    }).filter(q=>q.length > 0).join(",");
    return `${cl}${skills.length > 0? `,${skills}` : ""}`;
}

const getCharacter = (index) => {
    let c = final.characters[index];
    if (!c) return "";
    let id = decimalToBase62((c - 3000000000) / 1000);
    let uncap = final.charactersTrans[index] > 0? "t"+final.charactersTrans[index] : final.charactersUncap[index] > 4? final.charactersUncap[index] : "";
    let awk = final.charactersAwks[index]? final.charactersAwks[index] - 1 : "";

    return `${id}${uncap?`.${uncap}`:""}${awk?`$${awk}`:""}`;
};
const getCharacters = () => {
    return final.characters.map((c,i)=>getCharacter(i)).filter(q=>q.length>0).join(",");
};

const getWeapon = (index) => {
    let w = final.weapons[index];
    if (!w) return "";
    let id = decimalToBase62((w - 1000000000) / 100);
    let uncap = ((final.weaponsMaxUncap[index] != 6 && final.weaponsUncap[index] == final.weaponsMaxUncap[index]) || ((final.weapons[index].includes("Renunciation") || final.weapons[index].includes("Repudiation")) && final.weaponsUncap[index] == 5))? "" :
    `${final.weaponsUncap[index]}`;
    let awk = final.weaponsAwaken[index]? `${final.weaponsAwaken[index]}` : "";
    return `${id}${uncap?`.${uncap}`:""}${awk?`$${awk}`:""}`;
};
const getWeapons = () => {
    return final.weapons.map((w,i)=>getWeapon(i)).filter(q=>q.length>0).join(",");
};

const getSummon = (index) => {
    let s = final.summons[index];
    if (!s) return "";
    let id = decimalToBase62((s - 2000000000) / 1000);
    let uncap = ((final.summonsMaxUncap[index] != 6 && final.summonsUncap[index] == final.summonsMaxUncap[index]) || (final.summonsMaxUncap[index] == 6 && final.summonsTrans[index] == 5))? "" :
        final.summonsTrans[index] <= 0? `${final.summonsUncap[index] < 3? 0 : final.summonsUncap}` : `t${final.summonsTrans[index]}`
    return `${id}${uncap? `.${uncap}` : ""}`;
};
const getSummons = () => {
    return final.summons.map((w,i)=>getSummon(i)).filter(q=>q.length>0).join(",");
}

function decimalToBase62(num) {
    const charset = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    if (num === 0) return charset[0];
    let result = "";
    while (num > 0) {
        result = charset[num % 62] + result;
        num = Math.floor(num / 62);
    }
    return result;
}
navigator.clipboard.writeText(`https://cajunwildcat.github.io/GBF-Grid-Maker/?c=${getCharacters()}&w=${getWeapons()}&s=${getSummons()}&mc=${getMC()}${quick? `&qs=${quick}` : ""}${final.weaponsKeys.opus.length>0? `&opus=${final.weaponsKeys.opus.join(",")}` : ""}${final.weaponsKeys.ultima.length>0? `&ulti=${final.weaponsKeys.ultima.join(",")}` : ""}${final.weaponsKeys.draconic.length>0? `&drac=${final.weaponsKeys.draconic.join(",")}` : ""}${final.weaponsKeys.destroyer.length>0? `&dest=${final.weaponsKeys.destroyer.join(",")}` : ""}${final.weaponsKeys.ccw? `&ccw=${final.weaponsKeys.ccw}` : ""}`)
alert("URL Copied to Clipboard");
}())
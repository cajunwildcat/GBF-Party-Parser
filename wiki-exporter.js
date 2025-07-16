javascript: (async function () {
const V = 3.3;
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
let characters, summons, weapons;
await fetch("https://raw.githubusercontent.com/cajunwildcat/The-GrandCypher/main/characters-min.json", { next: 43200 })
    .then(function(response){return response.json();})
    .then((response)=>characters=response);
await fetch("https://raw.githubusercontent.com/cajunwildcat/The-GrandCypher/main/summons-min.json", { next: 43200 })
    .then(function(response){return response.json();})
    .then((response)=>summons=response);
await fetch("https://raw.githubusercontent.com/cajunwildcat/The-GrandCypher/main/weapons-min.json", { next: 43200 })
    .then(function(response){return response.json();})
    .then((response)=>weapons=response);
const specialWepSeries = [
    "3",   //opus
    "13",  //ultima
    "17",  //superlative
    "19",  //ccw
    "27",  //draconic
    "40",  //draconic providence
];
const shields = ["Round Shield","Buckler","Knight Shield","Scutum","Mythril Shield","Holy Shield","Tiamat Shield","Rose Crystal Shield","Spartan Shield","Malice Adarga","Archangel's Shield","Colossus Wall","Bahamut Shield","Soul of Oneness","Eutr Nogadr Ldeysh","Hero's Shield","Shield of Lamentation","Huanglong Shield","Qilin Shield","Nibelung Mauer","Obelisk","Shield of the Enthroned","Lustrous Wall","Eth Ldog Ldeysh","Eth Ckalb Ldeysh","Moonhill","Shield of Tenets"];
const getShieldByID = (shieldId) => {
    let shieldID = (shieldId-1).toString();
    const shieldRarity = shieldID[0];
    shieldID = shields[parseInt(shieldID.substring(1)) + (shieldRarity == "2"? 0 : shieldRarity == "3"? 3 : 8)];
    return shieldID;
}
const auxilaryWeaponClasses = ["Gladiator", "Chrysaor", "Iatromantis", "Street King", "Viking"];
const splitskillNames = {"Execration":"Execration / Five-Phase Seal", "Assault Drive" : "Assault Drive / Weapon Discharge"}
const suppSAssumptions = ["Lucifer", "Bahamut", "Agni", "Varuna", "Titan", "Zephyrus", "Zeus", "Hades", "Colossus Omega", "Leviathan Omega", "Yggdrasil Omega", "Tiamat Omega", "Luminiera Omega", "Celeste Omega"];
const minos = ["burlona", "schalk", "levi", "yggy", "baha", "luwoh", "mimic", "ouro", "europa", "wilnas", "agastia", "faa", "chachazero"];
const keyMap = { /*ultima 1*/ "Dominion": "will", "Parity": "strife", "Utopia": "vitality", "Plenum": "strength", "Ultio": "zeal", "Ars": "courage", /*ultima 2*/ "Aggressio": "auto", "Facultas": "skill", "Arcanum": "ougi", "Catena": "cb", /*ultima 3*/ "Fortis": "cap", "Sanatio": "healing", "Impetus": "seraphic", "Elatio": "cbgain", /*dopus 2*/ "α": "auto", "β": "skill", "γ": "ougi", "Δ": "cb", /*dopus 3*/ "Fruit": "apple", "Conduct": "depravity ", "Fallacy": "echo", /*draconic 2*/ "True": "def", "Vermillion": "fire", "Azure": "water", "Golden": "earth", "Emerald": "wind", "White": "light", "Black": "dark" };
const elements = ["Fire", "Water", "Earth", "Wind", "Light", "Dark"];
const charImgMap = {"4": null,"5":"C","6":"D"};
const uncaps = [40,60,80,100,150,200];
const transcendences = [200, 210, 220, 230, 240];
const arcarumSums = {"Justice": [2030081000, 2040236000],"The Hanged Man": [2030085000, 2040237000],"Death": [2030089000, 2040238000],"Temperance": [2030093000, 2040239000],"The Devil": [2030097000, 2040240000],"The Tower": [2030101000, 2040241000],"The Star": [2030105000, 2040242000],"The Moon": [2030109000, 2040243000],"The Sun": [2030113000, 2040244000],"Judgement": [2030117000, 2040245000]}
arcarumIndices = [];
const final = {
    mcclass: window.Game.view.deck_model.attributes.deck.pc.job.master.name,
    mcskills: [],
    mino: null,

    characters: [],
    charactersImg: [],
    charactersTrans: [],
    charactersRing: [],

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
    const char = e.master ? characters[parseInt(e.master.id)] : null;
    final.characters.push(char? char["pageName"] : e.master? e.master.name : null);
    final.charactersRing.push(e.param ? e.param.has_npcaugment_constant : null);
    final.charactersImg.push(e.param ? charImgMap[e.param.evolution] : null);
    final.charactersTrans.push(e.param? e.param.phase : null);
});
//summons
let quick = window.Game.view.deck_model.attributes.deck.pc.quick_user_summon_id;
const fillSummonData = (e,i) => {
    let id = e.master ? parseInt(e.master.id, 10) : null;
    if (e.master && Object.keys(arcarumSums).includes(e.master.name)) {
        id = arcarumSums[e.master.name][parseInt(e.master.id[2])-3];
    }
    final.summons.push(e.master? summons[id]? summons[id]["pageName"] : e.master.name : null);
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
//support summon
let suppS = window.Game.view.expectancyDamageData;
final.summons.push(suppS ? suppS.summonId? summons[parseInt(suppS.summonId)]["pageName"] : null : null);
if (!final.summons.slice(-1).includes(window.Game.view.deck_model.attributes.deck.pc.damage_info.summon_name)) suppS = null;
final.summonsTrans.push(suppS ? parseInt(suppS.evolution) == 6? 5 : 0 : null);
final.summonsUncap.push(suppS ? parseInt(suppS.evolution) : null);
final.summonsImg.push(suppS? (function(u,t){
    if (u <= 4 || Object.keys(arcarumSums).includes(suppS)) return "A";
    else if (u == 5) return "B";
    else if (u == 6 && t < 5) return "C";
    else return "D";
})(final.summonsUncap.slice(-1), final.summonsTrans.slice(-1)) : null);
//no detailed support summon data available
if (suppS == null) {
    let summon = Object.values(summons).find(s=>s.name==window.Game.view.deck_model.attributes.deck.pc.damage_info.summon_name);
    final.summons.splice(-1,1,summon? summon.pageName : "");
    suppS = final.summons.slice(-1)[0];
    if (suppSAssumptions.includes(suppS)) {
        final.summonsTrans.splice(-1,1,5);
        final.summonsUncap.splice(-1,1,6);
        final.summonsImg.splice(-1,1,"D");
    }
}
//sub summons
Object.values(window.Game.view.deck_model.attributes.deck.pc.sub_summons).forEach(fillSummonData);
//weapons
Object.values(window.Game.view.deck_model.attributes.deck.pc.weapons).forEach((e,i) => {
    final.weapons.push(e.master ? e.master.name : null);
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
    final.weaponsAwaken.push(e.param? e.param.arousal["form_name"]: null);
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
                if (i == 0 || (i == 1 && auxilaryWeaponClasses.includes(final.mcclass))) final.weapons[final.weapons.length-1] += ` (${elements[e.master.attribute-1]})`;
                if (e.skill1) final.weaponsKeys.ultima.push(keyMap[e.skill1.name.trim().split(" ").pop()]);
                if (e.skill2) final.weaponsKeys.ultima.push(keyMap[e.skill2.name.trim().split(" ").pop()]);
                if (e.skill3) final.weaponsKeys.ultima.push(keyMap[e.skill3.name.trim().split(" ").pop()]);
            break;
            case "17":
            //superlative - only for element
            final.weapons[final.weapons.length-1] += ` (${elements[e.master.attribute-1]})`;
            break;
            //ccw - last word
            case "19": 
                if (e.param.level == 200) final.weapons[final.weapons.length-1] += ` (${elements[e.master.attribute-1]})`;
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
        }
    }
});

const wikiTable = () => `{{TeamSpread
|team={{Team
|class=${final.mcclass}${final.mino? `|mino=${final.mino}` : ""}${final.shield? `|shield=${final.shield}` : ""}
${getCharacters()}
|skill1=${final.mcskills[0]? final.mcskills[0] : ""}
|skill2=${final.mcskills[1]? final.mcskills[1] : ""}
|skill3=${final.mcskills[2]? final.mcskills[2] : ""}
|main=${final.summons[0]? final.summons[0] : ""}${final.summonsTrans[0] > 0? "|transmain=" + final.summonsTrans[0] : ""}${final.summonsImg[0]? "|artmain=" + final.summonsImg[0] : ""}
|support=${final.summons[5]? final.summons[5] : suppS}${final.summonsTrans[5]? "|transsupport=" + final.summonsTrans[5] : ""}${final.summonsImg[5]? "|artsupport=" + final.summonsImg[5] : ""}
}}
|weapons={{WeaponGridSkills
${getWeapons()}
${`${final.weaponsKeys.opus.length>0? `|opus=${final.weaponsKeys.opus.join(",")}` : ""}
${final.weaponsKeys.ultima.length>0? `|ultima=${final.weaponsKeys.ultima.join(",")}` : ""}
${final.weaponsKeys.draconic.length>0? `|draconic=${final.weaponsKeys.draconic.join(",")}` : ""}
${final.weaponsKeys.ccw? `|ccw=${final.weaponsKeys.ccw}` : ""}`.split("\n").filter(s=>s.length>0).join("\n")}
}}
|summons={{SummonGrid
|main=${getSummon(0)}
|s1=${getSummon(1)}
|s2=${getSummon(2)}
|s3=${getSummon(3)}
|s4=${getSummon(4)}
|sub1=${getSummon(6)}
|sub2=${getSummon(7)}
|quick=${quick? quick : ""}
}}
}}`;

const getCharacter = (index) => {
    return `|char${index+1}=${final.characters[index]? final.characters[index]: ""}${final.charactersImg[index]? `|art${index+1}=${final.charactersImg[index]}` : ""}${final.charactersTrans[index] > 0? `|trans${index+1}=${final.charactersTrans[index]}` : ""}`;
};
const getCharacters = () => {
    return final.characters.map((c,i)=>getCharacter(i)).filter(q=>q.length>0).join("\n");
};
const getWeapons = () => {
    return final.weapons.map((w,i)=>getWeapon(i)).filter(q=>q.length>0).join("\n");
};
const getWeapon = (index) => {
    if (final.weapons[index] == null) return "";
    let uncap = ((final.weaponsMaxUncap[index] != 6 && final.weaponsUncap[index] == final.weaponsMaxUncap[index]) || ((final.weapons[index].includes("Renunciation") || final.weapons[index].includes("Repudiation")) && final.weaponsUncap[index] == 5))? "" :
        `|u${index}=${final.weaponsUncap[index]}`;
    let wep = `|wp${index}=${final.weapons[index]}${uncap}${final.weaponsAwaken[index]? `|awk${index}=${final.weaponsAwaken[index]}` : ""}`
    if (index == 0) wep = wep.replace("wp0", "mh").replace("u0", "umh").replace("awk0", "awkmh");
    return wep;
};
const getSummon = (index) => {
    if (final.summons[index] == null) return "";
    let uncap = ((final.summonsMaxUncap[index] != 6 && final.summonsUncap[index] == final.summonsMaxUncap[index]) || (final.summonsMaxUncap[index] == 6 && final.summonsTrans[index] == 5))? "" :
        `|u${index}=${final.summonsTrans[index] <= 0? `${final.summonsUncap[index]}` : `trans${final.summonsTrans[index]}`}`
    let sum = `${final.summons[index]}${uncap}`;
    if (index == 0) sum = sum.replace("u0", "umain").replace("art0", "artmain");
    if (index == 6) sum = sum.replace("u6", "usub1").replace("art6", "artsub1");
    if (index == 7) sum = sum.replace("u7", "usub2").replace("art7", "artsub2");
    return sum;
};

//copy to clipboard
(function (text) {
    var textarea = document.createElement("textarea");
    textarea.textContent = text;
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    try {
        document.execCommand("copy");
        document.body.removeChild(textarea);
        alert("Copied data to clipboard");
    }
    catch (e) {
        document.body.removeChild(textarea);
    }
}(wikiTable()))
}())
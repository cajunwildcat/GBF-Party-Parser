javascript: (async function () {
const V = 2.4;
let v;
await fetch("https://raw.githubusercontent.com/cajunwildcat/GBF-Party-Parser/main/version", { cache: 'no-store' })
    .then(function(response){return response.json();})
    .then(function(response){if (v = parseFloat(response)) ;});
if (V < v) {
    alert("There is an update to the bookmarklet, please copy the new version.")
    open("https://github.com/cajunwildcat/GBF-Party-Parser", "_blank");
    return;
}
if (!window.location.hash.startsWith("#party/index/")) {
    alert('Please go to a GBF Party screen');
    return;
}
let characters, summons;
await fetch("https://raw.githubusercontent.com/cajunwildcat/GBF-Party-Parser/main/characters.json", { next: 43200 })
    .then(function(response){return response.json();})
    .then((response)=>characters=response);
await fetch("https://raw.githubusercontent.com/cajunwildcat/GBF-Party-Parser/main/summons.json", { next: 43200 })
    .then(function(response){return response.json();})
    .then((response)=>summons=response);
const specialWepSeries = [
    "3",   //opus
    "13",  //ultima
    "17",  //superlative
    "19",  //ccw
    "27",  //draconic
    "40",  //draconic providence
];
const suppSAssumptions = ["Lucifer", "Bahamut", "Agni", "Varuyna", "Titan", "Zephyrus", "Zeus", "Hades", "Colossus Omega", "Leviathan Omega", "Yggdrasil Omega", "Tiamat Omega", "Luminiera Omega", "Celeste Omega"];
const minos = ["burlona", "schalk", "levi", "yggy", "baha", "luwoh", "mimic", "ouro"];
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
    summonsTrans: [],

    weapons: [],
    weaponsUncaps: [],
    weaponAwakens: [],
    weaponKeys: {
        opus: [],
        ccw: null,
        draconic: [],
        ultima: [],
    }
};
//mc skills
Object.values(window.Game.view.deck_model.attributes.deck.pc.set_action).forEach(e => {
    final.mcskills.push(e.name ? e.name.trim() : null)
});
//manadiver mino
if (final.mcclass == "Manadiver") final.mino = minos[window.Game.view.deck_model.attributes.deck.pc.familiar_id-1];
//characters
Object.values(window.Game.view.deck_model.attributes.deck.npc).forEach(e => {
    const char = e.master ? characters[parseInt(e.master.id)] : null;
    final.characters.push(char? char["name"] : e.master? e.mater.name : e.master);
    final.charactersRing.push(e.param ? e.param.has_npcaugment_constant : null);
    final.charactersImg.push(e.param ? charImgMap[e.param.evolution] : null);
    final.charactersTrans.push(e.param? (parseInt(e.param.level, 10) - 100) / 10 : null);
});
//summons
let quick = window.Game.view.deck_model.attributes.deck.pc.quick_user_summon_id;
const fillSummonData = (e,i) => {
    let id = e.master ? parseInt(e.master.id, 10) : null;
    if (e.master && Object.keys(arcarumSums).includes(e.master.name)) {
        id = arcarumSums[e.master.name][parseInt(e.master.id[2])-3];
    }
    final.summons.push(e.master? summons[id]? summons[id]["name"] : e.master.name : null);
    final.summonsTrans.push(e.param ? (parseInt(e.param.level, 10) - 200) / 10: null);
    final.summonsUncap.push(e.param ? e.param.evolution : null);
    final.summonsImg.push((function(u,t){
        if (u <= 4 || Object.keys(arcarumSums).includes(e.master.name)) return "A";
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
final.summons.push(suppS ? summons[parseInt(suppS.summonId)]["name"] : null);
if (final.summons.slice(-1) != window.Game.view.deck_model.attributes.deck.pc.damage_info.summon_name) suppS = null;
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
    final.summons.splice(-1,1,window.Game.view.deck_model.attributes.deck.pc.damage_info.summon_name);
    suppS = final.summons.slice(-1)[0];
    if (suppSAssumptions.includes(suppS)) {
        //release your stupid M3 already
        if (suppS.includes("Levi") || suppS.includes("Ygg")) {
            final.summonsTrans.splice(-1,1,0);
            final.summonsUncap.splice(-1,1,5);
            final.summonsImg.splice(-1,1,"B");
        }
        else {
            final.summonsTrans.splice(-1,1,5);
            final.summonsUncap.splice(-1,1,6);
            final.summonsImg.splice(-1,1,"D");
        }
    }
}
//sub summons
Object.values(window.Game.view.deck_model.attributes.deck.pc.sub_summons).forEach(fillSummonData);
//weapons
Object.values(window.Game.view.deck_model.attributes.deck.pc.weapons).forEach(e => {
    final.weapons.push(e.master ? e.master.name : null);
    final.weaponsUncaps.push(e.param ? (function() {
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
    final.weaponAwakens.push(e.param? e.param.arousal["form_name"]: null);
    if (e.master && specialWepSeries.includes(e.master["series_id"])) {
        switch (e.master["series_id"]) {
            //opus - s2 first word, s3 last word unless II or III, then word before
            case "3":
                if (e.skill2) final.weaponKeys.opus.push(keyMap[e.skill2.name.trim().split(" ")[0]]);
                if (e.skill3) {
                    let fullName = e.skill3.name.trim().split(" ");
                    let skill = (fullName[fullName.length-1] == "II" || fullName[fullName.length-1] == "III")? fullName[fullName.length-2] : fullName.pop();
                    final.weaponKeys.opus.push(keyMap[skill]? keyMap[skill] : skill);
                }
            break;
            //ultima - last word
            case "13":
                final.weapons[final.weapons.length-1] += ` (${elements[e.master.attribute-1]})`;
                if (e.skill1) final.weaponKeys.ultima.push(keyMap[e.skill1.name.trim().split(" ").pop()]);
                if (e.skill2) final.weaponKeys.ultima.push(keyMap[e.skill2.name.trim().split(" ").pop()]);
                if (e.skill3) final.weaponKeys.ultima.push(keyMap[e.skill3.name.trim().split(" ").pop()]);
            break;
            case "17":
            //superlative - only for element
            final.weapons[final.weapons.length-1] += ` (${elements[e.master.attribute-1]})`;
            break;
            //ccw - last word
            case "19": 
            final.weapons[final.weapons.length-1] += ` (${elements[e.master.attribute-1]})`;
                if (e.skill2) final.weaponKeys.ccw = e.skill2.name.trim().split(" ").pop();
            break;
            //draconic
            case "27":
            case "40": 
                if (e.skill2) {
                    let fullName = e.skill2.name.trim().split(" ");
                    let skill = (fullName[fullName.length-1] === "Barrier")? keyMap[fullName[0]] : fullName.pop();
                    final.weaponKeys.draconic.push(skill);
                }
                if (e.skill3) e.skill3.name.trim().split(" ").pop() === "III"? final.weaponKeys.draconic.push("magna") : final.weaponKeys.draconic.push("primal");
            break;
        }
    }
});

const wikiTable = () => `{{TeamSpread
|team={{Team
|class=${final.mcclass}${final.mino? `|mino=${final.mino}` : ""}
${getCharacters()}
|skill1=${final.mcskills[0]? final.mcskills[0] : ""}
|skill2=${final.mcskills[1]? final.mcskills[1] : ""}
|skill3=${final.mcskills[2]? final.mcskills[2] : ""}
|main=${final.summons[0]? final.summons[0] : ""}${final.summonsTrans[0] > 0? "|transmain=" + final.summonsTrans[0] : ""}${final.summonsImg[0]? "|artmain=" + final.summonsImg[0] : ""}
|support=${final.summons[5]? final.summons[5] : suppS}${final.summonsTrans[5]? "|transsupport=" + final.summonsTrans[5] : ""}${final.summonsImg[5]? "|artsupport=" + final.summonsImg[5] : ""}
}}
|weapons={{WeaponGridSkills
${getWeapons()}
${`${final.weaponKeys.opus.length>0? `|opus=${final.weaponKeys.opus.join(",")}` : ""}
${final.weaponKeys.ultima.length>0? `|ultima=${final.weaponKeys.ultima.join(",")}` : ""}
${final.weaponKeys.draconic.length>0? `|draconic=${final.weaponKeys.draconic.join(",")}` : ""}
${final.weaponKeys.ccw? `|ccw=${final.weaponKeys.ccw}` : ""}`.split("\n").filter(s=>s.length>0).join("\n")}
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
    let wep = `|wp${index}=${final.weapons[index]}|u${index}=${final.weaponsUncaps[index]}${final.weaponAwakens[index]? `|awk${index}=${final.weaponAwakens[index]}` : ""}`
    if (index == 0) wep = wep.replace("wp0", "mh").replace("u0", "umh").replace("awk0", "awkmh");
    return wep;
};
const getSummon = (index) => {
    if (final.summons[index] == null) return "";
    let sum = `${final.summons[index]}|u${index}=${final.summonsTrans[index] <= 0? `${final.summonsUncap[index]}` : `trans${final.summonsTrans[index]}`}`;
    if (index == 0) sum = sum.replace("u0", "umain").replace("art0", "artmain");
    if (index == 6) sum = sum.replace("u6", "usub1").replace("art6", "artsub1");
    if (index == 7) sum = sum.replace("u7", "usub2").replace("art7", "artsub2");
    return sum;
};

//copy to clipboard
(function (text) {
    var textarea = document.createElement("textarea");
    textarea.textContent = text;
    textarea.style.position = "fixed";
    textarea.style.width = '2em';
    textarea.style.height = '2em';
    textarea.style.padding = 0;
    textarea.style.border = 'none';
    textarea.style.outline = 'none';
    textarea.style.boxShadow = 'none';
    textarea.style.background = 'transparent';
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
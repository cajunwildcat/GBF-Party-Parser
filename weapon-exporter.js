javascript: (async function () {
const final = {
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
const specialWepSeries = [
    "3",   //opus
    "13",  //ultima
    "17",  //superlative
    "19",  //ccw
    "27",  //draconic
    "40",  //draconic providence
];
const keyMap = { /*ultima 1*/ "Dominion": "will", "Parity": "strife", "Utopia": "vitality", "Plenum": "strength", "Ultio": "zeal", "Ars": "courage", /*ultima 2*/ "Aggressio": "auto", "Facultas": "skill", "Arcanum": "ougi", "Catena": "cb", /*ultima 3*/ "Fortis": "cap", "Sanatio": "healing", "Impetus": "seraphic", "Elatio": "cbgain", /*dopus 2*/ "α": "auto", "β": "skill", "γ": "ougi", "Δ": "cb", /*dopus 3*/ "Fruit": "apple", "Conduct": "depravity ", "Fallacy": "echo", /*draconic 2*/ "True": "def", "Vermillion": "fire", "Azure": "water", "Golden": "earth", "Emerald": "wind", "White": "light", "Black": "dark" };
const elements = ["Fire", "Water", "Earth", "Wind", "Light", "Dark"];
const uncaps = [40,60,80,100,150,200];
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
                if (e.param.level == 200) final.weapons[final.weapons.length-1] += ` (${elements[e.master.attribute-1]})`;
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
const getWeapons = () => {
    return final.weapons.map((w,i)=>getWeapon(i)).filter(q=>q.length>0).join("\n");
};
const getWeapon = (index) => {
    if (final.weapons[index] == null) return "";
    let wep = `|wp${index}=${final.weapons[index]}|u${index}=${final.weaponsUncaps[index]}${final.weaponAwakens[index]? `|awk${index}=${final.weaponAwakens[index]}` : ""}`
    if (index == 0) wep = wep.replace("wp0", "mh").replace("u0", "umh").replace("awk0", "awkmh");
    return wep;
};
const wikiTable = () => `|weapons2={{WeaponGridSkills
${getWeapons()}
${`${final.weaponKeys.opus.length>0? `|opus=${final.weaponKeys.opus.join(",")}` : ""}
${final.weaponKeys.ultima.length>0? `|ultima=${final.weaponKeys.ultima.join(",")}` : ""}
${final.weaponKeys.draconic.length>0? `|draconic=${final.weaponKeys.draconic.join(",")}` : ""}
${final.weaponKeys.ccw? `|ccw=${final.weaponKeys.ccw}` : ""}`.split("\n").filter(s=>s.length>0).join("\n")}
}}`;

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
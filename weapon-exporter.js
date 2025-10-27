javascript: (async function () {
    let weapons;
    await fetch("https://raw.githubusercontent.com/cajunwildcat/The-GrandCypher/main/weapons-min.json", { next: 43200 })
        .then(function (response) { return response.json(); })
        .then((response) => weapons = response);

    const final = {
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
    const specialWepSeries = [
        "3",   //opus
        "13",  //ultima
        "17",  //superlative
        "19",  //ccw
        "27",  //draconic
        "40",  //draconic providence
        "44",  //destroyer
    ];
    const auxilaryWeaponClasses = ["Gladiator", "Chrysaor", "Iatromantis", "Street King", "Viking"];
    const keyMap = { /*ultima 1*/ "Dominion": "will", "Parity": "strife", "Utopia": "vitality", "Plenum": "strength", "Ultio": "zeal", "Ars": "courage", /*ultima 2*/ "Aggressio": "auto", "Facultas": "skill", "Arcanum": "ougi", "Catena": "cb", /*ultima 3*/ "Fortis": "cap", "Sanatio": "healing", "Impetus": "seraphic", "Elatio": "cbgain", /*dopus 2*/ "α": "auto", "β": "skill", "γ": "ougi", "Δ": "cb", /*dopus 3*/ "Fruit": "apple", "Conduct": "depravity ", "Fallacy": "echo", /*draconic 2*/ "True": "def", "Vermillion": "fire", "Azure": "water", "Golden": "earth", "Emerald": "wind", "White": "light", "Black": "dark" };
    const elements = ["Fire", "Water", "Earth", "Wind", "Light", "Dark"];
    const uncaps = [40, 60, 80, 100, 150, 200];
    const transcendences = [200, 210, 220, 230, 240];
    Object.values(window.Game.view.deck_model.attributes.deck.pc.weapons).forEach((e, i) => {
        final.weapons.push(e.master ? e.master.name.trim() : null);
        final.weaponsUncap.push(e.param ? (function () {
            let uncap = 0;
            const lvl = e.param.level;
            uncaps.forEach(u => lvl > u ? uncap++ : null);
            if (uncap > 5) {
                let trans = 0;
                transcendences.forEach(t => lvl > t ? trans++ : null);
                return `t${trans}`;
            }
            return uncap;
        })() : 0);
        final.weaponsMaxUncap.push(e.master ? weapons[parseInt(e.master.id)].maxUncap : null);
        final.weaponsAwaken.push(e.param ? e.param.arousal["form_name"] : null);
        if (e.master && specialWepSeries.includes(e.master["series_id"])) {
            switch (e.master["series_id"]) {
                //opus - s2 first word, s3 last word unless II or III, then word before
                case "3":
                    if (e.skill2) final.weaponsKeys.opus.push(keyMap[e.skill2.name.trim().split(" ")[0]]);
                    if (e.skill3) {
                        let fullName = e.skill3.name.trim().split(" ");
                        let skill = (fullName[fullName.length - 1] == "II" || fullName[fullName.length - 1] == "III") ? fullName[fullName.length - 2] : fullName.pop();
                        final.weaponsKeys.opus.push(keyMap[skill] ? keyMap[skill] : skill);
                    }
                    break;
                //ultima - last word
                case "13":
                    if (i == 0 || (i == 1 && auxilaryWeaponClasses.includes(window.Game.view.deck_model.attributes.deck.pc.job.master.name))) final.weapons[final.weapons.length - 1] += ` (${elements[e.master.attribute - 1]})`;
                    if (e.skill1) final.weaponsKeys.ultima.push(keyMap[e.skill1.name.trim().split(" ").pop()]);
                    if (e.skill2) final.weaponsKeys.ultima.push(keyMap[e.skill2.name.trim().split(" ").pop()]);
                    if (e.skill3) final.weaponsKeys.ultima.push(keyMap[e.skill3.name.trim().split(" ").pop()]);
                    break;
                case "17":
                    //superlative - only for element
                    final.weapons[final.weapons.length - 1] += ` (${elements[e.master.attribute - 1]})`;
                    break;
                //ccw - last word
                case "19":
                    if (e.param.level == 200) final.weapons[final.weapons.length - 1] += ` (${elements[e.master.attribute - 1]})`;
                    if (e.skill2 && ["Humanity", "Divinity", "Devilry"].some(s=>e.skill2.name.includes(s))) final.weaponsKeys.ccw = e.skill2.name.trim().split(" ").pop();
                    break;
                //draconic
                case "27":
                case "40":
                    if (e.skill2) {
                        let fullName = e.skill2.name.trim().split(" ");
                        let skill = (fullName[fullName.length - 1] === "Barrier") ? keyMap[fullName[0]] : fullName.pop();
                        final.weaponsKeys.draconic.push(skill);
                    }
                    if (e.skill3) e.skill3.name.trim().split(" ").pop() === "III" ? final.weaponsKeys.draconic.push("magna") : final.weaponsKeys.draconic.push("primal");
                    break;
                //destroyer
                case "44":
                    if (e.skill3) e.skill3.name.trim().split(" ")[1] === "Godstrike"? final.weaponsKeys.destroyer.push("auto") : (e.skill3.name.trim().split(" ")[1] === "Godflair"? final.weaponsKeys.destroyer.push("skill") : final.weaponsKeys.destroyer.push("ougi"));
                break;
            }
        }
    });
    const getWeapons = () => {
        return final.weapons.map((w, i) => getWeapon(i)).filter(q => q.length > 0).join("\n");
    };
    const getWeapon = (index) => {
        if (final.weapons[index] == null) return "";
        let uncap = ((final.weaponsMaxUncap[index] != 6 && final.weaponsUncap[index] == final.weaponsMaxUncap[index]) || ((final.weapons[index].includes("Renunciation") || final.weapons[index].includes("Repudiation")) && final.weaponsUncap[index] == 5))? "" :
            `|u${index}=${final.weaponsUncap[index]}`;
        let wep = `|wp${index}=${final.weapons[index]}${uncap}${final.weaponsAwaken[index] ? `|awk${index}=${final.weaponsAwaken[index]}` : ""}`
        if (index == 0) wep = wep.replace("wp0", "mh").replace("u0", "umh").replace("awk0", "awkmh");
        return wep;
    };
    const wikiTable = () => `|weapons2={{WeaponGridSkills
${getWeapons()}
${`${final.weaponsKeys.opus.length > 0 ? `|opus=${final.weaponsKeys.opus.join(",")}` : ""}
${final.weaponsKeys.ultima.length > 0 ? `|ultima=${final.weaponsKeys.ultima.join(",")}` : ""}
${final.weaponsKeys.draconic.length > 0 ? `|draconic=${final.weaponsKeys.draconic.join(",")}` : ""}
${final.weaponsKeys.destroyer.length > 0 ? `|draconic=${final.weaponsKeys.destroyer.join(",")}` : ""}
${final.weaponsKeys.ccw ? `|ccw=${final.weaponsKeys.ccw}` : ""}`.split("\n").filter(s => s.length > 0).join("\n")}
}}`;

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
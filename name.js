/* SETUP */
let diSeg = ["ar","as","at","ed","en","er","es","ha","he","hi","in","it","nd","on","or","ou","re","te","th","to","ve","ng","is","st","le","al","ti","se","ea","wa","me","nt","nw"];
let triSeg = ["the","and","ing","her","you","ver","was","hat","for","not","thi","tha","his","ent","ion","ith","ere","wit","all","eve","oul","uld","tio","ter","had","hen","era","are","hin","our","sho","ted","ome","but"];

//diSeg = ["av","aw","vm","wv","xv","yv","wn","en","we","vu","ve","wi","iv","yo"];
//triSeg = ["awm","vym","xuv","zuv","vwu","muv","yzu","oye","yoe","ayu"]

/* OPTIONS (edit values here) */
// good value: 5/20/5/10000
let len = 5; // amount of segments per name
let n = 14; // amount of players
let perSeg = 5; // amount of players each segment should be assigned to
let attempts = 1000; // amount of attempts to run, the attempt with the lowest amount of "forced" operations is selected. Forced operations happen when no option of combining segments is available that fits the rules

/* CODE (do not edit) */
// perm values
let vowels = "aeiou";
let reqSeg = (n * len) / perSeg;
let diCount = Math.floor((reqSeg / 3) * 2);
let triCount = Math.ceil((reqSeg / 3) * 1);

let attemptList = [];
for(let at = 0; at < attempts; at++) {
    let di = shuffleArray(diSeg);
    let tri = shuffleArray(triSeg);
    di.splice(0, di.length - diCount);
    tri.splice(0, tri.length - triCount);
    let players = [];
    let diAll = JSON.parse(JSON.stringify(di));
    let triAll = JSON.parse(JSON.stringify(tri));
    let perSegX = perSeg;
    while(perSegX > 1) {
        perSegX--;
        diAll.push(...di);
        triAll.push(...tri);
    }
    //console.log(diAll, triAll);
    
    let iterationForced = 0;
    let iterationRejected = 0;
    for(let i = 0; i < n; i++) {
        let p = "";
        let pSeg = [];
        let totalRejections = 0;
        let totalForced = 0;
        for(let j = 0; j < len; j++) {
            let ran = 0;
            let x = "";
            let it = 0;
            do {
                it++;
                if(x != "") {
                    totalRejections++;
                    //console.log("rejected: " + x);
                    if(x.length == 2) diAll.push(x);
                    else triAll.push(x);
                }
                ran = Math.floor(Math.random() * (diAll.length + triAll.length));
                if(ran < diAll.length) {
                    x = diAll[ran];
                    diAll.splice(ran, 1);
                } else {
                    x = triAll[ran - diAll.length];
                    triAll.splice(ran - diAll.length, 1);
                }
                //console.log("trying: " + x);
                if(!x) {
                    console.log("undefined");
                    console.log(diAll, triAll);
                }
                if(it >= 50) {
                    totalForced++;
                    //console.log("FORCED");
                }
            } while(((vowels.indexOf(p[p.length-1]) == -1 && vowels.indexOf(x[0]) == -1) || (vowels.indexOf(p[p.length-1]) != -1 && vowels.indexOf(x[0]) != -1) || pSeg.includes(x)) && it < 50)
            p += x;
            pSeg.push(x);
            //console.log("segment found: " + x);
            iterationForced += totalForced;
            iterationRejected += totalRejections;
        }
        
        let plen = p.length;
        plen = Math.min(Math.max(Math.random(), 0.3), 0.7) * plen;
        p = [p.substr(0, plen), p.substr(plen)].map(el => el.substr(0,1).toUpperCase() + el.substr(1)).join(" ");
        players.push({name: p, raw: pSeg, rej: totalRejections, force: totalForced});
    
    
    }
    //console.log(...di,...tri);
    //console.log(players);
    attemptList.push({names: players, rej: iterationRejected, force: iterationForced, segs: [...di,...tri]});
}

// util
function shuffleArray(arr) {
  return JSON.parse(JSON.stringify(arr)).sort(() => Math.random() - 0.5);
}

// select result
let selAt = attemptList.sort((a,b) => a.force - b.force)[0];

// output result
selAt.names.forEach(pl => console.log(pl.raw.join("") + " => " + pl.name + " [" + pl.rej + ", " + pl.force + "]"));
selAt.segs.forEach(seg => console.log(seg + ": " + selAt.names.filter(el => el.raw.indexOf(seg) >= 0).map(el=>{let ind = el.name.indexOf(" "); let formatted = el.raw.map(el2=>el2==seg?seg.toUpperCase():el2.toLowerCase()).join(""); return formatted.substr(0, ind) + " " + formatted.substr(ind)}).join(", ")));

/*
Output:
raw player name => formatted player name [rejected combination attempts, forced combination attempts]
segment: list of names with that segment
*/

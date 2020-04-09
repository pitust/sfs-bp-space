
let blueprint = document.querySelector('#personaDiv');
let parts = {
    'Aerodynamics': {
        'Small Aerodynamic Fueslage': {
            bpName: 'Side Cone',
            file: 'Aerodynamics/Aerodynamic_fuselage_1.png',
            size: [2, 6],
            tl: false
        },
        'Big Aerodynamic Fueslage': {
            bpName: 'Side Cone Big',
            file: 'Aerodynamics/Aerodynamic_fuselage_2.png',
            size: [3, 8],
            tl: false
        },
        'Fairing Cone': {
            bpName: 'Top Fairing',
            file: 'Aerodynamics/Fairing_1.png',
            size: [4, 3],
            tl: false
        },
        'Fairing': {
            bpName: '4w Fairing',
            file: 'Aerodynamics/Fairing_2.png',
            size: [4, 3],
            tl: false
        },
        'Nose Cone': {
            bpName: 'Cone',
            file: 'Aerodynamics/Nose_cone_1.png',
            size: [4, 5],
            tl: false
        },
        'Side Cone': {
            bpName: 'SideSide',
            file: 'Aerodynamics/Nose_cone_2.png',
            size: [4, 5]
        },
        'Big Cone': {
            bpName: 'Big Side',
            file: 'Aerodynamics/Nose_cone_3.png',
            size: [6, 7],
            tl: false
        }
    },
    'Batteries': {
        'Small Battery': {
            bpName: 'Battery 2x1',
            file: 'Batteries/Battery_2w.png',
            size: [2, 1],
            tl: false
        },
        'Medium Battery': {
            bpName: 'Battery 4x1',
            file: 'Batteries/Battery_4w.png',
            size: [4, 1],
            tl: false
        },
        'Large Battery': {
            bpName: 'Battery 6x1',
            file: 'Batteries/Battery_6w.png',
            size: [6, 1],
            tl: false
        },
    },
    'Docking Ports': {
        'Small Docking Port': {
            bpName: 'Port 2x1',
            file: 'Docking ports/2w.png',
            size: [2, 1],
            tl: true
        },
        'Medium Docking Port': {
            bpName: 'Port 4x1',
            file: 'Docking ports/4w.png',
            size: [4, 1],
            tl: true
        },
        'Large Docking Port': {
            bpName: 'Port 6x1',
            file: 'Docking ports/6w.png',
            size: [6, 1],
            tl: true
        },
    }
}
let swtbl = {};
for (let k of Object.keys(parts)) {
    for (let o of Object.keys(parts[k])) {
        swtbl[k + '/' + o] = o;
    }
}
let els = [];
function createBP() {
    console.log(JSON.stringify({
        "cameraPosition": {
            "x": 5,
            "y": 25,
            "z": -10.5
        },
        saveName: "",
        parts: els.filter(e => e.stillIn()).map(e => {
            return {
                partName: e.type,
                position: {
                    x: e.getPos()[0] / -2,
                    y: e.getPos()[1] / -2 + (e.hy / -2)
                },
                orientation: {
                    "x": 1,
                    "y": 1,
                    "z": 0
                },
                "skinId": 0
            }
        })
    }));
}
function summonPart(x) {
    let [grp, sub] = x.split('/');
    let a = document.createElement('img');
    let p = parts[grp][sub];
    a.src = 'assets/' + p.file;
    a.style.width = (p.size[0] * 20) + 'px';
    a.style.height = (p.size[1] * 20) + 'px';
    a.style.position = 'absolute';
    let sic = true;
    let objx = 0, objy = 0, d = false, objOffx = 0, objOffy = 0;
    els.push({
        stillIn() {
            return sic;
        },
        type: p.bpName,
        getPos() {
            return [objx, objy];
        },
        hy: p.tl ? 0 : p.size[1]
    })
    a.onmousedown = function (ev) {
        objOffx = ev.pageX - (objx * 20) - 3;
        objOffy = ev.pageY - (objy * 20) - 3;
        d = !0;
        if (pe) {
            pe.obj.style.border = '3px solid transparent';
        }
        pe = {
            obj: a,
            rm() {
                a.remove();
                sic = false;
            }
        };
        a.style.border = '3px solid lime';
    }
    a.onmouseup = function () {
        objx = Math.round(objx);
        objy = Math.round(objy);
        a.style.left = ((objx * 20) - 3) + 'px';
        a.style.top = ((objy * 20) - 3) + 'px';
        d = !1;
    }
    a.onmousemove = function (ev) {
        if (!d) return;
        let realx = ev.pageX - objOffx;
        let realy = ev.pageY - objOffy;
        realx /= 20;
        realy /= 20;
        a.style.left = ((realx * 20)) + 'px';
        a.style.top = ((realy * 20)) + 'px';
        objx = realx;
        objy = realy;
    }
    a.ondragstart = function (ev) {
        ev.preventDefault();
        return false;
    }
    blueprint.appendChild(a);
}
function plus() {
    Swal.fire({
        title: 'Select Part',
        input: 'select',
        inputOptions: swtbl,
        inputPlaceholder: 'required',
        showCancelButton: true
    }).then(function (result) {
        if (result.value) {
            summonPart(result.value);
        }
    });
}
let o = document.querySelector('#options');
let pe = null;
let actions = [
    plus
]
for (let che of o.children) {
    che.onclick = actions.shift();
}
document.body.onkeydown = function (ev) {
    if (ev.code == 'Backspace') {
        pe.rm();
    }
}
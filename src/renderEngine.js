console.log("************************************************");

function stroke(ptlist, args) {
  var args = args != undefined ? args : {};
  var xof = args.xof != undefined ? args.xof : 0;
  var yof = args.yof != undefined ? args.yof : 0;
  var wid = args.wid != undefined ? args.wid : 2;
  var col = args.col != undefined ? args.col : "rgba(200,200,200,0.9)";
  var noi = args.noi != undefined ? args.noi : 0.5;
  var out = args.out != undefined ? args.out : 1;
  var fun =
    args.fun != undefined
      ? args.fun
      : function (x) {
          return Math.sin(x * Math.PI);
        };

  if (ptlist.length == 0) {
    return "";
  }
  vtxlist0 = [];
  vtxlist1 = [];
  vtxlist = [];
  var n0 = Math.random() * 10;
  for (var i = 1; i < ptlist.length - 1; i++) {
    var w = wid * fun(i / ptlist.length);
    w = w * (1 - noi) + w * noi * Noise.noise(i * 0.5, n0);
    var a1 = Math.atan2(
      ptlist[i][1] - ptlist[i - 1][1],
      ptlist[i][0] - ptlist[i - 1][0]
    );
    var a2 = Math.atan2(
      ptlist[i][1] - ptlist[i + 1][1],
      ptlist[i][0] - ptlist[i + 1][0]
    );
    var a = (a1 + a2) / 2;
    if (a < a2) {
      a += Math.PI;
    }
    vtxlist0.push([
      ptlist[i][0] + w * Math.cos(a),
      ptlist[i][1] + w * Math.sin(a),
    ]);
    vtxlist1.push([
      ptlist[i][0] - w * Math.cos(a),
      ptlist[i][1] - w * Math.sin(a),
    ]);
  }

  vtxlist = [ptlist[0]]
    .concat(
      vtxlist0.concat(vtxlist1.concat([ptlist[ptlist.length - 1]]).reverse())
    )
    .concat([ptlist[0]]);

  var canv = poly(
    vtxlist.map(function (x) {
      return [x[0] + xof, x[1] + yof];
    }),
    { fil: col, str: col, wid: out }
  );
  return canv;
}

function blob(x, y, args) {
  var args = args != undefined ? args : {};
  var len = args.len != undefined ? args.len : 20;
  var wid = args.wid != undefined ? args.wid : 5;
  var ang = args.ang != undefined ? args.ang : 0;
  var col = args.col != undefined ? args.col : "rgba(200,200,200,0.9)";
  var noi = args.noi != undefined ? args.noi : 0.5;
  var ret = args.ret != undefined ? args.ret : 0;
  var fun =
    args.fun != undefined
      ? args.fun
      : function (x) {
          return x <= 1
            ? Math.pow(Math.sin(x * Math.PI), 0.5)
            : -Math.pow(Math.sin((x + 1) * Math.PI), 0.5);
        };

  var reso = 20.0;
  var lalist = [];
  for (var i = 0; i < reso + 1; i++) {
    var p = (i / reso) * 2;
    var xo = len / 2 - Math.abs(p - 1) * len;
    var yo = (fun(p) * wid) / 2;
    var a = Math.atan2(yo, xo);
    var l = Math.sqrt(xo * xo + yo * yo);
    lalist.push([l, a]);
  }
  var nslist = [];
  var n0 = Math.random() * 10;
  for (var i = 0; i < reso + 1; i++) {
    nslist.push(Noise.noise(i * 0.05, n0));
  }

  loopNoise(nslist);
  var plist = [];
  for (var i = 0; i < lalist.length; i++) {
    var ns = nslist[i] * noi + (1 - noi);
    var nx = x + Math.cos(lalist[i][1] + ang) * lalist[i][0] * ns;
    var ny = y + Math.sin(lalist[i][1] + ang) * lalist[i][0] * ns;
    plist.push([nx, ny]);
  }

  if (ret == 0) {
    return poly(plist, { fil: col, str: col, wid: 0 });
  } else {
    return plist;
  }
}

function div(plist, reso) {
  var tl = (plist.length - 1) * reso;
  var lx = 0;
  var ly = 0;
  var rlist = [];

  for (var i = 0; i < tl; i += 1) {
    var lastp = plist[Math.floor(i / reso)];
    var nextp = plist[Math.ceil(i / reso)];
    var p = (i % reso) / reso;
    var nx = lastp[0] * (1 - p) + nextp[0] * p;
    var ny = lastp[1] * (1 - p) + nextp[1] * p;

    var ang = Math.atan2(ny - ly, nx - lx);

    rlist.push([nx, ny]);
    lx = nx;
    ly = ny;
  }

  if (plist.length > 0) {
    rlist.push(plist[plist.length - 1]);
  }
  return rlist;
}

var texture = function (ptlist, args) {
  var args = args != undefined ? args : {};
  var xof = args.xof != undefined ? args.xof : 0;
  var yof = args.yof != undefined ? args.yof : 0;
  var tex = args.tex != undefined ? args.tex : 400;
  var wid = args.wid != undefined ? args.wid : 1.5;
  var len = args.len != undefined ? args.len : 0.2;
  var sha = args.sha != undefined ? args.sha : 0;
  var ret = args.ret != undefined ? args.ret : 0;
  var noi =
    args.noi != undefined
      ? args.noi
      : function (x) {
          return 30 / x;
        };
  var col =
    args.col != undefined
      ? args.col
      : function (x) {
          return "rgba(100,100,100," + (Math.random() * 0.3).toFixed(3) + ")";
        };
  var dis =
    args.dis != undefined
      ? args.dis
      : function () {
          if (Math.random() > 0.5) {
            return (1 / 3) * Math.random();
          } else {
            return (1 * 2) / 3 + (1 / 3) * Math.random();
          }
        };
  var reso = [ptlist.length, ptlist[0].length];
  var texlist = [];
  for (var i = 0; i < tex; i++) {
    var mid = (dis() * reso[1]) | 0;
    //mid = (reso[1]/3+reso[1]/3*Math.random())|0

    var hlen = Math.floor(Math.random() * (reso[1] * len));

    var start = mid - hlen;
    var end = mid + hlen;
    start = Math.min(Math.max(start, 0), reso[1]);
    end = Math.min(Math.max(end, 0), reso[1]);

    var layer = (i / tex) * (reso[0] - 1);

    texlist.push([]);
    for (var j = start; j < end; j++) {
      var p = layer - Math.floor(layer);

      var x =
        ptlist[Math.floor(layer)][j][0] * p +
        ptlist[Math.ceil(layer)][j][0] * (1 - p);

      var y =
        ptlist[Math.floor(layer)][j][1] * p +
        ptlist[Math.ceil(layer)][j][1] * (1 - p);

      var ns = [
        noi(layer + 1) * (Noise.noise(x, j * 0.5) - 0.5),
        noi(layer + 1) * (Noise.noise(y, j * 0.5) - 0.5),
      ];

      texlist[texlist.length - 1].push([x + ns[0], y + ns[1]]);
    }
  }
  var canv = "";
  //SHADE
  if (sha) {
    for (var j = 0; j < texlist.length; j += 1 + (sha != 0)) {
      canv += stroke(
        texlist[j].map(function (x) {
          return [x[0] + xof, x[1] + yof];
        }),
        { col: "rgba(100,100,100,0.1)", wid: sha }
      );
    }
  }
  //TEXTURE
  for (var j = 0 + sha; j < texlist.length; j += 1 + sha) {
    canv += stroke(
      texlist[j].map(function (x) {
        return [x[0] + xof, x[1] + yof];
      }),
      { col: col(j / texlist.length), wid: wid }
    );
  }
  return ret ? texlist : canv;
};

function water(xoff, yoff, seed, args) {
  var args = args != undefined ? args : {};
  var hei = args.hei != undefined ? args.hei : 2;
  var len = args.len != undefined ? args.len : 800;
  var clu = args.clu != undefined ? args.clu : 10;
  var canv = "";

  var ptlist = [];
  var yk = 0;
  for (var i = 0; i < clu; i++) {
    ptlist.push([]);
    var xk = (Math.random() - 0.5) * (len / 8);
    yk += Math.random() * 5;
    var lk = len / 4 + Math.random() * (len / 4);
    var reso = 5;
    for (var j = -lk; j < lk; j += reso) {
      ptlist[ptlist.length - 1].push([
        j + xk,
        Math.sin(j * 0.2) * hei * Noise.noise(j * 0.1) - 20 + yk,
      ]);
    }
  }

  for (var j = 1; j < ptlist.length; j += 1) {
    canv += stroke(
      ptlist[j].map(function (x) {
        return [x[0] + xoff, x[1] + yoff];
      }),
      {
        col: "rgba(100,100,100," + (0.3 + Math.random() * 0.3).toFixed(3) + ")",
        wid: 1,
      }
    );
  }

  return canv;
}

function mountplanner(xmin, xmax) {
  function locmax(x, y, f, r) {
    var z0 = f(x, y);
    if (z0 <= 0.3) {
      return false;
    }
    for (var i = x - r; i < x + r; i++) {
      for (var j = y - r; j < y + r; j++) {
        if (f(i, j) > z0) {
          return false;
        }
      }
    }
    return true;
  }

  function chadd(r, mind) {
    mind = mind == undefined ? 10 : mind;
    for (var k = 0; k < reg.length; k++) {
      if (Math.abs(reg[k].x - r.x) < mind) {
        return false;
      }
    }
    console.log("+");
    reg.push(r);
    return true;
  }

  var reg = [];
  var samp = 0.03;
  var ns = function (x, y) {
    return Math.max(Noise.noise(x * samp) - 0.55, 0) * 2;
  };
  var nns = function (x) {
    return 1 - Noise.noise(x * samp);
  };
  var nnns = function (x, y) {
    return Math.max(Noise.noise(x * samp * 2, 2) - 0.55, 0) * 2;
  };
  var yr = function (x) {
    return Noise.noise(x * 0.01, Math.PI);
  };

  var xstep = 5;
  var mwid = 200;
  for (var i = xmin; i < xmax; i += xstep) {
    var i1 = Math.floor(i / xstep);
    MEM.planmtx[i1] = MEM.planmtx[i1] || 0;
  }

  for (var i = xmin; i < xmax; i += xstep) {
    for (var j = 0; j < yr(i) * 480; j += 30) {
      if (locmax(i, j, ns, 2)) {
        var xof = i + 2 * (Math.random() - 0.5) * 500;
        var yof = j + 300;
        var r = { tag: "mount", x: xof, y: yof, h: ns(i, j) };
        var res = chadd(r);
        if (res) {
          for (
            var k = Math.floor((xof - mwid) / xstep);
            k < (xof + mwid) / xstep;
            k++
          ) {
            MEM.planmtx[k] += 1;
          }
        }
      }
    }
    if (Math.abs(i) % 1000 < Math.max(1, xstep - 1)) {
      var r = {
        tag: "distmount",
        x: i,
        y: 280 - Math.random() * 50,
        h: ns(i, j),
      };
      chadd(r);
    }
  }
  console.log([xmin, xmax]);
  for (var i = xmin; i < xmax; i += xstep) {
    if (MEM.planmtx[Math.floor(i / xstep)] == 0) {
      //var r = {tag:"redcirc",x:i,y:700}
      //console.log(i)
      if (Math.random() < 0.01) {
        for (var j = 0; j < 4 * Math.random(); j++) {
          var r = {
            tag: "flatmount",
            x: i + 2 * (Math.random() - 0.5) * 700,
            y: 700 - j * 50,
            h: ns(i, j),
          };
          chadd(r);
        }
      }
    } else {
      // var r = {tag:"greencirc",x:i,y:700}
      // chadd(r)
    }
  }

  for (var i = xmin; i < xmax; i += xstep) {
    if (Math.random() < 0.2) {
      var r = { tag: "boat", x: i, y: 300 + Math.random() * 390 };
      chadd(r, 400);
    }
  }

  return reg;
}

MEM = {
  canv: "",
  chunks: [],
  xmin: 0,
  xmax: 0,
  cwid: 512,
  cursx: 0,
  lasttick: 0,
  windx: 3000,
  windy: 800,
  planmtx: [],
};

function dummyloader(xmin, xmax) {
  for (var i = xmin; i < xmax; i += 200) {
    //MEM.chunks.push({tag:"?",x:i,y:100,canv:Tree.tree08(i,500,i)})
    //MEM.chunks.push({tag:"?",x:i,y:100,canv:Man.man(i,500)})
    //MEM.chunks.push({tag:"?",x:i,y:100,canv:Arch.arch01(i,500)})
    //MEM.chunks.push({tag:"?",x:i,y:100,canv:Arch.boat01(i,500)})
    //MEM.chunks.push({tag:"?",x:i,y:100,canv:Arch.transmissionTower01(i,500)})
    MEM.chunks.push({
      tag: "?",
      x: i,
      y: 100,
      canv: Arch.arch02(i, 500, 0, { sto: 1, rot: Math.random() }),
    });
  }
}

function chunkloader(xmin, xmax) {
  var add = function (nch) {
    if (nch.canv.includes("NaN")) {
      console.log("gotcha:");
      console.log(nch.tag);
      nch.canv = nch.canv.replace(/NaN/g, -1000);
    }
    if (MEM.chunks.length == 0) {
      MEM.chunks.push(nch);
      return;
    } else {
      if (nch.y <= MEM.chunks[0].y) {
        MEM.chunks.unshift(nch);
        return;
      } else if (nch.y >= MEM.chunks[MEM.chunks.length - 1].y) {
        MEM.chunks.push(nch);
        return;
      } else {
        for (var j = 0; j < MEM.chunks.length - 1; j++) {
          if (MEM.chunks[j].y <= nch.y && nch.y <= MEM.chunks[j + 1].y) {
            MEM.chunks.splice(j + 1, 0, nch);
            return;
          }
        }
      }
    }
    console.log("EH?WTF!");
    console.log(MEM.chunks);
    console.log(nch);
  };

  while (xmax > MEM.xmax - MEM.cwid || xmin < MEM.xmin + MEM.cwid) {
    console.log("generating new chunk...");

    var plan;
    if (xmax > MEM.xmax - MEM.cwid) {
      plan = mountplanner(MEM.xmax, MEM.xmax + MEM.cwid);
      MEM.xmax = MEM.xmax + MEM.cwid;
    } else {
      plan = mountplanner(MEM.xmin - MEM.cwid, MEM.xmin);
      MEM.xmin = MEM.xmin - MEM.cwid;
    }

    for (var i = 0; i < plan.length; i++) {
      if (plan[i].tag == "mount") {
        add({
          tag: plan[i].tag,
          x: plan[i].x,
          y: plan[i].y,
          canv: Mount.mountain(plan[i].x, plan[i].y, i * 2 * Math.random()),
          //{col:function(x){return "rgba(100,100,100,"+(0.5*Math.random()*plan[i].y/MEM.windy)+")"}}),
        });
        add({
          tag: plan[i].tag,
          x: plan[i].x,
          y: plan[i].y - 10000,
          canv: water(plan[i].x, plan[i].y, i * 2),
        });
      } else if (plan[i].tag == "flatmount") {
        add({
          tag: plan[i].tag,
          x: plan[i].x,
          y: plan[i].y,
          canv: Mount.flatMount(
            plan[i].x,
            plan[i].y,
            2 * Math.random() * Math.PI,
            {
              wid: 600 + Math.random() * 400,
              hei: 100,
              cho: 0.5 + Math.random() * 0.2,
            }
          ),
        });
      } else if (plan[i].tag == "distmount") {
        add({
          tag: plan[i].tag,
          x: plan[i].x,
          y: plan[i].y,
          canv: Mount.distMount(plan[i].x, plan[i].y, Math.random() * 100, {
            hei: 150,
            len: randChoice([500, 1000, 1500]),
          }),
        });
      } else if (plan[i].tag == "boat") {
        add({
          tag: plan[i].tag,
          x: plan[i].x,
          y: plan[i].y,
          canv: Arch.boat01(plan[i].x, plan[i].y, Math.random(), {
            sca: plan[i].y / 800,
            fli: randChoice([true, false]),
          }),
        });
      } else if (plan[i].tag == "redcirc") {
        add({
          tag: plan[i].tag,
          x: plan[i].x,
          y: plan[i].y,
          canv:
            "<circle cx='" +
            plan[i].x +
            "' cy='" +
            plan[i].y +
            "' r='20' stroke='black' fill='red' />",
        });
      } else if (plan[i].tag == "greencirc") {
        add({
          tag: plan[i].tag,
          x: plan[i].x,
          y: plan[i].y,
          canv:
            "<circle cx='" +
            plan[i].x +
            "' cy='" +
            plan[i].y +
            "' r='20' stroke='black' fill='green' />",
        });
      }
      // add ({
      //   x: plan[i].x,
      //   y: plan[i].y,
      //   canv:"<circle cx='"+plan[i].x+"' cy='"+plan[i].y+"' r='20' stroke='black' fill='red' />"
      // })
    }
  }
}

function chunkrender(xmin, xmax) {
  MEM.canv = "";

  for (var i = 0; i < MEM.chunks.length; i++) {
    if (
      xmin - MEM.cwid < MEM.chunks[i].x &&
      MEM.chunks[i].x < xmax + MEM.cwid
    ) {
      MEM.canv += MEM.chunks[i].canv;
    }
  }
}

document.addEventListener("mousemove", onMouseUpdate, false);
document.addEventListener("mouseenter", onMouseUpdate, false);
mouseX = 0;
mouseY = 0;
function onMouseUpdate(e) {
  mouseX = e.pageX;
  mouseY = e.pageY;
}

function calcViewBox() {
  var zoom = 1.142;
  return "" + MEM.cursx + " 0 " + MEM.windx / zoom + " " + MEM.windy / zoom;
}

function viewupdate() {
  try {
    document.getElementById("SVG").setAttribute("viewBox", calcViewBox());
  } catch (e) {
    console.log("not possible");
  }
  //setTimeout(viewupdate,100)
}

function needupdate() {
  return true;
  if (MEM.xmin < MEM.cursx && MEM.cursx < MEM.xmax - MEM.windx) {
    return false;
  }
  return true;
}

function update() {
  //console.log("update!")

  self.chunkloader(MEM.cursx, MEM.cursx + MEM.windx);
  self.chunkrender(MEM.cursx, MEM.cursx + MEM.windx);

  document.getElementById("BG").innerHTML =
    "<svg id='SVG' xmlns='http://www.w3.org/2000/svg' width='" +
    MEM.windx +
    "' height='" +
    MEM.windy +
    "' style='mix-blend-mode:multiply;'" +
    "viewBox = '" +
    calcViewBox() +
    "'" +
    "><g id='G' transform='translate(" +
    0 +
    ",0)'>" +
    MEM.canv +
    //+ "<circle cx='0' cy='0' r='50' stroke='black' fill='red' />"
    "</g></svg>";

  //setTimeout(update,1000);
}

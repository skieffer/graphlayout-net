
var ow3 = {};

ow3.largeGraphNumbers = [
    1, 3, 4, 5, 7, 8
];

ow3.p1 = {};
ow3.p1 = {
    barSVGWidth: 180,
    barSVGHeight: 169,
    barColours: ['#c5931e', '#8f9092', '#916528']
};

// Had to change the rect IDs to start with a letter.
//    sed -e "s/id=\"\([0-9]\+\)\"/id=\"node\1\"/" -i".bak" ?_r2.svg

ow3.resize = function() {
    var W0 = window.innerWidth;
    var H0 = window.innerHeight;
    for (var i = 2; i <= 3; i++) {
        for (var j in ow3.largeGraphNumbers) {
            var n = ow3.largeGraphNumbers[j];
            for (var k = 0; k < 2; k++) {
                var code = ['x', 'y'][k];
                var svgs = d3.select('#part'+i+'SVGRow-'+code+n).selectAll('svg');
                var numGraphs = svgs.size();
                var w1 = W0/numGraphs - 8;
                svgs.each(function (d, i) {
                    var svg = d3.select(this);
                    var w0 = parseInt(svg.attr('width'));
                    var h0 = parseInt(svg.attr('height'));
                    var sc = Math.min(1, w1/w0, H0/(3*h0));
                    var h1 = h0*sc;
                    w1 = w0*sc;
                    var gp = svg.select('#outerGroup');
                    var sc0 = gp.attr('transform');
                    if (sc0 === null) {
                        sc0 = 1;
                    } else {
                        sc0 = parseFloat(sc0.substring(6, sc0.length-1));
                    }
                    var sc1 = sc*sc0;
                    gp.attr('transform', 'scale('+sc1+')');
                    svg.attr('width', w1);
                    svg.attr('height', h1);
                    // Scale the bg rectangle too.
                    svg.select('rect').each(function (d, i) {
                        if (i > 0) return;
                        d3.select(this).attr('width', w1).attr('height', h1);
                    });
                });
                
                
            }
        }
    }
    
};

ow3.enlargedSVG = {};

ow3.enlarge = function(td) {
    if (ow3.enlargedSVG.svg != null) {
        ow3.shrinkSVG();
    } else {
        //var svg = d3.select(svg);
        var svg = d3.select(td).select('svg');
        svg.classed('overlay', true);
        var W0 = window.innerWidth, H0 = window.innerHeight;
        var w0 = parseInt(svg.attr('width'));
        var h0 = parseInt(svg.attr('height'));
        ow3.enlargedSVG.w0 = w0;
        ow3.enlargedSVG.h0 = h0;
        ow3.enlargedSVG.svg = svg;
        var xsc = W0/w0, ysc = H0/h0;
        var sc = Math.min(xsc, ysc);
        var w1 = sc*w0, h1 = sc*h0;
        var dx = (W0-w1)/2.0, dy = (H0-h1)/2.0;
        var gp = svg.select('#outerGroup');
        var sc0 = gp.attr('transform');
        if (sc0 === null) {
            sc0 = 1;
        } else {
            sc0 = parseFloat(sc0.substring(6, sc0.length-1));
        }
        ow3.enlargedSVG.sc0 = sc0;
        var sc1 = sc*sc0;
        gp.attr('transform', 'scale('+sc1+')');
        svg.attr('width', w1);
        svg.attr('height', h1);
        svg.select('rect').each(function (d, i) {
            if (i > 0) return;
            d3.select(this).attr('width', w1).attr('height', h1);
        });
    }
};

ow3.shrinkSVG = function() {
    var svg = ow3.enlargedSVG.svg;
    var gp = svg.select('#outerGroup');
    var w0 = ow3.enlargedSVG.w0;
    var h0 = ow3.enlargedSVG.h0;
    var sc0 = ow3.enlargedSVG.sc0;
    gp.attr('transform', 'scale('+sc0+')');
    svg.attr('width', w0);
    svg.attr('height', h0);
    svg.select('rect').each(function (d, i) {
        if (i > 0) return;
        d3.select(this).attr('width', w0).attr('height', h0);
    });
    ow3.enlargedSVG.svg = null;
    svg.classed('overlay', false);
};


$(function() {
    // Draw bar charts in Part 1.
    d3.json("part1.json", function (error, p) {
        var weights = p["WEIGHTS"];
        var layoutNames = ['NONO', 'yFiles', 'Human'];
        for (var n = 1; n <= 8; n++) {
            for (var j = 0; j < 3; j++) {
                var code = ['x', 'y', 'z'][j];
                /*
                var svg = d3.select('#part1Bars-'+code+n).append('svg')
                            .attr('width', ow3.p1.barSVGWidth)
                            .attr('height', ow3.p1.barSVGHeight);
                */
                var aRankings = p['results'][''+n][code]['rankings'];
                var aNextWon  = p['results'][''+n][code]['nextWon'];

                var a = [];
                for (var k = 0; k < 3; k++) {
                    a.push( [aRankings[k], aNextWon[k]] );
                }

                var N = 0; for (var i in a) {N+=a[i][0];}
                var score = 0; for (var i in a) {score+=weights[i]*a[i][0];}
                var M = weights[0]*N;
                a.push([score, 0]);
                d3.select('#part1Bars-'+code+n).selectAll('.part1Bar')
                    .data(a)
                    .enter().append('div')
                    .attr('class', function (d, i) {
                        return ['part1Bar goldBar', 'part1Bar silverBar', 'part1Bar bronzeBar', 'part1Bar scoreBar'][i];
                    })
                    .style('height', function(d, i) {
                        var c = d[0];
                        if (i < 3) {
                            return Math.floor(ow3.p1.barSVGHeight*c/N) + 'px';
                        } else {
                            return Math.floor(ow3.p1.barSVGHeight*c/M) + 'px';
                        }
                    })
                    .style('left', function(d, i) {
                        return 35*i+'px';
                    })
                    .text(function(d) {return d[0];})
                    .attr('title', function(d, i) {
                        var c = d[0];
                        var nw = d[1];
                        var j0 = j, j1 = (j+1)%3, j2 = (j+2)%3;
                        var ln1 = layoutNames[j1], ln2 = layoutNames[j2];
                        var w1 = nw, w2 = c - nw;
                        var t = '';
                        if (j1 < j2) {
                            t += ln1+': '+w1+', '+ln2+': '+w2;
                        } else {
                            t += ln2+': '+w2+', '+ln1+': '+w1;
                        }
                        return t;
                    });
            }
        }
    });

    // Colour nodes in Parts 2 and 3.
    d3.json("part2.json", function(error, p) {
        for (var i in ow3.largeGraphNumbers) {
            var n = ow3.largeGraphNumbers[i];
            for (var j = 0; j < 2; j++) {
                var code = ['x', 'y'][j];
                var nodeSets = p['agg'][''+n][code]['node_sets'];
                for (var l in nodeSets) {
                    var datum = nodeSets[l];
                    var ns = datum[0], count = datum[1];
                    var svg = d3.select('#part2ShowNodes-'+code+n+'-'+ns).select('svg');
                    var nodeIDs = ns.split("_");
                    for (var k in nodeIDs) {
                        var ID = nodeIDs[k];
                        svg.select('#node'+ID).attr('fill', '#0f0');
                    }
                    //svg.on('click', 'ow3.enlarge(this)');
                    //svg.on('click', 'console.log("foo")');
                }
            }
        }
    });
    d3.json("part3.json", function(error, p) {
        for (var i in ow3.largeGraphNumbers) {
            var n = ow3.largeGraphNumbers[i];
            for (var j = 0; j < 2; j++) {
                var code = ['x', 'y'][j];
                var nodeSets = p['agg'][''+n][code]['node_sets'];
                for (var l in nodeSets) {
                    var datum = nodeSets[l];
                    var ns = datum[0], count = datum[1];
                    var svg = d3.select('#part3ShowNodes-'+code+n+'-'+ns).select('svg');
                    var nodeIDs = ns.split("_");
                    for (var k in nodeIDs) {
                        var ID = nodeIDs[k];
                        svg.select('#node'+ID).attr('fill', '#0f0');
                    }
                    //svg.on('click', 'ow3.enlarge(this)');
                }
            }
        }
    });
    // Resize
    ow3.resize();
    window.addEventListener('resize', ow3.resize);
});



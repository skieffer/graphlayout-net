dp = {};
dp.results = {
    g1:{}, g2:{}, g3:{}, g4:{}, g5:{}, g6:{}, g7:{}, g8:{}
};
dp.metricDictionary = {
    'Drags':'drags',
    'Time':'ms',
    'Votes':'votes',
    'Vote %':'votePercent',
    'AIP':'aip',
    'Bend Points':'numBPs',
    'Crossings':'numXings',
    'Compactness':'compactness',
    'Seg. Len. Mean':'segMean',
    'Seg. Len. SD':'segSD'
};

dp.startup = function() {
    // Do all sortings.
    for (var i = 1; i <= 8; i++) {
        dp.resortForGraph(i);
    }
};

dp.resortForGraph = function(graphnum) {
    // Primary sort
    var metricSel = document.getElementById("sortMetric"+graphnum);
    var m = metricSel.selectedIndex;
    var metric1 = metricSel.options[m].value;
    var orderSel = document.getElementById("sortOrder"+graphnum);
    var o = orderSel.selectedIndex;
    var order1 = orderSel.options[o].value;
    // Secondary sort
    var metricSel2 = document.getElementById("secondaryMetric"+graphnum);
    var m2 = metricSel2.selectedIndex;
    var metric2 = metricSel2.options[m2].value;
    var orderSel2 = document.getElementById("secondaryOrder"+graphnum);
    var o2 = orderSel2.selectedIndex;
    var order2 = orderSel2.options[o2].value;
    // Sort the results for graphnum by metric and order.
    var sorted = dp.sortedResults(graphnum,metric1,order1,metric2,order2);
    // Rearrange the divs in this order, and write the heading info.
    for (var n in sorted) {
        var T = sorted[n];
        var j = n%4; var i = (n-j)/4;
        var d = document.getElementById('task-'+graphnum+'-'+T.uid);
        d.setAttributeNS(null,'class',"taskResult row"+i+" col"+j);
        var h = document.getElementById('taskInfo-'+graphnum+'-'+T.uid);
        var s1 = dp.formatMetricInfo(T,metric1);
        var s2 = dp.formatMetricInfo(T,metric2);
        h.innerHTML = s1+'&nbsp;&nbsp;&nbsp;&nbsp;'+s2;
    }
};

dp.formatMetricInfo = function(T, metric) {
    var m = dp.metricDictionary[metric];
    var q = T[m];
    var s = '';
    if (metric==='Drags') {
        s = q+' drags';
    } else if (metric==='Bend Points') {
        s = q+' bends';
    } else if (metric==='Crossings') {
        s = q+' crossings';
    } else if (metric==='Seg. Len. Mean') {
        s = 'seg mean '+dp.truncateFloat(q);
    } else if (metric==='Seg. Len. SD') {
        s = 'seg SD '+dp.truncateFloat(q);
    } else if (metric==='Time') {
        var r = q%60000; var min = (q-r)/60000;
        var sec = Math.round(r/1000);
        sec = sec<10?"0"+sec:sec;
        s = min+':'+sec;
    } else if (metric==='Votes') {
        s = q+' votes';
    } else if (metric==='Vote %') {
        s = dp.truncateFloat(q)+'% of votes';
    } else if (metric==='AIP') {
        s = 'AIP '+dp.truncateFloat(q);
    } else if (metric==='Compactness') {
        s = 'Compactness '+dp.truncateFloat(q);
    }
    return s;
};

dp.truncateFloat = function(q) {
    return Math.floor(q*100)/100;
}

dp.sortedResults = function(graphnum, metric1, order1, metric2, order2) {
    R = dp.results['g'+graphnum];
    dp.sortingMetric1 = metric1;
    dp.sortingOrder1  = order1;
    dp.sortingMetric2 = metric2;
    dp.sortingOrder2  = order2;
    L = [];
    for (var uid in R) { if (uid!="0") { L.push(R[uid]); } }
    L.sort(dp.sortFunction);
    return L;
};

dp.sortFunction = function(a, b) {
    var m1 = dp.metricDictionary[dp.sortingMetric1];
    var o1 = parseInt(dp.sortingOrder1);
    var A1 = parseFloat(a[m1]); var B1 = parseFloat(b[m1]);
    var s = o1*(A1-B1);
    if (s===0) {
        var m2 = dp.metricDictionary[dp.sortingMetric2];
        var o2 = parseInt(dp.sortingOrder2);
        var A2 = parseFloat(a[m2]); var B2 = parseFloat(b[m2]);
        s = o2*(A2-B2);
    }
    return s;
};

/*
* Pass object containing task data.
* We file it away according to its gn and uid fields.
*/
dp.addResults = function(d) {
    var gn = 'g'+d.gn;
    var uid = d.uid;
    uid = uid===0?"0":uid;
    dp.results[gn][uid] = d;
};

/*
* Show tournament on graph n for user uid.
*/
dp.showTourn = function(uid,n) {
    for (var i = 1; i <= 8; i++) {
        var t = document.getElementById('tourn'+uid+'-'+i);
        t.style.display = 'none';
    }
    var t = document.getElementById('tourn'+uid+'-'+n);
    t.style.display = 'block';
}



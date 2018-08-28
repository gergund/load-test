/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
    var dataset = [
        {
            "label" : "KO",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "OK",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.6979020979020979, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)  ", "F (Frustration threshold)", "Label"], "items": [{"data": [0.9583333333333334, 500, 1500, "Customer Section Load"], "isController": false}, {"data": [1.0, 500, 1500, "Checkout Email Available"], "isController": false}, {"data": [0.6979166666666666, 500, 1500, "Load Customer Section"], "isController": false}, {"data": [0.25, 500, 1500, "Cart page"], "isController": false}, {"data": [0.3125, 500, 1500, "Checkout start"], "isController": false}, {"data": [0.9895833333333334, 500, 1500, "Simple Product Page"], "isController": false}, {"data": [0.6041666666666666, 500, 1500, "Checkout Billing/Shipping Information"], "isController": false}, {"data": [0.0, 500, 1500, "Checkout Payment Info/Place Order"], "isController": false}, {"data": [0.9791666666666666, 500, 1500, "Open Category Page"], "isController": false}, {"data": [0.7604166666666666, 500, 1500, "Ajax Load Login Form"], "isController": false}, {"data": [0.627906976744186, 500, 1500, "Checkout success"], "isController": false}, {"data": [0.9895833333333334, 500, 1500, "Home Page"], "isController": false}, {"data": [0.6979166666666666, 500, 1500, "Checkout Estimate Shipping Methods"], "isController": false}, {"data": [0.6354166666666666, 500, 1500, "Add To Cart"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "Ajax Banner Load"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 715, 0, 0.0, 965.3482517482523, 73, 13700, 1761.3999999999999, 4028.7999999999993, 9342.800000000027, 3.428253604461045, 24.09000413098566, 0.0], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "90th pct", "95th pct", "99th pct", "Throughput", "Received", "Sent"], "items": [{"data": ["Customer Section Load", 48, 0, 0.0, 310.0416666666667, 157, 740, 484.0000000000001, 599.5999999999999, 740.0, 0.24125937393192465, 0.18591677462604797, 0.0], "isController": false}, {"data": ["Checkout Email Available", 48, 0, 0.0, 235.89583333333331, 114, 423, 335.5, 371.3999999999999, 423.0, 0.24250997827514778, 0.1265737097711312, 0.0], "isController": false}, {"data": ["Load Customer Section", 48, 0, 0.0, 604.2708333333334, 293, 1192, 887.4, 1113.05, 1192.0, 0.24516564003554903, 0.26061319023066, 0.0], "isController": false}, {"data": ["Cart page", 48, 0, 0.0, 1447.6041666666667, 666, 3002, 2226.2000000000007, 2831.6499999999996, 3002.0, 0.24341141092410126, 6.341017801994959, 0.0], "isController": false}, {"data": ["Checkout start", 48, 0, 0.0, 1254.666666666666, 595, 2549, 2099.1, 2373.649999999999, 2549.0, 0.24218694814171973, 5.484520335819955, 0.0], "isController": false}, {"data": ["Simple Product Page", 48, 0, 0.0, 184.31250000000003, 78, 1056, 298.3, 330.34999999999997, 1056.0, 0.24717295927825497, 2.7230512681131436, 0.0], "isController": false}, {"data": ["Checkout Billing/Shipping Information", 48, 0, 0.0, 818.4583333333333, 407, 1638, 1546.6, 1584.55, 1638.0, 0.24109335838025445, 0.5637283832178932, 0.0], "isController": false}, {"data": ["Checkout Payment Info/Place Order", 48, 0, 0.0, 6144.874999999998, 2508, 13700, 10508.6, 12664.949999999997, 13700.0, 0.2348198735886347, 0.12252655635432362, 0.0], "isController": false}, {"data": ["Open Category Page", 48, 0, 0.0, 210.64583333333331, 80, 2130, 281.2000000000001, 390.1999999999998, 2130.0, 0.2473130467936894, 2.5636237367069237, 0.0], "isController": false}, {"data": ["Ajax Load Login Form", 48, 0, 0.0, 468.8541666666666, 224, 990, 760.9000000000001, 951.0999999999999, 990.0, 0.24652299854140558, 0.348027157975019, 0.0], "isController": false}, {"data": ["Checkout success", 43, 0, 0.0, 807.9302325581396, 390, 1748, 1099.8, 1588.9999999999993, 1748.0, 0.22966772954755457, 1.8076162642807927, 0.0], "isController": false}, {"data": ["Home Page", 48, 0, 0.0, 179.625, 73, 516, 311.4000000000001, 408.4999999999999, 516.0, 0.24722388182698452, 1.7742206572936194, 0.0], "isController": false}, {"data": ["Checkout Estimate Shipping Methods", 48, 0, 0.0, 587.604166666667, 277, 1138, 978.5000000000001, 1095.35, 1138.0, 0.24165898895920493, 0.1741103063153549, 0.0], "isController": false}, {"data": ["Add To Cart", 48, 0, 0.0, 859.3958333333335, 407, 3647, 1171.4, 1558.099999999999, 3647.0, 0.24552680845839858, 2.9766079368459013, 0.0], "isController": false}, {"data": ["Ajax Banner Load", 48, 0, 0.0, 349.6458333333334, 168, 759, 512.1000000000003, 702.65, 759.0, 0.24730922411883208, 0.22110004141141434, 0.0], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Percentile 1
            case 8:
            // Percentile 2
            case 9:
            // Percentile 3
            case 10:
            // Throughput
            case 11:
            // Kbytes/s
            case 12:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 715, 0, null, null, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});

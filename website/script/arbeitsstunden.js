$(function() {
    var DATE_FORMAT = 'DD.MM.YYYY';
    var EXPORT_DATE_KEY = 'export_date';

    function getWeekNumber(date) {    
        // fix week number at the end of the project to the last projekt week
        return 21;
    };

    function round(valueToRound) {
        return Math.round(valueToRound * 100) / 100;
    };

    function prepareWorktimePerIssueData(dataToMap) {
      var data = [];
        for (var key in dataToMap.data) {
            // skip loop if the property is from prototype
            if (!dataToMap.data.hasOwnProperty(key)) continue;

            var obj = dataToMap.data[key];

            data.push({
              id: key,
              name: obj.name,
              value: obj.spent,
              colorValue: obj.spent
            });
            data.push({
              parent: key,
              id: 'Ist',
              name: 'Ist',
              value: obj.spent,
              colorValue: obj.spent
            });
            data.push({
              parent: key,
              id: 'Soll',
              name: 'Soll',
              value: obj.estimated,
              colorValue: obj.estimated
            });
        }
        return data;
    };

    (function() {
        jQuery.get('resources/export/worktime.json', function(workTimeChartData) {
            var startWeek = 7;
            var weeklyHourTarget = 8.6;
            var projectWeekNumber = getWeekNumber(new Date()) - startWeek;
            var targetWorkTime = round(projectWeekNumber * weeklyHourTarget);

            var rzimmerm = 'Raphael Zimmermann';
            var r1suter = 'Robin Suter';
            var pscherl = 'Patrick Scherler';
            var jmatter = 'Jonas Matter';

            Highcharts.chart('workTimeChart', {
                chart: {
                    type: 'column'
                },
                title: {
                    text: 'Stand: ' + moment(workTimeChartData[EXPORT_DATE_KEY]).format(DATE_FORMAT)
                },
                subtitle: {
                    text: 'Sollarbeitszeit basierend auf ' + projectWeekNumber + ' Wochen'
                },
                xAxis: {
                    categories: [
                        rzimmerm,
                        r1suter,
                        pscherl,
                        jmatter
                    ]
                },
                yAxis: [{
                    min: 0,
                    title: {
                        text: 'Arbeitsstunden'
                    }
                }],
                legend: {
                    shadow: false
                },
                tooltip: {
                    shared: true
                },
                plotOptions: {
                    column: {
                        grouping: false,
                        shadow: false,
                        borderWidth: 0
                    }
                },
                series: [{
                    name: 'Ist',
                    color: '#6b8fc6',
                    data: [round(workTimeChartData.team[rzimmerm]), round(workTimeChartData.team[r1suter]),
                        round(workTimeChartData.team[pscherl]), round(workTimeChartData.team[jmatter])
                    ],
                    pointPadding: 0.3,
                    tooltip: {
                        valueSuffix: 'h'
                    }
                }, {
                    name: 'Soll',
                    color: '#f2f2f2',
                    data: [targetWorkTime, targetWorkTime, targetWorkTime, targetWorkTime],
                    pointPadding: 0.4,
                    tooltip: {
                        valueSuffix: 'h'
                    }
                }]
            });
        }, 'json').fail(function() {
            $('#workTimeChart .no-export').show();
        });

        jQuery.get('resources/export/worktimePerIssue.json', function(data) {

            var workTimePerIssueChartData = prepareWorktimePerIssueData(data);

            Highcharts.chart('workTimePerIssueChart', {
                title: {
                    text: 'Stand: ' + moment(data[EXPORT_DATE_KEY]).format(DATE_FORMAT)
                },
                colorAxis: {
                    minColor: '#FFFFFF',
                    maxColor: Highcharts.getOptions().colors[0]
                },
                series: [{
                    type: 'treemap',
                    layoutAlgorithm: 'squarified',
                    allowDrillToNode: true,
                    animationLimit: 1000,
                    dataLabels: {
                        enabled: false
                    },
                    levelIsConstant: false,
                    levels: [{
                        level: 1,
                        dataLabels: {
                            enabled: true
                        },
                        borderWidth: 3
                    }],
                    tooltip: {
                        valueSuffix: 'h'
                    },
                    data: workTimePerIssueChartData
                }]
            });
        }, 'json').fail(function() {
            $('#workTimePerIssueChart .no-export').show();
        });

    })();
});

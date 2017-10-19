$(function() {
    (function() {
        function prepareVelocityData(dataToMap) {
            var keys = [];
            var timePlanned = [];
            var teamSpeed = [];

            for (var key in dataToMap) {
                // skip loop if the property is from prototype
                if (!dataToMap.hasOwnProperty(key)) continue;

                keys.push(key);
                var obj = dataToMap[key];
                timePlanned.push(obj["timePlanned"]);
                teamSpeed.push(obj["teamSpeed"]);
            }
            var data = {
                keys: keys,
                timePlanned: timePlanned,
                teamSpeed: teamSpeed
            };
            return data;
        };

        jQuery.get('resources/velocity.json', function(data) {
            var mappedData = prepareVelocityData(data);
            Highcharts.chart('velocityChart', {
                title: {
                    text: 'Velocity'
                },
                xAxis: {
                    categories: mappedData['keys']
                },
                series: [{
                        name: 'Time Planned',
                        data: mappedData['timePlanned']
                    },
                    {
                        name: 'Team Speed',
                        data: mappedData['teamSpeed']
                    }
                ]
            });
        }, 'json').fail(function() {
            $('#velocityChart .no-export').show();
        });
    })();

});

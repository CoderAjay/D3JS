(function(d3) {

    var bardata = [];

    d3.tsv('data.tsv', function(data) {
        for (key in data) {
            bardata.push(data[key].value);
        }
        var margin = {
            top: 30,
            right: 30,
            bottom: 40,
            left: 50
        };

        var height = 400 - margin.top - margin.bottom,
            width = 600 - margin.left - margin.right;
        var tempcolor;
        var colors = d3.scale.linear()
            .domain([0, bardata.length * .33, bardata.length * .66, bardata.length])
            .range(['#FFB832', '#C61C6F', '#268BD@', '#85992']);
        // calculating heights for barchat maximum hegiht(400) will be apllied to maximum value
        var yScale = d3.scale.linear()
            .domain([0, d3.max(bardata)])
            .range([0, height]);
        // Dynamic x scale for n valuse calculated automatically
        var xScale = d3.scale.ordinal()
            .domain(d3.range(0, bardata.length))
            .rangeBands([0, width], 0.02);

        var tooltip = d3.select('body').append('div')
            .style('position', 'absolute')
            .style('padding', '0 10px')
            .style('background', 'white')
            .style('opacity', 0)

        var mychart = d3.select('#chart').append('svg')
            .style('background', '#E7E0CB')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .append('g')
            .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
            .selectAll('rect').data(bardata)
            .enter().append('rect')
            .style('fill', function(d, i) {
                return colors(i);
            })
            .attr('width', xScale.rangeBand())
            .attr('x', function(d, i) {
                return xScale(i);
            })
            .attr('height', 0)
            .attr('y', height)
            //events
            .on('mouseover', function(d) {

                tooltip.transition()
                    .style('opacity', 0.9)
                tooltip.html(d)
                    .style('left', (d3.event.pageX - 35) + 'px')
                    .style('top', (d3.event.pageY - 30) + 'px')

                tempcolor = this.style.fill;
                d3.select(this)
                    .transition()
                    .style('opacity', 0.5)
                    .style('fill', 'Whiite')
            })

        .on('mouseout', function(d) {
            d3.select(this)
                .transition().delay(500).duration(800)
                .style('opacity', 1)
                .style('fill', tempcolor);
        })

        mychart.transition()
            //.delay(500)
            //.duration(2500)
            .attr('height', function(d) {
                return yScale(d);
            })
            .attr('y', function(d) {
                return height - yScale(d);
            })
            .delay(function(d, i) {
                return i * 10;
            })
            .duration(1000)
            .ease('elastic')


        var vGuideScale = d3.scale.linear()
            .domain([0, d3.max(bardata)])
            .range([height, 0])


        var vAxis = d3.svg.axis()
            .scale(vGuideScale)
            .orient('left') //left, right top, bottom
            .ticks(10)
        var vGuide = d3.select('svg').append('g')
        vAxis(vGuide)
        vGuide.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
        vGuide.selectAll('path')
            .style({
                fill: 'none',
                stroke: '#000'
            })
        vGuide.selectAll('line')
            .style({
                stroke: '#000'
            })

        var hAxis = d3.svg.axis()
            .scale(xScale)
            .orient('bottom')
            .tickValues(xScale.domain().filter(function(d, i) {
                return !(i % (bardata.length / 10));
            }))
        var hGuide = d3.select('svg').append('g')
        hAxis(hGuide)
        hGuide.attr('transform', 'translate(' + margin.left + ',' + (height + margin.top) + ')')
        hGuide.selectAll('path')
            .style({
                fill: 'none',
                stroke: '#000'
            })
        hGuide.selectAll('line')
            .style({
                stroke: '#000'
            })


    })

})(window.d3);

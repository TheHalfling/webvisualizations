var filename = "WHO_Data_Ratio_by_Year.csv"
var yaxistext = "Number of Maternal Deaths per 100,000 births"

var n = 4, //number of layers

//Set the dimensions and margins
var svg = d3.select("svg"), 
	margin = {top: 20, right: 80, bottom: 30, left: 50 },
	width = svg.attr("width") - margin.left - margin.right,
	height = svg.attr("height") - margin.top - margin.bottom
	g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var tempColor;

//set the ranges
var x0 = d3.scaleBand()
	.rangeRound([0, width])
	.paddingInner(0.1);

var	x1 = d3.scaleBand()
	.padding(0.05);

var y = d3.scaleLinear()
	.rangeRound([height, 0]);
	
var	z = d3.scaleOrdinal()
	.range(['#e41a1c','#377eb8','#4daf4a','#984ea3','#ff7f00','#ffff33','#a65628']);

var tooltip = d3.select("body")
	.append("div")
	.attr("class", "toolTip")
	.style('position', 'absolute')
	.style('padding', '0 10px')	
	.style('background', 'white')
	.style('opacity', 0)
	
//get the data
d3.csv(filename, function(d, i, columns) {
	for (var i = 1, n = columns.length; i < n; ++i) d[columns[i]] = +d[columns[i]];
	return d;
}, function(error, data) {
	if (error) throw error;
	
	var keys = data.columns.slice(1);
	
	x0.domain(data.map(function(d) { return d.date; }));
	x1.domain(keys).rangeRound([0, x0.bandwidth()]);
	y.domain([0, d3.max(data, function(d) { return d3.max(keys, function(key) { return d[key]; }); })]).nice();
		
	g.append("g")
		.selectAll("g")
		.data(data)
		.enter().append("g")
			.attr("transform", function(d) { return "translate(" + x0(d.date) + ",0)"; })
		.selectAll("rect")
		.data(function(d) { return keys.map(function(key) {return {key: key, value: d[key]}; }); })
		.enter().append("rect")
			.attr("x", function(d) { return x1(d.key); })
			.attr("y", function(d) { return y(d.value); })
			.attr("width", x1.bandwidth())
			.attr("height", function(d) { return height - y(d.value); })
			.attr("fill", function(d) { return z(d.key); })
			.on('mouseover', function(d) {	
				tooltip.transition()
					.style('opacity', .9)
				tooltip.html(d)
					.style('left', (d3.event.pageX) + 'px')
					.style('top', (d3.event.pageY) + 'px')
					.style("display", "inline-block")
					.html((d. key) + "<br>" + (d.value))
				tempColor = this.style.fill;
				d3.select(this)
					.style('opacity', .5)
					.style('fill', 'black')
				})
			.on("mouseout", function(d) { 
				d3.select(this)
					.style('opacity', 1)
					.style('fill', tempColor)
				tooltip.style("display", "none");
				});
			
	g.append("g")
		.attr("class", "axis")
		.attr("transform", "translate(0," + height + ")")
		.call(d3.axisBottom(x0));
		
	g.append("g")
			.attr("class", "axis")
			.call(d3.axisLeft(y).ticks(null, "s"))
		.append("text")
			.attr("x", 2)
			.attr("y", y(y.ticks().pop() + 0.5))
			.attr("dy", "0.32em")
			.attr("fill", "#000")
			.attr("font-weight", "bold")
			.attr("text-anchor", "start")
			.text(yaxistext);

			
	var legend = g.append("g")
		.attr("font-family", "sans-serif")
		.attr("font-size", 10)
		.attr("text-anchor", "end")
		.selectAll("g")
		.data(keys.slice().reverse())
		.enter().append("g")
			.attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });
	
	legend.append("rect")
		.attr("x", width - 19)
		.attr("width", 19)
		.attr("height", 19)
		.attr("fill", z);
		
	legend.append("text")
		.attr("x", width - 24)
		.attr("y", 9.5)
		.attr("dy", "0.32em")
		.text(function(d) { return d; });
});
			
		
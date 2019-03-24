function Chart(rootSelector, pointCount,yMin,yMax) {//增加初始y轴  by lixuan
  let margin = {top: 10, right: 50, bottom: 50, left: 80};
  // , width = window.innerWidth - margin.left - margin.right // Use the window's width
  let width = 900;
  let height = (window.innerHeight - margin.top - margin.bottom)/2; // Use the window's height

  // The number of datapoints
  this.pointCount = pointCount;

  // 5. X scale will use the index of our data
  let xScale = d3.scaleLinear()
      .domain([0, pointCount-1]) // input
      .range([0, width]); // output

  // 6. Y scale will use the randomly generate number
  let yScale = d3.scaleLinear()
      .domain([yMin, yMax]) // input
      .range([height, 0]); // output


  // gridlines in x axis function
  const make_x_gridlines = () => {
    return d3.axisBottom(xScale).ticks(10)
  }

  // gridlines in y axis function
  const make_y_gridlines = () => {
    return d3.axisLeft(yScale).ticks(6)
  }

  // 7. d3's line generator
  this.line = d3.line()
      .x(function(d) { return xScale(d.x); }) // set the x values for the line generator
      .y(function(d) { return yScale(d.y); }) // set the y values for the line generator


  // 1. Add the SVG to the page and employ #2
  this.svg = d3.select(rootSelector).append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // 3. Call the x axis in a group tag
  this.svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(xScale)); // Create an axis component with d3.axisBottom

  this.svg.append("text")
      .attr("class", "x-axis-text")
      .attr("text-anchor", "middle")
      .attr("transform", "translate(" + (width - margin.left) / 2 + "," + (window.innerHeight - margin.bottom / 2) + ")")  // text is drawn off the screen top left, move down and out and rotate
      .text("time (sec)");

  // 4. Call the y axis in a group tag
  this.svg.append("g")
      .attr("class", "y axis")
      .call(d3.axisLeft(yScale)); // Create an axis component with d3.axisLeft

  this.svg.append("text")
      .attr("class", "y-axis-text")
      .attr("text-anchor", "middle")
      .attr("transform", "translate("+ (-margin.left / 2) +","+((height - margin.bottom) / 2)+")rotate(-90)")  // text is drawn off the screen top left, move down and out and rotate
      .text("HB");

  // add the X gridlines
  this.svg.append("g")
      .attr("class", "grid")
      .attr("transform", "translate(0," + height + ")")
      .call(make_x_gridlines()
        .tickSize(-height)
        .tickFormat("")
      );

  // add the Y gridlines
  this.svg.append("g")
      .attr("class", "grid")
      .call(make_y_gridlines()
        .tickSize(-width)
        .tickFormat("")
      )

  // 9. Append the path, bind the data, and call the line generator
  this.svg.append("path")
      .datum(this.dataset)
      .attr("class", "line")
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 1.5)
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .attr("d", this.line);

  this.svg.append("path")
      .datum(this.dataset2)
      .attr("class", "line2")
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 1.5)
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .attr("d", this.line);
}

Chart.prototype = {
  index: 0,
  dataset: [],
  dataset2: [],
  
  updateChart: function(datas,yMax,yMin) {//更新yMax,yMin)

    // autoscale Y 这里要测试 by lixuan
    let yScale = d3.scaleLinear()
    .domain([yMin, yMax]) // input
    .range([height, 0]); // output

    for (const data of datas) {
      console.log(data);
      this.dataset.push({x: this.index, y: data });
      if (this.dataset2.length) {
        this.dataset2.shift();
      }

      this.index += 1;
      if (this.index == this.pointCount) {
        this.index = 0;
        this.dataset2 = this.dataset;
        this.dataset = [];
      }
    }

    // Make the changes
    this.svg.select(".line").attr("d", this.line(this.dataset)); // change the line

    this.svg.select(".line2").attr("d", this.line(this.dataset2)); // change the line
  }
}
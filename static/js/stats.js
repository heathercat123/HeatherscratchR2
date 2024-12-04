$.getJSON("/statistics/data/daily/", function( data ) {
  $(".daily-timestamp").text($.format.date(new Date(data['_TS']*1000), "dd/MM/yyyy"));

  $("#numproject").text(data['PROJECT_COUNT'].toLocaleString());
  $("#numusers").text(data['USER_COUNT'].toLocaleString());
  $("#numcomments").text(data['COMMENT_COUNT'].toLocaleString());
  $("#numstudios").text(data['STUDIO_COUNT'].toLocaleString());
});

$.getJSON("/statistics/data/monthly-ga/", function( data ) {
  $(".ga-monthly-timestamp").text($.format.date(new Date(data['_TS']*1000), "MMM yyyy"));

  $("#ga-pageviews").text(parseInt(data['pageviews']).toLocaleString());
  $("#ga-visits").text(parseInt(data['sessions']).toLocaleString());
  $("#ga-users").text(parseInt(data['users']).toLocaleString());
});


$.getJSON("/statistics/data/monthly/", function( data ) {
  $(".monthly-timestamp").text($.format.date(new Date(data['_TS']*1000), "MMM yyyy"));

  var activity_data = data['activity_data'];
  var active_user_data = data['active_user_data'];
  var age_distribution_data = data['age_distribution_data'];
  var project_data = data['project_data'];
  var comment_data = data['comment_data'];
  var country_distribution = data['country_distribution'];
  var block_distribution = data['block_distribution'];

  // Monthly activity
  nv.addGraph(function() {
    var activity_chart = nv.models.lineChart()
        .useInteractiveGuideline(true)
        .showXAxis(true);

    activity_chart.xAxis
        .axisLabel('Month/Year')
        .tickFormat(function(d) {
          return d3.time.format('%m/%Y')(new Date(d))
      })
      .showMaxMin(false);

    activity_chart.yAxis
        .axisLabel('Monthly count')
        .tickFormat(d3.format(',.0f'))
        .showMaxMin(false);

    d3.select('#activity_chart svg')
        .datum(activity_data)
        .transition().duration(500)
        .call(activity_chart);

    nv.utils.windowResize(activity_chart.update);

    return activity_chart;
  });

  // Monthly active users
  nv.addGraph(function() {
    var active_user_chart = nv.models.lineChart()
        .useInteractiveGuideline(true)
        .showXAxis(true);

    active_user_chart.xAxis
        .axisLabel('Month/Year')
        .tickFormat(function(d) {
          return d3.time.format('%m/%Y')(new Date(d))
      })
      .showMaxMin(false);

    active_user_chart.yAxis
        .axisLabel('Monthly count')
        .tickFormat(d3.format(',.0f'))
        .showMaxMin(false);

    d3.select('#active_user_chart svg')
        .datum(active_user_data)
        .transition().duration(500)
        .call(active_user_chart);

    nv.utils.windowResize(active_user_chart.update);

    return active_user_chart;
  });

  // Age distribution
  nv.addGraph(function() {
     var age_distribution_chart = nv.models.multiBarChart()
        .showLegend(false)
        .showControls(false);

     /*age_distribution_chart.tooltip(function(key, x, y, e, graph) {
          return '<h3>' + key + '</h3>' +
          '<p>' +  y + ' signed up when they were ' + x + '</p>'
     });*/

     age_distribution_chart.xAxis
          .axisLabel('Age')
          .tickFormat(d3.format(',.0f'))
          .showMaxMin(false);
     age_distribution_chart.yAxis
          .axisLabel('Number of users')
          .tickFormat(d3.format(',.0f'))
          .showMaxMin(false);

     d3.select('#age_distribution_chart svg')
        .datum(age_distribution_data)
        .transition().duration(500).call(age_distribution_chart);

     nv.utils.windowResize(age_distribution_chart.update);

     return age_distribution_chart;
  });

  // Project creation
  nv.addGraph(function() {
    var project_chart = nv.models.stackedAreaChart()
        .useInteractiveGuideline(true)
        .clipEdge(true);

    project_chart.xAxis
        .axisLabel('Month/Year')
        .showMaxMin(false)
        .tickFormat(function(d) { return d3.time.format('%m/%Y')(new Date(d)) });

    project_chart.yAxis.showMaxMin(false);
    project_chart.yAxisTickFormat(d3.format(',.0f'));

    d3.select('#project_chart svg')
      .datum(project_data)
        .transition().duration(500).call(project_chart);

    nv.utils.windowResize(project_chart.update);

    return project_chart;
  });

  // Comment creation
  nv.addGraph(function() {
    var comment_chart = nv.models.stackedAreaChart()
        .useInteractiveGuideline(true)
        .clipEdge(true);

    comment_chart.xAxis
        .axisLabel('Month/Year')
        .showMaxMin(false)
        .tickFormat(function(d) { return d3.time.format('%m/%Y')(new Date(d)) });

    comment_chart.yAxis.showMaxMin(false);
    comment_chart.yAxisTickFormat(d3.format(',.0f'));

    d3.select('#comment_chart svg')
      .datum(comment_data)
        .transition().duration(500).call(comment_chart);

    nv.utils.windowResize(comment_chart.update);

    return comment_chart;
  });


  // Map
  function addMap(distribution) {
      var width = 918,
          height = 500;

      var max = 1,
          length = 0;

      var total = d3.sum(Object.keys(distribution).map(function(d) {
        return distribution[d];
      }));

      var formatPercent = d3.format(",.2%");
      var formatPopulation = d3.format(",");

      var tooltip = d3.select('#country_chart')
        .append('div')
        .attr('class', 'info-tooltip');
      tooltip.append('div')
        .attr('class', 'label');
      tooltip.append('div')
        .attr('class', 'count');
      tooltip.append('div')
        .attr('class', 'percent');

      for (var item in distribution) {
          max = Math.max(distribution[item], max);
          length += 1;
      }

      var quantize = d3.scale.log().clamp(true).domain([1, max]).range([0,8]).nice();

      function getPopulation(country) {
          const countryLcase = country.toLowerCase();

          // mapping our data to stats:
          // variables and their data sources:
          // * distribution: the "country_distribution" json object from /statistics/data/monthly/,
          //   which draw from our userprofiles_userprofile table. Note that this can have multiple
          //   versions of country names used at different times.
          // * country: from the js/lib/topo/countries.json file's world map file

          // countries where we need to consolidate multiple names:
          // (note that distribution lookups may be undefined)
          if (countryLcase === "côte d'ivoire") {
              return (distribution["Cote D'ivoire"] || 0) + (distribution["Cote d'Ivoire"] || 0);
          }
          if (countryLcase === "democratic republic of the congo") {
              return (distribution["Congo, The Democratic Republic of the"] || 0)
                + (distribution["Congo, Dem. Rep. of The"] || 0);
          }
          if (countryLcase == "federated states of micronesia") {
              return (distribution["Micronesia"] || 0) + (distribution["Micronesia, Federated States of"] || 0);
          }
          if (countryLcase == "guinea-bissau") {
              return (distribution["Guinea-Bissau"] || 0) + (distribution["Guinea-bissau"] || 0);
          }
          if (countryLcase === "russia") {
              return (distribution["Russia"] || 0) + (distribution["Russian Federation"] || 0);
          }
          if (countryLcase == "vietnam") {
              return (distribution["Vietnam"] || 0) + (distribution["Viet Nam"] || 0)
                + (distribution["Vietname"] || 0);
          }
          // countries whose svg world map name strings don't appear at all in our stats data:
          if (distribution[country] == undefined ) {
              if (countryLcase == "curaçao") return distribution["Curacao"];
              if (countryLcase == "the gambia") return distribution["Gambia"];
              if (countryLcase == "indian ocean territories") return distribution["British Indian Ocean Territory"];
              if (countryLcase == "iran") return distribution["Iran, Islamic Republic of"];
              if (countryLcase == "republic of korea") return distribution["Korea, Republic of"];
              if (countryLcase == "lao pdr") return distribution["Laos"];
              if (countryLcase == "libya") return distribution["Libyan Arab Jamahiriya"];
              if (countryLcase == "moldova") return distribution["Moldova, Republic of"];
              if (countryLcase == "south georgia and south sandwich islands") return distribution["South Georgia and The South Sandwich Islands"];
              if (countryLcase == "são tomé and principe") return distribution["Sao Tome and Principe"];
              if (countryLcase == "syria") return distribution["Syrian Arab Republic"];
              if (countryLcase == "timor-leste") return distribution["Timor-leste"];
              if (countryLcase == "tanzania") return distribution["Tanzania, United Republic of"];
              if (countryLcase == "saint vincent and the grenadines") return distribution["St. Vincent"];
              if (countryLcase == "british virgin islands") return distribution["Virgin Islands, British"];
              if (countryLcase == "united states virgin islands") return distribution["Virgin Islands, U.S."];
              if (countryLcase == "republic of korea") return distribution["South Korea"];
              if (countryLcase == "republic of congo") return distribution["Congo"];
              if (countryLcase == "dem. rep. korea") return distribution["North Korea"];

              return 0;
          };
          return distribution[country];
      }

      var projection = d3.geo.mercator();

      var svg = d3.select("#country_chart svg")
          .attr("width", width)
          .attr("height", height);

      var path = d3.geo.path()
          .projection(projection);

      d3.json(Scratch.INIT_DATA.GLOBAL_URLS.static_url+"js/lib/topo/countries.json", function(error, world) {
          var countries = topojson.feature(world, world.objects.countries).features;
          svg.selectAll(".country")
              .data(countries)
              .enter().insert("path")
              .attr("class", function(d, i) { return "q" + Math.round(quantize(getPopulation(d.id))) + "-9"; })
              .attr("name", function(d, i) {return d.id})
              .attr("d", path)
              .on('mouseover', function(d) {
                tooltip.select('.label').html(d.id);
                tooltip.select('.count').html(formatPopulation(getPopulation(d.id)));
                tooltip.select('.percent').html('(' + formatPercent(getPopulation(d.id)/total) + ')');
                tooltip.style('display', 'block');
              })
              .on('mouseout', function(d) {
                tooltip.style('display', 'none');
              })
              .on('mousemove', function(d) {
                xpos = d3.event.offsetX==undefined?d3.event.layerX:d3.event.offsetX;
                ypos = d3.event.offsetY==undefined?d3.event.layerY:d3.event.offsetY;
                tooltip.style('opacity', 1.0).transition(50).delay(300).style('opacity', 0.0);
                tooltip.style('top', (ypos + 10) + 'px')
                  .style('left', (xpos + 10) + 'px');
                tooltip.style('opacity', 0.0).transition(50).delay(300).style('opacity', 1.0);
              });

      });

      var legend_labels = ['0', '', '', '', '', '', '', max];

      var legend = svg.selectAll("g.legend")
          .data(d3.range(8))
          .enter().append("g")
          .attr("class", "legend");

      var ls_w = 20, ls_h = 20;

      legend.append("rect")
          .attr("x", 20)
          .attr("y", function(d, i){ return height - (i*ls_h) - 2*ls_h;})
          .attr("width", ls_w)
          .attr("height", ls_h)
          .attr("class", function(d, i) { return 'q' + i +'-9' })
          .style("opacity", 0.8);

      legend.append("text")
          .attr("x", 50)
          .attr("y", function(d, i){ return height - (i*ls_h) - ls_h - 4;})
          .text(function(d, i){ return legend_labels[i]; });

  }
  addMap(country_distribution);

});

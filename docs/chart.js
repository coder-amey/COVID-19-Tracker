//Initialize Paramters and their values/tools.
function init_params() {
	regions = chart_data["regions"];		//Load default regions.
	r_filtered = regions.slice(1, 11);	//Load default region filter.

	var defaults = document.getElementsByTagName('input'); 	//Set all switches to their default values.
		for(var i = 0; i < defaults.length; i++){ 
			if(defaults[i].type=='checkbox'){ 
				defaults[i].checked = false; 
				defaults[i].click();
			}
		}
	
	document.getElementById("defaultOpen").click();				//Set the default sub-filter as "Infected".

	//Load the epoch and delta values. Set the delta value as the range of the slider.
	epoch = new Date(chart_data["interval"][0]);
	delta = new Date(chart_data["interval"][1]);
	epoch = epoch.getTime();
	delta = delta.getTime() - epoch;
	init_slider("#range-picker", delta);				//Initialize the range-slider to the default view.

	//Set the colour scheme for trend lines.
	CanvasJS.addColorSet("colourTheme",["#f50a0a", "#ffff00", "#005ce6", "#33ffad", "#ff00bf", "#002080", "#000000", "#ff471a", "#99e6ff", "#00cc00", "#a3a375", "#4d004d", "#c65353", "#a0a0a0", "#ffb84d"]);

	document.getElementById("note").innerHTML = "Last updated: " + chart_data["update_time"];		//Mention the time of last update.
	document.getElementById("chart_area").style.display = "block";												//Unhide the chart area.
}

//Generates the menu from the filtering parameters.
function load_menu() {
	var prefix = "<li><a onclick='rmvReg(";
	var suffix = "<i class='fa fa-times-circle'></i></a></li>";
	var list = ""
	for(r in r_filtered) {
		list += prefix + r + ")'>" + r_filtered[r] + suffix;
	}
	document.getElementById("regions_selected").innerHTML = list;
	
	var prefix = "<li><a onclick='addReg(";
	var suffix = "<i class='fa fa-plus-circle'></i></a></li>";
	list = ""
	for(r in regions) {
		if(!r_filtered.includes(regions[r])) {
			list += prefix + r + ")'>" + regions[r] + suffix;
		}
	}
	document.getElementById("regions_unselected").innerHTML = list;

	document.getElementById("region_selector").value = "";

	//Focus on the menu and hide the background.
	document.getElementById("overlay").style.display = "block";
	document.getElementById("menu").style.display = "block";
}

//Remove a region from the filter.
function rmvReg(index) {
	r_filtered.splice(index, 1);
	load_menu();
}

//Add a region to the filter.
function addReg(index) {
	if(r_filtered.length == 15) {
		alert("A maximum of 15 regions can be selected simultaneously.");
	}
	else {
		r_filtered.push(regions[index]);
	}
	load_menu();
}

//Remove all regions from the filter.
function clear_filter() {
	r_filtered = [];
	load_menu();
}

//Reset to the default filter.
function reset_filter() {
	r_filtered = [];
	r_filtered = regions.slice(1, 11);	//Load default region filter.
	load_menu();
}

//Search through the list of regions as the user enters letters.
function filter_list() {
	var input, list, items, r_name;
	input = document.getElementById("region_selector").value.toUpperCase();
	list = document.getElementById("regions_unselected");
	items = list.getElementsByTagName("li");
	for (var i in items) {
		r_name = items[i].getElementsByTagName("a")[0].textContent;
		if (r_name.toUpperCase().indexOf(input) == 0) {
			items[i].style.display = "";
		} else {
			items[i].style.display = "none";
		}
	}
}

//Apply the filter and hide the menu.
function hide_menu() {
	document.getElementById("overlay").style.display = "none";
	document.getElementById("menu").style.display = "none";
	refresh_params();
}

//Toggle the transformation of data from cumulative to incremental (first derivative). Default: Cumulative. No predictions for incremental data.
function toggle_transform() {
	var toggle_switch = document.getElementById("transform_toggle");
	var text = document.getElementById("transform");
	if (toggle_switch.checked == true){
		transform = false;
		text.innerHTML = "Cumulative Data";
	}
	else {
		transform = true;
		text.innerHTML = "Incremental Data";
	}
	toggle_pred();
	refresh_params();
}

//Calculate the first derivative (i.e. daily increment) of the series w.r.t. time.
function get_increment(series) {
	var increment = [];
	var prev_val = 0;
	for(var i in series) {
		increment.push(series[i] - prev_val)			//Susceptible to errors due to anomalous data and retrospective corrections.
		prev_val = series[i]
	}
	return(increment)
}

//Select the sub-filter to be applied to the data. Default: Infected. No predictions for active and recovered cases.
function set_subfilter(event, filter) {
	tabs = document.getElementsByClassName("tabs");
	for (var i = 0; i < tabs.length; i++) {
		tabs[i].className = tabs[i].className.replace(" active", "");
	}

	subfilter = filter;
	event.currentTarget.className += " active";
	set_scale();
	toggle_pred();
	refresh_params();
}

//Toggle the functionality of the scale parameter.
function set_scale() {
	var toggle_switch = document.getElementById("scale_toggle");
	if(subfilter == "Active") {
		toggle_switch.checked = true;
		toggle_switch.disabled = true;
		logScale = false;
		document.getElementById("scale").innerHTML = "Linear scale";
	}
	else {
		toggle_switch.disabled = false;
	}
}

//Set the scale of the Y-axis. Default: Linear.
function toggle_scale() {
	var toggle_switch = document.getElementById("scale_toggle");
	logScale = !toggle_switch.checked;
	var text = document.getElementById("scale");
	if (toggle_switch.checked == true){
		text.innerHTML = "Linear scale";
	}
	else {
		text.innerHTML = "Logarithmic scale";
	}
	refresh_params();
}

//Toggle the functionality of the prediction parameter.
function toggle_pred() {
	var trigger_switch = document.getElementById("pred_trigger");
	if(transform || (subfilter == "Active") || (subfilter == "Recovered")) {
		trigger_switch.checked = false;
		trigger_switch.disabled = true;
		pred = false;
	}

	else {
		trigger_switch.disabled = false;
		trigger_switch.checked = true;
		pred = true;
	}
}

//Activate or deactivate predictions.
function trigger_pred() {
	var trigger_switch = document.getElementById("pred_trigger");
	pred = trigger_switch.checked;
	refresh_params();
}

//Initialize the dual-range slider for adjusting the viewing window.
function init_slider(inputID, delta) {
	range = new Slider(inputID, { id: "range_slider", min: 0, max: delta, step: (24 * 60 * 60 * 1000), range: true, value: [0, delta] });	//step = 1 day (ms).
	range.on('change', function(value) {
		x_window = value["newValue"];
		refresh_params();
	});
	x_window = range.getValue();
}

//Enable chart rendering and initialize the chart.
function render_chart() {
	stop_render = false;
	refresh_params();
}

//Refresh the parameters and update the chart.
function refresh_params() {
	if(stop_render) {
		return;
	}

	else {
		//Initialize local variables.
		var data = [];
		var stripLines = [];
		var Ytitle = "";

		//Set overall chart parameters.
		if(transform) {		//Set Y-axis unit.
			Ytitle = "Cases per Day";
		}
		else {
			Ytitle = "Cases";
		}

		if(pred) {
			stripLines = [{			//Highlight the predictions.
				startValue: epoch + delta - (24 * 60 * 60 * 1000),		//Last day of update.
				endValue: epoch + delta,		//Day of prediction.
				color:"#ffc2b3", label:"Prediction", labelBackgroundColor: "#ffc2b3",
				labelFontFamily: "Serif", labelFontColor: "#da4a38", labelFontSize: 15, labelAlign: "center"
			}];
		}

		//Generate series from filtered data.
		for(var r in r_filtered) {
			series_data = chart_data["series"][r_filtered[r]];											//chart_data["National Total"]
			
			series = series_data[subfilter];														//chart_data["National Total"]["Infected"]
			dates =  series_data["Date"];
			preds = series_data["Prediction"];
			var dataPoints = [];			//Stores generated series.

			if(transform) {
				series = get_increment(series);				//Transform data if necessary.
			}
			
			for(var i in series) {
				if(logScale && (series[i] <= 0)) {				//Ignore anomalous sub-zero values to smoothen series in logarithmic scales.
					continue;
				}
				else {
					dataPoints.push({x: new Date(dates[i]), y: series[i]});			//Represent data as data points.
				}
			}

			if(pred) {						//Add predictions if enabled.
				if(subfilter == "Infected") {
					dataPoints.push({x: new Date(chart_data["interval"][1]), y: preds[0]});			//Insert the prediction.
				}
				else {						//Deceased.
					dataPoints.push({x: new Date(chart_data["interval"][1]), y: preds[1]});			//Insert the prediction.	
				}
			}
			
			data.push({
				type: "spline",
				visible: true,
				xValueType: "dateTime",
				name: r_filtered[r],
				showInLegend: true,
				lineThickness: 2,
				markerSize: 3,
				dataPoints: dataPoints
			});
		}

		var params = {
			animationEnabled: false,
			theme: "light2",
			backgroundColor: "#fafafa",
			colorSet: "colourTheme",
			title:{
				fontFamily: 'Poppins',
				fontSize: 25,
				text: subfilter + " Cases"
			},
			axisX: {
				fontFamily: 'Poppins',
				labelFontSize: 15,
				title: "Date",
				valueFormatString: "DD-MM-YY",
				minimum: epoch + x_window[0],
				maximum: epoch + x_window[1] + 30000000,
				stripLines: stripLines
			},
			axisY: {
				fontFamily: 'Poppins',
				labelFontSize: 15,
				title: Ytitle,
				includeZero: false,
				logarithmic: logScale
			},
			toolTip:{
				fontFamily: 'Poppins',
				content: "{name}: {y}<br>{x}"
			},
			legend: {
				fontFamily: 'Poppins',
				fontSize: 12,
				verticalAlign: "top",
				horizontalAlign: "center",
				dockInsidePlotArea: true,
				horizontalAlign: "center",
			},
			data: data
		};
		var chart = new CanvasJS.Chart("chart", params);
		chart.render();
	}
}
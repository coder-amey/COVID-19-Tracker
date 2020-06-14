function tabulate(summary, max_rows) {
	var table = "<h6>Last updated: " + summary["update_time"] + "</h6>\n";
	table += "<table class='table'><thead class='thead-dark'>\n";
	table += "<tr><th rowspan='2'>Region</th><th style='text-align: center' rowspan='2' colspan='2'>Confirmed</th>";
	table += "<th style='text-align: center' rowspan='2' colspan='2'>Active</th><th style='text-align: center' rowspan='2' colspan='2'>Recovered</th>";
	table += "<th style='text-align: center' rowspan='2' colspan='2'>Deceased</th><th style='text-align: center' colspan='2'>Prediction (for T + 1 Day)</th></tr>\n";
	table += "<tr><th style='text-align: center'>Confirmed</th><th style='text-align: center'>Deceased</th></tr>\n";
	table += "</thead>\n";
	table += "<tbody>\n";
	for (var i = 0; i < max_rows; i ++) {
		var row = summary["data"][i];
		table += "<tr><td class='region'>" + summary["index"][i] + "</td>";
		table += "<td class='statistic confirmed'> " + row[0] + " </td><td class='increment confirmed'><span class='up_light_red'></span><span style='padding-left:5px'> " + row[1] + "</span></td>";
		
		table += "<td class='statistic active'> " + row[2] + " </td>";
		if(row[3] > 0)
			table += "<td class='increment confirmed'><span class='up_red'></span><span style='padding-left:5px'> " + row[3] + "</span></td>";
		else if(row[3] < 0)
			table += "<td class='increment recovered'><span class='down_green'></span><span style='padding-left:5px'> " + row[3] + "</span></td>";
		else
			table += "<td class='increment active'> – <span style='padding-left:5px'> " + row[3] + "</span></td>";
		
		table += "<td class='statistic recovered'> " + row[4] + " </td><td class='increment recovered'><span class='up_green'></span><span style='padding-left:5px'> " + row[5] + "</span></td>";
		table += "<td class='statistic deceased'> " + row[6] + " </td><td class='increment deceased'><span class='up_red'></span><span style='padding-left:5px'> " + row[7] + "</span></td>";
		table += "<td class='prediction confirmed'> " + row[8] + "</td><td class='prediction deceased'> " + row[9] + " </td></tr>\n";
	}
	table += "</tbody></table>\n";
	document.getElementById("table").innerHTML = table;
}

function render_selection(summary) {
	selection = "<select id = 'country' class = 'sel'>\n";
	for(var i in summary["index"]) {
		selection += "<option value = '" + i + "'>" + summary["index"][i] + "</option>\n";	
	}
	selection += "</select>";
	selection += "<button type='button' class='btn' onclick = 'fetch_row(summary)'>Fetch Details</button>";
	document.getElementById("selection_pane").innerHTML = selection;
}

function fetch_row(summary) {
	var i = document.getElementById('country').selectedIndex;
	var row = summary['data'][i];
	var entry = "<h6>Last updated: " + summary["update_time"] + "</h6>\n";
	entry += "<table class='table'><thead class='thead-dark'>\n";
	entry += "<tr><th rowspan='2'>Region</th><th style='text-align: center' rowspan='2' colspan='2'>Confirmed</th>";
	entry += "<th style='text-align: center' rowspan='2' colspan='2'>Active</th><th style='text-align: center' rowspan='2' colspan='2'>Recovered</th>";
	entry += "<th style='text-align: center' rowspan='2' colspan='2'>Deceased</th><th style='text-align: center' colspan='2'>Prediction (for T + 1 Day)</th></tr>\n";
	entry += "<tr><th style='text-align: center'>Confirmed</th><th style='text-align: center'>Deceased</th></tr>\n";
	entry += "</thead>\n";
	entry += "<tbody><tr><td class='region'>" + summary["index"][i] + "</td>";
	entry += "<td class='statistic confirmed'> " + row[0] + " </td><td class='increment confirmed'><span class='up_light_red'></span><span style='padding-left:5px'> " + row[1] + "</span></td>";
	
	entry += "<td class='statistic active'> " + row[2] + " </td>";
	if(row[3] > 0)
		entry += "<td class='increment confirmed'><span class='up_red'></span><span style='padding-left:5px'> " + row[3] + "</span></td>";
	else if(row[3] < 0)
		entry += "<td class='increment recovered'><span class='down_green'></span><span style='padding-left:5px'> " + row[3] + "</span></td>";
	else
		entry += "<td class='increment active'> – <span style='padding-left:5px'> " + row[3] + "</span></td>";
	
	entry += "<td class='statistic recovered'> " + row[4] + " </td><td class='increment recovered'><span class='up_green'></span><span style='padding-left:5px'> " + row[5] + "</span></td>";
	entry += "<td class='statistic deceased'> " + row[6] + " </td><td class='increment deceased'><span class='up_red'></span><span style='padding-left:5px'> " + row[7] + "</span></td>";
	entry += "<td class='prediction confirmed'> " + row[8] + "</td><td class='prediction deceased'> " + row[9] + " </td></tr>\n";
	entry += "</tbody></table>\n";
	document.getElementById("selection").innerHTML = entry;
}
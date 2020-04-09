function tabulate(summary, max_rows) {
	var shade = 179;
	var step = (255 - shade) / max_rows;
	var table = "<h6>Last updated: " + summary["update_time"] + "</h6>\n";
	table += "<table class='table'><thead class='thead-dark'>\n";
	table += "<tr><th rowspan='2'>Region</th><th class='centred' rowspan='2'>Confirmed</th>";
	table += "<th class='centred' rowspan='2'>Recovered/Migrated</th><th class='centred' rowspan='2'>Deceased</th>";
	table += "<th class='centred' colspan='2'>Prediction (for T + 1 Day)</th></tr>\n";
	table += "<tr><th class='centred'>Confirmed</th><th class='centred'>Deceased</th></tr>\n";
	table += "</thead>\n";
	table += "<tbody>\n";
	for (var i = 0; i < max_rows; i ++) {
		var row = summary["data"][i];
		shade += step;
		table += "<tr style='background-color:#ff" + Math.round(shade).toString(16) + Math.round(shade).toString(16) + ";'><td class='region'>" + summary["index"][i] + "</td>";
		table += "<td class='confirmed'><span class = 'cell_block'>" + row[0] + " </span><span class='up_yellow'></span> <span class='increment'> " + row[1] + "</span></td>";
		table += "<td class='recovered'><span class = 'cell_block'>" + row[2] + " </span><span class='up_green'></span> <span class='increment'> " + row[3] + "</span></td>";
		table += "<td class='deceased'><span class = 'cell_block'>" + row[4] + "  </span><span class='up_red'></span> <span class='increment'> " + row[5] + "</span></td>";
		table += "<td class='confirmed'>" + row[6] + "</td><td class='deceased'>" + row[7] + "</td></tr>\n";
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
	var entry = "<table class='table'><thead class='thead-dark'>\n";
	entry += "<tr><th rowspan='2'>Region</th><th class='centred' rowspan='2'>Confirmed</th>";
	entry += "<th class='centred' rowspan='2'>Recovered/Migrated</th><th class='centred' rowspan='2'>Deceased</th>";
	entry += "<th class='centred' colspan='2'>Prediction (for T + 1 Day)</th></tr>\n";
	entry += "<tr><th class='centred'>Confirmed</th><th class='centred'>Deceased</th></tr>\n";
	entry += "</thead>\n";
	entry += "<tbody><tr style='background-color:#ffcbcb;'><td class='region'>" + summary["index"][i] + "</td>";
	entry += "<td class='confirmed'><span class = 'cell_block'>" + row[0] + " </span><span class='up_yellow'></span> <span class='increment'> " + row[1] + "</span></td>";
	entry += "<td class='recovered'><span class = 'cell_block'>" + row[2] + " </span><span class='up_green'></span> <span class='increment'> " + row[3] + "</span></td>";
	entry += "<td class='deceased'><span class = 'cell_block'>" + row[4] + "  </span><span class='up_red'></span> <span class='increment'> " + row[5] + "</span></td>";
	entry += "<td class='confirmed'>" + row[6] + "</td><td class='deceased'>" + row[7] + "</td></tr>\n";
	entry += "</tbody></table>\n";
	document.getElementById("selection").innerHTML = entry;
}
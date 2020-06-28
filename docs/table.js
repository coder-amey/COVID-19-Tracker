function init_params() {
	sort_by_col = 1;		//Active cases (default from JSON). {CNF: 1; ACT: 2; RCV: 3; DCS: 4}.
	ascending = false;		//Sort in descending order by default.
	index_arr = []		//Default array for table indices.
	for (var i = 0; i < summary["data"].length; i ++) {
		index_arr.push(i);
	}
}

function tabulate(summary, max_rows, order) {
	var table = "<h6>Last updated: " + summary["update_time"] + "</h6>\n";
	table += "<table class='table'><thead class='thead-dark'>\n";
	table += "<tr><th rowspan='2'>Region</th>";
	table += "<th style='text-align: center' rowspan='2' colspan='2'>Confirmed <a class='btn-floating' type='button' role='button' onclick='orderBy(0)'><i id='c0' class='fa fa-sort'></i></th>";
	table += "<th style='text-align: center' rowspan='2' colspan='2'>Active <a class='btn-floating' type='button' role='button' onclick='orderBy(1)'><i id='c1' class='fa fa-sort'></i></th>";
	table += "<th style='text-align: center' rowspan='2' colspan='2'>Recovered <a class='btn-floating' type='button' role='button' onclick='orderBy(2)'><i id='c2' class='fa fa-sort'></i></th>";
	table += "<th style='text-align: center' rowspan='2' colspan='2'>Deceased <a class='btn-floating' type='button' role='button' onclick='orderBy(3)'><i id='c3' class='fa fa-sort'></i></th>";
	table += "<th style='text-align: center' colspan='2'>Prediction (for T + 1 Day)</th></tr>\n";
	table += "<tr><th style='text-align: center'>Confirmed</th><th style='text-align: center'>Deceased</th></tr>\n";
	table += "</thead>\n";
	table += "<tbody>\n";
	for (var i = 0; i < max_rows; i ++) {
		var row = summary["data"][order[i]];
		table += "<tr><td class='region'>" + summary["index"][order[i]] + "</td>";
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
	
	//Decorate the sorted column.
	var sortBtn = document.getElementById("c" + String(sort_by_col));
	if(ascending)
		sortBtn.className = "fa fa-sort-asc";
	else
		sortBtn.className = "fa fa-sort-desc";
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

function swap_needed(a, b, ascending) {
	if(ascending)
		return(a > b);
	else
		return(a < b);
}

function sort(table, col, max_rows, ascending) {		//Selection sort.	
	var order = Array.from(index_arr);
	for (var i = 0; i < max_rows; i ++) {
		for (var j = i + 1; j < table.length; j ++) {
			if(swap_needed(table[order[i]][col], table[order[j]][col], ascending)) {
				var temp = order[i];
				order[i] = order[j];
				order[j] = temp;
			}
		}
	}
	return(order);
}

function	orderBy(col) {
	if(sort_by_col == col)
		ascending = !ascending; //Invert order.
	else {								//New column.
		sort_by_col = col;
		ascending = false;
	}
	var order = sort(summary["data"], 2 * sort_by_col, max_rows, ascending);
	tabulate(summary, max_rows, order);
}
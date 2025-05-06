// Vue.component('map', {
//   data: function () {
//     return {
//       count: 0
//     }
//   },
//   template: '<button v-on:click="count++">You clicked me {{ count }} times.</button>'
// })

var table = new Tabulator("#table", {
    layout:"fitColumns",
    placeholder:"No Data Yet",
	height:"calc( 100% - 2px)",
	paginationSize:6,
    paginationSizeSelector:[3, 6, 8, 10],
	renderHorizontal:"virtual",
	selectableRows:1,
	index: "write_millis",
    columns:[
		{title: "write_millis", field: "write_millis", sorter: "number", minWidth: 120},
		{title: "ecu_millis", field: "ecu_millis", sorter: "number", minWidth: 120},
		{title: "gps_millis", field: "gps_millis", sorter: "number", minWidth: 120},
		{title: "imu_millis", field: "imu_millis", sorter: "number", minWidth: 120},
		{title: "accel_millis", field: "accel_millis", sorter: "number", minWidth: 120},
		{title: "analogx1_millis", field: "analogx1_millis", sorter: "number", minWidth: 120},
		{title: "analogx2_millis", field: "analogx2_millis", sorter: "number", minWidth: 120},
		{title: "analogx3_millis", field: "analogx3_millis", sorter: "number", minWidth: 120},
		{title: "rpm", field: "rpm", sorter: "number", minWidth: 120},
		{title: "time", field: "time", sorter: "number", minWidth: 120},
		{title: "syncloss_count", field: "syncloss_count", sorter: "number", minWidth: 120},
		{title: "syncloss_code", field: "syncloss_code", sorter: "number", minWidth: 120},
		{title: "lat", field: "lat", sorter: "number", minWidth: 120},
		{title: "lon", field: "lon", sorter: "number", minWidth: 120},
		{title: "elev", field: "elev", sorter: "number", minWidth: 120},
		{title: "unixtime", field: "unixtime", sorter: "date", minWidth: 120},
		{title: "ground_speed", field: "ground_speed", sorter: "number", minWidth: 120},
		{title: "afr", field: "afr", sorter: "number", minWidth: 120},
		{title: "fuelload", field: "fuelload", sorter: "number", minWidth: 120},
		{title: "spark_advance", field: "spark_advance", sorter: "number", minWidth: 120},
		{title: "baro", field: "baro", sorter: "number", minWidth: 120},
		{title: "map", field: "map", sorter: "number", minWidth: 120},
		{title: "mat", field: "mat", sorter: "number", minWidth: 120},
		{title: "clnt_temp", field: "clnt_temp", sorter: "number", minWidth: 120},
		{title: "tps", field: "tps", sorter: "number", minWidth: 120},
		{title: "batt", field: "batt", sorter: "number", minWidth: 120},
		{title: "oil_press", field: "oil_press", sorter: "number", minWidth: 120},
		{title: "ltcl_timing", field: "ltcl_timing", sorter: "number", minWidth: 120},
		{title: "ve1", field: "ve1", sorter: "number", minWidth: 120},
		{title: "ve2", field: "ve2", sorter: "number", minWidth: 120},
		{title: "egt", field: "egt", sorter: "number", minWidth: 120},
		{title: "maf", field: "maf", sorter: "number", minWidth: 120},
		{title: "in_temp", field: "in_temp", sorter: "number", minWidth: 120},
		{title: "ax", field: "ax", sorter: "number", minWidth: 120},
		{title: "ay", field: "ay", sorter: "number", minWidth: 120},
		{title: "az", field: "az", sorter: "number", minWidth: 120},
		{title: "imu_x", field: "imu_x", sorter: "number", minWidth: 120},
		{title: "imu_y", field: "imu_y", sorter: "number", minWidth: 120},
		{title: "imu_z", field: "imu_z", sorter: "number", minWidth: 120},
		{title: "susp_pot_1 (FL)", field: "susp_pot_1", sorter: "number", minWidth: 120},
		{title: "susp_pot_2 (FR)", field: "susp_pot_2", sorter: "number", minWidth: 120},
		{title: "susp_pot_3 (RR)", field: "susp_pot_3", sorter: "number", minWidth: 120},
		{title: "susp_pot_4 (RL)", field: "susp_pot_4", sorter: "number", minWidth: 120},
		{title: "rad_in", field: "rad_in", sorter: "number", minWidth: 120},
		{title: "rad_out", field: "rad_out", sorter: "number", minWidth: 120},
		{title: "amb_air_temp", field: "amb_air_temp", sorter: "number", minWidth: 120},
		{title: "brake1", field: "brake1", sorter: "number", minWidth: 120},
		{title: "brake2", field: "brake2", sorter: "number", minWidth: 120}
    ],
});

function updateInfo() {
	let times = get_series("unixtime", TIME_BOUNDS[0], TIME_BOUNDS[1]);
	let tmin = times[0].toLocaleTimeString();
	let tmax = times[times.length-1].toLocaleTimeString();

	var seconds = (TIME_BOUNDS[1]-TIME_BOUNDS[0])/1000;
	seconds = Math.round(seconds*1000)/1000;

	var dist = turf.length(turf.lineString(get_points(null, TIME_BOUNDS[0], TIME_BOUNDS[1])), { units: "miles" });
	var units = "miles";
	if (dist < 1) {
		units = "feet";
		dist = turf.length(turf.lineString(get_points(null, TIME_BOUNDS[0], TIME_BOUNDS[1])), { units: "feet" });
	}


	document.getElementById("info").innerHTML = `
	<b>${tmin} &rarr; ${tmax}</b><br>
	<b>Time:</b> ${seconds} s<br>
	<b>Distance Traveled: </b> ${dist} ${units}<br>
	`
}

map = L.map('map_el').setView([34, -110], 3);
	L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
		maxZoom: 25,
		attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
	}).addTo(map);


new BookletWindow("#plot_c", {title:"Main Plot", x:300, y:150, w:800, h:500, closable:false})
new BookletWindow("#map", {title:"GPS Data Map", x:0, y:0, w:600, h:600, closable:false})
new BookletWindow("#table", {title:"Data Table", x:700, y:30, w:600, h:200, closable:false})
new BookletWindow("#info", {title:"Details", x:900, y:500, w:250, h:100, closable:false})

// actually do ArrayBuffer --> CSV conversion
function toData(buffer, n_ints, n_floats) {
	var data = [];
	let bytesPerRow = (4 * n_ints) + (4 * n_floats);
	let rows = buffer.byteLength / (bytesPerRow);
	let dataview = new DataView(buffer);

	// parse into 2D array...
	for (var row_i=0; row_i < rows; row_i++) {
		var row = [];
		try {
			// read values in row
			for (var i=0;i<n_ints;i++) row.push(dataview.getInt32((row_i*bytesPerRow)+(4*i), true)); // little endian!
			for (var i=0;i<n_floats;i++) row.push(dataview.getFloat32((row_i*bytesPerRow)+(4*i), true)); // little endian!
		} catch (e) {
			// length mismatch
			alert("Error: invalid # of timestamps/values or corrupted data...");
		}
		// add row to all rows
		data.push(row);
	}
	return data;
}
function toCSV(buffer, n_ints, n_floats) {
	// let data = toData(buffer, n_ints, n_floats);
	// // make actual CSV
	// var csv = "";
	// for (var row_i=0;row_i<data.length;row_i++) {
	// 	for (var i=0;i<(n_ints+n_floats);i++) {
	// 		csv += data[row_i][i];
	// 		if (i < (n_ints+n_floats - 1)) {
	// 			csv += ",";
	// 		}
	// 	}
	// 	csv += "\n";
	// }
	// return csv;

}


function toObjects(rawdata) {
	var out = [];
	rawdata.forEach(row=>{
		var o = {};
		o.write_millis = row[0];
		o.ecu_millis = row[1];
		o.gps_millis = row[2];
		o.imu_millis = row[3];
		o.accel_millis = row[4];
		o.analogx1_millis = row[5];
		o.analogx2_millis = row[6];
		o.analogx3_millis = row[7];
		o.rpm = row[8];
		o.time = row[9];
		o.syncloss_count = row[10];
		o.syncloss_code = row[11];
		o.lat = row[12]/10000000;
		o.lon = row[13]/10000000;
		o.elev = row[14];
		o.unixtime = new Date(row[15] * 1000);
		o.ground_speed = row[16] / 447.04;
		o.afr = row[17]/ 1000;
		o.fuelload = row[18]/ 1000;
		o.spark_advance = row[19]/ 1000;
		o.baro = row[20]/ 1000;
		o.map = row[21]/ 1000;
		o.mat = row[22]/ 1000;
		o.clnt_temp = row[23]/ 1000;
		o.tps = row[24]/ 1000;
		o.batt = row[25]/ 1000;
		o.oil_press = row[26]/ 1000;
		o.ltcl_timing = row[27]/ 1000;
		o.ve1 = row[28]/ 1000;
		o.ve2 = row[29]/ 1000;
		o.egt = row[30]/ 1000;
		o.maf = row[31]/ 1000;
		o.in_temp = row[32]/ 1000;
		o.ax = row[33]/ 1000;
		o.ay = row[34]/ 1000;
		o.az = row[35]/ 1000;
		o.imu_x = row[36]/ 1000;
		o.imu_y = row[37]/ 1000;
		o.imu_z = row[38]/ 1000;
		o.susp_pot_1 = ((((row[39]/5024))/(1))*(100))/25.4;
		o.susp_pot_2 = ((((row[40]/5024))/(1))*(100))/25.4;
		o.susp_pot_3 = ((((row[41]/5024))/(1))*(100))/25.4;
		o.susp_pot_4 = ((((row[42]/5024))/(1))*(100))/25.4;
		o.rad_in = (((row[43]/5024)-0.5232)/(0.0084-0.5232))*(302+58)-58;
		o.rad_out = (((row[44]/5024)-0.5232)/(0.0084-0.5232))*(302+58)-58;
		o.amb_air_temp = row[45];
		o.brake1 = 5000*(((row[46]/5024.0)-0.1)/0.8);
		o.brake2 = 5000*(((row[47]/5024.0)-0.1)/0.8);
		out.push(o);
	})
	return out;
}

var MAP_POINTER;
var TIMER_ID = 0;
var CURRENT_TIME = 4000;
var MAP_HOTLINE;
var TIME_BOUNDS = [0, Number.POSITIVE_INFINITY];
let hotline_opts = {
			min: 0,
			max: 50,
			palette: {
				0.0: '#008800',
				0.5: '#ffff00',
				1.0: '#ff0000'
			},
			weight: 5,
			outlineColor: '#000000',
			outlineWidth: 1
		};
// TO GET THE DATA FROM UPLOAD #################################################################
// https://stackoverflow.com/questions/32556664/getting-byte-array-through-input-type-file
document.querySelector('#fileupload').onchange = go;
function go() {
	var reader = new FileReader();
	reader.onload = function() {
		let n_ints = 48;
		let n_floats = 0;

		let csv = toCSV(this.result, n_ints, n_floats);
		let data = toData(this.result, n_ints, n_floats);

		let objects = toObjects(data);

		console.log(objects)
		window.objects = objects;


		// let geojson = JSON.stringify([{"type":"LineString","coordinates":points}]);
		// var geojson = [{"type": "LineString","coordinates": points}];
		// console.log(geojson)
		// MAP_JSON = L.geoJSON(geojson)
		// MAP_JSON.addTo(map);


		MAP_POINTER = L.marker([get_series("lat")[1], get_series("lon")[1]]);
		MAP_POINTER.addTo(map);
		updatemap()

		var bounds = MAP_HOTLINE.getBounds();
		map.fitBounds(bounds);


		// let csv = "file too large for csv for now...";
		// console.log(data);
		// var html = "";
		// for (var row_i=0;row_i<data.length;row_i++) {
		// 	html += "<tr>";
		// 	for (var i=0;i<(n_ints+n_floats);i++) {
		// 		html += "<td>" + data[row_i][i] + "</td>";
		// 	}
		// 	html += "</tr>";
		// }
		// console.log(html)
		// document.getElementById("table").innerHTML = html;
		// let table = new
		table.setData(objects);

		plot();
		setTimeout(plot, 500)
		// setTimeout(() => {
		// map.setView([objects[20].lat,objects[20].lon], 17)
		// }, 1000)
		let f = document.getElementById("fileupload").files[0].name;
		document.getElementById("welcome_container").remove()
		let d = get_series("unixtime").filter(i=>i>100)[0].toLocaleDateString();
		document.getElementById("logtitle").innerText = `${d} (${f})`;
		document.title = `${d} (${f}) - Wazzu Racing Datalog Viewer`
		let wm = get_series("write_millis")
		TIME_BOUNDS = [0, wm[wm.length-1]]

		function customFilter(data, filterParams){
			return data.write_millis > TIME_BOUNDS[0] && data.write_millis < TIME_BOUNDS[1]; //must return a boolean, true if it passes the filter.
		}

		table.setFilter(customFilter, {});
		table.on("rowClick", function(e, row){
			CURRENT_TIME = row.getData().write_millis;
			updateall()
		});
		updateInfo()


		// let out = document.getElementById("output");
		// out.innerHTML = csv;
		// out.style.height = (out.scrollHeight) + 20 + "px";
		// out.select();
		// download(csv, "data.csv", "text/plain");

		var a = document.getElementById("download");
		a.style.display = "inline";
		a.onclick = (_) => {table.download("csv", f.replace(".bin", ".csv"))};

	}
	reader.readAsArrayBuffer(document.getElementById("fileupload").files[0]);
}

function plot() {
	let field1 = document.getElementById("field1").value;
	let field2 = document.getElementById("field2").value;
	// let field3 = document.getElementById("field3").value;
	// let field4 = document.getElementById("field4").value;

	a = Plotly.newPlot('plot', [
			{
				x: get_series("write_millis"),
				y: get_series(field1),
				mode: 'lines',
				type: 'scatter',
				name: field1
			},
			{
				x: get_series("write_millis"),
				y: get_series(field2),
				mode: 'lines',
				type: 'scatter',
				yaxis: 'y2',
				name: field2
			},
			// {
			// 	x: [CURRENT_TIME, CURRENT_TIME],
			// 	y: [0, cursor_top],
			// 	mode: 'lines',
			// 	type: 'scatter',
			// 	// yaxis: 'y3',
			// 	// name: field2
			// },
			// {
				// x: get_series("write_millis"),
				// y: get_series(field4),
				// mode: 'lines',
				// type: 'scatter',
				// yaxis: 'y4',
				// name: field2
			// },
	], {
	yaxis: {title: {text: field1}},
  yaxis2: {title: {text: field2},overlaying: 'y',side: 'right'},
		autosize:true,
		margin: {
			l:40,r:10,t:10,b:20
		}
	}, {responsive:true});
	document.getElementById("plot").on('plotly_relayout', updateall);
	document.getElementById("plot").on('plotly_afterplot', updateall);
	document.getElementById("plot").on('plotly_click', function(data){
    var x = CURRENT_TIME;
    for(var i=0; i < data.points.length; i++){
        x = data.points[i].x;
    }
	CURRENT_TIME = x
		updateall()

});

}
function updateall(fromprog = false) {
		let min = document.getElementById("plot").layout.xaxis.range[0];
		let max = document.getElementById("plot").layout.xaxis.range[1];
		if (min && max) {
			TIME_BOUNDS = [min, max];
			if (CURRENT_TIME < TIME_BOUNDS[0]) CURRENT_TIME = TIME_BOUNDS[0]
			updatemap();
			table.refreshFilter();
			table.selectRow(CURRENT_TIME)
			table.scrollToRow(CURRENT_TIME)
			updateInfo()
		}
		if (!fromprog) {
			let prog = 10000 * ((CURRENT_TIME - TIME_BOUNDS[0]) / (TIME_BOUNDS[1] - TIME_BOUNDS[0]))
			document.getElementById("prog").value = prog
			// console.log(prog)
		}
	document.getElementById("curtime").innerText = Math.round(CURRENT_TIME/10)/100
}
document.getElementById("prog").onchange = () => {
	let p = document.getElementById("prog").value / 10000;
	let c = (p * (TIME_BOUNDS[1] - TIME_BOUNDS[0])) + TIME_BOUNDS[0]
	CURRENT_TIME = cclosest(c)
		updateall(false)
}
function cclosest(c) {
	return get_series("write_millis").reduce(function(prev, curr) {
	  return (Math.abs(curr - c) < Math.abs(prev - c) ? curr : prev);
	});

}
function changetime(a) {
	// alert()
	CURRENT_TIME = cclosest(CURRENT_TIME + a);
	updateall()
}
function updatemap() {
	if (MAP_HOTLINE) MAP_HOTLINE.remove();
	let hl = document.getElementById("hotline").value;
	let points = get_points(hl, TIME_BOUNDS[0], TIME_BOUNDS[1]);
	let val = points.map(i=>i[2]).filter(i=>!Number.isNaN(i))
	console.log(val)
	let minmax = arrayMinMax(val)
	hotline_opts.min = minmax[0]
	hotline_opts.max = minmax[1]
	console.log(hotline_opts)
	MAP_HOTLINE = L.hotline(points, hotline_opts);
	MAP_HOTLINE.addTo(map)
	let current = get_points("write_millis", CURRENT_TIME-1, CURRENT_TIME+1)[0]
	if (current) MAP_POINTER.setLatLng([current[0], current[1]])
}
function get_series(series, wm_min=null, wm_max=null) {
	if (wm_max && wm_min) {
		let filtered = objects.filter(i=>(i.write_millis<wm_max && i.write_millis>wm_min));
		// console.log(filtered)
		return filtered.map(i=>i[series])
	}
	return objects.map(i=>i[series])
}
function zip(arr1, arr2) {
    return arr1.map((element, index) => [element, arr2[index]]);
}

function get_points(z_axis, w_min, w_max) {
	var points = [];
	for (var i=0;i<objects.length;i+=1) {
		let t = objects[i];
		if (t.lat != 0 && t.lon != 0) {
			if (w_max) {
				if (t.write_millis < w_max && t.write_millis > w_min) {
					if (z_axis) points.push([t.lat, t.lon, t[z_axis]])
					else points.push([t.lat, t.lon])
				}
			} else {
				if (z_axis) points.push([t.lat, t.lon, t[z_axis]])
				else points.push([t.lat, t.lon])
			}
		}
		// layer.bindPopup(t)
		// markers.push(layer);
	}
	return points;
}
//https://stackoverflow.com/questions/42623071/maximum-call-stack-size-exceeded-with-math-min-and-math-max#52613386
const arrayMinMax = (arr) =>
  arr.reduce(([min, max], val) => [Math.min(min, val), Math.max(max, val)], [
    Number.POSITIVE_INFINITY,
    Number.NEGATIVE_INFINITY,
  ]);
// TO DOWNLOAD THE CSV FILE ====================================================================
// https://stackoverflow.com/questions/13405129/create-and-save-a-file-with-javascript
function download(text, name, type) {
	var a = document.getElementById("download");
	a.style.display = "inline";
	var file = new Blob([text], {type: type});
	a.href = URL.createObjectURL(file);
	a.download = name;
}

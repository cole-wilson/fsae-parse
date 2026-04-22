window.objects = [];

let live = false;
let last_wm_parse = -1;

var fname = "Untitled";

var gauge = new Gauge(document.getElementById('gg_c')).setOptions({
  angle: 0.15, // The span of the gauge arc
  lineWidth: 0.44, // The line thickness
  radiusScale: 1, // Relative radius
  // pointer: {
    // length: 0.6, // // Relative to gauge radius
    // strokeWidth: 0.035, // The thickness
    // color: '#000000' // Fill color
  // },
  limitMax: false,     // If false, max value increases automatically if value > maxValue
  limitMin: false,     // If true, the min value of the gauge will be fixed
  // colorStart: '#6FADCF',   // Colors
  // colorStop: '#8FC0DA',    // just experiment with them
  // strokeColor: '#E0E0E0',  // to see which ones work best for you
  // generateGradient: true,
  highDpiSupport: true,     // High resolution support

});
// gauge.maxValue = 0.5;
// gauge.setMinValue(-0.5);  // Prefer setter over gauge.minValue = 0
gauge.animationSpeed = 32; // set animation speed (32 is default value)
// gauge.set(1244); // set actual value

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
		{title: "breakout_millis", field: "breakout_millis", sorter: "number", minWidth: 120},
		{title: "gps_millis", field: "gps_millis", sorter: "number", minWidth: 120},
		{title: "imu_millis", field: "imu_millis", sorter: "number", minWidth: 120},
		{title: "accel_millis", field: "accel_millis", sorter: "number", minWidth: 120},
		{title: "analog_millis", field: "analog_millis", sorter: "number", minWidth: 120},
		{title: "thermo_millis", field: "thermo_millis", sorter: "number", minWidth: 120},
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
		{title: "susp_pot_3 (RL)", field: "susp_pot_3", sorter: "number", minWidth: 120},
		{title: "susp_pot_4 (RR)", field: "susp_pot_4", sorter: "number", minWidth: 120},
		{title: "oil_temp", field: "oil_temp", sorter: "number", minWidth: 120},
		{title: "amb_air_temp", field: "amb_air_temp", sorter: "number", minWidth: 120},
		{title: "brake1", field: "brake1", sorter: "number", minWidth: 120},
		{title: "brake2", field: "brake2", sorter: "number", minWidth: 120},
		{title: "rad_in", field: "rad_in", sorter: "number", minWidth: 120},
		{title: "rad_out", field: "rad_out", sorter: "number", minWidth: 120},
		{title: "steering", field: "steering", sorter: "number", minWidth: 120},
		{title: "thermo_1", field: "thermo_1", sorter: "number", minWidth: 120},
		{title: "thermo_2", field: "thermo_2", sorter: "number", minWidth: 120},
		{title: "thermo_3", field: "thermo_3", sorter: "number", minWidth: 120},
		{title: "thermo_4", field: "thermo_4", sorter: "number", minWidth: 120},
    ],
});

function updateInfo() {
	try {
	let times = get_series("unixtime", TIME_BOUNDS[0], TIME_BOUNDS[1]);
	let tmin = times[0].toLocaleTimeString();
	let tmax = times[times.length-1].toLocaleTimeString();

	var seconds = (TIME_BOUNDS[1]-TIME_BOUNDS[0])/1000;
	seconds = Math.round(seconds*1000)/1000;
	// console.warn(seconds)

	var dist = "no GPS data";
	var units = "";
	try {dist = turf.length(turf.lineString(get_points(null, TIME_BOUNDS[0], TIME_BOUNDS[1])), { units: "miles" });
		units = "miles";
		if (dist < 1) {
			units = "feet";
			dist = turf.length(turf.lineString(get_points(null, TIME_BOUNDS[0], TIME_BOUNDS[1])), { units: "feet" });
		}
	} catch (e) {}


	document.getElementById("info").innerHTML = `
	<b>${tmin} &rarr; ${tmax}</b><br>
	<b>Time:</b> ${seconds} s<br>
	<b>Distance Traveled: </b> ${dist} ${units}<br>
	`
	}
	catch (e) {

	}
}

navigator.serial.addEventListener("connect", (e) => {
  // Connect to `e.target` or add it to a list of available ports.
	console.log(e);
});

navigator.serial.addEventListener("disconnect", (e) => {
  // Remove `e.target` from the list of available ports.
	console.log(e);
});

navigator.serial.getPorts().then((ports) => {
  // Initialize the list of available ports with `ports` on page load.
	console.log(ports)
});

function startwebserial() {
	const usbVendorId = 0x239a;
	navigator.serial
		.requestPort({ filters: [{ usbVendorId}] })
		.then((port) => {
			console.log(port)
			read_data_from_serial(port);
		})
		.catch((_) => {
		  alert("Please select the reciever from the list of devices!");
		});
}

serial_buffer = [];
has_started = false;

async function read_data_from_serial(port) {
	await port.open({baudRate: 9600,});

	if (port.readable) {
		// start_with_bytes(new ArrayBuffer());
	}

	while (port.readable) {
		const reader = port.readable.getReader();
		try {
			while (true) {
				fname = "LIVE";
				const { value, done } = await reader.read();
				if (done) break;

				serial_buffer.push(...Array.from(value));
				let last_three = serial_buffer.slice(-3);

				if (last_three[0] == 10 && last_three[1] == 10 && last_three[2] == 10) {
					serial_buffer = serial_buffer.slice(0, -4);
					let ab = new Uint8Array(serial_buffer.slice(-(52 * 4)));
					serial_buffer = [];

					let data = toData(ab.buffer, 52, 0);
					let objects = toObjects(data);

					// console.log(objects[0]).write_millis;

					if (last_wm_parse > 0 && Math.abs(last_wm_parse - objects[0].write_millis) > 1000) {
						console.error(ab);
						console.error(objects[0]);
						// ...
						// alert()
					}
					else {
						window.objects.push(...objects);
						for (var i=0;i<objects.length;i++)
							table.addRow(objects[i])
						console.log("push");
						last_wm_parse = objects[0].write_millis;

						if (!has_started) {
							start();
							has_started = true;
							live = true;
						}

						updateall()
						if (live) {
							TIME_BOUNDS[0] = Math.max(CURRENT_TIME - (30 * 1000), TIME_BOUNDS[0]);
							CURRENT_TIME = objects.slice(-1)[0].write_millis;
							TIME_BOUNDS[1] = CURRENT_TIME;
						}
					}
				}

			}
		} catch (error) {
		} finally {
			reader.releaseLock();
		}
	}
	alert("Lost connection...")
}

map = L.map('map_el').setView([34, -110], 3);
	L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
		maxZoom: 25,
		attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
	}).addTo(map);


new BookletWindow("#plot_c", {title:"Main Plot", x:300, y:150, w:800, h:500, closable:false})
new BookletWindow("#gg", {title:"Gauge", x:700, y:300, w:400, h:400, closable:false})
new BookletWindow("#map", {title:"GPS Data Map", x:0, y:0, w:600, h:600, closable:false})
new BookletWindow("#table", {title:"Data Table", x:700, y:30, w:600, h:200, closable:false})
new BookletWindow("#info", {title:"Details", x:900, y:500, w:250, h:100, closable:false})
new BookletWindow("#oneval", {title:"Watch Value", x:900, y:50, w:250, h:120, closable:false})

// actually do ArrayBuffer --> data conversion
function toData(buffer, n_ints, n_floats) {
	// console.log(buffer)
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
			// alert("Error: invalid # of timestamps/values or corrupted data...");
		}
		// // add row to all rows
		// if (row[0] >= 0) {
		// 	if (last_wm_parse < 0 || (row[0] > (last_wm_parse - 1000) && row[0] < (last_wm_parse + 1000) )) {
				data.push(row);
		// 		last_wm_parse = row[0];
		// 	}
		// }
	}
	return data;
}

function toObjects(rawdata) {
	var out = [];
	rawdata.forEach(row=>{
		var o = {};
		o.write_millis = row[0];//Math.round((Number(new Date()) - 1764987313311)/1); //row[0];
		o.ecu_millis = row[1];
		o.breakout_millis = row[2]
		o.gps_millis = row[3];
		o.imu_millis = row[4];
		o.accel_millis = row[5];
		o.analog_millis = row[6];
		o.thermo_millis = row[7];
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
		o.maf = row[30]/ 1000;
		o.in_temp = row[31]/ 1000;
		o.ax = row[32]/ 1000;
		o.ay = row[33]/ 1000;
		o.az = row[34]/ 1000;
		o.imu_x = row[35]/ 1000;
		o.imu_y = row[36]/ 1000;
		o.imu_z = row[37]/ 1000;
		o.susp_pot_1 = ((((row[38]/5024))/(1))*(100))/25.4;
		o.susp_pot_2 = ((((row[39]/5024))/(1))*(100))/25.4;
		o.susp_pot_3 = ((((row[40]/5024))/(1))*(100))/25.4;
		o.susp_pot_4 = ((((row[41]/5024))/(1))*(100))/25.4;
		o.oil_temp = row[42]/ 1000;
		o.amb_air_temp = row[43];
		o.brake1 = 5000*(((row[44]/5024.0)-0.1)/0.8);
		o.brake2 = 5000*(((row[45]/5024.0)-0.1)/0.8);
		o.rad_in = (((row[46]/5024)-0.5232)/(0.0084-0.5232))*(302+58)-58;
		o.rad_out = (((row[47]/5024)-0.5232)/(0.0084-0.5232))*(302+58)-58;
		o.steering = row[48]/ 1000;
		o.thermo_1 = row[49]/ 1000;
		o.thermo_2 = row[50]/ 1000;
		o.thermo_3 = row[51]/ 1000;
		o.thermo_4 = row[52]/ 1000;
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
function fromfile(databytes) {
	let data = toData(databytes, 52, 0);
	let objects = toObjects(data);
	console.log(objects)

	window.objects = objects;


	document.getElementById("gotolive").remove();

	table.setData(objects);

	start();

	updateall();
}
// TO GET THE DATA FROM UPLOAD #################################################################
// https://stackoverflow.com/questions/32556664/getting-byte-array-through-input-type-file
document.querySelector('#fileupload').onchange = gofileupload;
function gofileupload() {
	var reader = new FileReader();
	reader.onload = function() {
		fname = document.getElementById("fileupload").files[0].name;
		fromfile(this.result);
	}
	reader.readAsArrayBuffer(document.getElementById("fileupload").files[0]);
}

function start() {
		MAP_POINTER = L.marker([get_series("lat")[1], get_series("lon")[1]]);
		MAP_POINTER.addTo(map);
		updatemap()


		// TIME_BOUNDS[1] = arrayMinMax(get_series("write_millis"))[1];
		// console.log(get_series("write_millis"))

		setTimeout(plot, 200);

		var bounds = MAP_HOTLINE.getBounds();
		try {
			map.fitBounds(bounds);
		} catch {
			// console.error(bounds)
		}


		document.getElementById("welcome_container").remove();

		var d = "";
		try {
			d = get_series("unixtime").filter(i=>i>100)[0].toLocaleDateString();
		} catch (e) {}
		document.getElementById("logtitle").innerText = `${d} (${fname})`;
		document.title = `${d} (${fname}) - Wazzu Racing Datalog Viewer`
		// let wm = get_series("write_millis")
		// TIME_BOUNDS = [0, wm[wm.length-1]]

		function customFilter(data, filterParams){
			return data.write_millis > TIME_BOUNDS[0] && data.write_millis < TIME_BOUNDS[1]; //must return a boolean, true if it passes the filter.
		}

		table.setFilter(customFilter, {});
		table.on("rowClick", function(e, row){
			CURRENT_TIME = row.getData().write_millis;
			live = false;
			updateall()
		})
		updateInfo()



		var a = document.getElementById("download");
		a.style.display = "inline";
		a.onclick = (_) => {table.download("csv", fname.replace(".bin", ".csv"))};

		CURRENT_TIME = cclosest(0)

		booklet_load(localStorage.getItem("booklet-save") || []);

		setTimeout(updateall, 300);
		setInterval(updatesave, 1000);
}

function updatesave() {
	localStorage.setItem("booklet-save", booklet_save())
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
			// 	x: [CURRENT_TIME, CURRENT_TIME+0.001],
			// 	y: [0, 1],
			// 	mode: 'lines',
			// 	xaxis: 'x',
			// 	type: 'scatter',
			// 	yaxis: 'y2',
			// 	name: "current time"
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
		xaxis: {
		  range: TIME_BOUNDS,
	   },
	yaxis: {title: {text: field1}},
  yaxis2: {title: {text: field2},overlaying: 'y',side: 'right'},
  yaxis3: {title: {text: field2},overlaying: 'y',side: 'right'},
		autosize:true,
		margin: {
			l:40,r:10,t:10,b:20
		}
	}, {responsive:true});
	document.getElementById("plot").on('plotly_relayout', updateall);
	document.getElementById("plot").on('plotly_afterplot', updateall);
	document.getElementById("plot").on('plotly_click', function(data){
		CURRENT_TIME = data.points[0].x
		live = false;
		updateall();
	});
	if (live) setTimeout(plot, 200)
}



function updateall(fromprog = false) {
		let wm = get_series("write_millis");

		let point_num = wm.indexOf(CURRENT_TIME);
		Plotly.Fx.hover("plot",[{curveNumber: 0, pointNumber: point_num}])
		// Plotly.Fx.hover("plot",[{curveNumber: 1, pointNumber: point_num}])


		let min = 0;
		let max = 0;
		if (document.getElementById("plot").layout && !live) {
			min = document.getElementById("plot").layout.xaxis.range[0];
			max = document.getElementById("plot").layout.xaxis.range[1];
			// if (min != TIME_BOUNDS[0]) live = false;
		}
		if (min && max) {
			TIME_BOUNDS = [min, max];
			if (live) {
				TIME_BOUNDS[1] = wm[wm.length-1];
			}
			if (CURRENT_TIME < TIME_BOUNDS[0]) CURRENT_TIME = cclosest(TIME_BOUNDS[0])
			updatemap();
			table.refreshFilter();
			// table.selectRow(CURRENT_TIME)
		}

			let ggval = document.getElementById("field_g").value;
			gauge.set(get_series(ggval, CURRENT_TIME-1, CURRENT_TIME+1)[0]);


			let watchval = document.getElementById("watch").value;
			document.getElementById("watchval").innerHTML = get_series(watchval, CURRENT_TIME-1, CURRENT_TIME+1)[0];

			let arr = get_series(watchval, TIME_BOUNDS[0], TIME_BOUNDS[1]);
			const average = arr => arr.reduce((a, b) => a + b, 0) / arr.length;
			const minmax = arrayMinMax(arr);
			document.getElementById("watchmore").innerHTML = `<br>
				<b>Min:</b> ${minmax[0]}<br>
				<b>Max:</b> ${minmax[1]}<br>
				<b>Mean:</b> ${average(arr)}<br>
				`


// 			// from chatgpt:
			let horizontal = table.scrollLeft;
			table.scrollToRow(CURRENT_TIME).then(()=>{table.scrollLeft = horizontal;})
// 			// end
			updateInfo()
		if (!fromprog) {
			let prog = 10000 * ((CURRENT_TIME - TIME_BOUNDS[0]) / (TIME_BOUNDS[1] - TIME_BOUNDS[0]))
			document.getElementById("prog").value = prog
			// console.log(prog)
		}
	document.getElementById("curtime").innerText = Math.round(CURRENT_TIME/10)/100
	updatesave()
}
document.getElementById("prog").oninput = () => {
	let p = document.getElementById("prog").value / 10000;
	let c = (p * (TIME_BOUNDS[1] - TIME_BOUNDS[0])) + TIME_BOUNDS[0]
	// c2 = cclosest(c)
	// console.log(c2)
	live = false;
	CURRENT_TIME = cclosest(c);
	updateall()
}
// function cclosest(c) {
// 	return get_series("write_millis").reduce(function(prev, curr) {
// 	  return (Math.abs(curr - c) < Math.abs(prev - c) ? curr : prev);
// 	});
// }
function cclosest(c) {
	var series = get_series("write_millis");
	for (var i=0;i<series.length-1;i++) {
		if (series[i] <= c && series[i+1] >= c) {
			return series[i];
		}
	}
	return c;
}
function changetime(a) {
	// alert()
	if (live) {
		live = false;
	}
	CURRENT_TIME = cclosest(CURRENT_TIME + a);
	updateall()
}
function updatemap() {
	if (MAP_HOTLINE) MAP_HOTLINE.remove();
	let hl = document.getElementById("hotline").value;
	let points = get_points(hl, TIME_BOUNDS[0], TIME_BOUNDS[1]);
	let val = points.map(i=>i[2]).filter(i=>!Number.isNaN(i))
	let minmax = arrayMinMax(val)
	// console.log(minmax)
	hotline_opts.min = minmax[0]
	hotline_opts.max = minmax[1]
	// console.log(hotline_opts)
	MAP_HOTLINE = L.hotline(points, hotline_opts);
	MAP_HOTLINE.on("click", function(e) {
		console.log(e)
		let line = MAP_HOTLINE._latlngs;
		var min_dist = Infinity;
		var min_index = -1;
		for (var i = 0;i<line.length;i++) {
			d = turf.distance(turf.point([line[i].lng, line[i].lat]), turf.point([e.latlng.lng, e.latlng.lat]));
			if (d < min_dist) {min_dist = d;min_index = i};
		}
		CURRENT_TIME = get_points("write_millis", TIME_BOUNDS[0], TIME_BOUNDS[1])[min_index][2];
		updateall()
		// alert(CURRENT_TIME)
	})
	MAP_HOTLINE.addTo(map)

	let current = get_points("write_millis", CURRENT_TIME-1, CURRENT_TIME+1)[0]
	if (current) MAP_POINTER.setLatLng([current[0], current[1]])
}
function get_series(series, wm_min=null, wm_max=null) {
	if (wm_max && wm_min) {
		let filtered = objects.filter(i=>(i.write_millis<wm_max && i.write_millis>=wm_min));
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
	// console.log(points);
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


// SW ============================================================================================
if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      let reg = await navigator.serviceWorker.register('/sw.js');
      console.log('sw registration successful:', reg);
    } catch (err) {
      console.log('sw registration failed:', err);
    }
  });
}

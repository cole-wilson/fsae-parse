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
		{title: "susp_pot_1", field: "susp_pot_1", sorter: "number", minWidth: 120},
		{title: "susp_pot_2", field: "susp_pot_2", sorter: "number", minWidth: 120},
		{title: "susp_pot_3", field: "susp_pot_3", sorter: "number", minWidth: 120},
		{title: "susp_pot_4", field: "susp_pot_4", sorter: "number", minWidth: 120},
		{title: "rad_in", field: "rad_in", sorter: "number", minWidth: 120},
		{title: "rad_out", field: "rad_out", sorter: "number", minWidth: 120},
		{title: "amb_air_temp", field: "amb_air_temp", sorter: "number", minWidth: 120},
		{title: "brake1", field: "brake1", sorter: "number", minWidth: 120},
		{title: "brake2", field: "brake2", sorter: "number", minWidth: 120}
    ],
});

map = L.map('map').setView([34, -110], 3);
	L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
		maxZoom: 25,
		attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
	}).addTo(map);


new BookletWindow("#table", {title:"Data Table", x:0, y:0, w:400, h:200, closable:false})
new BookletWindow("#plot_c", {title:"Main Plot", x:0, y:200, w:400, h:200, closable:false})
new BookletWindow("#map", {title:"GPS Data Map", x:0, y:400, w:400, h:200, closable:false})

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
	let data = toData(buffer, n_ints, n_floats);
	// make actual CSV
	var csv = "";
	for (var row_i=0;row_i<data.length;row_i++) {
		for (var i=0;i<(n_ints+n_floats);i++) {
			csv += data[row_i][i];
			if (i < (n_ints+n_floats - 1)) {
				csv += ",";
			}
		}
		csv += "\n";
	}
	return csv;

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
		o.brake1 = row[46] / 5024;
		o.brake2 = row[47] / 5024;
		out.push(o);
	})
	return out;
}


// TO GET THE DATA FROM UPLOAD #################################################################
// https://stackoverflow.com/questions/32556664/getting-byte-array-through-input-type-file
var markers = [];
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


		for (var i=0;i<objects.length;i+=10) {
			let t = objects[i];
			var layer = L.circleMarker([t.lat, t.lon], {color: "red",radius: 3,opacity: 0,fillOpacity: 1,weight: 0}).addTo(map);
			layer.bindPopup(t)
			markers.push(layer);
		}

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
		setTimeout(() => {
		map.setView([objects[20].lat,objects[20].lon], 17)
		}, 1000)
		let f = document.getElementById("fileupload").files[0].name;
		document.getElementById("welcome").remove()
		let d = get_series("unixtime").filter(i=>i>100)[0].toLocaleDateString();
		document.getElementById("logtitle").innerText = `${d} (${f})`;
		document.title = `${d} (${f}) - Wazzu Racing Data Viewer`
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
	], {
	yaxis: {
    title: {
      text: field1
    }
  },
  yaxis2: {
    title: {
      text: field2
    },
    overlaying: 'y',
    side: 'right'
  },
		autosize:true,
		margin: {
			l:40,r:10,t:10,b:20
		}
	}, {responsive:true});
	a.then(p=>setInterval(p.resize, 500))


}

function get_series(series) {
	return objects.map(i=>i[series])
}

// TO DOWNLOAD THE CSV FILE ====================================================================
// https://stackoverflow.com/questions/13405129/create-and-save-a-file-with-javascript
function download(text, name, type) {
	var a = document.getElementById("download");
	a.style.display = "inline";
	var file = new Blob([text], {type: type});
	a.href = URL.createObjectURL(file);
	a.download = name;
}

var data = document.documentElement.innerHTML;
document.documentElement.innerHTML = '';

console.log(data);

var json = JSON.parse(data);

var lat = json.lat;
var lon = json.lon;
var date = new Date(json.date);

var moonPos = SunCalc.getMoonPosition(date, lat, lon);
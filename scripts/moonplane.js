var planeApiUrl = 'https://moonplane.000webhostapp.com/planeapi.php?';
var moonApiUrl = 'https://moonplane.000webhostapp.com/moonapi.php?';

var latlonBtn = document.getElementById('latlonBtn');
var latInput = document.getElementById('latInput');
var lonInput = document.getElementById('lonInput');

var table = document.getElementById('table');

var planes = [];
var planeColors = {};
var arePlanesRefreshed = false;

var moon;

var scanLineX = 0;

latlonBtn.onclick = function() 
{
  if(latInput.value!=='' && lonInput.value!=='')
  {
     planeApiUrl = 'https://moonplane.000webhostapp.com/planeapi.php?';
     moonApiUrl = 'https://moonplane.000webhostapp.com/moonapi.php?';
     planeApiUrl += 'dist=50&lat=' + latInput.value + "&lon=" + lonInput.value;
     moonApiUrl += 'lat=' + latInput.value + "&lon=" + lonInput.value;
     refreshPlanes();
     refreshMoon();
  }
  
};

function setup() 
{

  if(latInput.value!=='' && lonInput.value!=='')
  {
     planeApiUrl += 'dist=50&lat=' + latInput.value + "&lon=" + lonInput.value;
     moonApiUrl += 'lat=' + latInput.value + "&lon=" + lonInput.value;
     refreshPlanes();
     setInterval(refreshPlanes, 15000);
     refreshMoon();
     setInterval(refreshMoon, 15000);
  }

  var myCanvas = createCanvas(1200, 640);
  myCanvas.parent('canvas');
  moon =  new Moon(0,0,0);
  background(51);
}

function draw() 
{
   background(51);
   /* Scan line animating */
  strokeWeight(10);
  stroke('rgb(255,255,255)');
  line(scanLineX, 0, scanLineX, height);
  stroke(51);
  line(scanLineX-10, 0, scanLineX-10, 480);
  scanLineX = scanLineX != width*3 ? scanLineX + 10 : 0;

  if(arePlanesRefreshed||true)
  {
    table.innerHTML = '<tr><th>Callsign</th><th>Distance</th><th>Speed</th><th>Altitude</th><th>Heading</th><th>Origin country</th><th>Co-ordinates</th><th>Vertical rate</th></tr>';
    for(var i = 0; i < planes.length; i++) /* Update plane stuffs */
    {
      var x = map(planes[i].az, 0, 360, 0, width);
      var y = map(planes[i].al, 0, 90, height, 0);
      var r = map(planes[i].dist, 0, 60, 20, 1);

      table.innerHTML += '<tr style="background-color: ' + planes[i].color + ';"><td data-th="Callsign">'+ planes[i].name +'</td><td data-th="Distance">'+ planes[i].dist +'</td><td data-th="Speed">'+ planes[i].vel +'</td><td data-th="Altitude">'+ planes[i].altitude +'</td><td data-th="Heading">'+ planes[i].heading +'</td><td data-th="Origin country">'+ planes[i].country +'</td><td data-th="Co-ordinates">'+ planes[i].lat + ', ' + planes[i].lon + '</td><td data-th="Vertical rate">'+ planes[i].verticalrate +'</td></tr>';

      strokeWeight(2);
      stroke(255,255,255);
      fill(planes[i].color);
      ellipse(x-r, y-r, 2*r, 2*r);
    }

    arePlanesRefreshed = false;
  }

  var x = map(moon.az, 0, 360, 0, 1200);
  var y = map(moon.al, 0, 90, 480, 0);
  strokeWeight(2);
  stroke('rgb(220,220,220)');
  fill('rgb(220,220,220)');
  ellipse(x-25, y-25, 50, 50);

}

class Plane
{
  constructor(az, al, dist, name, color, altitude, lat, lon, vel, country, heading, verticalrate)
  {
    this.az = az;
    this.al = al;
    this.dist = dist;
    this.name = name;
    this.color = color;
    this.altitude = altitude;
    this.lat = lat;
    this.lon = lon;
    this.vel = vel;
    this.country = country;
    this.heading = heading;
    this.verticalrate = verticalrate;
  }
}

class Moon
{
  constructor(az, al, dist)
  {
    this.az = az;
    this.al = al;
    this.dist = dist;
  }
}

function refreshPlanes()
{
  $.get(planeApiUrl, function(response)
  {
    var data = JSON.parse(response);
    console.log(data);
    planes = [];
    for(var i = 0; i < Object.keys(data).length; i++)
    {
      var az = data[i][13];
      var al = data[i][14];
      var dist = data[i][15];
      var name = data[i][1];
      var altitude = data[i][7];
      var lat = data[i][5];
      var lon = data[i][6];
      var vel = data[i][9];
      var country = data[i][2];
      var heading = data[i][10];
      var verticalrate = data[i][10];

      var color = 'rgb(' + floor(random(255)) + ', ' + floor(random(255)) + ', ' + floor(random(255)) + ')';

      if(typeof planeColors[name] !== 'undefined')
      {
        color = planeColors[name];
      }

      planes.push(new Plane(az, al, dist, name, color, altitude, lat, lon, vel, country, heading, verticalrate));
      planeColors[name] = color;
      arePlanesRefreshed = true;
    }
  });
}

function refreshMoon()
{
  $.get(moonApiUrl, function(response)
  {
    //console.log(response);
    var data = JSON.parse(response);
    //console.log(data);
    moon.az = data.azimuth + 180;
    moon.al = data.altitude;
    moon.dist = data.distance;
  });
}
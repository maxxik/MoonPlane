var planeApiUrl = 'http://moonplane.000webhostapp.com/planeapi.php?';
var moonApiUrl = 'http://moonplane.000webhostapp.com/moonapi.php?';

var latlonBtn = document.getElementById('latlonBtn');
var addBtn = document.getElementById('addBtn');
var latInput = document.getElementById('latInput');
var lonInput = document.getElementById('lonInput');
var addInput = document.getElementById('addInput');

var table = document.getElementById('table');

var planes = [];
var planeColors = {};
var avgRadiusOfAPlane = 0.025;

var moon;
var radiusOfMoon = 1737.4;

var isRefreshed = false;

function setup() 
{
  moon = new Moon(0,0,0);

  var myCanvas = createCanvas(displayWidth/1.5, displayHeight/1.5);
  myCanvas.parent('canvas');

  noLoop();
  background(51);

  if(addInput.value !== '') // If coords are given
  {
     planeApiUrl = 'http://moonplane.000webhostapp.com/planeapi.php?';
     moonApiUrl = 'http://moonplane.000webhostapp.com/moonapi.php?';
     planeApiUrl += 'dist=50&address=' + addInput.value;
     moonApiUrl += 'address=' + addInput.value;
     refresh();
     setInterval(refresh, 15000);
  }
}

function refresh()
{
  refreshMoon();
  refreshPlanes(show);
}

function show()
{
  background(51); // Clear canvas

  /* Update and draw moon stuff */
  moon.show();

  /* Update and draw plane stuff */
  table.innerHTML = '<tr><th>Callsign</th><th>Distance</th><th>Speed</th><th>Altitude</th><th>Heading</th><th>Origin country</th><th>Co-ordinates</th><th>Vertical rate</th></tr>';
  planes.forEach(function(plane)
  {
    /* Update table rows */
    table.innerHTML += '<tr style="background-color: ' + plane.color + ';"><td data-th="Callsign">'+ plane.name +'</td><td data-th="Distance">'+ plane.dist +'</td><td data-th="Speed">'+ plane.vel +'</td><td data-th="Altitude">'+ plane.altitude +'</td><td data-th="Heading">'+ plane.heading +'</td><td data-th="Origin country">'+ plane.country +'</td><td data-th="Co-ordinates">'+ plane.lat + ', ' + plane.lon + '</td><td data-th="Vertical rate">'+ plane.verticalrate +'</td></tr>';
    
    /* Show planes */
    plane.show();

  });

  noStroke();
  fill(255);
  text("N", 10, height - 10);
  text("N", width-10, height - 10);
  text("S", width/2, height - 10);
  text("E", width/4, height - 10);
  text("W", width*3/4, height - 10);
}

latlonBtn.onclick = function() 
{
  if(latInput.value!=='' && lonInput.value!=='')
  {
     planeApiUrl = 'http://moonplane.000webhostapp.com/planeapi.php?';
     moonApiUrl = 'http://moonplane.000webhostapp.com/moonapi.php?';
     planeApiUrl += 'dist=50&lat=' + latInput.value + "&lon=" + lonInput.value;
     moonApiUrl += 'lat=' + latInput.value + "&lon=" + lonInput.value;
     refresh();
  }
};

addBtn.onclick = function() 
{
  if(addInput.value!=='')
  {
     planeApiUrl = 'http://moonplane.000webhostapp.com/planeapi.php?';
     moonApiUrl = 'http://moonplane.000webhostapp.com/moonapi.php?';
     planeApiUrl += 'dist=50&address=' + addInput.value;
     moonApiUrl += 'address='  + addInput.value;
     refresh();
  }
};

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
    this.ang = atan(avgRadiusOfAPlane/this.dist)*2;
  }
  show()
  {
      var x = map(this.az, 0, 360, 0, width);
      var y = map(this.al, 0, 90, height, 0);
      var r = map(this.ang, 0, PI/2, 10, height);

        /* Draw plane */
      strokeWeight(2);
      stroke(255,255,255);
      fill(this.color);
      ellipse(x-r, y-r, 2*r, 2*r);
  }
}

class Moon
{
  constructor(az, al, dist)
  {
    this.az = az;
    this.al = al;
    this.dist = dist;
    this.ang = atan(radiusOfMoon/this.dist)*2;
  }

  show()
  {
    var x = map(this.az, 0, 360, 0, width);
    var y = height-map(this.al, -90, 90, -height, height);
    var r = map(this.ang, 0, PI/2, 10, height);

    strokeWeight(2);
    stroke(220,220,220);
    fill(220,220,220);
    ellipse(x-r, y-r, 2*r, 2*r);

    noStroke();
    fill(255,255,255);
    textAlign(CENTER);
    text("Moon", x - r, y + r);
  }
}

function refreshPlanes(callback)
{
  $.get(planeApiUrl, function(response)
  {
    var data = JSON.parse(response);
    planes = [];
    for(var i = 0; i < Object.keys(data).length; i++)
    {
      var az = data[i][13];
      var al = data[i][14];
      var dist = data[i][15];
      var name = data[i][1];
      var altitude = data[i][7];
      var lat = data[i][6];
      var lon = data[i][5];
      var vel = data[i][9];
      var country = data[i][2];
      var heading = data[i][10];
      var verticalrate = data[i][10];

      var color = 'rgb(' + floor(random(255)) + ', ' + floor(random(255)) + ', ' + floor(random(255)) + ')';
      if(name == '')
      {
        name = "UNKNOWN" + floor(random(1000));
      }

      if(typeof planeColors[name] !== 'undefined')
      {
        color = planeColors[name];
      }

      planes.push(new Plane(az, al, dist, name, color, altitude, lat, lon, vel, country, heading, verticalrate));
      planeColors[name] = color;
    }
    callback();
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
    moon.ang = atan(radiusOfMoon/moon.dist)*2;
    isRefreshed = true;
    //console.log(moon);
  });
}

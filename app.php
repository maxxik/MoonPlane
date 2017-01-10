<html lang="en">
<head>
  <meta charset="utf-8">

  <title>Moon and Plane</title>
  <meta name="description" content="When a Plane overlays the Moon... dAgkdjs">
  <meta name="author" content="GuMa">
</head>

<body>
  <input type="number" id="latInput" placeholder="Latitude" style="margin-bottom: 20px" value=<?php 
      echo '"'.$_GET['lat'].'"';
    ?>></input>
  <input type="number" id="lonInput" placeholder="Longitude" style="margin-bottom: 20px" value=<?php 
      echo '"'.$_GET['lon'].'"';
    ?>></input>
  <button id="latlonBtn" style="margin-bottom: 20px">OK</button>

  <div id='canvas'></div>

<table class="rwd-table" id="table">
  <tr>
    <th>Callsign</th>
    <th>Distance</th>
    <th>Speed</th>
    <th>Altitude</th>
    <th>Heading</th>
    <th>Origin country</th>
    <th>Co-ordinates</th>
    <th>Vertical rate</th>
  </tr>
</table>


  <script src="scripts/moonplane.js"></script>
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js"></script>
  <script src="scripts/p5.js"></script>

  

</body>
</html>
<?php
    include('geolocation.php');
    include('config.php');
    $geolocation = new GeoLocation();

    $obs_lat = null;
    $obs_lon = null;
    $distance = null;

    if(isset($_GET['lat']) && isset($_GET['lon']) && isset($_GET['dist']))
    {
      $obs_lat = $_GET['lat'];
      $obs_lon = $_GET['lon'];
      $distance = $_GET['dist'];
    }
    else
    {
      die('ERROR CODE: 1');
    }

    $observer = $geolocation -> fromDegrees($obs_lat, $obs_lon);


    $plainsource = file_get_contents("https://opensky-network.org/api/states/all");


    $elevationsource = file_get_contents('https://maps.googleapis.com/maps/api/elevation/json?locations='. $obs_lat.','.$obs_lon.'&key='. GOOGLE_ALT_API_KEY);

    $elevationjson = json_decode($elevationsource, true);

    $elevation = $elevationjson['results'][0]['elevation']/1000;

    //var_dump($elevation, true);

    $json = json_decode($plainsource, true);

    $planes = $json['states'];

    $nearPlanes = array();

    for($i = 0; $i < count($planes); $i++)
    {
      $lat = $planes[$i][6];
      $lon = $planes[$i][5];
      $alt = $planes[$i][7] / 1000;

      $plane = $geolocation -> fromDegrees($lat, $lon);

      $dist  = $observer -> distanceTo($plane, 'km');

      

      if($dist <= $distance)
      {
        $azimuth = $geolocation -> getRhumbLineBearing($plane, $observer);
        array_push($planes[$i], $azimuth);

        $altitude = rad2deg(atan(($alt - $elevation)/$dist));
        array_push($planes[$i], $altitude);

        array_push($planes[$i], $dist);

        array_push($nearPlanes, $planes[$i]);
      }
    }


    echo json_encode($nearPlanes);
  ?>
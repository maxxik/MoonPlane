<?php
    include('geolocation.php');
    $geolocation = new GeoLocation();

    $obs_lat = $_GET['lat'];
    $obs_lon = $_GET['lon'];
    $distance = $_GET['dist'];

    $observer = $geolocation -> fromDegrees($obs_lat, $obs_lon);


    $xml = file_get_contents("https://opensky-network.org/api/states/all");
    //var_dump(json_decode($xml, true), true);

    $json = json_decode($xml, true);

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

        array_push($planes[$i], $dist);

        $altitude = rad2deg(atan($alt/$dist));
        array_push($planes[$i], $altitude);

        array_push($nearPlanes, $planes[$i]);
      }
    }


    echo json_encode($moonpos);
  ?>
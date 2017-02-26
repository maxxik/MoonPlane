<?php
    include('suncalc.php');
    include('geolocation.php');
    $geolocation = new GeoLocation();

    $lat = 0;
    $lon = 0;
    $date = new DateTime();

    if(isset($_GET['lat']) && isset($_GET['lon']))
    {
        $lat = $_GET['lat'];
        $lon = $_GET['lon'];
    }
    else if(isset($_GET['address']))
    {
      $resp = $geolocation -> getGeocodeFromGoogle($_GET['address']);
      if(isset($resp -> results[0] -> geometry -> location))
      {
        $lat = $resp -> results[0] -> geometry -> location -> lat;
        $lon = $resp -> results[0] -> geometry -> location -> lng;
      }
    }
    else
    {
      die('ERROR CODE: 1');
    }

    $suncalc = new SunCalc($date, $lat, $lon);

    $moonpos = $suncalc -> getMoonPosition($date);

    echo json_encode($moonpos);
?>
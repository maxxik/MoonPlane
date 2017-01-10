<?php
    include('suncalc.php');

    $lat = 0;
    $lon = 0;
    $date = new DateTime();
    if(isset($_GET['lat']) && isset($_GET['lon']))
    {
        $lat = $_GET['lat'];
        $lon = $_GET['lon'];
    }
    else
    {
        die('ERROR CODE: 1');
    }

    $suncalc = new SunCalc($date, $lat, $lon);

    $moonpos = $suncalc -> getMoonPosition($date);

    echo json_encode($moonpos);
    
?>
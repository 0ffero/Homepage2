<?php
function cleanExit($op) {
    echo json_encode($op);
    exit;
};

function convertFloatToHourPart($value,$returnZeroAsEmpty=false) {
    $ext = fmod($value,1);
    switch ($ext) {
        case 0: $ext='00m'; break;
        case 0.25: $ext='15m'; break;
        case 0.5: $ext='30m'; break;
        case 0.75: $ext='45m'; break;
    };

    if ($ext==='00m' && $returnZeroAsEmpty) {
        $ext = '';
    };

    return $ext;
};

function convertDateTimeToTextArray($dateTime) {
    $dT = explode('T', $dateTime);
    $date = $dT[0];
    $time = $dT[1];
    $dateString = substr($date,6,2) . "/" . substr($date,4,2) . "/" . substr($date,0,4);
    $hour = substr($date,0,2);
    $timeString = $hour . ":" . substr($date,2,2);
    $timeString .= $hour >= 12 ? 'pm' : 'am';
    return [ 'dateString'=>$dateString, 'timeString'=>$timeString ];
};
?>
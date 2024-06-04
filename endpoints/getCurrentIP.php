<?php
include ('php/functions.php');
$op = ['page'=>'getCurrentIP.php', 'valid'=>false, 'messages'=>[], 'ERROR'=>false];

$url = "http://ifconfig.me";
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
$rs = curl_exec($ch);
echo curl_error($ch);
curl_close($ch);

$ip = $rs;
if (!$ip) {
    $op['ERROR'] = 'No response when attempting to get ip!';
    cleanExit($op);
};


$op['valid'] = true;
$op['currentip'] = $ip;
$op['messages'][] = 'Got IP successfully';

cleanExit($op);
?>
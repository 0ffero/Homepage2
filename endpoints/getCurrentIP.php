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

$re = '/ip_addr: (.*)/';
preg_match_all($re, $ip, $matches, PREG_SET_ORDER, 0);


$op['valid'] = true;
$op['currentip'] = $matches[0][1];
$op['messages'][] = 'Got IP successfully';

cleanExit($op);
?>
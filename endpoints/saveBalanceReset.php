<?php
include ('php/functions.php');

$op = ['page'=>'getInAndOutDetails.php', 'valid'=>false, 'messages'=>[], 'ERROR'=>false];

// CHECK POST VARS
if (!isset($_POST['date']) || strlen($_POST['date'])!==8 || !is_numeric($_POST['date'])) {
    $op['ERROR'] = 'Invalid date';
    cleanExit($op);
};
$op['messages'][] = 'Date was valid';

if (!isset($_POST['balance']) || !is_numeric($_POST['balance'])) {
    $op['ERROR'] = 'Invalid balance';
    cleanExit($op);
};
$op['messages'][] = 'Balance was valid';


// get the POST vars
$date = $_POST['date']*1;
$op['date'] = $date*1;
$balance = $_POST['balance']*1;
$op['balance'] = $balance*1;

// get the balances from the file
$balanceFolder = './balances';
if (!is_dir($balanceFolder)) { mkdir($balanceFolder); };

$balanceFileName = $balanceFolder . '/balanceSheet.log';
if (!is_file($balanceFileName)) {
    $balances = '';
} else {
    $balances = file_get_contents($balanceFileName);
};
// and add the new balance reset
$balances .= "$date $balance\r\n";
file_put_contents($balanceFileName, $balances);

$op['messages'][] = 'Balance reset saved';
$op['valid'] = true;
cleanExit($op);

?>
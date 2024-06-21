<?php
include ('php/functions.php');

$op = ['page'=>'getInAndOutDetails.php', 'valid'=>false, 'messages'=>[], 'ERROR'=>false];


/*
    **********************
    *                    *
    * GET THE POST VARS  *
    *                    *
    **********************
*/

if (!isset($_POST['startDate']) || strlen($_POST['startDate'])!==8 || !is_numeric($_POST['startDate'])) {
    $op['ERROR'] = "Start Date was invalid!";
    cleanExit($op);
};
$startDate = $_POST['startDate'];

if (!isset($_POST['endDate']) || strlen($_POST['endDate'])!==8 || !is_numeric($_POST['endDate'])) {
    $op['ERROR'] = "End Date was invalid!";
    cleanExit($op);
};
$endDate = $_POST['endDate'];

$notesArray = [];

$year = date('Y');
$notesArray[$year . "0821"][] = ['type'=>'Yearlies', 'data'=>'My Birthday'];

$notesArray[$year . "0428"][] = ['type'=>'Yearlies', 'data'=>'Calebs Birthday'];
$notesArray[$year . "0327"][] = ['type'=>'Yearlies', 'data'=>'Cats Birthday'];
$notesArray[$year . "0807"][] = ['type'=>'Yearlies', 'data'=>'Dads Birthday'];
$notesArray[$year . "1015"][] = ['type'=>'Yearlies', 'data'=>'Shaunas Birthday'];
$notesArray[$year . "1225"][] = ['type'=>'Yearlies', 'data'=>'Christmas'];
$notesArray[$year . "1231"][] = ['type'=>'Yearlies', 'data'=>'New Years Eve'];
$notesArray[$year . "0101"][] = ['type'=>'Yearlies', 'data'=>'New Years Day'];



// load the notes files and add them to the array
$notesFileArray = json_decode(file_get_contents('./notes/notes.json'),true);
foreach ($notesFileArray as $note) {
    $date = $note['date'];
    $notes = $note['notes'];
    if ($date*1>=$startDate*1 && $date*1<=$endDate*1) {
        $notesArray[$date*1][] = ['type'=>'Note', 'data'=>$notes];
    };
};


/*
    *****************************
    *                           *
    * ADD PAYMENTS TO THE ARRAY *
    *                           *
    *****************************
*/
$uc_date = "20240619"; $uc_amount = 290.00;
while ($uc_date*1<=$endDate*1) {
    $date = strtotime($uc_date);
    $uc_date = date("Ymd", strtotime("+28 day", $date));
    if ($uc_date*1>=$startDate*1 && $uc_date*1<=$endDate*1) {
        $moneyArray[$uc_date][] = ['type'=>'UC', 'amount'=>$uc_amount, 'deduction'=>false];
    };
};

$adp_date = "20240614"; $adp_amount = 143.00;
while ($adp_date*1<=$endDate*1) {
    $date = strtotime($adp_date);
    $adp_date = date("Ymd", strtotime("+14 day", $date));
    if ($adp_date*1>=$startDate*1 && $adp_date*1<=$endDate*1) {
        $moneyArray[$adp_date][] = ['type'=>'ADP', 'amount'=>$adp_amount, 'deduction'=>false];
    };
};





/*
    *******************************
    *                             *
    * ADD DEDUCTIONS TO THE ARRAY *
    *           EXAMPLE           *
    *******************************
*/

// NETFLIX -- EXAMPLE
/* $netflix_date = "20240101"; $netflix_amount=14.99;
while ($netflix_date*1<=$endDate*1) {
    $date = strtotime($netflix_date);
    $netflix_date = date("Ymd", strtotime("+1 month", $date));
    if ($netflix_date*1>=$startDate*1 && $netflix_date*1<=$endDate*1) {
        $moneyArray[$netflix_date][] = ['type'=>'Netflix', 'amount'=>$netflix_amount, 'deduction'=>true];
    };
}; */


/*
    ********************************
    *                              *
    * LOAD BALANCE SHEET AND PARSE *
    *                              *
    ********************************
*/
$balanceResetFile = file_get_contents('./balances/balanceSheet.log');
$bRArray = explode("\r\n", $balanceResetFile);
foreach ($bRArray as $bR) {
    $bRS = explode(' ', $bR);
    $bRS_date = $bRS[0];
    if ($bRS_date*1>$startDate*1 && $bRS_date*1<=$endDate*1) {
        $moneyArray[(string)$bRS[0]][] = ['type'=>'Balance Reset', 'amount'=>$bRS[1]*1];
    };
};





/*
    *************************************************
    *                                               *
    * READY THE OUTPUT TO BE SENT BACK TO FRONT END *
    *                                               *
    *************************************************
*/
$notesOutput = [];
foreach ($notesArray as $date => $notes) {
    $notesOutput[] = ['date'=>$date, 'notes'=>$notes];
};

$moneyOutput = [];
foreach ($moneyArray as $date => $notes) {
    $moneyOutput[] = ['date'=>$date, 'notes'=>$notes];
};


// these notes need sorted by "date" before sending to $op TODO
$op['messages'][] = 'Building list successful';
$op['notes'] = $notesOutput;
$op['money'] = $moneyOutput;
$op['valid'] = true;
cleanExit($op);
?>
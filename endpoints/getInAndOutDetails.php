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


/*

*/
$year = date('Y');
$notesArray[$year . "0821"][] = ['type'=>'Yearlies', 'data'=>'Alexs Birthday'];
$notesArray[$year . "0428"][] = ['type'=>'Yearlies', 'data'=>'Calebs Birthday'];
$notesArray[$year . "0327"][] = ['type'=>'Yearlies', 'data'=>'Cats Birthday'];
$notesArray[$year . "1015"][] = ['type'=>'Yearlies', 'data'=>'Shaunas Birthday'];
$notesArray[$year . "1225"][] = ['type'=>'Yearlies', 'data'=>'Christmas'];
$notesArray[$year . "1231"][] = ['type'=>'Yearlies', 'data'=>'New Years Eve'];
$notesArray[$year . "0101"][] = ['type'=>'Yearlies', 'data'=>'New Years Day'];



/*
    ***************************************
    *                                     *
    * START BUILDING THE MEDICATION DATES *
    *                                     *
    ***************************************
*/
$tabs1Date = "20200121"; $tabs1 = "Sq50 Sq300 Mirt";
$tabs2Date = "20191224"; $tabs2 = "Dx";

// Tabs 1 - Every 8 weeks
while ($tabs1Date*1<=$endDate*1) {
    $date = strtotime($tabs1Date);
    $tabs1Date = date("Ymd", strtotime("+56 day", $date));
    if ($tabs1Date*1>=$startDate*1 && $tabs1Date*1<=$endDate*1) {
        $notesArray[$tabs1Date][] = ['type'=>'Tablets', 'data'=>$tabs1];
    };
};

// Tabs 2 - Every 8 weeks
while ($tabs2Date*1<=$endDate*1) {
    $date = strtotime($tabs2Date);
    $tabs2Date = date("Ymd", strtotime("+56 day", $date));
    if ($tabs2Date*1>=$startDate*1 && $tabs2Date*1<=$endDate*1) {
        $notesArray[$tabs2Date*1][] = ['type'=>'Tablets', 'data'=>$tabs2];
    };
};

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
$moneyArray = [];
$esa_date = "20220824"; $esa_amount = 481.10;
// ESA EVERY 2 WEEKS
while ($esa_date*1<=$endDate*1) {
    $date = strtotime($esa_date);
    $esa_date = date("Ymd", strtotime("+14 day", $date));
    if ($esa_date*1>=$startDate*1 && $esa_date*1<=$endDate*1) {
        $moneyArray[$esa_date][] = ['type'=>'ESA', 'amount'=>$esa_amount, 'deduction'=>false];
    };
};

$pip_date = "20220809"; $pip_amount = 290.60;
while ($pip_date*1<=$endDate*1) {
    $date = strtotime($pip_date);
    $pip_date = date("Ymd", strtotime("+28 day", $date));
    if ($pip_date*1>=$startDate*1 && $pip_date*1<=$endDate*1) {
        $moneyArray[$pip_date][] = ['type'=>'PIP', 'amount'=>$pip_amount, 'deduction'=>false];
    };
};

/*
    *******************************
    *                             *
    * ADD DEDUCTIONS TO THE ARRAY *
    *                             *
    *******************************
*/

// VIRGIN MEDIA
$virginmedia_date = "20220603"; $virginmedia_amount=25.00;
while ($virginmedia_date*1<=$endDate*1) {
    $date = strtotime($virginmedia_date);
    $virginmedia_date = date("Ymd", strtotime("+1 month", $date));
    if ($virginmedia_date*1>=$startDate*1 && $virginmedia_date*1<=$endDate*1) {
        $moneyArray[$virginmedia_date][] = ['type'=>'Virgin Media', 'amount'=>$virginmedia_amount, 'deduction'=>true];
    };
};

//NETFLIX
$netflix_date = "20220617"; $netflix_amount=10.99;
while ($netflix_date*1<=$endDate*1) {
    $date = strtotime($netflix_date);
    $netflix_date = date("Ymd", strtotime("+1 month", $date));
    if ($netflix_date*1>=$startDate*1 && $netflix_date*1<=$endDate*1) {
        $moneyArray[$netflix_date][] = ['type'=>'Netflix', 'amount'=>$netflix_amount, 'deduction'=>true];
    };
};

// OVERDRAFT
$overdraft_date = "20220601"; $overdraft_amount=8.00;
while ($overdraft_date*1<=$endDate*1) {
    $date = strtotime($overdraft_date);
    $overdraft_date = date("Ymd", strtotime("+1 month", $date));
    if ($overdraft_date*1>=$startDate*1 && $overdraft_date*1<=$endDate*1) {
        $moneyArray[$overdraft_date][] = ['type'=>'Overdraft', 'amount'=>$overdraft_amount, 'deduction'=>true];
    };
};

// COUNCIL TAX
$counciltax_date = "20220601"; $counciltax_amount=24.00;
while ($counciltax_date*1<=$endDate*1) {
    $date = strtotime($counciltax_date);
    $counciltax_date = date("Ymd", strtotime("+1 month", $date));
    if ($counciltax_date*1>=$startDate*1 && $counciltax_date*1<=$endDate*1) {
        $moneyArray[$counciltax_date][] = ['type'=>'Council Tax', 'amount'=>$counciltax_amount, 'deduction'=>true];
    };
};

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
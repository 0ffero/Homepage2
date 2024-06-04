<?php
include ('php/functions.php');

$op = ['page'=>'getInAndOutDetails.php', 'valid'=>false, 'messages'=>[], 'ERROR'=>false];

// CHECK POST VARS
if (!isset($_POST['date']) || strlen($_POST['date'])!==8 || !is_numeric($_POST['date'])) {
    $op['ERROR'] = 'Invalid date';
    cleanExit($op);
};
$op['messages'][] = 'Date was valid';

if (!isset($_POST['notes'])) {
    $op['ERROR'] = 'Invalid notes';
    cleanExit($op);
};
$op['messages'][] = 'Balance was valid';


// get the POST vars
$date = $_POST['date'];
$notes = $_POST['notes'];
$notes = json_decode($notes,true);
if (!count($notes)) {
    $op['ERROR'] = 'Not valid notes passed';
    cleanExit($op);
};
$op['notes'] = $notes;
$op['date'] = $date*1;

// get the notes from the file
$notesFolder = './notes';
$notesFileName = $notesFolder . '/notes.json';
$notesArray = json_decode(file_get_contents($notesFileName),true);

// and add the new note
$found = false;
foreach ($notesArray as $index => $note) {
    if (!$found && $note['date']*1===$date*1) {
        // add the new note
        $found=true;
        $notesArray[$index]['notes'] = [...$notesArray[$index]['notes'], ...$notes];
        $op['messages'][] = 'Notes for date already exist. Updated.';
    };
};

if (!$found) { // the date wasnt found int he notes, add it
    $notesArray[] = ['date'=>$date*1, 'notes'=>$notes];
    $op['messages'][] = 'Notes for date didnt exist. Created.';
};

// re-encode the notes and save them
$notesJSON = json_encode($notesArray);
file_put_contents($notesFileName, $notesJSON);

$op['messages'][] = 'Notes saved';
$op['valid'] = true;
cleanExit($op);

?>
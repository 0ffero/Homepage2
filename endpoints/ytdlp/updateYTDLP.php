<?php
$update = shell_exec('./yt-dlp --update 2>&1');
$updateLines = explode("\n",trim($update));
$op['update'] = $updateLines;

$re = '/stable@([0-9]{4}\.[0-9]{2}\.[0-9]{2})/';
foreach ($updateLines as $line) {
    preg_match_all($re, $line, $matches, PREG_SET_ORDER, 0);
    foreach ($matches as $match) {
        $dates[] = $match[1];
    };
};

$updated = false;
foreach ($dates as $date) {
    if (!$startDate) { $startDate = $date; continue; };
    if ($date!==$startDate) {
        $updated = true;
    };
};

$op['dates'] = $dates;
$op['updated'] = $updated;

echo json_encode($op);
?>
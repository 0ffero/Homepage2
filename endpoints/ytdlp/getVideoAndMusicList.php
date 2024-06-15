<?php
function cleanExit($op) {
	echo json_encode($op);
	exit;
};

$videosFolder = './videos/';
$musicFolder = './music/';

if (!is_dir($videosFolder)) {
    mkdir($videosFolder);
};

if (!is_dir($musicFolder)) {
    mkdir($musicFolder);
};

$fileArray = ["music"=>[], "videos"=>[]];


/*  GET ALL VIDEO FILES */
$scan = scandir($videosFolder);
foreach($scan as $entry) {
    if (substr_count($entry,'.mp4') || substr_count($entry,'.webm')) {
        $fileArray['videos'][] = $entry;
    };
};

$scan = scandir($musicFolder);
foreach($scan as $entry) {
    if (substr_count($entry,'.mp3') || substr_count($entry,'.m4a')) {
        $fileArray['music'][] = $entry;
    };
};

$op['files'] = $fileArray;
cleanExit($op);
?>
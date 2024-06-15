<?php
function cleanExit($op) {
	echo json_encode($op);
	exit;
};

// inits, always run before anything else. It makes sure we have the downloaded.json file
$dlJSON = 'downloaded.json';
if (!is_file($dlJSON)) {
	file_put_contents($dlJSON,'[]');
};

// make sure the yt-dlp exe file exists
$exe = "yt-dlp.exe";
if (!is_file($exe)) {
	$op['ERROR'] = 'yt-dlp wasn\'t found';
	cleanExit($op);
};

$op['endpoint'] = 'getVideo';
$op['rq'] = $_POST;

if (!isset($_POST['id']) || strlen($_POST['id'])!==11) {
	$op['ERROR'] = 'Invalid youtube ID';
	cleanExit($op);
};
if (!isset($_POST['video']) || ($_POST['video']!=='yes' && $_POST['video']!=='no')) {
	$op['ERROR'] = 'Invalid video option';
	cleanExit($op);
};

$id = $_POST['id'];
$video = $_POST['video'];

$url = "https://www.youtube.com/$id";

if ($video==='yes') {
	$op['download_type'] = 'video';
	$bat = "yt-dlp -f mp4 --write-thumbnail $url 2>&1";
	$outputFolder = './videos/';
} else if ($video==='no') {
	$op['download_type'] = 'music';
	$bat = "yt-dlp -f m4a $url 2>&1";
	$outputFolder = './music/';
};

if (!is_dir($outputFolder)) {
	mkdir($outputFolder);
	$op['created new folder'] = "$outputFolder was created";
};

$rs = shell_exec($bat);

$op['output'] = $rs;

cleanExit($op);
?>
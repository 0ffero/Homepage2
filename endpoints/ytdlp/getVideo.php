<?php
function cleanExit($op) {
	echo json_encode($op);
	exit;
};

// inits, always run before anything else. It makes sure we have the downloaded.json file
$dlJSON = 'downloaded_music.json';
if (!is_file($dlJSON)) {
	file_put_contents($dlJSON,'[]');
};
$dlJSON = 'downloaded_video.json';
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



// Is this a video request or just audio?
$video = $_POST['video'];

// get the youtube ID and make sure it hasnt already been downloaded
$id = $_POST['id'];
$vText = $video==='yes' ? 'video' : 'music';
// get the appropriate download list file
$jsonFile = "downloaded_" . $vText . ".json";
$fileList = json_decode(file_get_contents($jsonFile));
if (in_array($id,$fileList)) {
	$op['ERROR'] = "This file has already been download";
	cleanExit($op);
};
// the id is NOT in the file, add it and start downloading
$fileList[] = $id;
file_put_contents($jsonFile, json_encode($fileList));

// set up the url var
$url = "https://www.youtube.com/watch?v=$id";

// generate the exe string
if ($video==='yes') {
	$op['download_type'] = 'video';
	$outputFolder = './videos/';
	$bat = "yt-dlp -f mp4 --write-thumbnail $url -P $outputFolder 2>&1";
} else if ($video==='no') {
	$op['download_type'] = 'music';
	$outputFolder = './music/';
	$bat = "yt-dlp -f m4a $url -P $outputFolder 2>&1";
};

$op['bat'] = $bat;

if (!is_dir($outputFolder)) {
	mkdir($outputFolder);
	$op['created new folder'] = "$outputFolder was created";
};

$rs = shell_exec($bat);

if (!substr_count($rs,'[download] 100% of')) {
	$op['ERROR'] = 'Unable to confirm download. Please check that the file exists!';
	cleanExit($op);
};

// check for the file and rename it
$found = false;
$files = scandir($outputFolder);
foreach ($files as $file) {
    if (substr_count($file,$id) && !$found) {
		$found = true;
		$originalFileName = $outputFolder . '/' . $file; 							// original file name
		$fRename = $outputFolder . '/' . str_replace(' [' . $id . ']','',$file); 	// new file name
		rename($originalFileName, $fRename);
		if (!is_file($fRename)) {
			$op['warning'] = 'Main file couldnt be renamed!';
		} else {
			$op['success'] = 'Main file renamed successfully';
		};

		// if this was a video, we need to rename the image file too
		if ($video==='yes') {
			$imageFileName = str_replace('.mp4', '.webp', $originalFileName);
			$iFRename = str_replace(' [' . $id . ']','',$imageFileName);
			rename($imageFileName, $iFRename);
			if (!is_file($iFRename)) {
				$op['warning'] .= '<br/>Image File couldnt be renamed!';
			} else {
				$op['success'] .= '<br/>Image File renamed successfully';
			};
		};
  	};
};
$op['file_found'] = $found;


cleanExit($op);
?>
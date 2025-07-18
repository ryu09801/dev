<?php
$config = parse_ini_file('seting.ini', false);

$now_time = new DateTime();
$now_time->format('Y-m-d H:i:s');

$start_time = new DateTime();
$start_time->setTime($config['start_hour'], $config['start_min'], 0);

$config['differ_time'] = $now_time->getTimestamp() - $start_time->getTimestamp();

echo json_encode($config);
?>
<?php
$asins = array();
$title = null;
$fp = fopen("comments.csv", "r");
while (($data = fgetcsv($fp, 0, ",")) !== FALSE) {
    //mb_convert_variables('UTF-8','SJIS-win', $data);
    if (!$title) {
        $title = $data;
    } else {
        $asin = array();
        foreach($data as $key => $val)
        {
			if ($title[$key] == "time") {
				$t = explode(":", $val);
				if (count($t) == 1) {
				    $asin[$title[$key]] = $t[0];
				} else if (count($t) == 2) {
				    $m = $t[0];
				    if (isset($t[1])) {
				        $s = $t[1];
				    }else{
				        $s = "0";
				    }
				    $asin[$title[$key]] = ($m*60) + $s;
				} else if (count($t) == 3) {
				    $h = $t[0];
				    if (isset($t[1])) {
				        $m = $t[1];
				    }else{
				        $m = "0";
				    }
				    if (isset($t[2])) {
				        $s = $t[2];
				    }else{
				        $s = "0";
				    }
				    $asin[$title[$key]] = ($h*60*60) + ($m*60) + $s;
				}
			} else {
            	$asin[$title[$key]] = $val;
			}
        }
        $asins[] = $asin;
    }
}
fclose($fp);

foreach ($asins as $key => $value) {
    $standard_key_array[$key] = $value['time'];
}
array_multisort($standard_key_array, SORT_ASC, $asins);

echo json_encode($asins);
?>
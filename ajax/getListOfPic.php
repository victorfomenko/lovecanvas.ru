<?php
	include('dbConnect.php');
	$url = $_REQUEST["url"];

    $limit = 20;
    if ( $url==='gallery' ) $limit=50;

    $q =    "SELECT SQL_CALC_FOUND_ROWS
                    name, author, rate, fee, filename, seourl
                    FROM pictures
                    WHERE deleted=0
                    ORDER BY rate DESC";

    $listOfPic = array();

    if ($dataReader = getDataFromDB($q)){
        $count = count($dataReader);
        for ($i = 0; $i < $count; $i++){
            $data =         $dataReader[$i];

            $pic = array();
            $pic["name"] =      $data['name'];
            $pic["author"] =    $data['author'];
            $pic["rate"] =      $data['rate'];
            $pic["fee"] =       $data['fee'];
            $pic["filename"] =  $data['filename'];
            $pic["seourl"] =    $data['seourl'];
            $pic["full"] =    "/data/full/" . $pic["filename"] . '.jpg';
            $pic["preview"] = "/data/preview/" . $pic["filename"] . '.jpg';
            array_push($listOfPic, $pic);
        }
    }
    header ("Content-Type: application/json");
    echo(json_encode($listOfPic));
?>
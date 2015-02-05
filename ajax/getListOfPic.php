<?php
	include('dbConnect.php');
	$url = $_REQUEST["url"];

    $limit = file_get_contents('php://input');
	if( !$limit ) $limit = 20;

    $q =    "SELECT SQL_CALC_FOUND_ROWS
                    p.name, p.rate, p.fee, p.filename, p.seourl, p.width, p.height, a.artname
                    FROM pictures AS p, artists AS a
                    WHERE deleted=0 AND p.authorid = a.id
                    ORDER BY rate DESC
                    LIMIT " . $limit;

    $listOfPic = array();

    if ($dataReader = getDataFromDB($q)){
        $count = count($dataReader);
        for ($i = 0; $i < $count; $i++){
            $data =         $dataReader[$i];

            $pic = array();
            $pic["name"] =      $data['name'];
            $pic["author"] =    $data['artname'];
            $pic["rate"] =      $data['rate'];
            $pic["fee"] =       $data['fee'];
            $pic["filename"] =  $data['filename'];
            $pic["seourl"] =    $data['seourl'];
            $pic["full"] =    "/data/full/" . $pic["filename"] . '.jpg';
            $pic["preview"] = "/data/preview/" . $pic["filename"] . '.jpg';
            $pic["width"] =     $data['width'];
            $pic["height"] =    $data['height'];
            array_push($listOfPic, $pic);
        }
    }
    header ("Content-Type: application/json");
    echo(json_encode($listOfPic));
?>
<?php
	include('dbConnect.php');
	$url = file_get_contents('php://input');

    $q1 =    "SELECT id, name, author, rate, fee, filename, seourl
                    FROM pictures
                    WHERE seourl = '" . $url . "' AND deleted = 0";

    $dataReader = getDataFromDB($q1);
    $data =         $dataReader[0];

    $pic = array();
    $pic["name"] =      $data['name'];
    $pic["author"] =    $data['author'];
    $pic["rate"] =      $data['rate'];
    $pic["fee"] =       $data['fee'];
    $pic["filename"] =  $data['filename'];
    $pic["seourl"] =    $data['seourl'];
    $pic["full"] =    "/data/full/" . $pic["filename"] . '.jpg';
    $pic["preview"] = "/data/preview/" . $pic["filename"] . '.jpg';

    $q2 =  "SELECT sizes.value
            FROM sizes
            LEFT JOIN sizeslist
            ON sizes.id = sizeslist.size_id
            WHERE sizeslist.pictures_id = "  . $data['id'] ;

    $dataReader = getDataFromDB($q2);
    $count = count($dataReader);
    $sizes = array();

    for ($i = 0; $i < $count; $i++){
        $data =         $dataReader[$i];
        $size = array();
        $size["value"] =   $data['value'];
        $sizeName =    explode('|', $data['value']);
        $size["name"] = $sizeName[0] . 'см x ' . $sizeName[1] . 'см';
        array_push($sizes, $size);
    }
    $pic["sizes"] =     $sizes;

    header ("Content-Type: application/json");
    echo(json_encode($pic));
?>
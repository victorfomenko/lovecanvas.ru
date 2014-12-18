<?php
include('dbConnect.php');

$imageFolder = '../data/full/';
$images = array();
if ($handle = opendir($imageFolder)) {
    //Читаем файлы в каталоге
    while (false !== ($file = readdir($handle))) {
        if ($file != "." && $file != "..") {
            $sizeInfo = getimagesize($imageFolder . $file);
            $fileName = explode('.', $file )[0];
            $q =    "UPDATE pictures " .
                    "SET width=" . $sizeInfo[0] . ", height=" . $sizeInfo[1] . " " .
                    "WHERE filename = '" . $fileName . "'";
            insertDataToDB($q);
        }
    }
    closedir($handle);
}
?>
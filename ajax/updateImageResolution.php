<?php
include('dbConnect.php');

$imageFolder = '../data/full/';
$images = array();
if ($handle = opendir($imageFolder)) {
    //Читаем файлы в каталоге
    while (false !== ($file = readdir($handle))) {
        if ($file != "." && $file != "..") {
            $sizeInfo = getimagesize($imageFolder . $file);

            $q =    "UPDATE pictures " .
                    "SET width=" . $sizeInfo[0] . ", height=" . $sizeInfo[1] . " " .
                    "WHERE filename = '" . explode('.', $file )[0] . "'";
            insertDataToDB($q);
        }
    }
    closedir($handle);
}
?>
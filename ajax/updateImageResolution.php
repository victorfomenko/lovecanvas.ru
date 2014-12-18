<?php
include('dbConnect.php');
echo 'start';
exit;
$imageFolder = '../data/full/';
$images = array();
if ($handle = opendir($imageFolder)) {
    echo 'Читаем файлы в каталоге <br>';
    //Читаем файлы в каталоге
    while (false !== ($file = readdir($handle))) {
        if ($file != "." && $file != "..") {
            $sizeInfo = getimagesize($imageFolder . $file);

            $q =    "UPDATE pictures " .
                    "SET width=" . $sizeInfo[0] . ", height=" . $sizeInfo[1] . " " .
                    "WHERE filename = '" . explode('.', $file )[0] . "'";
            print_r($q);
            exit;
            insertDataToDB($q);
        }
    }
    closedir($handle);
}
?>
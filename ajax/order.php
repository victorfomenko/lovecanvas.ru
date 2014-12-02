<?php
	$data = (json_decode(file_get_contents("php://input")));
	$name =         $data->formName;
	$city =         $data->formCity;
	$postal =       $data->formPostal;
	$image =        $data->image;
	$phone =        $data->formPhone;
	$email =        $data->formEmail;
	$productType =  $data->formProduct;
	$frameSize =    $data->formFrameSize;
    $frameType =    $data->formFrameType;
    $borderType =   $data->formBorderType;
    $price =        $data->formPrice;

	$subject = 'Заказ картины';
	$message = "Имя: " . $name . "<br>";
	$message .= "Телефон: " . $phone . "<br>";
	$message .= "E-mail: " . $email . "<br>";
	$message .= "Город: " . $city . "<br>";
	$message .= "Индекс: " . $postal . "<br>";
	$message .= "Тип картины: " . $productType . "<br>";
	$message .= "Размеры: " . $frameSize . "<br>";
	$message .= "Тип рамы: " . $frameType . "<br>";
	$message .= "Края: " . $borderType . "<br>";
	$message .= "Цена: " . $price . "<br>";
	$message .= "Фото: <img src='" . $image . "'><br>";
	sendEmail("info@lovecanvas.ru", $subject, $message);
	sendEmail("veselovskiievgenii@gmail.com", $subject, $message);
	sendEmail("lesya.yusupova@gmail.com", $subject, $message);

	function sendEmail( $email, $subject, $message ) {

		$subject = 	"=?UTF-8?B?".base64_encode($subject)."?=";
		//$message = 	iconv( 'CP1251', 'UTF-8', $message );

		$headers  = "Content-Type: text/html; charset=utf-8\r\n";
		$headers .= "From: Love Canvas <order@lovecanvas.ru>\r\n";
		$headers .= "Reply-To: Love Canvas <order@lovecanvas.ru>\r\n";
		$headers .= "MIME-Version: 1.0\r\n";
		$headers .= "Message-ID: <". time() .rand(1,1000). "@".$_SERVER['SERVER_NAME'].">". "\r\n";
		$headers .= "X-Mailer: Exim 4.6\r\n";
		$headers .= "Organization: Love Canvas\r\n";
		/*$headers .= "X-Priority: 1\r\n";*/
		/*$headers .= "X-MSMail-Priority: High\r\n";*/

		mail( $email, $subject, $message, $headers );
	}
	print("ok");
	exit;

?>
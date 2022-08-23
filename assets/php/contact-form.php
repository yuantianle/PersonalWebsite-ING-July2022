<?php

/**
 * This example shows how to handle a simple contact form safely.
 */

//Import PHPMailer class into the global namespace
use PHPMailer\PHPMailer\PHPMailer;




///* PHP中用strpos函数过滤关键字 */
//// 关键字过滤函数
//function keyWordCheck($content){
//	// 去除空白
//	$content = trim($content);
//	// 读取关键字文本
//	$content = @file_get_contents('keyWords.txt');
//	// 转换成数组
//	$arr = explode("n", $content);
//	// 遍历检测
//	for($i=0,$k=count($arr);$i<$k;$i++){
//		// 如果此数组元素为空则跳过此次循环
//		if($arr[$i]==''){
//		continue;
//		}
//		// 如果检测到关键字，则返回匹配的关键字,并终止运行
//		if(@strpos($str,trim($arr[$i]))!==false){
//		//$i=$k;
//		return $arr[$i];
//		}
//	}
//	// 如果没有检测到关键字则返回false
//	return false;
//}
////$content = '这里是要发布的文本内容。。。';
//
//// 过滤关键字
//$keyWord1 = keyWordCheck($mail->to);
//$keyWord2 = keyWordCheck($mail->message);
//// 判断是否存在关键字
//if($keyWord1||$keyWord2){
//	echo 'Your message exist unapropriate content. You have been forbidden for this moduel.'.$keyWord;
//}
//else{
//	echo 'Leagal message content.';
//	// 往下可以进行写库操作完成发布动作。
//}
		




//Don't run this unless we're handling a form submission
if (array_key_exists('email', $_POST)) {
    date_default_timezone_set('Etc/UTC');
    require 'PHPMailer.php';
    require 'Exception.php';
    require 'SMTP.php';

    $isAjax = !empty($_SERVER['HTTP_X_REQUESTED_WITH']) &&
        strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) === 'xmlhttprequest';

    //Create a new PHPMailer instance
    $mail = new PHPMailer();
    $mail->CharSet = 'UTF-8';
    //Send using SMTP to localhost (faster and safer than using mail()) – requires a local mail server
    //See other examples for how to use a remote server such as gmail
    $mail->isSMTP();
    $mail->Host = 'localhost';
    $mail->Port = 25;

    //Use a fixed address in your own domain as the from address
    //**DO NOT** use the submitter's address here as it will be forgery
    //and will cause your messages to fail SPF checks
    $mail->setFrom('contact-from-someone@yuantianle.com', 'Tianle Yuan\'s Website');
    //Choose who the message should be sent to
    $mail->addAddress('yuant@oregonstate.edu');
    //Put the submitter's address in a reply-to header
    //This will fail if the address provided is invalid,
    //in which case we should ignore the whole request
    if ($mail->addReplyTo($_POST['email'], $_POST['name'])) {
        $mail->Subject = '[yuantianle.com] *** There is someone sending you an email! ***';
        //Keep it simple - don't use HTML
        $mail->isHTML(false);
        //Build a simple message body
        $mail->Body = <<<EOT
Email: {$_POST['email']}
Name: {$_POST['name']}
Message: {$_POST['message']}
EOT;


		
        //Send the message, check for errors
        if (!$mail->send()) {
            //The reason for failing to send will be in $mail->ErrorInfo
            //but it's unsafe to display errors directly to users - process the error, log it on your server.
            if ($isAjax) {
                http_response_code(500);
            }

	    $response = 'Sorry, something went wrong. Please try again later.';
        } else {
	    $response = 'Email was delivered successfully! Thanks for contacting me. I\'ll get back to you ASAP :)';
        }
    } else {
	$response = 'Invalid email address, message ignored.';
    }

    if ($isAjax) {
        header('Content-type:application/json;charset=utf-8');
        echo json_encode($response);
        exit();
    }
}
?>

<?php

//
// Simply forward a POST request to the relevant IRKit device by using curl.
//
// We need such a page to proxy our requests because:
// - the script can be securely exposed to the Internet (unlike the IRKit IP which should never be directly exposed)
// - some browser might complain about violation of "same-origin policy" when it talks directly the IRKit.
// - it's the only way to make it work with HTTPS

$host = $_POST["host"];
$path = $_POST["path"];
$postData = $_POST["payload"];

echo "Forwarding..."; 

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, "http://" . $host . $path);
curl_setopt($ch, CURLOPT_POST, 1);
curl_setopt($ch, CURLOPT_POSTFIELDS, $postData);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

$server_output = curl_exec ($ch);

curl_close ($ch);
?>


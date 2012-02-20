<?php

$ftnid = 1163; // 1147
  $actionstatus = 1; // 1 = Open 2 = Rejected 3 = Closed
  $actionduedate = "15/05/2011"; // that is april 15th
$lnid = 1154;
$trnid = 1149;


$sessionid = '';

  $api_key = 'ed189296f0507fde20b1b9863c6fc21a'; // test
//  $api_key = '6825f0e79c87f6c930d8b252694ef1cf'; // production
  $domain = 'devtrac.org'; // test
//  $domain = 'devtrac.ug'; // prod
  $url = 'http://test.devtrac.org/services/json';
//  $url = 'http://www.devtrac.ug/services/json'; // production

  $user = 'reinier';
  $password = 'reinier';

  $uid = '';
  $name = '';

  $ch = curl_init();
/*  $method = 'views.get';
  $nonce = base_convert(rand(10e16, 10e20), 10, 36);
  $hash = hash_hmac('sha256', $timestamp .';'.$domain .';'. $nonce .';'. $method, $api_key);
  //prepare the field values being posted to the service
  $data = array(
    'method' => '"' . $method . '"',
    'domain_name' => '"'. $domain . '"',
    'domain_time_stamp' => '"'. $timestamp .'"',
    'api_key' => '"'. $api_key .'"',
    'nonce' => '"'. $nonce .'"',
    'hash' => '"'. $hash .'"',
    'sessid' => '"'. $sessid .'"',
    'view_name' => '"api_users"',
    'display_id' => '"page_1"',
//    'args' => '["35"]',
  );
  curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
  $result = curl_exec($ch); 
  $json = json_decode($result);
  print_r($data);
  print 'got the first view' . '<br/><br/>';
*/

/*  $nonce = base_convert(rand(10e16, 10e20), 10, 36);
  $hash = hash_hmac('sha256', $timestamp .';'.$domain .';'. $nonce .';'. $method, $api_key);
  //prepare the field values being posted to the service
  $data = array(
    'method' => '"' . $method . '"',
    'domain_name' => '"'. $domain . '"',
    'domain_time_stamp' => '"'. $timestamp .'"',
    'api_key' => '"'. $api_key .'"',
    'nonce' => '"'. $nonce .'"',
    'hash' => '"'. $hash .'"',
    'sessid' => '"'. $sessid .'"',
    'view_name' => '"api_users"',
    'display_id' => '"page_1"',
//    'args' => '["35"]',
  );
  curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
  //make the request
  $result = curl_exec($ch); 
  //print $result;
  $json = json_decode($result);
  print_r($json);  
  print 'got the first view' . '<br/><br/>';
*/





  
/*  $data = array(
    'view_name' => '"api_users"',
    'display_id' => '"page_1"',
  );
  print callservice($ch, $timestamp, $sessid, $method, $data);
  
*/

// Ok, lets save a file first
  $method = 'file.save';

// you need to change this to your local path

  $imgfile = "/home/drupal/drupal6/sites/default/themes/devtrack_theme/images/IMG00002-20110405-0819.jpg";//gallery_default_image.png";
  $filesize = filesize($imgfile);
  $mimetype = mime_content_type ( $imgfile );
  $handle = fopen($filename, "r");
  $imgbinary = fread(fopen($imgfile, "r"), $filesize);
  $filedata = base64_encode($imgbinary);
  $filesalt = base_convert(rand(10e16, 10e20), 10, 36);

  $file = array (
    'file' => $filedata,
    'filename'=> $imgfile,
    'filesize'=> $filesize,
    'timestamp'=> $timestamp,
    'uid'=> $uid,
    'filemime'=> $mimetype,
    'filepath'=> 'sites/default/files/blackberry/' .$uid . '/gallery_default_image.png',
  );
  $data = array(
    'file' => $file,
  );

  //$fid = callservice($ch, $timestamp, $sessid, $method, $data, FALSE);
  //print "<br/><br/>Fid: " . $fid ;



/* Lets now first update our Field Trip
*/
  $node = array(
        "nid" => 1163, //$ftnid,  // Fill in a Field Trip of your liking
//        "type" => "fieldtrip",
        "changed" => (string) time(), // THIS IS DIFFERENT THAN FOR CREATING
        "field_fieldtrip_public_summary " => Array(Array('value' => "And we changed the public summary")), // NOT NULL maxlength = 300
        "field_fieldtrip_narrative " => Array(Array('value' => "And we changed the full narrative")), // NOT NULL no maxlength
  );

  $method = 'node.save';
  $data = array(
    'node' => $node,
  );
  print "<br/><br/>The Changed Field Trip: ". callservice($ch, $timestamp, $sessid, $method, $data, FALSE);

exit();

// Now, lets create a trip report
  $node = array(
        "nid" => 0,  // for node save, for node update set this value to nid
        "uid" => $uid,  
        "name" => $name,
        "type" => "ftritem",
        "title" => "My remote fieldtrip",  // The title field has a maxlength of 256 (though that is very ugly)
        "created" => (string) time(), // We would really like to have the timestamp the things was *originally created on the BB. not now!)
        "status"=> 0,
        "field_ftritem_field_trip" => Array(Array('nid' => Array("nid" => "[nid:" . $ftnid . "]"))), // the nid of the fieldtrip
        "field_ftritem_public_summary" => Array(Array('value' => "This field is mandatory")),  // NOT NULL maxlength = 300
        "field_ftritem_narrative" => Array(Array('value' => "The full report. this field is mandatory")), // NOT NULL no limit
        "field_ftritem_lat_long"=> Array(Array('openlayers_wkt' => "GEOMETRYCOLLECTION(POINT(33.219482421824 2.9346436140979))")), // this is how the lat & lon is formatted. its optional 
        "field_ftritem_place" => Array(Array('nid' => Array("nid" => "[nid:". $lnid . "]")))
  );
  $method = 'node.save';
  $data = array(
    'node' => $node,
  );
  $trnid = callservice($ch, $timestamp, $sessid, $method, $data, false);

  print "<br/> New Trip Report: result of node.save: " . $trnid; 

/* now, lets update that downloaded Trip Report
   And attach the file we uploaded earlier
*/
  $node = array(
        "nid" => $trnid,  // for node save, for node update set this value to nid
        "type" => "ftritem",
        "title" => "My updated remote fieldtrip", // maxlength = 256
        "changed" => (string) time(), // THIS IS DIFFERENT THAN FOR CREATING
        "status"=> 0,
        "field_ftritem_field_trip" => Array(Array('nid' => Array("nid" => "[nid:" . $ftnid . "]"))), // the nid of the fieldtrip
        "field_ftritem_public_summary" => Array(Array('value' => "We changed the Public Summary here")), // NOT NULL maxlength = 300
        "field_ftritem_narrative" => Array(Array('value' => "And we changed the full narrative")), // NOT NULL no limit
//        "field_ftritem_lat_long"=>  You can not fill in the lat_lon if there is already a place filled in (which on downloaded Trip Reports should be always
        "field_ftritem_images"=> Array(Array('fid' => $fid, 'data' => Array('description' => "Here is my description"))),
  );

  $method = 'node.save';
  $data = array(
    'node' => $node,
  );
  $rinid = callservice($ch, $timestamp, $sessid, $method, $data, true);
  print "<br/><br/>trip report id = " .$rinid;


// Create an Action Item


  $node = array(
        "nid" => 0,  // for node save, for node update set this value to nid
        "uid" => $uid,  
        "name" => $name,
        "type" => "actionitem",
        "title" => "My remote Action Item", // This is mandatory
        "created" => (string) time(), // We would really like to have the timestamp the things was *originally created on the BB. not now!)
        "status"=> 0,  // this is not published
        "field_actionitem_resp_place" => Array(Array('nid' => Array("nid" => "[nid:". $lnid . "]"))), // If known, the nid of the location
        "field_actionitem_ftreportitem" => Array(Array('nid' => Array("nid" => "[nid:". $rinid . "]"))), // the Trip Report Item. This field, or the location is mandatory!!!!! (but we prefer both)
        "field_actionitem_followuptask" => Array(Array('value' => "The full text of the task")), // NOT NULL no limit (but, pff, not too long please)
        "field_actionitem_responsible"=> Array(Array('uid' => Array("uid" => $name))), // this is the current user Name!! (untill you can provide a better uid
        "field_actionitem_status"=> Array(Array('value' => $actionstatus)), // mandatory
        "field_actionitem_due_date" => Array(Array('value' => Array('date' => $actionduedate))), // mandatory, format 02/05/2012 with leading 0!!
  );
  $method = 'node.save';
  $data = array(
    'node' => $node,
  );
  $nid = callservice($ch, $timestamp, $sessid, $method, $data, false);
  print "<br/>Action Item node.save: " . $nid; 

// Update (And ONLY Update!!!) Location
// And ONLY for these fields!!! No body, no title, nothing, dont touch
  $node = array(
        "nid" => $lnid,  // Fill in location NID of your choice
        "uid" => $uid,  
        "name" => $name,
        "type" => "place",
        "changed" => (string) time(), // We would really like to have the timestamp the things was *originally created on the BB. not now!)
        "field_place_responsible_person"=> Array(Array('value' => "Webchick!!")), // maxlength = 60
        "field_place_phone"=> Array(Array('value' => "+256782801749")), // maxlength = 20 !! 
        "field_place_email"=> Array(Array('email' => "reinier.battenberg@mountbatten.net")), // maxlength = 30 and we will validate if its an email address!!! (so xxx@xxx.xx at least!)
        "field_place_website"=> Array(Array('url' => "http://drupal.org")), // maxlength = 256 !! Again, we will validate!!
        "taxonomy"=> Array(1 => 195), // 1 is the vocabulary, for placetype this is 1. 195 is the tid (in this case for Primary School)
  );
  $method = 'node.save';
  $data = array(
    'node' => $node,
  );
  $nid = callservice($ch, $timestamp, $sessid, $method, $data, false);

  print "<br/>Action Item node.save: " . $nid; 


// Update (And ONLY Update!!!) Location
// And ONLY for these fields!!! No body, no title, nothing, dont touch
  $data = "[{\\\"method\\\":\\\"node.save\\\",\\\"sessid\\\":\\\"c42321b9759d4efec41ad8c7cdad092a\\\",\\\"domain_name\\\":\\\"devtrac.org\\\",\\\"domain_time_stamp\\\":1302243022,\\\"api_key\\\":\\\"ed189296f0507fde20b1b9863c6fc21a\\\",\\\"nonce\\\":1302243022,\\\"hash\\\":\\\"f1bc284bb7733630dd7075b652bc969d01b30fd117394ca3beb93f9567db9e55\\\",\\\"node\\\":\\\"{\\\\\\\"nid\\\\\\\":\\\\\\\"460\\\\\\\",\\\\\\\"uid\\\\\\\":\\\\\\\"35\\\\\\\",\\\\\\\"name\\\\\\\":\\\\\\\"sdharmap\\\\\\\",\\\\\\\"type\\\\\\\":\\\\\\\"place\\\\\\\",\\\\\\\"created\\\\\\\":1302243022,\\\\\\\"field_place_responsible_person\\\\\\\":[{\\\\\\\"value\\\\\\\":\\\\\\\"Sachin\\\\\\\"}],\\\\\\\"field_place_phone\\\\\\\":[{\\\\\\\"value\\\\\\\":\\\\\\\"02022222222\\\\\\\"}],\\\\\\\"field_place_email\\\\\\\":[{\\\\\\\"value\\\\\\\":\\\\\\\"sachin@test.com\\\\\\\"}],\\\\\\\"field_place_website\\\\\\\":[{\\\\\\\"url\\\\\\\":\\\\\\\"\\\\\\\"}]}\\\"},{\\\"method\\\":\\\"node.save\\\",\\\"sessid\\\":\\\"c42321b9759d4efec41ad8c7cdad092a\\\",\\\"domain_name\\\":\\\"devtrac.org\\\",\\\"domain_time_stamp\\\":1302243022,\\\"api_key\\\":\\\"ed189296f0507fde20b1b9863c6fc21a\\\",\\\"nonce\\\":1302243022,\\\"hash\\\":\\\"f1bc284bb7733630dd7075b652bc969d01b30fd117394ca3beb93f9567db9e55\\\",\\\"node\\\":\\\"{\\\\\\\"nid\\\\\\\":\\\\\\\"556\\\\\\\",\\\\\\\"uid\\\\\\\":\\\\\\\"35\\\\\\\",\\\\\\\"name\\\\\\\":\\\\\\\"sdharmap\\\\\\\",\\\\\\\"type\\\\\\\":\\\\\\\"ftritem\\\\\\\",\\\\\\\"changed\\\\\\\":1302243022,\\\\\\\"title\\\\\\\":\\\\\\\"Trip Report at Widwol \\\\\\\",\\\\\\\"field_ftritem_public_summary\\\\\\\":[{\\\\\\\"value\\\\\\\":\\\\\\\"\\\\\\\"}],\\\\\\\"field_ftritem_narrative\\\\\\\":[{\\\\\\\"value\\\\\\\":\\\\\\\"Please provide a full report.\\\\\\\"}]}\\\"},{\\\"method\\\":\\\"node.save\\\",\\\"sessid\\\":\\\"c42321b9759d4efec41ad8c7cdad092a\\\",\\\"domain_name\\\":\\\"devtrac.org\\\",\\\"domain_time_stamp\\\":1302243022,\\\"api_key\\\":\\\"ed189296f0507fde20b1b9863c6fc21a\\\",\\\"nonce\\\":1302243022,\\\"hash\\\":\\\"f1bc284bb7733630dd7075b652bc969d01b30fd117394ca3beb93f9567db9e55\\\",\\\"node\\\":\\\"{\\\\\\\"nid\\\\\\\":0,\\\\\\\"uid\\\\\\\":\\\\\\\"35\\\\\\\",\\\\\\\"name\\\\\\\":\\\\\\\"sdharmap\\\\\\\",\\\\\\\"status\\\\\\\":0,\\\\\\\"created\\\\\\\":1302243022,\\\\\\\"type\\\\\\\":\\\\\\\"actionitem\\\\\\\",\\\\\\\"title\\\\\\\":\\\\\\\"New Action Item\\\\\\\",\\\\\\\"field_actionitem_ftreportitem\\\\\\\":[{\\\\\\\"nid\\\\\\\":{\\\\\\\"nid\\\\\\\":\\\\\\\"[nid:556]\\\\\\\"}}],\\\\\\\"field_actionitem_followuptask\\\\\\\":[{\\\\\\\"value\\\\\\\":\\\\\\\"Some task\\\\\\\"}],\\\\\\\"field_actionitem_responsible\\\\\\\":[{\\\\\\\"uid\\\\\\\":{\\\\\\\"uid\\\\\\\":\\\\\\\"34\\\\\\\"}}],\\\\\\\"field_actionitem_status\\\\\\\":[{\\\\\\\"value\\\\\\\":1}],\\\\\\\"field_actionitem_due_date\\\\\\\":[{\\\\\\\"value\\\\\\\":{\\\\\\\"date\\\\\\\":\\\\\\\"8/5/2011\\\\\\\"}}]}\\\"},{\\\"method\\\":\\\"questionnaire.submit\\\",\\\"sessid\\\":\\\"c42321b9759d4efec41ad8c7cdad092a\\\",\\\"domain_name\\\":\\\"devtrac.org\\\",\\\"domain_time_stamp\\\":1302243023,\\\"api_key\\\":\\\"ed189296f0507fde20b1b9863c6fc21a\\\",\\\"nonce\\\":1302243023,\\\"hash\\\":\\\"f4ad8547c4d5027b74872aab85cec1b95ef660985c7577aa364889a1eca2e3a3\\\",\\\"questions\\\":{},\\\"qnid\\\":\\\"556\\\",\\\"contextnid\\\":\\\"460\\\"},{\\\"method\\\":\\\"node.save\\\",\\\"sessid\\\":\\\"c42321b9759d4efec41ad8c7cdad092a\\\",\\\"domain_name\\\":\\\"devtrac.org\\\",\\\"domain_time_stamp\\\":1302243023,\\\"api_key\\\":\\\"ed189296f0507fde20b1b9863c6fc21a\\\",\\\"nonce\\\":1302243023,\\\"hash\\\":\\\"f4ad8547c4d5027b74872aab85cec1b95ef660985c7577aa364889a1eca2e3a3\\\",\\\"node\\\":\\\"{\\\\\\\"nid\\\\\\\":\\\\\\\"460\\\\\\\",\\\\\\\"uid\\\\\\\":\\\\\\\"35\\\\\\\",\\\\\\\"name\\\\\\\":\\\\\\\"sdharmap\\\\\\\",\\\\\\\"type\\\\\\\":\\\\\\\"place\\\\\\\",\\\\\\\"created\\\\\\\":1302243023,\\\\\\\"field_place_responsible_person\\\\\\\":[{\\\\\\\"value\\\\\\\":null}],\\\\\\\"field_place_phone\\\\\\\":[{\\\\\\\"value\\\\\\\":null}],\\\\\\\"field_place_email\\\\\\\":[{}],\\\\\\\"field_place_website\\\\\\\":[{\\\\\\\"url\\\\\\\":\\\\\\\"\\\\\\\"}]}\\\"},{\\\"method\\\":\\\"node.save\\\",\\\"sessid\\\":\\\"c42321b9759d4efec41ad8c7cdad092a\\\",\\\"domain_name\\\":\\\"devtrac.org\\\",\\\"domain_time_stamp\\\":1302243023,\\\"api_key\\\":\\\"ed189296f0507fde20b1b9863c6fc21a\\\",\\\"nonce\\\":1302243023,\\\"hash\\\":\\\"f4ad8547c4d5027b74872aab85cec1b95ef660985c7577aa364889a1eca2e3a3\\\",\\\"node\\\":\\\"{\\\\\\\"nid\\\\\\\":\\\\\\\"557\\\\\\\",\\\\\\\"uid\\\\\\\":\\\\\\\"35\\\\\\\",\\\\\\\"name\\\\\\\":\\\\\\\"sdharmap\\\\\\\",\\\\\\\"type\\\\\\\":\\\\\\\"ftritem\\\\\\\",\\\\\\\"changed\\\\\\\":1302243023,\\\\\\\"title\\\\\\\":\\\\\\\"Trip Report at Widwol \\\\\\\",\\\\\\\"field_ftritem_public_summary\\\\\\\":[{\\\\\\\"value\\\\\\\":\\\\\\\"\\\\\\\"}],\\\\\\\"field_ftritem_narrative\\\\\\\":[{\\\\\\\"value\\\\\\\":\\\\\\\"Please provide a full report.\\\\\\\"}]}\\\"},{\\\"method\\\":\\\"questionnaire.submit\\\",\\\"sessid\\\":\\\"c42321b9759d4efec41ad8c7cdad092a\\\",\\\"domain_name\\\":\\\"devtrac.org\\\",\\\"domain_time_stamp\\\":1302243023,\\\"api_key\\\":\\\"ed189296f0507fde20b1b9863c6fc21a\\\",\\\"nonce\\\":1302243023,\\\"hash\\\":\\\"f4ad8547c4d5027b74872aab85cec1b95ef660985c7577aa364889a1eca2e3a3\\\",\\\"questions\\\":{},\\\"qnid\\\":\\\"557\\\",\\\"contextnid\\\":\\\"460\\\"}]\",\"title\":1302243023}";
  $node = array(
        "nid" => 0,
        "uid" =>35,
        "name"=>"sdharmap",
        "type" =>"bbsync",
        //\"created\":1302243023,
        "body" => $data,
        "title"=> "my sync",
        "created" => (string)time(),
        "fieldtrip" => 123, // This is the nid of the fieldtrip that this node belongs to.
  );
  $method = 'node.save';
  $data = array(
    'node' => $node,
  );
  //$nid = callservice($ch, $timestamp, $sessid, $method, $data, false);

  //print "<br/>bbsync node.save: " . $nid; 




exit();


function callservice ($ch, $timestamp, $sessid, $method, $params, $printjson = FALSE) {
  
  global $api_key;
  global $domain;
  global $ch;

  $timestamp = (string) time();
  $sessid = getsession();
  $nonce = base_convert(rand(10e16, 10e20), 10, 36);
  $hash = hash_hmac('sha256', $timestamp .';'.$domain .';'. $nonce .';'. $method, $api_key);
  //prepare the field values being posted to the service
  $data = array(
    'method' => '"' . $method . '"',
    'domain_name' => '"'. $domain . '"',
    'domain_time_stamp' => '"'. $timestamp .'"',
    'api_key' => '"'. $api_key .'"',
    'nonce' => '"'. $nonce .'"',
    'hash' => '"'. $hash .'"',
    'sessid' => '"'. $sessid .'"',
  );
  
  if (isset($params['node'])) {
    $calldata = $data;
    $calldata['node'] = json_encode($params['node']);
  }
  elseif (isset($params['file'])) {
    $calldata = $data;
    $calldata['file'] = json_encode($params['file']);
  
  } else {
      $calldata = array_merge($data, $params);
  }

  curl_setopt($ch, CURLOPT_POSTFIELDS, $calldata);
  //make the request
  $result = curl_exec($ch); 
  $json = json_decode($result);
  if ($printjson) {
    print $result;
    print_r($params['node']) ;
    print "<br/><br/>";
    print_r($calldata) ;
    print "<br/><br/>";
    print(json_encode($calldata)) . "<br/><br/>";
    print '<br/><br/>Results of '. $calldata['method'] . '<br/>';
//    print_r ($json) ;
  }

  $returnjson = (array) $json;
  return $returnjson['#data']; 

}

function getsession() {
  global $sessionid;
  global $api_key;
  global $domain;
  global $uid;
  global $name;
  global $ch;
  global $url;
  global $user;
  global $password;
  
  if ($sessionid != '') { return $sessionid; }

  $timestamp = (string) time();
  $method = 'views.get';
  curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
  curl_setopt($ch, CURLOPT_POST, 1);
  curl_setopt($ch, CURLOPT_URL, $url);

  $nonce = base_convert(rand(10e16, 10e20), 10, 36);
  $hash = hash_hmac('sha256', $timestamp .';'.$domain .';'. $nonce .';'. $method, $api_key);
  
  $data = array(
    'method' => '"system.connect"',
  );
  curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
  //make the request
  $session = curl_exec($ch); 
  
  $json = json_decode($session);
  $sess = (array) $json;
  $sessid = $sess['#data']->sessid ; // Anonymous session ID.

  print "Anonymous sessionid = ". $sessid . '<br/><br/>';

  $method = 'user.login';
  $nonce = base_convert(rand(10e16, 10e20), 10, 36);
  $hash = hash_hmac('sha256', $timestamp .';'.$domain .';'. $nonce .';'. $method, $api_key);

//prepare the field values being posted to the service
  $data = array(
    'method' => '"' . $method . '"',
    'domain_name' => '"'. $domain . '"',
    'domain_time_stamp' => '"'. $timestamp .'"',
    'api_key' => '"'. $api_key .'"',
    'nonce' => '"'. $nonce .'"',
    'hash' => '"'. $hash .'"',
    'sessid' => '"'. $sessid .'"',
    'username' => '"'. $user .'"',
    'password' => '"'. $password . '"',
  );
  curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
  //make the request
  $result = curl_exec($ch); 
  $json = json_decode($result);
  
  $sess = (array) $json;
  $sessid = $sess['#data']->sessid ; // Your session ID.
  $uid  = $sess['#data']->user->uid;
  $name = $sess['#data']->user->name;
  print $sessid . ' loggedin ' . $name . ' ' . $uid .'<br/><br/>';
  
  $sessionid = $sessid;
  print ('sessionid = '. $sessionid);
  return $sessid;

}




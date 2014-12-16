<?php
require("sensitive.php");

$ldapserver = ldap_connect($bindserver);
ldap_set_option($ldapserver, LDAP_OPT_PROTOCOL_VERSION, 3);
ldap_set_option($ldapserver, LDAP_OPT_REFERRALS, false);


$bind = ldap_bind($ldapserver, $bindusername, $bindpassword);

$base = 'dc=paloaltonetworks,dc=local';
# $searchConferenceRooms = "(&(objectClass=*)(msExchRecipientDisplayType=7))";
# $searchAccountName = '(&(objectClass=user)(sAMAccountName=$accountname))';
#$displayName = 'Mac Chan';
$displayName = 'Chen';
$searchDisplayName = '(&(objectClass=user)(displayName=*' . $displayName . '*))';
#$listAllUser = '(&(objectClass=user)(displayName=*)(physicaldeliveryofficename=*)(samaccountname=*))';
$listAllUser = '(&(objectClass=user)(physicaldeliveryofficename=*Clara*))';
$attributes = array(
    # 'cn',
    'title',
    'physicaldeliveryofficename',
    'telephonenumber',
    'displayname',
    'samaccountname');
$attributesmap = array(
    'title' => 'title',
    'physicaldeliveryofficename' => 'office',
    'telephonenumber' => 'phone',
    'displayname' => 'display',
    'samaccountname' => 'name');

//$search = ldap_search($ldapserver, $base, $searchDisplayName, $attributes);
$search = ldap_search($ldapserver, $base, $listAllUser, $attributes);
$entries = ldap_get_entries($ldapserver, $search);

$json = array();

foreach ($entries as $entry) {
    $office = $entry['physicaldeliveryofficename'];
    $building = null;
    $cube = null;
    $floor = null;
    if ($office && $office[0]) {
        $office = $office[0];
        #'Santa Clara 43-5118'
        if (preg_match("/ 4(3|4)-(\\d{4})/", $office, $matches)) {
            $building = $matches[1];
            $cube = $matches[2];
            $floor = intval(substr($cube, 0, 1));
            if ($building == '3') {
                $building = 1;
            } elseif ($building == '4') {
                $building = 2;
            } else {
                $building = null;
                $cube = null;
            }
        }
    }
    $person = array(
        'building' => $building,
        'cube' => $cube,
        'floor' => $floor
    );
    foreach ($attributesmap as $from => $to) {
        if ($entry[$from] && $entry[$from][0]) {
            $val = $entry[$from][0];
            $person[$to] = $val;
        } else {
            $person[$to] = null;
        }
    }
    if ($person['display']) {
        $json[] = $person;
    }
}

print json_encode($json, JSON_PRETTY_PRINT);

/*
array (
  'count' => 1,
  0 =>
  array (
    'cn' =>
    array (
      'count' => 1,
      0 => 'Mac Chan',
    ),
    0 => 'cn',
    'title' =>
    array (
      'count' => 1,
      0 => 'Principal Software Engineer',
    ),
    1 => 'title',
    'physicaldeliveryofficename' =>
    array (
      'count' => 1,
      0 => 'Santa Clara 43-5118',
    ),
    2 => 'physicaldeliveryofficename',
    'telephonenumber' =>
    array (
      'count' => 1,
      0 => '+1-408-753-4076',
    ),
    3 => 'telephonenumber',
    'displayname' =>
    array (
      'count' => 1,
      0 => 'Mac Chan',
    ),
    4 => 'displayname',
    'samaccountname' =>
    array (
      'count' => 1,
      0 => 'mchan',
    ),
    5 => 'samaccountname',
    'count' => 6,
    'dn' => 'CN=Mac Chan,OU=Santa Clara,OU=Users,OU=PAN,DC=paloaltonetworks,DC=local',
  ),
)
*/
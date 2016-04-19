<?php
include('settings.php');

$tag = $_GET['tag'];
$url = "https://api.instagram.com/v1/tags/" . $tag . "/media/recent?client_id=" . CLIENT_ID;

//Fetch data from Instagram
$data = getData($url, [], 20);

/**
 * Fetches all data from Instagram with url, then goes to next_url. Also sets a max number to the array, so the load won't be too heavy.
 *
 * @param $url
 * @param $array
 * @param $max
 * @return array
 */
function getData($url, $array, $max)
{
    //Counts the amount of items in array
    $count = count($array);
    //Fetch the JSON data from Instagram
    $url = file_get_contents($url);
    $json = json_decode($url, true);

    //Check if the maximum allowed results is reached, and if so, returns the array
    if ($count >= $max) {
        return $array;
    }

    //Loop through json data and add it to the array
    foreach ($json['data'] as $tags_data) {
        if (isset($tags_data['location']['longitude']) && (isset($tags_data['location']['latitude']))) {
            if ($count >= $max) {
                break;
            }
            $array[$count]['url'] = $tags_data['link'];
            $array[$count]['image'] = $tags_data['images']['low_resolution']['url'];
            $array[$count]['user'] = $tags_data['user']['username'];
            $array[$count]['longitude'] = $tags_data['location']['longitude'];
            $array[$count]['latitude'] = $tags_data['location']['latitude'];
            $count++;
        }
    }
    //Check if there is a next_url in the json data and if so, follow it using the this function
    if (!empty($json['pagination']['next_url'])) {
        return getData($json['pagination']['next_url'], $array, $max);
    } else {
        //Return $array if there are no more urls to follow
        return $array;
    }
}

$count = 1;

switch ($count) {
    case 1:
        echo 1;
        break;
    case 2:
        echo 2;
        break;
    case 3:
        echo 3;
        break;
    case 4:
        echo 4;
        break;
}

header('Content-Type: application/json');
echo json_encode($data);
exit;

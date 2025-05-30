<?php

$inData = getRequestInfo();

$searchResults = "";
$searchCount = 0;

$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
if ($conn->connect_error) 
{
	returnWithError( $conn->connect_error );
} 
else
{
	$search = "%" . $inData["search"] . "%";
	$userId = $inData["userId"];

	$stmt = $conn->prepare("SELECT ID, FirstName, LastName, Phone, Email FROM Contacts WHERE (FirstName LIKE ? OR LastName LIKE ?) AND UserID=?");
	$stmt->bind_param("ssi", $search, $search, $userId);
	$stmt->execute();

	$result = $stmt->get_result();

	$results = array();

	while ($row = $result->fetch_assoc())
	{
		$results[] = $row;
	}

	if (count($results) == 0)
	{
		returnWithError("No Records Found");
	}
	else
	{
		returnWithInfo($results);
	}

	$stmt->close();
	$conn->close();
}

function getRequestInfo()
{
	return json_decode(file_get_contents('php://input'), true);
}

function sendResultInfoAsJson($obj)
{
	header('Content-type: application/json');
	echo $obj;
}

function returnWithError($err)
{
	$retValue = '{"results":[],"error":"' . $err . '"}';
	sendResultInfoAsJson($retValue);
}

function returnWithInfo($results)
{
	$retValue = json_encode(["results" => $results, "error" => ""]);
	sendResultInfoAsJson($retValue);
}
?>

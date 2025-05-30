<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

$inData = getRequestInfo();

$userId = 0;
$id = 0;

$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
if($conn->connect_error)
{
    returnWithError($conn->connect_error);
}
else
{
    $stmt = $conn->prepare("DELETE FROM Contacts WHERE ID=? AND UserID=?");
    $stmt->bind_param("ii", $inData["id"], $inData["userId"]);
    $stmt->execute();
    
    if($stmt->affected_rows > 0)
    {
        returnWithInfo("Contact deleted successfully");
    }
    else
    {
        returnWithError("Failed to delete contact or contact not found");
    }

    $stmt->close();
    $conn->close();
}

function getRequestInfo()
{
    return json_decode(file_get_contents('php://input'), true);
}

function sendResultInfoAsJson( $obj )
{
    header('Content-type: application/json');
    echo $obj;
}

function returnWithError( $err )
{
    $retValue = '{"error":"' . $err . '"}';
    sendResultInfoAsJson( $retValue );
}

function returnWithInfo( $message )
{
    $retValue = '{"success":true,"message":"' . $message . '"}';
    sendResultInfoAsJson( $retValue );
}
?>

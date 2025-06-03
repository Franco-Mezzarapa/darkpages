<?php

$inData = getRequestInfo();

$searchResults = "";
$searchCount = 0;

$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");

if ($conn->connect_error) {
    returnWithError($conn->connect_error);
} else {
    $search = "%" . $inData["search"] . "%";
    $userId = intval($inData["userId"]);
    $page = max(1, intval($inData["page"] ?? 1));
    $limit = max(1, intval($inData["limit"] ?? 10));
    $offset = ($page - 1) * $limit;

    // Total count for pagination
    $countStmt = $conn->prepare(
        "SELECT COUNT(*) as total 
         FROM Contacts 
         WHERE (LOWER(FirstName) LIKE LOWER(?) OR LOWER(LastName) LIKE LOWER(?)) 
         AND UserID = ?"
    );
    $countStmt->bind_param("ssi", $search, $search, $userId);
    $countStmt->execute();
    $countResult = $countStmt->get_result();
    $totalRows = $countResult->fetch_assoc()["total"];
    $totalPages = ceil($totalRows / $limit);
    $countStmt->close();

    // Fetch results for this page
    $stmt = $conn->prepare(
        "SELECT ID, FirstName, LastName, Phone, Email 
         FROM Contacts 
         WHERE (LOWER(FirstName) LIKE LOWER(?) OR LOWER(LastName) LIKE LOWER(?)) 
         AND UserID = ?
         LIMIT ? OFFSET ?"
    );
    $stmt->bind_param("ssiii", $search, $search, $userId, $limit, $offset);
    $stmt->execute();

    $result = $stmt->get_result();
    $results = array();

    while ($row = $result->fetch_assoc()) {
        $results[] = $row;
    }

    if (count($results) == 0) {
        returnWithError("No Records Found");
    } else {
        returnWithInfo($results, $page, $limit, $totalPages, $totalRows);
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
    $retValue = json_encode([
        "results" => [],
        "error" => $err,
        "page" => null,
        "limit" => null,
        "totalPages" => null,
        "totalResults" => null
    ]);
    sendResultInfoAsJson($retValue);
}

function returnWithInfo($results, $page, $limit, $totalPages, $totalResults)
{
    $retValue = json_encode([
        "results" => $results,
        "error" => "",
        "page" => $page,
        "limit" => $limit,
        "totalPages" => $totalPages,
        "totalResults" => $totalResults
    ]);
    sendResultInfoAsJson($retValue);
}

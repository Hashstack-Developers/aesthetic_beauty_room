<?php
declare(strict_types=1);

header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    echo json_encode([
        "ok" => false,
        "error" => "Method not allowed."
    ]);
    exit;
}

// Accept JSON payload from fetch()
$rawBody = file_get_contents("php://input");
$payload = json_decode($rawBody ?: "{}", true);
if (!is_array($payload)) {
    $payload = [];
}

$name = trim((string)($payload["name"] ?? ""));
$email = trim((string)($payload["email"] ?? ""));
$message = trim((string)($payload["message"] ?? ""));

if (mb_strlen($name) < 2) {
    http_response_code(400);
    echo json_encode(["ok" => false, "error" => "Please enter a valid name."]);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(["ok" => false, "error" => "Please enter a valid email address."]);
    exit;
}

if (mb_strlen($message) < 10) {
    http_response_code(400);
    echo json_encode(["ok" => false, "error" => "Message must be at least 10 characters."]);
    exit;
}

// Update this to the inbox where you want messages.
$to = "syedahsannaqvi75@gmail.com";
$subject = "New contact form message - Aesthetic Beauty Room";

$safeName = htmlspecialchars($name, ENT_QUOTES | ENT_SUBSTITUTE, "UTF-8");
$safeEmail = htmlspecialchars($email, ENT_QUOTES | ENT_SUBSTITUTE, "UTF-8");
$safeMessage = nl2br(htmlspecialchars($message, ENT_QUOTES | ENT_SUBSTITUTE, "UTF-8"));

$body = "<html><body>";
$body .= "<h2>New Contact Form Message</h2>";
$body .= "<p><strong>Name:</strong> {$safeName}</p>";
$body .= "<p><strong>Email:</strong> {$safeEmail}</p>";
$body .= "<p><strong>Message:</strong><br>{$safeMessage}</p>";
$body .= "</body></html>";

// Replace with your hosted domain email for best deliverability.
$fromEmail = "no-reply@aestheticbeautyroom.com";
$headers = [
    "MIME-Version: 1.0",
    "Content-type: text/html; charset=UTF-8",
    "From: Aesthetic Beauty Room <{$fromEmail}>",
    "Reply-To: {$email}",
    "X-Mailer: PHP/" . phpversion()
];

$sent = mail($to, $subject, $body, implode("\r\n", $headers));

if (!$sent) {
    http_response_code(500);
    echo json_encode([
        "ok" => false,
        "error" => "Unable to send message right now. Please try again."
    ]);
    exit;
}

echo json_encode(["ok" => true]);

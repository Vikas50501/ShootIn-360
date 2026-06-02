<?php
/**
 * Shootin 360 – Form Mailer
 * Sends contact & booking form submissions via Gmail SMTP.
 * Requires PHP 7.0+ and allow_url_fopen + ssl enabled (standard on cPanel hosting).
 */

// ── Load secrets from local config or environment ──────────────────
$localConfig = __DIR__ . '/config.local.php';
if (file_exists($localConfig)) { require $localConfig; }
if (!defined('SMTP_USER')) define('SMTP_USER', getenv('SMTP_USER') ?: '');
if (!defined('SMTP_PASS')) define('SMTP_PASS', getenv('SMTP_PASS') ?: '');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    exit;
}
header('Content-Type: application/json; charset=utf-8');

// ── Honeypot spam guard ────────────────────────────────────────────
if (!empty($_POST['website'])) {
    http_response_code(200);
    echo json_encode(['ok' => true, 'msg' => 'Thank you!']);
    exit;
}

// ── Gmail SMTP credentials ─────────────────────────────────────────
// SMTP_USER / SMTP_PASS are loaded from config.local.php or environment (see top of file).
if (!defined('TO_EMAIL')) define('TO_EMAIL', 'shootin360.officials@gmail.com');
if (!defined('TO_NAME'))  define('TO_NAME',  'Shootin 360');

// ── Sanitise helper ────────────────────────────────────────────────
function g(string $k): string {
    return htmlspecialchars(trim((string)($_POST[$k] ?? '')), ENT_QUOTES, 'UTF-8');
}

// ── Route by form type ─────────────────────────────────────────────
$type = g('form_type');

if ($type === 'booking') {
    $name    = g('name');
    $biz     = g('business');
    $phone   = g('phone');
    $email   = filter_var(trim($_POST['email'] ?? ''), FILTER_VALIDATE_EMAIL) ?: '';
    $city    = g('city');
    $date    = g('shoot_date');
    $bizType = g('biz_type');
    $size    = g('space_size');
    $msg     = g('message');
    $consent = !empty($_POST['consent']) ? 'Yes' : 'No';

    // Strip CR/LF from any value placed into an email header (Reply-To / Subject)
    $name    = preg_replace('/[\r\n]+/', ' ', $name);
    $bizType = preg_replace('/[\r\n]+/', ' ', $bizType);

    if (!$name || !$phone || !$biz) {
        echo json_encode(['ok' => false, 'msg' => 'Name, business name and phone are required.']);
        exit;
    }

    $subject = "New Booking – {$name} | {$bizType}";
    $replyTo = $email ? "{$name} <{$email}>" : '';
    $body    = buildEmail('New Booking Request', [
        'Full Name'     => $name,
        'Business'      => $biz,
        'Phone'         => $phone,
        'Email'         => $email ?: '—',
        'City'          => $city,
        'Shoot Date'    => $date  ?: '—',
        'Business Type' => $bizType ?: '—',
        'Space Size'    => $size  ?: '—',
        'Message'       => nl2br($msg) ?: '—',
        'Consent'       => $consent,
    ]);

} else {
    // contact form
    $name    = g('name');
    $biz     = g('business');
    $phone   = g('phone');
    $city    = g('city');
    $service = g('service');
    $msg     = g('message');
    $consent = !empty($_POST['consent']) ? 'Yes' : 'No';

    // Strip CR/LF from any value placed into an email header (Subject)
    $name    = preg_replace('/[\r\n]+/', ' ', $name);
    $service = preg_replace('/[\r\n]+/', ' ', $service);

    if (!$name || !$phone) {
        echo json_encode(['ok' => false, 'msg' => 'Name and phone are required.']);
        exit;
    }

    $subject = "New Enquiry – {$name} | {$service}";
    $replyTo = '';
    $body    = buildEmail('New Contact Enquiry', [
        'Name'     => $name,
        'Business' => $biz  ?: '—',
        'Phone'    => $phone,
        'City'     => $city  ?: '—',
        'Service'  => $service ?: '—',
        'Message'  => nl2br($msg) ?: '—',
        'Consent'  => $consent,
    ]);
}

// ── Send & respond ─────────────────────────────────────────────────
$ok = smtpSend(TO_EMAIL, TO_NAME, $subject, $body, $replyTo ?? '');
echo json_encode([
    'ok'  => $ok,
    'msg' => $ok
        ? 'Thank you! We will contact you within 24 hours.'
        : 'Failed to send. Please WhatsApp us at +91 94150 39489.',
]);

// ══════════════════════════════════════════════════════════════════
// FUNCTIONS
// ══════════════════════════════════════════════════════════════════

function buildEmail(string $heading, array $rows): string {
    $trs = '';
    foreach ($rows as $label => $val) {
        $trs .= "
        <tr>
          <td style='padding:10px 14px;border-bottom:1px solid #f2f2f2;font-weight:600;color:#333;white-space:nowrap;width:36%;vertical-align:top'>{$label}</td>
          <td style='padding:10px 14px;border-bottom:1px solid #f2f2f2;color:#555'>{$val}</td>
        </tr>";
    }
    $ts = date('d M Y, H:i') . ' IST';
    return <<<HTML
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:20px;background:#F0F0F0;font-family:Arial,sans-serif;">
<div style="max-width:600px;margin:0 auto;">
  <div style="background:#1A1A1A;padding:28px 32px;border-radius:8px 8px 0 0;">
    <h2 style="color:#F5C200;margin:0;font-size:22px;">{$heading}</h2>
    <p style="color:#888;margin:8px 0 0;font-size:13px;">Shootin 360 – shootin360.com</p>
  </div>
  <div style="background:#fff;padding:24px 32px;border:1px solid #e0e0e0;border-top:none;">
    <table style="width:100%;border-collapse:collapse;">{$trs}</table>
  </div>
  <div style="background:#F8F8F8;padding:14px 32px;font-size:12px;color:#999;border:1px solid #e0e0e0;border-top:none;border-radius:0 0 8px 8px;">
    Received {$ts} via shootin360.com website contact form
  </div>
</div>
</body>
</html>
HTML;
}

function smtpSend(
    string $toAddr, string $toName,
    string $subject, string $body,
    string $replyTo = ''
): bool {
    $errno  = 0; $errstr = '';
    $sock   = @fsockopen('ssl://smtp.gmail.com', 465, $errno, $errstr, 15);
    if (!$sock) return false;

    /* Read one SMTP response (handles multi-line) */
    $read = static function () use ($sock): string {
        $out = '';
        while (!feof($sock)) {
            $line = fgets($sock, 1024);
            if ($line === false) break;
            $out .= $line;
            if (strlen($line) >= 4 && $line[3] === ' ') break;
        }
        return $out;
    };
    $cmd = static function (string $c) use ($sock, $read): string {
        fputs($sock, "{$c}\r\n");
        return $read();
    };

    $read();                                             // greeting banner
    $cmd('EHLO shootin360.com');

    /* AUTH LOGIN */
    $r = $cmd('AUTH LOGIN');
    if (strpos($r, '334') === false) { fclose($sock); return false; }
    $cmd(base64_encode(SMTP_USER));
    $r = $cmd(base64_encode(SMTP_PASS));
    if (strpos($r, '235') === false) { fclose($sock); return false; }

    $cmd('MAIL FROM:<' . SMTP_USER . '>');
    $cmd("RCPT TO:<{$toAddr}>");
    $cmd('DATA');

    /* Encode subject as UTF-8 Base64 */
    $encSubject = '=?UTF-8?B?' . base64_encode($subject) . '?=';
    $msgId      = '<' . uniqid('s360.', true) . '@shootin360.com>';

    $hdrs = [
        'Date: '       . date('r'),
        'From: Shootin 360 <' . SMTP_USER . '>',
        "To: {$toName} <{$toAddr}>",
        "Subject: {$encSubject}",
        "Message-ID: {$msgId}",
        'MIME-Version: 1.0',
        'Content-Type: text/html; charset=UTF-8',
        'Content-Transfer-Encoding: base64',
        'X-Mailer: Shootin360-Mailer/1.0',
    ];
    if ($replyTo) {
        $hdrs[] = "Reply-To: {$replyTo}";
    }

    /* base64-encode body in 76-char lines */
    $encodedBody = chunk_split(base64_encode($body));
    $r = $cmd(implode("\r\n", $hdrs) . "\r\n\r\n" . $encodedBody . "\r\n.");

    $cmd('QUIT');
    fclose($sock);

    return strpos($r, '250') !== false;
}

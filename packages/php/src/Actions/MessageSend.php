<?php

declare(strict_types=1);

namespace ParticleAcademy\Gmail\Actions;

use ParticleAcademy\Gmail\Gmail;
use ParticleAcademy\Connectors\ConnectorConfigException;

/*
 * GENERATED FILE — do not edit.
 *
 * Emitted from provider/actions/message-send.json by weaver's generator.
 * A hand-edit here is destroyed by the next protocol sync, which is worse than
 * being rejected, because it works until it silently does not. Fix
 * provider/actions/message-send.json (or weaver's template/) and regenerate:
 *
 *     npm run provider -- gmail
 */
/**
 * Send an email from a connected Gmail account.
 *
 * POST /gmail/v1/users/{userId}/messages/send —
 * https://developers.google.com/workspace/gmail/api/reference/rest/v1/users.messages/send
 *
 * This describes the request. The connector client resolves the connection,
 * picks the estate, and either calls Gmail or calls the faker.
 */
final class MessageSend
{
    public const OPERATION = 'message_send';
    public const METHOD = 'POST';
    public const PATH = '/gmail/v1/users/{userId}/messages/send';
    public const SIDE_EFFECTS = 'unsafe-to-replay';

    /**
     * Build the JSON body for one call.
     *
     * Validation fails loudly and specifically here, rather than three frames
     * later as an "invalid request" from Gmail.
     *
     * @param array<string,mixed> $config
     * @return array<string,scalar>
     */
    public static function body(array $config): array
    {
        if (($config['userId'] ?? null) === null || ($config['userId'] ?? null) === '') {
            throw new ConnectorConfigException('message_send: "userId" is required (Send as).');
        }

        if (($config['to'] ?? null) === null || ($config['to'] ?? null) === '') {
            throw new ConnectorConfigException('message_send: "to" is required (To).');
        }

        if (($config['subject'] ?? null) === null || ($config['subject'] ?? null) === '') {
            throw new ConnectorConfigException('message_send: "subject" is required (Subject).');
        }

        if (($config['body'] ?? null) === null || ($config['body'] ?? null) === '') {
            throw new ConnectorConfigException('message_send: "body" is required (Message).');
        }

        $body = [];

        $body['raw'] = self::composeMessage($config);

        return $body;
    }

    /**
     * The request path, with each config value URL-ENCODED into it.
     *
     * `PATH` above is the TEMPLATE, which is what the descriptor advertises;
     * this is what a caller sends. A value interpolated raw changes which URL
     * is called — a range like `Sheet1!A:B` or a sheet named `Q1/Q2` — and the
     * provider answers 404 about the document rather than about the encoding.
     *
     * @param array<string,mixed> $config
     */
    public static function path(array $config): string
    {
        return '/gmail/v1/users/'.rawurlencode((string) ($config['userId'] ?? '')).'/messages/send';
    }

    /**
     * The whole message, RFC 2822 and base64url — which is what the provider takes.
     *
     * base64url is NOT base64: `+` and `/` become `-` and `_` and the `=`
     * padding is stripped. PHP has no base64url function, so the substitution is
     * explicit — and a message whose bytes avoid those two characters encodes
     * identically either way, which is what makes skipping it a bug that waits.
     *
     * @param array<string,mixed> $config
     */
    public static function composeMessage(array $config): string
    {
        $lines = [];

        foreach ([
            ['To', $config['to'] ?? null],
            ['Cc', $config['cc'] ?? null],
            ['Subject', $config['subject'] ?? null],
        ] as [$name, $value]) {
            $text = $value === null ? '' : (string) $value;
            // An optional header left empty is omitted entirely: `Cc:` with
            // nothing after it is a malformed header, not an empty one.
            if ($text === '') {
                continue;
            }

            if (preg_match('/[\r\n]/', $text) === 1) {
                // Refused, not sanitised: a subject carrying a newline would add
                // headers of the sender's choosing from a field a form fills.
                throw new ConnectorConfigException(
                    $name.' contains a newline, which would inject another header into the message.'
                );
            }

            $lines[] = $name.': '.$text;
        }

        // The body's own newlines are normalised to CRLF too: a bare LF inside a
        // message is what a strict receiver rejects, and authors paste bare LFs.
        $body = (string) ($config['body'] ?? '');
        $body = str_replace("\r\n", "\n", $body);
        $body = str_replace("\n", "\r\n", $body);

        // Headers, ONE BLANK LINE, then the body. Without the blank line the body
        // is parsed as more headers and the mail arrives empty, with no error.
        $message = implode("\r\n", $lines)."\r\n\r\n".$body;

        return rtrim(strtr(base64_encode($message), '+/', '-_'), '=');
    }
}

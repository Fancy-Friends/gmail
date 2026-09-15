<?php

declare(strict_types=1);

use ParticleAcademy\Gmail\GmailFaker;
use ParticleAcademy\Connectors\FakeValues;

/*
 * GENERATED FILE — do not edit.
 *
 * Emitted from provider/fixtures/ by weaver's generator.
 * A hand-edit here is destroyed by the next protocol sync, which is worse than
 * being rejected, because it works until it silently does not. Fix
 * provider/fixtures/ (or weaver's template/) and regenerate:
 *
 *     npm run provider -- gmail
 */
/**
 * The golden fixtures — the SAME values the TypeScript and Python packages
 * assert.
 *
 * Bit-for-bit identical is the claim, and this is what checks it.
 * Cross-runtime drift does not fail loudly on its own: it completes, down one
 * path, with no error.
 */

it('message_send fakes the shape Gmail publishes', function () {
    $config = [];
    $fake = new FakeValues(FakeValues::seedForCall('gmail', 'message_send', $config));

    $faked = GmailFaker::respond('message_send', ['config' => $config, 'fake' => $fake]);

    // Through JSON and back, because a faked EMPTY object is a stdClass — the only
    // PHP value that spells `{}` on the wire — and `toBe` compares objects by
    // identity. This asserts the VALUES; the `{}`-versus-`[]` spelling is what
    // weaver's cross-runtime parity suite asserts, byte for byte.
    $faked = json_decode((string) json_encode($faked), true, 512, JSON_THROW_ON_ERROR);

    expect($faked)->toBe([
        'id' => 'f09aa8e415493ec7',
        'threadId' => 'f09aa8e415493ec7',
        'labelIds' => [
            'SENT',
        ],
    ]);
});

it('throws for an operation with no fixture rather than inventing a shape', function () {
    $fake = new FakeValues(FakeValues::seedForCall('gmail', 'no_such_operation', []));

    expect(fn () => GmailFaker::respond('no_such_operation', ['config' => [], 'fake' => $fake]))
        ->toThrow(InvalidArgumentException::class);
});

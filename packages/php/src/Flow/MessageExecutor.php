<?php

declare(strict_types=1);

namespace ParticleAcademy\Gmail\Flow;

use FancyFlow\Attributes\FlowNode;
use FancyFlow\Contracts\NodeExecutor;
use FancyFlow\Runtime\ExecutionContext;
use FancyFlow\Runtime\Port;
use FancyFlow\Runtime\RunEvent;
use ParticleAcademy\Connectors\ConnectorClient;
use ParticleAcademy\Gmail\Actions\MessageSend;
use ParticleAcademy\Gmail\Gmail;

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
 * Gmail message, run on a fancy-flow-php host.
 *
 * The PHP twin of `gmailMessageExecutor` in @particle-academy/gmail-js: the
 * same request, built from the node's config by the same `Actions\MessageSend`
 * a host would call directly, and the same value on `out` — the client's
 * `{data, mode, connection}`.
 *
 * The client resolves the connection and the estate from the config. With
 * nothing configured that is FAKE, so a node dropped on a canvas runs against
 * the faker rather than Gmail. To reach a real estate, pass a
 * `ConnectorClient` that knows the host's connections — or bind one in the
 * container, which resolves the constructor by type.
 */
#[FlowNode(
    name: '@particle-academy/gmail_message',
    aliases: [
        'gmail_message',
    ],
    category: 'io',
    label: 'Gmail message',
    description: 'Send an email from a connected Gmail account.',
    inputs: [
        [
            'id' => 'in',
        ],
    ],
    outputs: [
        [
            'id' => 'out',
        ],
    ],
    sideEffects: 'unsafe-to-replay',
    outputShape: [
        [
            'path' => 'data.id',
            'type' => 'string',
            'description' => 'Gmail\'s id for the sent message.',
        ],
        [
            'path' => 'data.threadId',
            'type' => 'string',
            'description' => 'The thread it landed in. Gmail groups by subject and references, so a reply to an existing conversation shares this.',
        ],
        [
            'path' => 'data.labelIds',
            'type' => 'array',
            'description' => 'Labels Gmail applied, typically SENT.',
        ],
    ],
)]
final class MessageExecutor implements NodeExecutor
{
    public function __construct(private readonly ?ConnectorClient $client = null) {}

    public function execute(ExecutionContext $ctx): mixed
    {
        $config = $ctx->config();

        $result = ($this->client ?? new ConnectorClient)->call(
            Gmail::descriptor(),
            MessageSend::OPERATION,
            $config,
            [
                'method' => MessageSend::METHOD,
                'path' => MessageSend::path($config),
                'json' => MessageSend::body($config),
            ],
            $ctx->input('in'),
        );

        $id = is_array($result->data) ? ($result->data['id'] ?? null) : null;
        $ctx->emit(RunEvent::log(
            'info',
            'gmail message_send'.(is_scalar($id) ? ' '.$id : '').' ('.$result->mode->value.')',
            $ctx->node->id,
        ));

        return Port::only('out', $result->toArray());
    }
}

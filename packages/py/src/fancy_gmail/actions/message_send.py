# GENERATED FILE — do not edit.
#
# Emitted from provider/actions/message-send.json by weaver's generator.
# A hand-edit here is destroyed by the next protocol sync, which is worse than
# being rejected, because it works until it silently does not. Fix
# provider/actions/message-send.json (or weaver's template/) and regenerate:
#
# npm run provider -- gmail

"""Send an email from a connected Gmail account.

POST /gmail/v1/users/{userId}/messages/send —
https://developers.google.com/workspace/gmail/api/reference/rest/v1/users.messages/send

This describes the request. `call` resolves the connection, picks the
estate, and either calls Gmail or calls the faker.
"""

from __future__ import annotations

import base64
import json
import re
from typing import Any
from urllib.parse import quote

from .._runtime import CallResult, ConnectorConfigError, Mode, call
from ..service import descriptor

OPERATION = "message_send"
METHOD = "POST"
PATH = "/gmail/v1/users/{userId}/messages/send"
SIDE_EFFECTS = "unsafe-to-replay"


def body(config: dict[str, Any]) -> dict[str, Any]:
    """Build the JSON body for one call, failing loudly and specifically."""
    if config.get("userId") is None or config.get("userId") == "":
        raise ConnectorConfigError(
            "message_send: \"userId\" is required (Send as)."
        )

    if config.get("to") is None or config.get("to") == "":
        raise ConnectorConfigError(
            "message_send: \"to\" is required (To)."
        )

    if config.get("subject") is None or config.get("subject") == "":
        raise ConnectorConfigError(
            "message_send: \"subject\" is required (Subject)."
        )

    if config.get("body") is None or config.get("body") == "":
        raise ConnectorConfigError(
            "message_send: \"body\" is required (Message)."
        )

    out: dict[str, Any] = {}

    out["raw"] = compose_message(config)
    return out



def path(config: dict[str, Any]) -> str:
    """The request path, with each config value URL-ENCODED into it.

    `PATH` above is the TEMPLATE, which is what the descriptor advertises;
    this is what a caller sends. A value interpolated raw changes WHICH URL is
    called — a range like `Sheet1!A:B`, or a sheet named `Q1/Q2` — and the
    provider answers 404 about the document rather than about the encoding.
    """
    return (
        "/gmail/v1/users/"
        + quote(str(config.get("userId") or ""), safe="")
        + "/messages/send"
    )


def compose_message(config: dict[str, Any]) -> str:
    """The whole message, RFC 2822 and base64url — what the provider takes.

    base64url is NOT base64. `urlsafe_b64encode` gets the alphabet right and
    still PADS, so the `=` is stripped separately — which is the half that gets
    missed, and a padded string is one the provider rejects.
    """
    lines: list[str] = []

    for name, value in (
        ("From", config.get("from")),
        ("To", config.get("to")),
        ("Cc", config.get("cc")),
        ("Subject", config.get("subject")),
    ):
        text = "" if value is None else str(value)
        # An optional header left empty is omitted entirely: `Cc:` with nothing
        # after it is a malformed header, not an empty one.
        if not text:
            continue

        if "\r" in text or "\n" in text:
            # Refused, not sanitised: a subject carrying a newline would add
            # headers of the sender's choosing from a field a form fills.
            raise ConnectorConfigError(
                f"{name} contains a newline, which would inject another header into the message."
            )

        if name in ("From",):
            text = _encode_mailbox(text, name)
        lines.append(f"{name}: {text}")

    # The body's own newlines are normalised to CRLF too: a bare LF inside a
    # message is what a strict receiver rejects, and authors paste bare LFs.
    body = str(config.get("body") or "")
    body = body.replace("\r\n", "\n").replace("\n", "\r\n")

    # Headers, ONE BLANK LINE, then the body. Without the blank line the body is
    # parsed as more headers and the mail arrives empty, with no error anywhere.
    message = "\r\n".join(lines) + "\r\n\r\n" + body

    return base64.urlsafe_b64encode(message.encode("utf-8")).decode("ascii").rstrip("=")


def _encode_mailbox(value: str, header: str) -> str:
    """One RFC 5322 mailbox for a header: see weaver's scripts/lib/compose.mjs."""
    v = value.strip(" \t")
    lt = v.rfind("<")
    gt = v.rfind(">")
    bracketed = lt != -1 and gt > lt
    address = (v[lt + 1 : gt] if bracketed else v).strip(" \t")
    name = v[:lt].rstrip(" \t") if bracketed else ""

    if "@" not in address or " " in address or "\t" in address:
        raise ConnectorConfigError(
            f'{header} needs an email address — "Name <you@example.com>" or '
            f'"you@example.com" — got {json.dumps(v, ensure_ascii=False)}'
        )
    if len(name) >= 2 and name.startswith('"') and name.endswith('"'):
        name = re.sub(r"\\(.)", r"\1", name[1:-1], flags=re.DOTALL)
    if name == "":
        return f"<{address}>" if bracketed else address

    if re.search(r"[^\x20-\x7e]", name):
        words: list[str] = []
        chunk = ""
        for ch in name:
            if len((chunk + ch).encode("utf-8")) > 45:
                words.append(chunk)
                chunk = ""
            chunk += ch
        words.append(chunk)
        encoded = " ".join(
            "=?UTF-8?B?" + base64.b64encode(w.encode("utf-8")).decode("ascii") + "?="
            for w in words
        )
        return f"{encoded} <{address}>"
    if any(c in '()<>[]:;@\\,."' for c in name):
        escaped = name.replace("\\", "\\\\").replace('"', '\\"')
        return f'"{escaped}" <{address}>'
    return f"{name} <{address}>"

def message_send(
    config: dict[str, Any],
    *,
    credentials: dict[str, str | None] | None = None,
    mode: Mode = "auto",
    connection_id: str | None = None,
    attempts: int = 3,
) -> CallResult:
    """Send an email from a connected Gmail account."""
    return call(
        descriptor(),
        operation=OPERATION,
        method=METHOD,
        path=PATH,
        json_body=body(config),
        config=config,
        credentials=credentials,
        mode=mode,
        connection_id=connection_id,
        attempts=attempts,
    )

# GENERATED FILE — do not edit.
#
# Emitted from provider/fixtures/ by weaver's generator.
# A hand-edit here is destroyed by the next protocol sync, which is worse than
# being rejected, because it works until it silently does not. Fix
# provider/fixtures/ (or weaver's template/) and regenerate:
#
# npm run provider -- gmail

"""The golden fixtures — the SAME values the TypeScript and PHP packages
assert.

Bit-for-bit identical is the claim, and this is what checks it for Python.
Cross-runtime drift does not fail loudly on its own: it completes, down one
path, with no error.
"""

import pytest

from fancy_gmail._fake import FakeValues, seed_for_call
from fancy_gmail.faker import respond


def test_message_send_fakes_the_published_shape() -> None:
    config = {}
    fake = FakeValues(seed_for_call("gmail", "message_send", config))

    faked = respond("message_send", {"config": config, "fake": fake})

    assert faked == {
        "id": "f09aa8e415493ec7",
        "threadId": "f09aa8e415493ec7",
        "labelIds": [
            "SENT",
        ],
    }


def test_an_operation_with_no_fixture_raises_rather_than_inventing_a_shape() -> None:
    fake = FakeValues(seed_for_call("gmail", "no_such_operation", {}))

    with pytest.raises(ValueError, match="no fake response"):
        respond("no_such_operation", {"config": {}, "fake": fake})

---
id: arb-nldp
status: open
deps: []
links: []
created: 2026-10-19T00:07:49Z
type: bug
priority: 2
assignee: Adam Gross
tags: [canon]
---
# Canon previous and next links form two disconnected chains

Philosophy -> Poetry -> Prayers -> Ancestral -> Science -> Companions -> Upanishads, and separately Stoics -> Fragments -> Daoism -> Buddhism -> Jewish Wisdom -> Mystics. The two never connect and Mystics does not lead to Upanishads. The chains are explicit prev and next fields in src/content/canon.

## Acceptance Criteria

One total order is derived from the canon entries, a test walks it from first to last without a gap, and the parity run shows only the pager links changed.


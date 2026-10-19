---
id: arb-hlt9
status: closed
deps: []
links: []
created: 2026-10-19T04:11:40Z
type: task
priority: 3
assignee: Adam Gross
tags: [decks, content]
---
# Verify the quoted translations on the deck cards against their named editions

Every deck passage names a public-domain edition or translator (King James Version, Legge, Long, Müller, Bellows, Evelyn-White, Pope, Longfellow, Watson, Griffith, Newton's Emerald Tablet, Burnet's Heraclitus). Check each quotation's wording and reference against that edition before launch, and replace the Sappho rendering with a named translation.


## Notes

**2026-10-19T05:11:07Z**

Verified all 87 deck passages (52 Wood, 31 Sky, 4 Year) against the named editions: KJV via bible-api.com, Gutenberg (Long 15877, Legge Tao 216, Jowett 1636, Pope 6130, Longfellow 1001, Mooney 45634, Evelyn-White 348, Legge Analects 3330/4094, Bellows 73533, Wharton 57390), archive.org (Bostock and Riley vol. 3, SBE 13 Vinaya, Bühler Manu, Burnet, Parker 1916), a sacred-texts mirror (Müller SBE 1, Griffith RV, Legge Mencius II), the Chymistry of Isaac Newton (Keynes MS 28), the chinakongzi Legge Mencius, Watson 2013 PDF.
- Honi's Carob, Genesis 21:33: Beersheba -> Beer-sheba (KJV).
- The Burning Bush, Exodus 3:5: lowercase "put off" after the ellipsis.
- The Tree of the Field, Deuteronomy 20:19: semicolon -> colon after "against them" (KJV), value quoted for YAML.
- The Dryads: "but" and "Nymph" restored to Evelyn-White's case, ellipsis spaced.
- The Useless Tree: dropped the comma after "Village" (Watson).
- The Threads Beneath: "connexion" -> "connection" (Long, VI.38).
- Sky Old Light, Job 38:19: the verse ends in a comma, so the quote now ends with an ellipsis.
- Sky Jupiter, Meditations VII.47: semicolon -> comma before "for such thoughts" (Long).
- Sky View from Above: re-cited from V.24 to XII.32 and set to Long's wording ("assigned to every man, for it is very soon swallowed up in the eternal! … and on what a small clod of the whole earth thou creepest!").
- Sky Mirror and sky.mdx epigraph: set to Newton's normalized text ("above & that which", no commas), attribution names Keynes MS 28.
- Sky Venus: replaced the unattributed Sappho rendering with Wharton 1885, fragment 95.
- Sky Sun: attribution now names the canon's translation (trans. Bill Barrett, adapted).
- Year Bloom, Song of Songs 2:12: "The flowers" capitalized as in KJV.
- Year Ember: re-cited as Burnet's fragment 20 (Diels 30), wording already exact.
Not verified: Legge's capitalization of "State" in the Ox Mountain passage (the modern bilingual reprint prints "state"). Out of scope but found: the canon's stoics-marcus-aurelius-2 and philosophy copy cite the same Marcus passage as V.24 in a non-Long wording, where Long has it at XII.32.

# Trust, Liability & Off-Platform Handoffs



This document defines HuluRent's position on what happens when users transact outside the recorded rental flow, and how that position connects to the platform's monetization model. It exists so this reasoning is explicit and citable — in the agreement text built in `hulurent-backend`, in the `hulurent-frontend` app copy, and in front of judges — rather than assumed.

## 1. The core position

HuluRent's protections — digital rental agreements, pickup/return evidence, dispute-support records — apply **only to transactions completed through the recorded platform flow** (request → accept → book → agreement → pickup evidence → return evidence → complete).

Users remain free to arrange a handoff informally, outside this flow. HuluRent does not technically block this. But doing so forfeits the platform's protections: there is no agreement on record, no condition baseline, and no evidence to support either party if something goes wrong.

This is a **disclosed policy**, not a silent assumption. It is stated in the rental agreement itself (built in the `agreements` module of `Hulurent-backend`) and reinforced with an in-app nudge in `Hulurent-frontend` before every handoff step (e.g. before marking pickup complete: *"Recording pickup condition protects both of you if there's a dispute later."*).

## 2. Why this is sufficient, not a gap

HuluRent does not take a transaction fee on rentals. This matters directly:

- **No revenue is lost when two users skip the recorded flow.** Unlike a take-rate marketplace (Airbnb, Uber), an off-platform handoff doesn't cost HuluRent money on that transaction. There is structurally less incentive to build enforcement mechanisms against it.
- **The incentive to use the recorded flow is the protection itself**, not a platform rule forcing it. A renter who wants recourse if an owner claims damage, or an owner who wants recourse if an item isn't returned, has a direct personal reason to use the agreement and evidence features — no policing required.

This reframes "disintermediation" from a revenue-protection problem (which HuluRent doesn't have) into a **user-education problem** (making sure users understand what they give up by skipping the flow) — which is a copy/UX problem for `hulurent-frontend`, not an architecture problem for `hulurent-backend`.

## 3. What this does *not* fully resolve — and how it's mitigated

Two second-order risks remain, and are worth naming rather than ignoring:

**Platform health, over time.** If off-platform arrangement becomes the norm, HuluRent risks becoming a free classifieds board that users abandon after the first match — no repeat engagement, no listing renewal, no boost adoption (see §4). This is a slow-burn risk to engagement and revenue, not a per-transaction one.
*Mitigation:* the in-app nudges above, plus the review system itself — reviews only attach to completed on-platform transactions, so active users have an ongoing reason to keep using the platform even after their first match.

**Reputational exposure.** Even with zero legal liability, a user who is robbed or damaged after skipping the recorded flow may still publicly blame HuluRent, and that costs the platform's reputation even where it costs nothing legally.
*Mitigation:* the distinction between legal exposure (none — stated explicitly in governance policy) and reputational exposure (real, addressed through proactive nudging rather than after-the-fact defense) should be treated as two separate problems with two separate answers, not conflated.

## 4. Monetization: boosted visibility (deferred)

HuluRent's planned monetization is **paid visibility boosts** for listings (owners can optionally pay to have their listing promoted in search/discovery), not a transaction fee, and not third-party display advertising.

This is **explicitly deferred past the MVP**: boosting only creates value once there is enough organic traffic and listing volume that visibility is actually scarce and worth paying for. Building and pricing a boost system before that point would be solving a problem the platform doesn't have yet.

- **MVP:** all listings are free, unranked by payment. No boost feature is built in either `Hulurent-backend` or `Hulurent-frontend`.
- **Post-traction (future expansion):** introduce paid boost tiers once daily active users and listing volume justify it. A draft `Boost` model is already sketched (commented out) at the bottom of `Hulurent-backend`'s `prisma/schema.prisma`, ready to activate when this phase starts. Pricing structure (per-listing vs. account-level, tier pricing) is deferred to that phase and should be decided against real usage data, not guessed now.

This keeps the MVP focused on proving the core rental lifecycle works and avoids spending scarce 14-day build time (see `planning/schedule.md`, this repo) on a monetization feature with no users to monetize yet.

## 5. Summary position, for Q&A

> HuluRent doesn't prevent users from transacting off-platform, because we don't need to — we don't take a fee on the transaction, so there's no revenue leak. Instead, we make the recorded flow valuable enough that skipping it is the user's own informed choice, disclosed clearly, not a loophole we failed to close. Our monetization — visibility boosts — is intentionally a post-MVP feature, introduced once there's enough traffic for visibility to be worth paying for.

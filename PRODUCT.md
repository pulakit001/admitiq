# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

static HTML/CSS/JS (single file, no build step)

## Users

High-school and transfer students applying to universities, working late on applications, essays, and school shortlists. Time-pressured, anxious about deadlines, looking for an edge and for reassurance that the work is on track.

## Product Purpose

AdmitIQ is an AI college admissions copilot: it helps students plan, write, and sharpen their applications and decides what to work on next. Success means a student opens it and immediately knows what to do, and finishes an application cycle feeling guided rather than overwhelmed.

## Positioning

An admissions copilot that reasons about the whole application — school list, essay arc, deadlines, and the student's own profile — rather than a single-purpose essay generator or an odds calculator bolted onto a form.

## Operating Context

Used in sessions late at night before deadline weeks, on a laptop in a browser tab alongside the Common App and school portals. The opening screen is the first thing a returning student sees, so it must earn a few seconds of attention without becoming a toll gate.

## Capabilities and Constraints

- Opening/intro animation that plays on load, then wipes away to reveal the landing page beneath it.
- Landing page content beyond the opening screen is a placeholder shell in this pass (no invented customer counts, acceptance-rate claims, or pricing).
- Must run as static files opened directly in a browser.
- Must respect `prefers-reduced-motion`.

## Brand Commitments

- Name: AdmitIQ. No logo asset exists yet — the opening screen must establish the wordmark/mark itself.
- The name implies intelligence and admissions: IQ reads as signal, measurement, insight.

## Evidence on Hand

None. No existing copy, imagery, customer proof, or brand assets. Future work must not fabricate testimonials, acceptance statistics, university partnerships, or pricing.

## Product Principles

1. The student's next action is always obvious.
2. Show the system reasoning; never assert intelligence it cannot demonstrate.
3. Earn attention rather than demand it — animation is a gift, not a toll.
4. Every claim on screen must be replaceable by real product evidence later.

## Accessibility & Inclusion

The animated opening must have a reduced-motion path and must never trap keyboard focus or block the page from reaching a usable state if scripts fail.

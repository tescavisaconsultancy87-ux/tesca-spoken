# PRD: Online Spoken English High-Converting Landing Page

## Task 1: Tracking & Meta Ads Analytics Utilities
Create `lib/metaPixel.ts` to support Meta Pixel tracking events (PageView, ViewContent, CTA_Click, InitiateCheckout, DemoPlay, PricingView, ScrollDepth) with graceful console fallback when Pixel ID is not configured.

## Task 2: Distraction-Free Sticky Navigation Header
Build sticky header with minimal navigation (Course, What You'll Learn, How It Works, Reviews, FAQ) and high-visibility CTA ("Start Learning"). Includes mobile drawer and auto-close on link click.

## Task 3: High-Impact Hero Section with GSAP Animations & Realistic Smartphone Mockup
Implement Hero section with headline ("Speak English With Confidence. Without Fear. Without Hesitation."), trust badges, dual CTAs ("START LEARNING", "SEE HOW IT WORKS"), and an interactive smartphone visual showcasing the Class Plus course dashboard with floating journey card.

## Task 4: Problem Section ("You Know English. But Do You Struggle to Speak It?")
Create 4 relatable struggle cards (Understanding vs speaking, Translating in head, Feeling nervous, Don't know what to say) with hover effects and the concluding mindset shift statement.

## Task 5: Solution Framework & Learning Journey
Create the 4-pillar solution cards (Speak, Understand, Apply, Improve) and the linear progression indicator (Learn → Practice → Speak → Improve).

## Task 6: Course Introduction & Specifications Card
Create course introduction copy and feature cards with customizable placeholders ([COURSE DURATION], [NUMBER OF LESSONS], Level: Beginner / Intermediate, Format: Online, Access: Class Plus App, Language: English + Gujarati/Hindi).

## Task 7: Interactive Curriculum Section (Modules 01 - 06)
Build the 6-module curriculum cards with expandable topics and learning objectives for every module.

## Task 8: Interactive Demo Lesson Experience
Build mock lesson preview with video thumbnail, duration badge, realistic play trigger, animated audio waveform, dialogue transcript snippet, and key learning points with "TRY THE COURSE" CTA.

## Task 9: 6 Core Value Features ("Why Learn With Us?")
Create 6 modern feature cards highlighting practical English, mobile learning, flexible pace, structured path, real-life focus, and practice-based learning.

## Task 10: Persona Segmentation ("Is This Course For You?")
Build the 6 target audience persona cards: Students, Job Seekers, Working Professionals, Homemakers, Beginners, and Anyone Wanting Confidence.

## Task 11: Before vs After Transformation Grid
Implement the split comparison showing the transformation from hesitation to confidence with realistic disclaimer.

## Task 12: How It Works & Buying Journey (3 Simple Steps)
Create the step-by-step visual onboarding guide: 1. Download Class Plus → 2. Choose the Course → 3. Start Learning.

## Task 13: Dedicated Class Plus App Showcase
Showcase mobile learning benefits on the Class Plus app with app screenshots mockup and direct App Store / Google Play store action buttons.

## Task 14: Social Proof & Testimonials Grid
Build high-credibility testimonial cards with 5-star ratings, learner roles, and transparent placeholder handling.

## Task 15: Course Pricing, Honest Urgency & Guarantee Section
Build high-converting pricing card with original vs discounted price, checklist of inclusions, secure payment badges, and non-manipulative urgency banner.

## Task 16: Interactive FAQ Accordion
Build the 12-question accordion with animated height transitions and keyboard accessibility.

## Task 17: Full-Width Final CTA, Comprehensive Footer & Sticky Mobile Conversion Bar
Build the closing full-width banner, footer with brand info and legal links, and a persistent sticky bottom CTA bar for mobile viewports.

## Task 18: Landing Page Assembly, Routing & Full Build Verification
Assemble all components into `app/spoken-english-course/page.tsx` (and `app/spoken-english/page.tsx` redirect/alias), verify build, type checks, and linting.

## Task 19: Local GEO SEO Landing Pages for 4 Surat Branches
Build dedicated location-specific landing pages (`/branches/sarthana`, `/branches/mota-varachha`, `/branches/hirabaug`, `/branches/yogichowk`) with branch-specific NAP, embedded Google Maps, direct directions, localized reviews, and rich LocalBusiness/EducationalOrganization JSON-LD schemas.

## Task 20: Contact Page & Lead Capture CRO Overhaul
Upgrade `app/contact/page.tsx` with high-converting 1-Click WhatsApp Quick Inquire button with pre-filled batch messages, instant phone click-to-call, Demo Booking Mode toggle, and branch quick-direction cards.

## Task 21: High-Converting Assessment & Demo Booking Trigger
Add a prominent conversion magnet across marketing pages linking to the 2-minute English level assessment and 1-click WhatsApp demo booking to capture passive visitors.

## Task 22: Generative Engine Optimization (GEO/AEO) Knowledge Enrichment
Enrich `public/llms.txt` and `public/llms-full.txt` with comprehensive course fee tables, local branch directory, curriculum breakdown, and comparison tables for AI search engine citations.

## Task 23: Review Generator Google Maps Growth Loop
Enhance `app/review-generator/` with direct Google Business Profile links for each branch, one-click review copy, and WhatsApp share trigger to accelerate 5-star review acquisition.

## Task 24: Full System Verification, Sitemap Update & Build Gate
Include branch routes in `app/sitemap.ts`, verify caching in `next.config.ts`, and run complete production build with zero errors.

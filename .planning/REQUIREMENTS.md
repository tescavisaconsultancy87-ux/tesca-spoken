# Requirements Specification: Spoken English Landing Page

## 1. Functional Requirements
- **FR-01: Dedicated Landing Page Route**:
  Create `/spoken-english-course` (and link/redirect `/spoken-english` if helpful) with independent, distraction-free layout (minimal navigation header, no multi-page distractions).
- **FR-02: Sticky Header with Instant Anchor Navigation & CTA**:
  Sticky navbar with Brand name, anchor links (Course, What You'll Learn, How It Works, Reviews, FAQ), and sticky conversion CTA button.
- **FR-03: Hero Section with EdTech Smartphone Visual**:
  Bold value proposition, micro-badge, trust indicators, dual CTAs ("Start Learning" / "See How It Works"), and interactive floating app mockup previewing Class Plus interface, progress indicators, and journey highlights.
- **FR-04: Problem Section (Pain Point Empathy)**:
  4 relatable cards ("I Understand English But Can't Speak", "I Translate Everything in My Head", "I Feel Nervous Speaking English", "I Don't Know What to Say") followed by root cause revelation.
- **FR-05: Solution Framework**:
  Explain "Speak, Understand, Apply, Improve" with visual 4-step progressive pill line.
- **FR-06: Course Specifications Card**:
  Specs with customizable placeholders ([COURSE DURATION], [NUMBER OF LESSONS], Level, Format: Online, Access: Class Plus App, Language, Lifetime/limited access).
- **FR-07: Interactive Curriculum (Modules 01 - 06)**:
  Module 01 English Basics, Module 02 Daily Conversation, Module 03 Grammar for Speaking, Module 04 Vocabulary Building, Module 05 Speaking Practice, Module 06 Confidence Building. Expandable/interactive modules.
- **FR-08: Interactive Demo Lesson Preview**:
  Mock lesson player with video thumbnail, duration badge, play action, short transcript dialog snippet, key takeaways, and "Try The Course" CTA.
- **FR-09: 6 Core Value Features**:
  Practical English, Learn From Your Phone, Learn at Your Own Pace, Structured Learning, Real-Life Situations, Practice-Based Learning.
- **FR-10: Target Audience Segmentation (6 Personas)**:
  Students, Job Seekers, Working Professionals, Homemakers, Beginners, Confidence Seekers.
- **FR-11: Before vs After Transformation Grid**:
  Hesitation (5 pain points) vs Confidence (5 tangible transformation results) with realistic disclaimer ("With consistent practice, you can work toward...").
- **FR-12: How It Works (3 Steps + Journey Flow)**:
  Step 1: Download Class Plus -> Step 2: Choose the Course -> Step 3: Start Learning.
- **FR-13: Dedicated Class Plus App Showcase**:
  Mobile app features, device preview cards, and App Store / Google Play download buttons.
- **FR-14: Social Proof & Testimonials Carousel/Grid**:
  Verified learner review cards with star ratings, student profiles, and honest placeholders without fake metrics.
- **FR-15: Course Pricing & Offer Card**:
  Original vs Offer price placeholders, checkmark benefits list, secure payment badge, instant access reassurance, primary "BUY THE COURSE" CTA.
- **FR-16: Honest Urgency Banner**:
  Clean offer banner with valid discount window without fake countdown clocks.
- **FR-17: Interactive FAQ Accordion**:
  12 essential questions addressed cleanly with keyboard accessibility and animated open/close states.
- **FR-18: Full-Width High-Impact Closing CTA**:
  Deep navy contrast card with gradient glow and dual actions.
- **FR-19: Comprehensive Footer**:
  Legal policies, disclaimers, brand copyright, contact links.
- **FR-20: Mobile Bottom Sticky CTA**:
  Floating bottom action bar visible on mobile viewports for effortless one-tap conversion.

## 2. Technical & Performance Requirements
- **NFR-01: Mobile First & Ultra Fast**: High Core Web Vitals, zero layout shift (CLS < 0.05), responsive down to 320px width.
- **NFR-02: Tracking Readiness**: Meta Pixel tracking helper firing standard & custom events (PageView, ViewContent, Lead, InitiateCheckout, AppDownloadClick, VideoDemoClick).
- **NFR-03: GSAP Animations**: Smooth reveal animations, magnetic or hover lift effects, scroll-triggered highlights that captivate visitors without sluggishness.
- **NFR-04: WCAG 2.1 AA Accessibility**: Semantic landmarks, keyboard navigation, high color contrast ratios (> 4.5:1), visible focus outlines.

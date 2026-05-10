Scale Forge — Website Credibility & Content Fix
Product Requirements Document (PRD)
Site: scaleforgewebdev.vercel.app
Version: 1.0
Date: May 2026
Priority: HIGH — These issues are actively damaging client trust and conversion.
Scope: Content, copy, and UI visibility changes only. No redesign required.

Overview
This document outlines all required content and UI changes to the Scale Forge website. These changes fix credibility gaps, remove placeholder content, and ensure the website accurately represents the agency to potential clients.

Issues Summary
#ElementCurrent ProblemRequired Fix1Project Card LinksAll cards link to example.comRemove links or replace with real live URLs2Years of ExperienceShows "5 Years"Change to "3 Years" or remove entirely3Pricing CurrencyAll prices in USD ($)Switch to PKR or add currency clarification4Stats CounterShows "20+ Clients" & "35+ Projects"Replace with accurate numbers or remove5Portal Nav LinksAdmin/Employee/Client visible to allHide from public nav; show only post-login6Hero Section CopyVague headline & generic subheadingReplace with specific, targeted copy7Experience ClaimSays "10+ years of experience"Remove or replace with accurate claim8Blogs Nav ItemBlogs in nav with no contentHide until at least 3 posts are published

Detailed Requirements
Issue 1 — Project Card Links
Location: Homepage > Selected Work section
Current Behavior:

All four project cards (Car Rental, Dental Clinic, Jewellery Store, E-Commerce) have "Learn More" buttons linking to example.com

Required Change:


Option: Remove the "Learn More" button entirely 

Acceptance Criteria: No project card links to example.com after this fix.

Issue 2 — Years of Experience Stat
Location: Homepage > Stats counter section
Current Behavior:

Displays "5 Years" as a stat

Required Change:

Option A: Change "5 Years" to "3 Years" to reflect actual founding year (2023)
Option B: Remove the "Years" stat tile entirely
Do NOT display any number that is inaccurate or unverifiable

Issue 4 — Stats Counter
Location: Homepage > Stats section
Current Behavior:

Displays "20+ Happy Clients" and "35+ Projects Done"

Required Change:

Option A: Replace with real, accurate, verifiable numbers
Option B: Remove the stats section entirely until numbers are real
Do NOT display inflated or fabricated social proof


Issue 5 — Portal Links in Navigation
Location: Main navbar (visible on all pages)
Current Behavior:

Navbar shows a "Portal" dropdown with three public links: /portal/admin, /portal/employee, /portal
These links are accessible to all visitors without authentication

Required Change:

Remove the Portal dropdown from the public-facing navigation entirely
Portal links should only be accessible after login, or via a hidden URL not in the nav
Redirect unauthenticated users to a login page if they try to access any /portal route directly

Acceptance Criteria: No visitor can see or click portal links without being logged in.

Issue 6 — Hero Section Copy
Location: Homepage > Hero section (above the fold)
Current Behavior:

Headline: "Where Goals Meet Reality"
Subheading: "We help businesses achieve their goals through innovative solutions and cutting-edge technology. Scale your business with precision."

Required Change:
Replace with the following copy:

Headline: "We Build High-Converting Websites for Growing Businesses"
Subheading: "Scale Forge designs and develops fast, professional websites using Next.js — businesses establish a credible digital presence that wins clients."




Issue 7 — "10+ Years of Experience" Claim
Location: Homepage > Comparison section (Scale Forge vs Other Agencies)
Current Behavior:

Scale Forge column lists "Experts with 10+ years of experience"

Required Change:

Remove this bullet point entirely
Replace with an accurate differentiator such as: "Dedicated team with hands-on project experience" or "Senior-reviewed deliverables on every project"
Do NOT make any experience claim that cannot be verified on a client call

Implementation Priority
Complete in this order:

Issue 5 — Remove portal links from navbar (security risk)
Issue 1 — Fix project card links, remove example.com
Issue 6 — Update hero copy
Issue 4 — Remove or correct stats counter
Issue 3 — Fix pricing currency
Issue 7 — Remove "10+ years" claim
Issue 2 — Fix years of experience stat



Out of Scope
Do NOT change any of the following as part of this PRD:

Overall visual design, color scheme, layout, or animations
Adding new pages or sections
Backend functionality or database changes
SEO meta tags or performance optimization

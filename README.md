MARKWISE

Brand Governance Platform

A Hackathon MVP | CodeNexus India 2026

Live Demo | GitHub Repository

About the Project

Markwise is a brand governance platform designed to help organizations maintain consistency and accuracy in their marketing content.

It checks submitted content against configured brand guidelines and selected approved facts, highlights potential issues, and provides suggested corrections for human review.

Problem Statement

Organizations often struggle to maintain consistent brand messaging across multiple content creators and marketing channels. Incorrect terminology, unsupported claims, and inconsistent messaging can damage brand trust.

Our Solution

Markwise provides a simple content review workflow that helps identify potential brand compliance issues before publication.

Implemented Features

Dashboard: Displays review statistics and recent activity.

Brand Guidelines: Add, edit, and delete custom brand rules.

Approved Facts: Manage approved brand facts and their sources.

Content Review: Check submitted text against configured keyword-based rules and a selected fact check.

Suggested Corrections: Apply suggested replacements to flagged text.

Human Review: Approve or reject reviewed content.

Review History: View previously submitted reviews.

Insights: Display review statistics and recurring rule patterns.

Local Data Storage: Save demo rules, facts, and reviews in browser localStorage.

Technology Stack

HTML5

CSS3

JavaScript

Browser LocalStorage

GitHub Pages

How to Use

Open the live demo.

Navigate to Brand Guidelines to add or manage rules.

Open Approved Facts to manage approved information.

Go to Content Review.

Enter sample marketing content.

Click Check Content.

Review detected issues and suggested corrections.

Use Approve or Reject to record a reviewer decision.

Explore Dashboard, Review History, and Insights.

Technical Implementation and Limitations

This version is a frontend MVP built using HTML, CSS, and JavaScript.

Rule detection uses configured keyword matching.

The current fact-checking demonstration includes a specific claim check against a sample approved fact.

Review decisions and demo data are stored in the browser using localStorage.

The project uses fictional demonstration data for NovaLearn.

Current Limitations

No production backend or cloud database.

No multi-user authentication.

No live AI integration.

Data is stored locally in the browser and is not synchronized across users or devices.

Future Improvements – Round 3 Roadmap

Source-Cited Findings: Connect every detected issue to its exact approved guideline or fact source, with an option to abstain when evidence is unavailable.

Intent-Preserving Suggestions: Introduce editable suggestions that change only the flagged text while preserving the creator's original intent.

Guideline-Gap Insights: Analyze repeated errors, dismissed findings, and unclear rules to help brand managers improve their guidelines.

Responsible Design

Markwise is designed to support human decision-making rather than replace it. Content creators and reviewers retain control over final content approval.

Built for CodeNexus India 2026.

# Coaching practice tracker (Carnet de coach)

**Version 2.0.0 (November 2026)** · Tool © 2026 Allan Oudomphong · PolyForm Shield 1.0.0 licence · *Version française : [README.md](README.md)*

A logbook to run your coaching practice. You log your meetings, your proposals and the people you work with, and you track your indicators, your ease, your deliberate practice, your goals and your follow-ups.

The app opens from its web address and installs on your computer like an app. There is no account to create and no subscription. **Your data is never online**: it stays on your computer, in **a single file** `coaching-data.json`, kept in the folder of your choice.

- This file holds your entries, your settings, your logo and your banner.
- It can be encrypted with a password.
- A backup copy is made automatically in the `sauvegardes/` (backups) subfolder.

**Browser required:** Chrome or Edge on a computer. Firefox, Safari and mobile devices cannot write to a folder.

**Language:** English or French. The **FR / EN** button, top right, switches the whole app's language at any time; your data does not change.

## Contents

1. [Getting started](#1-getting-started)
2. [First launch: the welcome and the roadmap](#2-first-launch-the-welcome-and-the-roadmap)
3. [Logging time](#3-logging-time)
4. [Deliberate practice](#4-deliberate-practice)
5. [Coach: your profile](#5-coach-your-profile)
6. [Dashboard](#6-dashboard)
7. [Activity](#7-activity)
8. [My entries](#8-my-entries)
9. [People](#9-people)
10. [Proposals and contracts](#10-proposals-and-contracts)
11. [Costs and real hourly rate](#11-costs-and-real-hourly-rate)
12. [Settings](#12-settings)
13. [Security and encryption](#13-security-and-encryption)
14. [Your data: saving, backups, recovery](#14-your-data-saving-backups-recovery)
15. [What's new and versions](#15-whats-new-and-versions)
16. [Sharing with a peer](#16-sharing-with-a-peer)
17. [Troubleshooting](#17-troubleshooting)
18. [Licence and use](#18-licence-and-use)
19. [Version history](#19-version-history)
20. [About](#20-about)
21. [How the tool is built](#21-how-the-tool-is-built)

---

## 1. Getting started

### Install the app (2 minutes, once)

1. Open **[carnet-de-coach.fr](https://carnet-de-coach.fr)** in Chrome or Edge, then “Open the notebook”. The app itself lives at **carnet-de-coach.fr/app/**.
2. Click the **Install** icon, to the right of the address bar: a screen with a downward arrow. In Edge, the option is also in the menu **⋯ > Apps > Install this site as an app**.
3. The app appears in your Start menu, or in the Dock and Launchpad on a Mac. It opens in its own window and **works even offline**.

**Icons.** The installed app's icon (Start menu, taskbar, Dock) is the same for everyone. The tab and title-bar icon uses your notebook's logo, if you added one (Settings > Appearance).

**Updates are automatic.** On the next launch, a “New version available” banner offers to reload, then a screen presents what's new (see [part 15](#15-whats-new-and-versions)).

### Choose where to keep your notebook

Choose a folder on your computer, preferably a synced one (OneDrive, Google Drive…): your notebook then follows you from one computer to another, and it is backed up.

- **You are starting out:** click “Start”. The roadmap will suggest choosing the folder among your first missions.
- **You already have a `coaching-data.json`:** on the welcome screen, click “I already have a notebook: open its folder”.

When the browser asks for access to the folder, choose **“Allow on every visit”** if the option is offered. You will have nothing more to do on later launches.

### Change language

The **FR / EN** button, top right (and the “Français / English” link on the welcome screen), switches the whole app to English or French, instantly: nothing reloads, and an encrypted notebook stays unlocked. The choice is specific to each computer and browser. By default, the app follows the browser's language.

- Only the tool's own texts are translated: your entries, your type names and your skills stay as you wrote them.
- A notebook created in English starts with English labels (types, suggested skills).
- The demo notebook exists in both languages.

> Keep your notebook in a folder of your own. Never put it in a public space or one shared with other people.

---

## 2. First launch: the welcome and the roadmap

### The welcome (less than a minute)

A new notebook opens on three screens:

| Screen | What you do there |
|---|---|
| Welcome | A welcome letter. One link imports a backup or a template passed on by a peer, another lets you **explore a demo notebook**. |
| Your mode | **Simple** or **full** (see below). |
| Your identity | Your name or your practice's name, your logo, a colour palette. |

“Enter my notebook” takes you straight to the tool, and the first mission is shown to you.

The **small house**, left of the tabs, opens the [carnet-de-coach.fr](https://carnet-de-coach.fr) website in a new tab. The welcome screen and the full tour (name, logo, colours) can be replayed from **Settings > Getting started > Replay the welcome**; “Back to my notebook” returns you where you were, without locking the notebook again.

### The demo notebook

“Explore a demo notebook”, on the welcome screen, opens the notebook of Camille Martin, a **fictional** coach of managers: fourteen months of practice, people at every stage, a filled-in coach profile. It opens in simple mode, with a short presentation of the approach followed by a nine-step tour of the pages (to follow or skip). Everything can be explored freely. A banner reminds you it is a demo; “Replay the tour” restarts the presentation; “Create my own notebook” closes it and starts the welcome of a new notebook. The demo notebook is never written to a folder. It exists in English and in French, depending on the language chosen.

### The roadmap

The rest is discovered by using it. The **roadmap**, at the bottom right, suggests **one mission at a time**, in four chapters:

| Chapter | Missions |
|---|---|
| 1. First steps | Log your first meeting, link it to a person, write a note, look at your activity, open a person's profile, choose where to keep your notebook, protect it with a password. |
| 2. Grow your practice | Understand your pipeline (see below), log an invitation, send a proposal, follow it through to the answer. In simple mode: discover full mode. |
| 3. Practise deliberately | Complete your coach profile, name at least 3 skills, choose a focus, create an action, write a note and keep it for supervision, log a prepared supervision. |
| 4. Steer | Choose your indicators, set your priority goal, enter your costs. |

- **“Show me”** highlights where to act, on the right tab.
- A mission checks itself off **on its own** when you do the action, wherever you do it.
- Each completed chapter unlocks a **“Roadmap: …”** achievement.
- Full-mode missions do not appear in simple mode.
- **Existing notebook**: when updating, missions already done are ticked silently and the roadmap stays collapsed.
- To hide or show it again: **Settings > Getting started > Show the roadmap**.

### Create your clients through relationships

The “Understand your pipeline” mission opens two pages, available at any time with the **“? The stages”** button in the People tab.

1. **The approach.** Coaches are often advised to use social media, content and marketing: a legitimate path, with its price. This notebook follows that of coaches who have been making a living from it for years: coaching sells through coaching, and you create your clients one conversation at a time. Six principles, each with the entry type that goes with it: meet people every day, help with no strings attached, let people experience coaching, choose your clients, make the offer and ask for referrals, work in a cycle of set length at a fair price. With the notebook's benchmarks for one signed contract: about 13 invitations, 4 people in conversation, 10 conversations, 2 proposals.
2. **The stages.** A person's path, from first meeting to contract, and for each stage **the entry that moves it forward** (see [part 9](#9-people)).

### Celebrations

When you pass a milestone, the tool celebrates it, at three levels of intensity:

- a discreet **banner** when a statistic goes up a level;
- a **card** for a new overall level;
- a full-screen **celebration** for an achievement, with its tier (Bronze, Silver, Gold, Legendary).

Several milestones passed at once follow one another, from the biggest to the smallest. A completed mission is signalled by a small roadmap notification. To turn celebrations off: **Settings > Getting started > Animated celebrations**.

### Simple or full mode

The **Simple mode** button, top right, can be switched on and off at any time. **Nothing is lost**: it hides, it does not delete. The mode is saved in your notebook.

In simple mode:

- **Tabs**: Activity (the main screen), My entries, People, Settings. The dashboard, the Coach profile and Deliberate practice are hidden.
- **No notion of ease, goals, actions or costs.**
- **Entry form**: types are shown one below the other, with their meaning (“I invited someone to experience coaching”…), then your other types. What remains: length, person, “What came up”, meeting notes and follow-up (notes sent, summary). A proposal keeps its amount and commitment length.
- **Activity**: the time-spent-per-month chart and your 3 main indicators (excluding ease, goals and costs).
- **My entries**: the same, without ease ratings or supervision costs.
- **People**: Pipeline view only, with “To follow up” above. The person profile no longer has ease, action plan, description, audience or topic.
- **Settings**: your name, your logo and a suggested colour palette; security, storage, sharing and getting started. Activity types, skills, indicators, people tracking and costs are hidden.

---

## 3. Logging time

This is the everyday gesture: after each meeting, click **“+ Log time”**, top right. It takes less than 30 seconds.

- **Date.** Today by default.
- **Type.** One button per activity type, in its colour, in the order of a client's journey: **Networking › Invitation › Conversation › Proposal › Session › Debrief › Supervision**, then your other types (Other…) on the next line. **Networking** logs a contact from your network (coffee, event, call), the starting point of the journey. The **Invitation** type is used to log each time you offer someone a coaching conversation (no default length).
- **Length.**
  - Buttons offer the usual lengths.
  - The “Other length” field accepts `2,5`, `2.5`, `2h30`, `2h`, `150min` or `1:30`.
  - A number on its own counts as hours up to 10, minutes beyond. There is no cap.
- **Person.**
  - Your recent people appear as buttons.
  - For anyone else, type a few letters in the “Search or create a person…” field: names show up as you type, ignoring accents and capitals. Matches at the start of a first or last name come first, then the people you have seen recently. Archived people are included too, marked “archived”.
  - Pick with the mouse, or with the arrow keys then Enter. Escape closes the list.
  - “+ Create”, at the bottom of the list, followed by the name you typed, creates a new person.
  - It is **required** for a meeting, an invitation, a conversation, a proposal, a session or a debrief; optional for a supervision and for the types you add. The setting can be changed type by type (see [Settings](#12-settings), “Person” column).
- **What came up.** One line: theme, insight, pattern spotted. For a networking entry, the area takes several lines (who, in what context, what was said, what's next) and grows with your text.
- **Meeting notes.** A large optional area, for anything you want to remember. It shows up in My entries (◎ button), in the CSV export and in the CSV import (“Notes” column).
- **Follow-up.** “Notes sent” and “Summary written” boxes, for face-to-face meetings.
- **Answer** (Invitation). “They said no” box if the person declines. You can tick it later, in My entries. Your noes are counted in Activity.
- **Deliberate practice actions.** For each of your actions in progress that concerns this meeting type: **Yes**, **Partly** or **No**. Clicking the answer again clears it. It is the quickest part: start there.
- **Focus.** For each of your focus skills, an ease rating from 1 to 5, a large **“What I noticed”** area and a **“Keep for the next supervision”** box. Everything is optional.
- **Ease · other skills.** A rating from 1 to 5 for your other tracked skills, on two columns. “+ Note on…” opens a note area for one of them.
  - These blocks only appear for types where ease is switched on (Settings > Activity types), except actions, which show for the types you linked them to.
- **Proposal.** Amount, number of planned sessions, commitment length. A proposal is saved as “Pending” (see [part 10](#10-proposals-and-contracts)).
- **Supervision.** Cost of this session. Leave the field empty to count the average price set in Settings (shown greyed out), or enter the actual amount: it takes precedence over the average price. If you later change the average price, all sessions without a custom amount follow. Tick **“Unpaid supervision”** for a session offered or included elsewhere: it is then not counted in your costs.
  - If notes are kept for supervision, they show below with what you take from them (see [part 4](#4-deliberate-practice)). Untick “Attach the notes…” for an unrelated supervision.

---

## 4. Deliberate practice

The **Deliberate practice** tab is for choosing what you are working on right now, checking you are really doing it, and preparing your supervisions.

### Ease compass

- The radar chart shows your ease on each of your tracked skills.
- **Manage my skills** (at the top of the compass) opens the list of your skills: label, **discipline**, benchmarks for 1 and 5, tracked or not, **focus**, number of ratings. It is the only place to manage them; the Settings block points there.
- Skills of the same **discipline** (NLP, Transactional Analysis, Systemic…) are grouped on the compass, under a coloured arc bearing its name. The discipline is free text: suggestions appear as you type.
- **A skill's score is the average of your last 5 ratings**, not your whole history: it reflects where you stand today.
- **↗ or ↘** shows the trend compared with the 5 previous ratings (a gap of at least 0.3).
- A skill never rated stays at the centre, marked “never rated”.
- With fewer than 3 tracked skills, the compass becomes a simple list.
- **Click a skill** to open its history (see below).

### Current focus

- Choose **up to 3 skills** to work on. They are circled on the compass and appear at the top of each entry, with an area to note what you notice.
- Removing a focus (×) pauses the actions linked to it. They stay in the library, with their history.

### Actions in progress

- **Up to 3 actions in progress.** An action is a precise gesture to try: “have them restate the goal in their own words”, “make at least one explicit challenge, and hold it”.
- Each action is linked (or not) to a skill, and to entry types: those are the entries where you will be asked whether you did it.
- Under each action: the last 10 answers (yes, partly, no) and the **success rate** (yes = 1, partly = ½).
- **change** replaces the action with another from the library (the old one is paused). **pause** removes it from entries without losing its history.

### Action library

- All your actions, kept forever: **in progress** first, then the others, **from lowest to highest rate**.
- Statuses: **in progress**, **paused**, **★ mastered** (when the gesture has become natural). Change it with the list to the right of the action.
- **+ New action**: its text, the skill worked on, the entry types concerned. It is added to the library, and moves to in progress if there is room.
- An action never used can be deleted (✕).

### A skill's history

By clicking a skill (compass, focus, or profile):

- its current score, the score of the 5 before, and the curve of your last 10 ratings;
- a button to put it in focus or remove it;
- the actions linked to it, with their rate;
- **all your notes and all your supervision feedback**, newest first. Supervision feedback is right-aligned, in colour, with the date of the supervision and the person who supervised you. “edit” reopens the entry of a note.

### Prepare the next supervision

- All the notes where you ticked **“Keep for the next supervision”** arrive here, newest first.
- **Untick** those you do not want to bring up.
- After the supervision, write under each note **what you take from it**. “→ Turn it into an action” creates an action from what you kept.
- **Save the supervision** opens the supervision entry: the ticked notes and what you take from them are attached. Unticked notes leave the list and stay in their skill's history.
- What you take from it reappears in each skill's history, as supervision feedback.

---

## 5. Coach: your profile

The **Coach** tab (or a click on your logo, top left) shows your coach profile. It is your own page, the one you can show.

### Your profile

**Edit my profile** (or a click on your photo, or on a small +) opens your profile:

- photo (cropped round), name, title (e.g. “Leadership coach”), date of birth (for age);
- **coaching since**: leave empty to use the date of your first logged session;
- **micro-pitch**: one sentence on what you do and for whom;
- **label wording**: feminine, masculine or inclusive (this matters for French rank names; in English, ranks are the same for everyone);
- **training** (qualifications, certifications) and **background**: one line per item.

The header shows your title, your age and your seniority (“2.7 years of coaching (since March 2024)”).

### Rank and level

- **Each statistic has its own curve**, built on the path of a steadily practising coach. Their first year: 80 invitations, 24 people in conversation, 60 conversations, 12 proposals, 6 contracts, 80 paid sessions, 300 h of coaching. After that, their activity ramps up over two years.
- Levels follow this coach's seniority: level 10 ≈ 2 months, 25 ≈ 1 year, 30 ≈ 1.5 years, 40 ≈ 3 years, 60 ≈ 8 years, 100 ≈ 30 years.

| Statistic | Year 1 (≈ level 25) | Cruising pace | Benchmark |
|---|---|---|---|
| Coaching hours | 300 h | 300 h a year | 50 h = level 10 |
| Conversations | 60 | 60 a year | 2 to 3 meetings per person |
| People coached | 36 | 30 a year | |
| Paid sessions | 80 | 200 a year | |
| Deliberate practice | 400 h | 100 h a year | strong at first, flatter later |
| Supervision | 24 h | 12 h a year | 2 h a month at first, every two months later |
| Invitations | 80 | 100 a year | 10 invitations ≈ 3 people in conversation |
| Proposals | 12 | 12 a year | the 1st = level 5 |
| Clients and renewals | 6 | 10 a year | every signed contract counts, renewals included; the 1st = level 10 |

- **Revenue in two stages.** Up to €5,000 cumulated, steps: first euro = level 2, €100 = 3, €200 = 4, €500 = 5, €800 = 6, €1,000 = 7, €1,500 (one French minimum wage) = 8, €3,000 = 10, €5,000 = 12. Beyond that, your **best revenue over 12 rolling months**: €10,000 = 15, €30,000 (€2,500 a month) = 25, €60,000 (a full-time living) = 33, €100,000 = 50, €300,000 = 100. Your level never goes down; the current value of the last 12 months and its monthly equivalent stay shown.
- **Your overall level is the average of the levels of the statistics you have already filled in.** A statistic joins the average at its first entry (for example your first invitation).
- **Your rank changes every 10 levels**:

| Levels | Rank |
|---|---|
| 1–9 | Beginner |
| 10–19 | Apprentice |
| 20–29 | Practitioner |
| 30–39 | Seasoned practitioner |
| 40–49 | Experienced practitioner |
| 50–59 | Expert |
| 60–69 | Recognised expert |
| 70–79 | Go-to coach |
| 80–89 | Mentor |
| 90–99 | Elite |
| 100 | Legend |

### Ease compass, focus and actions

The same compass as in the Deliberate practice tab, with your focus and actions in progress on the right (see [part 4](#4-deliberate-practice)).

### Statistics

Three columns, since the start of your practice. **Each statistic has its level**, up to 100, on the scale above:

- **Coach a lot**: coaching hours, conversations, sessions, people coached;
- **Practise deliberately**: deliberate practice hours, supervision hours;
- **Grow the practice**: invitations, proposals, clients and renewals, revenue.

Under each statistic: its bar towards the next level, and the value to reach. The bar starts again from zero at each level: it fills between the threshold you just passed and the next one.

### Achievements

Under the statistics, your **achievements**:

- **automatic**: first session, steps of sessions, coaching hours (10 h, 50 h, 100 h… 10,000 h), people coached, paying clients (including the first contract), revenue signed, weeks in a row with at least one coaching meeting, deliberate practice hours, supervisions, invitations, **noes received** (“First no”, 10, 25, 50, 100), and your “mastered” deliberate practice actions;
- **also automatic**: one achievement per completed roadmap chapter;
- **your victories**: the successes the tool cannot count on its own (a promotion won by a client, a first executive coached…). Add them with the block's +: an image (cropped square), a title, a date, a tier and a short story “to remember it”. Click a victory to see it large or edit it. Adding one is celebrated like an achievement.
- Each achievement has a tier: **Bronze**, **Silver**, **Gold** or **Legendary**. “NEW” flags those from the last 30 days.
- The **next 3** to unlock are shown, with what you have left.
- Video game theme: cards on three columns, the 9 most recent first (“See the others”). Professional theme: a timeline spaced by time, which scrolls.

### Affinities

A table crosses your **coaching hours** by **audience** (rows) and by **topic** (columns), from your clients' profiles (People tab). The 5 most frequent audiences and topics are shown. A cell of **50 h and more** is a **specialty**. Hours of clients whose audience or topic is not filled in are counted separately.

### Bring in your history

Were you coaching before using the tool? In **Edit my profile > Bring in your history**:

1. **Import your entries** from a spreadsheet: in Excel, “Save as” CSV, then “Import a CSV file” (also at the bottom of the page: “Import a CSV”).
   - “Download the template” gives a file with the right columns. The column names stay in French so the file remains compatible: Date, Type, Durée (length), Personne (person), Commentaire (comment), Notes, Montant (amount), Statut (status). Only Date and Type are required.
   - Accepted dates: `12/03/2024`, `12/03/24`, `2024-03-12`. Types: the labels of your types (Session, Conversation…). Lengths: as in the entry form (`1h30`, `90`, `1.5`).
   - Unknown people are created. Rows already present (same date, same type, same person) are ignored. A summary is shown before importing.
2. **Or enter your totals** from before the tool: hours, sessions, conversations, people coached, deliberate practice, supervision, invitations, proposals, revenue, paying clients. They count in your profile (levels, rank, achievements), not in your indicators or charts.

### Two themes

At the top of the tab: **Professional** (sober, light) or **Video game** (dark, progress ring around the photo, stars, glowing bars). Profile colours are the same for every coach: all profiles read the same way.

---

## 6. Dashboard

This is your direction: look at it once a week.

### Main indicators

These are the first 3 indicators you chose (see [part 7](#7-activity)). They show the value for the year, that of the last 31 days and a trend line. To change them, click “Change my indicators”.

### To follow up

The list of what needs action, most urgent first.

| Alert | When it appears | Buttons |
|---|---|---|
| **Action linked to a person** | It is overdue or due within 7 days. | Done |
| **Pending proposal** | A proposal is awaiting an answer and no action is planned for the person. The waiting time turns red from 14 days. | Accepted · Refused (can be undone) · Plan a follow-up (in 2 days) · Later (one week) |
| **Engagement ending** | The contract ends within 21 days, ended less than 45 days ago, or the last planned session has been reached. | Plan the review · Later (14 days) |
| **No contact** | The person is in conversation or awaiting an answer, with no action planned, and no contact for the chosen threshold (30 days by default, no alert beyond 365 days). | Plan a follow-up · Later · No follow-up |

Click a name to open the person's profile.

### Priority goal

Your current priorities, each with its objective and what it means for you. You can reorder them with the arrows or by drag and drop.

### Action plan

This block is open by default. Click its title to collapse it: it then shows a summary, with the number of actions in progress and overdue.

Each action has a priority goal, a description, a person (optional), a due date, a result and a status: In progress, Done or Cancelled. A click on the person opens the same search field as in the entry form; “— No person” removes it.

- An overdue action is shown in red.
- The “In progress”, “Done” and “Cancelled” pills filter the list.
- Actions created from a profile or a follow-up have “Follow-up” as their goal.

### Indicator tracking

Your targets per quarter, half-year and year: coaching hours, conversations, people coached, deliberate practice, accepted revenue. Each period has an ambition sentence. A bar shows progress. The menu at the top right selects the period.

This block is collapsed by default. Click its title to open it: collapsed, it shows the period and the progress of the quarter's targets. Your open/closed choice is remembered on your computer.

> On a wide screen (1700 px and more), “To follow up” and “Priority goal” sit side by side.

---

## 7. Activity

The tab was called “Metrics” until version 1.7.

### My indicators

You choose up to 6 indicators. The first 3 are **main** ones: they are shown large, also on the dashboard. The next ones are secondary.

- To swap two indicators, drag one onto the other.
- To change them, open “Choose my indicators”. The catalogue shows your actual value to date for each one.

The catalogue has 20 indicators, in 4 pillars:

- **Coach a lot:**
  - coaching hours;
  - conversations;
  - people coached;
  - consistency (active weeks out of the last 12);
  - new people;
  - active clients (31 days).
- **Practise deliberately:**
  - deliberate practice;
  - post-session discipline (notes, summary and ratings, over 90 rolling days);
  - average ease;
  - meeting goal reached.
- **Grow the practice:**
  - revenue accepted / proposed;
  - conversion rate;
  - pending proposals;
  - acceptance rate;
  - average deal;
  - real hourly rate.
- **Steer:**
  - overdue actions;
  - progress on the quarter's targets;
  - share of coaching in your total time.

### Charts

- **Year.** The 2024, 2025, 2026… buttons select the year shown.
- **Time spent per month.** One stacked bar per month, with your number 1 type at the base. Hover a bar to see the detail.
- **Grow your practice.** Two views, for the selected year:
  - **Funnel**: invitations, people in conversation, people with a proposal, clients signed. Between each stage, the **conversion rate** (and that of the previous year). On the right: the overall conversion rate, revenue signed (compared with the previous year), the average deal, your **commercial ease** (average and trend of your goal-reached rating on invitations, conversations and proposals; hidden in simple mode) and your **noes received** (declined invitations and refused proposals): those who get the most noes often get the most yeses. Rates compare distinct people; “—” when the previous stage is not filled in (for example as long as you do not log your invitations).
  - **By month**: invitations, conversations, proposals and signatures, month by month, to see your pace.
- Ease is no longer tracked here: you read it on the ease compass, and by clicking a skill (curve, trend, notes).

---

## 8. My entries

The detail of all your meetings, filterable and editable directly in the table.

- **Filters.**
  - Click a year, a type or one or more people. Click again to remove the filter.
  - Archived people are in a drop-down list, “Archived people”.
- **Summary.** Number of entries, total time, of which coaching, deliberate practice, and percentages of notes and summaries done.
- **Person tile.** When you select a person, their tile shows to the right of the filters. If you select several, one tab per person lets you switch between them.
  - **Left:** their pipeline stage (Met, In conversation, Client…), role and website, dates, figures, and the Profile and Archive buttons.
  - **Right:** their average ease on each of your tracked skills.
  - **Below:** the timeline of their interactions, with the date (dd/mm) above each one and the year in the middle of its period.
- **Years.** Sorted from most recent to oldest.
- **Table.** The columns are, in order: Person, Date, Type, Length, Notes, Summ., What came up, Ratings, Contract / cost.
  - **Ratings** is collapsed by default and shows a summary of values. A click on the header or a cell expands the skill columns, on a pale blue background, to edit them.
  - **Contract / cost** is collapsed by default. Once expanded, on a pinkish background, it shows: Accepted (status), Amount (or a supervision's cost), Length, Sessions. On a supervision, the “unpaid” box replaces the status; on an invitation, the “They said no” box.
  - **Person**: a click on the name opens a search field (recent people first) to change an entry's person, create one, or remove it (“— No person”) on a type where it is optional. An entry missing a required person is outlined in red; “Deleted person” marks an entry whose person was deleted. The small magnifier next to it filters the table on that person.
  - **Length**: “Other…”, at the bottom of the list, lets you type any length (`2,5`, `2h30`, `150min`), then Enter.
  - Every change is saved immediately.
  - **◎** opens the entry's details: meeting notes, and its deliberate practice (action answers, ease ratings, notes, supervision feedback) to complete or correct it. It is coloured when the entry contains some.
  - ✕ deletes an entry. You can undo for a few seconds.
- **Show archived metrics.** Brings back the skills you no longer track.
- **Export CSV** (bottom of the page). A spreadsheet of all your entries.

---

## 9. People

### To follow up

The dashboard's **To follow up** block is also at the top of the People tab, with the same buttons (see [part 6](#6-dashboard)). Click its title to collapse it.

### Views

- **Pipeline** (default): one column per stage, with its number of people and totals (pending proposals, contracts in progress).
  - Each card shows the photo and name, then, across the full width: role, pending amount or contract progress, next action or last contact. An icon opens the person's website.
  - Drag a card into another column to change its stage by hand.
  - Setting “Automatic” again on the profile clears that manual choice.
- **List**: compact tiles, with photo, name, stage, source, role, website, last contact, contract and next action.
  - Stage filters show the number of people in each.
  - Tiles are sorted by next action, then by last contact.
- **Search**: on name, role, source, notes and website.
- **Archived people**: a checkbox to show them.

### The stages

The stage is calculated on its own from your entries. The **“? The stages”** button recalls the approach and what to log at each stage (see [part 2](#create-your-clients-through-relationships)).

**Met**: a first contact, a formal or informal chat where you introduce yourself, a meeting at an evening event, a video or phone call. No commitment, no expectation: the start of a relationship, whatever it may lead to (partnership, client, referral…).

| Stage | Automatic rule |
|---|---|
| Met | No conversation or session (Networking, Invitation). |
| In conversation | At least one conversation or session, with no pending proposal. |
| Proposal sent | At least one “Pending” proposal. |
| Client | A contract in progress, or a session after the end of the contract. |
| Engagement ended | The contract has expired. With no commitment length, the person moves to this stage after 120 days without contact. |
| No follow-up | All proposals were refused and there has been no contact since, or it is a manual choice. |
| Supervisor | At least one supervision with this person, and no accepted proposal. |

A stage chosen by hand, on the profile or by drag and drop, holds until the next entry concerning the person.

### The person profile

To open a profile, click a card, a name in “To follow up”, or “Profile” in My entries. You can also create a person with “+ New person”. The profile is organised in two halves.

**Left, who the person is:**

- **Photo.**
  - Click the circle or “Photo”, choose an image, then frame it in the disc: drag to centre, then zoom with the slider or the mouse wheel.
  - The photo is compressed (about 5 KB) and stored in your notebook, so it is encrypted with it.
- **Name.** Icons appear next to the name as soon as the matching information is filled in:
  - the envelope opens your email app;
  - the globe opens the website;
  - the handset starts the call, only on a phone or tablet.
- **Role**, in one line: role and organisation.
- **Phone, email, website.** Phone numbers are spaced automatically (French format): `0123456789` becomes `01 23 45 67 89`, and `+33123456789` becomes `+33 1 23 45 67 89`.
- **Stage** (automatic or manual) and **source**. The small ▾ of the source field lists the values already used on your other profiles; typing filters the list. A new value is added to the list for later profiles.
- **Referrals**: two boxes, “Came through a referral” (you were recommended to them) and “I asked them for a referral”.
- **Audience** and **topic**: which audience the person belongs to, and what they come to work on. Same drop-down list as the source, to keep values consistent and analyses clean. They feed the **affinities** of your coach profile (see [part 5](#5-coach-your-profile)).
- **Description.** Context, stakes, what to know.

**Right, where you stand:**

- **Figures.** Last contact, coaching hours, conversations, sessions, contract, first contact.
- **Contract**, if there is one. Amount, length and progress, with the start, planned sessions and length, all editable.
- **Interactions.** A timeline with one dot per interaction, in its type's colour. When dots overlap, those of the types ranked highest in Settings > Activity types come on top: for example sessions above debriefs. The date (dd/mm) is above each dot and the year in the middle of its period. Hover a dot to see the detail.
- **Average ease** on all your tracked skills, on two columns.
- **Action plan.** The actions linked to the person. You can add some with a date and tick them once done. They also appear in the dashboard's action plan.

**Bottom:**

- **Archive / Reactivate.** An archived person leaves the entry buttons and filters, but keeps their whole history.
- **Delete.** Removes the person from your notebook, after confirmation. Their entries remain (your hours and statistics do not change), marked “Deleted person”. This is final.
- **See their entries.** Opens My entries, filtered on them.
- **Done.** Closes the profile.

Everything is saved as you type.

---

## 10. Proposals and contracts

**Nothing is automatic**: you are the one who says whether a proposal is accepted.

1. Log a **proposal** (amount, planned sessions, commitment length). It is “Pending”.
2. It appears in **To follow up** as long as no action is planned for the person.
3. Change its status:
   - in **To follow up**, with the Accepted or Refused buttons;
   - or in **My entries**, Contract column expanded, Accepted: Pending, Accepted or Refused.
4. A person's **contract** is their **last accepted proposal**:
   - start: by default the proposal's date, editable on the profile;
   - end: the start plus the commitment length;
   - sessions done: the sessions between start and end.
5. As the end approaches, or at the last planned session, “To follow up” suggests you **plan the review**.

Only proposals above €0 count in the commercial indicators: proposals, acceptance rate, revenue, average deal.

---

## 11. Costs and real hourly rate

Settings in **Settings > Practice costs**.

- **Your cost lines.** For each cost: a description, a supplier and an annual cost. For example: professional liability insurance, continuing education, tools, fees. “+ Add a cost” creates a line, and ✕ deletes it.
- **The Supervision line**, fixed and not deletable.
  - You enter the **average price** of a supervision there.
  - Its annual cost is calculated from your entries of the year: each session's custom amount if there is one, otherwise the average price.
  - Sessions marked “unpaid” do not count.
- **The social charges line** (URSSAF in France), also fixed.
  - You enter your **average contribution rate**, as a percentage. This rate depends on your status and activity: check yours with the relevant body.
  - Its annual cost is this rate applied to your accepted revenue for the year. It counts as an expense and is deducted from your real hourly rate.
  - The calculation is based on accepted revenue, not on amounts actually received: it is an estimate.
- **Average annual expenses.** The sum of all lines, supervision and social charges included.
- **Breakdown.** A ring chart shows each cost's share, with supervision in its activity type's colour.
- **Expenses in the hourly rate.** Click the tile of the calculation you want to use:
  - **In full**: all the year's expenses are deducted from the first paid contract. The rate is cautious early in the year.
  - **Pro rata**: supervision already paid and social charges on revenue already accepted, plus the share of other expenses matching the year elapsed. The rate reflects the current pace.

  Each tile shows the resulting rate, for example “In full: €2/h”. The chosen tile is outlined and ticked: it is the one feeding the indicator.

**Real hourly rate = (accepted revenue − expenses) ÷ all your hours of the year.** Every hour counts, including unbilled time. The indicator's detail shows the supervision share and the expenses per paid contract.

> If you entered an “annual expenses” amount in an earlier version, it was carried over into a “Miscellaneous expenses” line, which you can break down.

---

## 12. Settings

All blocks are **collapsed by default**. Click a title, or the triangle before it, to open or close the block. Collapsed, each block shows a one-line summary. Your choice is remembered on your computer.

Blocks come in pairs, in this order:

| Left | Right |
|---|---|
| **Identity**: practice name, tool name, motto, label wording (feminine, masculine, inclusive). | **Appearance**: logo (also used as the tab and window icon) and banner side by side, the 5 brand colours (Accent, Dark, Background, Grey, Blue), “Back to the default palette”. |
| **Security**: encryption, automatic lock, password, recovery key (see [part 13](#13-security-and-encryption)). | **Data storage**: linked folder, “Open another notebook”, “New notebook”. |
| **Activity types** (11 at most): order of importance by drag and drop (number 1 is at the base of the charts), colour, label, default length, ease ratings, **Counts in**. An added type can only be deleted if it has no entries. | **Ease skills**: points to “Manage my skills”, on the ease compass (see [part 4](#4-deliberate-practice)). |
| **People tracking**: “no contact” alert threshold, in days. | **Indicators shown as banners**: choice of the 6 indicators shown at the top of the dashboard and Activity. |
| **Practice costs**, full width (see [part 11](#11-costs-and-real-hourly-rate)). | |
| **Share with a peer**: “Export a template without data”. | **Getting started**: show the roadmap, animated celebrations, “Replay the welcome”. |

A few details:

- **Counts in** decides which indicator a type's hours are added to: coaching hours, deliberate practice, business development or other.
- **Person**: required or optional when logging. By default, required for meetings, invitations, conversations, proposals, sessions and debriefs; optional for supervisions and the types you add.
- **Type colours** automatically follow the palette and the order of importance, as long as you don't edit a colour by hand.
- **On a screen narrower than 1500 px**, Activity types and Ease skills stack one under the other.

At the bottom of every page:

- **Change folder**;
- **Export JSON**, which produces a complete copy;
- **Export CSV**;
- **Import a JSON**;
- the version number and the **What's new** link.

---

## 13. Security and encryption

- **Turn on encryption**: Settings > Security. Names, notes, goals and photos become unreadable without your password. Existing backups are encrypted too.
- **Recovery key**: given to you when you turn encryption on. Keep it **off the computer**, in a password manager or on paper. Without the password or the recovery key, nobody can reopen the data, not even the tool's author.
- **Automatic lock**: never, or after 5, 15, 30 or 60 minutes of inactivity.
- **Lock screen**: it offers to unlock with your password or your recovery key. With the recovery key, you then choose a new password. A link also lets you open another notebook.
- In Settings, you can also lock immediately, change your password, generate a new recovery key or turn encryption off.

---

## 14. Your data: saving, backups, recovery

- **Continuous saving.** Every change is saved within a fraction of a second. The status shows at the top right.
- **Nothing is ever blindly overwritten.** Before each save, the app rereads the file. If it was changed elsewhere (another window, another computer, another version), it **merges** instead of replacing:
  - entries from both sides are kept;
  - for the same entry changed on both sides, the most recent change wins;
  - deletions are respected;
  - for settings (costs, indicators, skills, profile…), only the changes actually made in each window are kept: a window left open for a long time can no longer erase what you entered in another.
- **Backup copies** in `sauvegardes/`:
  - one per hour, kept 48 h;
  - then one per day, kept 30 days;
  - plus a copy just before each merge.
- **Outdated version = read-only.** A version of the app older than the one that saved your notebook can no longer write it. A banner tells you so.
- **Import entries from a spreadsheet**: at the bottom of the page, **Import a CSV** (see [part 5](#5-coach-your-profile), “Bring in your history”).
- **Recover lost entries.**
  1. At the bottom of the page, click **Import a JSON**.
  2. Choose a copy in `sauvegardes/`.
  3. Answer **OK (merge)**.

  Missing entries come back, without deleting anything. Lost settings (for example cost lines) come back too: missing lines are added, and an empty value is filled in from the copy.
- **Several notebooks.** Settings > Data storage > Open another notebook or New notebook. A folder that already contains a notebook is never overwritten by another one.
- **Without a linked folder**, data is only kept in this browser. A yellow banner then suggests choosing one.

---

## 15. What's new and versions

- **`x.y.z` numbering**: x = major version, y = new feature, z = fix. The version shows at the bottom of the page.
- **What's new screen.** On the first launch of a new version, a window presents what changed since your last visit, with buttons leading to each feature. The version already seen is saved in your notebook. The **What's new** link at the bottom of the page lets you see them again.
- **Updating is automatic.** On the next launch, a “New version available” banner may offer to reload. If in doubt, close and reopen the app.

---

## 16. Sharing with a peer

Just send them the address **carnet-de-coach.fr**. They install it in turn (see [part 1](#1-getting-started)) and start with “Start”. Their data stays with them, and yours with you.

To also pass on your setup (types, colours, skills, indicators) without your data, go to **Settings > Share with a peer > Export a template without data**, and send them the resulting file. Your peer then chooses “Import a backup or a template” on the welcome screen.

---

## 17. Troubleshooting

- **The app no longer updates, or behaves oddly.** Close it, reopen the address in Chrome or Edge, then reload with Ctrl+F5.
- **Yellow “Reconnect the folder” banner.** Click it and allow access. Choose “Allow on every visit” if the option is offered.
- **The old icon still shows in the Start menu or taskbar.** Uninstall the app (right-click the icon, or the window's ⋯ menu > Uninstall), then reinstall it from its address. Your data does not move: it is in your folder.
- **The new version does not appear.** Fully close the app and reopen it, or reload with Ctrl+F5. The number at the bottom of the page is the reference.
- **“Read-only” banner.** You are using a version older than the one that saved your notebook, for example an old copy of the app. Reload (Ctrl+F5), or open the installed app.
- **Entries have disappeared.** See “Recover lost entries” in [part 14](#14-your-data-saving-backups-recovery).
- **Forgotten password.** Use the recovery key on the lock screen.
- **Open another notebook or create a new one.**
  - If the app is open: Settings > Data storage.
  - If it is locked: click the link at the bottom of the lock screen.

---

## 18. Licence and use

The tool is published under the **PolyForm Shield 1.0.0 licence** (`LICENSE` file).

- **Free for every coach**, including for professional use: you can use it, copy it, adapt it and share it.
- **Not allowed without permission**: reselling it, or building a competing product or service from it (paid version, white label…).
- When sharing it, pass on the `LICENSE` file too.

For commercial use (resale, inclusion in a paid offer, white label), contact Allan Oudomphong.

---

## 19. Version history

| Version | Date | Main changes |
|---|---|---|
| **2.3.0** | 13/11/2026 | Search for a person as you type (accents and capitals ignored, “+ Create”) in the entry form, My entries and the action plan. Networking at the start of the journey, with “What came up” on several lines. “Archived people” instead of “Archived clients”. |
| 2.2.0 | 11/11/2026 | Delete a person (their entries remain). Any length in My entries (“Other…”). Required person, set type by type. Level bars start again from zero at each level. |
| 2.1.0 | 09/11/2026 | Guided tour of the demo notebook: the approach in one screen, then the pages in nine steps; “Replay the tour” in the bar. The demo opens in simple mode. The small house opens the carnet-de-coach.fr website. |
| 2.0.0 | 11/2026 | Carnet de coach has its own website (presentation, approach, screenshots, FAQ, in French and English). New address: **carnet-de-coach.fr**, with the app at carnet-de-coach.fr/app/. Reinstall it from that address, then choose “I already have a notebook: open its folder” and select your folder; your data does not move. |
| 1.12.2 | 08/11/2026 | Direct link to the demo notebook (address ending in ?demo=1). The “Explore a demo notebook” link is hidden when your notebook is open. |
| 1.12.1 | 08/11/2026 | Home button (small house) left of the tabs. Instant language switch, without locking an encrypted notebook again. |
| 1.12.0 | 08/11/2026 | The app in English: an FR / EN button to switch language at any time; demo notebook and architecture page in English; English manual (README.en.md). |
| 1.11.0 | 08/11/2026 | Demo notebook (Camille Martin, a fictional coach), opened from the welcome screen. |
| 1.10.1 | 08/11/2026 | Commercial ease in Activity. The Contact stage becomes Met. Coloured Settings and About tabs. More compact welcome, on the notebook's green. Roomier person profile. Fix: an empty pill stayed visible at the top of the screen. |
| 1.10.0 | 08/11/2026 | About tab: welcome note, approach, architecture and FAQ. Counting your noes (invitation “They said no”, refused proposals) in Activity and as achievements. Person profile: drop-down lists for source, audience and topic; referral boxes. My entries shows the person's stage. Welcome with photo. Video game achievements on three columns. Approach refined: a cycle of set length, at a fair price. |
| 1.9.1 | 08/11/2026 | “Create your clients through relationships” page rewritten in six principles; pipeline stages clarified (coaching conversation, proposal meeting, referral). |
| 1.9.0 | 08/11/2026 | New 3-screen welcome, then a roadmap: one mission at a time, in 4 chapters, with “Show me”. Approach pages and pipeline stages linked to entries (“? The stages”). Celebrations of levels and achievements, at three intensities. Victories with image and story. “How the tool is built” page. |
| 1.8.2 | 07/11/2026 | Levels recalibrated: one curve per statistic, on the path of a steadily practising coach; supervision in hours; clients and renewals; revenue in two stages (steps, then best revenue over 12 rolling months); average of the statistics already filled in only. |
| 1.8.1 | 07/11/2026 | New level scale, on trial: each statistic compared with the pace of a steadily practising coach; overall level and rank = average of statistics. Rounded window corners again. |
| 1.8.0 | 07/11/2026 | Simple mode, switchable at any time (top-right button) and offered at first launch. Meeting notes in the entry form. Types in the order of the journey (Invitation › … › Supervision), wider entry window, ease on two columns. “To follow up” in People. Metrics becomes Activity. Fix: blue background behind “via …” in List view. |
| 1.7.0 | 06/11/2026 | Metrics: “Grow your practice” chart (funnel invitations → conversations → proposals → clients, conversion rates, revenue signed, average deal; monthly view) instead of the ease chart. Coach profile: automatic achievements and victories, audience × topic affinities (new person-profile fields). Bringing in history: CSV import of entries and declaration of totals from before the tool. |
| 1.6.1 | 06/11/2026 | No more examples from another coach's practice in the fields; a new notebook starts without pre-filled skills or motto. |
| 1.6.0 | 06/11/2026 | Coach tab: profile with rank and level (1 to 100), ease compass by discipline with focus and actions, statistics with levels; Professional and Video game themes; label wording. Skills managed from the compass. Fix: a window left open can no longer erase settings entered in another (three-way merge). Fixed cost lines without a padlock. |
| 1.5.0 | 05/11/2026 | Deliberate practice tab: ease compass (average of the last 5 ratings and trend), 3 focus skills, 3 actions in progress and an action library, notes per skill in each entry, a skill's history, supervision preparation with what you take from it. New Invitation type and Invitations indicator. |
| 1.4.0 | 04/11/2026 | New app icon. The tab and window icon uses the notebook's logo. |
| 1.3.4 | 04/11/2026 | Costs: average social contribution rate, applied to accepted revenue and counted as an expense. |
| 1.3.3 | 04/11/2026 | Timelines: dots of the highest-ranked types come to the front. |
| 1.3.2 | 04/11/2026 | Person editable in My entries (drop-down list), magnifier to filter. |
| 1.3.1 | 04/11/2026 | Custom amount per supervision: empty = average price, otherwise the amount entered takes precedence. |
| 1.3.0 | 04/11/2026 | Practice costs line by line, with ring breakdown, supervision calculated from paid sessions, “unpaid” box and choice of calculation by tile. New two-half person profile (contact icons, dated timeline, ease on all skills, action plan). My entries: tile next to the filters, tabs, years in descending order. Pipeline: larger cards. Collapsible blocks on the dashboard and in Settings, Settings reorganised. |
| 1.2.3 | 04/11/2026 | Tighter tables. Notes and summary before “What came up”. People: pipeline by default, selector before the search. Full user manual. |
| 1.2.2 | 04/11/2026 | Display adapted to the resolution: full width, charts sized to their frame, “To follow up” and priorities side by side on large screens. |
| 1.2.1 | 04/11/2026 | Supervisor stage, compact tiles, automatic phone spacing. |
| 1.2.0 | 04/11/2026 | Pending proposals in “To follow up”. Website instead of LinkedIn. Collapsible notes and contract in My entries. Fix: profile contact details sometimes not saved. |
| 1.1.2 | 04/11/2026 | What's new screen. Getting-started tour completed and readable on every screen. “Counts in” editable for every type. x.y.z numbering. |
| 1.1.1 | 04/11/2026 | In full / Pro rata button for expenses, with both rates side by side. |
| 1.1.0 | 04/11/2026 | CRM: person profiles, photo, stages, pipeline, contracts, “To follow up”. |
| 1.0 | 02/11/2026 | Version shared with peers: catalogue of 19 indicators, secure saving (merge, backups), 10 types, archiving, costs and hourly rate. |

---

## 20. About

The last tab, **About**, brings together:

- **the welcome note**, the one from the first launch;
- **the approach** “Create your clients through relationships”, with the “Read about the approach” button;
- **how the tool is built**, with the “See the diagrams” button (see [part 21](#21-how-the-tool-is-built));
- **frequently asked questions**, in three groups: your data, using the notebook, the tool.

The Settings and About tabs have their own colour, to set them apart from the working tabs.

---

## 21. How the tool is built

For the curious, and for anyone who wants to audit it: the **[How the tool is built](app/arch.html?lang=en)** page, shipped with the app, shows it in four diagrams, in English or French (FR / EN button).

- **Overview.** A single `index.html` file, with no server and no account: the app runs in your browser and makes no network call with your data. A small script (`sw.js`) keeps it available offline and installs updates.
- **Your data.** A single `coaching-data.json` file in the folder you choose: entries, people, settings, coach profile, deliberate practice. A copy is kept in the browser, in case the folder is temporarily unavailable.
- **An entry, from click to file.** Every change updates the screen, then is saved within a fraction of a second, after rereading and merging the file if needed.
- **Security.** AES-GCM encryption with your password, recovery key, hourly then daily backup copies.

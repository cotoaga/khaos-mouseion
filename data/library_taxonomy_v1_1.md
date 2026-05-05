# Library Taxonomy v1.1

**From Ashes to Architecture**  
*2025-12-12*

---

## Overview

This taxonomy classifies a personal library of ~1,500 books across multiple dimensions, designed for both human navigation and AI-assisted classification.

### Design Principles

- **Simplify structure, enrich connections**
- **Categories cluster. Themes bridge.**
- **Derive what you can, store what you must.**
- **Technology is amoral. Ethics belongs to humans.**

### Changes from v1.0

| Dimension | v1.0 | v1.1 | Change |
|-----------|------|------|--------|
| Types | 3 | 3 | No change |
| Categories | 37 | 43 | +6 (exploded Organization) |
| Themes | 26 | 28 | +5 new, -3 killed |
| Methodology | — | 15 values | NEW dimension |
| Tetrahedron | stored | derived | Computed, not stored |
| Cynefin | stored | derived | Computed, not stored |

---

## Schema

```
Title, Author, Released, Acquired, Medium, Type, Category, Methodology, Theme1, Theme2, Theme3, Theme4, Theme5
```

**10 stored columns.** Tetrahedron and Cynefin are derived at display time.

---

## Type (3)

The fundamental question: *How do you engage with this book?*

| Type | Definition | Test Question |
|------|------------|---------------|
| **Story** | Narrative. Characters, plot, journey. | "Does it have a narrative arc?" |
| **Knowledge** | Ideas. You read to understand. | "Does it teach, argue, explain?" |
| **Reference** | Look-up. Consulted, not read linearly. | "Would I read cover-to-cover?" No → Reference |

### Edge Case Rulings

| Book Type | Ruling | Rationale |
|-----------|--------|-----------|
| Biography | Story | Life as narrative arc |
| History (narrative) | Knowledge | Ideas dominate over story |
| Business Fiction | Story | Narrative wrapper, even if teaching |
| Cookbooks | Reference | Consulted, not read |

---

## Categories (43)

### Story Categories (15)

| Category | Description | Example Authors/Books |
|----------|-------------|----------------------|
| **Space Opera** | Galactic scale, civilizations, epic sweep | Banks (Culture), Hamilton, Alanson |
| **Hard Science** | Physics matters, scientifically rigorous | Morris, Clarke, Reynolds |
| **Near Future** | Tomorrow's problems, current +10-50 years | Suarez, Stephenson |
| **Cyberpunk** | Tech dystopia, corporate control, street level | Gibson |
| **Classic SF** | The canon, foundational works | Asimov, Le Guin, Dick |
| **Post-Human** | Transhumanism, consciousness upload, evolution | Naam, Egan |
| **High Fantasy** | Epic worldbuilding, magic systems, quests | Sanderson, Erikson, Sapkowski |
| **Urban Fantasy** | Modern world + magic | Butcher |
| **Thriller** | Suspense drives plot, tension as engine | Fitzek, Elsberg, Follett |
| **Crime** | Noir, procedural, investigation | Winslow |
| **Comedy** | Humor is the point | Adams, Pratchett |
| **Literary Fiction** | Character and language over plot | |
| **Historical Fiction** | Past settings, fictional characters | |
| **Business Fiction** | Teaching through narrative | Kim (Phoenix/Unicorn), Goldratt (The Goal) |
| **Biography** | Lives as stories | Isaacson |

### Knowledge Categories (25)

#### Mind & Philosophy (5)

| Category | Description | Example Authors |
|----------|-------------|-----------------|
| **Psychology** | Behavior, cognition, self, mind | Jung, Kahneman, Peterson, Cialdini |
| **Neuroscience** | Brain mechanics, neural systems | Sapolsky, Lembke, Huberman |
| **Consciousness** | Mind, meditation, altered states | Osho, McKenna, Harris |
| **Philosophy** | Western tradition, rational inquiry | Durant, Dennett, Deutsch |
| **Eastern Philosophy** | Buddhism, Taoism, Vedanta | Watts, Krishnamurti, Osho |

#### Society & History (4)

| Category | Description | Example Authors |
|----------|-------------|-----------------|
| **Anthropology** | Human societies, cultures, development | Diamond, Harari, Davis |
| **History** | Past events and periods as analysis | Durant, Solzhenitsyn |
| **Politics** | Power, governance, geopolitics | Chomsky, Fukuyama, Acemoglu |
| **Economics** | Markets, money, policy, incentives | Smil, Taleb |

#### Business & Organization (6) — EXPLODED FROM v1.0

| Category | Description | Example Books | Test Question |
|----------|-------------|---------------|---------------|
| **Organization** | Org design, change management, teams, scaling | Team Topologies, Org Design for Design Orgs | "Is this about how orgs work/change?" |
| **Agile & Lean** | Methodologies, frameworks, practices | SAFe Distilled, Scrum Guide, This is Lean | "Does it teach a specific methodology?" |
| **Product** | PM, discovery, roadmaps, what to build | Inspired, Continuous Discovery, JTBD | "Is this about WHAT to build?" |
| **Design** | UI, UX, service design, how users experience | Elements of UX, Don't Make Me Think | "Is this about HOW users experience it?" |
| **Startup** | Entrepreneurship, growth, building from zero | Lean Startup, Zero to One, Traction | "Is this about building a company from zero?" |
| **DevOps** | CI/CD, infrastructure, SRE, platform | Accelerate, DevOps Handbook, SRE Book | "Is this about HOW to ship reliably?" |

#### Strategy & Leadership (3)

| Category | Description | Example Authors |
|----------|-------------|-----------------|
| **Leadership** | Leading people, vision, responsibility | Marquet, Sinek, McChrystal |
| **Strategy** | Winning games, competitive dynamics | Rumelt, Sun Tzu, Greene |
| **Communication** | Writing, influence, persuasion, language | Cialdini, Carnegie |

#### Systems & Science (5)

| Category | Description | Example Authors |
|----------|-------------|-----------------|
| **Systems Thinking** | Feedback loops, leverage points, dynamics | Meadows, Senge |
| **Complexity** | Emergence, CAS, Cynefin, adaptive systems | Snowden, Kauffman |
| **Science** | Physics, cosmology, biology, evolution | Rovelli, Dawkins, Carroll |
| **AI** | Machine intelligence, alignment, AI futures | Russell, Bostrom |
| **Computer Science** | Software craft, architecture, engineering | Martin, Fowler |

#### Health (1)

| Category | Description | Example Authors |
|----------|-------------|-----------------|
| **Health** | Body, nutrition, medicine, wellness | Fung, Walker, Huberman |

### Reference Categories (3)

| Category | Description |
|----------|-------------|
| **Technical** | Manuals, programming guides, specifications |
| **Business** | HBR collections, frameworks, quick reference |
| **Lifestyle** | Cooking, travel, hobbies |

---

## Methodology (15 values)

**Purpose:** Tag books that explicitly TEACH a specific methodology.

**Rule:** If the book doesn't TEACH the methodology explicitly, leave blank.

| Methodology | What It Tags | Example Books |
|-------------|--------------|---------------|
| **SAFe** | Scaled Agile Framework | SAFe 5.0 Distilled |
| **Scrum** | Scrum specifically | The Scrum Guide, Scrum: The Art of Doing Twice the Work |
| **Kanban** | Kanban method | Kanban: Successful Evolutionary Change |
| **LeSS** | Large-Scale Scrum | Large-Scale Scrum |
| **XP** | Extreme Programming | Extreme Programming Explained |
| **Lean** | Lean thinking, Toyota Way | The Lean Startup, This is Lean, Toyota Kata |
| **TOC** | Theory of Constraints | The Goal, Critical Chain |
| **JTBD** | Jobs to Be Done | Competing Against Luck, The Jobs to Be Done Playbook |
| **OKR** | Objectives & Key Results | Measure What Matters |
| **Wardley** | Wardley Mapping | Wardley Maps |
| **Design-Thinking** | IDEO/d.school approach | Change by Design, Sprint |
| **DevOps** | DevOps as explicit practice | The DevOps Handbook, Accelerate |
| **Six-Sigma** | Six Sigma, DMAIC | The Six Sigma Way |
| **Agile-Generic** | Agile without specific framework | Agile Estimating and Planning |
| **Systems-Modeling** | System dynamics, stock-flow | Thinking in Systems |
| *(blank)* | No specific methodology | |

### Methodology Assignment Examples

| Book | Methodology | Rationale |
|------|-------------|-----------|
| The Phoenix Project | *(blank)* | Illustrates DevOps, doesn't teach it |
| The Scrum Guide | Scrum | Explicitly teaches Scrum |
| SAFe 5.0 Distilled | SAFe | Explicitly teaches SAFe |
| The Goal | TOC | Explicitly teaches Theory of Constraints |
| Lean Startup | Lean | Explicitly teaches Lean methodology |
| Team Topologies | *(blank)* | Teaches concepts, not a named methodology |

---

## Themes (28)

Themes are **conceptual bridges** — they connect books across categories.

### Theme Design Principles

1. **Themes are CONCEPTS, not category echoes**
2. **No theme should match category name**
3. **Aim for discriminating power:** "Would this help me FIND related books?"
4. **3-5 themes per book**

### Themes Killed from v1.0

| Theme | Reason for Removal |
|-------|-------------------|
| `transformation` | 68% coverage = zero discriminating power |
| `meaning` | Too vague, became default fill |
| `productivity` | Merged into `flow` and `delivery` |

### Theme List by Domain

#### Mind & Meaning (5)

| Theme | Definition |
|-------|------------|
| `consciousness` | Awareness, subjective experience, meditation, altered states |
| `creativity` | Making new things, innovation, artistic process |
| `ethics` | Moral philosophy, right action, responsibility, values |
| `human-behavior` | How humans act, decide, behave, cognitive biases |
| `identity` | Self, individuation, becoming, personal development |

#### Systems & Complexity (6)

| Theme | Definition |
|-------|------------|
| `systems-thinking` | Feedback loops, stocks & flows, leverage points, dynamics |
| `complexity` | Emergence, CAS, nonlinear dynamics, Cynefin |
| `emergence` | Properties arising from interactions, self-organization |
| `flow` | Value streams, process optimization, state of flow |
| `chaos` | Disorder as generative, edge states, VUCA, the ungovernable |
| `lean` | Waste elimination, pull systems, efficiency, continuous improvement |

#### Power & Strategy (5)

| Theme | Definition |
|-------|------------|
| `power-dynamics` | Political power, hierarchy, control, organizational politics |
| `strategy` | Winning, positioning, competitive thinking, game theory |
| `influence` | Persuasion, negotiation, changing minds |
| `leadership` | Leading others, vision, responsibility, coaching |
| `civilization` | Societies, cultures, rise and fall, macro-history |

#### Technology & Future (4)

| Theme | Definition |
|-------|------------|
| `ai-impact` | Effects of AI on society, work, humanity, alignment |
| `future-scenarios` | Speculation, forecasting, scenario planning |
| `evolution` | Biological, cultural, technological evolution |
| `digital` | Digital transformation, tech adoption, platform dynamics |

#### Business & Delivery (7)

| Theme | Definition |
|-------|------------|
| `business-value` | Outcomes vs outputs, value streams, ROI thinking |
| `customer-centricity` | Outside-in thinking, user focus, JTBD, empathy |
| `business-agility` | Organizational responsiveness, pivot capability, adaptability |
| `delivery` | Getting shit done, CI/CD, shipping, execution |
| `agile` | Iterative, adaptive, responding to change, agile mindset |
| `product-thinking` | Discovery, validation, product sense, roadmapping |
| `user-experience` | UX principles, usability, interaction design |
| `design-thinking` | Empathy, ideation, prototyping, design methods |

#### Health (1)

| Theme | Definition |
|-------|------------|
| `health` | Physical wellbeing, nutrition, medicine, body optimization |

---

## Derived Views

**These are computed at display time, NOT stored in the database.**

### Tetrahedron Mapping

The Tetrahedron represents four aspects of digital/business transformation.

| Tetrahedron Face | Derivation Logic |
|------------------|------------------|
| **Customer Centricity** | Category IN (Product, Design) OR `customer-centricity` IN Themes OR `user-experience` IN Themes |
| **Business Value** | `business-value` IN Themes OR Category = Strategy |
| **Complexity** | Category IN (Complexity, Systems Thinking) OR `complexity` IN Themes OR `emergence` IN Themes |
| **Delivery** | Category IN (DevOps, Agile & Lean) OR `delivery` IN Themes OR `lean` IN Themes OR `flow` IN Themes |
| **None** | Default if no match |

**Display Rule:** Show strongest match. If multiple match, prioritize based on Category.

### Cynefin Mapping

Cynefin domains indicate what type of problem space the book helps you navigate.

| Cynefin Domain | Derivation Logic |
|----------------|------------------|
| **Clear** | Category = Reference OR Methodology IN (Scrum, Six-Sigma) |
| **Complicated** | Category IN (Strategy, Science, Computer Science) OR Methodology IN (Wardley, TOC) |
| **Complex** | Category IN (Complexity, Systems Thinking, Organization) OR `complexity` IN Themes OR `emergence` IN Themes |
| **Chaotic** | `chaos` IN Themes |
| **Aporetic** | Category IN (Philosophy, Consciousness, Eastern Philosophy) |
| **N/A** | Story types, or no clear mapping |

---

## Assignment Rules

### Category Assignment

- **ONE category per book** (primary clustering)
- **Question:** "If I could only shelve this in ONE place, where?"
- **When in doubt:** Follow the DOMINANT mode of engagement

### Methodology Assignment

- **ONE methodology or blank**
- **Only if book EXPLICITLY teaches the methodology**
- **Illustrating or mentioning ≠ teaching**
- **When in doubt:** Leave blank

### Theme Assignment

- **3-5 themes per book**
- **Themes are CONCEPTS, not category echoes**
- **Test:** "Would this theme help me FIND related books across categories?"
- **Avoid:** Generic themes that would apply to everything

---

## Classification Examples

### Example 1: The Elements of User Experience

| Field | Value |
|-------|-------|
| Type | Knowledge |
| Category | Design |
| Methodology | *(blank)* |
| Themes | `user-experience`, `customer-centricity`, `product-thinking` |
| Tetrahedron (derived) | Customer Centricity |
| Cynefin (derived) | Complicated |

### Example 2: The Goal

| Field | Value |
|-------|-------|
| Type | Story |
| Category | Business Fiction |
| Methodology | TOC |
| Themes | `flow`, `systems-thinking`, `business-value` |
| Tetrahedron (derived) | Delivery + Business Value |
| Cynefin (derived) | Complicated |

### Example 3: Team Topologies

| Field | Value |
|-------|-------|
| Type | Knowledge |
| Category | Organization |
| Methodology | *(blank)* |
| Themes | `systems-thinking`, `complexity`, `flow`, `delivery` |
| Tetrahedron (derived) | Complexity + Delivery |
| Cynefin (derived) | Complex |

### Example 4: Hyperion (Dan Simmons)

| Field | Value |
|-------|-------|
| Type | Story |
| Category | Space Opera |
| Methodology | *(blank)* |
| Themes | `consciousness`, `ai-impact`, `civilization`, `future-scenarios` |
| Tetrahedron (derived) | None |
| Cynefin (derived) | N/A |

### Example 5: SAFe 5.0 Distilled

| Field | Value |
|-------|-------|
| Type | Knowledge |
| Category | Agile & Lean |
| Methodology | SAFe |
| Themes | `agile`, `delivery`, `business-agility`, `lean` |
| Tetrahedron (derived) | Delivery |
| Cynefin (derived) | Complicated |

---

## Migration from v1.0

### Step 1: Remap Organization Books

| If Book Is About... | New Category |
|--------------------|--------------|
| Agile/methodology frameworks | Agile & Lean |
| Product management, discovery | Product |
| UI/UX, design | Design |
| Entrepreneurship, growth | Startup |
| CI/CD, infrastructure | DevOps |
| Org design, change, teams | Organization (keep) |

### Step 2: Strip Broken Themes

- Remove `transformation` from all books
- Remove `meaning` from all books
- Re-tag with appropriate themes from v1.1 list

### Step 3: Add Methodology

- Scan for methodology-specific books
- Tag only where methodology is explicitly taught

---

## Appendix: Quick Reference

### All Categories (43)

**Story (15):** Space Opera, Hard Science, Near Future, Cyberpunk, Classic SF, Post-Human, High Fantasy, Urban Fantasy, Thriller, Crime, Comedy, Literary Fiction, Historical Fiction, Business Fiction, Biography

**Knowledge (25):** Psychology, Neuroscience, Consciousness, Philosophy, Eastern Philosophy, Anthropology, History, Politics, Economics, Organization, Agile & Lean, Product, Design, Startup, DevOps, Leadership, Strategy, Communication, Systems Thinking, Complexity, Science, AI, Computer Science, Health

**Reference (3):** Technical, Business, Lifestyle

### All Themes (28)

**Mind & Meaning:** `consciousness`, `creativity`, `ethics`, `human-behavior`, `identity`

**Systems & Complexity:** `systems-thinking`, `complexity`, `emergence`, `flow`, `chaos`, `lean`

**Power & Strategy:** `power-dynamics`, `strategy`, `influence`, `leadership`, `civilization`

**Technology & Future:** `ai-impact`, `future-scenarios`, `evolution`, `digital`

**Business & Delivery:** `business-value`, `customer-centricity`, `business-agility`, `delivery`, `agile`, `product-thinking`, `user-experience`, `design-thinking`

**Health:** `health`

### All Methodologies (15)

SAFe, Scrum, Kanban, LeSS, XP, Lean, TOC, JTBD, OKR, Wardley, Design-Thinking, DevOps, Six-Sigma, Agile-Generic, Systems-Modeling

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 0.1 | Pre-2023 | Original mental cathedral (Realm/Domain split) |
| 0.2 | 2023-2024 | Flattened to CSV, hierarchy lost, 163 values |
| 1.0 | 2025-12-10 | Phoenix rises: 3 Types, 37 Categories, 26 Themes |
| **1.1** | **2025-12-12** | **Exploded Organization: 3/43/28 + Methodology + Derived Views** |

---

*"Simplify structure, enrich connections. Derive what you can, store what you must."*

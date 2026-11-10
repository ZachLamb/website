"""Generate Zach Lamb's resume PDF from the portfolio's data files.

Uses reportlab Platypus for flow-based layout with tight spacing.
Output: public/zach-lamb-resume.pdf (relative to the repo root)
"""
from pathlib import Path

from reportlab.lib.pagesizes import LETTER
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import inch
from reportlab.lib.colors import HexColor, black
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
    KeepTogether,
)
from reportlab.platypus.flowables import HRFlowable

# Colors pulled from the site palette.
FOREST = HexColor("#2C3E2D")
BARK = HexColor("#4A3F36")
GOLD = HexColor("#B08A3E")
STONE = HexColor("#6B6658")

# --- styles ---
styles = {
    "name": ParagraphStyle(
        "name",
        fontName="Helvetica-Bold",
        fontSize=22,
        leading=26,
        textColor=FOREST,
        spaceAfter=2,
    ),
    "subtitle": ParagraphStyle(
        "subtitle",
        fontName="Helvetica",
        fontSize=11,
        leading=13,
        textColor=BARK,
        spaceAfter=2,
    ),
    "contact": ParagraphStyle(
        "contact",
        fontName="Helvetica",
        fontSize=9,
        leading=11,
        textColor=STONE,
        spaceAfter=10,
    ),
    "section_header": ParagraphStyle(
        "section_header",
        fontName="Helvetica-Bold",
        fontSize=11,
        leading=13,
        textColor=FOREST,
        spaceBefore=10,
        spaceAfter=4,
        letterSpace=1.5,
    ),
    "job_line": ParagraphStyle(
        "job_line",
        fontName="Helvetica-Bold",
        fontSize=10,
        leading=12,
        textColor=black,
        spaceBefore=5,
        spaceAfter=0,
    ),
    "job_meta": ParagraphStyle(
        "job_meta",
        fontName="Helvetica-Oblique",
        fontSize=9,
        leading=11,
        textColor=STONE,
        spaceAfter=2,
    ),
    "bullet": ParagraphStyle(
        "bullet",
        fontName="Helvetica",
        fontSize=9.5,
        leading=12.5,
        textColor=black,
        leftIndent=12,
        bulletIndent=2,
        spaceBefore=1,
        spaceAfter=1,
    ),
    "body": ParagraphStyle(
        "body",
        fontName="Helvetica",
        fontSize=9.5,
        leading=13,
        textColor=black,
        spaceAfter=4,
    ),
    "earlier_line": ParagraphStyle(
        "earlier_line",
        fontName="Helvetica",
        fontSize=9.5,
        leading=12.5,
        textColor=black,
        spaceAfter=1,
    ),
}

# --- content ---
NAME = "Zach Lamb"
TITLE = "Lead UI Developer"
AVAILABILITY = "Open to remote"
CONTACT = (
    "zachlamb.io &nbsp;·&nbsp; "
    '<a href="https://github.com/ZachLamb" color="#6B6658">github.com/ZachLamb</a> &nbsp;·&nbsp; '
    '<a href="https://www.linkedin.com/in/lambzachary/" color="#6B6658">linkedin.com/in/lambzachary</a>'
)

SUMMARY = (
    "Lead UI Developer at Circadence. I lead the UI engineering team, run our agile "
    "process, help shape the product roadmap, and ship full-stack features in React "
    "and TypeScript. Human-centered design background, Certified ScrumMaster."
)

# Full experience list — mirrors data/experience.ts verbatim.
EXPERIENCE = [
    {
        "company": "Circadence",
        "position": "Lead UI Developer",
        "start": "Sep 2025",
        "end": "Present",
        "bullets": [
            "Lead the UI engineering team behind RangeGPT, an AI platform that simulates real cyberattacks on live hardware, setting frontend direction and reviewing the team's work",
            "Run the agile process: consolidated 409 backlog items into 10 structured Linear projects and established the first reliable sprint cadence and retros",
            "Work with product on strategy and roadmap, and act as primary technical counterpart for the NTT Data Japan enterprise partnership across two software teams and a hardware team",
            "Build full-stack features in React and TypeScript, including LLM-powered tools that speed up threat analysis and incident response for cybersecurity professionals",
            "Introduced AI-augmented engineering practices: Claude Code in grooming, MCP tooling for roadmaps, shared agent configs across the team",
        ],
        "stack": "React · TypeScript · Full-Stack Development · AI/LLM · Team Leadership · Agile",
    },
    {
        "company": "Starbucks",
        "position": "Sr. React Developer",
        "start": "Feb 2024",
        "end": "Sep 2025",
        "bullets": [
            "Shipped message reply and edit features with TypeScript, React, and GraphQL",
            "Upgraded UI libraries, raising the Lighthouse performance score from 65 to 90",
            "Worked across teams to build a new web application for store managers, and developed Agile processes for the team",
        ],
        "stack": "TypeScript · React · GraphQL · Apollo Client",
    },
    {
        "company": "StellarFi",
        "position": "Senior Software Engineer",
        "start": "May 2023",
        "end": "Jan 2024",
        "bullets": [
            "Pair-programmed an API and UI table with my manager to show users how their monthly membership payments were being reported to credit bureaus",
            "Created a new design system for a brand refresh that added roughly 100 new users per week",
            "Built an E2E testing framework that uncovered two major regression bugs in the production account-creation flow",
            "Initiated and facilitated bi-weekly retrospectives for the engineering team, leading to a documentation-focused sprint and broader process improvements",
        ],
        "stack": "TypeScript · React · API Development · E2E Testing",
        "note": "Company-wide layoff, not performance.",
    },
    {
        "company": "Sana Benefits",
        "position": "Software Engineer",
        "start": "Oct 2022",
        "end": "Feb 2023",
        "bullets": [
            "Built healthcare plan selection feature for members",
            "Acted as Agile Coach teaching Scrum practices to the team",
            "Created standardized testing process improving code reliability",
        ],
        "stack": "React · Jest · SASS · Ruby on Rails",
        "note": "Company-wide layoff, not performance.",
    },
    {
        "company": "Purple",
        "position": "Senior Software Engineer",
        "start": "Nov 2020",
        "end": "Sep 2022",
        "bullets": [
            "Built multi-million dollar sale promotions powering major revenue events using Vue.js, YAML, SASS, Docker, and AWS",
            "Created the order-history feature with React, Redux, a custom REST microservice, Commerce Tools, and AWS Cognito as part of a larger Purple customer-accounts initiative",
            "Developed A/B tests for the cart checkout flow with React, Redux, and the Google Places API, lifting test coverage across the codebase by 40% using Jest and React Testing Library",
        ],
        "stack": "Vue.js · React · Redux · SASS · Docker · AWS · Commerce Tools",
    },
    {
        "company": "The Regis Company",
        "position": "Software Engineer II",
        "start": "Nov 2017",
        "end": "Nov 2020",
        "bullets": [
            "Contributed to a SPA powering award-winning corporate learning experiences alongside a small cross-disciplinary startup team",
            "Integrated a new Python API that cut project load times from 6 seconds to 500ms",
            "Met with clients alongside product owners to refine technical user requirements, reducing project scopes by 30% as measured by Agile story points",
            "Used my UX background to bridge UX, Dev, and Product teams, driving a 20% productivity increase as measured by burndown charts",
        ],
        "stack": "React · Python · MobX",
    },
]

EARLIER = [
    ("Charter Communications", "Web Developer (Contract)", "Jul 2017 – Nov 2017"),
    ("Freelance Designer", "Freelance Designer", "Jan 2017 – Jul 2017"),
    ("Gogo Business Aviation", "UI/UX Software Engineering Intern", "May 2016 – Aug 2016"),
    ("Lab for Playful Computation", "UI/UX Developer", "Sep 2015 – May 2017"),
    ("CU Boulder IT / MCDB", "Technical Support", "Sep 2014 – Apr 2016"),
]

SKILLS = [
    ("Frontend", "React, TypeScript, Next.js, Vue.js, GraphQL, Redux, HTML/CSS, SASS, Tailwind CSS"),
    ("Backend", "Node.js, Python, Django, Ruby on Rails"),
    ("Tools & Infrastructure", "Docker, AWS, Git, Jest, Cypress, Webpack"),
    ("Leadership & Practices", "Agile/Scrum, Cross-functional Leadership, Product Management, Product Design, UI/UX, E2E Testing, AI/LLM Integration"),
]

EDUCATION = [
    {
        "degree": "B.S. Computer Science — Human Centered Computing",
        "institution": "University of Colorado Boulder",
        "years": "2014 – 2017",
        "notes": "Minor in Technology, Arts, and Media (ATLAS Institute)",
    },
    {
        "degree": "A.S.",
        "institution": "Front Range Community College",
        "years": "2012 – 2014",
        "notes": "",
    },
]

CERTIFICATIONS = [
    ("Certified ScrumMaster (CSM)", "Scrum Alliance", "Oct 2020"),
    ("Agile Training", "Mountain Goat Software (Mike Cohn)", ""),
]


def section_rule():
    return HRFlowable(
        width="100%", thickness=0.6, color=GOLD, spaceBefore=0, spaceAfter=4
    )


def build_story():
    story = []

    # Header
    story.append(Paragraph(NAME, styles["name"]))
    story.append(Paragraph(f"{TITLE} &nbsp;·&nbsp; {AVAILABILITY}", styles["subtitle"]))
    story.append(Paragraph(CONTACT, styles["contact"]))

    # Summary
    story.append(Paragraph("SUMMARY", styles["section_header"]))
    story.append(section_rule())
    story.append(Paragraph(SUMMARY, styles["body"]))

    # Experience
    story.append(Paragraph("EXPERIENCE", styles["section_header"]))
    story.append(section_rule())
    for job in EXPERIENCE:
        job_block = [
            Paragraph(
                f"<b>{job['position']}</b> &nbsp;·&nbsp; {job['company']} "
                f"<font color='#6B6658'>&nbsp;&nbsp;&nbsp;{job['start']} – {job['end']}</font>",
                styles["job_line"],
            ),
        ]
        if job.get("stack"):
            job_block.append(Paragraph(job["stack"], styles["job_meta"]))
        if job.get("note"):
            job_block.append(Paragraph(job["note"], styles["job_meta"]))
        for b in job["bullets"]:
            job_block.append(Paragraph(f"•&nbsp;&nbsp;{b}", styles["bullet"]))
        # Keep the first job line + at least one bullet together to avoid orphans.
        story.append(KeepTogether(job_block))

    # Earlier
    story.append(Paragraph("EARLIER EXPERIENCE", styles["section_header"]))
    story.append(section_rule())
    for company, position, dates in EARLIER:
        story.append(
            Paragraph(
                f"<b>{position}</b> &nbsp;·&nbsp; {company} "
                f"<font color='#6B6658'>&nbsp;&nbsp;&nbsp;{dates}</font>",
                styles["earlier_line"],
            )
        )

    # Skills
    story.append(Paragraph("SKILLS", styles["section_header"]))
    story.append(section_rule())
    skill_rows = [
        [Paragraph(f"<b>{cat}</b>", styles["body"]), Paragraph(items, styles["body"])]
        for cat, items in SKILLS
    ]
    skills_table = Table(
        skill_rows,
        colWidths=[1.5 * inch, 5.5 * inch],
        style=TableStyle(
            [
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("TOPPADDING", (0, 0), (-1, -1), 1),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 1),
                ("LEFTPADDING", (0, 0), (-1, -1), 0),
            ]
        ),
    )
    story.append(skills_table)

    # Education
    story.append(Paragraph("EDUCATION", styles["section_header"]))
    story.append(section_rule())
    for e in EDUCATION:
        story.append(
            Paragraph(
                f"<b>{e['degree']}</b> &nbsp;·&nbsp; {e['institution']} "
                f"<font color='#6B6658'>&nbsp;&nbsp;&nbsp;{e['years']}</font>",
                styles["earlier_line"],
            )
        )
        if e["notes"]:
            story.append(Paragraph(e["notes"], styles["job_meta"]))

    # Certifications
    story.append(Paragraph("CERTIFICATIONS & TRAINING", styles["section_header"]))
    story.append(section_rule())
    for name, issuer, date in CERTIFICATIONS:
        suffix = f" &nbsp;·&nbsp; {date}" if date else ""
        story.append(
            Paragraph(
                f"<b>{name}</b> &nbsp;·&nbsp; {issuer}"
                f"<font color='#6B6658'>{suffix}</font>",
                styles["earlier_line"],
            )
        )

    return story


def main():
    output_path = str(Path(__file__).resolve().parent.parent / "public" / "zach-lamb-resume.pdf")
    doc = SimpleDocTemplate(
        output_path,
        pagesize=LETTER,
        leftMargin=0.6 * inch,
        rightMargin=0.6 * inch,
        topMargin=0.55 * inch,
        bottomMargin=0.55 * inch,
        title="Zach Lamb — Resume",
        author="Zach Lamb",
        subject=TITLE,
    )
    doc.build(build_story())
    print(f"Wrote {output_path}")


if __name__ == "__main__":
    main()

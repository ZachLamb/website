"""Generate Zach Lamb's resume PDF from the portfolio's data files.

Uses reportlab Platypus for flow-based layout with tight spacing.
Output: /Users/zach/Code/website/public/zach-lamb-resume.pdf
"""
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
TITLE = "Senior Software Engineer"
AVAILABILITY = "Open to remote"
CONTACT = (
    "zachlamb.io &nbsp;·&nbsp; "
    '<a href="https://github.com/ZachLamb" color="#6B6658">github.com/ZachLamb</a> &nbsp;·&nbsp; '
    '<a href="https://www.linkedin.com/in/lambzachary/" color="#6B6658">linkedin.com/in/lambzachary</a>'
)

SUMMARY = (
    "Full-stack engineer with a product manager's instinct. Specializing in React, "
    "TypeScript, and LLM-powered tools. Certified ScrumMaster with a Human-Centered "
    "Computing background, shipping performant apps from cybersecurity platforms to "
    "e-commerce at scale."
)

# Full experience list — everything in data/experience.ts verbatim.
EXPERIENCE = [
    {
        "company": "Circadence",
        "position": "Sr. Software Engineer",
        "start": "Sep 2025",
        "end": "Present",
        "bullets": [
            "Building LLM and AI-powered web tools for cybersecurity professionals",
            "Developing intelligent interfaces that augment security workflows with generative AI",
            "Architecting front-end systems with TypeScript and React for mission-critical applications",
        ],
        "stack": "TypeScript · React · AI/LLM",
    },
    {
        "company": "Starbucks",
        "position": "Sr. React Developer",
        "start": "Feb 2024",
        "end": "Sep 2025",
        "bullets": [
            "Developed message reply and edit features with TypeScript, React, and GraphQL",
            "Upgraded UI libraries raising Lighthouse performance score from 65 to 90",
            "Collaborated across teams on a new web application for store managers and developed Agile processes",
        ],
        "stack": "TypeScript · React · GraphQL · Apollo Client",
    },
    {
        "company": "StellarFi",
        "position": "Senior Software Engineer",
        "start": "May 2023",
        "end": "Jan 2024",
        "bullets": [
            "Created a new design system for a brand refresh, driving 100 new users per week improvement",
            "Built API and UI table for credit bureau reporting",
            "Created E2E testing framework that uncovered 2 major regression bugs and initiated bi-weekly retrospectives",
        ],
        "stack": "TypeScript · React · E2E Testing",
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
    },
    {
        "company": "Purple",
        "position": "Senior Software Engineer",
        "start": "Nov 2020",
        "end": "Sep 2022",
        "bullets": [
            "Built multi-million dollar sale promotions powering major revenue events",
            "Created order history feature with React, Redux, and a custom REST API",
            "Developed A/B tests increasing testing coverage by 40%",
        ],
        "stack": "Vue.js · React · Redux · SASS · Docker · AWS",
    },
    {
        "company": "The Regis Company",
        "position": "Software Engineer II",
        "start": "Nov 2017",
        "end": "Nov 2020",
        "bullets": [
            "Contributed to a SPA for award-winning corporate learning experiences",
            "Integrated new Python API reducing load times from 6 seconds to 500ms",
            "Used UX background to improve team collaboration, achieving a 20% productivity increase",
        ],
        "stack": "React · Python · MobX",
    },
]

EARLIER = [
    ("Charter Communications", "Web Developer", "Jul 2017 – Nov 2017"),
    ("Freelance Designer", "Freelance Designer", "Jan 2017 – Jul 2017"),
    ("Lab for Playful Computation", "UI/UX Developer", "Sep 2015 – May 2017"),
    ("CU Boulder IT / MCDB", "Technical Support", "Sep 2014 – Apr 2016"),
]

SKILLS = [
    ("Frontend", "React, TypeScript, Next.js, Vue.js, GraphQL, Redux, HTML/CSS, SASS, Tailwind CSS"),
    ("Backend", "Node.js, Python, Django, Ruby on Rails"),
    ("Tools & Infrastructure", "Docker, AWS, Git, Jest, Cypress, Webpack"),
    ("Practices", "Agile/Scrum, Product Design, UI/UX, E2E Testing, AI/LLM Integration"),
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
    story.append(Paragraph("CERTIFICATIONS", styles["section_header"]))
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
    output_path = "/Users/zach/Code/website/public/zach-lamb-resume.pdf"
    doc = SimpleDocTemplate(
        output_path,
        pagesize=LETTER,
        leftMargin=0.6 * inch,
        rightMargin=0.6 * inch,
        topMargin=0.55 * inch,
        bottomMargin=0.55 * inch,
        title="Zach Lamb — Resume",
        author="Zach Lamb",
        subject="Senior Software Engineer",
    )
    doc.build(build_story())
    print(f"Wrote {output_path}")


if __name__ == "__main__":
    main()

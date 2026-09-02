import os
from reportlab.lib import colors
from reportlab.lib.pagesizes import letter
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle

def generate_ayush_guide_pdf():
    pdf_filename = "FarmDirect_Collaborator_Setup_Guide_For_Ayush.pdf"
    pdf_path = os.path.join(os.getcwd(), pdf_filename)
    
    # 612 x 792 pt letter, 26 pt margins -> printable width 560 pt
    doc = SimpleDocTemplate(
        pdf_path,
        pagesize=letter,
        leftMargin=26,
        rightMargin=26,
        topMargin=22,
        bottomMargin=20
    )

    styles = getSampleStyleSheet()

    # Color Scheme
    c_primary = colors.HexColor('#065f46')   # Emerald 800
    c_secondary = colors.HexColor('#0f766e') # Teal 700
    c_accent = colors.HexColor('#d97706')    # Amber 600
    c_dark = colors.HexColor('#0f172a')      # Slate 900
    c_muted = colors.HexColor('#475569')     # Slate 600
    c_card_bg = colors.HexColor('#f8fafc')   # Slate 50
    c_code_bg = colors.HexColor('#0f172a')   # Slate 900
    c_border = colors.HexColor('#cbd5e1')
    c_green_bg = colors.HexColor('#f0fdf4')

    # Typography
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=16,
        leading=19,
        textColor=c_primary,
        spaceAfter=2
    )

    subtitle_style = ParagraphStyle(
        'DocSubTitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8,
        leading=11,
        textColor=c_muted,
        spaceAfter=4
    )

    step_title = ParagraphStyle(
        'StepTitle',
        parent=styles['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=9.5,
        leading=12,
        textColor=c_primary,
        spaceBefore=4,
        spaceAfter=2
    )

    step_desc = ParagraphStyle(
        'StepDesc',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=7.5,
        leading=10,
        textColor=c_dark
    )

    code_text = ParagraphStyle(
        'CodeText',
        parent=styles['Normal'],
        fontName='Courier-Bold',
        fontSize=7.5,
        leading=10,
        textColor=colors.HexColor('#38bdf8')
    )

    table_header = ParagraphStyle(
        'TableHeader',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=7.5,
        leading=9.5,
        textColor=colors.white
    )

    cell_bold = ParagraphStyle(
        'CellBold',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=7,
        leading=9,
        textColor=c_secondary
    )

    cell_norm = ParagraphStyle(
        'CellNorm',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=7,
        leading=9,
        textColor=c_dark
    )

    story = []

    # 1. Header Banner
    header_data = [
        [
            Paragraph("<b>FARMDIRECT: PROJECT RUN & DATABASE ACCESS GUIDE</b><br/><font size='7.5' color='#047857'>COLLABORATION MANUAL FOR AYUSH • ZERO LOCAL DB SETUP REQUIRED</font>", title_style),
            Paragraph("<b>QUICK SETUP MANUAL</b><br/><font size='6.5' color='#64748b'>Target: <b>Ayush</b><br/>Project: <b>FarmDirect</b><br/>Database: <b>Neon Cloud PG</b></font>", ParagraphStyle('RAlign', parent=subtitle_style, alignment=2))
        ]
    ]
    t_header = Table(header_data, colWidths=[380, 180])
    t_header.setStyle(TableStyle([
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('BOTTOMPADDING', (0,0), (-1,-1), 0),
        ('TOPPADDING', (0,0), (-1,-1), 0),
    ]))
    story.append(t_header)
    story.append(HRFlowable(width="100%", thickness=1.5, color=c_primary, spaceAfter=4, spaceBefore=3))

    # 2. Key Architecture Notice (Why Ayush has it easy)
    notice_text = """
    <b>🌟 Important Notice for Ayush:</b> You <b>DO NOT</b> need to install PostgreSQL or configure database passwords. 
    FarmDirect uses a <b>shared Neon Serverless Cloud Database</b>. By simply setting up your <code>.env</code> file (Step 2), 
    your computer will automatically connect to the real live cloud database, sharing live data with Raajveer in real time!
    """
    t_notice = Table([[Paragraph(notice_text, ParagraphStyle('NoticeP', parent=step_desc, fontSize=7.2, leading=9.5))]], colWidths=[560])
    t_notice.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), c_green_bg),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#86efac')),
        ('TOPPADDING', (0,0), (-1,-1), 3),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3),
        ('LEFTPADDING', (0,0), (-1,-1), 6),
        ('RIGHTPADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(t_notice)
    story.append(Spacer(1, 3))

    # 3. Prerequisites Row
    prereq_data = [
        [
            Paragraph("<b>Prerequisites (Before Starting):</b>", ParagraphStyle('PReqH', parent=cell_bold, textColor=colors.HexColor('#92400e'))),
            Paragraph("1. <b>Git</b> installed (<code>git-scm.com</code>)", cell_norm),
            Paragraph("2. <b>Node.js v18+</b> installed (<code>nodejs.org</code>)", cell_norm),
            Paragraph("3. <b>VS Code</b> or any Terminal", cell_norm)
        ]
    ]
    t_prereq = Table(prereq_data, colWidths=[130, 140, 140, 150])
    t_prereq.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#fef3c7')),
        ('BOX', (0,0), (-1,-1), 0.5, colors.HexColor('#fde68a')),
        ('TOPPADDING', (0,0), (-1,-1), 2),
        ('BOTTOMPADDING', (0,0), (-1,-1), 2),
        ('LEFTPADDING', (0,0), (-1,-1), 5),
    ]))
    story.append(t_prereq)
    story.append(Spacer(1, 3))

    # 4. Step-by-Step Instructions
    def make_step(step_num, title, where_text, cmd_list, explanation):
        code_formatted = "<br/>".join([f"<code>&gt; {c}</code>" for c in cmd_list])
        row = [
            [
                Paragraph(f"<b>STEP {step_num}: {title.upper()}</b>", step_title),
                Paragraph(f"<b>Where:</b> {where_text}", ParagraphStyle('WhereP', parent=step_desc, alignment=2, textColor=c_muted))
            ],
            [
                Paragraph(explanation, step_desc),
                Paragraph(f"<font color='#38bdf8'>{code_formatted}</font>", ParagraphStyle('CodeBox', parent=code_text, backColor=c_code_bg, borderPadding=3))
            ]
        ]
        t = Table(row, colWidths=[310, 250])
        t.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,-1), c_card_bg),
            ('BOX', (0,0), (-1,-1), 0.5, c_border),
            ('TOPPADDING', (0,0), (-1,-1), 2.5),
            ('BOTTOMPADDING', (0,0), (-1,-1), 2.5),
            ('LEFTPADDING', (0,0), (-1,-1), 5),
            ('RIGHTPADDING', (0,0), (-1,-1), 5),
            ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ]))
        return t

    # Step 1: Clone
    story.append(make_step(
        1,
        "Clone the Repository to Your PC",
        "PowerShell or Command Prompt",
        ["git clone https://github.com/raajveer20/FarmDirect.git", "cd FarmDirect"],
        "Downloads the entire project codebase, dependencies, images, and configuration onto your local machine."
    ))
    story.append(Spacer(1, 2.5))

    # Step 2: Database Connect
    story.append(make_step(
        2,
        "Connect to Shared Neon Cloud Database",
        "Inside project folder terminal",
        ["Copy-Item .env.example .env     # (Windows PowerShell)", "cp .env.example .env            # (Mac / Linux)"],
        "Creates your <code>.env</code> file pre-configured with the live <b>Neon Cloud PostgreSQL</b> connection string. Both you and Raajveer share the same database!"
    ))
    story.append(Spacer(1, 2.5))

    # Step 3: Install & Start
    story.append(make_step(
        3,
        "Install Packages & Run Dev Server",
        "Terminal inside FarmDirect folder",
        ["npm install", "npm run dev"],
        "Installs React 19, Tailwind v4, Lucide, Recharts & Leaflet. Launches the development server in under 1 second."
    ))
    story.append(Spacer(1, 2.5))

    # Step 4: Open Browser
    story.append(make_step(
        4,
        "Open Web Application in Browser",
        "Chrome, Edge, or Brave Browser",
        ["http://localhost:5173"],
        "Navigate to <b>http://localhost:5173</b>. The application will load with full database access, real-time tracking, and interactive dashboards."
    ))
    story.append(Spacer(1, 3))

    # 5. Ready-To-Use Verification Accounts Table
    story.append(Paragraph("<b>5. Pre-Seeded Accounts in Cloud Database for Testing</b>", step_title))
    
    acc_rows = [
        [Paragraph("Gateway / Portal", table_header), Paragraph("Account Details", table_header), Paragraph("How to Log In (Verification Code)", table_header)],
        [
            Paragraph("<b>Farmer Gateway</b><br/><font size='6' color='#047857'>Govt Land Verified</font>", cell_bold),
            Paragraph("<b>Ramesh Patel</b> (Sehore, MP)<br/>Phone: <code>98765 43210</code><br/>Khasra: #214/1 (4.5 Acres)", cell_norm),
            Paragraph("Select Farmer ➔ Enter <code>98765 43210</code> ➔ Click <i>Send OTP</i>. Dynamic 6-digit OTP will auto-fill or enter <code>123456</code>. Middlemen numbers are blocked!", cell_norm)
        ],
        [
            Paragraph("<b>Fleet Logistics</b><br/><font size='6' color='#0f766e'>Command Center</font>", cell_bold),
            Paragraph("<b>Gurpreet Singh</b> (Central Hub)<br/>Admin Badge: <code>ADM-8821</code><br/>Phone: <code>98112 33445</code>", cell_norm),
            Paragraph("Select Logistics ➔ Badge <code>ADM-8821</code> ➔ Phone <code>98112 33445</code> ➔ Click <i>Verify & Enter Command</i>. Unlocks live reefer dispatch & telemetry.", cell_norm)
        ],
        [
            Paragraph("<b>Wholesale Buyer</b><br/><font size='6' color='#b45309'>Direct Marketplace</font>", cell_bold),
            Paragraph("<b>Guest / Wholesale Buyer</b><br/>Browse fresh certified produce", cell_norm),
            Paragraph("No pre-registration required. Browse crops, add to cart, and experience the <b>Trustless Escrow Checkout</b> with zero-middlemen price breakdown.", cell_norm)
        ]
    ]
    t_acc = Table(acc_rows, colWidths=[120, 180, 260])
    t_acc.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), c_primary),
        ('GRID', (0,0), (-1,-1), 0.5, c_border),
        ('TOPPADDING', (0,0), (-1,-1), 2),
        ('BOTTOMPADDING', (0,0), (-1,-1), 2),
        ('LEFTPADDING', (0,0), (-1,-1), 4),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, colors.HexColor('#f8fafc')])
    ]))
    story.append(t_acc)
    story.append(Spacer(1, 3))

    # 6. Audit Footer
    audit_data = [
        [
            Paragraph("<b>FarmDirect Open Source Deployment Guide</b><br/><font size='6' color='#64748b'>Project Repo: github.com/raajveer20/FarmDirect | Cloud DB: Neon AWS Cloud</font>", cell_norm),
            Paragraph("<b>CREATED FOR AYUSH</b><br/><font size='6' color='#64748b'>Production Release | September 2026</font>", ParagraphStyle('AuditR', parent=cell_norm, alignment=2))
        ]
    ]
    t_audit = Table(audit_data, colWidths=[360, 200])
    t_audit.setStyle(TableStyle([
        ('LINEABOVE', (0,0), (-1,-1), 0.5, c_border),
        ('TOPPADDING', (0,0), (-1,-1), 2),
    ]))
    story.append(t_audit)

    doc.build(story)
    print("SUCCESS: Generated Ayush Guide PDF at " + str(pdf_path))
    print("File size: " + str(os.path.getsize(pdf_path)) + " bytes")

if __name__ == '__main__':
    generate_ayush_guide_pdf()

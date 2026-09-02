import os
from reportlab.lib import colors
from reportlab.lib.pagesizes import letter
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable, KeepTogether
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle

def generate_techstack_pdf():
    pdf_filename = "FarmDirect_Technology_Stack_Architecture.pdf"
    pdf_path = os.path.join(os.getcwd(), pdf_filename)
    
    # Standard portrait letter: 612 x 792 pt, 24 pt top/bottom margins -> printable height 744 pt
    doc = SimpleDocTemplate(
        pdf_path,
        pagesize=letter,
        leftMargin=30,
        rightMargin=30,
        topMargin=20,
        bottomMargin=18
    )

    styles = getSampleStyleSheet()

    # Custom Palette
    c_primary = colors.HexColor('#065f46')   # Forest Emerald
    c_secondary = colors.HexColor('#0f766e') # Deep Teal
    c_accent = colors.HexColor('#d97706')    # Amber
    c_dark = colors.HexColor('#0f172a')      # Slate 900
    c_muted = colors.HexColor('#475569')     # Slate 600
    c_light_bg = colors.HexColor('#f0fdf4')  # Mint 50
    c_border = colors.HexColor('#cbd5e1')

    # Typography
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=16,
        leading=19,
        textColor=c_primary,
        spaceAfter=1
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

    section_h2 = ParagraphStyle(
        'SectionH2',
        parent=styles['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=9.5,
        leading=12,
        textColor=c_primary,
        spaceBefore=5,
        spaceAfter=2
    )

    body_text = ParagraphStyle(
        'BodyTextCustom',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=7.5,
        leading=9.5,
        textColor=c_dark
    )

    table_header = ParagraphStyle(
        'TableHeader',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=7.5,
        leading=9.5,
        textColor=colors.white
    )

    cell_tech = ParagraphStyle(
        'CellTech',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=7.5,
        leading=9.5,
        textColor=c_secondary
    )

    cell_desc = ParagraphStyle(
        'CellDesc',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=7,
        leading=9,
        textColor=c_dark
    )

    cell_badge = ParagraphStyle(
        'CellBadge',
        parent=styles['Normal'],
        fontName='Courier-Bold',
        fontSize=6.8,
        leading=8.5,
        textColor=colors.HexColor('#047857')
    )

    story = []

    # 1. Header Banner
    header_data = [
        [
            Paragraph("<b>FARMDIRECT: SYSTEM ARCHITECTURE & TECH STACK</b><br/><font size='7.5' color='#047857'>DIRECT FARM-TO-CONSUMER MARKETPLACE & ANTI-MIDDLEMAN GATEKEEPER</font>", title_style),
            Paragraph("<b>TECHNICAL SPECIFICATION</b><br/><font size='6.5' color='#64748b'>Doc ID: <code>FD-TECH-2026-V1</code><br/>Database: <b>Neon Cloud PostgreSQL</b><br/>GitHub: <code>raajveer20/FarmDirect</code></font>", ParagraphStyle('RAlign', parent=subtitle_style, alignment=2))
        ]
    ]
    header_table = Table(header_data, colWidths=[360, 192])
    header_table.setStyle(TableStyle([
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('BOTTOMPADDING', (0,0), (-1,-1), 0),
        ('TOPPADDING', (0,0), (-1,-1), 0),
    ]))
    story.append(header_table)
    story.append(HRFlowable(width="100%", thickness=1.5, color=c_primary, spaceAfter=4, spaceBefore=3))

    # 2. Executive Overview Stats Box
    stat_boxes = [
        [
            Paragraph("<b>Client Frontend</b><br/><font size='9' color='#065f46'><b>React 19 + Tailwind v4</b></font><br/><font size='6' color='#64748b'>Vite 8 Build Engine</font>", cell_desc),
            Paragraph("<b>Database Engine</b><br/><font size='9' color='#0f766e'><b>Neon Serverless PG</b></font><br/><font size='6' color='#64748b'>Auto-Pooled & SSL Secured</font>", cell_desc),
            Paragraph("<b>Real-Time Telemetry</b><br/><font size='9' color='#b45309'><b>Server-Sent Events</b></font><br/><font size='6' color='#64748b'>Live GPS Cold-Chain</font>", cell_desc),
            Paragraph("<b>Anti-Middleman Gate</b><br/><font size='9' color='#b91c1c'><b>PM-Kisan & Bhulekh</b></font><br/><font size='6' color='#64748b'>Govt Land Verified KYC</font>", cell_desc)
        ]
    ]
    stat_table = Table(stat_boxes, colWidths=[138, 138, 138, 138])
    stat_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), c_light_bg),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#a7f3d0')),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor('#a7f3d0')),
        ('TOPPADDING', (0,0), (-1,-1), 3),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3),
        ('LEFTPADDING', (0,0), (-1,-1), 5),
        ('RIGHTPADDING', (0,0), (-1,-1), 5),
    ]))
    story.append(stat_table)
    story.append(Spacer(1, 2))

    # 3. Layer-by-Layer Detailed Tech Stack
    story.append(Paragraph("<b>1. Frontend & Client-Side Presentation Layer</b>", section_h2))
    
    frontend_rows = [
        [Paragraph("Technology", table_header), Paragraph("Version / Package", table_header), Paragraph("Functional Role & Architectural Purpose", table_header)],
        [
            Paragraph("React 19", cell_tech),
            Paragraph("v19.2.8", cell_badge),
            Paragraph("Component architecture utilizing modern concurrent rendering, custom hooks, and unified atomic context for Farmer, Buyer, and Admin gateways.", cell_desc)
        ],
        [
            Paragraph("Vite 8", cell_tech),
            Paragraph("v8.2.2", cell_badge),
            Paragraph("Ultra-fast frontend dev server and production builder with integrated custom API middleware plugins.", cell_desc)
        ],
        [
            Paragraph("Tailwind CSS v4", cell_tech),
            Paragraph("v4.3.3 (@tailwindcss/vite)", cell_badge),
            Paragraph("Next-gen CSS utility engine delivering custom glassmorphic cards, responsive mobile-first layouts, and high-contrast color tokens.", cell_desc)
        ],
        [
            Paragraph("Recharts", cell_tech),
            Paragraph("v3.10.1", cell_badge),
            Paragraph("Visualizes dynamic AI demand forecasting curves, seasonal mandi vs. direct price spreads, and farmer revenue gains.", cell_desc)
        ],
        [
            Paragraph("Leaflet", cell_tech),
            Paragraph("v1.9.4", cell_badge),
            Paragraph("Renders interactive geospatial maps, cold-chain GPS telemetry markers, and optimized multi-stop transit corridors.", cell_desc)
        ],
        [
            Paragraph("Lucide React", cell_tech),
            Paragraph("v1.37.0", cell_badge),
            Paragraph("Accessible, modern SVG iconography across product cards, order timelines, and dashboard controls.", cell_desc)
        ]
    ]
    t_front = Table(frontend_rows, colWidths=[110, 110, 332])
    t_front.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), c_primary),
        ('GRID', (0,0), (-1,-1), 0.5, c_border),
        ('TOPPADDING', (0,0), (-1,-1), 2),
        ('BOTTOMPADDING', (0,0), (-1,-1), 2),
        ('LEFTPADDING', (0,0), (-1,-1), 4),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, colors.HexColor('#f8fafc')])
    ]))
    story.append(t_front)
    story.append(Spacer(1, 2))

    # 4. Backend & Real-Time Middleware
    story.append(Paragraph("<b>2. Backend & Serverless Middleware Layer</b>", section_h2))
    backend_rows = [
        [Paragraph("Component", table_header), Paragraph("Implementation", table_header), Paragraph("Architectural Details", table_header)],
        [
            Paragraph("Vite API Middleware", cell_tech),
            Paragraph("Node.js ES Modules", cell_badge),
            Paragraph("Lightweight HTTP API gateway handling authentication endpoints, product catalog queries, and zero-middlemen escrow payouts.", cell_desc)
        ],
        [
            Paragraph("Server-Sent Events (SSE)", cell_tech),
            Paragraph("Text/Event-Stream", cell_badge),
            Paragraph("One-way real-time push streaming cold-chain vehicle GPS updates, temperature alerts, and order milestones to buyers without polling.", cell_desc)
        ],
        [
            Paragraph("Spring Boot Microservice", cell_tech),
            Paragraph("Java 17 / Spring Boot 3", cell_badge),
            Paragraph("Alternative enterprise backend (in <code>backend/</code>) with Spring Security, JPA/Hibernate, and JWT authentication.", cell_desc)
        ]
    ]
    t_back = Table(backend_rows, colWidths=[120, 110, 322])
    t_back.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), c_secondary),
        ('GRID', (0,0), (-1,-1), 0.5, c_border),
        ('TOPPADDING', (0,0), (-1,-1), 2),
        ('BOTTOMPADDING', (0,0), (-1,-1), 2),
        ('LEFTPADDING', (0,0), (-1,-1), 4),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, colors.HexColor('#f8fafc')])
    ]))
    story.append(t_back)
    story.append(Spacer(1, 2))

    # 5. Database & Cloud Architecture
    story.append(Paragraph("<b>3. Cloud Database & Storage Layer (Neon PostgreSQL)</b>", section_h2))
    db_rows = [
        [Paragraph("Schema Table", table_header), Paragraph("Key Columns", table_header), Paragraph("Purpose & Security Enforcement", table_header)],
        [
            Paragraph("govt_verified_farmers", cell_tech),
            Paragraph("farmer_id, khasra_no, aadhaar, kcc, land_acres, phone", cell_badge),
            Paragraph("Government-certified land registry. Strictly rejects unregistered middlemen attempting to register as farmers.", cell_desc)
        ],
        [
            Paragraph("admins", cell_tech),
            Paragraph("admin_id, full_name, phone, designation, zone, access_tier", cell_badge),
            Paragraph("Operational command directory. Dual-key (Admin ID + Registered Phone) gatekeeper for fleet operations.", cell_desc)
        ],
        [
            Paragraph("otp_records", cell_tech),
            Paragraph("phone, email, otp, role, verified, created_at", cell_badge),
            Paragraph("Manages dynamic 6-digit OTP lifecycles with expiration and verification status tracking.", cell_desc)
        ],
        [
            Paragraph("products & orders", cell_tech),
            Paragraph("id, price_per_kg, available_qty, origin_json, telemetry", cell_badge),
            Paragraph("Real-time crop listings and active multi-step orders with GPS coordinates and driver telemetry.", cell_desc)
        ],
        [
            Paragraph("payouts", cell_tech),
            Paragraph("order_id, utr, farmer_upi, amount, zero_middlemen_cut", cell_badge),
            Paragraph("Tracks instant UPI settlement transfers with verified UTR bank transaction IDs.", cell_desc)
        ]
    ]
    t_db = Table(db_rows, colWidths=[120, 130, 302])
    t_db.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#1e3a8a')),
        ('GRID', (0,0), (-1,-1), 0.5, c_border),
        ('TOPPADDING', (0,0), (-1,-1), 2),
        ('BOTTOMPADDING', (0,0), (-1,-1), 2),
        ('LEFTPADDING', (0,0), (-1,-1), 4),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, colors.HexColor('#f8fafc')])
    ]))
    story.append(t_db)
    story.append(Spacer(1, 2))

    # 6. Security, Compliance & Anti-Middleman Protocol
    story.append(Paragraph("<b>4. Anti-Middleman Security & Regulatory Architecture</b>", section_h2))
    
    security_text = """
    <b>• Anti-Middleman Bhulekh KYC:</b> Farmers cannot list produce without validating their Farmer ID, Aadhaar, and Khasra title against official state records.<br/>
    <b>• Zero Public Admin Registration:</b> The logistics gateway is closed to public signups; only pre-approved officers in <code>admins</code> can log in via Phone + Admin ID + OTP.<br/>
    <b>• Trustless Escrow Settlement:</b> Buyer payments are locked in an escrow state until digital delivery confirmation triggers instant UPI payout.
    """
    sec_data = [[Paragraph(security_text, ParagraphStyle('SecStyle', parent=body_text, fontSize=7, leading=9.2))]]
    t_sec = Table(sec_data, colWidths=[552])
    t_sec.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#fef9c3')),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#fde047')),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ('LEFTPADDING', (0,0), (-1,-1), 6),
        ('RIGHTPADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(t_sec)
    story.append(Spacer(1, 4))

    # 7. Audit Footer
    audit_data = [
        [
            Paragraph("<b>FarmDirect Architecture & Technical Audit Specification</b><br/><font size='6' color='#64748b'>Cloud Instance: Neon AWS (ap-southeast-2) | GitHub: github.com/raajveer20/FarmDirect</font>", cell_desc),
            Paragraph("<b>CONFIDENTIAL / OPEN AUDIT</b><br/><font size='6' color='#64748b'>Release Status: Production Ready | September 2026</font>", ParagraphStyle('AuditR', parent=cell_desc, alignment=2))
        ]
    ]
    t_audit = Table(audit_data, colWidths=[352, 200])
    t_audit.setStyle(TableStyle([
        ('LINEABOVE', (0,0), (-1,-1), 0.5, c_border),
        ('TOPPADDING', (0,0), (-1,-1), 3),
    ]))
    story.append(t_audit)

    doc.build(story)
    print("SUCCESS: Generated PDF at " + str(pdf_path))
    print("File size: " + str(os.path.getsize(pdf_path)) + " bytes")

if __name__ == '__main__':
    generate_techstack_pdf()

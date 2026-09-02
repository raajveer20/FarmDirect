import os
from reportlab.lib import colors
from reportlab.lib.pagesizes import letter, landscape
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle

def generate_pdf():
    pdf_path = os.path.join(os.getcwd(), "Government_Verified_Farmers_Registry.pdf")
    doc = SimpleDocTemplate(
        pdf_path,
        pagesize=landscape(letter),
        leftMargin=36,
        rightMargin=36,
        topMargin=36,
        bottomMargin=36
    )

    styles = getSampleStyleSheet()
    
    # Custom Styles
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=18,
        leading=22,
        textColor=colors.HexColor('#065f46'),
        spaceAfter=2
    )
    
    subtitle_style = ParagraphStyle(
        'DocSubTitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=10,
        leading=14,
        textColor=colors.HexColor('#475569'),
        spaceAfter=10
    )

    h2_style = ParagraphStyle(
        'SectionH2',
        parent=styles['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=12,
        leading=16,
        textColor=colors.HexColor('#1e293b'),
        spaceBefore=12,
        spaceAfter=6
    )

    body_style = ParagraphStyle(
        'BodyDark',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=12,
        textColor=colors.HexColor('#1e293b')
    )

    cell_style = ParagraphStyle(
        'TableCell',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=7.5,
        leading=10,
        textColor=colors.HexColor('#1e293b')
    )

    cell_bold = ParagraphStyle(
        'TableCellBold',
        parent=cell_style,
        fontName='Helvetica-Bold',
        textColor=colors.HexColor('#065f46')
    )

    cell_code = ParagraphStyle(
        'TableCellCode',
        parent=cell_style,
        fontName='Courier-Bold',
        fontSize=7,
        leading=9,
        textColor=colors.HexColor('#0f766e')
    )

    cell_danger = ParagraphStyle(
        'TableCellDanger',
        parent=cell_style,
        fontName='Courier-Bold',
        fontSize=7.5,
        leading=9,
        textColor=colors.HexColor('#b91c1c')
    )

    cell_header = ParagraphStyle(
        'TableHeader',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8,
        leading=10,
        textColor=colors.white
    )

    elements = []

    # Title & Subtitle
    elements.append(Paragraph("FarmDirect &bull; Government Verified Farmers Registry", title_style))
    elements.append(Paragraph("Official Pre-Verified Land Records & Anti-Middleman Verification Dataset | Smart India Hackathon 2026", subtitle_style))
    elements.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor('#059669'), spaceAfter=8))

    # Notice Box
    notice_text = (
        "<b>Evaluation Purpose:</b> Traditional agricultural supply chains suffer from commercial brokers and commission agents "
        "posing as farmers to sell produce and capture high margins. FarmDirect integrates a state-level <b>PM-Kisan & Bhulekh Land "
        "Registry Gatekeeper</b> backed by PostgreSQL. Genuine farmers are certified with survey titles; unauthorized entries are blocked (HTTP 403)."
    )
    notice_table = Table([[Paragraph(notice_text, body_style)]], colWidths=[doc.width])
    notice_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor('#f0fdf4')),
        ('BOX', (0, 0), (-1, -1), 1, colors.HexColor('#86efac')),
        ('PADDING', (0, 0), (-1, -1), 6),
    ]))
    elements.append(notice_table)
    elements.append(Spacer(1, 6))

    # Section 1: Valid Verified Farmers
    elements.append(Paragraph("1. Authorized Government Verified Farmer Registry (Valid Credentials)", h2_style))
    
    valid_headers = [
        Paragraph("State / District", cell_header),
        Paragraph("Farmer Name", cell_header),
        Paragraph("PM-Kisan ID", cell_header),
        Paragraph("Aadhaar Number", cell_header),
        Paragraph("Phone", cell_header),
        Paragraph("Land Record (Bhulekh)", cell_header),
        Paragraph("Land Parcel", cell_header),
        Paragraph("KCC Number (Bank)", cell_header),
        Paragraph("Certified Crops", cell_header),
        Paragraph("Bank UPI ID", cell_header),
        Paragraph("Status", cell_header)
    ]

    valid_rows = [
        [
            Paragraph("<b>Madhya Pradesh</b><br/>Sehore (Ashta)", cell_style),
            Paragraph("<b>Ramesh Patel</b>", cell_style),
            Paragraph("PMK-MP-2024-88392", cell_code),
            Paragraph("9823-4512-6701", cell_code),
            Paragraph("9876543210", cell_style),
            Paragraph("Khasra #214/1, Khatauni #88<br/>Kothri Village", cell_style),
            Paragraph("<b>4.50 Acres</b>", cell_bold),
            Paragraph("KCC-SBIN-882190", cell_code),
            Paragraph("Tomatoes, Onions, Wheat", cell_style),
            Paragraph("ramesh.patel@sbi", cell_code),
            Paragraph("<font color='#047857'><b>&check; PASS</b></font>", cell_style)
        ],
        [
            Paragraph("<b>Maharashtra</b><br/>Nashik (Niphad)", cell_style),
            Paragraph("<b>Sunita Bai Deshmukh</b>", cell_style),
            Paragraph("PMK-MH-2024-77120", cell_code),
            Paragraph("4512-8890-3321", cell_code),
            Paragraph("9823456789", cell_style),
            Paragraph("Khasra #108/3, Khatauni #42<br/>Pimpalgaon Baswant", cell_style),
            Paragraph("<b>6.20 Acres</b>", cell_bold),
            Paragraph("KCC-BOI-771209", cell_code),
            Paragraph("Red Onions, Grapes, Pomegranate", cell_style),
            Paragraph("sunita.deshmukh@hdfcbank", cell_code),
            Paragraph("<font color='#047857'><b>&check; PASS</b></font>", cell_style)
        ],
        [
            Paragraph("<b>Andhra Pradesh</b><br/>Guntur (Tenali)", cell_style),
            Paragraph("<b>Naveen Reddy</b>", cell_style),
            Paragraph("PMK-AP-2024-11044", cell_code),
            Paragraph("7712-4433-9012", cell_code),
            Paragraph("9100977665", cell_style),
            Paragraph("Khasra #331/2, Khatauni #19<br/>Chilakaluripet", cell_style),
            Paragraph("<b>3.80 Acres</b>", cell_bold),
            Paragraph("KCC-ANDHRA-9901", cell_code),
            Paragraph("Green Chillies, Turmeric, Cotton", cell_style),
            Paragraph("naveen.reddy@icici", cell_code),
            Paragraph("<font color='#047857'><b>&check; PASS</b></font>", cell_style)
        ],
        [
            Paragraph("<b>Punjab</b><br/>Ludhiana (Samrala)", cell_style),
            Paragraph("<b>Harpreet Singh</b>", cell_style),
            Paragraph("PMK-PB-2024-99301", cell_code),
            Paragraph("3301-8844-1290", cell_code),
            Paragraph("9811233445", cell_style),
            Paragraph("Khasra #512/4, Khatauni #105<br/>Machhiwara", cell_style),
            Paragraph("<b>8.00 Acres</b>", cell_bold),
            Paragraph("KCC-PNB-441290", cell_code),
            Paragraph("Sharbati Wheat, Basmati Rice", cell_style),
            Paragraph("harpreet.singh@pnb", cell_code),
            Paragraph("<font color='#047857'><b>&check; PASS</b></font>", cell_style)
        ],
        [
            Paragraph("<b>Tamil Nadu</b><br/>Erode (Bhavani)", cell_style),
            Paragraph("<b>Kavitha Murugan</b>", cell_style),
            Paragraph("PMK-TN-2024-44211", cell_code),
            Paragraph("6612-9900-5544", cell_code),
            Paragraph("9443011223", cell_style),
            Paragraph("Khasra #89/1, Khatauni #63<br/>Anthiyur", cell_style),
            Paragraph("<b>5.00 Acres</b>", cell_bold),
            Paragraph("KCC-CANARA-1122", cell_code),
            Paragraph("Turmeric, Coconut, Sweet Corn", cell_style),
            Paragraph("kavitha.murugan@oksbi", cell_code),
            Paragraph("<font color='#047857'><b>&check; PASS</b></font>", cell_style)
        ]
    ]

    col_widths_valid = [62, 68, 75, 68, 48, 90, 38, 72, 78, 76, 45]
    table_valid = Table([valid_headers] + valid_rows, colWidths=col_widths_valid)
    table_valid.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#065f46')),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#cbd5e1')),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#f8fafc')]),
        ('TOPPADDING', (0, 0), (-1, -1), 4),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
    ]))
    elements.append(table_valid)
    elements.append(Spacer(1, 8))

    # Section 2: Rejected Middlemen Test Cases
    elements.append(Paragraph("2. Middleman / Commercial Broker Test Scenarios (Rejected by Security Engine)", h2_style))

    invalid_headers = [
        Paragraph("Test Scenario", cell_header),
        Paragraph("Input Value (Farmer ID / Aadhaar)", cell_header),
        Paragraph("System Endpoint", cell_header),
        Paragraph("HTTP Status", cell_header),
        Paragraph("Protection Enforcement & Result", cell_header)
    ]

    invalid_rows = [
        [
            Paragraph("<b>Fake Commission Agent</b>", cell_style),
            Paragraph("FAKE-BROKER-999", cell_danger),
            Paragraph("POST /api/auth/verify-govt-farmer", cell_code),
            Paragraph("<font color='#b91c1c'><b>403 Forbidden</b></font>", cell_style),
            Paragraph("Registration Blocked &bull; Red Middleman Alert shown &bull; Produce listing restricted", cell_style)
        ],
        [
            Paragraph("<b>Unregistered Mandi Broker</b>", cell_style),
            Paragraph("TRADER-MANDI-102", cell_danger),
            Paragraph("POST /api/auth/verify-govt-farmer", cell_code),
            Paragraph("<font color='#b91c1c'><b>403 Forbidden</b></font>", cell_style),
            Paragraph("Land registry mismatch &bull; Commercial broker rejected", cell_style)
        ],
        [
            Paragraph("<b>Fabricated Aadhaar Number</b>", cell_style),
            Paragraph("0000-1111-2222", cell_danger),
            Paragraph("POST /api/auth/verify-govt-farmer", cell_code),
            Paragraph("<font color='#b91c1c'><b>403 Forbidden</b></font>", cell_style),
            Paragraph("UIDAI & Bhulekh identity not found &bull; Registration halted", cell_style)
        ]
    ]

    col_widths_invalid = [110, 100, 140, 75, 310]
    table_invalid = Table([invalid_headers] + invalid_rows, colWidths=col_widths_invalid)
    table_invalid.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#991b1b')),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#fca5a5')),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#fef2f2')]),
        ('TOPPADDING', (0, 0), (-1, -1), 4),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
    ]))
    elements.append(table_invalid)
    elements.append(Spacer(1, 8))

    # Jury Script Box
    script_text = (
        "<b>30-Second Demonstration Script for SIH Judges:</b><br/>"
        "1. Open <b>Login / Register</b> &rarr; <b>Farmer Gateway</b> &rarr; <b>Register</b>.<br/>"
        "2. Complete OTP Step &rarr; Advance to <b>Step 2 (Government Land Registry Gatekeeper)</b>.<br/>"
        "3. <b>Demonstrate Rejection:</b> Click <code>🚫 Test Fake Middleman</code> &rarr; Show judges the red <b>Middleman Rejection Card</b> (HTTP 403).<br/>"
        "4. <b>Demonstrate Approval:</b> Click <code>🌾 Ramesh Patel (MP - 4.5 Ac)</code> &rarr; System certifies land survey record (Khasra #214/1, 4.5 Acres, Sehore, MP) and awards the official <b>Government Verified Landholder</b> badge!"
    )
    script_table = Table([[Paragraph(script_text, body_style)]], colWidths=[doc.width])
    script_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#f8fafc')),
        ('BOX', (0, 0), (-1, -1), 1, colors.HexColor('#cbd5e1')),
        ('PADDING', (0, 0), (-1, -1), 6),
    ]))
    elements.append(script_table)

    doc.build(elements)
    print(f"Successfully generated PDF: {pdf_path}")

if __name__ == "__main__":
    generate_pdf()

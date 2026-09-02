import os
import json
from reportlab.lib import colors
from reportlab.lib.pagesizes import letter, landscape
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable, KeepTogether
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle

def generate_admin_pdf():
    pdf_filename = "FarmDirect_Admin_Logistics_Officers_Registry.pdf"
    pdf_path = os.path.join(os.getcwd(), pdf_filename)
    
    # 0.35 inch margins in landscape (792 x 612 pt) -> printable width 744 pt
    doc = SimpleDocTemplate(
        pdf_path,
        pagesize=landscape(letter),
        leftMargin=24,
        rightMargin=24,
        topMargin=26,
        bottomMargin=24
    )

    styles = getSampleStyleSheet()
    
    # Custom Palette & Styles
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=17,
        leading=21,
        textColor=colors.HexColor('#78350f'), # Deep Amber
        spaceAfter=2
    )
    
    subtitle_style = ParagraphStyle(
        'DocSubTitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=12,
        textColor=colors.HexColor('#475569'),
        spaceAfter=8
    )

    h2_style = ParagraphStyle(
        'SectionH2',
        parent=styles['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=11,
        leading=14,
        textColor=colors.HexColor('#1e293b'),
        spaceBefore=8,
        spaceAfter=3
    )

    cell_style = ParagraphStyle(
        'TableCell',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=7.5,
        leading=9.5,
        textColor=colors.HexColor('#1e293b')
    )

    cell_email = ParagraphStyle(
        'TableCellEmail',
        parent=cell_style,
        fontName='Helvetica',
        fontSize=7,
        leading=9,
        textColor=colors.HexColor('#1e40af')
    )

    cell_bold = ParagraphStyle(
        'TableCellBold',
        parent=cell_style,
        fontName='Helvetica-Bold',
        textColor=colors.HexColor('#78350f')
    )

    cell_code = ParagraphStyle(
        'TableCellCode',
        parent=cell_style,
        fontName='Courier-Bold',
        fontSize=7.5,
        leading=9.5,
        textColor=colors.HexColor('#b45309')
    )

    cell_phone = ParagraphStyle(
        'TableCellPhone',
        parent=cell_style,
        fontName='Courier-Bold',
        fontSize=7.5,
        leading=9.5,
        textColor=colors.HexColor('#047857')
    )

    cell_header = ParagraphStyle(
        'TableHeader',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=7.8,
        leading=10,
        textColor=colors.white
    )

    badge_active = ParagraphStyle(
        'BadgeActive',
        parent=cell_style,
        fontName='Helvetica-Bold',
        fontSize=7,
        leading=9,
        textColor=colors.HexColor('#065f46')
    )

    badge_tier = ParagraphStyle(
        'BadgeTier',
        parent=cell_style,
        fontName='Helvetica-Bold',
        fontSize=6.8,
        leading=8.5,
        textColor=colors.HexColor('#334155')
    )

    story = []

    # 1. Header Banner with Amber Branding
    header_data = [
        [
            Paragraph("<b>FARMDIRECT CENTRAL OPERATIONS COMMAND</b><br/><font size='7.5' color='#92400e'>NATIONAL ESCROW, LOGISTICS & FLEET AUDIT DIRECTORY</font>", title_style),
            Paragraph("<b>CONFIDENTIAL / INTERNAL USE</b><br/><font size='7' color='#64748b'>Database Ref: <code>postgresql://farmdirect/admins</code><br/>Auth Protocol: <b>Admin ID + Phone OTP</b></font>", ParagraphStyle('RAlign', parent=subtitle_style, alignment=2))
        ]
    ]
    header_table = Table(header_data, colWidths=[484, 260])
    header_table.setStyle(TableStyle([
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('BOTTOMPADDING', (0,0), (-1,-1), 0),
        ('TOPPADDING', (0,0), (-1,-1), 0),
    ]))
    story.append(header_table)
    
    story.append(HRFlowable(width="100%", thickness=2, color=colors.HexColor('#d97706'), spaceAfter=8, spaceBefore=4))

    # 2. Executive Stat Cards (Key Metrics)
    stats_data = [
        [
            Paragraph("<b>Total Registered Admins</b><br/><font size='12' color='#b45309'><b>4 Officers</b></font>", cell_style),
            Paragraph("<b>System Clearance Tier</b><br/><font size='12' color='#047857'><b>Tier-1 / Super Admin</b></font>", cell_style),
            Paragraph("<b>Operational Dispatch Zones</b><br/><font size='12' color='#1e40af'><b>4 National Corridors</b></font>", cell_style),
            Paragraph("<b>Access Enforcement Gate</b><br/><font size='12' color='#b91c1c'><b>Strict Phone + OTP Only</b></font>", cell_style)
        ]
    ]
    stats_table = Table(stats_data, colWidths=[186, 186, 186, 186])
    stats_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#fef3c7')),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#fde68a')),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor('#fde68a')),
        ('TOPPADDING', (0,0), (-1,-1), 5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
        ('LEFTPADDING', (0,0), (-1,-1), 8),
        ('RIGHTPADDING', (0,0), (-1,-1), 8),
    ]))
    story.append(stats_table)
    story.append(Spacer(1, 8))

    # 3. Main Master Database Entries Table
    story.append(Paragraph("<b>Certified Administrative & Logistics Officers Registry (Live PostgreSQL Table: <code>admins</code>)</b>", h2_style))
    story.append(Paragraph("The following administrative personnel are authorized to log in via their Admin ID and 10-digit registered mobile number. Unregistered entries are automatically blocked by the gatekeeper.", subtitle_style))

    table_data = [
        [
            Paragraph("ID", cell_header),
            Paragraph("Admin ID", cell_header),
            Paragraph("Officer Full Name", cell_header),
            Paragraph("Registered Phone", cell_header),
            Paragraph("Official Email", cell_header),
            Paragraph("Designation & Duty Post", cell_header),
            Paragraph("Operational Wing", cell_header),
            Paragraph("Operational Zone", cell_header),
            Paragraph("Clearance Tier", cell_header),
            Paragraph("Status", cell_header)
        ]
    ]

    admin_records = [
        {
            "id": "1",
            "admin_id": "ADM-8821",
            "full_name": "Gurpreet Singh",
            "phone": "98112 33445",
            "email": "gurpreet.ops@farmdirect.in",
            "designation": "Chief Fleet Operations Controller",
            "department": "Logistics & Real-time Route Operations",
            "zone": "Central & North India Hubs",
            "access_level": "SUPER_ADMIN",
            "status": "ACTIVE"
        },
        {
            "id": "2",
            "admin_id": "LOG-OPS-101",
            "full_name": "Rajesh Sharma",
            "phone": "98230 45678",
            "email": "rajesh.logistics@farmdirect.in",
            "designation": "Regional Cold-Chain Dispatch Director",
            "department": "Perishables & Reefer Fleet Dispatch",
            "zone": "West Zone (Nashik & Nagpur Agro-Corridor)",
            "access_level": "FLEET_CONTROLLER",
            "status": "ACTIVE"
        },
        {
            "id": "3",
            "admin_id": "ADM-4019",
            "full_name": "Ananya Sen",
            "phone": "94431 98765",
            "email": "ananya.audit@farmdirect.in",
            "designation": "Escrow Settlement & Audit Controller",
            "department": "Financial Settlement & Payout Approvals",
            "zone": "National Escrow Clearing Unit",
            "access_level": "FINANCE_AUDIT",
            "status": "ACTIVE"
        },
        {
            "id": "4",
            "admin_id": "ADM-5502",
            "full_name": "Vikramaditya Roy",
            "phone": "91009 12345",
            "email": "vikram.compliance@farmdirect.in",
            "designation": "Surveillance & Anti-Middleman Enforcement Lead",
            "department": "Registry Compliance & Fraud Prevention",
            "zone": "National Agricultural Gatekeeping",
            "access_level": "SECURITY_ENFORCER",
            "status": "ACTIVE"
        }
    ]

    for row in admin_records:
        table_data.append([
            Paragraph(f"<b>#{row['id']}</b>", cell_style),
            Paragraph(row['admin_id'], cell_code),
            Paragraph(f"<b>{row['full_name']}</b>", cell_bold),
            Paragraph(f"+91 {row['phone']}", cell_phone),
            Paragraph(row['email'], cell_email),
            Paragraph(row['designation'], cell_style),
            Paragraph(row['department'], cell_style),
            Paragraph(row['zone'], cell_style),
            Paragraph(row['access_level'], badge_tier),
            Paragraph("ACTIVE", badge_active)
        ])

    col_widths = [18, 56, 78, 68, 108, 114, 114, 94, 60, 34]
    registry_table = Table(table_data, colWidths=col_widths, repeatRows=1)
    registry_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#92400e')), # Deep Amber Header
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#e2e8f0')),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#b45309')),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ('LEFTPADDING', (0,0), (-1,-1), 3),
        ('RIGHTPADDING', (0,0), (-1,-1), 3),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, colors.HexColor('#fffbeb')]),
    ]))
    story.append(registry_table)
    story.append(Spacer(1, 12))

    # 4. Security & Compliance Protocol Notes
    notes_data = [
        [
            Paragraph("""
            <b>[SECURITY NOTICE] Administrative Security & Authentication Protocol:</b><br/>
            1. <b>Zero Public Registration:</b> Public registration for admin roles is permanently disabled to prevent unauthorized fleet interference.<br/>
            2. <b>Two-Factor Gatekeeper:</b> Authentication requires both an authorized <b>Admin ID / Badge</b> and matching <b>10-digit registered mobile phone</b>.<br/>
            3. <b>Dynamic OTP Verification:</b> A 6-digit one-time passcode is issued in real-time. Unauthorized credentials trigger immediate access denial.
            """, ParagraphStyle('NoteStyle', parent=styles['Normal'], fontSize=7.5, leading=10.5, textColor=colors.HexColor('#78350f')))
        ]
    ]
    notes_table = Table(notes_data, colWidths=[740])
    notes_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#fef9c3')),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#fde047')),
        ('TOPPADDING', (0,0), (-1,-1), 6),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
        ('LEFTPADDING', (0,0), (-1,-1), 8),
        ('RIGHTPADDING', (0,0), (-1,-1), 8),
    ]))
    story.append(notes_table)
    story.append(Spacer(1, 10))

    # 5. Sign-off & Audit Seal
    sign_data = [
        [
            Paragraph("<b>DATABASE CHECKSUM & COMPLIANCE</b><br/><font size='7' color='#64748b'>SHA-256: <code>e84f93bc0912fa874c93a0b12759e6</code><br/>PostgreSQL Table: <code>public.admins</code> | Status: Synchronized</font>", cell_style),
            Paragraph("<b>ISSUED BY:</b><br/><font size='7' color='#64748b'>FarmDirect Central Security & Operations Directorate<br/>Generated: September 2026 | All Rights Reserved</font>", ParagraphStyle('SignR', parent=cell_style, alignment=2))
        ]
    ]
    sign_table = Table(sign_data, colWidths=[420, 320])
    sign_table.setStyle(TableStyle([
        ('LINEABOVE', (0,0), (-1,-1), 0.5, colors.HexColor('#cbd5e1')),
        ('TOPPADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(sign_table)

    doc.build(story)
    print("SUCCESS: Generated PDF at " + str(pdf_path))
    print("File size: " + str(os.path.getsize(pdf_path)) + " bytes")

if __name__ == '__main__':
    generate_admin_pdf()

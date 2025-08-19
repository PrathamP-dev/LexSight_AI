export type Document = {
  id: string;
  name: string;
  type: 'contract' | 'report' | 'proposal';
  content: string;
  createdAt: string;
};

export const documents: Document[] = [
  {
    id: 'doc-1',
    name: 'MSA Agreement 2024',
    type: 'contract',
    createdAt: '2024-05-15',
    content: `
MASTER SERVICES AGREEMENT

This Master Services Agreement ("Agreement") is made and entered into as of May 15, 2024 ("Effective Date"), by and between Innovate Corp., a Delaware corporation ("Client"), and Solutions LLC, a California limited liability company ("Provider").

1.  SERVICES.
    Provider agrees to perform the services ("Services") as described in one or more Statements of Work ("SOW") to be mutually agreed upon and signed by both parties. Each SOW shall be incorporated into and become a part of this Agreement. In the event of any conflict between the terms of this Agreement and any SOW, the terms of this Agreement shall prevail unless the SOW expressly states otherwise.

2.  TERM AND TERMINATION.
    This Agreement shall commence on the Effective Date and continue until terminated by either party with ninety (90) days written notice. Either party may terminate this Agreement for cause if the other party breaches any material provision of this Agreement and fails to cure such breach within thirty (30) days of receipt of written notice. Upon termination, Client shall pay Provider for all Services rendered and expenses incurred up to the date of termination.

3.  CONFIDENTIALITY.
    Each party (the "Receiving Party") agrees to hold in confidence all confidential and proprietary information ("Confidential Information") disclosed by the other party (the "Disclosing Party"). The Receiving Party shall not use the Confidential Information for any purpose other than to perform its obligations under this Agreement. This obligation of confidentiality shall survive the termination of this Agreement for a period of five (5) years. Information shall not be considered Confidential Information if it is publicly known, already in the Receiving Party’s possession, or independently developed.

4.  INTELLECTUAL PROPERTY.
    All pre-existing intellectual property shall remain the property of the originating party. Client shall own all right, title, and interest in and to all deliverables, work product, and other materials developed by Provider for Client in the course of performing the Services ("Deliverables"). Provider hereby assigns to Client all of its rights in the Deliverables.

5.  LIMITATION OF LIABILITY.
    IN NO EVENT SHALL EITHER PARTY BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, OR CONSEQUENTIAL DAMAGES, INCLUDING BUT NOT LIMITED TO LOST PROFITS, ARISING OUT OF OR IN CONNECTION WITH THIS AGREEMENT, WHETHER OR NOT SUCH PARTY HAS BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES. THE TOTAL CUMULATIVE LIABILITY OF EITHER PARTY SHALL NOT EXCEED THE TOTAL FEES PAID BY CLIENT TO PROVIDER UNDER THE APPLICABLE SOW.
`,
  },
  {
    id: 'doc-2',
    name: 'Q2 Financial Report',
    type: 'report',
    createdAt: '2024-07-01',
    content: `
QUARTERLY FINANCIAL REPORT - Q2 2024

This report provides a summary of the financial performance for the second quarter ending June 30, 2024.

Executive Summary:
The company experienced strong growth this quarter, with revenues up 15% compared to Q1 2024. Net profit margins increased by 2%, driven by operational efficiencies and successful cost-cutting initiatives.

Key Financials:
- Total Revenue: $5.2 Million
- Cost of Goods Sold: $1.8 Million
- Gross Profit: $3.4 Million
- Operating Expenses: $1.5 Million
- Net Income: $1.9 Million

Outlook for Q3:
We project continued growth in the third quarter, with a focus on expanding into new international markets. Investments in R&D will increase by 10% to fuel innovation and maintain our competitive edge.
`,
  },
  {
    id: 'doc-3',
    name: 'Project Phoenix Proposal',
    type: 'proposal',
    createdAt: '2024-06-20',
    content: `
PROPOSAL: PROJECT PHOENIX

Project Overview:
Project Phoenix is a strategic initiative to overhaul our legacy software platform. The project will involve a complete re-architecture of the backend systems, a redesign of the user interface, and migration to a cloud-native infrastructure.

Goals:
1. Improve system scalability and reliability by 500%.
2. Reduce maintenance costs by 40%.
3. Enhance user experience and satisfaction.

Timeline & Milestones:
- Phase 1 (Discovery & Planning): 4 weeks
- Phase 2 (Backend Development): 12 weeks
- Phase 3 (UI/UX Redesign): 8 weeks
- Phase 4 (Integration & Testing): 6 weeks
- Phase 5 (Deployment): 2 weeks

Budget:
The estimated total budget for Project Phoenix is $750,000. A detailed cost breakdown is attached as Appendix A. We request approval to proceed with Phase 1.
`,
  },
];

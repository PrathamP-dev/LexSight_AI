export type Document = {
  id: string;
  name: string;
  type: 'contract' | 'report' | 'proposal';
  content: string;
  createdAt: string; // ISO string format
};

const sampleContract = `
Master Services Agreement

This Master Services Agreement ("Agreement") is made and entered into as of the Effective Date by and between Client, and Service Provider.

1. Services. Service Provider agrees to perform the services ("Services") as described in one or more Statements of Work ("SOWs") to be issued by Client and agreed to by Service Provider.

2. Term. The term of this Agreement shall commence on the Effective Date and shall continue in full force and effect until terminated as provided herein.

3. Fees and Payment. Client will pay Service Provider the fees for the Services as set forth in the applicable SOW. Unless otherwise agreed, invoices are due and payable within 30 days of receipt.

4. Confidentiality. Each party (the "Receiving Party") agrees that it shall not use for its own benefit or disclose to any third party any Confidential Information of the other party (the "Disclosing Party").
   4.1. Definition. "Confidential Information" means any information, technical data, or know-how, including, but not limited to, that which relates to research, products, services, customers, markets, software, developments, inventions, processes, designs, drawings, engineering, hardware configuration information, marketing or finances.
   4.2. Exclusions. Confidential Information does not include information which: (i) is known to the Receiving Party at the time of disclosure, (ii) has become publicly known and made generally available through no wrongful act of the Receiving Party, or (iii) has been rightfully received by the Receiving Party from a third party who is authorized to make such disclosure.

5. Intellectual Property. Service Provider shall retain all right, title and interest in and to its pre-existing intellectual property. Client shall own all right, title and interest in and to the deliverables created by Service Provider specifically for Client under this Agreement.

6. Limitation of Liability. IN NO EVENT SHALL EITHER PARTY BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL OR CONSEQUENTIAL DAMAGES, INCLUDING, WITHOUT LIMITATION, DAMAGES FOR LOSS OF PROFITS, DATA OR USE, INCURRED BY EITHER PARTY OR ANY THIRD PARTY, WHETHER IN AN ACTION IN CONTRACT OR TORT, EVEN IF THE OTHER PARTY HAS BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.

7. Termination. This Agreement may be terminated by either party upon thirty (30) days written notice to the other party. Upon termination, Client shall pay Service Provider for all Services performed up to the effective date of termination.

8. Governing Law. This Agreement shall be governed by and construed in accordance with the laws of the State of California, without regard to its conflict of laws principles.
`;

export const sampleDocuments: Document[] = [
  {
    id: 'doc_1',
    name: 'Master Services Agreement.txt',
    type: 'contract',
    content: sampleContract,
    createdAt: new Date('2023-10-26T10:00:00Z').toISOString(),
  },
  {
    id: 'doc_2',
    name: 'Q3 Financial Report.txt',
    type: 'report',
    content: 'This is the content for the Q3 Financial Report. It contains detailed financial data and analysis for the third quarter.',
    createdAt: new Date('2023-09-30T15:30:00Z').toISOString(),
  },
  {
    id: 'doc_3',
    name: 'Project Phoenix Proposal.txt',
    type: 'proposal',
    content: 'This document outlines the proposal for Project Phoenix, including scope, timeline, and budget considerations.',
    createdAt: new Date('2023-11-05T11:20:00Z').toISOString(),
  },
];

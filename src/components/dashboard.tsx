'use client';

import { useState, useTransition, useRef, useEffect, useCallback } from 'react';
import {
  FileText,
  FileBarChart2,
  FilePlus2,
  Shield,
  Loader2,
  Sparkles,
  Upload,
} from 'lucide-react';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarInset,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { documents, type Document } from '@/lib/data';
import { handleSummarizeClause, handleAnalyzeRisk } from '@/lib/actions';
import { LexiDocLogo } from './icons';
import { useToast } from '@/hooks/use-toast';

const documentIcons = {
  contract: <FileText />,
  report: <FileBarChart2 />,
  proposal: <FilePlus2 />,
};

export function Dashboard() {
  const [isSummarizePending, startSummarizeTransition] = useTransition();
  const [isRiskPending, startRiskTransition] = useTransition();
  
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(documents[0]);
  const [selectedText, setSelectedText] = useState('');
  const [summary, setSummary] = useState('');
  const [riskAnalysis, setRiskAnalysis] = useState('');
  const [activeTab, setActiveTab] = useState('summary');
  const textContainerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const handleTextSelection = useCallback(() => {
    const text = window.getSelection()?.toString().trim() ?? '';
    if (text && text.length > 20) { // Require a minimum length
      setSelectedText(text);
      setSummary(''); // Clear previous summary
      setActiveTab('summary');
    }
  }, []);

  useEffect(() => {
    const container = textContainerRef.current;
    if (container) {
      container.addEventListener('mouseup', handleTextSelection);
      return () => {
        container.removeEventListener('mouseup', handleTextSelection);
      };
    }
  }, [selectedDoc, handleTextSelection]);

  const onSummarize = () => {
    if (!selectedText) {
        toast({
            title: "No Text Selected",
            description: "Please select a portion of the document text to summarize.",
            variant: "destructive",
        });
        return;
    }
    startSummarizeTransition(async () => {
      const result = await handleSummarizeClause(selectedText);
      setSummary(result.summary);
    });
  };

  const onAnalyzeRisk = () => {
    if (!selectedDoc) return;
    setRiskAnalysis(''); // Clear previous analysis
    setActiveTab('risk');
    startRiskTransition(async () => {
      const result = await handleAnalyzeRisk(selectedDoc.content);
      setRiskAnalysis(result.riskSummary);
    });
  };

  const selectDocument = (doc: Document) => {
    setSelectedDoc(doc);
    setSelectedText('');
    setSummary('');
    setRiskAnalysis('');
    setActiveTab('summary');
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <Sidebar>
          <SidebarHeader>
            <div className="flex items-center gap-2">
              <LexiDocLogo className="size-7 text-primary" />
              <h2 className="font-headline text-2xl font-bold tracking-tight group-data-[collapsible=icon]:hidden">
                LexiDoc
              </h2>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              {documents.map((doc) => (
                <SidebarMenuItem key={doc.id}>
                  <SidebarMenuButton
                    onClick={() => selectDocument(doc)}
                    isActive={selectedDoc?.id === doc.id}
                    tooltip={doc.name}
                  >
                    {documentIcons[doc.type]}
                    <span>{doc.name}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter>
            <Button variant="default" className="w-full">
              <Upload className="mr-2 size-4" />
              <span className="group-data-[collapsible=icon]:hidden">Upload Document</span>
            </Button>
          </SidebarFooter>
        </Sidebar>

        <SidebarInset className="flex flex-col">
          {selectedDoc ? (
            <div className="grid md:grid-cols-2 flex-1 gap-4 p-4 md:p-6">
              <div className="flex flex-col h-full max-h-[calc(100vh-3rem)]">
                <header className="flex items-center justify-between pb-4">
                  <div>
                    <h1 className="font-headline text-2xl font-bold">{selectedDoc.name}</h1>
                    <p className="text-sm text-muted-foreground">{selectedDoc.type} - Created on {selectedDoc.createdAt}</p>
                  </div>
                  <SidebarTrigger className="md:hidden" />
                </header>
                <Card className="flex-1 flex flex-col shadow-md">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-lg font-headline">Document Text</CardTitle>
                    {selectedDoc.type === 'contract' && (
                        <Button size="sm" onClick={onAnalyzeRisk} disabled={isRiskPending}>
                            {isRiskPending ? (
                                <Loader2 className="mr-2 size-4 animate-spin" />
                            ) : (
                                <Shield className="mr-2 size-4" />
                            )}
                            Analyze for Risks
                        </Button>
                    )}
                  </CardHeader>
                  <Separator />
                  <CardContent className="p-0 flex-1">
                    <ScrollArea className="h-full">
                      <div ref={textContainerRef} className="p-6 text-sm leading-relaxed whitespace-pre-wrap selection:bg-accent/30 font-body">
                        {selectedDoc.content}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </div>

              <div className="flex flex-col h-full max-h-[calc(100vh-3rem)]">
                <header className="flex items-center h-[72px] pb-4">
                    <h1 className="font-headline text-2xl font-bold">AI Analysis</h1>
                </header>
                <Card className="flex-1 flex flex-col shadow-md">
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
                        <TabsList className="m-4">
                            <TabsTrigger value="summary">Clause Summary</TabsTrigger>
                            <TabsTrigger value="risk" disabled={selectedDoc.type !== 'contract'}>Risk Analysis</TabsTrigger>
                        </TabsList>
                        <Separator />
                        <TabsContent value="summary" className="flex-1 m-0">
                            <div className="p-4 flex flex-col h-full">
                                <div className="mb-4">
                                    <h3 className="font-headline text-lg">Summarize Clause</h3>
                                    <p className="text-sm text-muted-foreground">Highlight text in the document to select a clause.</p>
                                </div>
                                {selectedText && (
                                    <Card className="mb-4 bg-primary/5 border-primary/20">
                                        <CardContent className="p-4 text-sm text-primary/80 italic">
                                            "{selectedText.substring(0, 150)}{selectedText.length > 150 ? '...' : ''}"
                                        </CardContent>
                                    </Card>
                                )}
                                <Button onClick={onSummarize} disabled={isSummarizePending || !selectedText}>
                                    {isSummarizePending ? (
                                        <Loader2 className="mr-2 size-4 animate-spin" />
                                    ) : (
                                        <Sparkles className="mr-2 size-4" />
                                    )}
                                    Generate Summary
                                </Button>
                                {(summary || isSummarizePending) && (
                                     <Card className="mt-4 flex-1">
                                        <CardContent className="p-4 h-full">
                                            <ScrollArea className="h-[300px]">
                                                {isSummarizePending ? (
                                                     <div className="flex items-center justify-center h-full text-muted-foreground">
                                                        <Loader2 className="mr-2 size-4 animate-spin" />
                                                        <span>Generating summary...</span>
                                                    </div>
                                                ) : (
                                                    <p className="whitespace-pre-wrap text-sm">{summary}</p>
                                                )}
                                            </ScrollArea>
                                        </CardContent>
                                    </Card>
                                )}
                            </div>
                        </TabsContent>
                        <TabsContent value="risk" className="flex-1 m-0">
                             <div className="p-4 flex flex-col h-full">
                                {isRiskPending && (
                                    <div className="flex items-center justify-center h-full">
                                        <Loader2 className="mr-2 size-8 animate-spin text-primary" />
                                        <span className="font-headline">Analyzing contract...</span>
                                    </div>
                                )}
                                {riskAnalysis && !isRiskPending && (
                                     <Card className="flex-1">
                                        <CardHeader>
                                            <CardTitle className="font-headline flex items-center gap-2"><Shield className="text-destructive"/>Risk Analysis Report</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <ScrollArea className="h-[400px] md:h-[calc(100vh-18rem)]">
                                                <p className="whitespace-pre-wrap text-sm">{riskAnalysis}</p>
                                            </ScrollArea>
                                        </CardContent>
                                    </Card>
                                )}
                                {!riskAnalysis && !isRiskPending && (
                                    <div className="text-center text-muted-foreground mt-8">
                                        Click "Analyze for Risks" to generate a report for this contract.
                                    </div>
                                )}
                             </div>
                        </TabsContent>
                    </Tabs>
                </Card>
              </div>
            </div>
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center p-4">
              <div className="flex items-center gap-4">
                <LexiDocLogo className="h-16 w-16 text-primary" />
                <h1 className="font-headline text-5xl font-bold">Welcome to LexiDoc</h1>
              </div>
              <p className="max-w-md text-lg text-muted-foreground">
                Your AI-powered document assistant. Select a document from the sidebar to get started, or upload a new one.
              </p>
               <SidebarTrigger className="md:hidden" />
            </div>
          )}
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}

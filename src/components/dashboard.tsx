'use client';

import { useState, useTransition, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  FileText,
  FileBarChart2,
  FilePlus2,
  Shield,
  Loader2,
  Sparkles,
  Upload,
  Trash2,
  Moon,
  Sun,
  Download,
  User,
  LogOut,
  Plus,
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
  SidebarMenuAction,
  SidebarSeparator,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { sampleDocuments, type Document } from '@/lib/data';
import { handleSummarizeClause, handleAnalyzeRisk } from '@/lib/actions';
import { LegalMindLogo } from './icons';
import { useToast } from '@/hooks/use-toast';
import { useTheme } from 'next-themes';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";


const documentIcons = {
  contract: <FileText />,
  report: <FileBarChart2 />,
  proposal: <FilePlus2 />,
};

function ThemeToggle() {
    const { setTheme, theme } = useTheme();
    
    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
        >
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
        </Button>
    )
}

export function Dashboard() {
  const [isSummarizePending, startSummarizeTransition] = useTransition();
  const [isRiskPending, startRiskTransition] = useTransition();
  
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoadingDocs, setIsLoadingDocs] = useState(true);
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
  const [selectedText, setSelectedText] = useState('');
  const [summary, setSummary] = useState('');
  const [riskAnalysis, setRiskAnalysis] = useState('');
  const [activeTab, setActiveTab] = useState('summary');
  const textContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const loadDocuments = useCallback(() => {
    setIsLoadingDocs(true);
    // In a real app, this would fetch from a database
    // For now, we use sample data and session storage
    const storedDocs = JSON.parse(sessionStorage.getItem('documents') || 'null');
    const allDocs = storedDocs ? storedDocs : [...sampleDocuments];
    setDocuments(allDocs);

    if (allDocs.length > 0) {
        // Check if there's a recently uploaded file or pasted text
      const uploadedFileRaw = sessionStorage.getItem('uploadedFile');
      const pastedText = sessionStorage.getItem('pastedText');

      let newDoc: Document | null = null;
      if (uploadedFileRaw) {
        const uploadedFile = JSON.parse(uploadedFileRaw);
        newDoc = {
          id: `doc_${Date.now()}`,
          name: uploadedFile.name,
          type: 'contract',
          content: uploadedFile.content,
          createdAt: new Date().toISOString(),
        };
        sessionStorage.removeItem('uploadedFile');
      } else if (pastedText) {
        newDoc = {
          id: `doc_${Date.now()}`,
          name: `Pasted Document ${new Date().toLocaleDateString()}`,
          type: 'contract',
          content: pastedText,
          createdAt: new Date().toISOString(),
        };
        sessionStorage.removeItem('pastedText');
      }
      
      if (newDoc) {
        const updatedDocs = [newDoc, ...allDocs];
        setDocuments(updatedDocs);
        setSelectedDoc(newDoc);
        sessionStorage.setItem('documents', JSON.stringify(updatedDocs));
      } else if (!selectedDoc || !allDocs.some(d => d.id === selectedDoc.id)) {
        setSelectedDoc(allDocs[0]);
      }
    } else {
        setSelectedDoc(null);
    }
    
    setIsLoadingDocs(false);
  }, [selectedDoc]);

  useEffect(() => {
    loadDocuments();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  const handleTextSelection = useCallback(() => {
    const text = window.getSelection()?.toString().trim() ?? '';
    if (text && text.length > 20) { 
      setSelectedText(text);
      setSummary(''); 
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
      if (result.error) {
          toast({ title: "Error", description: result.error, variant: "destructive" });
          setSummary('');
      } else {
        setSummary(result.summary!);
      }
    });
  };

  const onAnalyzeRisk = () => {
    if (!selectedDoc) return;
    setRiskAnalysis(''); 
    setActiveTab('risk');
    startRiskTransition(async () => {
      const result = await handleAnalyzeRisk(selectedDoc.content);
      if (result.error) {
        toast({ title: "Error", description: result.error, variant: "destructive" });
        setRiskAnalysis('');
      } else {
        setRiskAnalysis(result.riskSummary!);
        setActiveTab('risk');
      }
    });
  };

  const selectDocument = (doc: Document) => {
    setSelectedDoc(doc);
    setSelectedText('');
    setSummary('');
    setRiskAnalysis('');
    setActiveTab('summary');
  };

  const handleDeleteDocument = async (docId: string) => {
    const updatedDocs = documents.filter(doc => doc.id !== docId);
    setDocuments(updatedDocs);
    sessionStorage.setItem('documents', JSON.stringify(updatedDocs));

    if (selectedDoc?.id === docId) {
      setSelectedDoc(updatedDocs[0] || null);
    }
    toast({
        title: "Document Deleted",
        description: "The document has been removed.",
    });
  };

  const handleFileUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        const newDoc: Document = {
            id: `doc_${Date.now()}`,
            name: file.name,
            type: 'contract',
            content: text,
            createdAt: new Date().toISOString(),
        };
        const updatedDocs = [newDoc, ...documents];
        setDocuments(updatedDocs);
        setSelectedDoc(newDoc);
        sessionStorage.setItem('documents', JSON.stringify(updatedDocs));
        toast({
            title: "Document Uploaded",
            description: `"${file.name}" has been successfully added.`,
        });
      };
      reader.readAsText(file);
    }
    // Reset file input to allow uploading the same file again
    if (fileInputRef.current) {
        fileInputRef.current.value = '';
    }
  };
  
  const handleDownloadReport = () => {
    if (!summary && !riskAnalysis) {
        toast({
            title: "No Content to Download",
            description: "Please generate a summary or risk analysis first.",
            variant: "destructive"
        });
        return;
    }

    let reportContent = `LegalMind AI Analysis Report\n`;
    reportContent += `Document: ${selectedDoc?.name}\n`;
    reportContent += `Generated On: ${new Date().toLocaleString()}\n`;
    reportContent += "========================================\n\n";

    if (summary) {
        reportContent += "--- Clause Summary ---\n";
        reportContent += `Selected Clause: "${selectedText}"\n\n`;
        reportContent += `${summary}\n\n`;
    }

    if (riskAnalysis) {
        reportContent += "--- Risk Analysis ---\n";
        reportContent += `${riskAnalysis}\n\n`;
    }
    
    const blob = new Blob([reportContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `LegalMind_Report_${selectedDoc?.name.replace(/\s/g,"_")}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast({
        title: "Report Downloaded",
        description: "The analysis report has been saved.",
    });
  };

  return (
    <>
      <div className="dark-veil"></div>
      <SidebarProvider>
        <div className="flex min-h-screen relative z-10">
          <Sidebar>
            <SidebarHeader>
              <div className="flex items-center gap-2">
                <LegalMindLogo className="size-7 text-primary" />
                <h2 className="font-headline text-2xl font-bold tracking-tight group-data-[collapsible=icon]:hidden">
                  LegalMind
                </h2>
              </div>
            </SidebarHeader>
            <SidebarContent>
              <SidebarMenu>
                {isLoadingDocs ? (
                  <div className="p-2">
                    <Loader2 className="mx-auto size-6 animate-spin" />
                  </div>
                ) : (
                  documents.map((doc) => (
                    <SidebarMenuItem key={doc.id}>
                      <SidebarMenuButton
                        onClick={() => selectDocument(doc)}
                        isActive={selectedDoc?.id === doc.id}
                        tooltip={doc.name}
                      >
                        {documentIcons[doc.type]}
                        <span>{doc.name}</span>
                      </SidebarMenuButton>
                      <AlertDialog>
                          <AlertDialogTrigger asChild>
                              <SidebarMenuAction showOnHover>
                                  <Trash2 />
                              </SidebarMenuAction>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                              <AlertDialogHeader>
                                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                      This action cannot be undone. This will permanently delete the document "{doc.name}".
                                  </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => handleDeleteDocument(doc.id)}>
                                      Delete
                                  </AlertDialogAction>
                              </AlertDialogFooter>
                          </AlertDialogContent>
                      </AlertDialog>
                    </SidebarMenuItem>
                  ))
                )}
              </SidebarMenu>
            </SidebarContent>
            <SidebarFooter>
              <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                  accept=".pdf,.docx,.txt"
              />
              <Button variant="default" className="w-full mb-2" onClick={handleFileUploadClick}>
                <Upload className="mr-2 size-4" />
                <span className="group-data-[collapsible=icon]:hidden">Upload Document</span>
              </Button>
              <SidebarSeparator />
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                         <Button variant="ghost" className="w-full justify-start h-auto p-2 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:size-8">
                            <div className="flex items-center gap-3">
                                <Avatar className="size-7">
                                    <AvatarImage src="https://github.com/shadcn.png" alt="User" />
                                    <AvatarFallback>U</AvatarFallback>
                                </Avatar>
                                <div className="text-left group-data-[collapsible=icon]:hidden">
                                    <p className="text-sm font-medium">Test User</p>
                                    <p className="text-xs text-muted-foreground">user@example.com</p>
                                </div>
                            </div>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56 mb-2" side="top" align="start">
                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                            <User className="mr-2" />
                            <span>Profile</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <Plus className="mr-2" />
                            <span>Add Account</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <Link href="/login">
                            <DropdownMenuItem>
                                <LogOut className="mr-2" />
                                <span>Log out</span>
                            </DropdownMenuItem>
                        </Link>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarFooter>
          </Sidebar>

          <SidebarInset className="flex flex-col bg-transparent">
            {selectedDoc ? (
              <div className="grid md:grid-cols-2 flex-1 gap-4 p-4 md:p-6">
                <div className="flex flex-col h-full max-h-[calc(100vh-3rem)]">
                  <header className="flex items-center justify-between pb-4">
                    <div className="flex-1">
                      <h1 className="font-headline text-2xl font-bold">{selectedDoc.name}</h1>
                      <p className="text-sm text-muted-foreground">{selectedDoc.type} - Created on {new Date(selectedDoc.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className='flex items-center gap-2'>
                      <ThemeToggle />
                      <SidebarTrigger className="md:hidden" />
                    </div>
                  </header>
                  <Card className="flex-1 flex flex-col shadow-xl bg-card/80 backdrop-blur-sm border-primary/20">
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
                        <div ref={textContainerRef} className="p-6 text-sm leading-relaxed whitespace-pre-wrap font-body">
                          {selectedDoc.content}
                        </div>
                      </ScrollArea>
                    </CardContent>
                  </Card>
                </div>

                <div className="flex flex-col h-full max-h-[calc(100vh-3rem)]">
                   <header className="flex items-center justify-between h-[72px] pb-4">
                      <h1 className="font-headline text-2xl font-bold">AI Analysis</h1>
                       <Button variant="outline" size="sm" onClick={handleDownloadReport} disabled={!summary && !riskAnalysis}>
                          <Download className="mr-2 size-4"/>
                          Download Report
                       </Button>
                  </header>
                  <Card className="flex-1 flex flex-col shadow-xl bg-card/80 backdrop-blur-sm border-primary/20">
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
                                              <ScrollArea className="h-full min-h-[200px]">
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
                                  {isRiskPending && !riskAnalysis && (
                                      <div className="flex items-center justify-center h-full">
                                          <Loader2 className="mr-2 size-8 animate-spin text-primary" />
                                          <span className="font-headline">Analyzing contract...</span>
                                      </div>
                                  )}
                                  {riskAnalysis && !isRiskPending && (
                                      <Card className="flex-1">
                                          <CardHeader>
                                              <CardTitle>
                                                <div className="flex items-center gap-2">
                                                  <Shield className="text-destructive"/>
                                                  <span>Risk Analysis Report</span>
                                                </div>

                                              </CardTitle>
                                          </CardHeader>
                                          <CardContent>
                                              <ScrollArea className="h-[400px] md:h-[calc(100vh-22rem)]">
                                                  <p className="whitespace-pre-wrap text-sm">{riskAnalysis}</p>
                                              </ScrollArea>
                                          </CardContent>
                                      </Card>
                                  )}
                                  {!riskAnalysis && !isRiskPending && selectedDoc.type === 'contract' && (
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
                {isLoadingDocs ? (
                   <Loader2 className="h-16 w-16 animate-spin text-primary" />
                ) : (
                  <>
                    <div className="flex items-center gap-4">
                      <LegalMindLogo className="h-16 w-16 text-primary" />
                      <h1 className="font-headline text-5xl font-bold">Welcome to LegalMind AI</h1>
                    </div>
                    <p className="max-w-md text-lg text-muted-foreground">
                      Your AI-powered document assistant. Upload a new document to get started.
                    </p>
                    <div className='flex items-center gap-2 mt-4'>
                      <ThemeToggle />
                      <SidebarTrigger className="md:hidden" />
                    </div>
                  </>
                )}
              </div>
            )}
          </SidebarInset>
        </div>
      </SidebarProvider>
    </>
  );
}

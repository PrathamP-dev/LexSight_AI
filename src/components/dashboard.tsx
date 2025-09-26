'use client';

import { useState, useTransition, useRef, useEffect, useCallback, Suspense } from 'react';
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
  AlertTriangle,
  ClipboardCopy,
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
import type { Document } from '@/services/documents';
import { getDocuments, deleteDocument, addDocument } from '@/services/documents';
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
import { useSearchParams } from 'next/navigation';


const documentIcons = {
  contract: <FileText />,
  report: <FileBarChart2 />,
  proposal: <FilePlus2 />,
};

const SQL_SCRIPT = `-- Create the documents table
CREATE TABLE public.documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows anonymous users to read all documents
CREATE POLICY "Enable read access for all users"
ON public.documents
FOR SELECT
USING (true);

-- Create a policy that allows anonymous users to insert new documents
CREATE POLICY "Enable insert for anon users"
ON public.documents
FOR INSERT
WITH CHECK (true);

-- Create a policy that allows anonymous users to delete documents
CREATE POLICY "Enable delete for all users"
ON public.documents
FOR DELETE
USING (true);`;

function DatabaseSetupGuide({ error }: { error: string }) {
  const { toast } = useToast();
  const copyToClipboard = () => {
    navigator.clipboard.writeText(SQL_SCRIPT);
    toast({
      title: "Copied to Clipboard",
      description: "You can now paste the SQL script into your Supabase SQL Editor.",
    });
  };

  return (
    <div className="flex flex-1 items-center justify-center p-4 md:p-6">
       <Card className="w-full max-w-2xl bg-destructive/10 border-destructive">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 font-headline text-2xl text-destructive">
            <AlertTriangle className="size-8" />
            Database Configuration Required
          </CardTitle>
          <CardDescription className="text-destructive/90">
            The application failed to connect to your \`documents\` table. This is usually because the table hasn't been created in your Supabase project yet.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4">To fix this, please run the following SQL script in your Supabase SQL Editor:</p>
          <div className="relative rounded-md bg-background p-4 font-mono text-sm">
            <pre className="whitespace-pre-wrap break-all">{SQL_SCRIPT}</pre>
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 h-7 w-7"
              onClick={copyToClipboard}
            >
              <ClipboardCopy className="size-4" />
            </Button>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            <strong>Reason:</strong> {error}
          </p>
        </CardContent>
       </Card>
    </div>
  );
}


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

function DashboardContent() {
  const [isSummarizePending, startSummarizeTransition] = useTransition();
  const [isRiskPending, startRiskTransition] = useTransition();
  
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoadingDocs, setIsLoadingDocs] = useState(true);
  const [dbError, setDbError] = useState<string | null>(null);
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
  const [selectedText, setSelectedText] = useState('');
  const [summary, setSummary] = useState('');
  const [riskAnalysis, setRiskAnalysis] = useState('');
  const [activeTab, setActiveTab] = useState('summary');
  const textContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const searchParams = useSearchParams();

  const loadDocuments = useCallback(async () => {
    setIsLoadingDocs(true);
    setDbError(null);
    try {
      const fetchedDocs = await getDocuments();
      setDocuments(fetchedDocs);

      const newDocId = searchParams.get('docId');
      if (newDocId) {
        const newDoc = fetchedDocs.find(doc => doc.id === newDocId);
        if (newDoc) {
          setSelectedDoc(newDoc);
        }
      } else if (fetchedDocs.length > 0 && (!selectedDoc || !fetchedDocs.some(d => d.id === selectedDoc.id))) {
        setSelectedDoc(fetchedDocs[0]);
      } else if (fetchedDocs.length === 0) {
        setSelectedDoc(null);
      }
    } catch (error) {
      console.error("Failed to load documents:", error);
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
      if (errorMessage.includes("Could not find the table 'public.documents'")) {
        setDbError(errorMessage);
      } else {
        toast({
          title: "Error Loading Documents",
          description: errorMessage,
          variant: "destructive",
        });
      }
    } finally {
      setIsLoadingDocs(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, toast]);

  useEffect(() => {
    loadDocuments();
  }, [loadDocuments]);


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
    try {
      await deleteDocument(docId);
      const updatedDocs = documents.filter(doc => doc.id !== docId);
      setDocuments(updatedDocs);

      if (selectedDoc?.id === docId) {
        setSelectedDoc(updatedDocs[0] || null);
      }
      toast({
          title: "Document Deleted",
          description: "The document has been removed from the database.",
      });
    } catch (error) {
      console.error("Failed to delete document:", error);
      toast({
        title: "Error Deleting Document",
        variant: "destructive",
      });
    }
  };

  const handleFileUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const text = e.target?.result as string;
        try {
          const newDocId = await addDocument({ name: file.name, content: text, type: 'contract' });
          // After adding, reload all documents to get the new one from the DB
          await loadDocuments();
          
          // Find and select the newly uploaded doc
          const reloadedDocs = await getDocuments();
          const newDoc = reloadedDocs.find(doc => doc.id === newDocId);
          if (newDoc) {
             setDocuments(reloadedDocs);
             setSelectedDoc(newDoc);
          }
          
          toast({
              title: "Document Uploaded",
              description: `"${file.name}" has been successfully added.`,
          });
        } catch (error) {
          console.error("Failed to upload document:", error);
          const errorMessage = error instanceof Error ? error.message : "An unknown error has occurred.";
          if (errorMessage.includes("Could not find the table 'public.documents'")) {
            setDbError(errorMessage);
          }
          toast({ title: "Upload Failed", description: errorMessage, variant: "destructive"});
        }
      };
      reader.readAsText(file);
    }
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

    let reportContent = `LegalMind Analysis Report\n`;
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

  if (dbError) {
    return <DatabaseSetupGuide error={dbError} />;
  }

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
                      <p className="text-sm text-muted-foreground">{selectedDoc.type} - Created on {new Date(selectedDoc.created_at).toLocaleDateString()}</p>
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
                      <h1 className="font-headline text-5xl font-bold">Welcome to LegalMind</h1>
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

export function Dashboard() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DashboardContent />
    </Suspense>
  )
}

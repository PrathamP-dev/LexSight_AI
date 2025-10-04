
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { UploadCloud, FileText, ArrowRight, Loader2, User, Settings, LogOut, FileStack } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { LegalMindLogo } from '@/components/icons';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';
import { addDocument } from '@/services/documents';
import { useToast } from '@/hooks/use-toast';

export default function HomePage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleCreateDocument = async (name: string, content: string) => {
    setIsProcessing(true);
    try {
      const newDocId = await addDocument({ name, content, type: 'contract' });
      router.push(`/dashboard?docId=${newDocId}`);
    } catch (error) {
      console.error("Failed to create document:", error);
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
      toast({
        title: "Error Creating Document",
        description: `There was a problem saving your document. Reason: ${errorMessage}`,
        variant: "destructive",
        duration: 9000,
      });
      setIsProcessing(false);
    }
  };

  const handleTextSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const text = textAreaRef.current?.value;
    if (text) {
      const docName = `Pasted Document ${new Date().toLocaleDateString()}`;
      await handleCreateDocument(docName, text);
    }
  };

  const handleFileUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const fileType = file.name.toLowerCase().split('.').pop();
      const reader = new FileReader();
      
      if (fileType === 'txt' || fileType === 'rtf') {
        reader.onload = async (e) => {
          const text = e.target?.result as string;
          await handleCreateDocument(file.name, text);
        };
        reader.readAsText(file);
      } else if (fileType === 'pdf' || fileType === 'docx' || fileType === 'doc') {
        const placeholderText = `Document uploaded: ${file.name}\n\nFile type: ${fileType.toUpperCase()}\n\nThis document has been uploaded successfully. In a full implementation, the content would be extracted using specialized libraries for ${fileType.toUpperCase()} files.\n\nPlease note: Full text extraction for ${fileType.toUpperCase()} files requires backend processing services.`;
        await handleCreateDocument(file.name, placeholderText);
      } else {
        toast({
          title: "Unsupported File Type",
          description: `The file type '.${fileType}' is not supported. Please upload a PDF, DOCX, TXT, DOC, or RTF file.`,
          variant: "destructive",
          duration: 5000,
        });
      }
    }
  };

  return (
    <>
      <div className="fixed top-0 left-0 w-full h-full -z-10 bg-background"></div>
      <div className="relative flex min-h-screen flex-col">
        {/* Enhanced Header with Account Toggle */}
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container mx-auto flex h-16 items-center justify-between px-4">
            <Link href="/" className="flex items-center gap-2 transition-all hover:opacity-80">
              <LegalMindLogo className="size-8 text-primary" />
              <h1 className="font-headline text-2xl font-bold">LegalMind</h1>
            </Link>
            
            {/* Account Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10 border-2 border-primary/20">
                    <AvatarImage src="https://github.com/shadcn.png" alt="User" />
                    <AvatarFallback className="bg-primary text-primary-foreground">TU</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">Test User</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      user@example.com
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard" className="cursor-pointer">
                    <FileStack className="mr-2 h-4 w-4" />
                    <span>My Documents</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer text-destructive focus:text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Profile Section - Left Sidebar */}
            <motion.aside
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-3"
            >
              <Card className="border-primary/20 bg-card/80 backdrop-blur-sm">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center space-y-4">
                    <Avatar className="h-24 w-24 border-4 border-primary/20">
                      <AvatarImage src="https://github.com/shadcn.png" alt="User" />
                      <AvatarFallback className="bg-primary text-primary-foreground text-2xl">TU</AvatarFallback>
                    </Avatar>
                    <div className="text-center space-y-1">
                      <h3 className="font-headline text-xl font-bold">Test User</h3>
                      <p className="text-sm text-muted-foreground">user@example.com</p>
                    </div>
                    <Button asChild variant="outline" className="w-full">
                      <Link href="/profile">
                        <Settings className="mr-2 h-4 w-4" />
                        Profile Settings
                      </Link>
                    </Button>
                  </div>
                  
                  <div className="mt-6 space-y-3">
                    <div className="flex justify-between items-center p-3 rounded-lg bg-primary/5">
                      <span className="text-sm font-medium">Documents</span>
                      <span className="text-sm font-bold text-primary">0</span>
                    </div>
                    <div className="flex justify-between items-center p-3 rounded-lg bg-accent/10">
                      <span className="text-sm font-medium">Analyzed</span>
                      <span className="text-sm font-bold text-accent">0</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.aside>

            {/* Main Document Upload Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="lg:col-span-9 space-y-6"
            >
              <div className="space-y-2">
                <h2 className="font-headline text-3xl font-bold tracking-tight">Welcome Back!</h2>
                <p className="text-lg text-muted-foreground">
                  Start analyzing your legal documents instantly
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="group border-primary/20 bg-card/80 backdrop-blur-sm transition-all hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3 font-headline text-2xl">
                      <div className="p-3 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        <UploadCloud className="size-6" />
                      </div>
                      Upload Document
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-6 text-muted-foreground">
                      Upload a file from your computer. Supported formats: PDF, DOCX, TXT, DOC, RTF
                    </p>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      className="hidden"
                      accept=".pdf,.docx,.txt,.doc,.rtf"
                      disabled={isProcessing}
                    />
                    <Button 
                      onClick={handleFileUploadClick} 
                      className="w-full font-headline group" 
                      disabled={isProcessing}
                      size="lg"
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="mr-2 animate-spin" /> 
                          Processing...
                        </>
                      ) : (
                        <>
                          Select File
                          <ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>

                <Card className="group border-primary/20 bg-card/80 backdrop-blur-sm transition-all hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3 font-headline text-2xl">
                      <div className="p-3 rounded-lg bg-accent/20 text-accent group-hover:bg-accent group-hover:text-accent-foreground transition-colors">
                        <FileText className="size-6" />
                      </div>
                      Paste Text
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleTextSubmit} className="flex flex-col gap-4">
                      <Textarea 
                        ref={textAreaRef} 
                        placeholder="Paste your contract text here..." 
                        className="h-24 resize-none" 
                        disabled={isProcessing} 
                      />
                      <Button 
                        type="submit" 
                        className="w-full font-headline group" 
                        disabled={isProcessing}
                        size="lg"
                      >
                        {isProcessing ? (
                          <>
                            <Loader2 className="mr-2 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          <>
                            Analyze Text
                            <ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
                          </>
                        )}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          </div>
        </main>
      </div>
    </>
  );
}

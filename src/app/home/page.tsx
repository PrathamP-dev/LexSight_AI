'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { UploadCloud, FileText, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { LegalMindLogo } from '@/components/icons';
import { useRouter } from 'next/navigation';
import { useRef } from 'react';

export default function HomePage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const handleTextSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const text = textAreaRef.current?.value;
    if (text) {
      sessionStorage.setItem('pastedText', text);
      router.push('/dashboard');
    }
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
        const fileInfo = { name: file.name, content: text };
        sessionStorage.setItem('uploadedFile', JSON.stringify(fileInfo));
        router.push('/dashboard');
      };
      reader.readAsText(file);
    }
  };


  return (
    <>
      <div className="fixed top-0 left-0 w-full h-full -z-10 bg-background"></div>
      <div className="relative flex min-h-screen flex-col items-center justify-center p-4">
        <header className="absolute top-0 left-0 right-0 p-4">
          <div className="container mx-auto flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <LegalMindLogo className="size-8 text-primary" />
              <h1 className="font-headline text-2xl font-bold">LegalMind AI</h1>
            </Link>
          </div>
        </header>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-4xl space-y-8"
        >
          <div className="text-center">
            <h2 className="font-headline text-4xl font-bold tracking-tight">Get Started</h2>
            <p className="mt-2 text-lg text-muted-foreground">
              How would you like to provide your document?
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <Card className="flex flex-col justify-between border-primary/20 bg-card/80 backdrop-blur-sm transition-all hover:border-primary/40 hover:scale-[1.02]">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 font-headline text-2xl">
                  <UploadCloud className="size-8 text-accent" />
                  Upload a Document
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4 text-muted-foreground">
                  Upload a file from your computer. Supported formats: PDF, DOCX, TXT.
                </p>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                  accept=".pdf,.docx,.txt"
                />
                <Button onClick={handleFileUploadClick} className="w-full font-headline">
                    Select File
                </Button>
              </CardContent>
            </Card>

            <Card className="flex flex-col justify-between border-primary/20 bg-card/80 backdrop-blur-sm transition-all hover:border-primary/40 hover:scale-[1.02]">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 font-headline text-2xl">
                  <FileText className="size-8 text-accent" />
                  Paste Text
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleTextSubmit} className="flex flex-col gap-4">
                  <Textarea ref={textAreaRef} placeholder="Paste your contract text here..." className="h-24" />
                  <Button type="submit" className="w-full font-headline">
                    Analyze Text
                    <ArrowRight className="ml-2 size-4" />
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>
    </>
  );
}

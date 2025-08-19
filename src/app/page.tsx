
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { LegalMindLogo } from '@/components/icons';
import { motion } from 'framer-motion';
import { DarkVeil } from '@/components/dark-veil';

export default function LandingPage() {
  const features = [
    {
      title: 'Seamless Document Upload',
      description: 'Easily upload your legal documents in various formats including PDF, DOCX, and TXT.',
    },
    {
      title: 'AI-Powered Text Extraction',
      description: 'Leverage advanced OCR and text extraction to digitize your documents accurately.',
    },
    {
      title: 'Instant Clause Summarization',
      description: 'Select any clause and get a concise, easy-to-understand summary in plain language.',
    },
    {
      title: 'Comprehensive Risk Analysis',
      description: 'Our AI analyzes contracts to identify potential risks, liabilities, and ambiguities.',
    },
  ];

  return (
    <>
      <div className="fixed top-0 left-0 w-full h-full -z-10">
        <DarkVeil
          speed={0.5}
          hueShift={0}
          noiseIntensity={0.03}
          scanlineFrequency={0}
          scanlineIntensity={0}
          warpAmount={0.5}
        />
      </div>
      <div className="relative min-h-screen w-full overflow-hidden">
        <header className="absolute top-0 left-0 right-0 z-10 p-4">
          <div className="container mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2">
              <LegalMindLogo className="size-8 text-primary" />
              <h1 className="font-headline text-2xl font-bold">LegalMind AI</h1>
            </div>
            <Link href="/login">
              <Button variant="outline" className="font-headline">
                Login / Sign Up
              </Button>
            </Link>
          </div>
        </header>

        <main className="container mx-auto flex min-h-screen flex-col items-center justify-center px-4">
           <div className="z-10 flex flex-col items-center text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="font-headline text-5xl font-bold tracking-tighter md:text-7xl">
                Revolutionize Your Legal Workflow
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
                Leverage the power of AI to analyze, summarize, and manage your legal documents with unprecedented speed and accuracy.
              </p>
              <Link href="/login" className="mt-8 inline-block">
                <Button size="lg" className="font-headline text-lg">
                  Get Started
                </Button>
              </Link>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="mt-20 grid w-full max-w-7xl gap-8 sm:grid-cols-2 lg:grid-cols-4"
            >
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="rounded-lg border border-primary/10 bg-card/50 p-6 text-left backdrop-blur-sm transition-all hover:border-primary/30 hover:bg-card/80 hover:scale-105"
                >
                  <h3 className="font-headline text-xl font-bold">{feature.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </main>
      </div>
    </>
  );
}

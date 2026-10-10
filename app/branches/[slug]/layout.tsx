import type { Metadata } from 'next';
import { getBranchBySlug, SURAT_BRANCHES } from '@/lib/data/branches';

export async function generateStaticParams() {
  return SURAT_BRANCHES.map((branch) => ({
    slug: branch.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const branch = getBranchBySlug(slug);

  if (!branch) {
    return {
      title: 'Branch Not Found — TESCA Spoken English Surat',
      description: 'Visit our spoken English & IELTS coaching branches across Surat.',
    };
  }

  const title = `TESCA ${branch.shortName} — Spoken English, IELTS & Visa Consultancy Surat`;
  const description = `Join TESCA in ${branch.area}, Surat. Cambridge-certified trainers, interactive speaking batches, IELTS/PTE preparation, and foreign student visa consultation. Book a Free Demo!`;

  return {
    title,
    description,
    keywords: branch.localKeywords,
    alternates: {
      canonical: `https://tesca.co/branches/${branch.slug}`,
    },
    other: {
      'geo.region': 'IN-GJ',
      'geo.position': `${branch.latitude};${branch.longitude}`,
      'ICBM': `${branch.latitude}, ${branch.longitude}`,
    },
    openGraph: {
      title,
      description,
      url: `https://tesca.co/branches/${branch.slug}`,
      siteName: 'TESCA Spoken English',
      images: [
        {
          url: '/og-image.jpg',
          width: 1200,
          height: 630,
          alt: `TESCA ${branch.name}`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/og-image.jpg'],
    },
  };
}

export default function BranchLayout({ children }: { children: React.ReactNode }) {
  return children;
}

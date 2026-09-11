import type { Metadata } from 'next';
import { COURSES } from '@/lib/data/content';
import { db } from '@/lib/db';

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

async function getCourseData(id: string) {
  const decoded = decodeURIComponent(id).toLowerCase();

  // 1. Static match
  const staticMatch = COURSES.find(
    (c) => slugify(c.title) === decoded || c.title.toLowerCase() === decoded
  );
  if (staticMatch) return staticMatch;

  // 2. DB match
  try {
    const dbCourses = await db.getCourses();
    const dbMatch = dbCourses.find(
      (c: any) =>
        c.id === id ||
        slugify(c.title || '') === decoded ||
        (c.title && c.title.toLowerCase() === decoded)
    );
    if (dbMatch) return dbMatch;
  } catch (err) {
    console.error('Failed to fetch course for layout metadata:', err);
  }

  return null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const course = await getCourseData(id);

  if (course) {
    const title = `${course.title} in Surat — Syllabus, Fees & Demo | TESCA`;
    const description = course.benefits && course.benefits.length > 0
      ? `Join ${course.title} at TESCA Surat. Features: ${course.benefits.slice(0, 3).join(', ')}. Live interactive classes, Cambridge trainers, free demo.`
      : `Master English fluency with ${course.title} at TESCA Spoken English Surat. 20+ years of trust, 95% success rate.`;

    const canonicalUrl = `https://tesca.co/courses/${id}`;

    return {
      title,
      description,
      alternates: {
        canonical: canonicalUrl,
      },
      openGraph: {
        title,
        description,
        url: canonicalUrl,
        type: 'website',
        siteName: 'TESCA Spoken English',
        images: [
          {
            url: '/og-image.jpg',
            width: 1200,
            height: 630,
            alt: `${course.title} at TESCA`,
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

  const fallbackTitle = 'Course Details — TESCA Spoken English Surat';
  return {
    title: fallbackTitle,
    description: 'Explore spoken English, IELTS, and PTE preparation courses with TESCA.',
    alternates: {
      canonical: `https://tesca.co/courses/${id}`,
    },
  };
}

export default async function CourseDetailLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const course = await getCourseData(id);

  const courseSchema = course
    ? {
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://tesca.co' },
              { '@type': 'ListItem', position: 2, name: 'Courses', item: 'https://tesca.co/courses' },
              { '@type': 'ListItem', position: 3, name: course.title, item: `https://tesca.co/courses/${id}` },
            ],
          },
          {
            '@type': 'Course',
            name: course.title,
            description: course.benefits ? course.benefits.join(', ') : `${course.title} training program`,
            provider: {
              '@type': 'EducationalOrganization',
              name: 'TESCA Spoken English & Visa Consultancy',
              sameAs: 'https://tesca.co',
            },
            offers: {
              '@type': 'Offer',
              price: course.price ? course.price.replace(/[^\d]/g, '') || '0' : '0',
              priceCurrency: 'INR',
              availability: 'https://schema.org/InStock',
              category: 'Educational Training',
            },
            hasCourseInstance: {
              '@type': 'CourseInstance',
              courseMode: ['Online', 'Onsite'],
              courseWorkload: course.duration || 'Flexible',
              instructor: {
                '@type': 'Person',
                name: 'Cambridge Certified Faculty',
              },
            },
          },
        ],
      }
    : null;

  return (
    <>
      {courseSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(courseSchema) }}
        />
      )}
      {children}
    </>
  );
}

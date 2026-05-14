import type { PortableTextComponents } from '@portabletext/react'
import { urlFor } from '@/sanity/lib/image'
import Image from 'next/image'
import ResultsCard from './ResultsCard'

export const portableTextComponents: PortableTextComponents = {
  types: {
    image: ({ value }) => {
      if (!value?.asset?._ref) {
        return null
      }
      return (
        <div className="relative w-full h-[400px] md:h-[500px] my-8 rounded-xl overflow-hidden border border-black/10 dark:border-white/10">
          <Image
            src={urlFor(value).width(1200).height(800).url()}
            alt={value.alt || 'Blog Image'}
            fill
            className="object-cover"
          />
          {value.caption && (
            <div className="absolute bottom-0 inset-x-0 bg-black/60 p-4 text-center text-white/80 text-sm backdrop-blur-sm">
              {value.caption}
            </div>
          )}
        </div>
      )
    },
    resultsCard: ({ value }: any) => {
      return <ResultsCard stats={value.stats} description={value.description} />;
    },
  },
  block: {
    h1: ({ children }) => (
      <h1 className="font-medium text-3xl md:text-5xl !text-black dark:!text-white mt-16 mb-6">{children}</h1>
    ),
    h2: ({ children }) => (
      <h2 className="font-medium text-2xl md:text-4xl !text-black dark:!text-white mt-12 mb-6">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="font-medium text-xl md:text-2xl !text-black dark:!text-white mt-8 mb-4">{children}</h3>
    ),
    normal: ({ children }) => (
      <p className="text-lg md:text-xl text-black/80 dark:text-white/70 leading-relaxed mb-6">{children}</p>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-2 pl-6 py-2 my-8 text-xl leading-relaxed italic text-blue-600 dark:text-orange-200/70 border-blue-400 dark:border-orange-500/50 bg-blue-50/50 dark:bg-orange-900/10 rounded-r-lg">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => <ul className="list-disc list-inside space-y-2 mb-6 text-lg md:text-xl text-black/80 dark:text-white/70">{children}</ul>,
    number: ({ children }) => <ol className="list-decimal list-inside space-y-2 mb-6 text-lg md:text-xl text-black/80 dark:text-white/70">{children}</ol>,
  },
  listItem: {
    bullet: ({ children }) => <li>{children}</li>,
    number: ({ children }) => <li>{children}</li>,
  },
  marks: {
    strong: ({ children }) => <strong className="font-semibold text-black dark:text-white">{children}</strong>,
    em: ({ children }) => <em className="italic">{children}</em>,
    link: ({ children, value }) => {
      const rel = !value.href.startsWith('/') ? 'noreferrer noopener' : undefined
      return (
        <a href={value.href} rel={rel} className="text-blue-600 dark:text-orange-500 hover:underline">
          {children}
        </a>
      )
    },
  },
}

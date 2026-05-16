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
        <div className="relative w-full h-[250px] sm:h-[400px] md:h-[600px] my-8 md:my-12 rounded-xl md:rounded-2xl overflow-hidden border border-black/5 dark:border-white/10 shadow-lg">
          <Image
            src={urlFor(value).width(1600).height(900).url()}
            alt={value.alt || 'Blog Image'}
            fill
            className="object-cover"
          />
          {value.caption && (
            <div className="absolute bottom-0 inset-x-0 bg-black/40 p-3 md:p-4 text-center text-white/90 text-[10px] md:text-xs backdrop-blur-md border-t border-white/10">
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
      <h1 className="font-bold text-3xl sm:text-5xl md:text-7xl lg:text-6xl text-cyan-600 dark:text-orange-500 mt-16 md:mt-24 mb-6 md:mb-10 tracking-tighter uppercase leading-[1.1]">{children}</h1>
    ),
    h2: ({ children }) => (
      <h2 className="font-bold text-2xl sm:text-4xl md:text-6xl lg:text-6xl text-cyan-600 dark:text-orange-500 mt-12 md:mt-20 mb-4 md:mb-8 tracking-tight uppercase leading-[1.1]">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="font-bold text-xl sm:text-2xl md:text-3xl lg:text-6xl text-cyan-600 dark:text-orange-500 mt-8 md:mt-16 mb-4 md:mb-6 tracking-tight uppercase leading-[1.1]">{children}</h3>
    ),
    normal: ({ children }) => (
      <p className="text-base md:text-lg text-black/70 dark:text-white/60 leading-relaxed mb-6 md:mb-8 font-light">{children}</p>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-2 md:border-l-4 pl-4 md:pl-8 py-2 my-8 md:my-12 text-lg md:text-xl leading-relaxed italic text-blue-600 dark:text-orange-500 border-blue-400 dark:border-orange-500/50 font-light">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => <ul className="list-disc list-outside ml-6 space-y-3 mb-8 text-base md:text-lg text-black/70 dark:text-white/60 font-light">{children}</ul>,
    number: ({ children }) => <ol className="list-decimal list-outside ml-6 space-y-3 mb-8 text-base md:text-lg text-black/70 dark:text-white/60 font-light">{children}</ol>,
  },
  listItem: {
    bullet: ({ children }) => <li>{children}</li>,
    number: ({ children }) => <li>{children}</li>,
  },
  marks: {
    strong: ({ children }) => <strong className="font-bold text-black dark:text-white">{children}</strong>,
    em: ({ children }) => <em className="italic">{children}</em>,
    link: ({ children, value }) => {
      const rel = !value.href.startsWith('/') ? 'noreferrer noopener' : undefined
      return (
        <a href={value.href} rel={rel} className="text-orange-600 dark:text-orange-500 hover:text-orange-400 underline decoration-orange-500/30 underline-offset-4 transition-colors">
          {children}
        </a>
      )
    },
  },
}

import { defineField, defineType } from 'sanity'

export const post = defineType({
  name: 'post',
  title: 'Blog Post',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required().max(120),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'Blogs', value: 'Blogs' },
          { title: 'Case Studies', value: 'Case Studies' },
          { title: 'Articles', value: 'Articles' },
          { title: 'Testing', value: 'Testing' },
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published At',
      type: 'date',
      options: { dateFormat: 'MMMM YYYY' },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'readTime',
      title: 'Read Time (minutes)',
      type: 'number',
      initialValue: 5,
      validation: (Rule) => Rule.required().min(1).max(60),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.required().max(300),
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover Image',
      type: 'image',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
          validation: (Rule) => Rule.required(),
        }),
      ],
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'array',
      of: [
        { type: 'block' },
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            defineField({
              name: 'alt',
              type: 'string',
              title: 'Alt Text',
            }),
            defineField({
              name: 'caption',
              type: 'string',
              title: 'Caption',
            }),
          ],
        },
        {
          type: 'object',
          name: 'resultsCard',
          title: 'Results & Impact Card',
          fields: [
            defineField({
              name: 'stats',
              title: 'Statistics',
              type: 'array',
              of: [
                {
                  type: 'object',
                  fields: [
                    { name: 'value', type: 'string', title: 'Value (e.g. 384)' },
                    { name: 'suffix', type: 'string', title: 'Suffix (e.g. % or x)' },
                    { name: 'label', type: 'string', title: 'Label' },
                  ]
                }
              ],
              validation: (Rule) => Rule.max(3)
            }),
            defineField({
              name: 'description',
              title: 'Bottom Description',
              type: 'text',
              rows: 3
            })
          ],
          preview: {
            select: {
              title: 'description'
            },
            prepare(selection) {
              return {
                title: 'Results & Impact Card',
                subtitle: selection.title
              }
            }
          }
        }
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'category',
      media: 'coverImage',
    },
  },
})

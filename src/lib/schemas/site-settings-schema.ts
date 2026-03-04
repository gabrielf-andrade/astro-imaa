import { z } from "astro/zod";

const imageSchema = z.object({
  _type: z.string().nullable().optional(),
  asset: z
    .object({
      _id: z.string(),
      url: z.string().nullable(),
      metadata: z
        .object({
          lqip: z.string().nullable().optional(),
          dimensions: z
            .object({
              width: z.number().nullable(),
              height: z.number().nullable(),
              aspectRatio: z.number().nullable(),
            })
            .nullable(),
        })
        .nullable(),
    })
    .nullable(),
  alt: z.string().nullable().optional(),
  caption: z.string().nullable().optional(),
  media: z.unknown(),
  hotspot: z
    .object({
      _type: z.string().nullable().optional(),
      x: z.number().nullable().optional(),
      y: z.number().nullable().optional(),
      height: z.number().nullable().optional(),
      width: z.number().nullable().optional(),
    })
    .nullable()
    .optional(),
  crop: z
    .object({
      _type: z.string().nullable().optional(),
      top: z.number().nullable().optional(),
      bottom: z.number().nullable().optional(),
      left: z.number().nullable().optional(),
      right: z.number().nullable().optional(),
    })
    .nullable()
    .optional(),
});

const submenuItemSchema = z.object({
  _key: z.string(),
  label: z.string().nullable(),
  slug: z.string().nullable(),
});

const menuItemSchema = z.object({
  _key: z.string(),
  label: z.string().nullable(),
  slug: z.string().nullable(),
  isDropdown: z.boolean().nullable(),
  submenu: submenuItemSchema.array().nullable().optional(),
});

const menuSchema = z.object({
  label: z.string().nullable(),
  items: menuItemSchema.array().nullable(),
});

const socialLinkSchema = z.object({
  platform: z.string().nullable(),
  url: z.union([z.literal(""), z.string().url()]).nullable(),
  label: z.string().nullable(),
  image: imageSchema.nullable().optional(),
});

const addressSchema = z.object({
  street: z.string().nullable().optional(),
  complement: z.string().nullable().optional(),
  neighborhood: z.string().nullable().optional(),
  cityState: z.string().nullable().optional(),
  zipCode: z.string().nullable().optional(),
});

const phoneSchema = z.object({
  label: z.string().nullable(),
  number: z.string().nullable(),
  isWhatsApp: z.boolean().nullable(),
});

const emailSchema = z.object({
  label: z.string().nullable(),
  address: z.union([z.literal(""), z.string().email()]).nullable(),
});

const contactInfoSchema = z.object({
  address: addressSchema.nullable(),
  phones: phoneSchema.array().nullable(),
  emails: emailSchema.array().nullable(),
});

export const siteSettingsSchema = z.object({
  title: z.string().nullable(),
  defaultSeoDescription: z.string().nullable(),
  logo: imageSchema.nullable(),
  mainMenu: menuSchema.nullable(),
  footerMenu: menuSchema.nullable(),
  socialLinks: socialLinkSchema.array().nullable(),
  contactInfo: contactInfoSchema.nullable(),
});

export type SiteSettings = z.infer<typeof siteSettingsSchema>;

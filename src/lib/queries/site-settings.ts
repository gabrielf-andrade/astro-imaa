import { defineQuery } from "groq";
import { IMAGE_FRAGMENT, MENU_ITEM_FRAGMENT } from "./fragments";

export const SITE_SETTINGS_QUERY = defineQuery(`
  *[_id == "siteSettings"][0] {
    title,
    defaultSeoDescription,
    "logo": logo {
      ${IMAGE_FRAGMENT},
    },
    "mainMenu": {
      "label": coalesce(mainMenu.label, "Menu Principal"),
      "items": coalesce(mainMenu.items[] { ${MENU_ITEM_FRAGMENT} }, [])
    },
    "footerMenu": {
      "label": coalesce(footerMenu.label, "Navegação"),
      "items": coalesce(footerMenu.items[] { ${MENU_ITEM_FRAGMENT} }, [])
    },
    "socialLinks": coalesce(socialLinks[] {
      platform,
      url,
      label,
      "image": image {
        ${IMAGE_FRAGMENT}
      }
    }, []),
    "contactInfo": coalesce(contactInfo {
      address,
      phones,
      emails
    }, { "address": null, "phones": [], "emails": [] })
  }
`);

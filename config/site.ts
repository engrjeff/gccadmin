export type SiteConfig = typeof siteConfig

export const siteConfig = {
  name: "Grace City App",
  description: "The official admin application of Grace City Church PH",
  mainNav: [
    {
      title: "Dashboard",
      href: "/dashboard",
    },
    {
      title: "Disciples",
      href: "/disciples",
    },
    {
      title: "Resources",
      href: "/resources",
    },
    {
      title: "Cell Reports",
      href: "/cell-reports",
    },
  ],
}

interface PageTitleProps {
  title: string
  subtitle?: string
}

function PageTitle({ title, subtitle }: PageTitleProps) {
  return (
    <div className="hidden lg:block">
      <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
      {subtitle && <p className="text-muted-foreground">{subtitle}</p>}
    </div>
  )
}

export default PageTitle

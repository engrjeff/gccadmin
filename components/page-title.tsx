interface PageTitleProps {
  title: string
  subtitle?: string
}

function PageTitle({ title, subtitle }: PageTitleProps) {
  return (
    <div>
      <h2 className="mb-1 text-lg font-bold tracking-tight">{title}</h2>
      {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
    </div>
  )
}

export default PageTitle

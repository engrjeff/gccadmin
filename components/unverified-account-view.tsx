function UnverifiedAccountView() {
  return (
    <div className="container fixed inset-0 flex h-screen w-screen flex-col items-center justify-center gap-3 px-4">
      <p className="text-center text-lg text-muted-foreground">
        Your account has not been validated by the Admin. Kindly wait before you
        can access this page
      </p>
      <p className="text-center text-lg text-muted-foreground">
        If you think, your account has been verified, just refresh this page.
      </p>
    </div>
  )
}

export default UnverifiedAccountView

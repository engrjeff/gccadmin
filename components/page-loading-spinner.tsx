import { Spinner } from "./spinner"

function PageLoadingSpinner() {
  return (
    <div className="absolute inset-0 flex h-full items-center justify-center">
      <Spinner />
    </div>
  )
}

export default PageLoadingSpinner

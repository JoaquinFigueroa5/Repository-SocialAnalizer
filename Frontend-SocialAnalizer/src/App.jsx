import { useRoutes } from "react-router-dom"
import { Suspense } from "react"
import routes from "./Routes"

function App() {

  let element = useRoutes(routes)

  return (
    <>
      <Suspense>
        {element}
      </Suspense>
    </>
  )
}

export default App

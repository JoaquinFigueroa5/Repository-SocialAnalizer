import { lazy } from "react";
import { Navigate } from "react-router-dom";
const UserSearchComponent = lazy(() => import("./components/searcherUsername"))

const routes = [
    { path: '/', element: <UserSearchComponent /> }
]

export default routes;
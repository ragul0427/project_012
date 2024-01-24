import App from "../App"
import {Category,Dashboard, SubCategory} from "../DashBoardComponents"
import {createBrowserRouter} from "react-router-dom"

const router=createBrowserRouter([
    {
        path:"/",
        element:<App/>,
        children:[
            {
                path:"/",
                element:<Dashboard/>,
            }
        ]
    },
    {
        path:"/category",
        element:<App/>,
        children:[
            {
                path:"/category",
                element:<Category/>,
            }
        ]
    },
    {
        path:"/subcategory",
        element:<App/>,
        children:[
            {
                path:"/subcategory",
                element:<SubCategory/>,
            }
        ]
    }
])

export default router;
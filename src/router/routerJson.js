import Login from "../views/Login/login";
import Home from "../views/Home/home";
import Index from '../components/index'
import Dep from '../components/DepartmentManagement/index'


let router=[
  {
    path:"/",
    redirect:"/home/Dep"
  },
  {
    path:"/login",
    component:Login,
  },
  {
    path:"/home",
    component:Home,
    children:[
      {
        path:"/home/index",
        component:Index
      },{
        path:"/home/Dep",
        component:Dep
      }
    ]
  }
]
export default router

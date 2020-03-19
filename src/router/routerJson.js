import Login from "../views/Login/index";
import Home from "../views/Home/home.js";
import Index from '../components/index'
import Department from '../components/DepartmentManagement/index'
import Item from '../components/ItemManagement/index'
import Resource from '../components/ResourceManagement/index'
import Calendar from '../components/CalendarManagement/index'
import PLO from '../components/PLOResourceGroup/index'
import Resgroup from '../components/ResourceGroup/index'
import Holiday from '../components/HolidayMangement/index'
import Labor from '../components/LaborPlan/index'
import Employee from '../components/employeemanagement/index'
import Labor_shift from '../components/Labor_shift'
import Inventory from '../components/InventoryManagement'
import InventorylocationManagement from '../components/InventorylocationManagement'
import Color from '../components/colorManagement'
import Specification from '../components/specification Management'

let router=[
  {
    path:"/",
    redirect:"/home/Specification"
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
      },
      {
        path:'/home/Specification',
        component:Specification
      },
      {
        path:'/home/colorManagement',
        component:Color
      },
      {
        path:'/home/InventorylocationManagement',
        component:InventorylocationManagement
      },
      {
        path:'/home/InventoryManagement',
        component:Inventory
      },
      {
        path:'/home/InventoryManagement',
        component:Inventory
      },
      {
        path:'/home/employeemanagement',
        component:Employee
      },
      {
        path:"/home/LaborPlan",
        component:Labor,
      },
      {
        path:'/home/LaborPlan_shift',        
        component:Labor_shift
      },
      {
        path:"/home/HolidayManagement",
        component:Holiday
        
      },
      {
        path:'/home/PLOResourceGroup',
        component:PLO
      },{
        path:'/home/ResourceGroup',
        component:Resgroup
      },
      {
        path:'/home/DepartmentManagement',
        component:Department
      },{
        path:'/home/ItemManagement',
        component:Item
      },{
        path:'/home/ResourceManagement',
        component:Resource
      },{
        path:'/home/CalendarManagement',
        component:Calendar
      }
    ]
  }
]
export default router

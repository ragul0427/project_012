import { Menu } from "antd"
import {items} from "../helper/menu"

function SideNavbar() {
  return (
    <div className="w-[19vw] fixed !mt-[8vh] h-screen">
        <Menu items={items} mode="inline" className="!bg-background h-[100%] !text-white !text-[16px]"/>
    </div>
  )
}

export default SideNavbar
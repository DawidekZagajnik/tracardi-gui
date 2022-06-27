import React, {useState} from "react";
import "./MainMenu.css";
import {BsFolder} from "react-icons/bs";
import {useHistory} from "react-router-dom";
import urlPrefix from "../../misc/UrlPrefix";
import version from '../../misc/version';
import {BiChevronLeftCircle, BiChevronRightCircle} from "react-icons/bi";
import {BsPersonCircle, BsFileEarmarkArrowUp} from "react-icons/bs";
import {VscPulse} from "react-icons/vsc";
import {IoGitNetworkSharp} from "react-icons/io5";
import {GoSettings} from "react-icons/go";
import {VscLaw, VscDashboard} from "react-icons/vsc";
import {BsGear, BsClipboardCheck, BsStar} from "react-icons/bs";
import { getRoles } from "../authentication/login";
import {RiArrowLeftRightFill} from "react-icons/ri";

export default function MainMenu() {

    const [collapsed, setCollapsed] = useState(false);

    const history = useHistory();
    const go = (url) => {
        return () => history.push(urlPrefix(url));
    }

    const MenuRow = ({label, icon, onClick, style, collapsed=false, roles=[], alwaysDisplay=false}) => {

        function intersect(a, b) {
            let setB = new Set(b);
            return [...new Set(a)].filter(x => setB.has(x));
        }
    
        const isAllowed = () => {
            if(intersect(getRoles(), roles).length > 0) {
                return true
            }
            return false
        }
    
        return (
            isAllowed() || alwaysDisplay ? 
            <div className="MenuRow" onClick={onClick} style={style}><span className="Icon">{icon}</span>{!collapsed && <span className="Label">{label}</span>}</div>
            :
            null
        )
    }

    const Branding = ({collapsed=false}) => {
        if(collapsed === true) {
            return <div className="Branding"><div className="T">T</div></div>
        }
        return <div className="Branding">
                <div className="Tracardi">TRACARDI</div>
                <div className="Version">v. {version()}</div>
            </div>
    }

    return <div className={collapsed ? "MainMenu CollapsedMainMenu": "MainMenu FullMainMenu"}>
        <div>
            <Branding collapsed={collapsed}/>
            <div>
                <MenuRow icon={<VscDashboard size={20}/>} label="Dashboard" collapsed={collapsed} onClick={go("/dashboard")} roles={["admin", "developer", "marketer"]}/>
                <MenuRow icon={<BsStar size={20}/>} label="Resources" collapsed={collapsed} onClick={go("/resources")} roles={["admin", "developer"]}/>
                <MenuRow icon={<RiArrowLeftRightFill size={20}/>} label="Traffic" collapsed={collapsed} onClick={go("/traffic")} roles={["admin", "developer"]}/>
                <MenuRow icon={<BsFileEarmarkArrowUp size={20}/>} label="Import" collapsed={collapsed} onClick={go("/import")} roles={["admin", "developer"]}/>
                <MenuRow icon={<VscLaw size={20}/>} label="Consents" collapsed={collapsed} onClick={go("/consents")} roles={["admin", "developer", "marketer"]}/>
                <MenuRow icon={<BsGear size={20}/>} label="Management" collapsed={collapsed} onClick={go("/management")} roles={["admin", "developer"]}/>
                <MenuRow icon={<BsFolder size={20}/>} label="Data" collapsed={collapsed} onClick={go("/data")} roles={["admin", "developer", "marketer"]}/>
                <MenuRow icon={<IoGitNetworkSharp size={20}/>} label="Processing" collapsed={collapsed} onClick={go("/processing")} roles={["admin", "developer", "marketer"]}/>
                <MenuRow icon={<VscPulse size={20}/>} label="Monitoring" collapsed={collapsed} onClick={go("/monitoring")} roles={["admin"]}/>
                <MenuRow icon={<BsClipboardCheck size={20}/>} label="Test" collapsed={collapsed} onClick={go("/testing")} roles={["admin", "developer"]}/>
                <MenuRow icon={<GoSettings size={20}/>} label="Settings" collapsed={collapsed} onClick={go("/settings")} roles={["admin", "developer", "marketer"]}/>
            </div>
        </div>
        <div>
            <MenuRow icon={<BsPersonCircle size={20}/>}
                label="My account"
                collapsed={collapsed}
                style={{marginBottom: 20}}
                onClick={go("/my-account")}
                alwaysDisplay={true}
                />

            <MenuRow icon={collapsed ? <BiChevronRightCircle size={20}/> : <BiChevronLeftCircle size={20}/>}
                     collapsed={collapsed}
                     label="Collapse"
                     onClick={() => setCollapsed(!collapsed)}
                     alwaysDisplay={true}
            />
        </div>

    </div>
}
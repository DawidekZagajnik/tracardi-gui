import React, {useState} from "react";
import "./MainMenu.css";
import {BsFolder} from "react-icons/bs";
import {useHistory} from "react-router-dom";
import urlPrefix from "../../misc/UrlPrefix";
import {BsBoxArrowInUpRight} from "react-icons/bs";
import {BsStar, BsBug} from "react-icons/bs";
import version from '../../misc/version';
import {BiChevronLeftCircle, BiChevronRightCircle} from "react-icons/bi";
import {FiMoreHorizontal} from "react-icons/fi";
import {AiOutlinePoweroff} from "react-icons/ai";
import {IoLogoYoutube} from "react-icons/io";
import {VscBook, VscTwitter, VscPulse} from "react-icons/vsc";
import {IoGitNetworkSharp} from "@react-icons/all-files/io5/IoGitNetworkSharp";

export default function MainMenu() {

    const [collapsed, setCollapsed] = useState(false);

    const history = useHistory();
    const go = (url) => {
        return () => history.push(urlPrefix(url));
    }

    const external = (url, newWindow=false) => {
        if(newWindow===true) {
            return () => window.open(url, '_blank', 'location=yes,scrollbars=yes,status=yes')
        } else {
            return () => window.location.href = url;
        }
    }

    const MenuRow = ({label, icon, onClick, style, collapsed=false}) => {
        return <div className="MenuRow" onClick={onClick} style={style}><span className="Icon">{icon}</span>{!collapsed && <span className="Label">{label}</span>}</div>
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
                <MenuRow icon={<BsStar size={20}/>} label="Tracardi Pro" collapsed={collapsed} onClick={go("/pro")}/>
                <MenuRow icon={<BsBoxArrowInUpRight size={20}/>} label="Traffic" collapsed={collapsed} onClick={go("/traffic")}/>
                <MenuRow icon={<BsFolder size={20}/>} label="Data" collapsed={collapsed} onClick={go("/data")}/>
                <MenuRow icon={<IoGitNetworkSharp size={20}/>} label="Processing" collapsed={collapsed} onClick={go("/processing")}/>
                <MenuRow icon={<VscPulse size={20}/>} label="Monitoring" collapsed={collapsed} onClick={go("/monitoring")}/>
                <MenuRow icon={<BsBug size={20}/>} label="Test" collapsed={collapsed} onClick={go("/testing")}/>
            </div>
        </div>
        <div>
            <MenuRow icon={<IoLogoYoutube size={20}/>} label="YouTube" collapsed={collapsed}/>
            <MenuRow icon={<VscTwitter size={20}/>} label="Twitter" collapsed={collapsed}/>
            <MenuRow icon={<VscBook size={20}/>} label="Manual" collapsed={collapsed} style={{marginBottom: 15}}/>

            <MenuRow icon={<FiMoreHorizontal size={20}/>}
                     label="Settings"
                     collapsed={collapsed}
                     onClick={go("/settings")}/>


            <MenuRow icon={<AiOutlinePoweroff size={20}/>}
                label="Logout"
                collapsed={collapsed}
                style={{marginBottom: 20}}
                onClick={go("/logout")}
                />

            <MenuRow icon={collapsed ? <BiChevronRightCircle size={20}/> : <BiChevronLeftCircle size={20}/>}
                     collapsed={collapsed}
                     label="Collapse"
                     onClick={() => setCollapsed(!collapsed)}
            />
        </div>

    </div>
}
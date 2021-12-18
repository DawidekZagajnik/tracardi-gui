import React from "react";
import './FlowLogs.css';
import {FiAlertTriangle} from "@react-icons/all-files/fi/FiAlertTriangle";
import {VscError} from "@react-icons/all-files/vsc/VscError";
import {AiOutlineCheckCircle} from "@react-icons/all-files/ai/AiOutlineCheckCircle";

const FlowLogs = ({logs}) => {

    const Row = ({log}) => {

        const Icon = ({type}) => {
            let icon;
            if(type === 'warning') {
                icon = <FiAlertTriangle size={25} style={{color: 'orange', marginRight: 5}}/>
            } else if (type === 'error') {
                icon = <VscError size={25} style={{color: 'red', marginRight: 5}}/>
            } else {
                icon = <AiOutlineCheckCircle size={25} style={{color: 'green', marginRight: 5}}/>
            }

            return <span style={{minWidth: 35, display: "flex", alignItems: 'center'}}>{icon}</span>
        }

        return <div className="FlowLogRow">
            <div className="FlowLogMessage"><Icon type={log.type}/>{log.message}</div>
        </div>
    }

    return <div className="FlowLog">
        <div className="FlowLogHeader">Message</div>
        <div className="FlowLogRows">
            {Array.isArray(logs) && logs.map((log, index)=> {
                return <Row
                    key={index}
                    log={log}
                />
            })}
        </div>
    </div>

}

export default FlowLogs;
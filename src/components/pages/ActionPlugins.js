import React, {useCallback} from "react";
import SquareCard from "../elements/lists/cards/SquareCard";
import {VscPlug} from "@react-icons/all-files/vsc/VscPlug";
import PluginForm from "../elements/forms/PluginForm";
import CardBrowser from "../elements/lists/CardBrowser";

export default function ActionPlugins() {

    const urlFunc= useCallback((query) => ('/flow/action/plugins' + ((query) ? "?query=" + query : "")),[]);
    const detailsFunc=  useCallback((id) => <PluginForm id={id}/>, []);

    const plugins = (data, onClick) => {
        return Object.entries(data?.grouped).map(([category, plugs], index) => {
            return <div className="CardGroup" key={index}>
                <header>{category}</header>
                <div>
                    {plugs.map((row, subIndex) => {
                        return <SquareCard key={index+"-"+subIndex}
                                           id={row?.id}
                                           icon={<VscPlug size={45}/>}
                                           status={row?.settings?.enabled}
                                           name={row?.plugin?.metadata?.name}
                                           description={row?.plugin?.metadata?.desc}
                                           onClick={() => onClick(row?.id)}/>
                    })}
                </div>
            </div>
        })
    }

    return <CardBrowser
        label="Action plugins"
        urlFunc={urlFunc}
        cardFunc={plugins}
        drawerDetailsTitle="Edit Plugin Action"
        drawerDetailsWidth={800}
        detailsFunc={detailsFunc}
    />
}

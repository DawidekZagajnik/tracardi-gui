import React, {useEffect} from "react";
import {asyncRemote, getError} from "../../../remote_api/entrypoint";
import {object2dot} from "../../../misc/dottedObject";
import PropertyField from "./PropertyField";
import NoData from "../misc/NoData";
import ErrorsBox from "../../errors/ErrorsBox";
import {isObject} from "../../../misc/typeChecking";
import Button from "../forms/Button";
import {MdUnfoldLess, MdUnfoldMore} from "react-icons/md";
import LinearProgress from "@mui/material/LinearProgress";

const SessionContextInfo = ({sessionId}) => {

    const [session, setSession] = React.useState(null);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(null);
    const [displaySessionContext, setDisplaySessionContext] = React.useState(false);

    useEffect(() => {
        let isSubscribed = true;

        if (displaySessionContext) {
            setSession(null);
            setError(null);
            setLoading(true);
            if (sessionId) {
                asyncRemote({
                    url: "/session/" + sessionId
                })
                    .then(response => {
                        if (isSubscribed && response?.data) {
                            setSession(response.data);
                        }
                    })
                    .catch(e => {
                        let code = 500
                        if (e?.response) {
                            code = e.response.status
                        }

                        if (isSubscribed) setError({code: code, errors: getError(e)})
                    })
                    .finally(() => {
                        if (isSubscribed) setLoading(false)
                    })
            }

        }

        return () => isSubscribed = false;

    }, [sessionId, displaySessionContext])

    const Content = ({session}) => {
        const sessionContext = object2dot(session?.context);
        return Object.keys(sessionContext).map(key => <PropertyField key={key}
                                                                     name={key}
                                                                     content={sessionContext[key]}/>)
    }

    if (error) {
        if (error.code === 404) {
            return <NoData header="Missing session">This event has no session. Can not retrieve context data.</NoData>
        }
        return <ErrorsBox errorList={error.errors}/>
    }

    return <>
        <div style={{display: "flex", justifyContent: "flex-end"}}>
            {!isObject(session)
                ? <Button label="Display session context"
                          icon={<MdUnfoldMore size={20}/>}
                          onClick={() => setDisplaySessionContext(true)}/>
                : <Button label="Hide session context"
                          icon={<MdUnfoldLess size={20}/>}
                          onClick={() => {
                              setDisplaySessionContext(false);
                              setSession(null)
                          }}/>}
        </div>
        {loading && <div style={{marginTop: 10}}><LinearProgress/></div>}
        {isObject(session) && displaySessionContext && <Content session={session}/>}
    </>


};


export default SessionContextInfo;
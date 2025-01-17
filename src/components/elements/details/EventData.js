import {object2dot} from "../../../misc/dottedObject";
import PropertyField from "./PropertyField";
import {TuiForm, TuiFormGroup, TuiFormGroupContent, TuiFormGroupHeader} from "../tui/TuiForm";
import {isEmptyObjectOrNull} from "../../../misc/typeChecking";
import ProfileDetails from "./ProfileDetails";
import EventSourceDetails from "./EventSourceDetails";
import EventStatusTag from "../misc/EventStatusTag";
import EventValidation from "../misc/EventValidation";
import {BsCheckCircle, BsXSquare} from "react-icons/bs";
import TimeDifference from "../datepickers/TimeDifference";
import React from "react";
import SessionContextInfo from "./SessionContextInfo";


const EventData = ({event, allowedDetails=[]}) => {

    const ContextInfo = () => {
        const context = object2dot(event?.context);
        return <>{Object.keys(context).map(key => <PropertyField key={key} name={key} content={context[key]}/>)}</>
    }

    const EventProperties = () => {
        const eventProperties = object2dot(event?.properties);
        return <>{Object.keys(eventProperties).map(key => <PropertyField key={key} name={key}
                                                                         content={eventProperties[key]}/>)}</>
    }

    const insertTime = (event) => {
        return typeof event?.metadata?.time?.insert === "string" && `${event.metadata.time.insert.substring(0, 10)} ${event.metadata.time.insert.substring(11, 19)}`
    }

    return <TuiForm style={{margin: 20}}>
        <TuiFormGroup>
            <TuiFormGroupHeader header="Event details"/>
            <TuiFormGroupContent style={{display: "flex", flexDirection: "column"}}>
                <PropertyField name="Type" content={event?.type}/>
                <PropertyField name="Insert time"
                               content={<> {insertTime(event)} <TimeDifference
                                   date={event?.metadata?.time?.insert}/> </>}
                />
                <PropertyField name="Status"
                               content={<><EventStatusTag label={event?.metadata?.status}/>
                                   <EventValidation eventMetaData={event?.metadata}/></>}/>
                {event?.session && <PropertyField name="Session duration" content={Math.floor(event.session.duration / 60).toString() + "m"}>

                </PropertyField>}
                {event?.session && <PropertyField name="Session id" content={event.session?.id}>

                </PropertyField>}

                {event?.profile && <PropertyField name="Profile id" content={event.profile.id} drawerSize={1000}>
                    {allowedDetails.includes("profile") && <ProfileDetails profile={event.profile}/>}
                </PropertyField>}
                {event?.source && <PropertyField name="Event source" content={event.source.id} drawerSize={820}>
                    {allowedDetails.includes("source") && <EventSourceDetails id={event.source.id}/>}
                </PropertyField>}

                <PropertyField name="Debug" content={event?.metadata?.debug ?
                    <BsCheckCircle size={18} color="#00c853"/> : <BsXSquare size={18} color="#d81b60"/>}/>
                <PropertyField name="Profile less" content={event?.metadata?.profile_less ?
                    <BsCheckCircle size={18} color="#00c853"/> : <BsXSquare size={18} color="#d81b60"/>}/>
                <PropertyField name="Updated time"
                               content={event?.update ? <BsCheckCircle size={18} color="#00c853"/> :
                                   <BsXSquare size={18} color="#d81b60"/>}/>

                <PropertyField name="Tags"
                               content={Array.isArray(event?.tags?.values) && event.tags.values.join(", ")}
                />
                <PropertyField name="Routed by rules"
                               content={Array.isArray(event?.metadata?.processed_by?.rules) && event.metadata.processed_by.rules.join(", ")}/>
            </TuiFormGroupContent>
        </TuiFormGroup>
        {!isEmptyObjectOrNull(event?.properties) && <TuiFormGroup>
            <TuiFormGroupHeader header="Properties"/>
            <TuiFormGroupContent>
                <EventProperties/>
            </TuiFormGroupContent>
        </TuiFormGroup>}
        {!isEmptyObjectOrNull(event?.context) && <TuiFormGroup>
            <TuiFormGroupHeader header="Context"/>
            <TuiFormGroupContent>
                <ContextInfo/>
                <div style={{marginTop: 20}}>
                    {event?.session?.id && <SessionContextInfo sessionId={event?.session?.id}/>}
                </div>

            </TuiFormGroupContent>
        </TuiFormGroup>}
    </TuiForm>
}

export default EventData;
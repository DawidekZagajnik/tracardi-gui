import TextField from "@mui/material/TextField";
import React, {useEffect, useRef, useState} from "react";
import Button from "./Button";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import {v4 as uuid4} from 'uuid';
import {TuiForm, TuiFormGroup, TuiFormGroupContent, TuiFormGroupField, TuiFormGroupHeader} from "../tui/TuiForm";
import {connect} from "react-redux";
import {showAlert} from "../../../redux/reducers/alertSlice";
import PropTypes from 'prop-types';
import {asyncRemote} from "../../../remote_api/entrypoint";
import TuiTagger from "../tui/TuiTagger";

function FlowForm({
                      id,
                      name,
                      description,
                      enabled,
                      projects,
                      onFlowSaveComplete,
                      showAlert,
                      draft = false,
                      refreshMetaData = true
                  }) {

    const [flowName, setFlowName] = useState((name) ? name : "");
    const [flowDescription, setFlowDescription] = useState((description) ? description : "");
    const [flowEnabled, setFlowEnabled] = useState((typeof enabled === "boolean") ? enabled : true);
    const [flowTags, setFlowTags] = useState(projects);
    const [processing, setProcessing] = useState(false);
    const [nameErrorMessage, setNameErrorMessage] = useState("");

    const mounted = useRef(false);

    useEffect(() => {
        mounted.current = true;

        return () => {
            mounted.current = false;
        }
    }, [])

    const onSave = async () => {

        if (!flowName) {
            if (flowName.length === 0) {
                setNameErrorMessage("Flow name can not be empty");
            } else {
                setNameErrorMessage("");
            }
            return;
        }

        try {
            setProcessing(true);

            const payload = {
                id: (id) ? id : uuid4(),
                name: flowName,
                description: flowDescription,
                enabled: flowEnabled,
                projects: flowTags && Array.isArray(flowTags) && flowTags.length > 0 ? flowTags : ["General"]
            }

            const response = await asyncRemote({
                url: (draft) ? '/flow/draft/metadata' : '/flow/metadata',
                method: 'post',
                data: payload
            })

            if (response) {
                if (refreshMetaData === true) {
                    // Refresh index in elastic so we can see it in the list.
                    await asyncRemote({
                        url: '/flows/refresh'
                    })
                    if (onFlowSaveComplete) {
                        onFlowSaveComplete(payload)
                    }
                } else {
                    if (onFlowSaveComplete) {
                        onFlowSaveComplete(payload)
                    }
                }

            }

        } catch (e) {
            if (e && mounted.current) {
                showAlert({message: e.toString(), type: "error", hideAfter: 5000});
            }
        } finally {
            if (mounted.current) {
                setProcessing(false)
            }
        }
    }

    const onTagChange = (values) => {
        setFlowTags(values)
    }

    return <TuiForm style={{margin: 20}}>
        <TuiFormGroup>
            <TuiFormGroupHeader header="Flow description" description="Data required to create a flow."/>
            <TuiFormGroupContent>
                <TuiFormGroupField header="Name" description="Type flow name. Be as descriptive as possible.">
                    <TextField id="flow-name"
                               variant="outlined"
                               label="Flow name"
                               value={flowName}
                               error={(typeof nameErrorMessage !== "undefined" && nameErrorMessage !== '' && nameErrorMessage !== null)}
                               helperText={nameErrorMessage}
                               onChange={(ev) => {
                                   setFlowName(ev.target.value)
                               }}
                               fullWidth
                               size="small"
                    />
                </TuiFormGroupField>
                <TuiFormGroupField header="Description" description="Flow description. Be as descriptive as possible.">
                    <TextField id="flow-description"
                               variant="outlined"
                               label="Flow description"
                               multiline
                               rows={5}
                               value={flowDescription}
                               onChange={(ev) => {
                                   setFlowDescription(ev.target.value)
                               }}
                               fullWidth
                               size="small"
                    />
                </TuiFormGroupField>
            </TuiFormGroupContent>
        </TuiFormGroup>
        <TuiFormGroup>
            <TuiFormGroupHeader header="Settings"/>
            <TuiFormGroupContent>
                <TuiFormGroupField header="Flow tags"
                                   description="Tag the flow with project name to group it into meaningful groups.">
                    <TuiTagger 
                        label="Flow tags"
                        onChange={setFlowTags}
                        tags={projects}
                    />
                </TuiFormGroupField>
            </TuiFormGroupContent>
        </TuiFormGroup>
        <Button label="Save" onClick={onSave} progress={processing} style={{justifyContent: "center"}}/>
    </TuiForm>
}

FlowForm.propTypes = {
    id: PropTypes.string,
    name: PropTypes.string,
    description: PropTypes.string,
    projects: PropTypes.array,
    onFlowSaveComplete: PropTypes.func,
    draft: PropTypes.bool,
    refreshMetaData: PropTypes.bool
}


const mapProps = (state) => {
    return {
        notification: state.notificationReducer,
    }
};
export default connect(
    mapProps,
    {showAlert}
)(FlowForm)
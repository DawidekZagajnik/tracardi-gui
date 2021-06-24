import React, {useState} from "react";
import Button from "./Button";
import TextField from "@material-ui/core/TextField";
import ElevatedBox from "../misc/ElevatedBox";
import FormSubHeader from "../misc/FormSubHeader";
import FormDescription from "../misc/FormDescription";
import Columns from "../misc/Columns";
import Rows from "../misc/Rows";
import Form from "../misc/Form";
import FormHeader from "../misc/FormHeader";
import Switch from "@material-ui/core/Switch";
import {v4 as uuid4} from "uuid";
import {request} from "../../../remote_api/uql_api_endpoint";

export default function SegmentForm({onSubmit, init}) {

    if (!init) {
        init = {
            id: (!init?.id) ? uuid4() : init.id,
            condition: "",
            name: "",
            description: "",
            enabled: false
        }
    }

    const [name, setName] = useState(init.name);
    const [description, setDescription] = useState(init.description);
    const [condition, setCondition] = useState(init.condition);
    const [nameErrorMessage, setNameErrorMessage] = useState(null);
    const [conditionErrorMessage, setConditionErrorMessage] = useState(null);
    const [enabled, setEnabled] = useState(true);
    const [processing, setProcessing] = useState(false);

    const _onSubmit = () => {

        if (!name || name.length === 0) {
            if (!name || name.length === 0) {
                setNameErrorMessage("Source name can not be empty");
            } else {
                setNameErrorMessage(null);
            }
            if (!condition || condition.length === 0) {
                setConditionErrorMessage("Condition can not be empty");
            } else {
                setConditionErrorMessage(null);
            }
            return;
        }

        const payload = {
            id: (!init?.id) ? uuid4() : init.id,
            name: name,
            description: description,
            condition: condition,
            enabled: enabled,
        }
        setProcessing(true);
        request({
                url: '/segment',
                method: 'post',
                data: payload
            },
            setProcessing,
            (e) => {},
            (response) => {
                if(response) {
                    onSubmit(payload)
                }
            },
        )

    }

    return <Form>
        <Columns>
            <FormHeader>Segmentation</FormHeader>
            <ElevatedBox>

                <FormSubHeader>Condition</FormSubHeader>
                <FormDescription>Segments are created after the event is processed.
                    Then Profile properties are evaluated against the condition you type below.
                    If profile meets the requirements then it will be assigned to the segment. </FormDescription>
                <TextField
                    label={"Set segment condition"}
                    value={condition}
                    multiline
                    rows={3}
                    error={conditionErrorMessage}
                    helperText="Condition example: stats.visits>10 AND properties.public.boughtProducts>1"
                    onChange={(ev) => {
                        setCondition(ev.target.value)
                    }}
                    variant="outlined"
                    fullWidth
                />
                <FormSubHeader>Activation</FormSubHeader>
                <FormDescription>Set if this segment is active. </FormDescription>
                <div style={{display: "flex", alignItems: "center"}}>
                    <Switch
                        checked={enabled}
                        onChange={() => setEnabled(!enabled)}
                        name="enabledSegment"
                    />
                    <span>Enable/Disable segment</span>
                </div>

            </ElevatedBox>

            <FormHeader>Describe segment</FormHeader>
            <ElevatedBox>
                <FormSubHeader>Name</FormSubHeader>
                <FormDescription>The segment name will be its id, after spaces are replaced with dashes and letters
                    lowercased
                </FormDescription>
                <TextField
                    label={"Segment name"}
                    error={nameErrorMessage}
                    helperText={nameErrorMessage}
                    value={name}
                    onChange={(ev) => {
                        setName(ev.target.value)
                    }}
                    size="small"
                    variant="outlined"
                    fullWidth
                />

                <FormSubHeader>Description <sup style={{fontSize: "70%"}}>* optional</sup></FormSubHeader>
                <FormDescription>Description will help you to understand when the segment condition is applied.
                </FormDescription>
                <TextField
                    label={"Segment description"}
                    value={description}
                    multiline
                    rows={3}
                    onChange={(ev) => {
                        setDescription(ev.target.value)
                    }}
                    variant="outlined"
                    fullWidth
                />

            </ElevatedBox>
        </Columns>
        <Rows style={{paddingLeft: 30}}>
            <Button label="Save" onClick={_onSubmit} progress={processing}/>
        </Rows>

    </Form>
}
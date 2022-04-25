import Button from "./elements/forms/Button";
import React, {useEffect, useState} from "react";
import {asyncRemote, getApiUrl, resetApiUrlConfig} from "../remote_api/entrypoint";
import CenteredCircularProgress from "./elements/progress/CenteredCircularProgress";
import {BsCloudUpload} from "react-icons/bs";
import PasswordInput from "./elements/forms/inputs/PasswordInput";
import Input from "./elements/forms/inputs/Input";
import ErrorBox from "./errors/ErrorBox";
import ReadOnlyInput from "./elements/forms/ReadOnlyInput";
import {logout} from "./authentication/login";


const InstallerError = ({error, errorMessage, hasAdminAccount}) => {

    if (error) {
        return <ErrorBox>{error}</ErrorBox>
    }

    if (errorMessage) {
        return <ErrorBox>{errorMessage}</ErrorBox>
    }

    if (hasAdminAccount === false) {
        return <ErrorBox>Could not create admin account. Please fill correct e-mail and password.</ErrorBox>
    }

    return ""
}

const InstallerMessage = ({requireAdmin, onInstalled, errorMessage}) => {

    const [progress, setProgress] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [hasAdminAccount, setHasAdminAccount] = useState(null);
    const [error, setError] = useState(null);

    const handleEndpointReset = () => {
        resetApiUrlConfig();
        logout();
        window.location.reload()
    }

    const handleClick = async () => {
        try {
            setError(null);
            setProgress(true);
            setHasAdminAccount(null);
            const response = await asyncRemote({
                url: "/install",
                method: "POST",
                data: {
                    username: email,
                    password: password
                }
            })
            if (response) {
                const result = response.data
                const hasAdmin = result?.admin
                setHasAdminAccount(hasAdmin)
                if (hasAdmin) {
                    onInstalled()
                }
            }
        } catch (e) {
            setError(e.toString())
        } finally {
            setProgress(false);
        }

    }

    return <div style={{display: "flex", alignItems: "center", justifyContent: "center", height: "100%"}}>
        <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: 50,
            width: "70%",
            backgroundColor: "white",
            borderRadius: 10
        }}>
            <BsCloudUpload size={50} style={{color: "#666"}}/>
            <h1 style={{fontWeight: 300}}>Installation required</h1>
            <p>Some parts of the system are missing. Please click install to install required components</p>


            <h2 style={{fontWeight: 300}}>
                {requireAdmin && "Please set-up missing system administrator account"}
                {!requireAdmin && "Please complete installation"}
            </h2>

            <table>
                <tbody>
                <tr>
                    <td colSpan={2}>
                        <ReadOnlyInput label="Tracardi API"
                                       value={getApiUrl()}
                                       onReset={handleEndpointReset}
                        />
                    </td>
                </tr>
                {requireAdmin && <tr>
                    <td><Input label="E-mail" initValue="" onChange={(ev) => setEmail(ev.target.value)}/></td>
                    <td><PasswordInput value={password} onChange={(ev) => setPassword(ev.target.value)}/></td>
                </tr>}
                </tbody>
            </table>

            <Button label="Install" onClick={handleClick} progress={progress} style={{marginTop: 30}} error={error}/>
            <InstallerError error={error} errorMessage={errorMessage} hasAdminAccount={hasAdminAccount}/>
        </div>
    </div>
}

const Installer = ({children}) => {

    const [installed, setInstalled] = useState(false);
    const [hasAdminAccount, setHasAdminAccount] = useState(false);
    const [error, setError] = useState(null);
    const [wait, setWait] = useState(true);

    useEffect(() => {
            let isSubscribed = true;
            if (isSubscribed) setWait(true);
            asyncRemote({
                url: "/install",
            }).then((response) => {
                if (response && isSubscribed) {
                    const result = response.data
                    const hasAllIndices = Array.isArray(result?.missing) && result?.missing.length === 0
                    const hasAdmin = result?.admins?.total !== 0

                    setHasAdminAccount(hasAdmin);
                    setInstalled(hasAllIndices && hasAdmin);
                } else {
                    if (isSubscribed) setInstalled(false);
                }
            }).catch((e) => {
                if (isSubscribed) setError(e.toString());
            }).finally(() => {
                if (isSubscribed) setWait(false)
            })

            return () => isSubscribed = false
        }
        , []);

    if (wait === true) {
        return <CenteredCircularProgress/>
    }

    if (installed === false) {
        return <InstallerMessage
            requireAdmin={!hasAdminAccount}
            onInstalled={() => setInstalled(true)}
            errorMessage={error}
        />
    }

    return children
}

export default Installer;
import { Dialog } from "primereact/dialog";
import { useEffect, useState } from "react";
import changelog from "../../../changelog.json";
import { which_latest_version } from "../../../utils/other";

type ChangesType = {
  "version": string,
  "date": string,
  "changes": {
    "features": string[],
    "fixes": string[],
    "improvements": string[]
  }
}

export default function VersionTracker() {
  const [changes, setChanges] = useState<ChangesType|null>(null);

  useEffect(() => {
    const latestChangelog = changelog[changelog.length - 1];
    cookieStore.get("version").then(currentVersion => {
      if(!currentVersion?.value) {
        return;
      }

      if(currentVersion?.value && which_latest_version(currentVersion.value, latestChangelog.version) === latestChangelog.version) {
        setChanges(latestChangelog);
      }  
    }).finally(() => {
      cookieStore.set("version", latestChangelog.version);
    })
  }, []);

  if(!changes) {
    return <></>;
  }

  return <>
    <Dialog header={
      <div>
        <h1>What's new?</h1>
        <p className="text-sm italic font-thin">Version: {changes.version} [{changes.date}]</p>
      </div>
    } style={{ width: '50vw' }} className="" visible={true} onHide={() => setChanges(null)}>
      {changes.changes.features.length > 0 ? <ChangesGroup label="Features" changes={changes.changes.features} /> : <></>}
      {changes.changes.improvements.length > 0 ? <ChangesGroup label="Improvements" changes={changes.changes.improvements} /> : <></>}
      {changes.changes.fixes.length > 0 ? <ChangesGroup label="Fixes" changes={changes.changes.fixes} /> : <></>}
    </Dialog>
  </>
}

function ChangesGroup(props: { label: string, changes: string[] }): React.ReactNode {
  return <>
      <div className="w-full px-2 pb-6">
        <h1 className="text-xl">{props.label}</h1>
        <ul>
          {props.changes.map((change) => {
            return <li className="list-disc">{change}</li>
          })}
        </ul>
      </div>
  </>;
}
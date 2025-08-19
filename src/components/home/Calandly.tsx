import React, { useEffect } from 'react'
import Cal, { getCalApi } from "@calcom/embed-react";


export default function Calandly() {

    // useEffect(() => {
    //     (async function () {
    //         const cal = await getCalApi({ "namespace": "help" });
    //         cal("ui", { "hideEventTypeDetails": false, "layout": "month_view" });
    //     })();
    // }, [])

    useEffect(() => {

        (async function () {

            const cal = await getCalApi({ "namespace": "help" });

            cal("ui", { "hideEventTypeDetails": false, "layout": "month_view" });

        })();

    }, [])
    // return <Cal namespace="help"
    //     calLink="fixmystore-faheem/help"
    //     style={{ width: "100%", height: "100%", overflow: "scroll" }}
    //     config={{ "layout": "month_view" }}


    // />;

    return <div className="flex justify-center">

        <button data-cal-namespace="help"

            data-cal-link="fixmystore-faheem/help"

            data-cal-config='{"layout":"month_view"}'
            className='download-button'

        >Schedule a call</button>
    </div>


}

import React, { useState, useEffect } from "react";

export default function Timezone() {
    const [timezone, setTimezone] = useState(
        Intl.DateTimeFormat().resolvedOptions().timeZone
    );
    const [timezones, setTimezones] = useState([]);

    useEffect(() => {
        fetch("https://worldtimeapi.org/api/timezone")
            .then((response) => response.json())
            .then((data) => setTimezones(data));
    }, []);

    return (
        <div className="py-6 flex flex-col justify-center relative overflow-hidden sm:py-12">
            <div className="relative px-6 pt-10 pb-8 bg-white shadow-xl ring-1 ring-gray-900/5 sm:max-w-lg sm:mx-auto sm:rounded-lg sm:px-10">
                <div className="max-w-md mx-auto">
                    <div className="divide-y divide-gray-300/50">
                        <div className="py-8 text-base leading-7 space-y-6 text-gray-600">
                            <p>Your timezone is {timezone}</p>
                            <select
                                className="block w-full px-4 py-2 text-base leading-6 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                onChange={(e) => setTimezone(e.target.value)}
                            >
                                {timezones.map((timezone) => (
                                    <option key={timezone} value={timezone}>
                                        {timezone}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

import React, { useEffect, useState } from 'react'

export default function CountdownTimer() {
    const [timeLeft, setTimeLeft] = useState({
        hours: 0,
        minutes: 5,
        seconds: 0
    });

    useEffect(() => {
        // Set end time to 5 minutes from when component mounts
        const endTime = Date.now() + (5 * 60 * 1000);

        const updateTimer = () => {
            const now = Date.now();
            const difference = endTime - now;

            if (difference > 0) {
                const minutes = Math.floor(difference / (1000 * 60));
                const seconds = Math.floor((difference % (1000 * 60)) / 1000);

                setTimeLeft({ hours: 0, minutes, seconds });
            } else {
                setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
            }
        };

        // Update immediately
        updateTimer();

        // Update every second
        const timer = setInterval(updateTimer, 1000);

        return () => clearInterval(timer);
    }, []);

    const formatTime = (num: number) => num.toString().padStart(2, '0');

    return (
        <div className="flex items-center space-x-1">
            {/* Minutes - First digit */}
            <div className="bg-white rounded-sm px-1 py-1/2">
                <span className="text-black font-mono font-bold text-md">
                    {formatTime(timeLeft.minutes)[0]}
                </span>
            </div>

            {/* Minutes - Second digit */}
            <div className="bg-white rounded-sm px-1 py-1/2">
                <span className="text-black font-mono font-bold text-md">
                    {formatTime(timeLeft.minutes)[1]}
                </span>
            </div>

            {/* Colon separator */}
            <div className="flex flex-col space-y-1">
                <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
            </div>

            {/* Seconds - First digit */}
            <div className="bg-white rounded-sm px-1 py-1/2">
                <span className="text-black font-mono font-bold text-md">
                    {formatTime(timeLeft.seconds)[0]}
                </span>
            </div>

            {/* Seconds - Second digit */}
            <div className="bg-white rounded-sm px-1 py-1/2">
                <span className="text-black font-mono font-bold text-md">
                    {formatTime(timeLeft.seconds)[1]}
                </span>
            </div>
        </div>
    );
}

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
        <span>
            {formatTime(timeLeft.minutes)}:{formatTime(timeLeft.seconds)}
        </span>
    );
}

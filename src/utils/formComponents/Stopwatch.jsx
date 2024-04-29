import React, { useState, useEffect } from 'react';

function Stopwatch() {
    const [time, setTime] = useState(0);
    const [timerOn, setTimerOn] = useState(false);

    useEffect(() => {
        let interval = null;

        if (timerOn) {
            interval = setInterval(() => {
                setTime(prevTime => prevTime + 10); // Increment the time by 10 milliseconds
            }, 10);
        } else {
            clearInterval(interval);
        }

        return () => clearInterval(interval);
    }, [timerOn]);

    const startTimer = () => {
        setTimerOn(true);
    };

    const stopTimer = () => {
        setTimerOn(false);
    };

    const resetTimer = () => {
        setTimerOn(false);
        setTime(0);
    };

    return (
        <div>
            <h1>Stopwatch</h1>
            <div>
                <span>{("0" + Math.floor((time / 3600000) % 60)).slice(-2)}:</span>
                <span>{("0" + Math.floor((time / 60000) % 60)).slice(-2)}:</span>
                <span>{("0" + Math.floor((time / 1000) % 60)).slice(-2)}.</span>
                <span>{("0" + ((time / 10) % 100)).slice(-2)}</span>
            </div>
            {!timerOn && time === 0 && (
                <button onClick={startTimer}>Start</button>
            )}
            {timerOn && (
                <button onClick={stopTimer}>Stop</button>
            )}
            {!timerOn && time !== 0 && (
                <button onClick={startTimer}>Resume</button>
            )}
            {!timerOn && time > 0 && (
                <button onClick={resetTimer}>Reset</button>
            )}
        </div>
    );
}

export default Stopwatch;

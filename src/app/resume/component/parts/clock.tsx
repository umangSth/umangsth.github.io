interface ClockProps {
    hourAngle: number;
    minuteAngle: number;
}

export const Clock = (props: ClockProps) => {
    return (
<div id='clock' 
        className="aboslute top-9/12 z-12"
        >
        <svg viewBox="0 0 50 50" className="h-15 w-15">
            <circle cx="25" cy="25" r="20" className="stroke-current stroke-4 fill-none" />

            <line x1="25" y1="7" x2="25" y2="10" className="stroke-current stroke-2" />
            <line x1="25" y1="40" x2="25" y2="43" className="stroke-current stroke-2" />
            <line x1="40" y1="25" x2="43" y2="25" className="stroke-current stroke-2" />
            <line x1="7" y1="25" x2="10" y2="25" className="stroke-current stroke-2" />
            {/* long hand */}
            <line x1="25" y1="25" x2="25" y2="16"
                className="stroke-current stroke-2 origin-center"
                style={{ transform: `rotate(${props.hourAngle}deg)`, transformOrigin: '25px 25px' }} />
            {/* short hand */}
            <line x1="25" y1="25" x2="25" y2="10"
                className="stroke-current stroke-1 origin-center"
                style={{ transform: `rotate(${props.minuteAngle}deg)`, transformOrigin: '25px 25px' }} />

            <circle cx="25" cy="25" r="1.5" className="fill-current" />
        </svg>
    </div>
    )}
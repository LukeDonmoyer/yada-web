import { useState } from 'react';

export interface ToggleSwitchProps {
    enabledDefault: boolean;
    onEnable?: () => void;
    onDisable?: () => void;
}

export function ToggleSwitch({
    enabledDefault,
    onEnable,
    onDisable,
}: ToggleSwitchProps) {
    const [enabled, setEnabled] = useState(enabledDefault);

    const handleClick = () => {
        if (enabled) {
            if (onDisable) onDisable();
            setEnabled(false);
        } else {
            if (onEnable) onEnable();
            setEnabled(true);
        }
    };

    return (
        <div className="toggleSwitch" onClick={handleClick}>
            <div className="background" />
            <div className={enabled ? 'slider-on' : 'slider-off'} />
        </div>
    );
}

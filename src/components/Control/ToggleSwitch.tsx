import { useState } from 'react';

export interface ToggleSwitchProps {
    // Default state of toggle
    enabledDefault: boolean;

    // Handler for when the switch is enabled
    onEnable?: () => void;

    // Handler for when the switch is disabled
    onDisable?: () => void;
}

/**
 * Creates a simple toggle switch.
 *
 * @constructor
 */
export function ToggleSwitch({
    enabledDefault,
    onEnable,
    onDisable,
}: ToggleSwitchProps) {
    const [enabled, setEnabled] = useState(enabledDefault);

    const handleClick = () => {
        if (enabled) {
            onDisable?.();
            setEnabled(false);
        } else {
            onEnable?.();
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

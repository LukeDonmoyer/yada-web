import { useState } from 'react';

export interface ToggleSwitchProps {
    // Default state of toggle
    enabledDefault: boolean;
    enabled?: boolean; // uses passed in state rather than this components own state

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
export function ToggleSwitch(props: ToggleSwitchProps) {
    const [selfEnabled, setEnabled] = useState(props.enabledDefault);

    const handleClick = () => {
        if (props.enabled !== undefined) {
            if (props.enabled) {
                props.onDisable?.();
            } else {
                props.onEnable?.();
            }
            return;
        }
        if (selfEnabled) {
            props.onDisable?.();
            setEnabled(false);
        } else {
            props.onEnable?.();
            setEnabled(true);
        }
    };

    return (
        <div className="toggleSwitch" onClick={handleClick}>
            <div className="background" />
            {props.enabled === undefined ? (
                <div className={selfEnabled ? 'slider-on' : 'slider-off'} />
            ) : (
                <div className={props.enabled ? 'slider-on' : 'slider-off'} />
            )}
        </div>
    );
}

import React, { ReactElement } from 'react';

interface StatisticProps {
    // Number to display
    value: number;

    // CSS classname of value
    valueClassName?: string;

    // Label to display along with value
    label: string;
}

/**
 * Simple component to display a number along with some explanatory text with styling.
 *
 * @param value The value to display.
 * @param valueClassName The CSS classname of value.
 * @param label Label to display along with value.
 * @constructor
 */
export default function Statistic({
    value,
    valueClassName,
    label,
}: StatisticProps): ReactElement {
    return (
        <div className={'statistic'}>
            <div className={valueClassName ?? 'statistic-value'}>{value}</div>
            {label}
        </div>
    );
}

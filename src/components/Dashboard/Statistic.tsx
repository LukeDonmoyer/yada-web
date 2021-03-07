import React, { ReactElement } from 'react';

import './statistic.scss';

interface StatisticProps {
    value: number;
    valueClassName?: string;
    label: string;
}

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

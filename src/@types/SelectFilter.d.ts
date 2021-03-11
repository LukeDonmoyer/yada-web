import { Component } from 'react';
export default class SelectFilter extends Component {
    constructor(props: any);
    UNSAFE_componentWillReceiveProps({
        filterValue: { value },
    }: {
        filterValue: {
            value: any;
        };
    }): void;
    onChange(value: any): void;
    onStartChange(start: any): void;
    onEndChange(end: any): void;
    setValue(value: any): void;
    onValueChange(value: any): void;
    render(): any;
}

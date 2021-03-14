/**
 * Button component to consistently style buttons
 *
 * props:
 * - type: ButtonType enum - this conditionally renders different styles
 * - text?: text to go in the button
 * - icon?: optional icon to go in the button (not yet implemented)
 * - onClick?: optional callback to perform
 * - align?: optional alignment
 */
interface ButtonProps {
    type: ButtonType;
    text?: string;
    icon?: any;
    onClick?: any;
    align?: any;
}

export enum ButtonType {
    tableControl = 'tableControl',
    alert = 'alert',
    warning = 'warning',
    loggerInfoShow = 'loggerInfoShow',
}

export default function Button(props: ButtonProps) {
    return (
        <div
            className={`button ${props.type} ${props.align ? props.align : ''}`}
            onClick={props.onClick}
        >
            {props.text}
        </div>
    );
}

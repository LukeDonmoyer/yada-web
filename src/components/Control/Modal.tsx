import React, { ReactElement } from 'react';

interface ModalProps {
    // The boolean condition on which to show the modal
    show: boolean;

    // The elements to display inside the modal
    children?: ReactElement | ReactElement[];

    // The event handler for if the modal is clicked outside
    onClickOutside?: () => void;
}

export default function Modal({
    show,
    children,
    onClickOutside,
}: ModalProps): ReactElement {
    if (!show) return <></>;

    return (
        <>
            <div
                className={'screenDarken'}
                onClick={() => onClickOutside?.()}
            />
            <div className={'modal'}>{children}</div>
        </>
    );
}

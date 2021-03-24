/**
 * This component accepts a required privilege, and renders the children components only if the required privilege is met
 */
import { ReactElement } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from 'store/rootReducer';

export interface PrivilegeAssertProps {
    // privilege required for rendering the children
    requiredPrivilege: string;
    // children that will only be rendered if privilege is met
    children: ReactElement | ReactElement[];
}

export default function PrivilegeAssert(props: PrivilegeAssertProps) {
    // watches privilege level in redux store
    const userPrivilege = useSelector(
        (state: RootState) => state.auth.privilege
    );

    // casts privilege string to a number
    const castPrivilegeToNumber = (privilege: string) => {
        switch (privilege) {
            case 'Owner':
                return 3;
            case 'Admin':
                return 2;
            case 'Power':
                return 1;
            case 'User':
                return 0;
            default:
                return -1;
        }
    };

    // conditionally renders children
    if (
        castPrivilegeToNumber(userPrivilege) >=
        castPrivilegeToNumber(props.requiredPrivilege)
    ) {
        return <>{props.children}</>;
    } else {
        return <></>;
    }
}

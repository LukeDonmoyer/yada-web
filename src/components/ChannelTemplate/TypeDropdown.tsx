import React, { ReactElement, useState } from 'react';
import {
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownToggle,
} from 'reactstrap';

interface TypeDropdownProps {
    // The current value the dropdown should display.
    value?: string;

    // Callback for when an option is selected.
    onValueSelected: (value: string) => void;
}

/**
 * A component that creates a dropdown of all possible channel result types.
 *
 * @constructor
 */
export default function TypeDropdown({
    value,
    onValueSelected,
}: TypeDropdownProps): ReactElement {
    const [dropDownOpen, setDropDownOpen] = useState(false);
    const [selectedType, setSelectedType] = useState(value);

    function selected(value: string): () => void {
        return () => {
            setSelectedType(value);
            onValueSelected(value);
        };
    }

    function createDropDownItem(name: string): ReactElement {
        return <DropdownItem onClick={selected(name)}>{name}</DropdownItem>;
    }

    return (
        <div className={'bootStrapStyles'}>
            <Dropdown
                className={'fixedWidth'}
                isOpen={dropDownOpen}
                toggle={() => setDropDownOpen(!dropDownOpen)}
            >
                <DropdownToggle caret>{selectedType}</DropdownToggle>
                <DropdownMenu>
                    {['boolean', 'string', 'number', 'date'].map(
                        createDropDownItem
                    )}
                </DropdownMenu>
            </Dropdown>
        </div>
    );
}

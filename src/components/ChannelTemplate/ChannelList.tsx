import { ReactElement, useState } from 'react';
import { ChannelTemplate } from '../../store/FirestoreInterfaces';
import {
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownToggle,
} from 'reactstrap';
import { setLoggerChannelTemplate } from '../../scripts/Implementation';

interface ChannelListProps {
    // The template object to get data from.
    template: ChannelTemplate;
}

export default function ChannelList({
    template,
}: ChannelListProps): ReactElement {
    function createRows(channels: Map<string, string>) {
        const rows: ReactElement[] = [];
        let counter = 1;

        for (let [key, value] of Object.entries(channels)) {
            rows.push(
                <ChannelRow
                    name={key}
                    scriptFile={value}
                    keys={template.keys}
                    index={counter++}
                />
            );
        }

        return rows;
    }

    return (
        <div className={'scriptTable'}>
            <div className={'row headerHighlight'}>
                <div className={'column'}>
                    <div className={'headerAlign'}>
                        <h2>Channel Name</h2>
                    </div>
                </div>
                <div className={'column'}>
                    <h2>Script</h2>
                </div>
            </div>
            <div className={'scrollable'}>{createRows(template.channels)}</div>
        </div>
    );
}

interface ChannelRowProps {
    name: string;
    scriptFile: string;
    index: number;
    keys: Map<string, string>;
}

function ChannelRow({
    name,
    scriptFile,
    keys,
    index,
}: ChannelRowProps): ReactElement {
    const [expanded, setExpanded] = useState(false);

    function createKeys(keys: Map<string, string>) {
        const result: { name: string; type: string }[] = [];
        for (let [key, value] of Object.entries(keys)) {
            result.push({ name: key, type: value });
        }

        return result;
    }

    return (
        <>
            <div className={`row ${index % 2 === 0 ? 'highlight' : ''}`}>
                <div className={'column'}>
                    <div className={''}>
                        {expanded ? (
                            <svg
                                onClick={() => setExpanded(!expanded)}
                                viewBox="0 0 24 24"
                            >
                                <path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z" />
                            </svg>
                        ) : (
                            <svg
                                onClick={() => setExpanded(!expanded)}
                                viewBox="0 0 24 24"
                            >
                                <path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z" />
                            </svg>
                        )}
                        {name}
                    </div>
                </div>
                <div className={'column'}>{scriptFile}</div>
            </div>
            <div
                className={`${expanded ? 'expandable' : 'hidden'} ${
                    index % 2 === 0 ? 'highlight' : ''
                }`}
            >
                <div className={'row'}>
                    <div className={'column'}>
                        <h2>Value Name</h2>
                    </div>
                    <div className={'column'}>
                        <h2>:</h2>
                    </div>
                    <div className={'column'}>
                        <h2>Value Type</h2>
                    </div>
                </div>
                {createKeys(keys).map(({ name, type }) => (
                    <KeyType name={name} type={type} />
                ))}
            </div>
        </>
    );
}

interface KeyTypeProps {
    name: string;
    type: string;
}

function KeyType({ name, type }: KeyTypeProps): ReactElement {
    const [dropDownOpen, setDropDownOpen] = useState(false);
    const [selectedType, setSelectedType] = useState(type);

    function createDropDownItem(name: string): ReactElement {
        return (
            <DropdownItem
                onClick={() => {
                    setSelectedType('boolean');
                    //TODO: replace with setting channel type
                }}
            >
                {name}
            </DropdownItem>
        );
    }

    return (
        <div className={'row'}>
            <div className={'column'}>
                <div>{name}</div>
            </div>
            <div className={'column'}>:</div>
            <div className={'column'}>
                <div className={'bootStrapStyles'}>
                    <Dropdown
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
            </div>
        </div>
    );
}

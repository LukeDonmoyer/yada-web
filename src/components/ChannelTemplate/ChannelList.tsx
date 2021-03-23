import { ReactElement, useState } from 'react';
import { ChannelTemplate } from '../../store/FirestoreInterfaces';

interface ChannelListProps {
    // The template object to get data from.
    template: ChannelTemplate;
}

export default function ChannelList({
    template,
}: ChannelListProps): ReactElement {
    function createRows(channels: Map<string, string>) {
        const rows: ReactElement[] = [];

        for (let [key, value] of Object.entries(channels)) {
            rows.push(<ChannelRow name={key} scriptFile={value} />);
        }

        return rows;
    }

    return (
        <table>
            <thead>
                <tr>
                    <th>Channel Name</th>
                    <th>Script</th>
                </tr>
            </thead>
            <tbody>{createRows(template.channels)}</tbody>
        </table>
    );
}

interface ChannelRowProps {
    name: string;
    scriptFile: string;
}

function ChannelRow({ name, scriptFile }: ChannelRowProps): ReactElement {
    const [expanded, setExpanded] = useState(false);

    return (
        <>
            <tr>
                <td>
                    {expanded ? (
                        <svg
                            onClick={() => setExpanded(!expanded)}
                            className={'expandIcon'}
                            viewBox="0 0 24 24"
                        >
                            <path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z" />
                        </svg>
                    ) : (
                        <svg
                            onClick={() => setExpanded(!expanded)}
                            className={'expandIcon'}
                            viewBox="0 0 24 24"
                        >
                            <path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z" />
                        </svg>
                    )}
                    {name}
                </td>
                <td>{scriptFile}</td>
            </tr>
            <div className={`${expanded ? 'expandContent' : 'hidden'}`}>
                Hello World
            </div>
        </>
    );
}

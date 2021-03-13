import { Data, Headers } from 'react-csv/components/CommonPropTypes';
import React, { ReactElement, useRef, useState } from 'react';
import { CSVLink } from 'react-csv';
import Button, { ButtonType } from './Button';

interface CsvDownloadButtonProps {
    // Label for the button
    label?: string;

    // Headers for the csv file
    headers: Headers;

    // Filename for the csv file tod download
    filename: string;

    align?: string;

    // Function that creates the dsv data, this will be run asynchronously
    createData: () => Data;
}

/**
 * Creates a button to download a csv file from the given data.
 */
export default function CsvDownloadButton({
    label,
    headers,
    filename,
    align,
    createData,
}: CsvDownloadButtonProps): ReactElement {
    const [data, setData] = useState<Data>([]);
    const ref = useRef(null);

    let getData = async () => {
        setData(createData());
        setTimeout(() => {
            (ref.current as any).link.click();
        });
    };

    return (
        <>
            <CSVLink
                headers={headers}
                filename={filename}
                data={data}
                ref={ref}
            />
            <Button
                align={align}
                type={ButtonType.tableControl}
                text={label ? label : 'Download CSV'}
                onClick={getData}
            />
            {/* <div className={'csvDownloadButton'} onClick={getData}>
                {label ? label : 'Download CSV'}
            </div> */}
        </>
    );
}

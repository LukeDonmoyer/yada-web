import { Data, Headers } from 'react-csv/components/CommonPropTypes';
import { ReactElement, useRef, useState } from 'react';
import { CSVLink } from 'react-csv';

interface CsvDownloadButtonProps {
    headers: Headers;
    filename: string;
    createData: () => Data;
}

export default function CsvDownloadButton({
    headers,
    filename,
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
            <div className={'csvDownloadButton'} onClick={getData}>
                download csv
            </div>
        </>
    );
}

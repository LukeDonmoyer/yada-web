import { ReactElement } from "react";
import { CSVLink } from "react-csv";
import { filterByDate, parseFilterString } from "scripts/DataTransformer";

interface DashboardCSVProps {
    loggerName: string,
    data: any[],
    filter: string,
    channels: string[]
}

export default function DashboardCSV({ loggerName, data, filter, channels }: DashboardCSVProps): ReactElement {

    // Filename example: "logger1_3-8-16.csv"
    let filename: string = `${loggerName}_${new Date().toLocaleDateString().replace(/\//g, '-')}.csv`;
    let filteredData: any[] = data.filter((d: any) => filterByDate(d["timestamp"], parseFilterString(filter)));

    return (
        <CSVLink 
            data={filteredData}
            filename={filename}
            headers={channels}
        >Link</CSVLink>
    );
}
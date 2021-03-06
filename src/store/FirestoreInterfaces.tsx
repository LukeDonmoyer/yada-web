export interface SiteCollection {
    [key: string]: SiteObject;
}
export interface SiteObject {
    address: string;
    equipmentUnits: EquipmentUnit[];
    name: string;
    notes: string;
}

export interface EquipmentUnit {
    faults: Fault[];
    loggers: string[];
    name: string;
    health: string;
    type: string;
}

export interface Fault {
    timestamp: number;
    message: string;
}

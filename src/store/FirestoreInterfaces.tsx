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
    faults: string[];
    loggers: string[];
    name: string;
    health: string;
    type: string;
}

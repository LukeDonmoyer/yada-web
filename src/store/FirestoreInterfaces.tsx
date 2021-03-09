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

export interface LoggerCollection {
    [key: string]: LoggerObject;
}

export interface LoggerObject {
    channelTemplate: string;
    collectingData: boolean;
    data: any[];
    equipment: string;
    ip: string;
    mac: string;
    notes: string;
    site: string;
    status: boolean;
    uptime: any;
    name: string;
}

export interface Fault {
    timestamp: number;
    message: string;
}

export interface UserCollection {
    [key: string]: User;
}

export interface User {
    defaults: boolean;
    email: string;
    disabled: boolean;
    phoneNumber: string | null;
    userGroup: string;
    emailNotifications?: boolean;
    smsNotifications?: boolean;
}

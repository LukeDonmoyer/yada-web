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
}

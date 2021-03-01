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
}

export interface UserCollection {
  [key: string]: User;
}

export interface User {
  defaults: boolean;
  email: string;
  phoneNumber: string;
  userGroup: string;
  emailNotifications?: boolean;
  smsNotifications?: boolean;
}

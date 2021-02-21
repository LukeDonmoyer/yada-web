export interface SiteObject {
  address: string;
  name: string;
  notes: string;
  equipmentUnits: {
    equipmentID: {
      faults: [];
      loggers: [];
    };
  };
  userNotifications: {};
}

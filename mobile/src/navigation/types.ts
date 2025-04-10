export type RootStackParamList = {
  MeasurementForm: undefined;
  PatientList: undefined;
  Report: { patientId: number };
  Evolution: { patientId: number };
};

// Extender os tipos globais do React Navigation
declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
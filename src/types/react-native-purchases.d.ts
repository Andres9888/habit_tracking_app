declare module 'react-native-purchases' {
  export type PurchasesPackage = any;
  export type CustomerInfo = any;
  export type PurchasesError = any;
  export type CustomerInfoUpdateListener = (info: CustomerInfo) => void;

  export const PACKAGE_TYPE: any;
  export const LOG_LEVEL: any;

  const Purchases: any;
  export default Purchases;
}

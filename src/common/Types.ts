export interface LoginResponse {
  access_token: string;
  token_type: string;
  user_data: User;
}

export interface User {
  name: string;
  email: string;
}

export interface Airport {
  airportId: number;
  codeIataAirport: string;
  nameAirport: string;
  codeIso2Country: string;
  codeIcaoAirport: string;
  codeIataCity: string;
  latitudeAirport: string;
  longitudeAirport: string;
  timezone: string;
  GMT: number;
  isRailRoad: number;
  isBusStation: number;
  nameTranslations: string;
  popularity: number;
  phone: string | null;
  website: string | null;
  geonameId: number;
  routes: number;
  nameCountry: string;
  FIELD20: null;
  FIELD21: null;
}

export interface City {
  cityId: number;
  codeIataCity: string;
  codeIso2Country: string;
  nameCity: string;
  latitudeCity?: string;
  longitudeCity?: string;
  timezone?: string;
  GMT?: number;
  new_airports?: Airport[];
}

export interface PassengerCounts {
  adults: number;
  children: number;
  babies: number;
}

export interface Errors {
  departureCity?: string;
  arrivalCity?: string;
  dateTime?: string;
  passengers?: string;
}

export interface FlightRecommendation {
  paxFareProduct: PaxFareProduct[];
  recPriceInfo: RecPriceInfo;
}

export interface PaxFareProduct {
  paxFareDetail: PaxFareDetail;
  fareDetails: FareDetail[];
}

export interface PaxFareDetail {
  codeShareDetails: CodeShareDetail[];
}

export interface CodeShareDetail {
  company: string;
}

export interface FareDetail {
  groupOfFares: GroupOfFare[];
}

export interface GroupOfFare {
  productInformation: ProductInformation;
}

export interface ProductInformation {
  fareProductDetail: FareProductDetail;
}

export interface FareProductDetail {
  fareBasis: string;
}

export interface RecPriceInfo {
  monetaryDetail: MonetaryDetail[];
}

export interface MonetaryDetail {
  amount: string;
  currency?: string;
}

export interface FlightSegment {
  num: string;
  segments: SegmentDetail[];
}

export interface SegmentDetail {
  attributeDetail: {
    attributeDescription: string;
    attributeType: string;
  };
  companyId: {
    marketingCarrier: string;
    operatingCarrier?: string;
  };
  equipment: string;
  flightOrtrainNumber: string;
  location: LocationDetail[];
  productDateTime: {
    dateOfDeparture: string;
    timeOfDeparture: string;
    dateOfArrival: string;
    timeOfArrival: string;
    dateFormatDeparture: string;
    dateFormatArrival: string;
    dayDeparture: string;
    dayArrival: string;
    timeDepartureSeconds: number;
    timeArrivalSeconds: number;
  };
}

export interface LocationDetail {
  locationId: string;
  locationName: string;
  terminal?: string;
}

export interface FlightRequest {
  direct: boolean;
  currency: string;
  searchs: number;
  class: boolean;
  qtyPassengers: number;
  adult: number;
  child: number;
  baby: number;
  seat: number;
  itinerary: {
    departureCity: string;
    arrivalCity: string;
    hour: string;
  }[];
}

export interface FlightResponse {
  status: number;
  data: {
    Seg1: Segment[];
    recommendation: Recommendation[];
    bag: Bag;
    companies: string[];
    priceMax: string;
    priceMin: string;
    hour: Hour[];
  };
}

interface Segment {
  segments: SegmentDetail[];
  num: string;
}

export interface SegmentDetail {
  productDateTime: ProductDateTime;
  location: Location[];
  companyId: CompanyId;
  companyName: string;
  flightOrtrainNumber: string;
  attributeDetail: AttributeDetail;
  equipment: string;
  technicalStop: [];
}

interface ProductDateTime {
  dateOfDeparture: string;
  timeOfDeparture: string;
  dateOfArrival: string;
  timeOfArrival: string;
  dayDeparture: string;
  dateFormatDeparture: string;
  dayArrival: string;
  dateFormatArrival: string;
  timeDepartureSeconds: number;
  timeArrivalSeconds: number;
}

interface Location {
  locationId: string;
  locationName: string;
  terminal?: string;
}

interface CompanyId {
  marketingCarrier: string;
  operatingCarrier?: string;
}

interface AttributeDetail {
  attributeType: string;
  attributeDescription: string;
}

interface Recommendation {
  itemNumber: ItemNumber;
  recPriceInfo: RecPriceInfo;
  segmentFlightRef: SegmentFlightRef[];
  paxFareProduct: PaxFareProduct[];
  bag: number[];
  seg: {
    Seg1: SegRef[];
  };
}

interface ItemNumber {
  itemNumberId: {
    number: string;
  };
}

export interface RecPriceInfo {
  monetaryDetail: MonetaryDetail[];
}

export interface MonetaryDetail {
  amount: string;
}

interface SegmentFlightRef {
  referencingDetail: ReferencingDetail[];
}

interface ReferencingDetail {
  refQualifier: string;
  refNumber: number;
}

export interface PaxFareProduct {
  paxFareDetail: PaxFareDetail;
  paxReference: PaxReference;
  fare: Fare[];
  fareDetail: FareDetails[];
}

export interface PaxFareDetail {
  paxFareNum: string;
  totalFareAmount: string;
  totalTaxAmount: string;
  codeShareDetails: CodeShareDetail[];
  pricingTicketing: {
    priceType: string;
  };
}

export interface CodeShareDetail {
  transportStageQualifier?: string;
  company: string;
}

export interface PaxReference {
  ptc: string;
  traveller: Traveller[];
}

export interface Traveller {
  ref: number;
}

export interface Fare {
  pricingMessage: PricingMessage;
}

interface PricingMessage {
  freeTextQualification: FreeTextQualification;
  description: string | string[];
}

interface FreeTextQualification {
  textSubjectQualifier: string;
  informationType: string;
}

export interface FareDetails {
  segmentRef: {
    segRef: number;
  };
  groupOfFares: GroupOfFare[];
  majCabin: MajCabin;
}

export interface GroupOfFare {
  productInformation: ProductInformation;
}

export interface ProductInformation {
  cabinProduct: CabinProduct;
  fareProductDetail: FareProductDetail;
  breakPoint: string;
}

interface CabinProduct {
  rbd: string;
  cabin: string;
  avlStatus: string;
}

export interface FareProductDetail {
  fareBasis: string;
  passengerType: string;
  fareType: string;
}

interface MajCabin {
  bookingClassDetails: {
    designator: string;
  };
}

interface SegRef {
  refQualifier: string;
  refNumber: number;
}

interface Bag {
  serviceTypeInfo: {
    carrierFeeDetails: {
      type: string;
    };
  };
  serviceCoverageInfoGrp: ServiceCoverageInfoGrp[];
  globalMessageMarker: Record<string, unknown>;
  freeBagAllowanceGrp: FreeBagAllowanceGrp[];
}

interface ServiceCoverageInfoGrp {
  itemNumberInfo: {
    itemNumber: {
      number: string;
    };
  };
  serviceCovInfoGrp: ServiceCovInfoGrp[];
}

interface ServiceCovInfoGrp {
  paxRefInfo: {
    travellerDetails: {
      referenceNumber: string;
    };
  };
  coveragePerFlightsInfo: CoveragePerFlightsInfo[];
  refInfo: {
    referencingDetail: ReferencingDetail;
  };
}

interface CoveragePerFlightsInfo {
  numberOfItemsDetails: {
    referenceQualifier: string;
    refNum: string;
  };
  lastItemsDetails: LastItemDetail[];
}

interface LastItemDetail {
  refOfLeg: string;
}

interface FreeBagAllowanceGrp {
  freeBagAllownceInfo: {
    baggageDetails: BaggageDetails;
  };
  itemNumberInfo: {
    itemNumberDetails: {
      number: number;
    };
  };
}

interface BaggageDetails {
  freeAllowance: number;
  quantityCode: string;
}

interface Hour {
  max: number;
  min: number;
}

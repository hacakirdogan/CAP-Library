namespace route;

using {
    managed,
    sap,
    cuid
} from '@sap/cds/common';

entity Customers : cuid, managed {
    customer  : String;
    latitude  : Decimal;
    longitude : Decimal;
    waiting   : Integer;
}

entity Vehicles : cuid {
    vehicle   : String;
    latitude  : Decimal;
    longitude : Decimal;
    start     : Time;
    end       : Time;
}

entity Route : cuid {
    vehicle   : String;
    customer  : String;
    arrival   : Time;
    departure : Time;
    distance  : Integer;
}

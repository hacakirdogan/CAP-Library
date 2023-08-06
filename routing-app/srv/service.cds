using {route} from '../db/schema';

service RouteService @(path: '/browse') {
    entity Customers as projection on route.Customers;
    annotate Customers with @odata.draft.enabled;
    entity Vehicles  as projection on route.Vehicles;
    annotate Vehicles with @odata.draft.enabled;
}

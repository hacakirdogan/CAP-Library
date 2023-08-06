using RouteService from './service';

annotate RouteService.Customers with {
    customer  @title: 'Customer';
    latitude  @title: 'Latitude';
    longitude @title: 'Longitude';
    waiting   @title: 'Waiting';
    demand    @title: 'Demand';
}

annotate RouteService.Customers with @(UI: {
    HeaderInfo     : {
        TypeName      : 'Customer',
        TypeNamePlural: 'Customers',
        Title         : {
            $Type: 'UI.DataField',
            Value: customer
        }
    },
    SelectionFields: [customer],
    LineItem       : [
        {Value: customer},
        {Value: latitude},
        {Value: longitude},
        {Value: waiting},
        {Value: demand},
    ],
}, );

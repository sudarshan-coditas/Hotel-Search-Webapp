import { environment } from '../../environments/environment';

export class ApiEndPoints {
    static  HOTEL_SEARCH_INIT = environment.BASE_URL + '/hotel/v1.0/search/init';

    static HOTEL_SEARCH_STATUS = environment.BASE_URL + '/hotel/v1.0/search/status';

    static HOTEL_SEARCH_RESULTS = environment.BASE_URL + '/hotel/v1.0/search/results';
}

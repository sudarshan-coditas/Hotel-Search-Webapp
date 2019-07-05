export class InitHotelSearch {
  sessionId?: string;
  paging?: {
    pageNo: number,
    pageSize: number,
    orderBy: string
  };
  posId: string;
  roomOccupancies: [
    {
      occupants: [
        {
          type: string;
          age: number;
        }
      ]
    }
  ];
  contentPrefs: string[];
  stayPeriod: {
    start: string;
    end: string;
  };
  bounds: {
    circle: {
      center: {
        lat: null;
        long: null;
      };
      radiusKm: 50.5
    }
  };
  constructor() { }
}

export const DEFAULT_INIT_HOTEL_SEARCH: InitHotelSearch = {
  posId: 'hbg3h7rf28',
  stayPeriod: {
    start: '',
    end: ''
  },
  contentPrefs: [
    'Basic',
    'Activities',
    'Amenities',
    'Policies',
    'AreaAttractions',
    'Descriptions',
    'Images',
    'CheckinCheckoutPolicy',
    'All'
 ],
  roomOccupancies: [
    {
      occupants: [
        {
          type: 'Adult',
          age: 25
        }
      ]
    }
  ],
  bounds: {
    circle: {
      center: {
        lat: null,
        long: null
      },
      radiusKm: 50.5
    }
  }
};

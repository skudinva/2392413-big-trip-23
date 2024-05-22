const mockOffer = [
  {
    type: 'taxi',
    offers: [
      {
        id: '308ddfd6-2210-4898-ad9b-83a535d1e25c',
        title: 'Upgrade to a business class',
        price: 30,
      },
      {
        id: '78f0c8e4-99e7-4b03-a995-2a122ed85637',
        title: 'Choose the radio station',
        price: 161,
      },
      {
        id: '83c1655d-fdf7-4261-b9c1-7d659b8a8927',
        title: 'Choose temperature',
        price: 46,
      },
      {
        id: '5a1cf792-72f0-4ec6-9b28-06bad1c4cc19',
        title: "Drive quickly, I'm in a hurry",
        price: 168,
      },
      {
        id: '4a46a566-f100-4579-9fcd-4b0ae7554f5f',
        title: 'Drive slowly',
        price: 58,
      },
    ],
  },
  {
    type: 'bus',
    offers: [
      {
        id: 'c60f8f41-8b60-48c7-a296-dd197b2cc936',
        title: 'Infotainment system',
        price: 76,
      },
      {
        id: 'a7e63af7-c087-43d2-85c6-bd31c0cc7eeb',
        title: 'Order meal',
        price: 31,
      },
      {
        id: '4f3970a0-754f-46a7-9ae2-6275b49aae75',
        title: 'Choose seats',
        price: 171,
      },
    ],
  },
  {
    type: 'train',
    offers: [
      {
        id: 'b509b6c3-2348-4fed-8161-47e7256ab25b',
        title: 'Book a taxi at the arrival point',
        price: 133,
      },
      {
        id: '43c3fd35-d145-49a9-9dfa-e453590e538f',
        title: 'Order a breakfast',
        price: 86,
      },
      {
        id: '6beb0d02-42e9-451d-aba0-5092947f8bbf',
        title: 'Wake up at a certain time',
        price: 82,
      },
    ],
  },
  {
    type: 'flight',
    offers: [
      {
        id: 'd13adb5a-ecee-4177-8850-243aee7d7e63',
        title: 'Choose meal',
        price: 118,
      },
      {
        id: 'e3714299-9568-4aba-8be2-90d9d91cdebe',
        title: 'Choose seats',
        price: 176,
      },
      {
        id: '6c1e1297-122b-456b-b81c-a9304a72f951',
        title: 'Upgrade to comfort class',
        price: 109,
      },
      {
        id: 'cf8cf060-91ce-4851-a726-a161215b6d46',
        title: 'Upgrade to business class',
        price: 177,
      },
      {
        id: '493de2b4-0f8a-4042-9d49-95c37a68a233',
        title: 'Add luggage',
        price: 44,
      },
      {
        id: '0162e86f-b85c-4046-bd71-72ee1a1c27cf',
        title: 'Business lounge',
        price: 157,
      },
    ],
  },
  {
    type: 'check-in',
    offers: [
      {
        id: '40caf46b-39f2-4a06-a62c-2916c268063b',
        title: 'Choose the time of check-in',
        price: 170,
      },
      {
        id: '5db73e90-13aa-4520-b954-88ad296c4e53',
        title: 'Choose the time of check-out',
        price: 72,
      },
      {
        id: 'f1ff21db-7039-4d3f-a068-29565ef4b7a6',
        title: 'Add breakfast',
        price: 192,
      },
      {
        id: 'b3b42db6-5dbd-4aae-b6de-3df9643be06a',
        title: 'Laundry',
        price: 162,
      },
      {
        id: 'df84f36b-8e5a-4e82-929a-1dcecb7dd235',
        title: 'Order a meal from the restaurant',
        price: 127,
      },
    ],
  },
  {
    type: 'sightseeing',
    offers: [],
  },
  {
    type: 'ship',
    offers: [
      {
        id: '15b23167-7c08-4b59-9220-f89c61bb0666',
        title: 'Choose meal',
        price: 74,
      },
      {
        id: '8f60b4ac-b32f-4371-8a46-060ba01bf88c',
        title: 'Choose seats',
        price: 194,
      },
      {
        id: '2f9205df-7275-4945-94d7-63baf3df6a3b',
        title: 'Upgrade to comfort class',
        price: 36,
      },
      {
        id: 'c8914794-b134-4ceb-8ced-bfd5d3889443',
        title: 'Upgrade to business class',
        price: 76,
      },
      {
        id: 'a1aa700e-0697-4c8b-9ec9-288bd64b7966',
        title: 'Add luggage',
        price: 95,
      },
      {
        id: '816096d2-d2b3-43fc-8eaa-a13cf7fb9e38',
        title: 'Business lounge',
        price: 127,
      },
    ],
  },
  {
    type: 'drive',
    offers: [
      {
        id: '3c0a7331-c7bd-489f-82ec-4fb56be65214',
        title: 'With automatic transmission',
        price: 62,
      },
      {
        id: '535fbb7a-3420-40de-bab9-305840137402',
        title: 'With air conditioning',
        price: 152,
      },
    ],
  },
  {
    type: 'restaurant',
    offers: [
      {
        id: '3ce19818-e43e-4247-a063-a6bcf48ff5c9',
        title: 'Choose live music',
        price: 85,
      },
      {
        id: '393e47cf-bdd1-48e0-98e5-0a8e28721a3d',
        title: 'Choose VIP area',
        price: 53,
      },
    ],
  },
];

const getMockOffers = () => mockOffer;

export { getMockOffers };

import { getRandomArrayElement } from '../utils/event';

const mockCities = [
  {
    id: '18321ee3-3056-4e6b-83d8-8eaeb38ee08d',
    description: 'Berlin - for those who value comfort and coziness',
    name: 'Berlin',
    pictures: [
      {
        src: 'https://23.objects.htmlacademy.pro/static/destinations/10.jpg',
        description: 'Berlin for those who value comfort and coziness',
      },
      {
        src: 'https://23.objects.htmlacademy.pro/static/destinations/12.jpg',
        description: 'Berlin middle-eastern paradise',
      },
      {
        src: 'https://23.objects.htmlacademy.pro/static/destinations/4.jpg',
        description: 'Berlin middle-eastern paradise',
      },
      {
        src: 'https://23.objects.htmlacademy.pro/static/destinations/15.jpg',
        description: 'Berlin with crowded streets',
      },
    ],
  },
  {
    id: 'f4638d20-ab2a-49aa-a335-592c6867b634',
    description: 'Helsinki - with a beautiful old town',
    name: 'Helsinki',
    pictures: [],
  },
  {
    id: '42c5925b-5b01-4a57-aa52-81f6b49c4c2a',
    description: 'Frankfurt - is a beautiful city',
    name: 'Frankfurt',
    pictures: [],
  },
  {
    id: '81d7477b-7132-4ac1-849c-71cde580d398',
    description: 'Rome - in a middle of Europe',
    name: 'Rome',
    pictures: [
      {
        src: 'https://23.objects.htmlacademy.pro/static/destinations/10.jpg',
        description: 'Rome in a middle of Europe',
      },
    ],
  },
  {
    id: '542cc7d6-c1cd-4a43-92ba-c5cc59a5bb16',
    description: 'Kopenhagen - is a beautiful city',
    name: 'Kopenhagen',
    pictures: [
      {
        src: 'https://23.objects.htmlacademy.pro/static/destinations/5.jpg',
        description:
          'Kopenhagen with an embankment of a mighty river as a centre of attraction',
      },
      {
        src: 'https://23.objects.htmlacademy.pro/static/destinations/14.jpg',
        description:
          'Kopenhagen famous for its crowded street markets with the best street food in Asia',
      },
    ],
  },
  {
    id: '66df9c08-ad89-40a3-a7fa-3d57fbe9c8fc',
    description: 'Barcelona - for those who value comfort and coziness',
    name: 'Barcelona',
    pictures: [
      {
        src: 'https://23.objects.htmlacademy.pro/static/destinations/8.jpg',
        description:
          'Barcelona with an embankment of a mighty river as a centre of attraction',
      },
      {
        src: 'https://23.objects.htmlacademy.pro/static/destinations/7.jpg',
        description: 'Barcelona middle-eastern paradise',
      },
      {
        src: 'https://23.objects.htmlacademy.pro/static/destinations/19.jpg',
        description:
          'Barcelona with an embankment of a mighty river as a centre of attraction',
      },
      {
        src: 'https://23.objects.htmlacademy.pro/static/destinations/14.jpg',
        description:
          'Barcelona with an embankment of a mighty river as a centre of attraction',
      },
      {
        src: 'https://23.objects.htmlacademy.pro/static/destinations/4.jpg',
        description: 'Barcelona in a middle of Europe',
      },
    ],
  },
  {
    id: 'd7e6a3dd-2d22-455a-a32b-a67e75247705',
    description:
      'Valencia - with an embankment of a mighty river as a centre of attraction',
    name: 'Valencia',
    pictures: [],
  },
  {
    id: '0b64d960-c630-4b64-98be-761d34b52165',
    description: 'Tokio - in a middle of Europe',
    name: 'Tokio',
    pictures: [
      {
        src: 'https://23.objects.htmlacademy.pro/static/destinations/2.jpg',
        description: 'Tokio with crowded streets',
      },
    ],
  },
  {
    id: 'a08eefb2-176a-4436-bb2f-312b5e331707',
    description:
      'Sochi - famous for its crowded street markets with the best street food in Asia',
    name: 'Sochi',
    pictures: [
      {
        src: 'https://23.objects.htmlacademy.pro/static/destinations/16.jpg',
        description: 'Sochi in a middle of Europe',
      },
      {
        src: 'https://23.objects.htmlacademy.pro/static/destinations/15.jpg',
        description: 'Sochi middle-eastern paradise',
      },
      {
        src: 'https://23.objects.htmlacademy.pro/static/destinations/6.jpg',
        description: 'Sochi for those who value comfort and coziness',
      },
      {
        src: 'https://23.objects.htmlacademy.pro/static/destinations/1.jpg',
        description:
          'Sochi famous for its crowded street markets with the best street food in Asia',
      },
    ],
  },
  {
    id: 'c69dfe99-d14b-4cfb-bada-cbe45f29e422',
    description:
      'Chamonix - famous for its crowded street markets with the best street food in Asia',
    name: 'Chamonix',
    pictures: [
      {
        src: 'https://23.objects.htmlacademy.pro/static/destinations/18.jpg',
        description: 'Chamonix in a middle of Europe',
      },
      {
        src: 'https://23.objects.htmlacademy.pro/static/destinations/12.jpg',
        description:
          'Chamonix with an embankment of a mighty river as a centre of attraction',
      },
      {
        src: 'https://23.objects.htmlacademy.pro/static/destinations/11.jpg',
        description: 'Chamonix a true asian pearl',
      },
      {
        src: 'https://23.objects.htmlacademy.pro/static/destinations/11.jpg',
        description: 'Chamonix in a middle of Europe',
      },
      {
        src: 'https://23.objects.htmlacademy.pro/static/destinations/4.jpg',
        description: 'Chamonix in a middle of Europe',
      },
    ],
  },
];

const getRandomCity = () => getRandomArrayElement(mockCities);

const getMockCities = () => mockCities;

export { getMockCities, getRandomCity };

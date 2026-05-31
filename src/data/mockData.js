export const routes = [
  {
    id: 'route-1',
    name: 'Velvet Volume',
    grade: 'V4',
    gradeValue: 4,
    location: 'Westwand',
    wallType: 'Slab',
    description: 'Technische Platte mit ruhigen Bewegungen, Balance und sauberem Trittdruck.',
    betaSteps: [
      'Setze den linken Fuss frueh auf die kleine Kante und bleibe nah an der Wand.',
      'Schiebe die Huefte unter den Seitgriff, bevor du in den hohen Tritt steigst.',
      'Druecke geduldig ueber die Beine statt hektisch zum Top zu springen.',
    ],
  },
  {
    id: 'route-2',
    name: 'Roof Ritual',
    grade: 'V5',
    gradeValue: 5,
    location: 'Dachbereich',
    wallType: 'Overhang',
    description: 'Steiler Boulder mit Heel Hook, Core-Spannung und kontrolliertem Finish.',
    betaSteps: [
      'Spanne vom Start an den Core an und lasse die Huefte nicht absacken.',
      'Nutze den rechten Heel Hook frueh, um den langen Zug statisch zu halten.',
      'Atme vor dem letzten Move aus und ziehe ueber den Heel Hook zum Abschluss.',
    ],
  },
  {
    id: 'route-3',
    name: 'Mint Traverse',
    grade: 'V2',
    gradeValue: 2,
    location: 'Nordwand',
    wallType: 'Vertical',
    description: 'Leichte Traverse fuer Rhythmus, Fusstabilitaet und Gewichtsverlagerung.',
    betaSteps: [
      'Bleibe mit den Fuessen aktiv und setze lieber einmal sauber nach.',
      'Drehe die Huefte in Bewegungsrichtung ein, damit die Seitgriffe leichter werden.',
      'Gehe kontrolliert ins Finish statt den letzten Griff zu snappen.',
    ],
  },
  {
    id: 'route-4',
    name: 'Granite Pulse',
    grade: 'V6',
    gradeValue: 6,
    location: 'Comp Wall',
    wallType: 'Competition',
    description: 'Moderne Volumenlinie mit Compression, Crossover und dynamischem Top.',
    betaSteps: [
      'Baue Druck zwischen den Volumen auf, statt nur an den Armen zu ziehen.',
      'Fange den Crossover ueber die Beine ab und bleibe lang im Oberkoerper.',
      'Setze den letzten Tritt frueh und committe sauber in den dynamischen Abschluss.',
    ],
  },
];

export const users = [
  {
    id: 'user-max',
    name: 'Max',
    level: 'Fortgeschritten',
    avatarColor: '#F58B1F',
    sessionsCount: 7,
    climbedRoutes: [
      { routeId: 'route-1', attempts: 2, date: '2026-04-01', topped: true },
      { routeId: 'route-2', attempts: 4, date: '2026-04-02', topped: true },
    ],
  },
  {
    id: 'user-lisa',
    name: 'Lisa',
    level: 'Pro',
    avatarColor: '#41C48B',
    sessionsCount: 10,
    climbedRoutes: [
      { routeId: 'route-1', attempts: 1, date: '2026-04-01', topped: true },
      { routeId: 'route-3', attempts: 2, date: '2026-04-01', topped: true },
      { routeId: 'route-4', attempts: 5, date: '2026-04-03', topped: false },
    ],
  },
  {
    id: 'user-tom',
    name: 'Tom',
    level: 'Intermediate',
    avatarColor: '#5F8BFF',
    sessionsCount: 4,
    climbedRoutes: [{ routeId: 'route-3', attempts: 1, date: '2026-04-02', topped: true }],
  },
  {
    id: 'user-anna',
    name: 'Anna',
    level: 'Advanced',
    avatarColor: '#D96CFF',
    sessionsCount: 8,
    climbedRoutes: [
      { routeId: 'route-2', attempts: 3, date: '2026-03-31', topped: true },
      { routeId: 'route-4', attempts: 6, date: '2026-04-01', topped: true },
    ],
  },
];

export const achievementTemplates = {
  weekly: [
    { id: 'weekly-routes', title: '5 Routen diese Woche klettern', goal: 5 },
    { id: 'weekly-flash', title: '3 Routen im 1. Versuch schaffen', goal: 3 },
    { id: 'weekly-grades', title: '2 neue Grade probieren', goal: 2 },
  ],
  milestone: [
    { id: 'milestone-50', title: '50 Routen insgesamt', goal: 50 },
    { id: 'milestone-v5', title: 'Erster V5 oder schwerer', goal: 1 },
    { id: 'milestone-sessions', title: '10 Sessions', goal: 10 },
  ],
};


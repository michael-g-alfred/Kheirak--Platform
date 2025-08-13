export const campaignsData = [
  {
    id: "campaign1",
    name: "حملة إطعام",
    type: "طعام",
    categories: [
      {
        id: "restaurant1",
        name: "مطعم الخير",
        items: [
          {
            id: "meal1",
            name: "وجبة دجاج",
            description: "وجبة دجاج مشوي مع أرز وسلطة",
            price: 50,
            // image: "/images/chicken-meal.jpg",
          },
          {
            id: "meal2",
            name: "وجبة لحم",
            description: "وجبة لحم مطهو مع الخضار",
            price: 70,
            // image: "/images/beef-meal.jpg",
          },
        ],
      },
      {
        id: "restaurant2",
        name: "مطعم البركة",
        items: [
          {
            id: "meal3",
            name: "وجبة سمك",
            description: "سمك مقلي مع بطاطس",
            price: 60,
            // image: "/images/fish-meal.jpg",
          },
        ],
      },
    ],
  },
  {
    id: "campaign2",
    name: "حملة كساء",
    type: "ملابس",
    categories: [
      {
        id: "shop1",
        name: "متجر الأناقة",
        items: [
          {
            id: "cloth1",
            name: "معطف شتوي",
            description: "معطف شتوي دافئ",
            price: 200,
            // image: "/images/winter-coat.jpg",
          },
          {
            id: "cloth2",
            name: "حذاء رياضي",
            description: "حذاء رياضي مريح",
            price: 150,
            // image: "/images/sneakers.jpg",
          },
        ],
      },
    ],
  },
  {
    id: "campaign3",
    name: "حملة أدوات مدرسية",
    type: "أدوات مدرسية",
    categories: [
      {
        id: "shop2",
        name: "مكتبة المستقبل",
        items: [
          {
            id: "stationery1",
            name: "حقيبة مدرسية",
            description: "حقيبة متينة للمدرسة",
            price: 120,
            // image: "/images/school-bag.jpg",
          },
          {
            id: "stationery2",
            name: "طقم أدوات مكتبية",
            description: "أقلام وألوان ومسطرة",
            price: 50,
            // image: "/images/stationery-set.jpg",
          },
        ],
      },
    ],
  },
];

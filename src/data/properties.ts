export const wilayas = [
  "الجزائر", "وهران", "قسنطينة", "عنابة", "بجاية", "تلمسان", "سطيف", "باتنة",
  "تيزي وزو", "البليدة", "جيجل", "سكيكدة", "مستغانم", "تيبازة", "بومرداس",
  "غرداية", "تمنراست", "جانت", "بشار", "أدرار", "المدية", "مسيلة", "الجلفة",
  "سعيدة", "عين الدفلى", "تيسمسيلت", "الأغواط", "خنشلة", "سوق أهراس",
  "تبسة", "الوادي", "ورقلة", "إليزي", "تندوف", "النعامة", "عين تيموشنت",
  "غليزان", "الشلف", "معسكر", "البيض", "برج بوعريريج", "بومرداس",
  "الطارف", "ميلة", "عين الدفلى", "قالمة", "أم البواقي", "المسيلة",
  "تيارت", "بسكرة", "خميس مليانة", "أولاد جلال", "عين صالح",
  "عين قزام", "تيميمون", "تقرت", "جامعة", "المغير", "المنيعة"
];

export const accommodationTypes = ["فندق", "شقة مفروشة", "فيلا", "شاليه", "بيت ريفي"];

export interface Property {
  id: string;
  name: string;
  location: string;
  wilaya: string;
  price: number;
  rating: number;
  reviews: number;
  type: string;
  image: string;
  images: string[];
  description: string;
  amenities: string[];
  rooms: number;
  guests: number;
}

export const mockProperties: Property[] = [
  {
    id: "1",
    name: "فندق الأوراسي",
    location: "حيدرة، الجزائر العاصمة",
    wilaya: "الجزائر",
    price: 12000,
    rating: 4.8,
    reviews: 234,
    type: "فندق",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80",
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&q=80",
      "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800&q=80",
    ],
    description: "فندق فاخر من فئة 5 نجوم يقع في قلب العاصمة الجزائرية، يوفر إطلالة بانورامية خلابة على خليج الجزائر. يتميز بخدمات راقية تشمل مسبح، سبا، ومطاعم عالمية.",
    amenities: ["واي فاي مجاني", "مسبح", "سبا", "موقف سيارات", "مطعم", "خدمة الغرف", "صالة رياضة", "إفطار شامل"],
    rooms: 3,
    guests: 6,
  },
  {
    id: "2",
    name: "شقة مطلة على البحر",
    location: "الواجهة البحرية، وهران",
    wilaya: "وهران",
    price: 6500,
    rating: 4.5,
    reviews: 89,
    type: "شقة مفروشة",
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80",
    ],
    description: "شقة مفروشة بالكامل مع إطلالة مباشرة على البحر الأبيض المتوسط. تتميز بتصميم عصري ومريح مع جميع وسائل الراحة الحديثة.",
    amenities: ["واي فاي مجاني", "مطبخ مجهز", "شرفة بحرية", "تكييف", "غسالة", "تلفزيون ذكي"],
    rooms: 2,
    guests: 4,
  },
  {
    id: "3",
    name: "فيلا الياسمين",
    location: "تيشي، بجاية",
    wilaya: "بجاية",
    price: 18000,
    rating: 4.9,
    reviews: 156,
    type: "فيلا",
    image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
    ],
    description: "فيلا فاخرة محاطة بأشجار الياسمين في منطقة تيشي الساحلية. مثالية للعائلات مع مسبح خاص وحديقة واسعة.",
    amenities: ["مسبح خاص", "حديقة", "شواء", "واي فاي", "موقف خاص", "أمن 24/7", "مطبخ كامل"],
    rooms: 4,
    guests: 10,
  },
  {
    id: "4",
    name: "شاليه الصنوبر",
    location: "الشاطئ الأزرق، تيبازة",
    wilaya: "تيبازة",
    price: 8000,
    rating: 4.6,
    reviews: 67,
    type: "شاليه",
    image: "https://images.unsplash.com/photo-1587061949409-02df41d5e562?w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1587061949409-02df41d5e562?w=800&q=80",
      "https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=800&q=80",
    ],
    description: "شاليه خشبي أنيق يقع وسط غابة الصنوبر وعلى بعد خطوات من الشاطئ. تجربة استرخاء فريدة في أحضان الطبيعة.",
    amenities: ["شاطئ قريب", "تراس", "شواء", "واي فاي", "تكييف", "مطبخ صغير"],
    rooms: 2,
    guests: 4,
  },
  {
    id: "5",
    name: "فندق الصحراء الذهبية",
    location: "وسط المدينة، غرداية",
    wilaya: "غرداية",
    price: 9500,
    rating: 4.7,
    reviews: 112,
    type: "فندق",
    image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&q=80",
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&q=80",
    ],
    description: "فندق بطابع صحراوي أصيل يقع في وادي مزاب، يجمع بين الأصالة والحداثة مع إطلالة على المدينة القديمة.",
    amenities: ["واي فاي", "إفطار تقليدي", "جولات سياحية", "تكييف", "مطعم", "موقف"],
    rooms: 2,
    guests: 3,
  },
  {
    id: "6",
    name: "بيت الجبل",
    location: "آث يني، تيزي وزو",
    wilaya: "تيزي وزو",
    price: 4500,
    rating: 4.4,
    reviews: 45,
    type: "بيت ريفي",
    image: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&q=80",
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80",
    ],
    description: "بيت ريفي تقليدي في قلب جبال جرجرة. مثالي لعشاق الطبيعة والهدوء مع إطلالة على الجبال والوديان.",
    amenities: ["واي فاي", "تدفئة", "مطبخ", "حديقة", "مسارات مشي"],
    rooms: 2,
    guests: 5,
  },
  {
    id: "7",
    name: "جناح قسنطينة الملكي",
    location: "وسط المدينة، قسنطينة",
    wilaya: "قسنطينة",
    price: 15000,
    rating: 4.8,
    reviews: 198,
    type: "فندق",
    image: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800&q=80",
      "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80",
    ],
    description: "جناح فندقي فاخر مع إطلالة على الجسور المعلقة لمدينة قسنطينة التاريخية. خدمة 5 نجوم مع سبا ومطعم راقي.",
    amenities: ["واي فاي", "سبا", "مطعم", "خدمة كونسيرج", "ميني بار", "إفطار فاخر"],
    rooms: 2,
    guests: 4,
  },
  {
    id: "8",
    name: "شقة عنابة المارينا",
    location: "سيدي سالم، عنابة",
    wilaya: "عنابة",
    price: 7000,
    rating: 4.3,
    reviews: 73,
    type: "شقة مفروشة",
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80",
    ],
    description: "شقة حديثة بالقرب من شاطئ عنابة الشهير. مثالية للعطلات الصيفية مع جميع المرافق اللازمة.",
    amenities: ["واي فاي", "تكييف", "مطبخ", "قريب من الشاطئ", "موقف", "بلكونة"],
    rooms: 2,
    guests: 4,
  },
];

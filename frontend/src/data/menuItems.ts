export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  popular?: boolean;
}

export const categories = [
  { id: "all", name: "All Items" },
  { id: "burgers", name: "Burgers" },
  { id: "chicken", name: "Chicken" },
  { id: "sides", name: "Sides" },
  { id: "drinks", name: "Drinks" },
  { id: "desserts", name: "Desserts" },
];

export const menuItems: MenuItem[] = [
  {
    id: "1",
    name: "Classic Cheeseburger",
    description: "Juicy beef patty with melted cheddar, fresh lettuce, tomato, and our secret sauce",
    price: 8.99,
    category: "burgers",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400",
    popular: true,
  },
  {
    id: "2",
    name: "Double Bacon Burger",
    description: "Two beef patties, crispy bacon, American cheese, pickles, and BBQ sauce",
    price: 12.99,
    category: "burgers",
    image: "https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=400",
    popular: true,
  },
  {
    id: "3",
    name: "Veggie Deluxe Burger",
    description: "Plant-based patty with avocado, roasted peppers, and herb mayo",
    price: 10.99,
    category: "burgers",
    image: "https://images.unsplash.com/photo-1525059696034-4967a8e1dca2?w=400",
  },
  {
    id: "4",
    name: "Crispy Chicken Sandwich",
    description: "Crispy fried chicken breast with coleslaw and spicy mayo",
    price: 9.49,
    category: "chicken",
    image: "https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=400",
    popular: true,
  },
  {
    id: "5",
    name: "Grilled Chicken Wrap",
    description: "Grilled chicken, fresh veggies, and ranch dressing in a flour tortilla",
    price: 8.49,
    category: "chicken",
    image: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400",
  },
  {
    id: "6",
    name: "Chicken Nuggets (10pc)",
    description: "Golden crispy chicken nuggets served with your choice of dipping sauce",
    price: 7.99,
    category: "chicken",
    image: "https://images.unsplash.com/photo-1562967914-608f82629710?w=400",
  },
  {
    id: "7",
    name: "Loaded Fries",
    description: "Crispy fries topped with cheese sauce, bacon bits, and green onions",
    price: 5.99,
    category: "sides",
    image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400",
    popular: true,
  },
  {
    id: "8",
    name: "Onion Rings",
    description: "Thick-cut onion rings with a golden crispy batter",
    price: 4.49,
    category: "sides",
    image: "https://images.unsplash.com/photo-1639024471283-03518883512d?w=400",
  },
  {
    id: "9",
    name: "Garden Salad",
    description: "Fresh mixed greens with cherry tomatoes, cucumber, and house dressing",
    price: 5.49,
    category: "sides",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400",
  },
  {
    id: "10",
    name: "Classic Cola",
    description: "Refreshing cola served ice cold",
    price: 2.49,
    category: "drinks",
    image: "https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400",
  },
  {
    id: "11",
    name: "Fresh Lemonade",
    description: "House-made lemonade with a hint of mint",
    price: 3.49,
    category: "drinks",
    image: "https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=400",
  },
  {
    id: "12",
    name: "Chocolate Milkshake",
    description: "Creamy chocolate milkshake topped with whipped cream",
    price: 4.99,
    category: "drinks",
    image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400",
    popular: true,
  },
  {
    id: "13",
    name: "Apple Pie",
    description: "Warm apple pie with cinnamon, served with vanilla ice cream",
    price: 4.49,
    category: "desserts",
    image: "https://images.unsplash.com/photo-1568571780765-9276ac8b75a7?w=400",
  },
  {
    id: "14",
    name: "Chocolate Brownie",
    description: "Rich chocolate brownie with chocolate sauce and ice cream",
    price: 5.49,
    category: "desserts",
    image: "https://images.unsplash.com/photo-1564355808539-22fda35bed7e?w=400",
  },
];

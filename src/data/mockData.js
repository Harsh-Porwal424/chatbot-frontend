// Export all mock data as named exports

export const sampleChats = [
  {
    id: 1,
    title: "Q1 Margin Analysis",
    agent: "chat",
    time: "2 hours ago",
    hasContext: false,
  },
  {
    id: 2,
    title: "Bakery Category Rules",
    agent: "rules",
    time: "5 hours ago",
    hasContext: true,
  },
  {
    id: 3,
    title: "Competitor Price Match",
    agent: "chat",
    time: "Yesterday",
    hasContext: false,
  },
  {
    id: 4,
    title: "Regional Pricing Rules",
    agent: "rules",
    time: "Yesterday",
    hasContext: true,
  },
  {
    id: 5,
    title: "Promotion Strategy",
    agent: "chat",
    time: "2 days ago",
    hasContext: false,
  },
];

export const mockNotifications = [
  {
    id: 1,
    type: "job",
    title: "Bulk Rule Creation",
    description: "10,000 rules for Holiday Pricing 2025",
    status: "completed",
    timestamp: "2 hours ago",
    isRead: false,
    downloadUrl: "#",
  },
  {
    id: 2,
    type: "job",
    title: "Price Optimization",
    description: "Midwest region - 5,000 SKUs",
    status: "in_progress",
    progress: 67,
    timestamp: "30 minutes ago",
    isRead: false,
  },
  {
    id: 3,
    type: "job",
    title: "Competitor Analysis Import",
    description: "Importing 2,500 competitor prices",
    status: "started",
    timestamp: "5 minutes ago",
    isRead: false,
  },
  {
    id: 4,
    type: "download",
    title: "Q4 Pricing Report",
    description: "PDF export ready",
    status: "completed",
    timestamp: "1 day ago",
    isRead: true,
    downloadUrl: "#",
  },
  {
    id: 5,
    type: "job",
    title: "Rule Validation",
    description: "Validating 3,000 rules",
    status: "failed",
    timestamp: "3 hours ago",
    isRead: false,
    error: "Connection timeout. Please retry.",
  },
  {
    id: 6,
    type: "download",
    title: "SKU Export - Bakery",
    description: "CSV export ready",
    status: "completed",
    timestamp: "4 hours ago",
    isRead: true,
    downloadUrl: "#",
  },
  {
    id: 7,
    type: "job",
    title: "Margin Recalculation",
    description: "Fresh department - all stores",
    status: "completed",
    timestamp: "5 hours ago",
    isRead: true,
    downloadUrl: "#",
  },
  {
    id: 8,
    type: "download",
    title: "Location Performance Report",
    description: "Excel export ready",
    status: "completed",
    timestamp: "1 day ago",
    isRead: true,
    downloadUrl: "#",
  },
  {
    id: 9,
    type: "job",
    title: "Scenario Simulation",
    description: "Holiday Pricing impact analysis",
    status: "completed",
    timestamp: "2 days ago",
    isRead: true,
    downloadUrl: "#",
  },
  {
    id: 10,
    type: "job",
    title: "Bulk Price Update",
    description: "15,000 prices updated",
    status: "completed",
    timestamp: "3 days ago",
    isRead: true,
    downloadUrl: "#",
  },
];

export const productHierarchy = [
  {
    id: "enterprise",
    name: "Enterprise",
    count: 1847,
    children: [
      {
        id: "fresh",
        name: "FRESH",
        count: 892,
        children: [
          {
            id: "bakery",
            name: "BAKERY",
            count: 245,
            children: [
              {
                id: "bakery-bread",
                name: "BREAD",
                count: 89,
                children: [
                  {
                    id: "bakery-bread-white",
                    name: "WHITE BREAD",
                    count: 34,
                    children: [
                      {
                        id: "sku-wb-001",
                        name: "Wonder Bread White 20oz",
                      },
                      {
                        id: "sku-wb-002",
                        name: "Sara Lee White Bread 22oz",
                      },
                      {
                        id: "sku-wb-003",
                        name: "Nature Own White 24oz",
                      },
                    ],
                  },
                  {
                    id: "bakery-bread-wheat",
                    name: "WHEAT BREAD",
                    count: 28,
                    children: [
                      {
                        id: "sku-wh-001",
                        name: "Pepperidge Farm Wheat 16oz",
                      },
                      {
                        id: "sku-wh-002",
                        name: "Arnold Wheat Bread 24oz",
                      },
                    ],
                  },
                ],
              },
              {
                id: "bakery-buns",
                name: "BUNS & ROLLS",
                count: 67,
                children: [
                  {
                    id: "bakery-buns-hamburger",
                    name: "HAMBURGER BUNS",
                    count: 32,
                    children: [
                      {
                        id: "sku-hb-001",
                        name: "Ball Park Hamburger Buns 8ct",
                      },
                      {
                        id: "sku-hb-002",
                        name: "Nature Own Burger Buns 8ct",
                      },
                    ],
                  },
                  {
                    id: "bakery-buns-hotdog",
                    name: "HOT DOG BUNS",
                    count: 35,
                    children: [
                      {
                        id: "sku-hd-001",
                        name: "Wonder Hot Dog Buns 8ct",
                      },
                    ],
                  },
                ],
              },
              {
                id: "bakery-pastry",
                name: "PASTRIES",
                count: 89,
                children: [
                  {
                    id: "bakery-pastry-donuts",
                    name: "DONUTS",
                    count: 45,
                    children: [
                      {
                        id: "sku-dn-001",
                        name: "Glazed Donuts 6ct",
                      },
                      {
                        id: "sku-dn-002",
                        name: "Chocolate Donuts 6ct",
                      },
                    ],
                  },
                  {
                    id: "bakery-pastry-muffins",
                    name: "MUFFINS",
                    count: 44,
                    children: [
                      {
                        id: "sku-mf-001",
                        name: "Blueberry Muffins 4ct",
                      },
                    ],
                  },
                ],
              },
            ],
          },
          {
            id: "produce",
            name: "PRODUCE",
            count: 312,
            children: [
              {
                id: "produce-fruit",
                name: "FRUIT",
                count: 156,
                children: [
                  {
                    id: "produce-fruit-apples",
                    name: "APPLES",
                    count: 48,
                    children: [
                      {
                        id: "sku-ap-001",
                        name: "Gala Apples 3lb Bag",
                      },
                      {
                        id: "sku-ap-002",
                        name: "Honeycrisp Apples Each",
                      },
                    ],
                  },
                  {
                    id: "produce-fruit-bananas",
                    name: "BANANAS",
                    count: 24,
                    children: [
                      {
                        id: "sku-bn-001",
                        name: "Bananas per lb",
                      },
                    ],
                  },
                ],
              },
              {
                id: "produce-veg",
                name: "VEGETABLES",
                count: 156,
                children: [
                  {
                    id: "produce-veg-leafy",
                    name: "LEAFY GREENS",
                    count: 52,
                    children: [
                      {
                        id: "sku-lg-001",
                        name: "Romaine Hearts 3ct",
                      },
                      {
                        id: "sku-lg-002",
                        name: "Baby Spinach 5oz",
                      },
                    ],
                  },
                  {
                    id: "produce-veg-root",
                    name: "ROOT VEGETABLES",
                    count: 48,
                    children: [
                      {
                        id: "sku-rv-001",
                        name: "Russet Potatoes 5lb",
                      },
                    ],
                  },
                ],
              },
            ],
          },
          {
            id: "deli",
            name: "DELI",
            count: 178,
            children: [
              {
                id: "deli-meat",
                name: "DELI MEATS",
                count: 98,
                children: [
                  {
                    id: "deli-meat-turkey",
                    name: "TURKEY",
                    count: 34,
                    children: [
                      {
                        id: "sku-dt-001",
                        name: "Sliced Turkey Breast 8oz",
                      },
                      {
                        id: "sku-dt-002",
                        name: "Smoked Turkey 12oz",
                      },
                    ],
                  },
                  {
                    id: "deli-meat-ham",
                    name: "HAM",
                    count: 32,
                    children: [
                      {
                        id: "sku-dh-001",
                        name: "Honey Ham 8oz",
                      },
                    ],
                  },
                ],
              },
              {
                id: "deli-cheese",
                name: "DELI CHEESE",
                count: 80,
                children: [
                  {
                    id: "deli-cheese-american",
                    name: "AMERICAN",
                    count: 28,
                    children: [
                      {
                        id: "sku-ca-001",
                        name: "American Cheese Slices 12ct",
                      },
                    ],
                  },
                  {
                    id: "deli-cheese-swiss",
                    name: "SWISS",
                    count: 26,
                    children: [
                      {
                        id: "sku-cs-001",
                        name: "Swiss Cheese Slices 8oz",
                      },
                    ],
                  },
                ],
              },
            ],
          },
          {
            id: "dairy",
            name: "DAIRY",
            count: 157,
            children: [
              {
                id: "dairy-milk",
                name: "MILK",
                count: 67,
                children: [
                  {
                    id: "dairy-milk-whole",
                    name: "WHOLE MILK",
                    count: 22,
                    children: [
                      {
                        id: "sku-mw-001",
                        name: "Whole Milk Gallon",
                      },
                      {
                        id: "sku-mw-002",
                        name: "Whole Milk Half Gallon",
                      },
                    ],
                  },
                  {
                    id: "dairy-milk-2pct",
                    name: "2% MILK",
                    count: 23,
                    children: [
                      {
                        id: "sku-m2-001",
                        name: "2% Milk Gallon",
                      },
                    ],
                  },
                ],
              },
              {
                id: "dairy-yogurt",
                name: "YOGURT",
                count: 90,
                children: [
                  {
                    id: "dairy-yogurt-greek",
                    name: "GREEK YOGURT",
                    count: 45,
                    children: [
                      {
                        id: "sku-yg-001",
                        name: "Chobani Greek Plain 32oz",
                      },
                    ],
                  },
                  {
                    id: "dairy-yogurt-regular",
                    name: "REGULAR YOGURT",
                    count: 45,
                    children: [
                      {
                        id: "sku-yr-001",
                        name: "Yoplait Original Strawberry 6oz",
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        id: "grocery",
        name: "GROCERY",
        count: 623,
        children: [
          {
            id: "grocery-snacks",
            name: "SNACKS",
            count: 245,
            children: [
              {
                id: "grocery-snacks-chips",
                name: "CHIPS",
                count: 124,
                children: [
                  {
                    id: "grocery-snacks-chips-potato",
                    name: "POTATO CHIPS",
                    count: 62,
                    children: [
                      {
                        id: "sku-pc-001",
                        name: "Lays Classic 10oz",
                      },
                      {
                        id: "sku-pc-002",
                        name: "Ruffles Original 9oz",
                      },
                    ],
                  },
                  {
                    id: "grocery-snacks-chips-tortilla",
                    name: "TORTILLA CHIPS",
                    count: 62,
                    children: [
                      {
                        id: "sku-tc-001",
                        name: "Tostitos Scoops 10oz",
                      },
                    ],
                  },
                ],
              },
              {
                id: "grocery-snacks-crackers",
                name: "CRACKERS",
                count: 78,
                children: [
                  {
                    id: "grocery-snacks-crackers-saltine",
                    name: "SALTINES",
                    count: 39,
                    children: [
                      {
                        id: "sku-sc-001",
                        name: "Premium Saltines 16oz",
                      },
                    ],
                  },
                  {
                    id: "grocery-snacks-crackers-cheese",
                    name: "CHEESE CRACKERS",
                    count: 39,
                    children: [
                      {
                        id: "sku-cr-001",
                        name: "Cheez-It Original 12oz",
                      },
                    ],
                  },
                ],
              },
            ],
          },
          {
            id: "grocery-canned",
            name: "CANNED GOODS",
            count: 198,
            children: [
              {
                id: "grocery-canned-veg",
                name: "CANNED VEGETABLES",
                count: 99,
                children: [
                  {
                    id: "grocery-canned-veg-corn",
                    name: "CORN",
                    count: 33,
                    children: [
                      {
                        id: "sku-cn-001",
                        name: "Del Monte Whole Kernel 15oz",
                      },
                    ],
                  },
                  {
                    id: "grocery-canned-veg-beans",
                    name: "BEANS",
                    count: 33,
                    children: [
                      {
                        id: "sku-be-001",
                        name: "Bush Black Beans 15oz",
                      },
                    ],
                  },
                ],
              },
              {
                id: "grocery-canned-soup",
                name: "SOUPS",
                count: 99,
                children: [
                  {
                    id: "grocery-canned-soup-chicken",
                    name: "CHICKEN SOUP",
                    count: 50,
                    children: [
                      {
                        id: "sku-ch-001",
                        name: "Campbell Chicken Noodle 10oz",
                      },
                    ],
                  },
                  {
                    id: "grocery-canned-soup-tomato",
                    name: "TOMATO SOUP",
                    count: 49,
                    children: [
                      {
                        id: "sku-ts-001",
                        name: "Campbell Tomato 10oz",
                      },
                    ],
                  },
                ],
              },
            ],
          },
          {
            id: "grocery-bev",
            name: "BEVERAGES",
            count: 180,
            children: [
              {
                id: "grocery-bev-soda",
                name: "SODA",
                count: 90,
                children: [
                  {
                    id: "grocery-bev-soda-cola",
                    name: "COLA",
                    count: 45,
                    children: [
                      {
                        id: "sku-co-001",
                        name: "Coca-Cola 2L",
                      },
                      { id: "sku-co-002", name: "Pepsi 2L" },
                    ],
                  },
                  {
                    id: "grocery-bev-soda-lemon",
                    name: "LEMON-LIME",
                    count: 45,
                    children: [
                      { id: "sku-ll-001", name: "Sprite 2L" },
                    ],
                  },
                ],
              },
              {
                id: "grocery-bev-juice",
                name: "JUICE",
                count: 90,
                children: [
                  {
                    id: "grocery-bev-juice-orange",
                    name: "ORANGE JUICE",
                    count: 45,
                    children: [
                      {
                        id: "sku-oj-001",
                        name: "Tropicana Original 52oz",
                      },
                    ],
                  },
                  {
                    id: "grocery-bev-juice-apple",
                    name: "APPLE JUICE",
                    count: 45,
                    children: [
                      {
                        id: "sku-aj-001",
                        name: "Mott Apple Juice 64oz",
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        id: "frozen",
        name: "FROZEN",
        count: 332,
        children: [
          {
            id: "frozen-meals",
            name: "FROZEN MEALS",
            count: 156,
            children: [
              {
                id: "frozen-meals-pizza",
                name: "PIZZA",
                count: 78,
                children: [
                  {
                    id: "frozen-meals-pizza-traditional",
                    name: "TRADITIONAL PIZZA",
                    count: 39,
                    children: [
                      {
                        id: "sku-pz-001",
                        name: "DiGiorno Pepperoni 22oz",
                      },
                      {
                        id: "sku-pz-002",
                        name: "Red Baron Supreme 21oz",
                      },
                    ],
                  },
                  {
                    id: "frozen-meals-pizza-thin",
                    name: "THIN CRUST PIZZA",
                    count: 39,
                    children: [
                      {
                        id: "sku-pt-001",
                        name: "Newman Own Thin Margherita 16oz",
                      },
                    ],
                  },
                ],
              },
              {
                id: "frozen-meals-entrees",
                name: "ENTREES",
                count: 78,
                children: [
                  {
                    id: "frozen-meals-entrees-healthy",
                    name: "HEALTHY CHOICE",
                    count: 39,
                    children: [
                      {
                        id: "sku-hc-001",
                        name: "Healthy Choice Chicken 10oz",
                      },
                    ],
                  },
                  {
                    id: "frozen-meals-entrees-comfort",
                    name: "COMFORT MEALS",
                    count: 39,
                    children: [
                      {
                        id: "sku-cf-001",
                        name: "Stouffer Mac & Cheese 12oz",
                      },
                    ],
                  },
                ],
              },
            ],
          },
          {
            id: "frozen-dessert",
            name: "FROZEN DESSERTS",
            count: 176,
            children: [
              {
                id: "frozen-dessert-icecream",
                name: "ICE CREAM",
                count: 98,
                children: [
                  {
                    id: "frozen-dessert-icecream-premium",
                    name: "PREMIUM ICE CREAM",
                    count: 49,
                    children: [
                      {
                        id: "sku-ip-001",
                        name: "Haagen-Dazs Vanilla 14oz",
                      },
                      {
                        id: "sku-ip-002",
                        name: "Ben Jerry Cherry Garcia 16oz",
                      },
                    ],
                  },
                  {
                    id: "frozen-dessert-icecream-value",
                    name: "VALUE ICE CREAM",
                    count: 49,
                    children: [
                      {
                        id: "sku-iv-001",
                        name: "Breyers Natural Vanilla 48oz",
                      },
                    ],
                  },
                ],
              },
              {
                id: "frozen-dessert-novelty",
                name: "NOVELTIES",
                count: 78,
                children: [
                  {
                    id: "frozen-dessert-novelty-bars",
                    name: "ICE CREAM BARS",
                    count: 39,
                    children: [
                      {
                        id: "sku-ib-001",
                        name: "Magnum Classic 3ct",
                      },
                    ],
                  },
                  {
                    id: "frozen-dessert-novelty-cones",
                    name: "CONES",
                    count: 39,
                    children: [
                      {
                        id: "sku-ic-001",
                        name: "Drumstick Vanilla 4ct",
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
];

export const locationHierarchy = [
  {
    id: "enterprise",
    name: "Enterprise",
    count: 847,
    children: [
      {
        id: "midwest",
        name: "MIDWEST",
        count: 312,
        children: [
          {
            id: "midwest-michigan",
            name: "Michigan",
            count: 89,
            children: [
              { id: "store-mi-001", name: "MI-0019 Muskegon" },
              {
                id: "store-mi-002",
                name: "MI-0020 Grand Rapids",
              },
              { id: "store-mi-003", name: "MI-0021 Kalamazoo" },
              { id: "store-mi-004", name: "MI-0022 Portage" },
            ],
          },
          {
            id: "midwest-ohio",
            name: "Ohio",
            count: 112,
            children: [
              { id: "store-oh-001", name: "OH-0101 Columbus" },
              { id: "store-oh-002", name: "OH-0102 Cleveland" },
              {
                id: "store-oh-003",
                name: "OH-0103 Cincinnati",
              },
            ],
          },
          {
            id: "midwest-indiana",
            name: "Indiana",
            count: 67,
            children: [
              {
                id: "store-in-001",
                name: "IN-0201 Indianapolis",
              },
              {
                id: "store-in-002",
                name: "IN-0202 Fort Wayne",
              },
            ],
          },
          {
            id: "midwest-illinois",
            name: "Illinois",
            count: 44,
            children: [
              { id: "store-il-001", name: "IL-0301 Chicago" },
              {
                id: "store-il-002",
                name: "IL-0302 Springfield",
              },
            ],
          },
        ],
      },
      {
        id: "northeast",
        name: "NORTHEAST",
        count: 287,
        children: [
          {
            id: "northeast-newyork",
            name: "New York",
            count: 134,
            children: [
              { id: "store-ny-001", name: "NY-0401 Manhattan" },
              { id: "store-ny-002", name: "NY-0402 Brooklyn" },
              { id: "store-ny-003", name: "NY-0403 Buffalo" },
            ],
          },
          {
            id: "northeast-penn",
            name: "Pennsylvania",
            count: 89,
            children: [
              {
                id: "store-pa-001",
                name: "PA-0501 Philadelphia",
              },
              {
                id: "store-pa-002",
                name: "PA-0502 Pittsburgh",
              },
            ],
          },
          {
            id: "northeast-mass",
            name: "Massachusetts",
            count: 64,
            children: [
              { id: "store-ma-001", name: "MA-0601 Boston" },
              { id: "store-ma-002", name: "MA-0602 Cambridge" },
            ],
          },
        ],
      },
      {
        id: "south",
        name: "SOUTH",
        count: 156,
        children: [
          {
            id: "south-texas",
            name: "Texas",
            count: 78,
            children: [
              { id: "store-tx-001", name: "TX-0701 Houston" },
              { id: "store-tx-002", name: "TX-0702 Dallas" },
              { id: "store-tx-003", name: "TX-0703 Austin" },
            ],
          },
          {
            id: "south-florida",
            name: "Florida",
            count: 45,
            children: [
              { id: "store-fl-001", name: "FL-0801 Miami" },
              { id: "store-fl-002", name: "FL-0802 Orlando" },
            ],
          },
          {
            id: "south-georgia",
            name: "Georgia",
            count: 33,
            children: [
              { id: "store-ga-001", name: "GA-0901 Atlanta" },
            ],
          },
        ],
      },
      {
        id: "west",
        name: "WEST",
        count: 92,
        children: [
          {
            id: "west-california",
            name: "California",
            count: 56,
            children: [
              {
                id: "store-ca-001",
                name: "CA-1001 Los Angeles",
              },
              {
                id: "store-ca-002",
                name: "CA-1002 San Francisco",
              },
              { id: "store-ca-003", name: "CA-1003 San Diego" },
            ],
          },
          {
            id: "west-washington",
            name: "Washington",
            count: 36,
            children: [
              { id: "store-wa-001", name: "WA-1101 Seattle" },
              { id: "store-wa-002", name: "WA-1102 Tacoma" },
            ],
          },
        ],
      },
    ],
  },
];

export const productGroups = [
  {
    id: 1,
    name: "Blossoms",
    type: "Ad",
    items: 3,
    updatedAt: "12/6/2024",
  },
  {
    id: 2,
    name: "Burgers",
    type: "Ad",
    items: 5,
    updatedAt: "11/23/2025",
  },
  {
    id: 3,
    name: "Cream Puffs and Eclairs",
    type: "Rule",
    items: 3,
    updatedAt: "1/16/2025",
  },
  {
    id: 4,
    name: "Dessert Bars",
    type: "Ad",
    items: 5,
    updatedAt: "12/6/2024",
  },
  {
    id: 5,
    name: "AR Test",
    type: "Rule",
    items: 12,
    updatedAt: "9/11/2025",
  },
];

export const locationGroups = [
  {
    id: 1,
    name: "Atlantic",
    type: "Ad",
    items: 4,
    updatedAt: "4/5/2019",
  },
  {
    id: 2,
    name: "Ontario",
    type: "Ad",
    items: 8,
    updatedAt: "12/9/2025",
  },
  {
    id: 3,
    name: "Western Canada",
    type: "Rule",
    items: 3,
    updatedAt: "3/20/2020",
  },
  {
    id: 4,
    name: "MAR",
    type: "Ad",
    items: 2,
    updatedAt: "10/27/2025",
  },
];

export const scenariosData = [
  {
    id: 1,
    name: "Base",
    description: "Base scenario for all pricing rules",
  },
  {
    id: 2,
    name: "QA Smoke Test",
    description: "QA test scenario",
  },
  {
    id: 3,
    name: "qa test",
    description: "Testing for release",
  },
  {
    id: 4,
    name: "Holiday Pricing 2025",
    description: "Special pricing rules for holiday season",
  },
  {
    id: 5,
    name: "Competitor Response",
    description: "Dynamic pricing based on competitor analysis",
  },
  {
    id: 6,
    name: "Clearance Strategy",
    description: "End of season clearance pricing",
  },
  {
    id: 7,
    name: "Premium Tier Test",
    description: "Testing premium product pricing",
  },
  {
    id: 8,
    name: "Regional Pilot",
    description: "Pilot pricing for select regions",
  },
];

export const rulesData = [
  // MAP2 panel rules
  {
    id: 1,
    panelId: 1,
    rank: 1,
    ruleType: "Price",
    description: "Minimum Advertised Price Floor",
  },
  {
    id: 2,
    panelId: 1,
    rank: 2,
    ruleType: "Margin",
    description: "Maintain 15% Min Margin",
  },

  // Vitamins panel rules
  {
    id: 3,
    panelId: 2,
    rank: 1,
    ruleType: "Margin",
    description: "Wellness Category Markup 22%",
  },
  {
    id: 4,
    panelId: 2,
    rank: 2,
    ruleType: "Parity",
    description: "Match Amazon Pricing",
  },
  {
    id: 5,
    panelId: 2,
    rank: 3,
    ruleType: "Price",
    description: "Round to .99 Ending",
  },

  // Energy Drinks panel rules
  {
    id: 6,
    panelId: 3,
    rank: 1,
    ruleType: "Parity",
    description: "Competitor Price Match ±2%",
  },
  {
    id: 7,
    panelId: 3,
    rank: 2,
    ruleType: "Margin",
    description: "Protect 18% Gross Margin",
  },

  // QA Test Panel 1 rules
  {
    id: 8,
    panelId: 7,
    rank: 1,
    ruleType: "Price",
    description: "Base Price Validation",
  },
  {
    id: 9,
    panelId: 7,
    rank: 2,
    ruleType: "Margin",
    description: "Margin Floor Check",
  },

  // Holiday Bakery Rules panel
  {
    id: 10,
    panelId: 9,
    rank: 1,
    ruleType: "Markup",
    description: "Holiday Premium +12%",
  },
  {
    id: 11,
    panelId: 9,
    rank: 2,
    ruleType: "Price",
    description: "Promotional Bundle Discount",
  },
  {
    id: 12,
    panelId: 9,
    rank: 3,
    ruleType: "Parity",
    description: "Match Local Bakery Prices",
  },

  // Gift Items Markup panel
  {
    id: 13,
    panelId: 10,
    rank: 1,
    ruleType: "Markup",
    description: "Gift Set Premium 25%",
  },
  {
    id: 14,
    panelId: 10,
    rank: 2,
    ruleType: "Price",
    description: "Gift Wrap Add-on $2.99",
  },

  // Price Match - Electronics panel
  {
    id: 15,
    panelId: 12,
    rank: 1,
    ruleType: "Parity",
    description: "Beat Best Buy by 3%",
  },
  {
    id: 16,
    panelId: 12,
    rank: 2,
    ruleType: "Margin",
    description: "Electronics Min Margin 8%",
  },
];

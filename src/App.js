import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import {
  MessageSquare,
  Settings2,
  ChevronDown,
  ChevronRight,
  Plus,
  Send,
  Paperclip,
  Lightbulb,
  FileText,
  Trash2,
  Package,
  MapPin,
  X,
  Check,
  Search,
  PanelLeftClose,
  PanelLeft,
  PanelRightClose,
  PanelRight,
  Sparkles,
  Zap,
  FolderTree,
  Grid3X3,
  Target,
  Clock,
  RotateCcw,
  Maximize2,
  HelpCircle,
  TrendingUp,
  Layers,
  ChevronLeft,
  ChevronUp,
  PlayCircle,
  LayoutGrid,
  Lock,
  FileCheck,
  Bell,
  Download,
  CheckCheck,
  Loader2,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { toast, Toaster } from "sonner";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { MarkdownTableRenderer } from "@/components/MarkdownTableRenderer";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:9000';

// Configure axios to skip ngrok warning and CORS
axios.defaults.headers.common['ngrok-skip-browser-warning'] = 'true';
axios.defaults.headers.common['X-Bungee-Tenant'] = 'meijer';
// Note: User-Agent cannot be set by browsers for security reasons

// Utility functions for session management
const generateTempSessionId = () => {
  return `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// Agent mapping
const AGENT_MAPPING = {
  chat: "chat-assistant",
  rules: "rule-management"
};

// ClearDemand Logo
const ClearDemandLogo = ({ size = 40 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    fill="none"
  >
    <path
      d="M 50 10 A 40 40 0 1 0 50 90"
      stroke="#4CAF50"
      strokeWidth="8"
      strokeLinecap="round"
      fill="none"
    />
    <text
      x="50"
      y="68"
      textAnchor="middle"
      fontSize="52"
      fontWeight="700"
      fontFamily="Arial, sans-serif"
      fill="#1565C0"
    >
      D
    </text>
  </svg>
);

const ClearDemandLogoMini = ({ size = 32 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    fill="none"
  >
    <path
      d="M 50 10 A 40 40 0 1 0 50 90"
      stroke="#4CAF50"
      strokeWidth="10"
      strokeLinecap="round"
      fill="none"
    />
    <text
      x="50"
      y="68"
      textAnchor="middle"
      fontSize="52"
      fontWeight="700"
      fontFamily="Arial, sans-serif"
      fill="#1565C0"
    >
      D
    </text>
  </svg>
);

// Agent definitions
const agents = [
  {
    id: "chat",
    name: "Pricing Assistant",
    description:
      "Ask questions about pricing strategies & insights",
    icon: MessageSquare,
    color: "#1565C0",
    bgColor: "#E3F2FD",
  },
  {
    id: "rules",
    name: "Rule Builder",
    description: "Create and manage pricing rules",
    icon: Settings2,
    color: "#7B1FA2",
    bgColor: "#F3E5F5",
  },
];

// Sample chat history
const sampleChats = [
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

// Mock notifications/tasks data
const mockNotifications = [
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

// Product hierarchy data
// Product Hierarchy - 6 levels deep (Level 6 = actual SKU, no count)
const productHierarchy = [
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

// Location Hierarchy - 4 levels deep (Level 4 = actual store, no count)
const locationHierarchy = [
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

// Groups data
const productGroups = [
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

const locationGroups = [
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

// Scenarios data
const scenariosData = [
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

// Rules data (linked to panels)
const rulesData = [
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

// Tree Node Component
const TreeNode = ({
  node,
  level = 0,
  selectedIds,
  onToggle,
  expandedIds,
  onExpand,
  readOnly = false,
  inheritedSelection = false,
}) => {
  const hasChildren = node.children?.length > 0;
  const isExpanded = expandedIds.has(node.id);
  const isDirectlySelected = selectedIds.has(node.id);
  const isInherited =
    !readOnly && inheritedSelection && !isDirectlySelected;
  const hasCount = node.count !== undefined;

  // Children inherit selection only when NOT in read-only mode
  const childInheritedSelection =
    !readOnly && (isDirectlySelected || inheritedSelection);

  // Can toggle if not read-only and not inherited
  const canToggle = !readOnly && !isInherited;

  return (
    <div>
      <div
        className={`flex items-center gap-2 py-1.5 px-2 rounded-md transition-colors ${
          canToggle
            ? "cursor-pointer hover:bg-gray-50"
            : "cursor-default"
        } ${
          isDirectlySelected
            ? "bg-blue-50"
            : isInherited
              ? "bg-gray-50"
              : ""
        }`}
        style={{ paddingLeft: `${level * 16 + 8}px` }}
      >
        {hasChildren ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onExpand(node.id);
            }}
            className="w-5 h-5 flex items-center justify-center text-gray-400 hover:text-gray-600"
          >
            {isExpanded ? (
              <ChevronDown size={14} />
            ) : (
              <ChevronRight size={14} />
            )}
          </button>
        ) : (
          <span className="w-5" />
        )}

        <div
          onClick={() => canToggle && onToggle(node.id)}
          className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors flex-shrink-0 ${
            isDirectlySelected
              ? "bg-blue-600 border-blue-600"
              : isInherited
                ? "bg-gray-400 border-gray-400"
                : "border-gray-300"
          } ${canToggle ? "hover:border-blue-400" : ""}`}
        >
          {(isDirectlySelected || isInherited) && (
            <Check
              size={10}
              className="text-white"
              strokeWidth={3}
            />
          )}
        </div>

        <span
          className={`text-sm flex-1 ${
            isDirectlySelected
              ? "text-blue-700 font-medium"
              : isInherited
                ? "text-gray-500"
                : "text-gray-700"
          }`}
          onClick={() => canToggle && onToggle(node.id)}
        >
          {node.name}
          {hasCount && (
            <span className="text-gray-400 ml-1">
              ({node.count})
            </span>
          )}
        </span>
      </div>

      {hasChildren &&
        isExpanded &&
        node.children.map((child) => (
          <TreeNode
            key={child.id}
            node={child}
            level={level + 1}
            selectedIds={selectedIds}
            onToggle={onToggle}
            expandedIds={expandedIds}
            onExpand={onExpand}
            readOnly={readOnly}
            inheritedSelection={childInheritedSelection}
          />
        ))}
    </div>
  );
};

// Groups Table Component
const GroupsTable = ({
  groups,
  selectedIds,
  onToggle,
  readOnly = false,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const filtered = groups.filter((g) =>
    g.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div
      className={`flex flex-col h-full ${readOnly ? "opacity-75" : ""}`}
    >
      <div className="px-3 py-2 border-b border-gray-100">
        <div className="relative">
          <Search
            size={14}
            className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search groups..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-sm bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 sticky top-0">
            <tr className="text-left text-gray-500 text-xs uppercase tracking-wider">
              <th className="py-2 px-3 w-8"></th>
              <th className="py-2 px-3 font-medium">Name</th>
              <th className="py-2 px-3 font-medium w-16">
                Type
              </th>
              <th className="py-2 px-3 font-medium w-20">
                Updated
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((group) => {
              const isSelected = selectedIds.has(
                `group_${group.id}`,
              );
              return (
                <tr
                  key={group.id}
                  className={`border-b border-gray-50 transition-colors ${readOnly ? "cursor-default" : "cursor-pointer"} ${isSelected ? "bg-blue-50" : readOnly ? "" : "hover:bg-gray-50"}`}
                  onClick={() =>
                    !readOnly && onToggle(`group_${group.id}`)
                  }
                >
                  <td className="py-2 px-3">
                    <div
                      className={`w-4 h-4 rounded border-2 flex items-center justify-center ${isSelected ? "bg-blue-600 border-blue-600" : readOnly ? "border-gray-200" : "border-gray-300"}`}
                    >
                      {isSelected && (
                        <Check
                          size={10}
                          className="text-white"
                          strokeWidth={3}
                        />
                      )}
                    </div>
                  </td>
                  <td
                    className={`py-2 px-3 ${isSelected ? "text-blue-700 font-medium" : "text-gray-700"}`}
                  >
                    {group.name}
                    <span className="text-gray-400 text-xs ml-1">
                      ({group.items})
                    </span>
                  </td>
                  <td className="py-2 px-3">
                    <span
                      className={`px-1.5 py-0.5 rounded text-xs font-medium ${group.type === "Rule" ? "bg-purple-100 text-purple-700" : "bg-emerald-100 text-emerald-700"}`}
                    >
                      {group.type}
                    </span>
                  </td>
                  <td className="py-2 px-3 text-gray-500 text-xs">
                    {group.updatedAt}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Status Icon Component
const StatusIcon = ({ status }) => {
  switch (status) {
    case "completed":
      return (
        <CheckCircle2 size={16} className="text-emerald-500" />
      );
    case "in_progress":
      return (
        <Loader2
          size={16}
          className="text-blue-500 animate-spin"
        />
      );
    case "started":
      return <Clock size={16} className="text-amber-500" />;
    case "failed":
      return <XCircle size={16} className="text-red-500" />;
    default:
      return <Clock size={16} className="text-gray-400" />;
  }
};

// Status Badge Component
const StatusBadge = ({ status }) => {
  const statusConfig = {
    completed: {
      bg: "bg-emerald-50",
      text: "text-emerald-700",
      label: "Completed",
    },
    in_progress: {
      bg: "bg-blue-50",
      text: "text-blue-700",
      label: "In Progress",
    },
    started: {
      bg: "bg-amber-50",
      text: "text-amber-700",
      label: "Started",
    },
    failed: {
      bg: "bg-red-50",
      text: "text-red-700",
      label: "Failed",
    },
  };
  const config = statusConfig[status] || statusConfig.started;
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${config.bg} ${config.text}`}
    >
      {config.label}
    </span>
  );
};

// Notification Item Component
const NotificationItem = ({ notification, onMarkAsRead }) => (
  <div
    className={`px-4 py-3 border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer ${!notification.isRead ? "bg-blue-50/30" : ""}`}
    onClick={() => onMarkAsRead(notification.id)}
  >
    <div className="flex items-start gap-3">
      <div className="flex-shrink-0 mt-0.5">
        <StatusIcon status={notification.status} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <p
            className={`text-sm font-medium truncate ${!notification.isRead ? "text-gray-900" : "text-gray-700"}`}
          >
            {notification.title}
          </p>
          {!notification.isRead && (
            <span className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0" />
          )}
        </div>
        <p className="text-xs text-gray-500 truncate mt-0.5">
          {notification.description}
        </p>
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-2">
            <StatusBadge status={notification.status} />
            <span className="text-xs text-gray-400">
              {notification.timestamp}
            </span>
          </div>
          {notification.status === "completed" &&
            notification.downloadUrl && (
              <button
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors"
              >
                <Download size={12} />
                <span>Download</span>
              </button>
            )}
          {notification.status === "failed" && (
            <button
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
            >
              <RotateCcw size={12} />
              <span>Retry</span>
            </button>
          )}
        </div>
        {notification.status === "in_progress" &&
          notification.progress !== undefined && (
            <div className="mt-2">
              <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                <span>Progress</span>
                <span>{notification.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div
                  className="bg-blue-500 h-1.5 rounded-full transition-all duration-300"
                  style={{ width: `${notification.progress}%` }}
                />
              </div>
            </div>
          )}
        {notification.status === "failed" &&
          notification.error && (
            <p className="text-xs text-red-500 mt-1">
              {notification.error}
            </p>
          )}
      </div>
    </div>
  </div>
);

// Notification Panel Component
const NotificationPanel = ({
  isOpen,
  onClose,
  notifications,
  setNotifications,
}) => {
  const [activeTab, setActiveTab] = useState("all");
  const panelRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(event.target)
      )
        onClose();
    };
    if (isOpen)
      document.addEventListener(
        "mousedown",
        handleClickOutside,
      );
    return () =>
      document.removeEventListener(
        "mousedown",
        handleClickOutside,
      );
  }, [isOpen, onClose]);

  const handleMarkAsRead = (id) =>
    setNotifications((prev) =>
      prev.map((n) =>
        n.id === id ? { ...n, isRead: true } : n,
      ),
    );
  const handleMarkAllAsRead = () =>
    setNotifications((prev) =>
      prev.map((n) => ({ ...n, isRead: true })),
    );

  const filteredNotifications = notifications
    .filter((n) => {
      if (activeTab === "all") return true;
      if (activeTab === "in_progress")
        return (
          n.status === "started" || n.status === "in_progress"
        );
      if (activeTab === "completed")
        return n.status === "completed";
      if (activeTab === "failed") return n.status === "failed";
      return true;
    })
    .slice(0, 10);

  const unreadCount = notifications.filter(
    (n) => !n.isRead,
  ).length;
  const inProgressCount = notifications.filter(
    (n) => n.status === "started" || n.status === "in_progress",
  ).length;
  const completedCount = notifications.filter(
    (n) => n.status === "completed",
  ).length;
  const failedCount = notifications.filter(
    (n) => n.status === "failed",
  ).length;

  if (!isOpen) return null;

  return (
    <div
      ref={panelRef}
      className="absolute right-0 top-full mt-2 w-96 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden z-50"
      style={{ maxHeight: "480px" }}
    >
      <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/50">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold text-gray-900">
            Notifications
          </h3>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="p-1.5 hover:bg-gray-200 rounded-lg transition-colors text-gray-500 hover:text-gray-700"
              title="Mark all as read"
            >
              <CheckCheck size={18} />
            </button>
          )}
        </div>
      </div>

      <div className="flex border-b border-gray-100">
        <button
          onClick={() => setActiveTab("all")}
          className={`flex-1 px-3 py-2.5 text-xs font-medium transition-colors ${activeTab === "all" ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50/30" : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"}`}
        >
          <span className="block">View All</span>
          <span
            className={`text-[10px] ${activeTab === "all" ? "text-blue-500" : "text-gray-400"}`}
          >
            ({notifications.length})
          </span>
        </button>
        <button
          onClick={() => setActiveTab("in_progress")}
          className={`flex-1 px-3 py-2.5 text-xs font-medium transition-colors ${activeTab === "in_progress" ? "text-amber-600 border-b-2 border-amber-500 bg-amber-50/30" : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"}`}
        >
          <span className="block">In Progress</span>
          <span
            className={`text-[10px] ${activeTab === "in_progress" ? "text-amber-500" : "text-gray-400"}`}
          >
            ({inProgressCount})
          </span>
        </button>
        <button
          onClick={() => setActiveTab("completed")}
          className={`flex-1 px-3 py-2.5 text-xs font-medium transition-colors ${activeTab === "completed" ? "text-emerald-600 border-b-2 border-emerald-500 bg-emerald-50/30" : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"}`}
        >
          <span className="block">Completed</span>
          <span
            className={`text-[10px] ${activeTab === "completed" ? "text-emerald-500" : "text-gray-400"}`}
          >
            ({completedCount})
          </span>
        </button>
        <button
          onClick={() => setActiveTab("failed")}
          className={`flex-1 px-3 py-2.5 text-xs font-medium transition-colors ${activeTab === "failed" ? "text-red-600 border-b-2 border-red-500 bg-red-50/30" : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"}`}
        >
          <span className="block">Failed</span>
          <span
            className={`text-[10px] ${activeTab === "failed" ? "text-red-500" : "text-gray-400"}`}
          >
            ({failedCount})
          </span>
        </button>
      </div>

      <div
        className="overflow-y-auto"
        style={{ maxHeight: "360px" }}
      >
        {filteredNotifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            <Bell size={40} className="text-gray-300 mb-3" />
            <p className="text-sm text-gray-500">No messages</p>
          </div>
        ) : (
          filteredNotifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onMarkAsRead={handleMarkAsRead}
            />
          ))
        )}
      </div>
    </div>
  );
};

// Scenarios List Component
const ScenariosList = ({
  selectedScenario,
  onSelect,
  onCreateNew,
  allScenarios,
  totalScenarios,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const scrollContainerRef = useRef(null);

  // Use allScenarios when no search, otherwise fetch search results
  useEffect(() => {
    if (!searchTerm) {
      setSearchResults(allScenarios);
      return;
    }

    const fetchSearchResults = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/v1/pricing-rules/scenario?search=${encodeURIComponent(searchTerm)}`);
        const transformedScenarios = response.data.items.map(item => ({
          id: item.scenario_id,
          name: item.name,
          description: item.description || 'No description available'
        }));
        setSearchResults(transformedScenarios);
      } catch (error) {
        console.error('Error searching scenarios:', error);
        setSearchResults([]);
      } finally {
        setLoading(false);
      }
    };

    // Debounce search
    const timer = setTimeout(() => {
      fetchSearchResults();
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm, allScenarios]);

  // Sort: selected item first, then rest alphabetically
  const sortedScenarios = [...searchResults].sort((a, b) => {
    if (a.id === selectedScenario) return -1;
    if (b.id === selectedScenario) return 1;
    return a.name.localeCompare(b.name);
  });

  const handleScroll = (e) => {
    setShowBackToTop(e.target.scrollTop > 100);
  };

  const scrollToTop = () => {
    scrollContainerRef.current?.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="flex flex-col h-full relative">
      <div className="px-3 py-2 border-b border-gray-100">
        <div className="relative">
          <Search
            size={14}
            className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search scenarios..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-sm bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-auto"
      >
        {/* Create New Option - Always at top */}
        <div
          onClick={onCreateNew}
          className="flex items-center gap-3 px-3 py-3 border-b border-gray-100 cursor-pointer hover:bg-orange-50 transition-colors group sticky top-0 bg-white z-10"
        >
          <div className="w-5 h-5 rounded-full border-2 border-dashed border-orange-400 flex items-center justify-center group-hover:border-orange-500">
            <Plus
              size={12}
              className="text-orange-400 group-hover:text-orange-500"
            />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-orange-600 group-hover:text-orange-700">
              Create New Scenario
            </p>
            <p className="text-xs text-gray-400">
              Describe your scenario in chat
            </p>
          </div>
          <ChevronRight
            size={16}
            className="text-orange-300 group-hover:text-orange-400"
          />
        </div>

        {/* Scenarios List */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
            <Loader2 size={32} className="text-gray-400 mb-2 animate-spin" />
            <p className="text-sm text-gray-500">Loading scenarios...</p>
          </div>
        ) : sortedScenarios.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
            <PlayCircle
              size={32}
              className="text-gray-300 mb-2"
            />
            <p className="text-sm text-gray-500">
              No scenarios found
            </p>
            <p className="text-xs text-gray-400">
              Try a different search term
            </p>
          </div>
        ) : (
          sortedScenarios.map((scenario) => {
            const isSelected = selectedScenario === scenario.id;
            return (
              <div
                key={scenario.id}
                onClick={() => onSelect(scenario.id)}
                className={`flex items-start gap-3 px-3 py-3 border-b border-gray-50 cursor-pointer transition-colors ${isSelected ? "bg-orange-50" : "hover:bg-gray-50"}`}
              >
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors ${isSelected ? "border-orange-500" : "border-gray-300"}`}
                >
                  {isSelected && (
                    <div className="w-2.5 h-2.5 rounded-full bg-orange-500" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p
                    className={`text-sm font-medium truncate ${isSelected ? "text-orange-700" : "text-gray-700"}`}
                  >
                    {scenario.name}
                  </p>
                  <p className="text-xs text-gray-400 truncate">
                    {scenario.description}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer with count */}
      <div className="px-3 py-2 border-t border-gray-100 bg-gray-50/80 flex items-center justify-between">
        <span className="text-xs text-gray-500">
          {totalScenarios} scenario
          {totalScenarios !== 1 ? "s" : ""}
          {selectedScenario && (
            <span className="text-orange-600 ml-1">
              • 1 selected
            </span>
          )}
        </span>
      </div>

      {/* Back to top button */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="absolute bottom-12 right-3 w-8 h-8 bg-white border border-gray-200 rounded-full shadow-md flex items-center justify-center text-gray-500 hover:text-gray-700 hover:bg-gray-50 transition-all z-20"
          title="Back to top"
        >
          <ChevronUp size={18} />
        </button>
      )}
    </div>
  );
};

// Panels List Component
const PanelsList = ({
  selectedScenario,
  selectedPanel,
  onSelect,
  onCreateNew,
  allPanels,
  totalPanels,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const scrollContainerRef = useRef(null);

  // Use allPanels (pre-fetched) or searchResults (when searching)
  const displayPanels = searchTerm ? searchResults : allPanels;

  // Debounced search effect
  useEffect(() => {
    if (!searchTerm) {
      setSearchResults([]);
      return;
    }

    if (!selectedScenario) {
      return;
    }

    const timeoutId = setTimeout(async () => {
      setLoading(true);
      try {
        const response = await axios.get(`/api/v1/pricing-rules/panel?scenario_id=${selectedScenario}&search=${searchTerm}`);
        const transformedPanels = response.data.items.map(item => ({
          id: item.panel_id,
          name: item.panel_name,
          description: item.comment || 'No description available',
          priority: item.priority,
          location_node_id: item.location_node_id,
          location_group_id: item.location_group_id,
          product_group_id: item.product_group_id,
          product_node_id: item.product_node_id,
          scenarioId: item.scenario_id
        }));
        setSearchResults(transformedPanels);
      } catch (error) {
        console.error('Error searching panels:', error);
        setSearchResults([]);
      } finally {
        setLoading(false);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, selectedScenario]);

  // Sort: selected item first, then rest by priority (descending)
  const sortedPanels = [...displayPanels].sort((a, b) => {
    if (a.id === selectedPanel) return -1;
    if (b.id === selectedPanel) return 1;
    return b.priority - a.priority;
  });

  const handleScroll = (e) => {
    setShowBackToTop(e.target.scrollTop > 100);
  };

  const scrollToTop = () => {
    scrollContainerRef.current?.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="flex flex-col h-full relative">
      <div className="px-3 py-2 border-b border-gray-100">
        <div className="relative">
          <Search
            size={14}
            className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search panels..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-sm bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
          />
        </div>
      </div>

      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-auto"
      >
        {/* Create New Option - Always at top */}
        <div
          onClick={onCreateNew}
          className="flex items-center gap-3 px-3 py-3 border-b border-gray-100 cursor-pointer hover:bg-purple-50 transition-colors group sticky top-0 bg-white z-10"
        >
          <div className="w-5 h-5 rounded-full border-2 border-dashed border-purple-400 flex items-center justify-center group-hover:border-purple-500">
            <Plus
              size={12}
              className="text-purple-400 group-hover:text-purple-500"
            />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-purple-600 group-hover:text-purple-700">
              Create New Panel
            </p>
            <p className="text-xs text-gray-400">
              Describe your panel in chat
            </p>
          </div>
          <ChevronRight
            size={16}
            className="text-purple-300 group-hover:text-purple-400"
          />
        </div>

        {/* Panels List */}
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500" />
          </div>
        ) : sortedPanels.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
            <LayoutGrid
              size={32}
              className="text-gray-300 mb-2"
            />
            <p className="text-sm text-gray-500">
              No panels found
            </p>
            <p className="text-xs text-gray-400">
              Create a new panel to get started
            </p>
          </div>
        ) : (
          sortedPanels.map((panel) => {
            const isSelected = selectedPanel === panel.id;
            return (
              <div
                key={panel.id}
                onClick={() => onSelect(panel.id)}
                className={`flex items-start gap-3 px-3 py-3 border-b border-gray-50 cursor-pointer transition-colors ${isSelected ? "bg-purple-50" : "hover:bg-gray-50"}`}
              >
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors ${isSelected ? "border-purple-500" : "border-gray-300"}`}
                >
                  {isSelected && (
                    <div className="w-2.5 h-2.5 rounded-full bg-purple-500" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p
                      className={`text-sm font-medium truncate ${isSelected ? "text-purple-700" : "text-gray-700"}`}
                    >
                      {panel.name}
                    </p>
                    <span className="text-xs px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded flex-shrink-0">
                      P: {panel.priority}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 truncate">
                    {panel.description}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer with count */}
      <div className="px-3 py-2 border-t border-gray-100 bg-gray-50/80 flex items-center justify-between">
        <span className="text-xs text-gray-500">
          {searchTerm ? `${sortedPanels.length} panel${sortedPanels.length !== 1 ? "s" : ""}` : `${totalPanels} panel${totalPanels !== 1 ? "s" : ""}`}
          {selectedPanel && (
            <span className="text-purple-600 ml-1">
              • 1 selected
            </span>
          )}
        </span>
      </div>

      {/* Back to top button */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="absolute bottom-12 right-3 w-8 h-8 bg-white border border-gray-200 rounded-full shadow-md flex items-center justify-center text-gray-500 hover:text-gray-700 hover:bg-gray-50 transition-all z-20"
          title="Back to top"
        >
          <ChevronUp size={18} />
        </button>
      )}
    </div>
  );
};

// Rules List Component
const RulesList = ({
  selectedPanel,
  selectedRules,
  onToggleRule,
  onCreateNew,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showBackToTop, setShowBackToTop] = useState(false);
  const scrollContainerRef = useRef(null);

  const panelRules = rulesData.filter(
    (r) => r.panelId === selectedPanel,
  );

  const filtered = panelRules.filter(
    (r) =>
      r.description
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      r.ruleType
        .toLowerCase()
        .includes(searchTerm.toLowerCase()),
  );

  // Sort: selected items first, then rest by rank
  const sortedRules = [...filtered].sort((a, b) => {
    const aSelected = selectedRules.has(a.id);
    const bSelected = selectedRules.has(b.id);
    if (aSelected && !bSelected) return -1;
    if (!aSelected && bSelected) return 1;
    return a.rank - b.rank;
  });

  const handleScroll = (e) => {
    setShowBackToTop(e.target.scrollTop > 100);
  };

  const scrollToTop = () => {
    scrollContainerRef.current?.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const getRuleTypeStyle = (type) => {
    switch (type) {
      case "Price":
        return {
          bg: "bg-blue-50",
          text: "text-blue-600",
          border: "border-blue-200",
        };
      case "CPI":
        return {
          bg: "bg-purple-50",
          text: "text-purple-600",
          border: "border-purple-200",
        };
      case "Parity":
        return {
          bg: "bg-green-50",
          text: "text-green-600",
          border: "border-green-200",
        };
      case "Margin":
        return {
          bg: "bg-amber-50",
          text: "text-amber-600",
          border: "border-amber-200",
        };
      case "Markup":
        return {
          bg: "bg-orange-50",
          text: "text-orange-600",
          border: "border-orange-200",
        };
      default:
        return {
          bg: "bg-gray-50",
          text: "text-gray-600",
          border: "border-gray-200",
        };
    }
  };

  return (
    <div className="flex flex-col h-full relative">
      {/* Search */}
      <div className="px-3 py-2 border-b border-gray-100">
        <div className="relative">
          <Search
            size={14}
            className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search rules..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-sm bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
      </div>

      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-auto"
      >
        {/* Create New Option - Always at top */}
        <div
          onClick={onCreateNew}
          className="flex items-center gap-3 px-3 py-3 border-b border-gray-100 cursor-pointer hover:bg-indigo-50 transition-colors group sticky top-0 bg-white z-10"
        >
          <div className="w-8 h-8 rounded-lg border-2 border-dashed border-indigo-300 flex items-center justify-center group-hover:border-indigo-400 group-hover:bg-indigo-50">
            <Plus
              size={16}
              className="text-indigo-400 group-hover:text-indigo-500"
            />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-indigo-600 group-hover:text-indigo-700">
              Create New Rule
            </p>
            <p className="text-xs text-gray-400">
              Describe your rule in chat
            </p>
          </div>
          <ChevronRight
            size={16}
            className="text-indigo-300 group-hover:text-indigo-400"
          />
        </div>

        {/* Rules List */}
        {sortedRules.length === 0 && panelRules.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
            <FileCheck
              size={32}
              className="text-gray-300 mb-2"
            />
            <p className="text-sm text-gray-500">
              No rules found
            </p>
            <p className="text-xs text-gray-400">
              Create a new rule to get started
            </p>
          </div>
        ) : sortedRules.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
            <Search size={32} className="text-gray-300 mb-2" />
            <p className="text-sm text-gray-500">
              No matching rules
            </p>
            <p className="text-xs text-gray-400">
              Try a different search term
            </p>
          </div>
        ) : (
          <div className="p-2 space-y-2">
            {sortedRules.map((rule) => {
              const isSelected = selectedRules.has(rule.id);
              const typeStyle = getRuleTypeStyle(rule.ruleType);
              return (
                <div
                  key={rule.id}
                  onClick={() => onToggleRule(rule.id)}
                  className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all border ${
                    isSelected
                      ? "bg-indigo-50 border-indigo-200 shadow-sm"
                      : "bg-white border-gray-100 hover:border-gray-200 hover:shadow-sm"
                  }`}
                >
                  {/* Rank Badge */}
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-lg flex-shrink-0 ${
                      isSelected
                        ? "bg-indigo-600 text-white"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {rule.rank}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-sm font-medium truncate ${isSelected ? "text-indigo-900" : "text-gray-800"}`}
                    >
                      {rule.description}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium border ${typeStyle.bg} ${typeStyle.text} ${typeStyle.border}`}
                      >
                        {rule.ruleType}
                      </span>
                    </div>
                  </div>

                  {/* Checkbox */}
                  <div
                    className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                      isSelected
                        ? "bg-indigo-600 border-indigo-600"
                        : "border-gray-300 bg-white"
                    }`}
                  >
                    {isSelected && (
                      <Check
                        size={12}
                        className="text-white"
                        strokeWidth={3}
                      />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer with count */}
      <div className="px-3 py-2 border-t border-gray-100 bg-gray-50/80 flex items-center justify-between">
        <span className="text-xs text-gray-500">
          {filtered.length} rule
          {filtered.length !== 1 ? "s" : ""}
          {selectedRules.size > 0 && (
            <span className="text-indigo-600 ml-1">
              • {selectedRules.size} selected
            </span>
          )}
        </span>
      </div>

      {/* Back to top button */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="absolute bottom-12 right-3 w-8 h-8 bg-white border border-gray-200 rounded-full shadow-md flex items-center justify-center text-gray-500 hover:text-gray-700 hover:bg-gray-50 transition-all z-20"
          title="Back to top"
        >
          <ChevronUp size={18} />
        </button>
      )}
    </div>
  );
};

// Context Panel Component
const ContextPanel = ({
  isOpen,
  onClose,
  productSelection,
  setProductSelection,
  locationSelection,
  setLocationSelection,
  selectedScenario,
  setSelectedScenario,
  selectedPanel,
  setSelectedPanel,
  selectedRules,
  setSelectedRules,
  onCreateNewScenario,
  onCreateNewPanel,
  onCreateNewRule,
  allScenarios,
  totalScenariosCount,
  allPanels,
  totalPanelsCount,
}) => {
  const [activeTab, setActiveTab] = useState("scenarios");
  const [scopeTab, setScopeTab] = useState("products");
  const [scopeView, setScopeView] = useState("tree");
  const [expandedProducts, setExpandedProducts] = useState(
    new Set(["enterprise"]),
  );
  const [expandedLocations, setExpandedLocations] = useState(
    new Set(["enterprise"]),
  );

  // Helper function to find path to a node in hierarchy
  const findPathToNode = (
    nodes,
    targetId,
    currentPath = [],
  ) => {
    for (const node of nodes) {
      if (node.id === targetId) {
        return currentPath;
      }
      if (node.children) {
        const path = findPathToNode(node.children, targetId, [
          ...currentPath,
          node.id,
        ]);
        if (path) return path;
      }
    }
    return null;
  };

  // Auto-expand path to selected nodes when selections change
  React.useEffect(() => {
    if (productSelection.size > 0) {
      const newExpanded = new Set(expandedProducts);
      productSelection.forEach((nodeId) => {
        const path = findPathToNode(productHierarchy, nodeId);
        if (path) {
          path.forEach((id) => newExpanded.add(id));
        }
      });
      if (newExpanded.size !== expandedProducts.size) {
        setExpandedProducts(newExpanded);
      }
    }
  }, [productSelection]);

  React.useEffect(() => {
    if (locationSelection.size > 0) {
      const newExpanded = new Set(expandedLocations);
      locationSelection.forEach((nodeId) => {
        const path = findPathToNode(locationHierarchy, nodeId);
        if (path) {
          path.forEach((id) => newExpanded.add(id));
        }
      });
      if (newExpanded.size !== expandedLocations.size) {
        setExpandedLocations(newExpanded);
      }
    }
  }, [locationSelection]);

  const toggleExpand = (id, type) => {
    const setExpanded =
      type === "product"
        ? setExpandedProducts
        : setExpandedLocations;
    setExpanded((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleSelection = (id, type) => {
    if (selectedPanel) return; // Read-only when panel selected
    const setSelection =
      type === "product"
        ? setProductSelection
        : setLocationSelection;

    // Check if it's a group selection (groups are single-select)
    const isGroupSelection = id.startsWith("group_");

    if (isGroupSelection) {
      // Single-select for groups - replace selection
      setSelection(new Set([id]));
    } else {
      // Multi-select for hierarchy nodes
      setSelection((prev) => {
        const next = new Set(prev);
        // Remove any group selections when selecting hierarchy
        Array.from(next).forEach((existingId) => {
          if (existingId.startsWith("group_"))
            next.delete(existingId);
        });
        next.has(id) ? next.delete(id) : next.add(id);
        return next;
      });
    }
  };

  const toggleRule = (ruleId) => {
    setSelectedRules((prev) => {
      const next = new Set(prev);
      next.has(ruleId) ? next.delete(ruleId) : next.add(ruleId);
      return next;
    });
  };

  const selectedScenarioData = allScenarios.find(
    (s) => s.id === selectedScenario,
  );
  const selectedPanelData = allPanels.find(
    (p) => p.id === selectedPanel,
  );

  const isPanelDisabled = !selectedScenario;
  const isRulesDisabled = !selectedPanel;
  const isReadOnly = !!selectedPanel;

  // Helper function to get SKU count from a node ID
  const getSkuCount = (nodeId) => {
    const findNode = (nodes) => {
      for (const node of nodes) {
        if (node.id === nodeId) {
          return node.count !== undefined ? node.count : 1;
        }
        if (node.children) {
          const found = findNode(node.children);
          if (found !== null) return found;
        }
      }
      return null;
    };
    if (nodeId.startsWith("group_")) {
      const group = productGroups.find(
        (g) => `group_${g.id}` === nodeId,
      );
      return group?.items || 0;
    }
    return findNode(productHierarchy) || 0;
  };

  // Helper function to get store count from a node ID
  const getStoreCount = (nodeId) => {
    const findNode = (nodes) => {
      for (const node of nodes) {
        if (node.id === nodeId) {
          return node.count !== undefined ? node.count : 1;
        }
        if (node.children) {
          const found = findNode(node.children);
          if (found !== null) return found;
        }
      }
      return null;
    };
    if (nodeId.startsWith("group_")) {
      const group = locationGroups.find(
        (g) => `group_${g.id}` === nodeId,
      );
      return group?.items || 0;
    }
    return findNode(locationHierarchy) || 0;
  };

  const totalSkuCount = Array.from(productSelection).reduce(
    (sum, nodeId) => sum + getSkuCount(nodeId),
    0,
  );
  const totalStoreCount = Array.from(locationSelection).reduce(
    (sum, nodeId) => sum + getStoreCount(nodeId),
    0,
  );

  if (!isOpen) return null;

  const tabs = [
    {
      id: "scenarios",
      label: "Scenarios",
      icon: PlayCircle,
      disabled: false,
      hasSelection: !!selectedScenario,
      count: null,
      color: "orange",
    },
    {
      id: "panels",
      label: "Panels",
      icon: LayoutGrid,
      disabled: isPanelDisabled,
      hasSelection: !!selectedPanel,
      count: null,
      color: "purple",
    },
    {
      id: "rules",
      label: "Rules",
      icon: FileCheck,
      disabled: isRulesDisabled,
      hasSelection: false,
      count: selectedRules.size,
      color: "indigo",
    },
    {
      id: "scope",
      label: "Scope",
      icon: Target,
      disabled: false,
      hasSelection:
        productSelection.size > 0 || locationSelection.size > 0,
      count: null,
      color: "teal",
    },
  ];

  const getDotColor = (color) => {
    switch (color) {
      case "orange":
        return "bg-orange-500";
      case "purple":
        return "bg-purple-500";
      case "indigo":
        return "bg-indigo-500";
      case "teal":
        return "bg-teal-500";
      case "blue":
        return "bg-blue-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="w-80 bg-white border-l border-gray-200 flex flex-col h-full">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between bg-gray-50">
        <h3 className="font-semibold text-gray-800">
          Rule Context
        </h3>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-200 rounded transition-colors"
        >
          <X size={18} className="text-gray-500" />
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="grid grid-cols-4 border-b border-gray-200">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          const isDisabled = tab.disabled;

          return (
            <button
              key={tab.id}
              onClick={() =>
                !isDisabled && setActiveTab(tab.id)
              }
              disabled={isDisabled}
              title={
                isDisabled
                  ? tab.id === "panels"
                    ? "Select a scenario first"
                    : "Select a panel first"
                  : ""
              }
              className={`relative flex flex-col items-center gap-1 py-3 text-xs font-medium transition-colors ${
                isDisabled
                  ? "text-gray-300 cursor-not-allowed"
                  : isActive
                    ? "text-blue-600 bg-blue-50/50"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}
            >
              <div className="relative">
                <Icon size={18} />
                {/* Dot indicator for single-select tabs (Scenarios, Panels, Scope) */}
                {tab.hasSelection && !isDisabled && (
                  <span
                    className={`absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full border-2 border-white ${getDotColor(tab.color)}`}
                  />
                )}
                {/* Count badge for multi-select tabs (Rules) */}
                {tab.count !== null &&
                  tab.count > 0 &&
                  !isDisabled && (
                    <span
                      className={`absolute -top-1.5 -right-1.5 w-4 h-4 flex items-center justify-center text-[10px] font-bold rounded-full text-white ${getDotColor(tab.color)}`}
                    >
                      {tab.count}
                    </span>
                  )}
              </div>
              <span>{tab.label}</span>
              {isActive && (
                <div className="absolute bottom-0 left-2 right-2 h-0.5 bg-blue-600 rounded-full" />
              )}
            </button>
          );
        })}
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {activeTab === "scenarios" && (
          <ScenariosList
            selectedScenario={selectedScenario}
            onSelect={setSelectedScenario}
            onCreateNew={onCreateNewScenario}
            allScenarios={allScenarios}
            totalScenarios={totalScenariosCount}
          />
        )}

        {activeTab === "panels" && (
          <PanelsList
            selectedScenario={selectedScenario}
            selectedPanel={selectedPanel}
            onSelect={setSelectedPanel}
            onCreateNew={onCreateNewPanel}
            allPanels={allPanels}
            totalPanels={totalPanelsCount}
          />
        )}

        {activeTab === "scope" && (
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Scope Header */}
            <div className="px-3 py-3 border-b border-gray-100 bg-white">
              <div className="flex items-center justify-between mb-3">
                <div className="flex bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setScopeTab("products")}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                      scopeTab === "products"
                        ? "bg-white text-gray-800 shadow-sm"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    <Package
                      size={15}
                      className={
                        scopeTab === "products"
                          ? "text-blue-600"
                          : "text-gray-400"
                      }
                    />
                    <span>Products</span>
                  </button>
                  <button
                    onClick={() => setScopeTab("locations")}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                      scopeTab === "locations"
                        ? "bg-white text-gray-800 shadow-sm"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    <MapPin
                      size={15}
                      className={
                        scopeTab === "locations"
                          ? "text-green-600"
                          : "text-gray-400"
                      }
                    />
                    <span>Locations</span>
                  </button>
                </div>

                {isReadOnly && (
                  <div
                    className="flex items-center gap-1 text-amber-600"
                    title="Panel selection locked"
                  >
                    <Lock size={14} />
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">
                  {scopeTab === "locations"
                    ? "Select a location node"
                    : "Select a product node"}
                </span>
                <div className="flex bg-gray-100 rounded p-0.5">
                  <button
                    onClick={() => setScopeView("tree")}
                    className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                      scopeView === "tree"
                        ? "bg-white text-gray-700 shadow-sm"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    Tree
                  </button>
                  <button
                    onClick={() => setScopeView("groups")}
                    className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                      scopeView === "groups"
                        ? "bg-white text-gray-700 shadow-sm"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    Groups
                  </button>
                </div>
              </div>
            </div>

            <div
              className={`flex-1 overflow-auto ${isReadOnly ? "pointer-events-none opacity-60" : ""}`}
            >
              {scopeTab === "products" ? (
                scopeView === "tree" ? (
                  <div className="p-3">
                    {productHierarchy.map((node) => (
                      <TreeNode
                        key={node.id}
                        node={node}
                        selectedIds={productSelection}
                        onToggle={(id) =>
                          toggleSelection(id, "product")
                        }
                        expandedIds={expandedProducts}
                        onExpand={(id) =>
                          toggleExpand(id, "product")
                        }
                        readOnly={isReadOnly}
                      />
                    ))}
                  </div>
                ) : (
                  <GroupsTable
                    groups={productGroups}
                    selectedIds={productSelection}
                    onToggle={(id) =>
                      toggleSelection(id, "product")
                    }
                    readOnly={isReadOnly}
                  />
                )
              ) : scopeView === "tree" ? (
                <div className="p-3">
                  {locationHierarchy.map((node) => (
                    <TreeNode
                      key={node.id}
                      node={node}
                      selectedIds={locationSelection}
                      onToggle={(id) =>
                        toggleSelection(id, "location")
                      }
                      expandedIds={expandedLocations}
                      onExpand={(id) =>
                        toggleExpand(id, "location")
                      }
                      readOnly={isReadOnly}
                    />
                  ))}
                </div>
              ) : (
                <GroupsTable
                  groups={locationGroups}
                  selectedIds={locationSelection}
                  onToggle={(id) =>
                    toggleSelection(id, "location")
                  }
                  readOnly={isReadOnly}
                />
              )}
            </div>
          </div>
        )}

        {activeTab === "rules" && (
          <RulesList
            selectedPanel={selectedPanel}
            selectedRules={selectedRules}
            onToggleRule={toggleRule}
            onCreateNew={onCreateNewRule}
          />
        )}
      </div>

      {/* Footer Summary - Two Row Layout */}
      <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
        {/* Row 1: Scenario > Panel breadcrumb */}
        {(selectedScenarioData || selectedPanelData) && (
          <div className="flex items-center gap-1.5 text-sm mb-2 min-w-0">
            {selectedScenarioData && (
              <span
                className="flex items-center gap-1 text-orange-600 flex-shrink-0"
                title={selectedScenarioData.name}
              >
                <PlayCircle
                  size={14}
                  className="flex-shrink-0"
                />
                <span className="font-medium truncate max-w-[80px]">
                  {selectedScenarioData.name}
                </span>
              </span>
            )}
            {selectedScenarioData && selectedPanelData && (
              <ChevronRight
                size={14}
                className="text-gray-400 flex-shrink-0"
              />
            )}
            {selectedPanelData && (
              <span
                className="flex items-center gap-1 text-purple-600 min-w-0"
                title={selectedPanelData.name}
              >
                <LayoutGrid
                  size={14}
                  className="flex-shrink-0"
                />
                <span className="font-medium truncate max-w-[120px]">
                  {selectedPanelData.name}
                </span>
              </span>
            )}
          </div>
        )}

        {/* Row 2: Scope & Rules counts + Clear */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {productSelection.size > 0 && (
              <span className="flex items-center gap-1 text-blue-600">
                <Package size={14} />
                <span className="font-medium">
                  {totalSkuCount.toLocaleString()}
                </span>
              </span>
            )}
            {locationSelection.size > 0 && (
              <span className="flex items-center gap-1 text-green-600">
                <MapPin size={14} />
                <span className="font-medium">
                  {totalStoreCount.toLocaleString()}
                </span>
              </span>
            )}
            {selectedRules.size > 0 && (
              <span className="flex items-center gap-1 text-indigo-600">
                <FileCheck size={14} />
                <span className="font-medium">
                  {selectedRules.size}
                </span>
              </span>
            )}
            {!selectedScenarioData &&
              !selectedPanelData &&
              productSelection.size === 0 &&
              locationSelection.size === 0 &&
              selectedRules.size === 0 && (
                <span className="text-gray-400 text-sm">
                  No selection
                </span>
              )}
          </div>

          {(selectedScenario ||
            selectedPanel ||
            productSelection.size > 0 ||
            locationSelection.size > 0 ||
            selectedRules.size > 0) && (
            <button
              onClick={() => {
                setSelectedScenario(null);
                setSelectedPanel(null);
                setProductSelection(new Set());
                setLocationSelection(new Set());
                setSelectedRules(new Set());
              }}
              className="text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1"
            >
              <RotateCcw size={12} />
              <span>Clear</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// Agent Dropdown Component
const AgentDropdown = ({
  currentAgent,
  onSelect,
  isOpen,
  setIsOpen,
}) => {
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target)
      )
        setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener(
        "mousedown",
        handleClickOutside,
      );
  }, [setIsOpen]);

  const agent = agents.find((a) => a.id === currentAgent);
  const AgentIcon = agent.icon;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
      >
        <div
          className="w-7 h-7 rounded-md flex items-center justify-center"
          style={{ backgroundColor: agent.bgColor }}
        >
          <AgentIcon size={16} style={{ color: agent.color }} />
        </div>
        <span className="font-semibold text-gray-800 text-sm">
          {agent.name}
        </span>
        <ChevronDown
          size={16}
          className={`text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-64 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden z-50">
          <div className="p-1">
            <p className="px-3 py-1.5 text-xs font-medium text-gray-400 uppercase tracking-wider">
              Switch Agent
            </p>
            {agents.map((a) => {
              const Icon = a.icon;
              const isActive = a.id === currentAgent;
              return (
                <button
                  key={a.id}
                  onClick={() => {
                    onSelect(a.id);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 p-2.5 rounded-md transition-colors ${isActive ? "bg-gray-100" : "hover:bg-gray-50"}`}
                >
                  <div
                    className="w-8 h-8 rounded-md flex items-center justify-center"
                    style={{ backgroundColor: a.bgColor }}
                  >
                    <Icon
                      size={18}
                      style={{ color: a.color }}
                    />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-medium text-gray-800 text-sm">
                      {a.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {a.description}
                    </p>
                  </div>
                  {isActive && (
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

// Chat Message Component
const ChatMessage = ({
  message,
  onOpenContext,
  onSendMessage,
}) => {
  const isUser = message.role === "user";

  return (
    <div
      className={`flex gap-3 ${isUser ? "flex-row-reverse" : ""}`}
    >
      {!isUser && (
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-green-500 flex items-center justify-center flex-shrink-0">
          <Sparkles size={16} className="text-white" />
        </div>
      )}
      <div
        className={`max-w-[75%] ${isUser ? "text-right" : ""}`}
      >
        {isUser ? (
          <div className="px-4 py-2.5 rounded-xl text-sm bg-blue-600 text-white rounded-br-sm">
            {message.content}
          </div>
        ) : (
          <div className="flex-1 min-w-0">
            {/* Render new data structure */}
            {message.data && message.data.map((item, idx) => {
              if (item.type === 'readme') {
                return (
                  <div key={idx} className="prose prose-sm max-w-none text-sm leading-relaxed border rounded-xl px-4 py-3 shadow-sm text-slate-900 bg-white border-slate-200 mb-2">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        // Use custom table renderer with cell click handler
                        table: (props) => {
                          return (
                            <MarkdownTableRenderer
                              {...props}
                              onCellClick={(cellValue, headerText) => {
                                // When user clicks on an ID cell, send it as a message
                                onSendMessage(cellValue);
                              }}
                            />
                          );
                        }
                      }}
                    >
                      {item.content}
                    </ReactMarkdown>
                  </div>
                );
              } else if (item.type === 'follow-up') {
                return (
                  <div key={idx} className="mt-3 flex flex-wrap gap-2">
                    {item.content.map((suggestion, qIdx) => {
                      // Determine icon based on suggestion content
                      let Icon = ChevronRight;
                      const lowerSuggestion = suggestion.toLowerCase();

                      if (lowerSuggestion.includes('yes') || lowerSuggestion.includes('proceed') || lowerSuggestion.includes('create')) {
                        Icon = Check;
                      } else if (lowerSuggestion.includes('no') || lowerSuggestion.includes('cancel')) {
                        Icon = X;
                      } else if (lowerSuggestion.includes('show') || lowerSuggestion.includes('list') || lowerSuggestion.includes('example')) {
                        Icon = Search;
                      } else if (lowerSuggestion.includes('explain') || lowerSuggestion.includes('how') || lowerSuggestion.includes('what')) {
                        Icon = Lightbulb;
                      }

                      return (
                        <button
                          key={qIdx}
                          onClick={() => {
                            onSendMessage(suggestion);
                          }}
                          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300 transition-all duration-200 shadow-sm hover:shadow group"
                        >
                          <Icon className="w-4 h-4 text-slate-400 group-hover:text-blue-500 flex-shrink-0" />
                          <span>{suggestion}</span>
                        </button>
                      );
                    })}
                  </div>
                );
              }
              return null;
            })}

            {/* Legacy support for old messages with content property */}
            {message.content && !message.data && (
              <div className="px-4 py-2.5 rounded-xl text-sm bg-gray-100 text-gray-800 rounded-bl-sm">
                {message.content}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// Quick Action Card
const QuickActionCard = ({
  icon: Icon,
  text,
  color,
  onClick,
}) => (
  <button
    onClick={onClick}
    className="flex items-center gap-3 p-4 bg-white border border-gray-200 rounded-xl hover:border-gray-300 hover:shadow-sm transition-all text-left group w-full"
  >
    <div
      className="w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105 flex-shrink-0"
      style={{ backgroundColor: `${color}12` }}
    >
      <Icon size={20} style={{ color }} />
    </div>
    <span className="font-medium text-gray-700 text-sm flex-1 leading-snug">
      {text}
    </span>
    <ChevronRight
      size={16}
      className="text-gray-300 group-hover:text-gray-400 transition-colors flex-shrink-0"
    />
  </button>
);

// Main App Component
export default function ClearDemandEnterprise() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [contextPanelOpen, setContextPanelOpen] =
    useState(false);
  const [currentAgent, setCurrentAgent] = useState("chat");
  const [agentDropdownOpen, setAgentDropdownOpen] =
    useState(false);
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState([]);
  const [sessionId, setSessionId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [productSelection, setProductSelection] = useState(
    new Set(),
  );
  const [locationSelection, setLocationSelection] = useState(
    new Set(),
  );
  const [selectedScenario, setSelectedScenario] =
    useState(null);
  const [allScenarios, setAllScenarios] = useState([]);
  const [totalScenariosCount, setTotalScenariosCount] = useState(0);
  const [allPanels, setAllPanels] = useState([]);
  const [totalPanelsCount, setTotalPanelsCount] = useState(0);
  const [selectedPanel, setSelectedPanel] = useState(null);
  const [selectedRules, setSelectedRules] = useState(new Set());
  const [notificationPanelOpen, setNotificationPanelOpen] =
    useState(false);
  const [notifications, setNotifications] = useState(
    mockNotifications,
  );
  const [isLargeScreen, setIsLargeScreen] = useState(true);
  const inputRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Fetch all scenarios once on mount
  useEffect(() => {
    const fetchAllScenarios = async () => {
      try {
        const response = await axios.get('/api/v1/pricing-rules/scenario');
        const transformedScenarios = response.data.items.map(item => ({
          id: item.scenario_id,
          name: item.name,
          description: item.description || 'No description available'
        }));
        setAllScenarios(transformedScenarios);
        setTotalScenariosCount(response.data.total_items || 0);
      } catch (error) {
        console.error('Error fetching all scenarios:', error);
      }
    };
    fetchAllScenarios();
  }, []);

  // Fetch panels when scenario is selected
  useEffect(() => {
    const fetchPanelsForScenario = async () => {
      if (!selectedScenario) {
        setAllPanels([]);
        setTotalPanelsCount(0);
        return;
      }

      try {
        const response = await axios.get(`/api/v1/pricing-rules/panel?scenario_id=${selectedScenario}`);
        const transformedPanels = response.data.items.map(item => ({
          id: item.panel_id,
          name: item.panel_name,
          description: item.comment || 'No description available',
          priority: item.priority,
          location_node_id: item.location_node_id,
          location_group_id: item.location_group_id,
          product_group_id: item.product_group_id,
          product_node_id: item.product_node_id,
          scenarioId: item.scenario_id
        }));
        setAllPanels(transformedPanels);
        setTotalPanelsCount(response.data.total_items || 0);
      } catch (error) {
        console.error('Error fetching panels:', error);
        setAllPanels([]);
        setTotalPanelsCount(0);
      }
    };
    fetchPanelsForScenario();
  }, [selectedScenario]);

  // Scroll to bottom when messages change
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Track screen size for responsive panel behavior
  useEffect(() => {
    const checkScreenSize = () => {
      setIsLargeScreen(window.innerWidth >= 1024);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () =>
      window.removeEventListener("resize", checkScreenSize);
  }, []);

  const selectedScenarioData = allScenarios.find(
    (s) => s.id === selectedScenario,
  );
  const selectedPanelData = allPanels.find(
    (p) => p.id === selectedPanel,
  );
  const unreadNotificationCount = notifications.filter(
    (n) => !n.isRead,
  ).length;

  // Handle sidebar toggle - close scope panel on small screens
  const handleSidebarToggle = (open) => {
    if (!isLargeScreen && open) {
      setContextPanelOpen(false);
    }
    setSidebarOpen(open);
  };

  // Handle scope panel toggle - close sidebar on small screens
  const handleScopePanelToggle = () => {
    if (!isLargeScreen && !contextPanelOpen) {
      setSidebarOpen(false);
    }
    setContextPanelOpen(!contextPanelOpen);
  };

  // Helper function to get SKU count from a node ID
  const getSkuCount = (nodeId) => {
    const findNode = (nodes) => {
      for (const node of nodes) {
        if (node.id === nodeId) {
          // If node has count, return it; otherwise it's a SKU (count as 1)
          return node.count !== undefined ? node.count : 1;
        }
        if (node.children) {
          const found = findNode(node.children);
          if (found !== null) return found;
        }
      }
      return null;
    };

    // Check if it's a group
    if (nodeId.startsWith("group_")) {
      const group = productGroups.find(
        (g) => `group_${g.id}` === nodeId,
      );
      return group?.items || 0;
    }

    return findNode(productHierarchy) || 0;
  };

  // Helper function to get store count from a node ID
  const getStoreCount = (nodeId) => {
    const findNode = (nodes) => {
      for (const node of nodes) {
        if (node.id === nodeId) {
          // If node has count, return it; otherwise it's a store (count as 1)
          return node.count !== undefined ? node.count : 1;
        }
        if (node.children) {
          const found = findNode(node.children);
          if (found !== null) return found;
        }
      }
      return null;
    };

    // Check if it's a group
    if (nodeId.startsWith("group_")) {
      const group = locationGroups.find(
        (g) => `group_${g.id}` === nodeId,
      );
      return group?.items || 0;
    }

    return findNode(locationHierarchy) || 0;
  };

  // Calculate total SKU count from all product selections
  const totalSkuCount = Array.from(productSelection).reduce(
    (sum, nodeId) => sum + getSkuCount(nodeId),
    0,
  );

  // Calculate total store count from all location selections
  const totalStoreCount = Array.from(locationSelection).reduce(
    (sum, nodeId) => sum + getStoreCount(nodeId),
    0,
  );

  // When scenario changes, clear panel, scope, and rules selection
  const handleScenarioSelect = (scenarioId) => {
    setSelectedScenario(scenarioId);
    setSelectedPanel(null);
    setProductSelection(new Set());
    setLocationSelection(new Set());
    setSelectedRules(new Set());
  };

  // When panel is selected, auto-populate product/location and clear rules
  const handlePanelSelect = (panelId) => {
    setSelectedPanel(panelId);
    setSelectedRules(new Set()); // Clear rules when panel changes

    if (panelId) {
      const panel = allPanels.find((p) => p.id === panelId);
      if (panel) {
        // Auto-populate selections using IDs from API
        if (panel.product_node_id) {
          setProductSelection(new Set([panel.product_node_id]));
        }
        if (panel.location_node_id) {
          setLocationSelection(new Set([panel.location_node_id]));
        }
      }
    } else {
      setProductSelection(new Set());
      setLocationSelection(new Set());
    }
  };

  const handleCreateNewScenario = () => {
    setSelectedScenario(null);
    setSelectedPanel(null);
    setProductSelection(new Set());
    setLocationSelection(new Set());
    setSelectedRules(new Set());
    setInputValue("Create a new scenario: ");
    inputRef.current?.focus();
  };

  const handleCreateNewPanel = () => {
    setSelectedPanel(null);
    // Keep productSelection and locationSelection for the new panel's scope
    setSelectedRules(new Set());
    setInputValue("Create a new panel: ");
    inputRef.current?.focus();
  };

  const handleCreateNewRule = () => {
    setSelectedRules(new Set());
    setInputValue("Create a new rule: ");
    inputRef.current?.focus();
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage = inputValue;
    setInputValue("");
    setIsLoading(true);

    // Add user message to UI
    setMessages((prev) => [
      ...prev,
      { role: "user", content: userMessage },
    ]);

    // Generate or use existing session ID
    const currentSessionId = sessionId || generateTempSessionId();
    if (!sessionId) {
      setSessionId(currentSessionId);
    }

    // Build context payload
    const context = {};

    if (selectedScenario) {
      context.scenario_id = selectedScenario.toString();
    }

    if (selectedPanel) {
      context.panel_id = selectedPanel.toString();
    }

    if (selectedRules.size > 0) {
      context.rules = Array.from(selectedRules);
    }

    // Handle product selection (hierarchy or group)
    if (productSelection.size > 0) {
      const firstProductSelection = Array.from(productSelection)[0];
      if (firstProductSelection.startsWith("group_")) {
        context.product_group_id = firstProductSelection.replace("group_", "");
      } else {
        context.product_node_id = firstProductSelection;
      }
    }

    // Handle location selection (hierarchy or group)
    if (locationSelection.size > 0) {
      const firstLocationSelection = Array.from(locationSelection)[0];
      if (firstLocationSelection.startsWith("group_")) {
        context.location_group_id = firstLocationSelection.replace("group_", "");
      } else {
        context.location_node_id = firstLocationSelection;
      }
    }

    // Build API payload
    const payload = {
      user_input: userMessage,
      session_id: currentSessionId,
      agent: AGENT_MAPPING[currentAgent] || "chat-assistant",
    };

    // Only add context if it has properties
    if (Object.keys(context).length > 0) {
      payload.context = context;
    }

    try {
      // Call backend /chat endpoint
      const response = await axios.post(`${BACKEND_URL}/chat`, payload);

      // Extract response structure from backend
      const { response: apiResponse, session_id: newSessionId } = response.data;

      // Update session ID if backend returns a new one
      if (newSessionId && newSessionId !== currentSessionId) {
        setSessionId(newSessionId);
      }

      // Check status
      if (apiResponse.status === 'failure') {
        toast.error(apiResponse.message || "Failed to get response from AI");
        setIsLoading(false);
        return;
      }

      // Add AI message to chat with new data structure
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          data: apiResponse.data // Array with type: readme/follow-up/table
        }
      ]);

    } catch (error) {
      console.error("Error sending message:", error);

      // Add error message
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          data: [{
            type: 'readme',
            content: "Due to some technical issues, we cannot process this request. Please try again later."
          }]
        }
      ]);

      toast.error("Failed to send message. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickAction = (text) => {
    setInputValue(text);
    inputRef.current?.focus();
  };

  // 4 quick actions for each agent
  const quickActions =
    currentAgent === "chat"
      ? [
          {
            icon: Lightbulb,
            text: "How does ClearDemand pricing work?",
            color: "#F59E0B",
          },
          {
            icon: Zap,
            text: "Explain margin optimization strategies",
            color: "#8B5CF6",
          },
          {
            icon: Clock,
            text: "Show recent pricing changes",
            color: "#10B981",
          },
          {
            icon: TrendingUp,
            text: "Analyze competitor pricing trends",
            color: "#3B82F6",
          },
        ]
      : [
          {
            icon: FileText,
            text: "Create a new pricing rule",
            color: "#1565C0",
          },
          {
            icon: Trash2,
            text: "Delete a pricing scenario",
            color: "#EF4444",
          },
          {
            icon: Layers,
            text: "Create a new pricing panel",
            color: "#10B981",
          },
          {
            icon: HelpCircle,
            text: "What are dimensions in pricing?",
            color: "#8B5CF6",
          },
        ];

  return (
    <div className="h-screen flex bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <div
        className={`bg-white border-r border-gray-200 flex flex-col transition-all duration-300 ease-in-out ${sidebarOpen ? "w-64" : "w-16"}`}
      >
        {/* Sidebar Header - Logo Area */}
        <div
          className={`p-3 border-b border-gray-100 ${sidebarOpen ? "" : "flex justify-center"}`}
        >
          {sidebarOpen ? (
            /* OPEN STATE: Logo + ClearDemand + Toggle Button */
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ClearDemandLogoMini size={36} />
                <div>
                  <h1 className="font-bold text-gray-900 text-sm leading-tight">
                    ClearDemand
                  </h1>
                  <p className="text-xs text-gray-500">
                    Pricing Intelligence
                  </p>
                </div>
              </div>
              <button
                onClick={() => handleSidebarToggle(false)}
                className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors text-gray-400 hover:text-gray-600"
                title="Close sidebar"
              >
                <PanelLeftClose size={18} />
              </button>
            </div>
          ) : (
            /* CLOSED STATE: Logo only, toggle appears on hover */
            <div
              className="relative w-10 h-10 flex items-center justify-center cursor-pointer group"
              onClick={() => handleSidebarToggle(true)}
            >
              {/* Logo - visible by default, hidden on hover */}
              <div className="transition-opacity duration-200 group-hover:opacity-0">
                <ClearDemandLogoMini size={36} />
              </div>

              {/* Toggle button - hidden by default, shown on hover (replaces logo) */}
              <div className="absolute inset-0 flex items-center justify-center transition-opacity duration-200 opacity-0 group-hover:opacity-100">
                <div className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center transition-colors">
                  <PanelLeft
                    size={20}
                    className="text-gray-600"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* New Chat Button */}
        <div
          className={`p-3 ${sidebarOpen ? "" : "flex justify-center"}`}
        >
          {sidebarOpen ? (
            <button className="flex items-center justify-center gap-2 py-2.5 px-4 bg-blue-600 text-white rounded-lg font-medium text-sm hover:bg-blue-700 transition-colors w-full">
              <Plus size={18} />
              <span>New Chat</span>
            </button>
          ) : (
            <button
              className="w-10 h-10 bg-blue-600 text-white rounded-lg flex items-center justify-center hover:bg-blue-700 transition-colors"
              title="New Chat"
            >
              <Plus size={20} />
            </button>
          )}
        </div>

        {/* Chat History - Only when sidebar is open */}
        {sidebarOpen && (
          <div className="flex-1 overflow-y-auto px-3 pb-3">
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2 px-2">
              Recent
            </p>
            <div className="space-y-0.5">
              {sampleChats.map((chat) => {
                const chatAgent = agents.find(
                  (a) => a.id === chat.agent,
                );
                const ChatAgentIcon = chatAgent.icon;
                return (
                  <button
                    key={chat.id}
                    className="w-full flex items-center gap-2.5 p-2 rounded-lg hover:bg-gray-100 transition-colors text-left group"
                  >
                    <div
                      className="w-6 h-6 rounded flex items-center justify-center flex-shrink-0"
                      style={{
                        backgroundColor: chatAgent.bgColor,
                      }}
                    >
                      <ChatAgentIcon
                        size={12}
                        style={{ color: chatAgent.color }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-700 truncate">
                        {chat.title}
                      </p>
                      <p className="text-xs text-gray-400">
                        {chat.time}
                      </p>
                    </div>
                    {chat.hasContext && (
                      <Target
                        size={12}
                        className="text-gray-300"
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-4 py-2.5 flex items-center justify-between">
          <AgentDropdown
            currentAgent={currentAgent}
            onSelect={setCurrentAgent}
            isOpen={agentDropdownOpen}
            setIsOpen={setAgentDropdownOpen}
          />

          <div className="flex items-center gap-1">
            {currentAgent === "rules" && (
              <button
                onClick={handleScopePanelToggle}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors ${contextPanelOpen ? "bg-blue-50 text-blue-700" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
              >
                <Target size={16} />
                <span className="font-medium">Context</span>
              </button>
            )}

            {/* Notification Button */}
            <div className="relative">
              <button
                onClick={() =>
                  setNotificationPanelOpen(
                    !notificationPanelOpen,
                  )
                }
                className={`p-2 rounded-lg transition-colors relative ${notificationPanelOpen ? "bg-blue-50 text-blue-600" : "hover:bg-gray-100 text-gray-500"}`}
                title="Notifications"
              >
                <Bell size={18} />
                {unreadNotificationCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {unreadNotificationCount > 9
                      ? "9+"
                      : unreadNotificationCount}
                  </span>
                )}
              </button>
              <NotificationPanel
                isOpen={notificationPanelOpen}
                onClose={() => setNotificationPanelOpen(false)}
                notifications={notifications}
                setNotifications={setNotifications}
              />
            </div>

            <button
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500"
              title="Expand"
            >
              <Maximize2 size={18} />
            </button>
            <button
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500"
              title="Close"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Chat + Context Panel Container */}
        <div className="flex-1 flex overflow-hidden">
          {/* Chat Area */}
          <div className="flex-1 flex flex-col min-w-0">
            <div className="flex-1 overflow-y-auto">
              {messages.length === 0 ? (
                /* Welcome Screen with 2x2 Grid */
                <div className="h-full flex flex-col items-center justify-center p-8">
                  <div className="max-w-2xl w-full">
                    <div className="text-center mb-8">
                      <div className="flex justify-center mb-4">
                        <ClearDemandLogo size={64} />
                      </div>
                      <h2 className="text-xl font-bold text-gray-900 mb-2">
                        Welcome to ClearDemand
                      </h2>
                      <p className="text-gray-500 text-sm max-w-md mx-auto">
                        {currentAgent === "chat"
                          ? "Your intelligent pricing analyst. Ask me anything about pricing scenarios, strategies, or market insights."
                          : "Create and manage pricing rules with ease. I'll guide you through the process step by step."}
                      </p>
                    </div>

                    {/* 2x2 Grid of Quick Actions */}
                    <div className="grid grid-cols-2 gap-3">
                      {quickActions.map((action, i) => (
                        <QuickActionCard
                          key={i}
                          icon={action.icon}
                          text={action.text}
                          color={action.color}
                          onClick={() =>
                            handleQuickAction(action.text)
                          }
                        />
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                /* Messages */
                <div className="p-6 space-y-6 max-w-3xl mx-auto">
                  {messages.map((msg, i) => (
                    <ChatMessage
                      key={i}
                      message={msg}
                      onOpenContext={() =>
                        setContextPanelOpen(true)
                      }
                      onSendMessage={(text) => {
                        setInputValue(text);
                        setTimeout(() => {
                          handleSendMessage();
                        }, 100);
                      }}
                    />
                  ))}
                  {isLoading && (
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-green-500 flex items-center justify-center flex-shrink-0">
                        <Sparkles size={16} className="text-white" />
                      </div>
                      <div className="border rounded-xl px-4 py-3 shadow-sm bg-white border-slate-200">
                        <div className="typing-indicator">
                          <span></span>
                          <span></span>
                          <span></span>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-gray-200">
              <div className="max-w-3xl mx-auto">
                {currentAgent === "rules" &&
                  (selectedScenario ||
                    selectedPanel ||
                    productSelection.size > 0 ||
                    locationSelection.size > 0 ||
                    selectedRules.size > 0) && (
                    <div className="flex gap-2 mb-3 flex-wrap">
                      {selectedScenarioData && (
                        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-orange-50 border border-orange-200 rounded-md text-xs">
                          <PlayCircle
                            size={12}
                            className="text-orange-600"
                          />
                          <span className="text-orange-700 font-medium">
                            {selectedScenarioData.name}
                          </span>
                        </div>
                      )}
                      {selectedPanelData && (
                        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-purple-50 border border-purple-200 rounded-md text-xs">
                          <LayoutGrid
                            size={12}
                            className="text-purple-600"
                          />
                          <span className="text-purple-700 font-medium">
                            {selectedPanelData.name}
                          </span>
                        </div>
                      )}
                      {productSelection.size > 0 && (
                        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 border border-blue-200 rounded-md text-xs">
                          <Package
                            size={12}
                            className="text-blue-600"
                          />
                          <span className="text-blue-700 font-medium">
                            {totalSkuCount.toLocaleString()}{" "}
                            SKUs
                          </span>
                        </div>
                      )}
                      {locationSelection.size > 0 && (
                        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-green-50 border border-green-200 rounded-md text-xs">
                          <MapPin
                            size={12}
                            className="text-green-600"
                          />
                          <span className="text-green-700 font-medium">
                            {totalStoreCount.toLocaleString()}{" "}
                            stores
                          </span>
                        </div>
                      )}
                      {selectedRules.size > 0 && (
                        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-indigo-50 border border-indigo-200 rounded-md text-xs">
                          <FileCheck
                            size={12}
                            className="text-indigo-600"
                          />
                          <span className="text-indigo-700 font-medium">
                            {selectedRules.size} rule
                            {selectedRules.size > 1 ? "s" : ""}
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                <div className="flex items-end gap-2 p-2 bg-gray-50 rounded-xl border border-gray-200 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                  <button className="p-2 hover:bg-gray-200 rounded-lg transition-colors flex-shrink-0">
                    <Paperclip
                      size={18}
                      className="text-gray-500"
                    />
                  </button>
                  <textarea
                    ref={inputRef}
                    value={inputValue}
                    onChange={(e) =>
                      setInputValue(e.target.value)
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    placeholder={
                      currentAgent === "chat"
                        ? "Ask anything about pricing..."
                        : "Describe the rule you want to create..."
                    }
                    className="flex-1 bg-transparent resize-none outline-none text-gray-700 placeholder:text-gray-400 text-sm min-h-[24px] max-h-32 py-2"
                    rows={1}
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!inputValue.trim()}
                    className={`p-2 rounded-lg transition-all flex-shrink-0 ${inputValue.trim() ? "bg-blue-600 text-white hover:bg-blue-700" : "bg-gray-200 text-gray-400"}`}
                  >
                    <Send size={18} />
                  </button>
                </div>

                <p className="text-xs text-gray-400 text-center mt-2">
                  ClearDemand AI can make mistakes. Please
                  verify important information.
                </p>
              </div>
            </div>
          </div>

          {/* Context Panel */}
          {currentAgent === "rules" && (
            <ContextPanel
              isOpen={contextPanelOpen}
              onClose={() => setContextPanelOpen(false)}
              productSelection={productSelection}
              setProductSelection={setProductSelection}
              locationSelection={locationSelection}
              setLocationSelection={setLocationSelection}
              selectedScenario={selectedScenario}
              setSelectedScenario={handleScenarioSelect}
              selectedPanel={selectedPanel}
              setSelectedPanel={handlePanelSelect}
              selectedRules={selectedRules}
              setSelectedRules={setSelectedRules}
              onCreateNewScenario={handleCreateNewScenario}
              onCreateNewPanel={handleCreateNewPanel}
              onCreateNewRule={handleCreateNewRule}
              allScenarios={allScenarios}
              totalScenariosCount={totalScenariosCount}
              allPanels={allPanels}
              totalPanelsCount={totalPanelsCount}
            />
          )}
        </div>
      </div>
      <Toaster position="top-right" richColors />
    </div>
  );
}
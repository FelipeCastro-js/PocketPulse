import { CategoryType, ExpenseCategoriesType } from "@/types";

import * as Icons from "phosphor-react-native";

export const expenseCategories: ExpenseCategoriesType = {
  groceries: {
    label: "Groceries",
    value: "groceries",
    icon: Icons.ShoppingCart,
    bgColor: "#4B5563",
  },
  rent: {
    label: "Rent",
    value: "rent",
    icon: Icons.House,
    bgColor: "#075985",
  },
  utilities: {
    label: "Utilities",
    value: "utilities",
    icon: Icons.Lightbulb,
    bgColor: "#ca8a04",
  },
  transportation: {
    label: "Transportation",
    value: "transportation",
    icon: Icons.Car,
    bgColor: "#b45309",
  },
  entertainment: {
    label: "Entertainment",
    value: "entertainment",
    icon: Icons.FilmStrip,
    bgColor: "#0f766e",
  },
  dining: {
    label: "Dining",
    value: "dining",
    icon: Icons.ForkKnife,
    bgColor: "#be185d",
  },
  health: {
    label: "Health",
    value: "health",
    icon: Icons.Heart,
    bgColor: "#e11d48",
  },
  shopping: {
    label: "Shopping",
    value: "shopping",
    icon: Icons.ShoppingCart,
    bgColor: "#7c3aed",
  },
  school: {
    label: "School",
    value: "school",
    icon: Icons.Student,
    bgColor: "#0f766e",
  },
  wages: {
    label: "Wages",
    value: "wages",
    icon: Icons.CookingPot,
    bgColor: "#404040",
  },
  transfers: {
    label: "Transfers",
    value: "transfers",
    icon: Icons.ArrowsCounterClockwise,
    bgColor: "#404040",
  },
  support: {
    label: "Support",
    value: "support",
    icon: Icons.FirstAid,
    bgColor: "#065F46",
  },
  savings: {
    label: "Savings",
    value: "savings",
    icon: Icons.PiggyBank,
    bgColor: "#065F46",
  },
  clothing: {
    label: "Clothing",
    value: "clothing",
    icon: Icons.TShirt,
    bgColor: "#7c3aed",
  },
  personal: {
    label: "Personal",
    value: "personal",
    icon: Icons.User,
    bgColor: "#a21caf",
  },
  homecash: {
    label: "Homecash",
    value: "homecash",
    icon: Icons.Money,
    bgColor: "#065F46",
  },
  others: {
    label: "Others",
    value: "others",
    icon: Icons.DotsThreeOutline,
    bgColor: "#525252",
  },
};

export const incomeCategory: CategoryType = {
  label: "Income",
  value: "income",
  icon: Icons.Money,
  bgColor: "#16a34a",
};

export const transactionTypes = [
  { label: "Expense", value: "expense" },
  { label: "Income", value: "income" },
];

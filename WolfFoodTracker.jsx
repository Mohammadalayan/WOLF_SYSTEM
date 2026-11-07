import React, { useState, useEffect, useRef, useMemo } from "react";

// ============================================================
// CONFIG
// Get a free key from https://fdc.nal.usda.gov/api-key-signup
// (for a public app, move this call to a small backend)
// ============================================================
const USDA_KEY = "YOUR_USDA_KEY";

// ============================================================
// LOCAL DATABASE: Lebanese foods + daily staples, with aliases
// Values are per 100g unless baseGrams says otherwise.
// Lebanese/composite items are approximate: adjust to your brands.
// ============================================================
export default function localCleanDatabase (){ 
  // --- Dairy & cheeses ---
  const localCleanDatabase=[
  { name: "Apple (Fresh, Medium)", calories: 95, protein: 0.5, carbs: 25.0, fat: 0.3, serving: "1 piece (~182g)", baseGrams: 182, source: "Local" },
  { name: "Banana (Fresh, Medium)", calories: 105, protein: 1.3, carbs: 27.0, fat: 0.3, serving: "1 piece (~118g)", baseGrams: 118, source: "Local" },
  { name: "Orange (Fresh, Medium)", calories: 62, protein: 1.2, carbs: 15.4, fat: 0.2, serving: "1 piece (~131g)", baseGrams: 131, source: "Local" },
  { name: "Mandarin / Clementine", calories: 47, protein: 0.8, carbs: 12.0, fat: 0.3, serving: "Per 100g", baseGrams: 100, source: "Local" },
  { name: "Dates (Medjool)", calories: 277, protein: 1.8, carbs: 75.0, fat: 0.1, serving: "Per 100g", baseGrams: 100, source: "Local" },
  { name: "Watermelon", calories: 30, protein: 0.6, carbs: 7.5, fat: 0.15, serving: "Per 100g", baseGrams: 100, source: "Local" },
  { name: "Melon (Cantaloupe)", calories: 34, protein: 0.8, carbs: 8.2, fat: 0.2, serving: "Per 100g", baseGrams: 100, source: "Local" },
  { name: "Strawberries", calories: 32, protein: 0.7, carbs: 7.7, fat: 0.3, serving: "Per 100g", baseGrams: 100, source: "Local" },
  { name: "Blueberries", calories: 57, protein: 0.7, carbs: 14.5, fat: 0.3, serving: "Per 100g", baseGrams: 100, source: "Local" },
  { name: "Grapes (Red or Green)", calories: 69, protein: 0.7, carbs: 18.1, fat: 0.16, serving: "Per 100g", baseGrams: 100, source: "Local" },
  { name: "Peach", calories: 39, protein: 0.9, carbs: 9.5, fat: 0.25, serving: "Per 100g", baseGrams: 100, source: "Local" },
  { name: "Pear", calories: 57, protein: 0.4, carbs: 15.2, fat: 0.14, serving: "Per 100g", baseGrams: 100, source: "Local" },
  { name: "Pineapple", calories: 50, protein: 0.5, carbs: 13.1, fat: 0.12, serving: "Per 100g", baseGrams: 100, source: "Local" },
  { name: "Mango", calories: 60, protein: 0.8, carbs: 15.0, fat: 0.4, serving: "Per 100g", baseGrams: 100, source: "Local" },
  { name: "Kiwi", calories: 61, protein: 1.1, carbs: 14.7, fat: 0.5, serving: "Per 100g", baseGrams: 100, source: "Local" },
  { name: "Pomegranate", calories: 83, protein: 1.7, carbs: 18.7, fat: 1.2, serving: "Per 100g", baseGrams: 100, source: "Local" },
  { name: "Lemon", calories: 29, protein: 1.1, carbs: 9.3, fat: 0.3, serving: "Per 100g", baseGrams: 100, source: "Local" },
  { name: "Cherry", calories: 50, protein: 1.0, carbs: 12.0, fat: 0.3, serving: "Per 100g", baseGrams: 100, source: "Local" },
  { name: "Fig (Fresh)", calories: 74, protein: 0.75, carbs: 19.2, fat: 0.3, serving: "Per 100g", baseGrams: 100, source: "Local" },
  { name: "Plum", calories: 46, protein: 0.7, carbs: 11.4, fat: 0.28, serving: "Per 100g", baseGrams: 100, source: "Local" },

  // ==========================================
  // 2. كل أنواع الخضار (All Vegetables)
  // ==========================================
  { name: "Cucumber (With Peel)", calories: 15, protein: 0.6, carbs: 3.6, fat: 0.1, serving: "Per 100g", baseGrams: 100, source: "Local" },
  { name: "Tomato", calories: 18, protein: 0.9, carbs: 3.9, fat: 0.2, serving: "Per 100g", baseGrams: 100, source: "Local" },
  { name: "Lettuce (Romaine / Green)", calories: 17, protein: 1.2, carbs: 3.3, fat: 0.3, serving: "Per 100g", baseGrams: 100, source: "Local" },
  { name: "Broccoli (Boiled)", calories: 35, protein: 2.4, carbs: 7.2, fat: 0.4, serving: "Per 100g", baseGrams: 100, source: "Local" },
  { name: "Spinach (Raw)", calories: 23, protein: 2.9, carbs: 3.6, fat: 0.4, serving: "Per 100g", baseGrams: 100, source: "Local" },
  { name: "Onion", calories: 40, protein: 1.1, carbs: 9.3, fat: 0.1, serving: "Per 100g", baseGrams: 100, source: "Local" },
  { name: "Garlic", calories: 149, protein: 6.4, carbs: 33.0, fat: 0.5, serving: "Per 100g", baseGrams: 100, source: "Local" },
  { name: "Bell Pepper (Green/Red/Yellow)", calories: 31, protein: 1.0, carbs: 6.0, fat: 0.3, serving: "Per 100g", baseGrams: 100, source: "Local" },
  { name: "Carrot", calories: 41, protein: 0.9, carbs: 9.6, fat: 0.2, serving: "Per 100g", baseGrams: 100, source: "Local" },
  { name: "Zucchini (Courgette)", calories: 17, protein: 1.2, carbs: 3.1, fat: 0.3, serving: "Per 100g", baseGrams: 100, source: "Local" },
  { name: "Eggplant (Aubergine)", calories: 25, protein: 1.0, carbs: 6.0, fat: 0.2, serving: "Per 100g", baseGrams: 100, source: "Local" },
  { name: "Cabbage", calories: 25, protein: 1.3, carbs: 5.8, fat: 0.1, serving: "Per 100g", baseGrams: 100, source: "Local" },
  { name: "Cauliflower", calories: 25, protein: 1.9, carbs: 5.0, fat: 0.3, serving: "Per 100g", baseGrams: 100, source: "Local" },
  { name: "Green Beans", calories: 31, protein: 1.8, carbs: 7.0, fat: 0.1, serving: "Per 100g", baseGrams: 100, source: "Local" },
  { name: "Green Peas", calories: 81, protein: 5.4, carbs: 14.5, fat: 0.4, serving: "Per 100g", baseGrams: 100, source: "Local" },
  { name: "Mushroom", calories: 22, protein: 3.1, carbs: 3.3, fat: 0.3, serving: "Per 100g", baseGrams: 100, source: "Local" },
  { name: "Parsley", calories: 36, protein: 3.0, carbs: 6.3, fat: 0.8, serving: "Per 100g", baseGrams: 100, source: "Local" },
  { name: "Mint", calories: 70, protein: 3.8, carbs: 14.9, fat: 0.9, serving: "Per 100g", baseGrams: 100, source: "Local" },
  { name: "Celery", calories: 16, protein: 0.7, carbs: 3.0, fat: 0.2, serving: "Per 100g", baseGrams: 100, source: "Local" },
  { name: "Radish", calories: 16, protein: 0.7, carbs: 3.4, fat: 0.1, serving: "Per 100g", baseGrams: 100, source: "Local" },

  // ==========================================
  // 3. الألبان والأجبان بجميع درجات الدسم
  // ==========================================
  { name: "Labneh (Full Fat / Full Cream)", calories: 200, protein: 7.0, carbs: 4.0, fat: 16.0, serving: "Per 100g", baseGrams: 100, source: "Local" },
  { name: "Labneh (Medium Fat / Light)", calories: 130, protein: 8.5, carbs: 4.5, fat: 8.0, serving: "Per 100g", baseGrams: 100, source: "Local" },
  { name: "Labneh (Low Fat / Zero Fat)", calories: 80, protein: 10.0, carbs: 5.0, fat: 1.0, serving: "Per 100g", baseGrams: 100, source: "Local" },
  { name: "White Cheese / Baladi (Full Fat)", calories: 280, protein: 16.0, carbs: 2.0, fat: 23.0, serving: "Per 100g", baseGrams: 100, source: "Local" },
  { name: "White Cheese / Baladi (Low Fat)", calories: 180, protein: 19.0, carbs: 2.0, fat: 10.0, serving: "Per 100g", baseGrams: 100, source: "Local" },
  { name: "Halloumi Cheese (Full Fat)", calories: 321, protein: 25.0, carbs: 1.9, fat: 24.0, serving: "Per 100g", baseGrams: 100, source: "Local" },
  { name: "Halloumi Cheese (Light / Low Fat)", calories: 220, protein: 27.0, carbs: 2.0, fat: 11.5, serving: "Per 100g", baseGrams: 100, source: "Local" },
  { name: "Akkawi Cheese (Desalted)", calories: 250, protein: 18.0, carbs: 1.5, fat: 19.0, serving: "Per 100g", baseGrams: 100, source: "Local" },
  { name: "Cheddar Cheese (Full Fat)", calories: 403, protein: 25.0, carbs: 1.3, fat: 33.0, serving: "Per 100g", baseGrams: 100, source: "Local" },
  { name: "Cheddar Cheese (Reduced Fat)", calories: 282, protein: 27.0, carbs: 2.0, fat: 18.0, serving: "Per 100g", baseGrams: 100, source: "Local" },
  { name: "Mozzarella Cheese", calories: 280, protein: 28.0, carbs: 3.1, fat: 17.0, serving: "Per 100g", baseGrams: 100, source: "Local" },
  { name: "Feta Cheese (Full Fat)", calories: 264, protein: 14.2, carbs: 4.1, fat: 21.3, serving: "Per 100g", baseGrams: 100, source: "Local" },
  { name: "Feta Cheese (Light / Low Fat)", calories: 150, protein: 16.0, carbs: 3.0, fat: 8.0, serving: "Per 100g", baseGrams: 100, source: "Local" },
  { name: "Cottage Cheese (Low Fat 2%)", calories: 81, protein: 11.5, carbs: 3.8, fat: 2.0, serving: "Per 100g", baseGrams: 100, source: "Local" },
  { name: "Milk (Whole, 3.25% Fat)", calories: 61, protein: 3.2, carbs: 4.8, fat: 3.3, serving: "Per 100ml", baseGrams: 100, source: "Local" },
  { name: "Milk (Low Fat / Skim)", calories: 35, protein: 3.4, carbs: 5.0, fat: 0.1, serving: "Per 100ml", baseGrams: 100, source: "Local" },
  { name: "Greek Yogurt (Zero Fat 0%)", calories: 59, protein: 10.2, carbs: 3.6, fat: 0.4, serving: "Per 100g", baseGrams: 100, source: "Local" },

  // ==========================================
  // 4. البيض والترويقة والنشويات الأساسية
  // ==========================================
  { name: "Egg (Whole, Medium)", calories: 65, protein: 6.3, carbs: 0.4, fat: 4.4, serving: "1 piece (50g)", baseGrams: 50, source: "Local" },
  { name: "Egg (Whole, Large)", calories: 74, protein: 6.3, carbs: 0.4, fat: 5.0, serving: "1 piece (56g)", baseGrams: 56, source: "Local" },
  { name: "Egg White", calories: 17, protein: 3.6, carbs: 0.2, fat: 0.1, serving: "1 piece (~33g)", baseGrams: 33, source: "Local" },
  { name: "Oats (Dry)", calories: 389, protein: 16.9, carbs: 66.0, fat: 6.9, serving: "Per 100g", baseGrams: 100, source: "Local" },
  { name: "White Bread", calories: 265, protein: 9.0, carbs: 49.0, fat: 3.2, serving: "Per 100g", baseGrams: 100, source: "Local" },
  { name: "Whole Wheat Bread (Brown Bread)", calories: 247, protein: 13.0, carbs: 41.0, fat: 3.4, serving: "Per 100g", baseGrams: 100, source: "Local" },
  { name: "Peanut Butter", calories: 588, protein: 25.0, carbs: 20.0, fat: 50.0, serving: "Per 100g", baseGrams: 100, source: "Local" },
  { name: "Honey", calories: 304, protein: 0.3, carbs: 82.4, fat: 0, serving: "Per 100g", baseGrams: 100, source: "Local" },
  { name: "Beans / Foul (Cooked)", calories: 110, protein: 7.6, carbs: 20.0, fat: 0.5, serving: "Per 100g", baseGrams: 100, source: "Local" },
  { name: "Hummus (Dip)", calories: 166, protein: 7.9, carbs: 14.3, fat: 9.6, serving: "Per 100g", baseGrams: 100, source: "Local" },

  // ==========================================
  // 5. المناقيش والوجبات (Fried vs Oven)
  // ==========================================
  { name: "Manousheh Zaatar (Standard)", calories: 350, protein: 8.0, carbs: 45.0, fat: 15.0, serving: "1 piece (~120g)", baseGrams: 120, source: "Local" },
  { name: "Manousheh Akkawi Cheese", calories: 450, protein: 18.0, carbs: 42.0, fat: 22.0, serving: "1 piece (~150g)", baseGrams: 150, source: "Local" },
  { name: "Manousheh Meat (Lahm Bi Ajeen)", calories: 380, protein: 16.0, carbs: 40.0, fat: 17.0, serving: "1 piece (~130g)", baseGrams: 130, source: "Local" },
  
  { name: "Chicken Crispy Strips (Oven Baked / Air Fryer)", calories: 230, protein: 24.0, carbs: 16.0, fat: 7.0, serving: "Per 100g", baseGrams: 100, source: "Local" },
  { name: "Chicken Crispy Strips (Deep Fried)", calories: 320, protein: 22.0, carbs: 18.0, fat: 18.0, serving: "Per 100g", baseGrams: 100, source: "Local" },
  
  { name: "Chicken Escalope (Oven Baked / Air Fryer)", calories: 210, protein: 25.0, carbs: 15.0, fat: 5.5, serving: "Per 100g", baseGrams: 100, source: "Local" },
  { name: "Chicken Escalope (Breaded & Deep Fried)", calories: 290, protein: 24.0, carbs: 16.0, fat: 14.0, serving: "Per 100g", baseGrams: 100, source: "Local" },
  
  { name: "French Fries (Oven Baked / Air Fryer)", calories: 160, protein: 3.0, carbs: 35.0, fat: 3.5, serving: "Per 100g", baseGrams: 100, source: "Local" },
  { name: "French Fries (Deep Fried)", calories: 312, protein: 3.4, carbs: 41.0, fat: 15.0, serving: "Per 100g", baseGrams: 100, source: "Local" },
  
  { name: "Garlic Sauce / Toum", calories: 350, protein: 0.8, carbs: 10.0, fat: 35.0, serving: "Per 100g", baseGrams: 100, source: "Local" },
  { name: "Chicken Tawook Sandwich (Standard)", calories: 480, protein: 35.0, carbs: 45.0, fat: 18.0, serving: "1 sandwich (~250g)", baseGrams: 250, source: "Local" },
  { name: "Chicken Shawarma Sandwich", calories: 460, protein: 30.0, carbs: 44.0, fat: 18.0, serving: "1 sandwich (~250g)", baseGrams: 250, source: "Local" },
  { name: "Meat Shawarma Sandwich", calories: 520, protein: 28.0, carbs: 44.0, fat: 25.0, serving: "1 sandwich (~250g)", baseGrams: 250, source: "Local" },

  // ==========================================
  // 6. اللحوم والدجاج والأسماك والنشويات
  // ==========================================
  { name: "Chicken Breast (Cooked, Skinless)", calories: 165, protein: 31.0, carbs: 0, fat: 3.6, serving: "Per 100g", baseGrams: 100, source: "Local" },
  { name: "Beef Steak (Lean, Cooked)", calories: 250, protein: 26.0, carbs: 0, fat: 15.0, serving: "Per 100g", baseGrams: 100, source: "Local" },
  { name: "Tuna (Canned in Water)", calories: 116, protein: 26.0, carbs: 0, fat: 0.8, serving: "Per 100g", baseGrams: 100, source: "Local" },
  { name: "Salmon (Cooked)", calories: 206, protein: 22.0, carbs: 0, fat: 12.3, serving: "Per 100g", baseGrams: 100, source: "Local" },
  { name: "White Rice (Cooked)", calories: 130, protein: 2.7, carbs: 28.0, fat: 0.3, serving: "Per 100g", baseGrams: 100, source: "Local" },
  { name: "Potato (Boiled)", calories: 87, protein: 1.9, carbs: 20.0, fat: 0.1, serving: "Per 100g", baseGrams: 100, source: "Local" },
  { name: "Sweet Potato (Baked)", calories: 90, protein: 2.0, carbs: 20.7, fat: 0.2, serving: "Per 100g", baseGrams: 100, source: "Local" },
  { name: "Olive Oil", calories: 884, protein: 0, carbs: 0, fat: 100.0, serving: "Per 100g", baseGrams: 100, source: "Local" },
  { name: "Avocado", calories: 160, protein: 2.0, carbs: 8.5, fat: 14.7, serving: "Per 100g", baseGrams: 100, source: "Local" },

  // ==========================================
  // 7. الحلويات، الشوكولاتة والسناكس
  // ==========================================
  { name: "Knafeh (Cheese / Ashta - Middle Eastern)", calories: 420, protein: 7.0, carbs: 48.0, fat: 22.0, serving: "Per 100g", baseGrams: 100, source: "Local" },
  { name: "Baklava (Mixed Nuts)", calories: 510, protein: 7.5, carbs: 49.0, fat: 32.0, serving: "Per 100g", baseGrams: 100, source: "Local" },
  { name: "Maamoul (Date / Pistachio)", calories: 450, protein: 5.0, carbs: 62.0, fat: 21.0, serving: "Per 100g", baseGrams: 100, source: "Local" },
  { name: "Dark Chocolate (70-85% Cocoa)", calories: 598, protein: 7.8, carbs: 45.0, fat: 42.6, serving: "Per 100g", baseGrams: 100, source: "Local" },
  { name: "Milk Chocolate (Standard)", calories: 535, protein: 7.7, carbs: 59.4, fat: 29.7, serving: "Per 100g", baseGrams: 100, source: "Local" },
  { name: "Potato Chips / Crisps (Packaged)", calories: 536, protein: 6.0, carbs: 53.0, fat: 34.0, serving: "Per 100g", baseGrams: 100, source: "Local" },
  { name: "Croissant (Butter / Plain)", calories: 406, protein: 8.2, carbs: 45.8, fat: 21.0, serving: "1 piece (~60g)", baseGrams: 60, source: "Local" }
].map((f) => ({ ...f, source: "Local" }));
return localCleanDatabasee;
}
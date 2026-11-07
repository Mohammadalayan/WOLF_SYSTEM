import React, { useState, useEffect } from "react";
import { loadTodayLog, saveTodayLog } from "./Wolfstorage.jsx";

// =====================================================================
// قاعدة البيانات المحلية (بدون API)
// كل الأرقام لكل 100g (أو 100ml) إلا إذا مكتوب serving مختلف.
// Raw = قبل الطبخ / Cooked = بعد الطبخ. الفرق كبير لأنو الأرز والمعكرونة بيمتصوا مي.
// alt = كلمات بحث إضافية (عربي + عربيزي) حتى يلاقي البحث "roz" أو "رز".
// est = تقدير تقريبي (أكل مطاعم / بيت بيختلف حسب الطريقة).
// =====================================================================
const row = (name, calories, protein, carbs, fat, alt = "", serving = "Per 100g", baseGrams = 100, estimate = false) => ({
  name, calories, protein, carbs, fat, alt, serving, baseGrams, estimate, source: "Local",
});
const est = (name, calories, protein, carbs, fat, alt = "", serving = "Per 100g", baseGrams = 100) =>
  row(name, calories, protein, carbs, fat, alt, serving, baseGrams, true);

const localCleanDatabase = [
  // ---------- 1. الأرز (Rice) : نيء مقابل مطبوخ ----------
  row("Basmati Rice (Raw / Uncooked)", 350, 8.0, 77.0, 0.7, "roz rice basmati ruz nay khem رز أرز بسمتي نيء"),
  row("Basmati Rice (Cooked)", 123, 3.0, 26.0, 0.4, "roz rice basmati ruz matbukh masluq رز أرز بسمتي مطبوخ مسلوق"),
  row("Egyptian Rice / Short Grain (Raw / Uncooked)", 360, 6.7, 79.3, 0.6, "roz rice masri masry egyptian ruz nay رز أرز مصري نيء"),
  row("Egyptian Rice / Short Grain (Cooked)", 130, 2.4, 28.6, 0.2, "roz rice masri masry egyptian ruz matbukh رز أرز مصري مطبوخ"),
  row("White Rice Long Grain (Raw / Uncooked)", 365, 7.1, 80.0, 0.7, "roz rice abyad white ruz nay رز أرز أبيض نيء"),
  row("White Rice Long Grain (Cooked)", 130, 2.7, 28.2, 0.3, "roz rice abyad white ruz matbukh رز أرز أبيض مطبوخ"),
  row("Brown Rice (Raw / Uncooked)", 367, 7.5, 76.2, 3.2, "roz rice asmar brown ruz nay رز أرز بني أسمر نيء"),
  row("Brown Rice (Cooked)", 123, 2.7, 25.6, 1.0, "roz rice asmar brown ruz matbukh رز أرز بني أسمر مطبوخ"),
  row("Jasmine Rice (Raw / Uncooked)", 360, 7.0, 79.0, 0.6, "roz rice jasmine ياسمين رز أرز نيء"),
  row("Jasmine Rice (Cooked)", 130, 2.7, 28.0, 0.3, "roz rice jasmine ياسمين رز أرز مطبوخ"),
  est("Lebanese Rice with Vermicelli (Cooked)", 165, 3.0, 30.0, 3.2, "roz rice shaariye sha3reye vermicelli رز بشعيرية"),
  row("Bulgur (Raw / Dry)", 342, 12.3, 75.9, 1.3, "burghul bourghol bulgur برغل نيء"),
  row("Bulgur (Cooked)", 83, 3.1, 18.6, 0.2, "burghul bourghol bulgur برغل مطبوخ"),
  est("Freekeh (Raw / Dry)", 325, 12.0, 65.0, 2.5, "freekeh frikeh فريكة نيء"),
  est("Freekeh (Cooked)", 125, 4.5, 24.0, 1.0, "freekeh frikeh فريكة مطبوخ"),
  row("Couscous (Raw / Dry)", 376, 12.8, 77.4, 0.6, "couscous kuskus maghrabieh كسكس"),
  row("Couscous (Cooked)", 112, 3.8, 23.2, 0.2, "couscous kuskus كسكس مطبوخ"),
  row("Quinoa (Raw / Dry)", 368, 14.1, 64.2, 6.1, "quinoa kinwa كينوا"),
  row("Quinoa (Cooked)", 120, 4.4, 21.3, 1.9, "quinoa kinwa كينوا مطبوخ"),
  row("Oats (Dry)", 389, 16.9, 66.0, 6.9, "oats shofan shufan oatmeal شوفان"),
  row("Oats (Cooked with Water)", 71, 2.5, 12.0, 1.5, "oats shofan shufan oatmeal شوفان مطبوخ"),
  row("Spaghetti / Pasta (Dry, Raw)", 371, 13.0, 74.7, 1.5, "pasta makaroni spaghetti macaroni معكرونة باستا نيء"),
  row("Spaghetti / Pasta (Cooked)", 158, 5.8, 30.9, 0.9, "pasta makaroni spaghetti macaroni معكرونة باستا مطبوخ"),
  row("Whole Wheat Pasta (Dry, Raw)", 352, 13.0, 72.0, 2.5, "pasta makaroni whole wheat معكرونة قمح كامل"),
  row("Whole Wheat Pasta (Cooked)", 124, 5.3, 26.5, 0.5, "pasta makaroni whole wheat معكرونة قمح كامل مطبوخ"),
  row("Corn Flakes", 357, 7.5, 84.0, 0.4, "cereal cornflakes كورن فلكس"),
  row("Granola", 471, 10.0, 64.0, 20.0, "granola cereal غرانولا"),

  // ---------- 2. الطحين والسكر (Flour & Baking) ----------
  row("White Flour / All-Purpose (Raw)", 364, 10.3, 76.3, 1.0, "flour ta7in tahin tehin طحين أبيض"),
  row("Whole Wheat Flour (Raw)", 340, 13.2, 72.0, 2.5, "flour ta7in tahin brown wholemeal طحين قمح كامل أسمر"),
  row("Bread Flour (Raw)", 361, 12.0, 72.5, 1.7, "flour ta7in tahin طحين خبز"),
  row("Semolina (Smeed / Samid)", 360, 12.7, 72.8, 1.1, "semolina smeed semid sameed سميد"),
  row("Corn Flour / Cornmeal", 361, 6.9, 76.9, 3.9, "corn flour cornmeal طحين ذرة"),
  row("Cornstarch", 381, 0.3, 91.3, 0.1, "cornstarch nesha نشاء"),
  row("Chickpea Flour (Besan)", 387, 22.4, 57.8, 6.7, "chickpea flour besan طحين حمص"),
  row("Rice Flour", 366, 6.0, 80.1, 1.4, "rice flour طحين رز أرز"),
  row("Almond Flour", 579, 21.2, 21.6, 49.9, "almond flour طحين لوز"),
  row("White Sugar", 387, 0, 100.0, 0, "sugar sukkar سكر"),
  row("Brown Sugar", 380, 0.1, 98.1, 0, "sugar sukkar brown سكر بني"),

  // ---------- 3. الخبز (Bread) ----------
  row("White Bread", 265, 9.0, 49.0, 3.2, "bread khobez khebez toast خبز أبيض"),
  row("Whole Wheat Bread", 247, 13.0, 41.0, 3.4, "bread khobez khebez brown خبز أسمر قمح كامل"),
  row("Toast Bread (1 slice)", 80, 2.7, 14.7, 1.0, "bread toast khobez توست شريحة", "1 slice (~30g)", 30),
  row("Arabic Pita Bread (Per 100g)", 275, 9.1, 55.7, 1.2, "pita arabic bread khobez araby khebez 3arabi خبز عربي"),
  row("Arabic Pita Bread (1 Large Piece)", 275, 9.1, 55.7, 1.2, "pita arabic bread khobez araby khebez 3arabi خبز عربي رغيف", "1 large piece (~100g)", 100),
  est("Saj / Markouk Bread", 280, 9.0, 56.0, 1.5, "saj markouk khobez saj خبز صاج مرقوق"),
  row("Baguette / French Bread", 270, 9.0, 55.0, 1.5, "baguette french bread bagit باغيت"),
  row("Croissant (Butter)", 406, 8.2, 45.8, 21.0, "croissant kroissan كرواسان"),
  row("Burger Bun", 279, 9.4, 50.0, 4.3, "burger bun خبز برغر"),

  // ---------- 4. القهوة والمشروبات الساخنة ----------
  row("Black Coffee / Espresso (No Sugar)", 2, 0.3, 0.2, 0, "coffee espresso americano قهوة", "1 cup (240ml)", 240),
  row("Turkish Coffee (No Sugar)", 5, 0.4, 0.6, 0.1, "turkish coffee ahwe qahwe قهوة تركية", "1 cup (60ml)", 60),
  row("Turkish Coffee (Sweetened)", 35, 0.4, 8.0, 0.1, "turkish coffee ahwe qahwe قهوة تركية سكر", "1 cup (60ml)", 60),
  row("Cappuccino (Whole Milk, No Sugar)", 120, 6.0, 9.0, 6.0, "cappuccino كابتشينو", "1 cup (~240ml)", 240),
  row("Cappuccino (Skim Milk, No Sugar)", 75, 6.5, 9.5, 0.3, "cappuccino كابتشينو", "1 cup (~240ml)", 240),
  row("Caffe Latte (Whole Milk)", 150, 8.0, 12.0, 8.0, "latte لاتيه", "1 cup (~300ml)", 300),
  row("Caffe Latte (Skim Milk)", 100, 8.5, 13.0, 0.4, "latte لاتيه", "1 cup (~300ml)", 300),
  row("Green Tea / Black Tea (Unsweetened)", 2, 0, 0.4, 0, "tea shai chai شاي", "1 cup (240ml)", 240),
  row("Tea with 1 Teaspoon Sugar", 18, 0, 4.4, 0, "tea shai chai sugar شاي سكر", "1 cup (240ml)", 240),
  row("Hot Chocolate (Whole Milk & Cocoa)", 220, 8.0, 28.0, 8.5, "hot chocolate شوكولا ساخنة", "1 cup (240ml)", 240),
  row("Matcha Latte (Whole Milk)", 140, 6.0, 14.0, 6.5, "matcha latte ماتشا", "1 cup (240ml)", 240),

  // ---------- 5. العصائر والمشروبات الباردة ----------
  row("Protein Smoothie (Banana, Peanut Butter & Milk)", 380, 28.0, 42.0, 12.0, "smoothie protein سموذي بروتين", "1 glass (350ml)", 350),
  row("Fruit Smoothie (Mixed Berry & Yogurt)", 210, 5.0, 45.0, 1.5, "smoothie سموذي", "1 glass (350ml)", 350),
  row("Fresh Orange Juice", 45, 0.7, 10.4, 0.2, "orange juice 3asir bortoqal عصير برتقال", "Per 100ml", 100),
  row("Fresh Apple Juice", 46, 0.1, 11.3, 0.1, "apple juice 3asir tuffah عصير تفاح", "Per 100ml", 100),
  row("Fresh Carrot Juice", 40, 0.9, 9.3, 0.2, "carrot juice 3asir jazar عصير جزر", "Per 100ml", 100),
  row("Fresh Lemonade (Sweetened)", 40, 0.1, 10.5, 0, "lemonade limonada 3asir laymoun عصير ليمون", "Per 100ml", 100),
  row("Iced Americano (No Sugar)", 5, 0.3, 0.5, 0, "iced americano", "1 cup (350ml)", 350),
  row("Iced Latte (Whole Milk)", 140, 7.0, 11.0, 7.0, "iced latte", "1 cup (350ml)", 350),
  row("Iced Latte (Skim Milk)", 85, 7.5, 11.5, 0.3, "iced latte", "1 cup (350ml)", 350),
  row("Soda / Cola (Regular)", 41, 0, 10.6, 0, "soda cola pepsi coca مشروب غازي كولا", "Per 100ml", 100),
  row("Soda / Cola Zero / Diet", 0, 0, 0, 0, "soda cola zero diet كولا دايت", "Per 100ml", 100),
  row("Ayran / Laban Drink", 45, 3.0, 4.0, 1.5, "ayran laban 3ayran لبن عيران", "Per 100ml", 100),
  row("Almond Milk (Unsweetened)", 15, 0.6, 0.3, 1.2, "almond milk حليب لوز", "Per 100ml", 100),
  row("Soy Milk (Unsweetened)", 33, 2.9, 1.7, 1.6, "soy milk حليب صويا", "Per 100ml", 100),
  row("Oat Milk", 45, 1.0, 6.5, 1.5, "oat milk حليب شوفان", "Per 100ml", 100),
  row("Whey Protein Powder (1 Scoop)", 120, 24.0, 2.5, 1.5, "whey protein powder بروتين مسحوق", "1 scoop (~30g)", 30),

  // ---------- 6. الفواكه ----------
  row("Apple (Fresh, Medium)", 95, 0.5, 25.0, 0.3, "apple tuffah تفاح", "1 piece (~182g)", 182),
  row("Banana (Fresh, Medium)", 105, 1.3, 27.0, 0.3, "banana mouz moz موز", "1 piece (~118g)", 118),
  row("Banana (Per 100g)", 89, 1.1, 22.8, 0.3, "banana mouz moz موز"),
  row("Orange (Fresh, Medium)", 62, 1.2, 15.4, 0.2, "orange bortoqal برتقال", "1 piece (~131g)", 131),
  row("Mandarin / Clementine", 47, 0.8, 12.0, 0.3, "mandarin clementine yusuf effendi يوسف أفندي"),
  row("Grapefruit", 42, 0.8, 10.7, 0.1, "grapefruit jreib frut جريب فروت"),
  row("Dates (Medjool)", 277, 1.8, 75.0, 0.1, "dates tamer tamr تمر"),
  row("Dates (Deglet Noor / Regular)", 282, 2.5, 75.0, 0.4, "dates tamer tamr تمر"),
  row("Watermelon", 30, 0.6, 7.5, 0.15, "watermelon batikh jabas بطيخ"),
  row("Melon (Cantaloupe)", 34, 0.8, 8.2, 0.2, "melon cantaloupe shamam شمام"),
  row("Strawberries", 32, 0.7, 7.7, 0.3, "strawberry fraise farawla فراولة"),
  row("Blueberries", 57, 0.7, 14.5, 0.3, "blueberry توت أزرق"),
  row("Raspberries", 52, 1.2, 11.9, 0.7, "raspberry توت العليق"),
  row("Blackberries", 43, 1.4, 9.6, 0.5, "blackberry توت أسود"),
  row("Grapes (Red or Green)", 69, 0.7, 18.1, 0.16, "grapes enab عنب"),
  row("Peach", 39, 0.9, 9.5, 0.25, "peach darraq دراق خوخ"),
  row("Pear", 57, 0.4, 15.2, 0.14, "pear injas إجاص كمثرى"),
  row("Pineapple", 50, 0.5, 13.1, 0.12, "pineapple ananas أناناس"),
  row("Mango", 60, 0.8, 15.0, 0.4, "mango manga مانجو"),
  row("Kiwi", 61, 1.1, 14.7, 0.5, "kiwi كيوي"),
  row("Pomegranate", 83, 1.7, 18.7, 1.2, "pomegranate rommen roman رمان"),
  row("Lemon", 29, 1.1, 9.3, 0.3, "lemon laymoun hamod ليمون"),
  row("Apricot (Fresh)", 48, 1.4, 11.1, 0.4, "apricot mishmish مشمش"),
  row("Cherries", 63, 1.1, 16.0, 0.2, "cherry karaz كرز"),
  row("Plum", 46, 0.7, 11.4, 0.3, "plum khokh khoukh خوخ برقوق"),
  row("Fig (Fresh)", 74, 0.8, 19.2, 0.3, "fig tin teen تين"),
  row("Fig (Dried)", 249, 3.3, 63.9, 0.9, "fig dried tin teen yabes تين مجفف"),
  row("Raisins", 299, 3.1, 79.2, 0.5, "raisins zbib zabib زبيب"),
  row("Dried Apricots", 241, 3.4, 62.6, 0.5, "dried apricot amar el din قمر الدين مشمش مجفف"),
  row("Avocado", 160, 2.0, 8.5, 14.7, "avocado avocato أفوكادو"),
  row("Guava", 68, 2.6, 14.3, 1.0, "guava jawafa جوافة"),
  row("Papaya", 43, 0.5, 10.8, 0.3, "papaya بابايا"),
  row("Prickly Pear (Sabr)", 41, 0.7, 9.6, 0.5, "prickly pear sabr sabbar صبر"),
  row("Coconut (Fresh)", 354, 3.3, 15.2, 33.5, "coconut jawz hind جوز هند"),

  // ---------- 7. الخضار ----------
  row("Cucumber (With Peel)", 15, 0.6, 3.6, 0.1, "cucumber khyar خيار"),
  row("Tomato", 18, 0.9, 3.9, 0.2, "tomato banadoura bandora بندورة طماطم"),
  row("Tomato Paste", 82, 4.3, 18.9, 0.5, "tomato paste rob banadoura رب بندورة"),
  row("Lettuce (Romaine / Green)", 17, 1.2, 3.3, 0.3, "lettuce khass خس"),
  row("Broccoli (Boiled)", 35, 2.4, 7.2, 0.4, "broccoli brokoli بروكلي"),
  row("Cauliflower (Raw)", 25, 1.9, 5.0, 0.3, "cauliflower arnabit zaharah قرنبيط زهرة"),
  row("Cabbage (Raw)", 25, 1.3, 5.8, 0.1, "cabbage malfouf ملفوف"),
  row("Spinach (Raw)", 23, 2.9, 3.6, 0.4, "spinach sabanekh سبانخ"),
  row("Onion", 40, 1.1, 9.3, 0.1, "onion basal بصل"),
  row("Green Onion", 32, 1.8, 7.3, 0.2, "green onion scallion basal akhdar بصل أخضر"),
  row("Garlic", 149, 6.4, 33.0, 0.5, "garlic toum thom ثوم"),
  row("Bell Pepper (Green/Red/Yellow)", 31, 1.0, 6.0, 0.3, "pepper bell filfel فلفل"),
  row("Carrot", 41, 0.9, 9.6, 0.2, "carrot jazar جزر"),
  row("Zucchini (Courgette)", 17, 1.2, 3.1, 0.3, "zucchini courgette kousa koosa كوسا"),
  row("Eggplant (Aubergine)", 25, 1.0, 6.0, 0.2, "eggplant aubergine batinjan باذنجان"),
  row("Potato (Raw)", 77, 2.0, 17.5, 0.1, "potato batata بطاطا"),
  row("Potato (Boiled)", 87, 1.9, 20.0, 0.1, "potato batata boiled بطاطا مسلوقة"),
  row("Sweet Potato (Raw)", 86, 1.6, 20.1, 0.1, "sweet potato batata hilwe بطاطا حلوة"),
  row("Sweet Potato (Baked)", 90, 2.0, 20.7, 0.15, "sweet potato batata hilwe بطاطا حلوة مشوية"),
  row("Mushrooms", 22, 3.1, 3.3, 0.3, "mushroom fatr فطر"),
  row("Okra (Cooked)", 22, 1.9, 4.5, 0.2, "okra bamyeh bamia بامية"),
  row("Green Beans (Fresh)", 31, 1.8, 7.0, 0.2, "green beans loubieh lobia لوبيا خضراء"),
  row("Green Peas", 81, 5.4, 14.5, 0.4, "peas bazella bazilla بازيلا"),
  row("Corn (Sweet, Cooked)", 96, 3.4, 21.0, 1.5, "corn dura dhara ذرة"),
  row("Beetroot (Raw)", 43, 1.6, 9.6, 0.2, "beetroot shamandar shawandar شمندر"),
  row("Radish", 16, 0.7, 3.4, 0.1, "radish fijil فجل"),
  row("Celery", 14, 0.7, 3.0, 0.2, "celery krafs كرفس"),
  row("Artichoke (Cooked)", 53, 2.9, 11.9, 0.4, "artichoke ardi shawki أرضي شوكي"),
  row("Parsley", 36, 3.0, 6.3, 0.8, "parsley bakdounes baqdounes بقدونس"),
  row("Mint", 44, 3.3, 8.4, 0.7, "mint na3na3 نعنع"),
  row("Green Olives", 145, 1.0, 3.8, 15.3, "olives zaytoun zeitoun زيتون أخضر"),
  row("Black Olives", 115, 0.8, 6.0, 10.7, "olives zaytoun zeitoun زيتون أسود"),
  row("Pickled Cucumber", 11, 0.3, 2.3, 0.2, "pickle pickles mkabbis mkhallal مخلل خيار"),

  // ---------- 8. الألبان والأجبان ----------
  row("Labneh (Full Fat / Full Cream)", 200, 7.0, 4.0, 16.0, "labneh labne لبنة"),
  row("Labneh (Medium Fat / Light)", 130, 8.5, 4.5, 8.0, "labneh labne لبنة"),
  row("Labneh (Low Fat / Zero Fat)", 80, 10.0, 5.0, 1.0, "labneh labne لبنة"),
  row("Yogurt (Plain, Whole Milk)", 61, 3.5, 4.7, 3.3, "yogurt yoghurt laban zabadi لبن زبادي"),
  row("Greek Yogurt (0% Fat)", 59, 10.2, 3.6, 0.4, "greek yogurt yoghurt زبادي يوناني"),
  row("Greek Yogurt (Full Fat)", 97, 9.0, 4.0, 5.0, "greek yogurt yoghurt زبادي يوناني"),
  row("White Cheese / Baladi (Full Fat)", 280, 16.0, 2.0, 23.0, "white cheese jibne baladi jebneh بيضاء جبنة بلدي"),
  row("White Cheese / Baladi (Low Fat)", 180, 19.0, 2.0, 10.0, "white cheese jibne baladi jebneh بيضاء جبنة بلدي"),
  row("Halloumi Cheese (Full Fat)", 321, 25.0, 1.9, 24.0, "halloumi halloum jibne حلوم جبنة"),
  row("Halloumi Cheese (Light / Low Fat)", 220, 27.0, 2.0, 11.5, "halloumi halloum jibne حلوم جبنة"),
  row("Akkawi Cheese (Desalted)", 250, 18.0, 1.5, 19.0, "akkawi akawi jibne عكاوي جبنة"),
  row("Cheddar Cheese (Full Fat)", 403, 25.0, 1.3, 33.0, "cheddar jibne شيدر جبنة"),
  row("Mozzarella Cheese", 280, 28.0, 3.1, 17.0, "mozzarella jibne موزاريلا جبنة"),
  row("Feta Cheese (Full Fat)", 264, 14.2, 4.1, 21.3, "feta jibne فيتا جبنة"),
  row("Cream Cheese", 342, 6.0, 4.0, 34.0, "cream cheese jibne krema كريم تشيز جبنة"),
  row("Cottage Cheese", 98, 11.1, 3.4, 4.3, "cottage cheese jibne قريش"),
  row("Ricotta Cheese", 174, 11.3, 3.0, 13.0, "ricotta jibne ريكوتا"),
  row("Parmesan Cheese", 431, 38.0, 4.1, 29.0, "parmesan jibne بارميزان"),
  row("Milk (Whole, 3.25% Fat)", 61, 3.2, 4.8, 3.3, "milk haleeb halib حليب", "Per 100ml", 100),
  row("Milk (Low Fat / Skim)", 35, 3.4, 5.0, 0.1, "milk haleeb halib skim حليب خالي الدسم", "Per 100ml", 100),
  row("Butter", 717, 0.9, 0.1, 81.0, "butter zebde zibde زبدة"),
  row("Ghee", 876, 0.3, 0, 99.5, "ghee samne smen سمن"),

  // ---------- 9. البيض ----------
  row("Egg (Whole, Medium)", 65, 6.3, 0.4, 4.4, "egg bayd beid بيض", "1 piece (50g)", 50),
  row("Egg (Whole, Large)", 74, 6.3, 0.4, 5.0, "egg bayd beid بيض", "1 piece (56g)", 56),
  row("Egg White", 17, 3.6, 0.2, 0.1, "egg white bayad بياض بيض", "1 piece (~33g)", 33),
  row("Egg (Boiled, Per 100g)", 155, 12.6, 1.1, 10.6, "egg boiled bayd masluq بيض مسلوق"),
  row("Egg (Fried in Oil, Per 100g)", 196, 13.6, 0.8, 14.8, "egg fried bayd maqli بيض مقلي"),

  // ---------- 10. اللحوم والدجاج والأسماك ----------
  row("Chicken Breast (Raw, Skinless)", 120, 22.5, 0, 2.6, "djaj jaj farouj frouj فروج فراخ دجاج chicken breast djej sadr dajaj صدر دجاج نيء"),
  row("Chicken Breast (Cooked, Skinless)", 165, 31.0, 0, 3.6, "djaj jaj farouj frouj فروج فراخ دجاج chicken breast djej sadr dajaj صدر دجاج مطبوخ"),
  row("Chicken Thigh (Raw, Skinless)", 121, 19.7, 0, 4.1, "djaj jaj farouj frouj فروج فراخ دجاج chicken thigh djej fkhed dajaj فخذ دجاج نيء"),
  row("Chicken Thigh (Cooked, Skinless)", 209, 26.0, 0, 10.9, "djaj jaj farouj frouj فروج فراخ دجاج chicken thigh djej fkhed dajaj فخذ دجاج مطبوخ"),
  row("Turkey Breast (Cooked)", 135, 30.1, 0, 0.7, "turkey breast dik rumi ديك رومي"),
  row("Ground Beef 90/10 (Raw)", 176, 20.0, 0, 10.0, "meat lahme laham لحم beef ground minced lahme mfarame لحمة مفرومة نيء"),
  row("Ground Beef 90/10 (Cooked)", 217, 26.1, 0, 11.7, "meat lahme laham لحم beef ground minced lahme mfarame لحمة مفرومة مطبوخة"),
  row("Ground Beef 80/20 (Raw)", 254, 17.2, 0, 20.0, "meat lahme laham لحم beef ground minced lahme mfarame لحمة مفرومة نيء"),
  row("Beef Steak (Lean, Cooked)", 250, 26.0, 0, 15.0, "meat lahme laham لحم beef steak lahme stek لحمة ستيك"),
  row("Lamb (Cooked)", 280, 25.0, 0, 19.0, "meat lahme laham لحم lamb ghanam kharouf لحم غنم خروف"),
  row("Chicken Breast with Skin (Roasted)", 197, 29.8, 0, 7.8, "djaj jaj farouj frouj فروج فراخ دجاج chicken breast skin djej sadr dajaj صدر دجاج بالجلد"),
  row("Chicken Drumstick (Cooked, Skinless)", 172, 28.3, 0, 5.7, "djaj jaj farouj frouj فروج فراخ دجاج chicken drumstick djej dajaj دجاج دبوس"),
  row("Chicken Liver (Cooked)", 167, 24.5, 0.9, 6.5, "djaj jaj farouj frouj فروج فراخ دجاج chicken liver kebdet djej kebde كبدة دجاج"),
  row("Beef Liver (Cooked)", 175, 27.0, 5.0, 5.0, "meat lahme laham لحم beef liver kebde kebdeh كبدة لحمة"),
  est("Beef Burger Patty (Grilled)", 250, 26.0, 0, 15.0, "meat lahme laham لحم beef burger patty برغر لحمة"),
  est("Beef Shawarma (Meat Only)", 230, 22.0, 3.0, 14.0, "meat lahme laham لحم beef shawarma shawerma شاورما لحمة"),
  est("Sujuk / Soujouk (Cooked)", 420, 18.0, 2.0, 38.0, "meat lahme laham لحم sujuk soujouk sujuq sausage naqaniq سجق"),
  est("Lebanese Sausage / Naqaniq (Cooked)", 300, 15.0, 3.0, 26.0, "meat lahme laham لحم sausage naqaniq naqaneq sausage نقانق"),
  est("Kafta (Grilled)", 260, 20.0, 3.0, 18.0, "meat lahme laham لحم kafta kefta kafte كفتة مشوية"),
  est("Chicken Shawarma (Meat Only)", 215, 22.0, 3.0, 12.0, "shawarma chicken shawerma djej شاورما دجاج"),
  est("Shish Tawook (Grilled)", 170, 26.0, 2.0, 6.0, "shish tawook taouk shish taouk شيش طاووق"),
  row("Tuna (Canned in Water)", 116, 26.0, 0, 0.8, "tuna tonna تونة"),
  row("Tuna (Canned in Oil)", 198, 29.1, 0, 8.2, "tuna tonna تونة بالزيت"),
  row("Salmon (Raw)", 208, 20.4, 0, 13.4, "salmon salmon سلمون نيء"),
  row("Salmon (Cooked)", 206, 22.0, 0, 12.3, "salmon salmon سلمون مطبوخ"),
  row("Tilapia (Cooked)", 128, 26.2, 0, 2.7, "tilapia samak سمك"),
  row("Sea Bass (Cooked)", 124, 23.6, 0, 2.6, "sea bass samak قاروص سمك"),
  row("Sardines (Canned)", 208, 24.6, 0, 11.5, "sardines sardin سردين"),
  row("Shrimp (Cooked)", 99, 24.0, 0.2, 0.3, "shrimp prawns gambri قمبري"),

  // ---------- 11. البقوليات (Legumes) : جاف مقابل مطبوخ ----------
  row("Chickpeas (Dry / Raw)", 378, 20.5, 62.9, 6.0, "chickpeas hommos homos hummus hommos hummus حمص جاف"),
  row("Chickpeas (Cooked)", 164, 8.9, 27.4, 2.6, "chickpeas hommos homos hummus حمص مطبوخ مسلوق"),
  row("Chickpeas (Canned)", 139, 7.0, 22.5, 2.8, "chickpeas hommos homos hummus حمص معلب"),
  row("Lentils Brown/Green (Dry / Raw)", 352, 24.6, 63.4, 1.1, "lentils adas 3adas عدس جاف"),
  row("Lentils (Cooked)", 116, 9.0, 20.1, 0.4, "lentils adas 3adas عدس مطبوخ"),
  row("Red Lentils (Dry / Raw)", 358, 24.0, 63.0, 2.0, "red lentils adas mjarad 3adas أحمر عدس جاف"),
  row("Fava Beans / Foul (Dry / Raw)", 341, 26.1, 58.3, 1.5, "fava foul ful fool فول جاف"),
  row("Fava Beans / Foul (Cooked)", 110, 7.6, 19.7, 0.4, "fava foul ful fool فول مطبوخ"),
  row("White Beans (Dry / Raw)", 337, 22.3, 60.8, 1.5, "white beans fasoulia fasolia فاصوليا بيضاء جافة"),
  row("White Beans (Cooked)", 140, 8.2, 25.1, 0.6, "white beans fasoulia fasolia فاصوليا بيضاء مطبوخة"),
  row("Kidney Beans (Dry / Raw)", 333, 23.6, 60.0, 0.8, "kidney beans red fasoulia فاصوليا حمراء جافة"),
  row("Kidney Beans (Cooked)", 127, 8.7, 22.8, 0.5, "kidney beans red fasoulia فاصوليا حمراء مطبوخة"),
  row("Hummus (Chickpea Dip)", 166, 7.9, 14.3, 9.6, "hummus hommos homos حمص بطحينة"),
  est("Baba Ghanoush / Moutabal", 130, 2.5, 8.0, 10.0, "baba ghanoush moutabal mtabal بابا غنوج متبل"),
  row("Falafel (Fried)", 333, 13.3, 31.8, 17.8, "falafel felafel فلافل"),

  // ---------- 12. المكسرات والبذور ----------
  row("Almonds", 579, 21.2, 21.6, 49.9, "almonds lawz لوز"),
  row("Walnuts", 654, 15.2, 13.7, 65.2, "walnuts jawz جوز"),
  row("Pistachios", 560, 20.2, 27.2, 45.3, "pistachios fostok fistuk فستق حلبي"),
  row("Cashews", 553, 18.2, 30.2, 43.9, "cashews kaju كاجو"),
  row("Hazelnuts", 628, 15.0, 16.7, 60.8, "hazelnuts bunduq بندق"),
  row("Peanuts", 567, 25.8, 16.1, 49.2, "peanuts fustuq sudani فول سوداني"),
  row("Pine Nuts", 673, 13.7, 13.1, 68.4, "pine nuts snoubar sanobar صنوبر"),
  row("Sunflower Seeds", 584, 20.8, 20.0, 51.5, "sunflower seeds bizr بزر عباد الشمس"),
  row("Pumpkin Seeds", 559, 30.2, 10.7, 49.1, "pumpkin seeds bizr قرع بزر"),
  row("Chia Seeds", 486, 16.5, 42.1, 30.7, "chia seeds شيا"),
  row("Flaxseed", 534, 18.3, 28.9, 42.2, "flax flaxseed بذر الكتان"),
  row("Sesame Seeds", 573, 17.7, 23.5, 49.7, "sesame seeds simsom سمسم"),
  row("Peanut Butter", 588, 25.0, 20.0, 50.0, "peanut butter زبدة الفول السوداني"),

  // ---------- 13. الزيوت والصلصات ----------
  row("Olive Oil", 884, 0, 0, 100.0, "olive oil zeit zayt zeit zaytoun زيت زيتون"),
  row("Vegetable / Sunflower Oil", 884, 0, 0, 100.0, "vegetable sunflower oil zeit nabati زيت نباتي"),
  row("Coconut Oil", 862, 0, 0, 100.0, "coconut oil زيت جوز الهند"),
  row("Ketchup (Standard)", 101, 1.2, 27.0, 0.1, "ketchup كاتشب"),
  row("Mayonnaise (Full Fat)", 680, 1.0, 0.6, 75.0, "mayonnaise mayo مايونيز"),
  row("Mayonnaise (Light)", 260, 0.9, 6.0, 26.0, "mayonnaise mayo مايونيز لايت"),
  row("Garlic Sauce / Toum", 350, 0.8, 10.0, 35.0, "garlic sauce toum thom توم ثوم"),
  row("Mustard (Yellow)", 66, 4.4, 5.8, 3.3, "mustard خردل"),
  row("BBQ Sauce", 172, 0.8, 41.0, 0.7, "bbq sauce باربكيو"),
  row("Soy Sauce", 53, 8.1, 4.9, 0.6, "soy sauce صويا"),
  row("Tahini (Sesame Paste)", 595, 17.0, 21.0, 53.0, "tahini tahine taheena طحينة"),
  row("Hot Sauce / Sriracha", 93, 1.3, 18.0, 1.0, "hot sauce sriracha harra حار"),
  row("Pesto Sauce", 450, 5.0, 6.0, 45.0, "pesto بيستو"),
  row("Ranch Dressing", 460, 1.5, 7.0, 48.0, "ranch dressing رانش"),

  // ---------- 14. أكلات لبنانية جاهزة (تقديرية) ----------
  est("Tabbouleh", 110, 2.0, 10.0, 7.0, "tabbouleh tabbouli taboule تبولة"),
  est("Fattoush", 90, 1.5, 9.0, 5.5, "fattoush fatoush فتوش"),
  est("Mujaddara (Lentils & Rice)", 150, 6.0, 25.0, 3.0, "mujaddara mjadra mjaddara مجدرة"),
  est("Kibbeh (Fried)", 260, 13.0, 18.0, 15.0, "kibbeh kebbe kibbe كبة مقلية"),
  est("Stuffed Grape Leaves (Warak Enab, Oil)", 170, 2.5, 22.0, 8.5, "grape leaves warak enab arish ورق عنب"),
  row("Manousheh Zaatar", 350, 8.0, 45.0, 15.0, "manousheh manoushe zaatar mankousheh مناقيش زعتر", "1 piece (~120g)", 120),
  row("Manousheh Akkawi Cheese", 450, 18.0, 42.0, 22.0, "manousheh manoushe cheese jibne مناقيش جبنة عكاوي", "1 piece (~150g)", 150),
  row("Chicken Crispy Strips (Oven Baked)", 230, 24.0, 16.0, 7.0, "djaj jaj farouj frouj فروج فراخ دجاج chicken strips crispy broasted dajaj دجاج"),
  row("Chicken Crispy Strips (Deep Fried)", 320, 22.0, 18.0, 18.0, "djaj jaj farouj frouj فروج فراخ دجاج chicken strips crispy broasted dajaj دجاج مقلي"),
  row("French Fries (Oven Baked)", 160, 3.0, 35.0, 3.5, "fries batata batata mi2li بطاطا مشوية"),
  row("French Fries (Deep Fried)", 312, 3.4, 41.0, 15.0, "fries batata batata mi2li بطاطا مقلية"),
  row("Pizza (Cheese / Margherita)", 266, 11.4, 33.0, 9.8, "pizza بيتزا"),

  // ---------- 15. الحلويات والسناكس ----------
  row("Honey", 304, 0.3, 82.4, 0, "honey 3asal عسل"),
  row("Jam", 278, 0.4, 68.0, 0.1, "jam mrabba مربى"),
  est("Grape Molasses (Dibs Enab)", 290, 0.5, 72.0, 0, "molasses dibs enab دبس عنب"),
  row("Knafeh (Cheese / Ashta)", 420, 7.0, 48.0, 22.0, "knafeh kanafeh knefe كنافة"),
  est("Baklava", 430, 6.5, 46.0, 25.0, "baklava baklawa بقلاوة"),
  row("Halawa / Halva", 469, 12.5, 51.6, 21.5, "halawa halva halawe حلاوة طحينية"),
  row("Nutella / Chocolate Spread", 539, 6.3, 57.5, 30.9, "nutella chocolate spread نوتيلا"),
  row("Dark Chocolate (70-85%)", 598, 7.8, 45.0, 42.6, "dark chocolate chocolat شوكولا داكنة"),
  row("Milk Chocolate", 535, 7.7, 59.4, 29.7, "milk chocolate chocolat شوكولا بالحليب"),
  row("Ice Cream (Vanilla)", 207, 3.5, 23.6, 11.0, "ice cream booza بوظة آيس كريم"),
  row("Potato Chips", 536, 7.0, 53.0, 35.0, "chips potato chips شيبس"),
  row("Popcorn (Air Popped)", 387, 13.0, 78.0, 4.5, "popcorn بوشار"),
  row("Plain Biscuits / Cookies", 450, 6.0, 70.0, 16.0, "biscuit cookies بسكويت"),
];

// توحيد الكتابة: la7me = lahme, 3asal = asal, لحمة = لحمه ...
const normalize = (str) =>
  str
    .toLowerCase()
    .replace(/[\u064B-\u0652]/g, "")
    .replace(/[أإآ]/g, "ا")
    .replace(/ة/g, "ه")
    .replace(/ى/g, "ي")
    .replace(/7/g, "h")
    .replace(/5/g, "kh")
    .replace(/8/g, "gh")
    .replace(/9/g, "s")
    .replace(/[23]/g, "");


// ---------- محرك البحث ----------
// 1) تطابق مباشر  2) تطابق "الهيكل" بدون حروف علة (djaj = dajaj = djej = jaj)  3) خطأ إملائي واحد (chiken)
const skeleton = (s) => s.replace(/[aeiouyw]/g, "").replace(/(.)\1+/g, "$1");
const WORD_SPLIT = /[^\p{L}\p{N}%]+/u;

const searchIndex = localCleanDatabase.map((food) => {
  const text = normalize(`${food.name} ${food.alt}`);
  const words = text.split(WORD_SPLIT).filter(Boolean);
  return { food, text, words, skeletons: words.map(skeleton) };
});

function withinOneEdit(a, b) {
  if (Math.abs(a.length - b.length) > 1) return false;
  let i = 0, j = 0, edits = 0;
  while (i < a.length && j < b.length) {
    if (a[i] === b[j]) { i++; j++; continue; }
    if (++edits > 1) return false;
    if (a.length > b.length) i++;
    else if (a.length < b.length) j++;
    else { i++; j++; }
  }
  return edits + (a.length - i) + (b.length - j) <= 1;
}

function tokenScore(entry, token) {
  if (entry.words.includes(token)) return 4; // كلمة كاملة
  if (entry.text.includes(token)) return 3;
  const sk = skeleton(token);
  if (sk.length >= 2 && entry.skeletons.some((w) => w.includes(sk))) return 2;
  if (token.length >= 4 && entry.words.some((w) => withinOneEdit(token, w))) return 1;
  return 0;
}

function searchFoods(rawQuery) {
  const tokens = normalize(rawQuery.trim())
    .split(/\s+/)
    .filter(Boolean)
    .map((t) => (t.startsWith("ال") && t.length > 3 ? t.slice(2) : t)); // الرز = رز
  if (tokens.length === 0) return [];

  return searchIndex
    .map((entry, i) => {
      let total = 0;
      for (const t of tokens) {
        const sc = tokenScore(entry, t);
        if (!sc) return null;
        total += sc;
      }
      return { food: entry.food, total, i };
    })
    .filter(Boolean)
    .sort((a, b) => b.total - a.total || a.i - b.i)
    .map((x) => x.food);
}

export default function WolfFoodTracker() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [searched, setSearched] = useState(false);

  const [selectedItem, setSelectedItem] = useState(null);
  const [amount, setAmount] = useState(100);

  // التحميل يصير مرة وحدة مباشرة بالـ state الأولي (بلا useEffect للتحميل)
  const [dailyLog, setDailyLog] = useState(loadTodayLog);

  // الحفظ عند كل تعديل
  useEffect(() => {
    saveTodayLog(dailyLog);
  }, [dailyLog]);

  // البحث: كل كلمة لازم تكون موجودة بالاسم أو الكلمات البديلة
  function handleSearch(e) {
    e.preventDefault();
    if (!query.trim()) {
      setResults([]);
      setSearched(false);
      return;
    }
    setResults(searchFoods(query));
    setSearched(true);
  }

  function handleSelectItem(item) {
    setSelectedItem(item);
    setAmount(item.baseGrams || 100);
  }

  function handleAddFood() {
    if (!selectedItem) return;
    const grams = Number(amount);
    if (!grams || grams <= 0) return;

    const ratio = grams / selectedItem.baseGrams;
    const entry = {
      id: Date.now(),
      name: selectedItem.name,
      amountGrams: grams,
      calories: Math.round(selectedItem.calories * ratio),
      protein: Number((selectedItem.protein * ratio).toFixed(1)),
      carbs: Number((selectedItem.carbs * ratio).toFixed(1)),
      fat: Number((selectedItem.fat * ratio).toFixed(1)),
    };

    setDailyLog((prevLog) => [entry, ...prevLog]);
    setSelectedItem(null);
  }

  function handleDeleteEntry(id) {
    setDailyLog((prevLog) => prevLog.filter((entry) => entry.id !== id));
  }

  const totalCalories = dailyLog.reduce((sum, item) => sum + item.calories, 0);
  const totalProtein = dailyLog.reduce((sum, item) => sum + item.protein, 0).toFixed(1);
  const totalCarbs = dailyLog.reduce((sum, item) => sum + item.carbs, 0).toFixed(1);
  const totalFat = dailyLog.reduce((sum, item) => sum + item.fat, 0).toFixed(1);

  return (
    <div style={{ padding: "30px", color: "#fff", background: "#0a1322", minHeight: "100vh", fontFamily: "sans-serif" }}>
      <h2>WOLF - Precise Daily Nutrition Tracker</h2>

      <div style={{ background: "#111827", padding: "20px", borderRadius: "10px", border: "1px solid #1f2937", marginBottom: "25px", maxWidth: "520px" }}>
        <h3 style={{ margin: "0 0 10px 0", color: "#22e5ff" }}>سجل اليوم (Today's Total)</h3>
        <p style={{ fontSize: "28px", fontWeight: "bold", margin: "0 0 10px 0" }}>
          {totalCalories} <span style={{ fontSize: "16px", color: "#888" }}>kcal</span>
        </p>
        <div style={{ display: "flex", gap: "20px", color: "#aaa", fontSize: "14px" }}>
          <span>بروتين: <strong style={{ color: "#fff" }}>{totalProtein}g</strong></span>
          <span>كارب: <strong style={{ color: "#fff" }}>{totalCarbs}g</strong></span>
          <span>دهون: <strong style={{ color: "#fff" }}>{totalFat}g</strong></span>
        </div>
      </div>

      <form onSubmit={handleSearch} style={{ display: "flex", gap: "10px", maxWidth: "520px" }}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="ابحث عن أكلة... (rice, roz, رز, basmati)"
          style={{ padding: "12px", borderRadius: "8px", border: "1px solid #333", background: "#111", color: "#fff", flex: 1, fontSize: "16px" }}
        />
        <button type="submit" style={{ padding: "12px 20px", background: "#22e5ff", border: "none", borderRadius: "8px", fontWeight: "bold", cursor: "pointer", color: "#000" }}>
          بحث
        </button>
      </form>

      {searched && results.length === 0 && (
        <p style={{ marginTop: "20px", color: "#aaa", maxWidth: "520px" }}>ما لقينا شي بهالاسم. جرّب كلمة تانية (عربي أو إنجليزي).</p>
      )}

      <div style={{ marginTop: "20px", display: "flex", flexDirection: "column", gap: "12px", maxWidth: "520px" }}>
        {results.map((item, index) => (
          <div
            key={`${item.name}-${index}`}
            onClick={() => handleSelectItem(item)}
            style={{ background: "#111", padding: "16px", borderRadius: "8px", border: "1px solid #222", cursor: "pointer", transition: "0.2s" }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "10px" }}>
              <h4 style={{ margin: "0", color: "#fff" }}>
                {item.name}
                {item.estimate && <span style={{ color: "#f59e0b", fontSize: "12px", marginLeft: "6px" }}>≈ تقدير</span>}
              </h4>
              <span style={{ background: "#15803d", color: "#22e5ff", padding: "4px 8px", borderRadius: "4px", fontSize: "12px", whiteSpace: "nowrap" }}>
                {item.serving}
              </span>
            </div>
            <p style={{ color: "#22e5ff", fontSize: "18px", fontWeight: "bold", margin: "8px 0 0 0" }}>
              {item.calories} <span style={{ fontSize: "12px", color: "#888" }}>kcal</span>
              <span style={{ fontSize: "12px", color: "#888", marginLeft: "10px" }}>
                P {item.protein} | C {item.carbs} | F {item.fat}
              </span>
            </p>
          </div>
        ))}
      </div>

      {selectedItem && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.8)", display: "flex", justifyContent: "center", alignItems: "center" }}>
          <div style={{ background: "#111827", padding: "25px", borderRadius: "12px", width: "320px", border: "1px solid #374151" }}>
            <h3 style={{ margin: "0 0 15px 0", color: "#fff" }}>{selectedItem.name}</h3>
            <label style={{ display: "block", color: "#aaa", marginBottom: "8px", fontSize: "14px" }}>أدخل الكمية / الوزن (بالغرام):</label>
            <input
              type="number"
              min="1"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #4b5563", background: "#1f2937", color: "#fff", fontSize: "16px", marginBottom: "15px", boxSizing: "border-box" }}
            />
            <div style={{ display: "flex", gap: "10px" }}>
              <button onClick={handleAddFood} style={{ flex: 1, padding: "10px", background: "#22e5ff", border: "none", borderRadius: "6px", fontWeight: "bold", cursor: "pointer", color: "#000" }}>
                حفظ وإضافة
              </button>
              <button onClick={() => setSelectedItem(null)} style={{ flex: 1, padding: "10px", background: "#374151", border: "none", borderRadius: "6px", color: "#fff", cursor: "pointer" }}>
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}

      {dailyLog.length > 0 && (
        <div style={{ marginTop: "35px", maxWidth: "520px" }}>
          <h3 style={{ color: "#fff", borderBottom: "1px solid #333", paddingBottom: "8px" }}>الوجبات المسجلة اليوم</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "15px" }}>
            {dailyLog.map((entry) => (
              <div key={entry.id} style={{ background: "#1f2937", padding: "12px 16px", borderRadius: "8px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <strong style={{ color: "#fff", display: "block" }}>{entry.name} ({entry.amountGrams}g)</strong>
                  <span style={{ color: "#aaa", fontSize: "12px" }}>P: {entry.protein}g | C: {entry.carbs}g | F: {entry.fat}g</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <span style={{ color: "#22e5ff", fontWeight: "bold" }}>{entry.calories} kcal</span>
                  <button onClick={() => handleDeleteEntry(entry.id)} style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer", fontWeight: "bold" }}>X</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
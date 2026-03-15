// Base de données produits - Délice de L'Inde

// Options globales
const VIANDES = [
    { id: 'kebab', name: 'Kebab' },
    { id: 'tenders', name: 'Tenders' },
    { id: 'cordon_bleu', name: 'Cordon Bleu' },
    { id: 'steak', name: 'Steak' },
    { id: 'tikka', name: 'Chicken Tikka' },
    { id: 'merguez', name: 'Merguez' },
    { id: 'kefta', name: 'Kefta' },
    { id: 'falafel', name: 'Falafel' }
];

const SAUCES = [
    { id: 'blanche', name: 'Blanche' },
    { id: 'algerienne', name: 'Algérienne' },
    { id: 'harissa', name: 'Harissa' },
    { id: 'curry', name: 'Curry' },
    { id: 'barbecue', name: 'Barbecue' },
    { id: 'mayonnaise', name: 'Mayonnaise' },
    { id: 'ketchup', name: 'Ketchup' },
    { id: 'samourai', name: 'Samouraï' },
    { id: 'biggy', name: 'Biggy' },
    { id: 'sweet_chili', name: 'Sweet Chili' },
    { id: 'chili_thai', name: 'Chili Thaï' },
    { id: 'fromagere', name: 'Sauce Fromagère' },
    { id: 'cheddar', name: 'Sauce Cheddar' }
];

const BOISSONS_33 = [
    { id: 'oasis_tropical', name: 'Oasis Tropical' },
    { id: 'oasis_pcf', name: 'Oasis Pomme Cassis Framboise' },
    { id: 'dada_peche', name: 'Dada Pêche' },
    { id: 'dada_melon', name: 'Dada Melon' },
    { id: 'dada_litchi', name: 'Dada Litchi' },
    { id: '7up', name: '7Up' },
    { id: 'sprite', name: 'Sprite' },
    { id: 'orangina', name: 'Orangina' },
    { id: 'fanta_orange', name: 'Fanta Orange' },
    { id: 'pepsi', name: 'Pepsi' },
    { id: 'pepsi_max', name: 'Pepsi Max' },
    { id: 'eau', name: 'Eau' },
    { id: 'capri_sun', name: 'Capri-Sun' }
];

const PAINS = [
    { id: 'naan', name: 'Naan' },
    { id: 'pain_rond', name: 'Pain Rond' },
    { id: 'galette', name: 'Galette' }
];

const GRATINS = [
    { id: 'lardon', name: 'Lardons', price: 2.00 },
    { id: 'cheddar', name: 'Cheddar', price: 2.00 },
    { id: 'raclette', name: 'Raclette', price: 2.00 },
    { id: 'chevre', name: 'Chèvre', price: 2.00 },
    { id: 'chevre_miel', name: 'Chèvre Miel', price: 2.50 },
    { id: 'bacon', name: 'Bacon', price: 2.00 },
    { id: 'olives_poivrons', name: 'Olives/Poivrons', price: 2.00 }
];

const SUPPLEMENTS = [
    { id: 'supp_cheddar', name: 'Cheddar', price: 1.00 },
    { id: 'supp_chevre', name: 'Chèvre', price: 1.00 },
    { id: 'supp_vache_qui_rit', name: 'Vache qui rit', price: 1.00 },
    { id: 'supp_oeuf', name: 'Œuf', price: 1.00 },
    { id: 'supp_boursin', name: 'Boursin', price: 1.00 },
    { id: 'supp_mozzarella', name: 'Mozzarella', price: 1.00 },
    { id: 'supp_bacon', name: 'Bacon', price: 1.00 },
    { id: 'supp_lardon', name: 'Lardon', price: 1.00 }
];

const SUPPLEMENTS_POUTINE = [
    { id: 'supp_mozzarella', name: 'Mozzarella', price: 1.50 },
    { id: 'supp_bacon', name: 'Bacon', price: 1.50 },
    { id: 'supp_lardon', name: 'Lardon', price: 1.50 },
    { id: 'supp_cheddar', name: 'Cheddar', price: 1.50 },
    { id: 'supp_chevre', name: 'Chèvre', price: 1.50 },
    { id: 'supp_raclette', name: 'Raclette', price: 1.50 },
    { id: 'supp_poivrons', name: 'Poivrons', price: 1.50 },
    { id: 'supp_olive', name: 'Olive', price: 1.50 }
];

// Viandes supplémentaires (choix de viande à +1€)
const VIANDES_SUPP = VIANDES.map(v => ({ ...v, price: 1.00 }));

// Éléments qu'on peut retirer - SANDWICHS
const RETRAITS_SANDWICH = [
    { id: 'sans_salade', name: 'Sans Salade' },
    { id: 'sans_tomate', name: 'Sans Tomate' },
    { id: 'sans_oignon', name: 'Sans Oignon' }
];

// Éléments qu'on peut retirer - TACOS
const RETRAITS_TACOS = [
    { id: 'sans_sauce_fromagere', name: 'Sans Sauce Fromagère' }
];

// Catégories
const CATEGORIES = [
    { id: 'buckets', name: 'Buckets', image: '../assets/buckets/bucket_1.png' },
    { id: 'bowls', name: 'Bowls', image: '../assets/bowls/bowl_classique.png' },
    { id: 'salades', name: 'Salades', image: '../assets/salades/salade.png' },
    { id: 'tacos', name: 'Tacos', image: '../assets/tacos/tacos.png' },
    { id: 'naans', name: 'Naans', image: '../assets/naans/naan_royal.png' },
    { id: 'sandwichs', name: 'Sandwichs', image: '../assets/sandwichs/sandwich.png' },
    { id: 'wraps', name: 'Wraps', image: '../assets/sandwichs/sandwich_galette.png' },
    { id: 'burgers', name: 'Burgers', image: '../assets/burgers/smash_burger.png' },
    { id: 'paninis', name: 'Paninis', image: '../assets/common/logo.png' },
    { id: 'poutines', name: 'Poutines', image: '../assets/poutines/poutine.png' },
    { id: 'frites', name: 'Frites', image: '../assets/frites/frite_boisson.png' },
    { id: 'assiettes', name: 'Assiettes', image: '../assets/common/assiette.png' },
    { id: 'enfant', name: 'Menu Enfant', image: '../assets/common/logo.png' },
    { id: 'tex_mex', name: 'Tex Mex', image: '../assets/common/logo.png' },
    { id: 'desserts', name: 'Desserts', image: '../assets/desserts/tiramisu.png' },
    { id: 'boissons', name: 'Boissons', image: '../assets/frites/frite_boisson.png' }
];

// Produits
const PRODUCTS = [

    // ==================== BUCKETS ====================
    // Frites & Boissons incluses
    {
        id: 'bucket_classic',
        category: 'buckets',
        name: 'Classic',
        description: '3 Wings + 3 Tenders + Frites + Boisson 33cl',
        image: '../assets/buckets/bucket_1.png',
        price: 7.90,
        type: 'bucket',
        hasBuilder: true,
        includesFrites: true,
        includesBoisson: true
    },
    {
        id: 'bucket_delice',
        category: 'buckets',
        name: 'Délice',
        description: '5 Wings + 3 Tenders + Frites + Boisson 33cl',
        image: '../assets/buckets/bucket_2.png',
        price: 9.90,
        type: 'bucket',
        hasBuilder: true,
        includesFrites: true,
        includesBoisson: true
    },
    {
        id: 'bucket_mixte',
        category: 'buckets',
        name: 'Bucket Mixte',
        description: '7 Wings + 5 Tenders + 4 Mozza Sticks + 2 Frites + 2 Boissons 33cl',
        image: '../assets/buckets/bucket_3.png',
        price: 18.90,
        type: 'bucket',
        hasBuilder: true,
        includesFrites: true,
        includesBoisson: true
    },
    {
        id: 'bucket_family',
        category: 'buckets',
        name: 'Bucket Family',
        description: '10 Wings + 10 Tenders + 4 Mozza Sticks + 3 Frites + Bouteille 1,5L',
        image: '../assets/buckets/bucket_4.png',
        price: 26.90,
        type: 'bucket',
        hasBuilder: true,
        includesFrites: true,
        includesBoisson: true
    },

    // ==================== BOWLS ====================
    // Base : Riz avec sauce maison
    {
        id: 'bowl_classic',
        category: 'bowls',
        name: 'Classic Bowl',
        description: 'Viande au choix',
        image: '../assets/bowls/bowl_classique.png',
        type: 'bowl',
        hasBuilder: true,
        sizes: [
            { id: 'normal', name: 'Normal', price: 8.90 },
            { id: 'xl', name: 'XL', price: 10.90 }
        ]
    },
    {
        id: 'bowl_indien',
        category: 'bowls',
        name: 'Indien Bowl',
        description: 'Chicken Tikka, oignon, poivron, œuf, sauce curry',
        image: '../assets/bowls/bowl_indian.png',
        type: 'bowl',
        hasBuilder: true,
        isSpecial: true,
        defaultIngredients: 'Chicken Tikka • Oignon, Poivron • Œuf • Sauce Curry',
        sizes: [
            { id: 'normal', name: 'Normal', price: 9.90 },
            { id: 'xl', name: 'XL', price: 14.90 }
        ]
    },
    {
        id: 'bowl_crispy',
        category: 'bowls',
        name: 'Crispy Bowl',
        description: 'Tenders, cheddar, oignons frits, œuf',
        image: '../assets/bowls/bowl_crousty.png',
        type: 'bowl',
        hasBuilder: true,
        isSpecial: true,
        defaultIngredients: 'Tenders • Cheddar • Oignons Frits • Œuf',
        sizes: [
            { id: 'normal', name: 'Normal', price: 9.90 },
            { id: 'xl', name: 'XL', price: 14.90 }
        ]
    },
    {
        id: 'bowl_bangkok',
        category: 'bowls',
        name: 'Krousty Bangkok',
        description: 'Tenders, sweet chili, oignon frit',
        image: '../assets/bowls/bowl_spicy.png',
        type: 'bowl',
        hasBuilder: true,
        isSpecial: true,
        defaultIngredients: 'Tenders • Sweet Chili • Oignon Frit',
        sizes: [
            { id: 'normal', name: 'Normal', price: 9.90 },
            { id: 'xl', name: 'XL', price: 14.90 }
        ]
    },
    {
        id: 'bowl_delice',
        category: 'bowls',
        name: 'Bowl Délice',
        description: 'Chicken Tikka, oignons frits, sauce extra piquante',
        image: '../assets/bowls/bowl_chef.png',
        type: 'bowl',
        hasBuilder: true,
        isSpecial: true,
        defaultIngredients: 'Chicken Tikka • Oignons Frits • Sauce Extra Piquante',
        sizes: [
            { id: 'normal', name: 'Normal', price: 9.90 },
            { id: 'xl', name: 'XL', price: 14.90 }
        ]
    },

    // ==================== SALADES ====================
    {
        id: 'salade_cesar',
        category: 'salades',
        name: 'César',
        description: 'Poulet pané, légumes, œuf',
        image: '../assets/salades/salade.png',
        price: 7.50
    },
    {
        id: 'salade_honey',
        category: 'salades',
        name: 'Honey',
        description: 'Nem au poulet, légumes, œuf',
        image: '../assets/salades/salade.png',
        price: 7.50
    },
    {
        id: 'salade_indienne',
        category: 'salades',
        name: 'Indienne',
        description: 'Chicken Tikka, légumes, œuf',
        image: '../assets/salades/salade.png',
        price: 7.50
    },

    // ==================== TACOS ====================
    // TACOS CLASSIQUES
    {
        id: 'tacos_custom',
        category: 'tacos',
        name: 'Tacos',
        displayName: 'Compose ton Tacos',
        description: 'Choisis ta taille, tes viandes et tes sauces',
        image: '../assets/tacos/tacos.png',
        type: 'tacos',
        hasBuilder: true,
        isCustom: true,
        sizes: [
            { id: 'S', name: 'Small', price: 6.00, menuPrice: 8.00, meatCount: 1 },
            { id: 'M', name: 'Medium', price: 7.00, menuPrice: 9.00, meatCount: 2 },
            { id: 'L', name: 'Large', price: 10.00, menuPrice: 12.00, meatCount: 3 },
            { id: 'XXL', name: 'XXL', price: 13.00, menuPrice: 15.00, meatCount: 4 }
        ]
    },
    // TACOS SPÉCIAUX (Base prix Seul, Menu = +2€)
    // Upgrades: Large (+3€) ou XL (+6€)
    {
        id: 'tacos_spicy',
        category: 'tacos',
        name: 'Tacos Spicy',
        description: 'Chicken Tikka, Kefta, Sauce Chili Thaï, Oignon frit',
        image: '../assets/tacos/tacos_spicy.png',
        type: 'tacos',
        hasBuilder: true,
        isSpecial: true,
        defaultIngredients: 'Chicken Tikka, Kefta • Chili Thaï • Oignon Frit',
        price: 9.90,
        menuPrice: 11.90,
        upgrades: [
            { id: 'large', name: 'Large', extraPrice: 3.00 },
            { id: 'xl', name: 'XL', extraPrice: 6.00 }
        ]
    },
    {
        id: 'tacos_crispy',
        category: 'tacos',
        name: 'Tacos Crispy',
        description: 'Chicken Tikka, Tenders, Bacon, Oignons frits, Sauce Algérienne',
        image: '../assets/tacos/tacos_crispy.png',
        type: 'tacos',
        hasBuilder: true,
        isSpecial: true,
        defaultIngredients: 'Chicken Tikka, Tenders • Bacon • Oignons Frits • Algérienne',
        price: 9.90,
        menuPrice: 11.90,
        upgrades: [
            { id: 'large', name: 'Large', extraPrice: 3.00 },
            { id: 'xl', name: 'XL', extraPrice: 6.00 }
        ]
    },
    {
        id: 'tacos_chevre',
        category: 'tacos',
        name: 'Tacos Chèvre',
        description: 'Tenders, Steak, Œuf, Chèvre',
        image: '../assets/tacos/tacos_chevre.png',
        type: 'tacos',
        hasBuilder: true,
        isSpecial: true,
        defaultIngredients: 'Tenders, Steak • Chèvre • Œuf',
        price: 8.90,
        menuPrice: 10.90,
        upgrades: [
            { id: 'large', name: 'Large', extraPrice: 3.00 },
            { id: 'xl', name: 'XL', extraPrice: 6.00 }
        ]
    },
    {
        id: 'tacos_royal',
        category: 'tacos',
        name: 'Tacos Royal',
        description: '2 Viandes au choix, Oignons et poivrons, Bacon, Sauce Cheddar',
        image: '../assets/tacos/tacos_chef.png',
        type: 'tacos',
        hasBuilder: true,
        isSpecial: true,
        defaultIngredients: '2 Viandes • Oignons, Poivrons • Bacon • Sauce Cheddar',
        price: 10.50,
        menuPrice: 12.50,
        upgrades: [
            { id: 'large', name: 'Large', extraPrice: 3.00 },
            { id: 'xl', name: 'XL', extraPrice: 6.00 }
        ]
    },

    // ==================== NAANS SPÉCIAUX ====================
    {
        id: 'naan_royal',
        category: 'naans',
        name: 'Naan Royal',
        description: 'Chicken Tikka, Tenders, Sauce Cheddar, Oignon frit',
        image: '../assets/naans/naan_royal.png',
        price: 9.00,
        menuPrice: 11.00,
        type: 'naan',
        hasBuilder: true,
        isSpecial: true,
        defaultIngredients: 'Chicken Tikka, Tenders • Sauce Cheddar • Oignon Frit'
    },
    {
        id: 'naan_cheesy',
        category: 'naans',
        name: 'Naan Cheesy',
        description: 'Steak, Cordon Bleu, Raclette, Sauce Fromagère',
        image: '../assets/naans/naan_cheesy.png',
        price: 10.50,
        menuPrice: 12.50,
        type: 'naan',
        hasBuilder: true,
        isSpecial: true,
        defaultIngredients: 'Steak, Cordon Bleu • Raclette • Sauce Fromagère'
    },
    {
        id: 'naan_crispy',
        category: 'naans',
        name: 'Naan Crispy',
        description: 'Kebab, Tenders, Bacon, Oignons frits, Sauce Algérienne',
        image: '../assets/naans/naan_crispy.png',
        price: 9.00,
        menuPrice: 11.00,
        type: 'naan',
        hasBuilder: true,
        isSpecial: true,
        defaultIngredients: 'Kebab, Tenders • Bacon • Oignons Frits • Algérienne'
    },
    {
        id: 'naan_delice',
        category: 'naans',
        name: 'Naan Délice',
        description: 'Kebab, Tenders, Bacon, Œuf, Sauce Sweet Chili',
        image: '../assets/naans/naan_delice.png',
        price: 9.00,
        menuPrice: 11.00,
        type: 'naan',
        hasBuilder: true,
        isSpecial: true,
        defaultIngredients: 'Kebab, Tenders • Bacon • Œuf • Sweet Chili'
    },

    // ==================== SANDWICHS CLASSIQUES ====================
    // 1 viande au choix
    {
        id: 'sandwich_naan',
        category: 'sandwichs',
        name: 'Naan',
        description: '1 viande au choix',
        image: '../assets/sandwichs/sandwich.png',
        price: 7.00,
        menuPrice: 9.00,
        type: 'sandwich',
        hasBuilder: true
    },
    {
        id: 'sandwich_pain_rond',
        category: 'sandwichs',
        name: 'Pain Rond',
        description: '1 viande au choix',
        image: '../assets/sandwichs/sandwich.png',
        price: 7.00,
        menuPrice: 9.00,
        type: 'sandwich',
        hasBuilder: true
    },
    {
        id: 'sandwich_galette',
        category: 'sandwichs',
        name: 'Galette',
        description: '1 viande au choix',
        image: '../assets/sandwichs/sandwich_galette.png',
        price: 7.00,
        menuPrice: 9.00,
        type: 'sandwich',
        hasBuilder: true
    },

    // ==================== WRAPS ====================
    {
        id: 'wrap_classic',
        category: 'wraps',
        name: 'Wrap Classic',
        description: 'Viande au choix',
        image: '../assets/wraps/wrap.png',
        price: 7.50,
        menuPrice: 9.50,
        type: 'wrap',
        hasBuilder: true
    },
    {
        id: 'wrap_maxi',
        category: 'wraps',
        name: 'Wrap Maxi',
        description: 'Viande au choix - Grande taille',
        image: '../assets/wraps/wrap.png',
        price: 10.00,
        menuPrice: 12.00,
        type: 'wrap',
        hasBuilder: true
    },

    // ==================== BURGERS ====================
    {
        id: 'burger_cheese',
        category: 'burgers',
        name: 'Cheese',
        description: '1 Steak, Crudités, Cheddar',
        image: '../assets/burgers/smash_burger.png',
        price: 5.50,
        menuPrice: 7.50,
        hasBuilder: true
    },
    {
        id: 'burger_double_cheese',
        category: 'burgers',
        name: 'Double Cheese',
        description: '2 Steaks, Crudités, Cheddar',
        image: '../assets/burgers/double_smash.png',
        price: 7.00,
        menuPrice: 9.00,
        hasBuilder: true
    },
    {
        id: 'burger_chicken_cheese',
        category: 'burgers',
        name: 'Chicken Cheese',
        description: 'Poulet pané, Galette de pomme de terre, Crudités, Cheddar',
        image: '../assets/burgers/smokey_chick.png',
        price: 7.00,
        menuPrice: 9.00,
        hasBuilder: true
    },
    {
        id: 'burger_crispy',
        category: 'burgers',
        name: 'Crispy Burger',
        description: 'Double Tenders, Bacon, Oignons frits, Crudités, Cheddar',
        image: '../assets/burgers/smokey_chick.png',
        price: 8.00,
        menuPrice: 10.00,
        hasBuilder: true
    },
    {
        id: 'burger_smash',
        category: 'burgers',
        name: 'Smash Burger',
        description: '2 Steaks, 1 Tenders, Crudités, Cheddar',
        image: '../assets/burgers/delices_smash.png',
        price: 8.50,
        menuPrice: 10.50,
        hasBuilder: true
    },
    {
        id: 'burger_delice',
        category: 'burgers',
        name: 'Délice Burger',
        description: '2 Steaks, Pomme de terre, Œuf, Crudités, Cheddar',
        image: '../assets/burgers/delices_smash.png',
        price: 9.00,
        menuPrice: 11.00,
        hasBuilder: true
    },
    {
        id: 'burger_delice_royal',
        category: 'burgers',
        name: 'Délice Royal',
        description: '1 Poulet pané, 1 Steak, Pomme de terre, Crudités, Cheddar',
        image: '../assets/burgers/smash_tower.png',
        price: 10.00,
        menuPrice: 12.00,
        hasBuilder: true
    },

    // ==================== PANINIS ====================
    {
        id: 'panini_kebab',
        category: 'paninis',
        name: 'Panini Kebab',
        description: 'Kebab grillé',
        image: '../assets/common/logo.png',
        price: 6.00,
        menuPrice: 8.00,
        hasBuilder: true
    },
    {
        id: 'panini_tikka',
        category: 'paninis',
        name: 'Panini Chicken Tikka',
        description: 'Chicken Tikka épicé',
        image: '../assets/common/logo.png',
        price: 6.00,
        menuPrice: 8.00,
        hasBuilder: true
    },
    {
        id: 'panini_cordon_bleu',
        category: 'paninis',
        name: 'Panini Cordon Bleu',
        description: 'Cordon Bleu croustillant',
        image: '../assets/common/logo.png',
        price: 6.00,
        menuPrice: 8.00,
        hasBuilder: true
    },
    {
        id: 'panini_merguez',
        category: 'paninis',
        name: 'Panini Merguez',
        description: 'Merguez grillée',
        image: '../assets/common/logo.png',
        price: 6.00,
        menuPrice: 8.00,
        hasBuilder: true
    },
    {
        id: 'panini_tenders',
        category: 'paninis',
        name: 'Panini Tenders',
        description: 'Tenders croustillants',
        image: '../assets/common/logo.png',
        price: 6.00,
        menuPrice: 8.00,
        hasBuilder: true
    },
    {
        id: 'panini_kefta',
        category: 'paninis',
        name: 'Panini Kefta',
        description: 'Kefta épicée',
        image: '../assets/common/logo.png',
        price: 6.00,
        menuPrice: 8.00,
        hasBuilder: true
    },
    {
        id: 'panini_3_fromages',
        category: 'paninis',
        name: 'Panini 3 Fromages',
        description: 'Trio de fromages fondants',
        image: '../assets/common/logo.png',
        price: 6.00,
        menuPrice: 8.00,
        hasBuilder: true
    },
    {
        id: 'panini_chevre_miel',
        category: 'paninis',
        name: 'Panini Chèvre Miel',
        description: 'Chèvre et miel',
        image: '../assets/common/logo.png',
        price: 6.00,
        menuPrice: 8.00,
        hasBuilder: true
    },

    // ==================== POUTINES ====================
    // Base : Riz ou Frites + Sauce Fromagère + Gratiné Mozzarella
    {
        id: 'poutine_classic',
        category: 'poutines',
        name: 'Poutine Classic',
        description: 'Base Gratiné Mozzarella',
        image: '../assets/poutines/poutine.png',
        type: 'poutine',
        hasBuilder: true,
        sizes: [
            { id: 'small', name: 'Small', price: 6.90 },
            { id: 'medium', name: 'Medium', price: 8.50 },
            { id: 'xl', name: 'XL', price: 10.90 }
        ]
    },
    {
        id: 'poutine_chevre_miel',
        category: 'poutines',
        name: 'Poutine Chèvre Miel',
        description: 'Tenders, Steak, Gratiné Chèvre Miel',
        image: '../assets/poutines/poutine.png',
        type: 'poutine',
        hasBuilder: true,
        isSpecial: true,
        defaultIngredients: 'Tenders, Steak • Gratiné Chèvre Miel',
        sizes: [
            { id: 'medium', name: 'Medium', price: 10.00 },
            { id: 'xl', name: 'XL', price: 12.50 }
        ]
    },
    {
        id: 'poutine_boursin',
        category: 'poutines',
        name: 'Poutine Boursin',
        description: 'Cordon Bleu, Chicken Tikka, Gratiné Boursin',
        image: '../assets/poutines/poutine.png',
        type: 'poutine',
        hasBuilder: true,
        isSpecial: true,
        defaultIngredients: 'Cordon Bleu, Chicken Tikka • Gratiné Boursin',
        sizes: [
            { id: 'medium', name: 'Medium', price: 10.00 },
            { id: 'xl', name: 'XL', price: 12.50 }
        ]
    },
    {
        id: 'poutine_raclette',
        category: 'poutines',
        name: 'Poutine Raclette',
        description: 'Kefta, Tenders, Gratiné Raclette',
        image: '../assets/poutines/poutine.png',
        type: 'poutine',
        hasBuilder: true,
        isSpecial: true,
        defaultIngredients: 'Kefta, Tenders • Gratiné Raclette',
        sizes: [
            { id: 'medium', name: 'Medium', price: 10.00 },
            { id: 'xl', name: 'XL', price: 12.50 }
        ]
    },

    // ==================== FRITES CHEDDAR ====================
    {
        id: 'frites_cheddar_classic',
        category: 'frites',
        name: 'Frites Cheddar Classic',
        description: 'Frites sauce cheddar',
        image: '../assets/frites/frite_boisson.png',
        type: 'frites',
        sizes: [
            { id: 'medium', name: 'Medium', price: 3.50 },
            { id: 'xl', name: 'XL', price: 4.50 }
        ]
    },
    {
        id: 'frites_cheddar_boursin',
        category: 'frites',
        name: 'Frites Cheddar Boursin',
        description: 'Frites cheddar & boursin',
        image: '../assets/frites/frite_boisson.png',
        type: 'frites',
        sizes: [
            { id: 'medium', name: 'Medium', price: 4.50 },
            { id: 'xl', name: 'XL', price: 5.50 }
        ]
    },
    {
        id: 'frites_cheddar_lardons',
        category: 'frites',
        name: 'Frites Cheddar Lardons',
        description: 'Frites cheddar & lardons',
        image: '../assets/frites/frite_boisson.png',
        type: 'frites',
        sizes: [
            { id: 'medium', name: 'Medium', price: 4.50 },
            { id: 'xl', name: 'XL', price: 5.50 }
        ]
    },
    {
        id: 'frites_cheddar_bacon',
        category: 'frites',
        name: 'Frites Cheddar Bacon',
        description: 'Frites cheddar & bacon',
        image: '../assets/frites/frite_boisson.png',
        type: 'frites',
        sizes: [
            { id: 'medium', name: 'Medium', price: 4.50 },
            { id: 'xl', name: 'XL', price: 5.50 }
        ]
    },
    {
        id: 'frites_simple',
        category: 'frites',
        name: 'Frites',
        description: 'Portion de frites',
        image: '../assets/frites/frite_boisson.png',
        sizes: [
            { id: 'normal', name: 'Normal', price: 2.00 },
            { id: 'grande', name: 'Grande', price: 3.00 }
        ]
    },
    {
        id: 'potatoes',
        category: 'frites',
        name: 'Potatoes',
        description: 'Pommes de terre rôties',
        image: '../assets/frites/frite_boisson.png',
        sizes: [
            { id: 'normal', name: 'Normal', price: 2.50 },
            { id: 'grande', name: 'Grande', price: 3.50 }
        ]
    },

    // ==================== ASSIETTES ====================
    // Accompagnées de crudités, pain rond ou naan, sauce au choix
    {
        id: 'assiette_simple',
        category: 'assiettes',
        name: 'Assiette Simple',
        description: '1 viande au choix + Crudités + Pain + Sauce',
        image: '../assets/common/assiette.png',
        price: 10.00,
        menuPrice: 12.00,
        type: 'assiette',
        hasBuilder: true
    },
    {
        id: 'assiette_special_delice',
        category: 'assiettes',
        name: 'Assiette Spécial Délice',
        description: '3 viandes au choix + Crudités + Pain + Sauce',
        image: '../assets/common/assiette.png',
        price: 13.50,
        menuPrice: 15.50,
        type: 'assiette',
        hasBuilder: true,
        isSpecial: true
    },

    // ==================== MENU ENFANT ====================
    // 7,00 € - Inclus : Frites + Boisson (Capri-Sun) + Surprise (Kinder)
    {
        id: 'enfant_mini_tacos',
        category: 'enfant',
        name: 'Mini Tacos Kebab',
        description: 'Mini Tacos + Frites + Capri-Sun + Kinder',
        image: '../assets/common/logo.png',
        price: 7.00,
        type: 'enfant',
        hasBuilder: true,
        includesFrites: true,
        includesBoisson: true,
        includesSurprise: true
    },
    {
        id: 'enfant_nuggets',
        category: 'enfant',
        name: 'Menu Nuggets',
        description: 'Nuggets + Frites + Capri-Sun + Kinder',
        image: '../assets/common/logo.png',
        price: 7.00,
        type: 'enfant',
        hasBuilder: true,
        includesFrites: true,
        includesBoisson: true,
        includesSurprise: true
    },
    {
        id: 'enfant_mini_burger',
        category: 'enfant',
        name: 'Mini Burger',
        description: 'Mini Burger + Frites + Capri-Sun + Kinder',
        image: '../assets/common/logo.png',
        price: 7.00,
        type: 'enfant',
        hasBuilder: true,
        includesFrites: true,
        includesBoisson: true,
        includesSurprise: true
    },
    {
        id: 'enfant_tenders',
        category: 'enfant',
        name: 'Menu Tenders',
        description: '3 Tenders + Frites + Capri-Sun + Kinder',
        image: '../assets/common/logo.png',
        price: 7.00,
        type: 'enfant',
        hasBuilder: true,
        includesFrites: true,
        includesBoisson: true,
        includesSurprise: true
    },

    // ==================== TEX-MEX & DIVERS ====================
    {
        id: 'wings_5',
        category: 'tex_mex',
        name: 'Wings x5',
        description: '5 ailes de poulet croustillantes',
        image: '../assets/common/logo.png',
        price: 5.00
    },
    {
        id: 'nuggets_5',
        category: 'tex_mex',
        name: 'Nuggets x5',
        description: '5 nuggets croustillants',
        image: '../assets/common/logo.png',
        price: 5.00
    },
    {
        id: 'jalapenos_5',
        category: 'tex_mex',
        name: 'Jalapeños x5',
        description: 'Jalapeños frits au fromage',
        image: '../assets/common/logo.png',
        price: 5.00
    },
    {
        id: 'mozza_5',
        category: 'tex_mex',
        name: 'Mozza Sticks x5',
        description: 'Bâtonnets de mozzarella',
        image: '../assets/common/logo.png',
        price: 5.00
    },
    {
        id: 'camembert_5',
        category: 'tex_mex',
        name: 'Camembert x5',
        description: 'Camembert pané',
        image: '../assets/common/logo.png',
        price: 5.00
    },
    {
        id: 'bouchee_chevre_5',
        category: 'tex_mex',
        name: 'Bouchée Chèvre x5',
        description: 'Bouchées de chèvre panées',
        image: '../assets/common/logo.png',
        price: 5.50
    },
    {
        id: 'tenders_5',
        category: 'tex_mex',
        name: 'Tenders x5',
        description: '5 tenders croustillants',
        image: '../assets/common/logo.png',
        price: 6.00
    },
    {
        id: 'oignons_rings_8',
        category: 'tex_mex',
        name: 'Oignons Rings x8',
        description: 'Onion rings croustillants',
        image: '../assets/common/logo.png',
        price: 6.00
    },
    {
        id: 'nems_5',
        category: 'tex_mex',
        name: 'Nems x5',
        description: 'Nems croustillants',
        image: '../assets/common/logo.png',
        price: 6.00
    },
    {
        id: 'barquette_viande_normal',
        category: 'tex_mex',
        name: 'Barquette Viande',
        description: 'Viande seule',
        image: '../assets/common/logo.png',
        sizes: [
            { id: 'normal', name: 'Normal', price: 6.00 },
            { id: 'grande', name: 'Grande', price: 8.50 }
        ]
    },

    // ==================== DESSERTS ====================
    {
        id: 'tiramisu',
        category: 'desserts',
        name: 'Tiramisu',
        description: 'Maison & Café',
        image: '../assets/desserts/tiramisu.png',
        price: 3.00
    },
    {
        id: 'panini_nutella',
        category: 'desserts',
        name: 'Panini Nutella',
        description: 'Panini Fondant',
        image: '../assets/desserts/panini_nutella.png',
        price: 3.50
    },
    {
        id: 'tarte_daim',
        category: 'desserts',
        name: 'Tarte Daim',
        description: 'Croustillant',
        image: '../assets/desserts/tarte_daim.png',
        price: 3.00
    },

    // ==================== BOISSONS ====================
    {
        id: 'boisson_33',
        category: 'boissons',
        name: 'Boisson 33cl',
        description: 'Au choix',
        image: '../assets/frites/frite_boisson.png',
        price: 1.70,
        type: 'boisson_seule',
        hasBuilder: true
    },
    {
        id: 'bouteille_150',
        category: 'boissons',
        name: 'Bouteille 1.5L',
        description: 'Pepsi, Oasis ou Eau',
        image: '../assets/frites/frite_boisson.png',
        price: 4.00
    },
    {
        id: 'eau_150',
        category: 'boissons',
        name: 'Eau 1.5L',
        description: '',
        image: '../assets/frites/frite_boisson.png',
        price: 3.50
    }
];

// ============================================================================
//  LES DÉLICES DE L'INDE — Interface de la borne (refonte du 18/10/2026)
//
//  Ce fichier gère l'affichage et la prise de commande. Il ne touche PAS à
//  l'impression : il remplit `state` (prénom, mode, panier) exactement au
//  format attendu par tickets.js, puis appelle validateOrder() de tickets.js.
//
//  Format d'une ligne du panier (lu par generateTicketHTML) :
//    { name: 'Tacos Medium', quantity: 1, price: 9.00,
//      details: 'Kebab, Tenders • Algérienne • MENU (Frites + Coca Cola)' }
//  Chaque morceau séparé par ' • ' devient une ligne « → » sur le ticket cuisine.
//
//  Compatible Chrome 109 (dernière version sur Windows 7) et file://.
// ============================================================================

const state = { prenom: '', mode: '', cart: [] };

// Version affichée dans le menu admin (sert à vérifier qu'une mise à jour est bien arrivée)
var VERSION_BORNE = '19/10/2026 (2)';

var B = (function () {
    'use strict';

    // ------------------------------------------------------------------
    //  Petits outils
    // ------------------------------------------------------------------
    function $(id) { return document.getElementById(id); }
    function arrondi(n) { return Math.round(n * 100) / 100; }
    function eur(n) { return arrondi(n).toFixed(2).replace('.', ',') + ' €'; }
    function plus(n) { return '+' + eur(n); }
    function esc(s) {
        return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
            return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
        });
    }
    function copie(o) { return JSON.parse(JSON.stringify(o)); }
    function produit(id) { return PRODUCTS.find(function (p) { return p.id === id; }); }

    // ------------------------------------------------------------------
    //  Icônes (SVG : Windows 7 n'affiche pas les emoji)
    // ------------------------------------------------------------------
    var T = 'viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"';
    var T64 = 'viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"';
    var ICONES = {
        panier: '<svg ' + T + '><path d="M5 8h14l-1.2 11.2a2 2 0 0 1-2 1.8H8.2a2 2 0 0 1-2-1.8L5 8z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/></svg>',
        plus: '<svg ' + T + ' stroke-width="2.6"><path d="M12 5v14M5 12h14"/></svg>',
        moins: '<svg ' + T + ' stroke-width="2.6"><path d="M5 12h14"/></svg>',
        croix: '<svg ' + T + ' stroke-width="2.6"><path d="M6 6l12 12M18 6L6 18"/></svg>',
        coche: '<svg ' + T + ' stroke-width="3"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>',
        crayon: '<svg ' + T + '><path d="M4 20h4L19 9l-4-4L4 16v4z"/><path d="M13.5 6.5l4 4"/></svg>',
        poubelle: '<svg ' + T + '><path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/></svg>',
        gauche: '<svg ' + T + ' stroke-width="2.6"><path d="M15 5l-7 7 7 7"/></svg>',
        droite: '<svg ' + T + ' stroke-width="2.6"><path d="M9 5l7 7-7 7"/></svg>',
        echange: '<svg ' + T + '><path d="M4 8h13l-3-3M20 16H7l3 3"/></svg>',
        info: '<svg ' + T + '><circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5v.5"/></svg>',
        efface: '<svg ' + T + '><path d="M21 5H9l-6 7 6 7h12V5z"/><path d="M17 9l-6 6M11 9l6 6"/></svg>',
        horloge: '<svg ' + T + '><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
        cadeau: '<svg ' + T + '><path d="M4 11h16v9H4zM3 7h18v4H3zM12 7v13"/><path d="M12 7c-1.5-3-5-3-5-1s3 1 5 1c2 0 5 1 5-1s-3.5-2-5 1z"/></svg>',
        couverts: '<svg ' + T64 + '><circle cx="34" cy="36" r="17"/><circle cx="34" cy="36" r="11" stroke-width="2"/><path d="M8 12v16M12 12v16M16 12v16M12 28v26"/><path d="M58 12c-4 3-5 9-4 15h4v27"/></svg>',
        sac: '<svg ' + T64 + '><path d="M13 20h38l-3 36H16z"/><path d="M24 26v-8a8 8 0 0 1 16 0v8"/></svg>',
        canette: '<svg ' + T64 + '><path d="M21 12h22l2 6v32l-2 6H21l-2-6V18z"/><path d="M19 20h26M19 46h26"/><path d="M28 8h8"/></svg>',
        bouteille: '<svg ' + T64 + '><path d="M27 6h10v8l5 7v35a3 3 0 0 1-3 3H25a3 3 0 0 1-3-3V21l5-7z"/><path d="M22 30h20v14H22z"/></svg>',
        panierTexmex: '<svg ' + T64 + '><path d="M8 30h48l-6 24H14z"/><path d="M16 30c0-8 6-12 10-12s6 6 6 6M30 26c2-8 8-12 12-10s4 8 4 14"/><path d="M20 38l2 10M32 38v10M44 38l-2 10"/></svg>',
        enfant: '<svg ' + T64 + '><circle cx="32" cy="34" r="20"/><path d="M24 30v1M40 30v1"/><path d="M24 41c4 4 12 4 16 0"/><path d="M26 14c2-6 10-6 12 0"/></svg>',
        panini: '<svg ' + T64 + '><path d="M8 26c0-6 4-10 10-10h28c6 0 10 4 10 10v2H8z"/><path d="M8 36h48v2c0 6-4 10-10 10H18c-6 0-10-4-10-10z"/><path d="M8 32h48" stroke-dasharray="4 4"/></svg>',
        naan: '<svg ' + T64 + '><path d="M10 34c0-12 10-20 22-20s22 8 22 20-10 18-22 18-22-6-22-18z"/><circle cx="24" cy="30" r="2"/><circle cx="36" cy="26" r="2"/><circle cx="40" cy="38" r="2"/><circle cx="28" cy="40" r="2"/></svg>',
        assiette: '<svg ' + T64 + '><circle cx="32" cy="32" r="22"/><circle cx="32" cy="32" r="14" stroke-width="2"/></svg>',
        etoile: '<svg ' + T64 + '><path d="M32 8l7 15 16 2-12 11 3 16-14-8-14 8 3-16L9 25l16-2z"/></svg>',
        etudiant: '<svg ' + T64 + '><path d="M4 24l28-12 28 12-28 12z"/><path d="M16 30v14c0 4 8 8 16 8s16-4 16-8V30"/><path d="M60 24v14"/></svg>'
    };
    function remplirIcones(racine) {
        (racine || document).querySelectorAll('[data-icone]').forEach(function (el) {
            var nom = el.getAttribute('data-icone');
            if (ICONES[nom]) el.innerHTML = ICONES[nom] + el.innerHTML;
            el.removeAttribute('data-icone');
        });
    }

    // ------------------------------------------------------------------
    //  Images : version légère (img/*.webp), repli sur l'originale
    // ------------------------------------------------------------------
    function estPhoto(p) {
        return !!p.image && !/common\/logo\.png$/.test(p.image) && p.category !== 'boissons';
    }
    function webp(src) {
        return 'img/' + src.split('/').pop().replace(/\.(png|jpe?g)$/i, '') + '.webp';
    }
    function iconeDe(p) {
        if (p.category === 'boissons') return /1\.5L|2L|Eau/i.test(p.name) ? 'bouteille' : 'canette';
        if (p.category === 'enfant') return 'enfant';
        if (p.category === 'paninis') return 'panini';
        if (/^naan_(nature|fromage)$/.test(p.id)) return 'naan';
        if (p.category === 'tex_mex') return 'panierTexmex';
        return 'assiette';
    }
    function visuel(p) {
        if (!estPhoto(p)) return '<div class="icone-produit">' + ICONES[iconeDe(p)] + '</div>';
        return '<img src="' + webp(p.image) + '" alt="" decoding="async" onerror="this.onerror=null;this.src=\'' + esc(p.image) + '\'">';
    }

    // Vignettes du rail des catégories
    var VIGNETTES = {
        offres: { icone: 'etoile' }, buckets: { img: 'bucket_2' }, bowls: { img: 'bowl_classique' },
        salades: { img: 'salade' }, tacos: { img: 'tacos' }, naans: { img: 'naan_royal' },
        sandwichs: { img: 'sandwich' }, wraps: { img: 'wrap' }, burgers: { img: 'smash_burger' },
        paninis: { icone: 'panini' }, boxes: { img: 'box_wings_classic' }, poutines: { img: 'poutine' },
        frites: { img: 'frite_boisson' }, assiettes: { img: 'assiette' }, enfant: { icone: 'enfant' },
        menu_etudiant: { icone: 'etudiant' }, tex_mex: { icone: 'panierTexmex' }, desserts: { img: 'tiramisu' },
        boissons: { icone: 'canette' }
    };

    // ------------------------------------------------------------------
    //  RECETTES : ce que la borne demande pour chaque produit
    //  Chaque recette donne :
    //   - groupes(sel) : les choix à faire (dépendent des choix déjà faits)
    //   - base(sel)    : le prix de départ
    //   - ligne(sel)   : le nom et les détails imprimés sur les tickets
    //  Les prix des options (« delta ») s'ajoutent automatiquement.
    //  Les libellés imprimés reprennent ceux de l'ancienne borne, que la
    //  cuisine et la caisse connaissent déjà.
    // ------------------------------------------------------------------
    var SANS_SAUCE = { id: 'sans_sauce', nom: 'Sans sauce', exclusif: true };

    function optsDe(liste, delta) {
        return liste.map(function (x) { return { id: x.id, nom: x.name, delta: delta || 0 }; });
    }
    function choisis(g, sel) {
        var ids = sel[g.id] || [];
        return ids.map(function (id) { return g.options.find(function (o) { return o.id === id; }); }).filter(Boolean);
    }
    function nomsDe(gs, sel, gid) {
        var g = gs.find(function (x) { return x.id === gid; });
        return g ? choisis(g, sel).map(function (o) { return o.nom; }) : [];
    }
    function un(sel, gid) { return (sel[gid] || [])[0]; }

    // Groupes réutilisés
    function gTaille(p, titre) {
        return {
            id: 'taille', titre: titre || 'Choisissez la taille', min: 1, max: 1, larges: true, vedette: true,
            options: p.sizes.map(function (s) {
                return { id: s.id, nom: s.name, sous: s.meatCount ? s.meatCount + ' viande' + (s.meatCount > 1 ? 's' : '') : '', abs: s.price };
            })
        };
    }
    function gViandes(n, attente) {
        if (!n) {
            return { id: 'viandes', titre: 'Vos viandes', aide: attente, min: 1, max: 1, bloque: attente, options: optsDe(VIANDES) };
        }
        return {
            id: 'viandes', titre: n > 1 ? 'Vos ' + n + ' viandes' : 'Votre viande',
            aide: n > 1 ? 'Choisissez-en ' + n : 'Une au choix', min: n, max: n, options: optsDe(VIANDES)
        };
    }
    function gViande() {
        return { id: 'viande', titre: 'Votre viande', aide: 'Une au choix', min: 1, max: 1, options: optsDe(VIANDES) };
    }
    // exclure : sauces déjà dans la recette (ex. la sauce fromagère des tacos)
    function gSauces(titre, exclure) {
        var liste = SAUCES.filter(function (s) { return !exclure || exclure.indexOf(s.id) < 0; });
        return {
            id: 'sauces', titre: titre || 'Vos sauces',
            aide: SAUCES_INCLUSES + ' offertes, puis +' + eur(PRIX_SAUCE_SUPP) + ' la sauce · ' + SAUCES_MAX + ' maximum',
            min: 1, max: SAUCES_MAX, payantApres: SAUCES_INCLUSES, prixPayant: PRIX_SAUCE_SUPP,
            options: [SANS_SAUCE].concat(optsDe(liste))
        };
    }
    function gSauceUnique() {
        return { id: 'sauce', titre: 'Votre sauce', aide: 'Une au choix', min: 1, max: 1, options: [SANS_SAUCE].concat(optsDe(SAUCES)) };
    }
    // Ingrédients que le client peut retirer : liste « retraits » du produit dans
    // products.js (d'après sa recette), sinon la liste par défaut donnée ici.
    var RETRAITS_TACOS_IDS = ['sans_sauce_fromagere', 'sans_frites'];
    var RETRAITS_CRUDITES_IDS = ['sans_salade', 'sans_tomate', 'sans_oignon'];
    function gRetraits(p, defaut) {
        var liste = (p.retraits || defaut || []).map(function (id) {
            return RETRAITS.find(function (r) { return r.id === id; });
        }).filter(Boolean);
        if (!liste.length) return null;
        return { id: 'retraits', titre: 'Retirer un ingrédient ?', aide: 'Facultatif · gratuit', min: 0, max: liste.length, options: optsDe(liste) };
    }
    function gViandesSupp() {
        return { id: 'viandes_supp', titre: 'Une viande en plus ?', aide: 'Facultatif · +' + eur(1.5) + ' la viande', min: 0, max: VIANDES.length, options: optsDe(VIANDES, 1.5) };
    }
    function gSupplements() {
        return {
            id: 'supplements', titre: 'Des suppléments ?', aide: 'Facultatif', min: 0, max: SUPPLEMENTS.length,
            options: SUPPLEMENTS.map(function (s) { return { id: s.id, nom: s.name, delta: s.price }; })
        };
    }
    function gFormule(prixSeul) {
        return {
            id: 'formule', titre: 'Seul ou en menu ?', min: 1, max: 1, larges: true, vedette: true,
            options: [
                { id: 'seul', nom: 'Seul', sous: eur(prixSeul) },
                { id: 'menu', nom: 'En menu', sous: 'Avec frites + boisson', delta: 2 }
            ]
        };
    }
    function gBoisson(id, titre, visible) {
        return {
            id: id || 'boisson', titre: titre || 'Votre boisson', aide: 'Canette 33 cl au choix', min: 1, max: 1,
            visible: visible !== false, options: optsDe(BOISSONS_33)
        };
    }
    function gBoissonOption() {
        return { id: 'boisson', titre: 'Ajouter une boisson ?', aide: 'Facultatif · +' + eur(1) + ' la canette', min: 0, max: 1, options: optsDe(BOISSONS_33, 1) };
    }
    function texteSauces(gs, sel, gid) {
        var n = nomsDe(gs, sel, gid || 'sauces');
        return n.length ? n.join(', ') : '';
    }
    function texteSauce(gs, sel) {
        var n = nomsDe(gs, sel, 'sauce')[0];
        if (!n) return '';
        return n === SANS_SAUCE.nom ? 'Sans sauce' : 'Sauce ' + n;
    }
    function menuTexte(gs, sel) {
        return 'MENU (Frites + ' + (nomsDe(gs, sel, 'boisson')[0] || 'Boisson') + ')';
    }
    function tailleChoisie(p, sel) {
        var id = un(sel, 'taille');
        return id ? p.sizes.find(function (s) { return s.id === id; }) : null;
    }

    function recette(p) {
        var r = recetteBrute(p);
        var groupes = r.groupes;
        r.groupes = function (sel) { return groupes(sel).filter(Boolean); };
        return r;
    }

    function recetteBrute(p) {
        var t = p.type;

        // ---- Tacos à composer ----
        if (t === 'tacos' && !p.isSpecial) {
            return {
                groupes: function (sel) {
                    var taille = tailleChoisie(p, sel);
                    var grand = taille ? estGrandeTailleTacos(taille.id) : false;
                    return [
                        gTaille(p),
                        gViandes(taille ? taille.meatCount : 0, 'Choisissez d\'abord la taille'),
                        gSauces(null, ['fromagere']),
                        gRetraits(p, RETRAITS_TACOS_IDS),
                        {
                            id: 'gratin', titre: 'Gratiner votre tacos ?', aide: 'Facultatif · +' + eur(grand ? 2.5 : 2) + (grand ? ' en grande taille' : ''),
                            min: 0, max: 1, options: optsDe(GRATINS, grand ? 2.5 : 2)
                        },
                        gSupplements(),
                        gFormule(taille ? taille.price : p.sizes[0].price),
                        gBoisson('boisson', null, un(sel, 'formule') === 'menu')
                    ];
                },
                base: function (sel) { var s = tailleChoisie(p, sel); return s ? s.price : p.sizes[0].price; },
                ligne: function (sel, gs) {
                    var s = tailleChoisie(p, sel);
                    var d = [nomsDe(gs, sel, 'viandes').join(', '), texteSauces(gs, sel)];
                    d = d.concat(nomsDe(gs, sel, 'retraits'));
                    var gr = nomsDe(gs, sel, 'gratin')[0];
                    if (gr) d.push('Gratin ' + gr);
                    var sp = nomsDe(gs, sel, 'supplements');
                    if (sp.length) d.push('+ ' + sp.join(', '));
                    if (un(sel, 'formule') === 'menu') d.push(menuTexte(gs, sel));
                    return { name: 'Tacos ' + (s ? s.name : ''), details: d };
                }
            };
        }

        // ---- Tacos spéciaux ----
        if (t === 'tacos') {
            return {
                defaut: { taille: ['standard'] },
                groupes: function (sel) {
                    var tailles = [{ id: 'standard', nom: 'Standard', abs: p.price }].concat((p.upgrades || []).map(function (u) {
                        return { id: u.id, nom: u.name, delta: u.extraPrice };
                    }));
                    var extra = 0;
                    tailles.forEach(function (o) { if (o.id === un(sel, 'taille') && o.delta) extra = o.delta; });
                    return [
                        { id: 'taille', titre: 'Choisissez la taille', min: 1, max: 1, larges: true, vedette: true, options: tailles },
                        gRetraits(p, RETRAITS_TACOS_IDS),
                        gViandesSupp(),
                        gFormule(p.price + extra),
                        gBoisson('boisson', null, un(sel, 'formule') === 'menu')
                    ];
                },
                base: function () { return p.price; },
                ligne: function (sel, gs) {
                    var d = [p.defaultIngredients].concat(nomsDe(gs, sel, 'retraits'));
                    var vs = nomsDe(gs, sel, 'viandes_supp');
                    if (vs.length) d.push('+' + vs.join(', +'));
                    if (un(sel, 'formule') === 'menu') d.push(menuTexte(gs, sel));
                    return { name: p.name + ' ' + (nomsDe(gs, sel, 'taille')[0] || 'Standard'), details: d };
                }
            };
        }

        // ---- Naans spéciaux ----
        if (t === 'naan') {
            return {
                groupes: function (sel) {
                    var f = un(sel, 'formule');
                    return [
                        gRetraits(p, RETRAITS_CRUDITES_IDS),
                        gViandesSupp(),
                        gSupplements(),
                        {
                            id: 'formule', titre: 'Seul, en menu ou Méga XL ?', min: 1, max: 1, larges: true, vedette: true,
                            options: [
                                { id: 'seul', nom: 'Seul', sous: eur(p.price) },
                                { id: 'menu', nom: 'En menu', sous: 'Avec frites + boisson', delta: 2 },
                                { id: 'mega', nom: 'Méga XL', sous: 'Avec boisson', delta: 3.5 }
                            ]
                        },
                        gBoisson('boisson', null, f === 'menu' || f === 'mega')
                    ];
                },
                base: function () { return p.price; },
                ligne: function (sel, gs) {
                    var d = [p.defaultIngredients].concat(nomsDe(gs, sel, 'retraits'));
                    var vs = nomsDe(gs, sel, 'viandes_supp');
                    if (vs.length) d.push('+' + vs.join(', +'));
                    var sp = nomsDe(gs, sel, 'supplements');
                    if (sp.length) d.push('+ ' + sp.join(', '));
                    var b = nomsDe(gs, sel, 'boisson')[0] || 'Boisson';
                    if (un(sel, 'formule') === 'menu') d.push('MENU (Frites + ' + b + ')');
                    else if (un(sel, 'formule') === 'mega') d.push('MÉGA XL (' + b + ')');
                    return { name: p.name, details: d };
                }
            };
        }

        // ---- Sandwichs (Naan / Pain rond / Galette) ----
        if (t === 'sandwich') {
            var painDefaut = { sandwich_naan: 'naan_nature', sandwich_pain_rond: 'pain_rond', sandwich_galette: 'galette' }[p.id] || PAINS[0].id;
            return {
                defaut: { taille: ['classique'], pain: [painDefaut] },
                groupes: function (sel) {
                    var mega = un(sel, 'taille') === 'mega';
                    return [
                        {
                            id: 'taille', titre: 'Classique ou Méga XL ?', min: 1, max: 1, larges: true, vedette: true,
                            options: [
                                { id: 'classique', nom: 'Classique', sous: '1 viande', abs: 7 },
                                { id: 'mega', nom: 'Méga XL', sous: '2 viandes', abs: 11 }
                            ]
                        },
                        {
                            id: 'pain', titre: 'Votre pain', min: 1, max: 1,
                            options: PAINS.map(function (x) { return { id: x.id, nom: x.name, delta: x.extraPrice || 0 }; })
                        },
                        gViandes(mega ? 2 : 1),
                        gSauces(),
                        gRetraits(p, RETRAITS_CRUDITES_IDS),
                        gViandesSupp(),
                        gSupplements(),
                        gFormule(mega ? 11 : 7),
                        gBoisson('boisson', null, un(sel, 'formule') === 'menu')
                    ];
                },
                base: function (sel) { return un(sel, 'taille') === 'mega' ? 11 : 7; },
                ligne: function (sel, gs) {
                    var d = [];
                    if (un(sel, 'taille') === 'mega') d.push('Méga XL');
                    d.push(nomsDe(gs, sel, 'viandes').join(', '));
                    d.push(texteSauces(gs, sel));
                    d = d.concat(nomsDe(gs, sel, 'retraits'));
                    var vs = nomsDe(gs, sel, 'viandes_supp');
                    if (vs.length) d.push('+' + vs.join(', +'));
                    var sp = nomsDe(gs, sel, 'supplements');
                    if (sp.length) d.push('+ ' + sp.join(', '));
                    if (un(sel, 'formule') === 'menu') d.push(menuTexte(gs, sel));
                    return { name: nomsDe(gs, sel, 'pain')[0] || p.name, details: d };
                }
            };
        }

        // ---- Bowls ----
        if (t === 'bowl') {
            return {
                groupes: function () {
                    var g = [gTaille(p)];
                    if (!p.isSpecial) g.push(gViande());
                    g.push(gRetraits(p));
                    return g;
                },
                base: function (sel) { var s = tailleChoisie(p, sel); return s ? s.price : p.sizes[0].price; },
                ligne: function (sel, gs) {
                    return { name: p.name, details: [nomsDe(gs, sel, 'taille')[0], nomsDe(gs, sel, 'viande')[0], p.defaultIngredients].concat(nomsDe(gs, sel, 'retraits')) };
                }
            };
        }

        // ---- Poutines ----
        if (t === 'poutine') {
            return {
                defaut: { base: ['frites'] },
                groupes: function () {
                    var g = [
                        gTaille(p),
                        { id: 'base', titre: 'Frites ou riz ?', min: 1, max: 1, larges: true, options: [{ id: 'frites', nom: 'Frites' }, { id: 'riz', nom: 'Riz' }] }
                    ];
                    if (!p.isSpecial) g.push(gViande());
                    return g;
                },
                base: function (sel) { var s = tailleChoisie(p, sel); return s ? s.price : p.sizes[0].price; },
                ligne: function (sel, gs) {
                    return {
                        name: p.name,
                        details: [nomsDe(gs, sel, 'taille')[0], un(sel, 'base') === 'riz' ? 'Riz' : 'Frites', nomsDe(gs, sel, 'viande')[0], p.defaultIngredients]
                    };
                }
            };
        }

        // ---- Frites / Potatoes ----
        if (t === 'frites') {
            return {
                groupes: function () { return [gTaille(p)]; },
                base: function (sel) { var s = tailleChoisie(p, sel); return s ? s.price : p.sizes[0].price; },
                ligne: function (sel, gs) { return { name: p.name, details: [nomsDe(gs, sel, 'taille')[0]] }; }
            };
        }

        // ---- Assiettes ----
        if (t === 'assiette') {
            var nb = p.isSpecial ? 3 : 1;
            return {
                groupes: function () {
                    return [
                        gViandes(nb),
                        gSauceUnique(),
                        {
                            id: 'pain', titre: 'Votre pain', min: 1, max: 1,
                            options: [{ id: 'pain_rond', nom: 'Pain Rond' }, { id: 'naan_nature', nom: 'Naan Nature' }, { id: 'naan_fromage', nom: 'Naan Fromage', delta: 1 }]
                        },
                        gRetraits(p),
                        gBoissonOption()
                    ];
                },
                base: function () { return p.price; },
                ligne: function (sel, gs) {
                    var d = [nb === 3 ? '3 Viandes' : '1 Viande', nomsDe(gs, sel, 'viandes').join(', '), texteSauce(gs, sel), nomsDe(gs, sel, 'pain')[0]].concat(nomsDe(gs, sel, 'retraits'));
                    var b = nomsDe(gs, sel, 'boisson')[0];
                    if (b) d.push('Boisson: ' + b);
                    return { name: p.name, details: d };
                }
            };
        }

        // ---- Boxes 9,90 € ----
        if (t === 'box_simple') {
            return {
                groupes: function () { return [gBoissonOption()]; },
                base: function () { return p.price; },
                ligne: function (sel, gs) {
                    var b = nomsDe(gs, sel, 'boisson')[0];
                    return { name: p.name, details: b ? ['+ Boisson ' + b] : [] };
                }
            };
        }

        // ---- Barquette de viande ----
        if (t === 'barquette_viande') {
            return {
                groupes: function () { return [gTaille(p), gViande()]; },
                base: function (sel) { var s = tailleChoisie(p, sel); return s ? s.price : p.sizes[0].price; },
                ligne: function (sel, gs) { return { name: p.name, details: [nomsDe(gs, sel, 'taille')[0], nomsDe(gs, sel, 'viande')[0]] }; }
            };
        }

        // ---- Buckets ----
        if (t === 'bucket') {
            var nbs = p.sauceCount || 1;
            return {
                groupes: function () {
                    var g = [{
                        id: 'sauces', titre: 'Vos sauces', aide: 'Jusqu\'à ' + nbs + ' offerte' + (nbs > 1 ? 's' : ''),
                        min: 0, max: nbs, options: optsDe(SAUCES)
                    }];
                    if (p.boissonBouteille) {
                        g.push({ id: 'boisson', titre: 'Votre bouteille 1,5 L', min: 1, max: 1, options: optsDe(BOUTEILLES_15L) });
                    } else if ((p.nbBoissons || 1) > 1) {
                        g.push(gBoisson('boisson', 'Votre 1ère boisson'));
                        g.push(gBoisson('boisson2', 'Votre 2ème boisson'));
                    } else {
                        g.push(gBoisson('boisson'));
                    }
                    g.push({
                        id: 'frites_supp', titre: 'Des frites en plus ?', aide: 'Facultatif', min: 0, max: 1,
                        options: [{ id: 'M', nom: 'Frites M', delta: 2.5 }, { id: 'XL', nom: 'Frites XL', delta: 3.5 }]
                    });
                    return g;
                },
                base: function () { return p.price; },
                ligne: function (sel, gs) {
                    var d = [];
                    var s = nomsDe(gs, sel, 'sauces');
                    if (s.length) d.push('Sauces: ' + s.join(', '));
                    if (un(sel, 'frites_supp')) d.push('+Frites ' + un(sel, 'frites_supp'));
                    var b = nomsDe(gs, sel, 'boisson').concat(nomsDe(gs, sel, 'boisson2'));
                    if (b.length) d.push((b.length > 1 ? 'Boissons: ' : 'Boisson: ') + b.join(', '));
                    return { name: p.name, details: d };
                }
            };
        }

        // ---- Canette 33 cl à la carte (l'eau a son propre produit à 1 €) ----
        if (t === 'boisson_seule') {
            return {
                groupes: function () {
                    return [{
                        id: 'boisson', titre: 'Votre boisson', min: 1, max: 1,
                        options: optsDe(BOISSONS_33.filter(function (b) { return b.id !== 'eau'; }))
                    }];
                },
                base: function () { return p.price; },
                ligne: function (sel, gs) { return { name: p.name, details: [nomsDe(gs, sel, 'boisson')[0]] }; }
            };
        }

        // ---- Menu étudiant ----
        if (t === 'etudiant_tacos') {
            return {
                etudiant: true,
                groupes: function (sel) {
                    var s = tailleChoisie(p, sel);
                    return [
                        gTaille(p),
                        gViandes(s ? s.meatCount : 0, 'Choisissez d\'abord la taille'),
                        gSauces(null, ['fromagere']),
                        gRetraits(p, RETRAITS_TACOS_IDS),
                        { id: 'gratin', titre: 'Gratiner votre tacos ?', aide: 'Facultatif · +' + eur(2), min: 0, max: 1, options: optsDe(GRATINS, 2) },
                        gBoisson('boisson')
                    ];
                },
                base: function (sel) { var s = tailleChoisie(p, sel); return s ? s.price : p.sizes[0].price; },
                ligne: function (sel, gs) {
                    var d = [nomsDe(gs, sel, 'viandes').join(', '), texteSauces(gs, sel)].concat(nomsDe(gs, sel, 'retraits'));
                    var gr = nomsDe(gs, sel, 'gratin')[0];
                    if (gr) d.push('Gratin ' + gr);
                    var bo = nomsDe(gs, sel, 'boisson')[0];
                    if (bo) d.push('Boisson: ' + bo);
                    var s = tailleChoisie(p, sel);
                    return { name: 'Étudiant Tacos ' + (s ? s.name : ''), details: d };
                }
            };
        }
        if (t === 'etudiant_simple' || t === 'etudiant_poutine' || t === 'etudiant_sandwich') {
            return {
                etudiant: true,
                groupes: function () {
                    var g = [];
                    if (t !== 'etudiant_simple') g.push(gViande());
                    if (t === 'etudiant_sandwich') g.push(gSauces());
                    g.push(gRetraits(p));
                    g.push(gBoisson('boisson'));
                    return g;
                },
                base: function () { return p.price; },
                ligne: function (sel, gs) {
                    var d = [];
                    if (t !== 'etudiant_simple') d.push(nomsDe(gs, sel, 'viande')[0]);
                    if (t === 'etudiant_sandwich') d.push(texteSauces(gs, sel));
                    d = d.concat(nomsDe(gs, sel, 'retraits'));
                    var bo = nomsDe(gs, sel, 'boisson')[0];
                    if (bo) d.push('Boisson: ' + bo);
                    return { name: p.name, details: d };
                }
            };
        }

        // ---- Burgers, wraps, paninis ----
        if (p.hasBuilder && p.menuPrice) {
            return {
                groupes: function (sel) {
                    var g = [];
                    if (p.type === 'wrap' || p.type === 'panini') g.push(gViande());
                    if (p.category === 'burgers' || p.type === 'panini') g.push(gSauceUnique());
                    g.push(gRetraits(p));
                    g.push(gFormule(p.price));
                    g.push(gBoisson('boisson', null, un(sel, 'formule') === 'menu'));
                    return g;
                },
                base: function () { return p.price; },
                ligne: function (sel, gs) {
                    var d = [nomsDe(gs, sel, 'viande')[0], texteSauce(gs, sel)].concat(nomsDe(gs, sel, 'retraits'));
                    if (un(sel, 'formule') === 'menu') d.push(menuTexte(gs, sel));
                    return { name: p.name, details: d };
                }
            };
        }

        // ---- Produit simple (salades, tex-mex, desserts, menus enfant, bouteilles...) ----
        return {
            groupes: function () { return [gRetraits(p)]; },
            base: function () { return p.price; },
            ligne: function (sel, gs) { return { name: p.name, details: [p.defaultIngredients || ''].concat(nomsDe(gs, sel, 'retraits')) }; }
        };
    }

    // Grande taille de tacos : gratin facturé 2,50 € au lieu de 2,00 €
    // (même règle que l'ancienne borne : L, XL, XXL, Large).
    function estGrandeTailleTacos(id) {
        var s = String(id || '').toUpperCase();
        return s === 'L' || s === 'XL' || s === 'XXL' || s === 'LARGE';
    }

    // ------------------------------------------------------------------
    //  Moteur de la fiche produit
    // ------------------------------------------------------------------
    var fiche = null; // { p, rec, sel, qte, indexEdition, essai }

    function groupesVisibles(f) {
        return f.rec.groupes(f.sel).filter(function (g) { return g.visible !== false; });
    }

    // Retire les choix devenus impossibles (groupe masqué, trop de viandes...)
    function nettoyer(f) {
        var tous = f.rec.groupes(f.sel);
        tous.forEach(function (g) {
            if (g.visible === false || g.bloque) { delete f.sel[g.id]; return; }
            var ids = (f.sel[g.id] || []).filter(function (id) { return g.options.some(function (o) { return o.id === id; }); });
            if (ids.length > g.max) ids = ids.slice(0, g.max);
            if (ids.length) f.sel[g.id] = ids; else delete f.sel[g.id];
        });
    }

    function nbPayants(g, sel) {
        if (!g.payantApres) return 0;
        var n = (sel[g.id] || []).filter(function (id) { return id !== SANS_SAUCE.id; }).length;
        return Math.max(0, n - g.payantApres);
    }

    function prixUnitaire(f) {
        var gs = groupesVisibles(f);
        var px = f.rec.base(f.sel);
        gs.forEach(function (g) {
            choisis(g, f.sel).forEach(function (o) { if (o.delta) px += o.delta; });
            px += nbPayants(g, f.sel) * (g.prixPayant || 0);
        });
        return arrondi(px);
    }

    function estComplet(g, sel) {
        if (g.bloque) return false;
        var n = (sel[g.id] || []).length;
        return n >= g.min && n <= g.max;
    }
    function manquants(f) {
        return groupesVisibles(f).filter(function (g) { return g.min > 0 && !estComplet(g, f.sel); });
    }

    function ouvrir(id, indexEdition) {
        var p = produit(id);
        if (!p) return;
        var rec = recette(p);
        var item = indexEdition != null ? state.cart[indexEdition] : null;
        fiche = {
            p: p,
            rec: rec,
            sel: item && item.selections ? copie(item.selections) : copie(rec.defaut || {}),
            qte: item ? item.quantity : 1,
            indexEdition: indexEdition != null ? indexEdition : null,
            essai: false
        };
        nettoyer(fiche);

        var prixCarte = p.sizes ? 'dès ' + eur(Math.min.apply(null, p.sizes.map(function (s) { return s.price; }))) : eur(p.price);
        $('fiche-cote').innerHTML =
            '<div class="fiche-photo">' + visuel(p) + '</div>' +
            '<div class="fiche-texte"><h2>' + esc(p.displayName || p.name) + '</h2>' +
            (p.description ? '<p>' + esc(p.description) + '</p>' : '') +
            '<div class="prix">' + prixCarte + '</div></div>' +
            '<div class="fiche-recap" id="fiche-recap"></div>';
        $('fiche-corps').scrollTop = 0;
        $('fiche').classList.toggle('simple', groupesVisibles(fiche).length === 0);
        dessinerFiche();
        $('fiche').classList.add('on');
    }

    function dessinerFiche() {
        var f = fiche;
        var gs = groupesVisibles(f);
        var html = '';
        if (f.rec.etudiant) {
            html += '<div class="bandeau" style="margin-top:1rem">' + ICONES.etudiant +
                '<div><b>Menu étudiant</b><span>Sur présentation de la carte étudiante · en semaine jusqu\'à 15h</span></div></div>';
        }
        if (!gs.length) {
            html += '<div class="bandeau" style="margin-top:1rem">' + ICONES.info +
                '<div><b>Prêt à ajouter</b><span>Choisissez la quantité puis touchez « Ajouter ».</span></div></div>';
        }
        gs.forEach(function (g, i) {
            var sel = f.sel[g.id] || [];
            var complet = estComplet(g, f.sel);
            var etat = g.min === 0 ? (sel.length ? 'complet' : '') : (complet ? 'complet' : 'requis-vide');
            var badge = g.min === 0 ? (sel.length ? sel.length + ' choisi' + (sel.length > 1 ? 's' : '') : 'Facultatif')
                : (complet ? 'OK' : (g.max > 1 && g.min === g.max ? sel.length + ' / ' + g.min : 'À choisir'));
            if (g.payantApres && complet) {
                var np = nbPayants(g, f.sel);
                badge = np ? np + ' payante' + (np > 1 ? 's' : '') : 'OK';
            }
            html += '<section class="groupe ' + etat + '" data-g="' + g.id + '">' +
                '<div class="g-tete"><div class="g-num"><span>' + (i + 1) + '</span>' + ICONES.coche + '</div>' +
                '<div class="g-titre"><b>' + esc(g.titre) + '</b>' + (g.aide ? '<span>' + esc(g.aide) + '</span>' : '') + '</div>' +
                '<div class="g-etat">' + badge + '</div></div>' +
                '<div class="options' + (g.larges ? ' larges' : '') + '"' +
                (g.larges ? ' style="grid-template-columns:repeat(' + Math.min(g.options.length, 4) + ',minmax(0,1fr))"' : '') + '>';
            var rang = 0;
            var nbChoisis = sel.filter(function (id) { return id !== SANS_SAUCE.id; }).length;
            g.options.forEach(function (o) {
                var on = sel.indexOf(o.id) >= 0;
                var prixTxt = '';
                if (o.abs != null) prixTxt = eur(o.abs);
                else if (o.delta) prixTxt = plus(o.delta);
                if (g.payantApres && !o.exclusif) {
                    if (on) { rang++; if (rang > g.payantApres) prixTxt = plus(g.prixPayant); }
                    else if (nbChoisis >= g.payantApres) prixTxt = plus(g.prixPayant);
                }
                html += '<button class="opt' + (on ? ' on' : '') + (g.vedette ? ' vedette' : '') + (g.bloque ? ' grise' : '') + '" data-g="' + g.id + '" data-o="' + o.id + '">' +
                    '<span class="o-coche">' + ICONES.coche + '</span>' +
                    '<span class="o-nom">' + esc(o.nom) + '</span>' +
                    (o.sous ? '<span class="o-sous">' + esc(o.sous) + '</span>' : '') +
                    (prixTxt ? '<span class="o-prix">' + prixTxt + '</span>' : '') +
                    '</button>';
            });
            html += '</div></section>';
        });
        var corps = $('fiche-corps');
        var haut = corps.scrollTop;
        corps.innerHTML = html;
        corps.scrollTop = haut;
        dessinerPiedFiche();
    }

    function dessinerPiedFiche() {
        var f = fiche;
        var m = manquants(f);
        var total = prixUnitaire(f) * f.qte;
        var btn = $('fiche-ok');
        var verbe = f.indexEdition != null ? 'Modifier' : 'Ajouter';
        btn.innerHTML = verbe + ' <span class="px">· ' + eur(total) + '</span>';
        btn.classList.toggle('eteint', m.length > 0);
        $('fiche-qte').textContent = f.qte;
        $('fiche-moins').disabled = f.qte <= 1;
        var recap = $('fiche-recap');
        if (recap) {
            var l = f.rec.ligne(f.sel, groupesVisibles(f));
            var lignes = l.details.filter(function (x) { return x && String(x).trim(); }).join(' • ').split(' • ').filter(Boolean);
            recap.innerHTML = lignes.length ? '<b>Votre choix</b>' + lignes.map(function (x) { return '<div>' + esc(x) + '</div>'; }).join('') : '';
        }
        var msg = $('fiche-message');
        if (m.length && f.essai) {
            msg.innerHTML = ICONES.info + '<span>Il reste à choisir : ' + esc(m.map(function (g) { return g.titre.replace(/ \?$/, ''); }).join(', ')) + '</span>';
            msg.classList.add('on');
        } else {
            msg.classList.remove('on');
        }
    }

    function clicOption(gid, oid) {
        var f = fiche;
        var gs = groupesVisibles(f);
        var g = gs.find(function (x) { return x.id === gid; });
        if (!g) return;
        if (g.bloque) {
            toast(g.bloque);
            signaler(gs[0] && gs[0].id !== gid ? gs[0].id : gid);
            return;
        }
        var o = g.options.find(function (x) { return x.id === oid; });
        var sel = (f.sel[gid] || []).slice();
        var avant = estComplet(g, f.sel);
        var i = sel.indexOf(oid);
        if (i >= 0) {
            // Un choix unique obligatoire reste coché (on change en touchant un autre)
            if (g.max === 1 && g.min === 1) return;
            sel.splice(i, 1);
        } else if (o.exclusif) {
            sel = [oid];
        } else {
            sel = sel.filter(function (id) { return id !== SANS_SAUCE.id; });
            if (g.max === 1) sel = [oid];
            else if (sel.length >= g.max) {
                toast(g.max + ' choix maximum : retirez-en un d\'abord');
                signaler(gid);
                return;
            } else sel.push(oid);
        }
        if (sel.length) f.sel[gid] = sel; else delete f.sel[gid];
        nettoyer(f);
        dessinerFiche();

        // Groupe obligatoire tout juste complété : on amène le suivant à l'écran
        var g2 = groupesVisibles(f).find(function (x) { return x.id === gid; });
        if (g2 && !avant && g2.min > 0 && estComplet(g2, f.sel)) {
            var suivant = manquants(f)[0];
            if (suivant) setTimeout(function () { montrer(suivant.id, false); }, 120);
        }
    }

    function montrer(gid, alerte) {
        var corps = $('fiche-corps');
        var el = corps.querySelector('.groupe[data-g="' + gid + '"]');
        if (!el) return;
        var haut = el.offsetTop - corps.offsetTop - 12;
        var basVisible = corps.scrollTop + corps.clientHeight;
        if (alerte || haut < corps.scrollTop || el.offsetTop - corps.offsetTop + Math.min(el.offsetHeight, corps.clientHeight * 0.6) > basVisible) {
            corps.scrollTo({ top: Math.max(0, haut), behavior: 'smooth' });
        }
        if (alerte) {
            el.classList.remove('alerte');
            void el.offsetWidth;
            el.classList.add('alerte');
            setTimeout(function () { el.classList.remove('alerte'); }, 1400);
        }
    }
    function signaler(gid) { montrer(gid, true); }

    function quantite(d) {
        if (!fiche) return;
        fiche.qte = Math.max(1, Math.min(20, fiche.qte + d));
        dessinerPiedFiche();
    }

    function validerFiche() {
        var f = fiche;
        if (!f) return;
        var m = manquants(f);
        if (m.length) {
            f.essai = true;
            dessinerPiedFiche();
            signaler(m[0].id);
            return;
        }
        var gs = groupesVisibles(f);
        var l = f.rec.ligne(f.sel, gs);
        var prix = prixUnitaire(f);
        // Filet de sécurité : un prix invalide ne part jamais en caisse
        if (typeof prix !== 'number' || isNaN(prix) || prix <= 0) {
            toast('Produit momentanément indisponible');
            return;
        }
        var ligne = {
            id: nouvelId(),
            product: f.p,
            name: String(l.name).trim(),
            price: prix,
            quantity: f.qte,
            details: l.details.filter(function (x) { return x && String(x).trim(); }).join(' • '),
            selections: copie(f.sel),
            image: f.p.image
        };
        if (f.indexEdition != null && state.cart[f.indexEdition]) {
            ligne.id = state.cart[f.indexEdition].id;
            state.cart[f.indexEdition] = ligne;
            fermerFiche();
            majPanier();
            dessinerPanier();
            toast('Article modifié');
            return;
        }
        // Même article, mêmes choix : on regroupe sur une seule ligne
        var pareil = state.cart.find(function (x) {
            return x.product && x.product.id === ligne.product.id && x.name === ligne.name && x.details === ligne.details && x.price === ligne.price;
        });
        if (pareil) pareil.quantity = Math.min(50, pareil.quantity + ligne.quantity);
        else state.cart.push(ligne);
        fermerFiche();
        majPanier();
        rebond();
        toast((ligne.quantity > 1 ? ligne.quantity + ' × ' : '') + ligne.name + ' ajouté' + (ligne.quantity > 1 ? 's' : ''));
        if ($('upsell').classList.contains('on')) dessinerUpsell();
    }

    function fermerFiche() {
        $('fiche').classList.remove('on');
        fiche = null;
    }

    var compteurId = 0;
    function nouvelId() { compteurId++; return Date.now() * 1000 + (compteurId % 1000); }

    // ------------------------------------------------------------------
    //  Carte des produits
    // ------------------------------------------------------------------
    function produitsDe(catId) {
        if (catId === 'offres') {
            return PRODUCTS.filter(function (p) { return p.featured; })
                .sort(function (a, b) { return (a.featuredPriority || 99) - (b.featuredPriority || 99); });
        }
        return PRODUCTS.filter(function (p) { return p.category === catId; });
    }

    function carteProduit(p, large) {
        var prix = p.sizes ? '<small>dès</small> ' + eur(Math.min.apply(null, p.sizes.map(function (s) { return s.price; }))) : eur(p.price);
        var menu = p.menuPrice && p.price ? 'Menu<br>+' + eur(p.menuPrice - p.price) : '';
        var badge = '';
        if (p.badge) badge = '<div class="badge' + (p.badge === 'ÉPICÉ' ? '' : ' or') + '">' + esc(p.badge) + '</div>';
        var nom = esc(p.displayName || p.name);
        if (large) {
            return '<button class="produit large" data-p="' + p.id + '">' + badge +
                '<div class="photo">' + visuel(p) + '</div>' +
                '<div class="infos"><h3>' + nom + '</h3><p class="desc">' + esc(p.description || '') + '</p>' +
                '<div class="prix-ligne"><span class="prix">' + prix + '</span><span class="menu-plus">' + menu + '</span></div></div>' +
                '<span class="pastille" data-p="' + p.id + '"></span></button>';
        }
        return '<button class="produit" data-p="' + p.id + '">' + badge +
            '<div class="photo">' + visuel(p) + '</div>' +
            '<h3>' + nom + '</h3><p class="desc">' + esc(p.description || p.defaultIngredients || '') + '</p>' +
            '<div class="prix-ligne"><span class="prix">' + prix + '</span><span class="menu-plus">' + menu + '</span></div>' +
            '<span class="pastille" data-p="' + p.id + '"></span></button>';
    }

    function dessinerCarte() {
        var rail = '';
        var carte = '';
        CATEGORIES.forEach(function (c) {
            var ps = produitsDe(c.id);
            if (!ps.length) return;
            var v = VIGNETTES[c.id] || {};
            var vign = v.img ? '<img src="img/' + v.img + '.webp" alt="">' : ICONES[v.icone || 'assiette'];
            rail += '<button class="cat" data-c="' + c.id + '"><div class="vignette">' + vign + '</div><span class="nom-cat">' + esc(c.name) + '</span></button>';

            carte += '<section class="section" id="sec-' + c.id + '" data-c="' + c.id + '">' +
                '<div class="section-tete"><h2>' + esc(c.name) + '</h2><span>' + ps.length + ' produit' + (ps.length > 1 ? 's' : '') + '</span></div>';
            if (c.id === 'menu_etudiant') {
                carte += '<div class="bandeau">' + ICONES.etudiant + '<div><b>Réservé aux étudiants</b><span>Sur présentation de la carte étudiante · en semaine jusqu\'à 15h</span></div></div>';
            } else if (c.id === 'enfant') {
                carte += '<div class="bandeau">' + ICONES.cadeau + '<div><b>Menu enfant 7,00 €</b><span>Frites + Capri-Sun + surprise Kinder inclus</span></div></div>';
            } else if (c.id === 'boxes') {
                carte += '<div class="bandeau">' + ICONES.etoile + '<div><b>Le meilleur deal : 9,90 €</b><span>Ajoutez une canette pour seulement 1,00 €</span></div></div>';
            }
            carte += '<div class="grille">';
            ps.forEach(function (p, i) { carte += carteProduit(p, c.id === 'offres' && i === 0 && p.isCustom); });
            carte += '</div></section>';
        });
        $('rail').innerHTML = rail;
        $('carte').innerHTML = carte;
    }

    var espionCoupe = false;
    var minuterieEspion = null;
    function allerA(catId) {
        var sec = $('sec-' + catId);
        if (!sec) return;
        espionCoupe = true;
        clearTimeout(minuterieEspion);
        minuterieEspion = setTimeout(function () { espionCoupe = false; }, 900);
        $('carte').scrollTo({ top: sec.offsetTop, behavior: 'smooth' });
        activerCat(catId);
    }
    function activerCat(catId) {
        var actif = null;
        document.querySelectorAll('#rail .cat').forEach(function (b) {
            var on = b.getAttribute('data-c') === catId;
            b.classList.toggle('on', on);
            if (on) actif = b;
        });
        if (actif) {
            var rail = $('rail');
            var h = actif.offsetTop - rail.clientHeight / 2 + actif.offsetHeight / 2;
            rail.scrollTo({ top: Math.max(0, h), behavior: 'smooth' });
        }
    }
    function espion() {
        if (typeof IntersectionObserver === 'undefined') return;
        var obs = new IntersectionObserver(function (entrees) {
            if (espionCoupe) return;
            var vues = entrees.filter(function (e) { return e.isIntersecting; })
                .sort(function (a, b) { return a.boundingClientRect.top - b.boundingClientRect.top; });
            if (vues.length) activerCat(vues[0].target.getAttribute('data-c'));
        }, { root: $('carte'), rootMargin: '-8% 0px -82% 0px', threshold: 0 });
        document.querySelectorAll('#carte .section').forEach(function (s) { obs.observe(s); });
    }

    // Pastilles « déjà dans le panier » sur les cartes produit
    function majPastilles() {
        var qte = {};
        state.cart.forEach(function (l) { if (l.product) qte[l.product.id] = (qte[l.product.id] || 0) + l.quantity; });
        document.querySelectorAll('#carte .pastille').forEach(function (el) {
            var n = qte[el.getAttribute('data-p')] || 0;
            if (n) { el.className = 'pastille dans-panier'; el.textContent = n; }
            else { el.className = 'pastille ajout'; el.innerHTML = ICONES.plus; }
        });
    }

    // ------------------------------------------------------------------
    //  Panier
    // ------------------------------------------------------------------
    function totalPanier() {
        return arrondi(state.cart.reduce(function (s, l) { return s + l.price * l.quantity; }, 0));
    }
    function nbArticles() {
        return state.cart.reduce(function (s, l) { return s + l.quantity; }, 0);
    }
    function majPanier() {
        var n = nbArticles();
        $('barre-nb').textContent = n;
        $('barre-nb').style.display = n ? '' : 'none';
        $('barre-total').textContent = eur(totalPanier());
        $('barre-go').classList.toggle('eteint', n === 0);
        majPastilles();
    }
    function rebond() {
        var b = $('barre');
        b.classList.remove('saute');
        void b.offsetWidth;
        b.classList.add('saute');
    }

    function ouvrirPanier() {
        if (!state.cart.length) { toast('Votre panier est vide : choisissez un produit'); return; }
        dessinerPanier();
        $('panier').classList.add('on');
    }
    function fermerPanier() { $('panier').classList.remove('on'); }

    function dessinerPanier() {
        var html = '';
        if (!state.cart.length) {
            html = '<div class="panier-vide">' + ICONES.panier + 'Votre panier est vide</div>';
        }
        state.cart.forEach(function (l, i) {
            var p = l.product || {};
            var modifiable = p.id && recette(p).groupes({}).length > 0;
            html += '<div class="ligne">' +
                '<div class="l-photo">' + (p.id ? visuel(p) : '') + '</div>' +
                '<div class="l-info"><b>' + esc(l.name) + '</b>' +
                (l.details ? '<p>' + esc(l.details.split(' • ').join(' · ')) + '</p>' : '') +
                '<div class="l-actions">' +
                (modifiable ? '<button onclick="B.modifier(' + i + ')">' + ICONES.crayon + 'Modifier</button>' : '') +
                '<button class="suppr" onclick="B.supprimer(' + i + ')">' + ICONES.poubelle + 'Retirer</button>' +
                '</div></div>' +
                '<div class="quantite"><button onclick="B.qteLigne(' + i + ',-1)">' + ICONES.moins + '</button><b>' + l.quantity + '</b>' +
                '<button onclick="B.qteLigne(' + i + ',1)">' + ICONES.plus + '</button></div>' +
                '<div class="l-prix">' + eur(l.price * l.quantity) + '</div></div>';
        });
        $('panier-corps').innerHTML = html;
        var n = nbArticles();
        $('panier-sous').textContent = n + ' article' + (n > 1 ? 's' : '') + ' · ' + (state.mode === 'sur_place' ? 'Sur place' : 'À emporter');
        $('panier-total').textContent = eur(totalPanier());
        $('panier-go').classList.toggle('eteint', !state.cart.length);
    }
    function qteLigne(i, d) {
        var l = state.cart[i];
        if (!l) return;
        l.quantity += d;
        if (l.quantity <= 0) state.cart.splice(i, 1);
        if (l.quantity > 50) l.quantity = 50;
        majPanier();
        dessinerPanier();
    }
    function supprimer(i) {
        state.cart.splice(i, 1);
        majPanier();
        dessinerPanier();
    }
    function modifier(i) {
        var l = state.cart[i];
        if (!l || !l.product) return;
        ouvrir(l.product.id, i);
    }

    // ------------------------------------------------------------------
    //  Suggestions avant validation (une seule fois par commande)
    // ------------------------------------------------------------------
    var SUGGESTIONS = ['tiramisu', 'tarte_daim', 'panini_nutella', 'mozza_6', 'boisson_33', 'frites_simple', 'nuggets_6'];
    var upsellVu = false;
    var upsellIds = [];

    function choisirSuggestions() {
        var dans = {};
        state.cart.forEach(function (l) { if (l.product) dans[l.product.id] = true; });
        var aBoisson = state.cart.some(function (l) {
            return (l.product && l.product.category === 'boissons') || /MENU|Boisson|MÉGA XL/.test(l.details || '') || (l.product && /bucket|etudiant|enfant/.test(l.product.type || ''));
        });
        return SUGGESTIONS.filter(function (id) {
            if (dans[id] || !produit(id)) return false;
            if (id === 'boisson_33' && aBoisson) return false;
            return true;
        }).slice(0, 6);
    }
    function dessinerUpsell() {
        var html = '';
        var ajoute = false;
        upsellIds.forEach(function (id) {
            var p = produit(id);
            var n = 0;
            state.cart.forEach(function (l) { if (l.product && l.product.id === id) n += l.quantity; });
            if (n) ajoute = true;
            var prix = p.sizes ? 'dès ' + eur(Math.min.apply(null, p.sizes.map(function (s) { return s.price; }))) : eur(p.price);
            html += '<button class="sugg' + (n ? ' ajoute' : '') + '" onclick="B.suggestion(\'' + id + '\')">' +
                '<div class="photo">' + visuel(p) + '</div><b>' + esc(p.displayName || p.name) + '</b>' +
                '<span class="prix">' + prix + '</span>' +
                '<span class="plus">' + (n ? 'Ajouté × ' + n : '+ Ajouter') + '</span></button>';
        });
        $('upsell-grille').innerHTML = html;
        $('upsell-total').textContent = eur(totalPanier());
        $('upsell-go').innerHTML = (ajoute ? 'Continuer' : 'Non merci, continuer') + ICONES.droite;
    }
    function suggestion(id) {
        var p = produit(id);
        if (!p) return;
        if (recette(p).groupes({}).length) { ouvrir(id); return; }
        state.cart.push({ id: nouvelId(), product: p, name: p.name, price: p.price, quantity: 1, details: p.defaultIngredients || '', selections: {}, image: p.image });
        majPanier();
        dessinerUpsell();
        toast(p.name + ' ajouté');
    }
    function commander() {
        if (!state.cart.length) return;
        fermerPanier();
        if (!upsellVu) {
            upsellVu = true;
            upsellIds = choisirSuggestions();
            if (upsellIds.length) {
                dessinerUpsell();
                $('upsell').classList.add('on');
                return;
            }
        }
        versPrenom();
    }

    // ------------------------------------------------------------------
    //  Prénom + validation
    // ------------------------------------------------------------------
    var prenom = '';
    var PRENOM_MAX = 12;

    function versPrenom() {
        if (!state.cart.length) return;
        $('upsell').classList.remove('on');
        fermerPanier();
        afficher('prenom');
        dessinerPrenom();
    }
    function retourPanier() {
        afficher('app');
        ouvrirPanier();
    }
    function construireClavier() {
        var rangs = ['AZERTYUIOP', 'QSDFGHJKLM', 'WXCVBN-'];
        var html = '';
        rangs.forEach(function (r) {
            html += '<div class="rang">';
            r.split('').forEach(function (c) { html += '<button class="touche" data-t="' + c + '">' + c + '</button>'; });
            html += '</div>';
        });
        html += '<div class="rang"><button class="touche large" data-t=" ">Espace</button>' +
            '<button class="touche efface" data-t="efface">' + ICONES.efface + '</button></div>';
        $('clavier').innerHTML = html;
        $('clavier').addEventListener('click', function (e) {
            var b = e.target.closest('.touche');
            if (!b) return;
            var t = b.getAttribute('data-t');
            if (t === 'efface') prenom = prenom.slice(0, -1);
            else if (prenom.length < PRENOM_MAX) {
                if (t === ' ' && (!prenom.length || prenom.slice(-1) === ' ')) return;
                prenom += t;
            }
            dessinerPrenom();
        });
    }
    function dessinerPrenom() {
        $('prenom-saisie').innerHTML = prenom.length
            ? esc(prenom) + '<span class="curseur"></span>'
            : '<span class="vide">Touchez les lettres ci-dessous</span>';
        var ok = prenom.trim().length > 0;
        var b = $('prenom-go');
        b.classList.toggle('eteint', !ok);
        b.innerHTML = 'Valider ma commande · ' + eur(totalPanier()) + ICONES.coche;
    }

    var envoiEnCours = false;
    function validerCommande() {
        if (envoiEnCours) return;               // pas de double impression sur double toucher
        if (!prenom.trim()) { toast('Écrivez votre prénom pour valider'); return; }
        if (!state.cart.length) { afficher('app'); return; }
        envoiEnCours = true;
        state.prenom = prenom.trim();
        // ↓ tickets.js : enregistrement, impression des 2 tickets, écran merci,
        //   puis resetKiosk() au bout de 8 secondes — inchangé.
        validateOrder();
    }

    // ------------------------------------------------------------------
    //  Écrans, mode, abandon, inactivité
    // ------------------------------------------------------------------
    var ecranCourant = 'accueil';
    function afficher(id) {
        ['accueil', 'mode', 'app', 'prenom'].forEach(function (e) { $(e).classList.toggle('on', e === id); });
        if (id === 'prenom') $('app').classList.remove('on');
        ecranCourant = id;
        $('toast').classList.remove('show');
        var v = $('video-accueil');
        if (v) {
            if (id === 'accueil') { try { var pr = v.play(); if (pr && pr.catch) pr.catch(function () {}); } catch (e) {} }
            else { try { v.pause(); } catch (e) {} }
        }
        dernierGeste = Date.now();
    }
    function commencer() { afficher('mode'); }
    function choisirMode(m) {
        state.mode = m;
        $('puce-mode').textContent = m === 'sur_place' ? 'SUR PLACE' : 'À EMPORTER';
        afficher('app');
        $('carte').scrollTop = 0;
        activerCat(CATEGORIES[0].id);
    }
    function changerMode() {
        choisirMode(state.mode === 'sur_place' ? 'emporter' : 'sur_place');
        toast(state.mode === 'sur_place' ? 'Commande sur place' : 'Commande à emporter');
    }
    function ouvrirAbandon() { $('cancel-modal').classList.add('on'); }
    function fermerAbandon() { $('cancel-modal').classList.remove('on'); }

    var DELAI_INACTIF = 90000;     // 90 s sans toucher l'écran...
    var DELAI_COMPTE = 20;         // ...puis 20 s pour répondre
    var dernierGeste = Date.now();
    var compte = null;
    function geste() {
        dernierGeste = Date.now();
    }
    function surveiller() {
        var confirmation = $('screen-confirm').classList.contains('active') || $('screen-thanks').classList.contains('active');
        var admin = $('admin-modal').classList.contains('active') || $('history-modal').classList.contains('active');
        if (ecranCourant === 'accueil' || confirmation || admin) { arreterCompte(); return; }
        if (compte === null && Date.now() - dernierGeste > DELAI_INACTIF) {
            compte = DELAI_COMPTE;
            $('inactif-compte').textContent = compte;
            $('inactif').classList.add('on');
        } else if (compte !== null) {
            compte--;
            $('inactif-compte').textContent = Math.max(0, compte);
            if (compte <= 0) resetKiosk();
        }
    }
    function arreterCompte() {
        compte = null;
        $('inactif').classList.remove('on');
    }
    function resterLa() {
        arreterCompte();
        geste();
    }

    function toast(msg) {
        var t = $('toast');
        t.textContent = msg;
        t.classList.remove('show');
        void t.offsetWidth;
        t.classList.add('show');
        clearTimeout(toast.minuterie);
        toast.minuterie = setTimeout(function () { t.classList.remove('show'); }, 2200);
    }

    function remiseAZero() {
        clearTimeout(window.__autoResetTimeout);
        state.prenom = '';
        state.mode = '';
        state.cart = [];
        prenom = '';
        fiche = null;
        upsellVu = false;
        envoiEnCours = false;
        ['fiche', 'panier', 'upsell', 'cancel-modal', 'inactif'].forEach(function (id) { $(id).classList.remove('on'); });
        $('screen-confirm').classList.remove('active');
        $('screen-thanks').classList.remove('active');
        compte = null;
        majPanier();
        $('carte').scrollTop = 0;
        afficher('accueil');
    }

    // ------------------------------------------------------------------
    //  Démarrage
    // ------------------------------------------------------------------
    function demarrer() {
        remplirIcones(document);
        dessinerCarte();
        espion();
        construireClavier();
        majPanier();

        $('rail').addEventListener('click', function (e) {
            var b = e.target.closest('.cat');
            if (b) allerA(b.getAttribute('data-c'));
        });
        $('carte').addEventListener('click', function (e) {
            var b = e.target.closest('.produit');
            if (b) ouvrir(b.getAttribute('data-p'));
        });
        $('fiche-corps').addEventListener('click', function (e) {
            var b = e.target.closest('.opt');
            if (b && fiche) clicOption(b.getAttribute('data-g'), b.getAttribute('data-o'));
        });
        // Toucher le fond sombre ferme la fenêtre (comme le bouton ✕)
        $('fiche').addEventListener('click', function (e) { if (e.target === $('fiche')) fermerFiche(); });
        $('panier').addEventListener('click', function (e) { if (e.target === $('panier')) fermerPanier(); });

        // Accueil : toucher n'importe où pour commencer
        $('accueil').addEventListener('click', function () { commencer(); });

        // Menu admin caché : 5 touchers rapides sur le logo (handleSecretClick, tickets.js).
        // Sur l'accueil, un toucher isolé sur le logo lance quand même la commande.
        var attenteLogo = null;
        var adminVu = false;
        $('logo-accueil').addEventListener('click', function (e) {
            e.stopPropagation();
            handleSecretClick();
            if ($('admin-modal').classList.contains('active')) adminVu = true;
            clearTimeout(attenteLogo);
            attenteLogo = setTimeout(function () {
                // Le menu admin ne s'est pas ouvert = c'est un client : on lance la commande.
                if (!adminVu && !$('admin-modal').classList.contains('active') && ecranCourant === 'accueil') commencer();
                adminVu = false;
            }, 1700);
        });
        ['logo-mode', 'logo-tete', 'logo-prenom'].forEach(function (id) {
            $(id).addEventListener('click', function () { handleSecretClick(); });
        });

        // Numéro de version sous le menu admin
        var version = document.createElement('div');
        version.className = 'version-borne';
        version.textContent = 'Version de la borne : ' + VERSION_BORNE;
        ($('admin-modal').firstElementChild || $('admin-modal')).appendChild(version);

        ['pointerdown', 'touchstart', 'mousedown', 'keydown', 'wheel'].forEach(function (ev) {
            document.addEventListener(ev, geste, { passive: true, capture: true });
        });
        $('carte').addEventListener('scroll', function () {
            geste();
            // Tout en bas de la carte, la dernière catégorie est forcément celle affichée
            var c = $('carte');
            if (!espionCoupe && c.scrollTop + c.clientHeight >= c.scrollHeight - 4) {
                var secs = c.querySelectorAll('.section');
                if (secs.length) activerCat(secs[secs.length - 1].getAttribute('data-c'));
            }
        }, { passive: true });
        $('fiche-corps').addEventListener('scroll', geste, { passive: true });
        setInterval(surveiller, 1000);

        afficher('accueil');
        // La borne n'est déclarée prête que si l'impression ET le menu admin (MISE À JOUR)
        // sont bien chargés. Sinon le filet de sécurité d'index.html bascule sur
        // l'ancienne borne, qui garde toujours son propre menu admin.
        // Même chose si la feuille de style n'a pas été appliquée (accueil pas en plein écran).
        var accueil = $('accueil');
        var styleOk = window.getComputedStyle(accueil).position === 'fixed' &&
            accueil.offsetWidth >= window.innerWidth - 2 && accueil.offsetHeight >= window.innerHeight - 2;
        if (styleOk &&
            typeof validateOrder === 'function' && typeof generateTicketHTML === 'function' &&
            typeof handleSecretClick === 'function' && typeof adminUpdateRestart === 'function' &&
            $('admin-modal')) {
            window.BORNE_PRETE = true;
        }
    }

    return {
        demarrer: demarrer,
        remiseAZero: remiseAZero,
        toast: toast,
        commencer: commencer,
        choisirMode: choisirMode,
        changerMode: changerMode,
        ouvrir: ouvrir,
        fermerFiche: fermerFiche,
        quantite: quantite,
        validerFiche: validerFiche,
        ouvrirPanier: ouvrirPanier,
        fermerPanier: fermerPanier,
        qteLigne: qteLigne,
        supprimer: supprimer,
        modifier: modifier,
        commander: commander,
        suggestion: suggestion,
        versPrenom: versPrenom,
        retourPanier: retourPanier,
        validerCommande: validerCommande,
        ouvrirAbandon: ouvrirAbandon,
        fermerAbandon: fermerAbandon,
        resterLa: resterLa,
        // Pour les tests automatiques
        _recette: recette,
        _prix: function (id, sel) { var p = produit(id); var r = recette(p); var f = { p: p, rec: r, sel: copie(sel), qte: 1 }; nettoyer(f); return prixUnitaire(f); },
        _ligne: function (id, sel) { var p = produit(id); var r = recette(p); var f = { p: p, rec: r, sel: copie(sel), qte: 1 }; nettoyer(f); var l = r.ligne(f.sel, groupesVisibles(f)); return { name: l.name, details: l.details.filter(function (x) { return x && String(x).trim(); }).join(' • '), manque: manquants(f).map(function (g) { return g.id; }) }; },
        _fiche: function () { return fiche; },
        _vieillir: function (ms) { dernierGeste -= ms; }
    };
})();

// Fonctions globales attendues par tickets.js
function showToast(message) { B.toast(message); }
function resetKiosk() { B.remiseAZero(); }

B.demarrer();

// ============================================================================
//  SYSTÈME DES TICKETS — Les Délices de l'Inde
//  ⚠️  NE PAS MODIFIER CE FICHIER.
//
//  Copie STRICTEMENT IDENTIQUE (au caractère près) du code d'impression,
//  d'historique et du menu admin de l'ancienne borne (commit 80edf0a,
//  kiosk/index.html). Il a été sorti tel quel lors de la refonte du
//  18/10/2026 pour que la nouvelle interface ne puisse pas y toucher.
//
//  Ce que la nouvelle interface (borne.js) doit fournir à ce fichier :
//   - la variable globale `state` : { prenom, mode: 'sur_place'|'emporter', cart }
//   - chaque ligne du panier : { name, quantity, price, details: 'a • b • c' }
//   - les fonctions showToast(message) et resetKiosk()
//   - les éléments #screen-confirm, #confirm-name, #screen-thanks, #thank-name,
//     #admin-modal, #history-modal, #history-content, #printer-mode-label,
//     #btn-printer-mode, #toast
// ============================================================================

        // ============ CONFIGURATION IMPRIMANTES ============
        // IMPORTANT: Modifier ces noms pour correspondre aux noms exacts dans Windows
        // Pour trouver les noms: Paramètres → Imprimantes → voir le nom exact
        const PRINTER_CONFIG = {
            // Imprimante CLIENT (Epson TM-M30II) - doit être l'imprimante par défaut Windows
            client: {
                name: 'EPSON TM-m30II receipt',
                ip: '192.168.1.200'
            },
            // Imprimante CUISINE (Star MCP31)
            kitchen: {
                name: 'Star MCP31',
                ip: '192.168.1.149'
            },
            // Mode: 'dual' = 2 imprimantes, 'single' = tout sur défaut
            mode: 'dual'
        };

        // ============ IMPRESSION ============
        // 2 tickets séparés sur Star (imprimante par défaut)
        async function printDualTickets(clientTicket, kitchenTicket) {
            console.log('Impression: 2 tickets sur Star');

            // 1. Ticket CUISINE
            printTicket(kitchenTicket);
            showToast('Ticket CUISINE imprimé');

            // 2. Ticket CLIENT (après délai)
            setTimeout(() => {
                printTicket(clientTicket);
                showToast('Ticket CLIENT imprimé');
            }, 2500);
        }

        // Fonctions placeholder (boutons admin désactivés)
        function listQZPrinters() {
            alert('QZ Tray désactivé');
        }
        function installQZv2() {
            alert('QZ Tray désactivé');
        }

        // Envoyer ticket client à Epson via ePOS
        async function printToEpsonePOS(htmlContent) {
            const ip = PRINTER_CONFIG.client.ip;

            try {
                // Créer le XML ePOS pour Epson
                const eposXml = `<?xml version="1.0" encoding="utf-8"?>
<s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/">
    <s:Body>
        <epos-print xmlns="http://www.epson-pos.com/schemas/2011/03/epos-print">
            <text lang="fr" smooth="true"/>
            <text>${escapeXml(stripHtmlToText(htmlContent))}</text>
            <feed line="4"/>
            <cut type="feed"/>
        </epos-print>
    </s:Body>
</s:Envelope>`;

                const response = await fetch(`http://${ip}/cgi-bin/epos/service.cgi`, {
                    method: 'POST',
                    mode: 'no-cors',
                    headers: {
                        'Content-Type': 'text/xml; charset=utf-8',
                        'SOAPAction': '""'
                    },
                    body: eposXml
                });

                console.log('✓ Ticket client envoyé à Epson ' + ip);
                showToast('Ticket CLIENT → Epson');
                return true;
            } catch (error) {
                console.error('Erreur Epson ePOS:', error);
                showToast('Erreur Epson - fallback Star');
                return false;
            }
        }

        // Convertir HTML en texte simple pour ePOS
        function stripHtmlToText(html) {
            const div = document.createElement('div');
            div.innerHTML = html;
            return div.textContent || div.innerText || '';
        }

        // Envoyer ticket cuisine à Star via WebPRNT (fonctionne depuis localhost)
        async function printToStarWebPRNT(htmlContent) {
            const ip = PRINTER_CONFIG.kitchen.ip;

            // Convertir HTML en texte formaté pour imprimante thermique
            const textContent = convertHtmlToStarText(htmlContent);

            // Commandes ESC/POS pour Star
            const xmlContent = `<?xml version="1.0" encoding="utf-8"?>
<starxml version="1.0">
    <print>
        <text font="1" size="normal" align="center" style="bold">================================</text>
        ${textContent}
        <text font="1" size="normal" align="center">================================</text>
        <feed line="3"/>
        <cut type="partial"/>
    </print>
</starxml>`;

            try {
                const response = await fetch(`http://${ip}/StarWebPRNT/SendMessage`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'text/xml; charset=utf-8' },
                    body: xmlContent
                });

                if (response.ok) {
                    console.log('✓ Ticket cuisine envoyé à Star ' + ip);
                    showToast('Ticket cuisine imprimé !');
                } else {
                    throw new Error('Réponse: ' + response.status);
                }
            } catch (error) {
                console.error('Erreur Star WebPRNT:', error);
                showToast('Erreur Star - vérifier connexion');
                // PAS de fallback pour éviter d'imprimer en double sur Epson
            }
        }

        // Convertir HTML ticket cuisine en texte Star
        function convertHtmlToStarText(htmlContent) {
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = htmlContent;

            let starXml = '';

            // Nom du client
            const clientName = tempDiv.querySelector('.client-name');
            const orderType = tempDiv.querySelector('.order-type');
            if (clientName) {
                starXml += `<text font="1" size="double" align="center" style="bold">${escapeXml(clientName.textContent)}</text>`;
            }
            if (orderType) {
                starXml += `<text font="1" size="normal" align="center">${escapeXml(orderType.textContent)}</text>`;
            }
            starXml += `<text font="1" size="normal" align="center">--------------------------------</text>`;

            // Articles
            const items = tempDiv.querySelectorAll('.kitchen-item');
            items.forEach(item => {
                const header = item.querySelector('.kitchen-item-header');
                if (header) {
                    starXml += `<text font="1" size="large" style="bold">${escapeXml(header.textContent)}</text>`;
                }

                const details = item.querySelectorAll('.kitchen-item-detail');
                details.forEach(d => {
                    starXml += `<text font="1" size="normal">  ${escapeXml(d.textContent)}</text>`;
                });
                starXml += `<feed line="1"/>`;
            });

            // Heure
            const time = tempDiv.querySelector('.kitchen-time');
            if (time) {
                starXml += `<text font="1" size="normal" align="center">--------------------------------</text>`;
                starXml += `<text font="1" size="normal" align="center">${escapeXml(time.textContent)}</text>`;
            }

            return starXml;
        }

        // Fonction pour envoyer à l'imprimante Star via WebSocket/HTTP
        async function printToStarKitchen(htmlContent) {
            const ip = PRINTER_CONFIG.kitchen.ip;

            // Convertir HTML en texte simple pour la cuisine
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = htmlContent;

            // Extraire le texte brut avec formatage basique
            let textContent = '';

            // Bande nom
            const clientName = tempDiv.querySelector('.client-name');
            const orderType = tempDiv.querySelector('.order-type');
            if (clientName) textContent += '\n' + '='.repeat(32) + '\n';
            if (clientName) textContent += '   ' + clientName.textContent + '\n';
            if (orderType) textContent += '   ' + orderType.textContent + '\n';
            if (clientName) textContent += '='.repeat(32) + '\n\n';

            // Articles
            const items = tempDiv.querySelectorAll('.kitchen-item');
            items.forEach(item => {
                const header = item.querySelector('.kitchen-item-header');
                if (header) textContent += header.textContent + '\n';

                const details = item.querySelectorAll('.kitchen-item-detail');
                details.forEach(d => {
                    textContent += '  ' + d.textContent + '\n';
                });
                textContent += '\n';
            });

            // Heure
            const time = tempDiv.querySelector('.kitchen-time');
            if (time) textContent += '-'.repeat(32) + '\n' + time.textContent + '\n';

            textContent += '\n\n\n';  // Espace avant coupe

            // Essayer d'envoyer via Star WebPRNT
            try {
                const xmlContent = `<?xml version="1.0" encoding="utf-8"?>
                <StarWebPrint xmlns="http://www.star-m.jp/StarWebPRNT">
                <Request>
                    <SetEncoding name="UTF-8"/>
                    <Text scale="2x2">${escapeXml(textContent)}</Text>
                    <CutPaper feed="true"/>
                </Request>
                </StarWebPrint>`;

                await fetch(`http://${ip}/StarWebPRNT/SendMessage`, {
                    method: 'POST',
                    mode: 'no-cors',
                    headers: { 'Content-Type': 'text/xml; charset=utf-8' },
                    body: xmlContent
                });
                console.log('✓ Ticket cuisine envoyé à Star ' + ip);
            } catch (error) {
                console.error('Erreur Star WebPRNT:', error);
                // PAS de fallback pour éviter d'imprimer en double sur Epson
            }
        }

        function escapeXml(text) {
            return text.replace(/&/g, '&amp;')
                       .replace(/</g, '&lt;')
                       .replace(/>/g, '&gt;')
                       .replace(/"/g, '&quot;')
                       .replace(/'/g, '&apos;');
        }

        // Fonction pour envoyer à l'imprimante Epson via ePOS
        async function printToEpsonClient(htmlContent) {
            const ip = PRINTER_CONFIG.client.ip;

            // Convertir HTML en texte simple pour le ticket
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = htmlContent;

            let textLines = [];

            // Header
            textLines.push({ text: "DÉLICES DE L'INDE", align: 'center', bold: true, size: 2 });
            textLines.push({ text: '31 Bd Charles de Gaulle', align: 'center', size: 1 });
            textLines.push({ text: '31800 Saint-Gaudens', align: 'center', size: 1 });
            textLines.push({ text: '', size: 1 });

            // Nom client et mode
            const clientName = tempDiv.querySelector('.client-name');
            const orderType = tempDiv.querySelector('.order-type');
            if (clientName) {
                textLines.push({ text: '================================', align: 'center', size: 1 });
                textLines.push({ text: clientName.textContent.toUpperCase(), align: 'center', bold: true, size: 2 });
            }
            if (orderType) {
                textLines.push({ text: orderType.textContent, align: 'center', bold: true, size: 1 });
            }
            textLines.push({ text: '================================', align: 'center', size: 1 });
            textLines.push({ text: '', size: 1 });

            // Articles
            const items = tempDiv.querySelectorAll('.item');
            items.forEach(item => {
                const name = item.querySelector('.item-name');
                const price = item.querySelector('.item-price');
                if (name && price) {
                    textLines.push({ text: name.textContent + '  ' + price.textContent, align: 'left', size: 1 });
                }
            });

            // Total
            const total = tempDiv.querySelector('.total-price');
            if (total) {
                textLines.push({ text: '', size: 1 });
                textLines.push({ text: '--------------------------------', align: 'center', size: 1 });
                textLines.push({ text: 'TOTAL: ' + total.textContent, align: 'right', bold: true, size: 2 });
                textLines.push({ text: '--------------------------------', align: 'center', size: 1 });
            }

            textLines.push({ text: '', size: 1 });
            textLines.push({ text: 'Bon appétit !', align: 'center', bold: true, size: 1 });
            textLines.push({ text: '', size: 1 });

            // Construire XML ePOS
            let eposCommands = '';
            textLines.forEach(line => {
                const align = line.align === 'center' ? 'center' : line.align === 'right' ? 'right' : 'left';
                const height = line.size || 1;
                const width = line.size || 1;
                const bold = line.bold ? 'true' : 'false';
                eposCommands += `<text align="${align}" dw="${width > 1}" dh="${height > 1}" em="${bold}">${escapeXml(line.text)}&#10;</text>`;
            });

            const xmlContent = `<?xml version="1.0" encoding="utf-8"?>
            <s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/">
                <s:Body>
                    <epos-print xmlns="http://www.epson-pos.com/schemas/2011/03/epos-print">
                        ${eposCommands}
                        <feed unit="24"/>
                        <cut type="feed"/>
                    </epos-print>
                </s:Body>
            </s:Envelope>`;

            try {
                await fetch(`http://${ip}/cgi-bin/epos/service.cgi?devid=local_printer&timeout=10000`, {
                    method: 'POST',
                    mode: 'no-cors',
                    headers: { 'Content-Type': 'text/xml; charset=utf-8' },
                    body: xmlContent
                });
                console.log('✓ Ticket client envoyé à Epson ' + ip);
            } catch (error) {
                console.error('Erreur Epson ePOS:', error);
                // Fallback: impression via fenêtre popup
                printTicket(htmlContent);
            }
        }

        // ============ VALIDATION & RESET ============
        function validateOrder() {
            document.getElementById('confirm-name').textContent = state.prenom.toUpperCase() + " !";
            document.getElementById('screen-confirm').classList.add('active');

            // Sauvegarder la commande dans l'historique AVANT d'imprimer
            saveOrderToHistory();

            setTimeout(async () => {
                const tickets = generateTicketHTML();

                // Imprimer sur 2 imprimantes: Epson (client) + Star (cuisine)
                await printDualTickets(tickets.client, tickets.kitchen);

                document.getElementById('screen-confirm').classList.remove('active');
                document.getElementById('thank-name').textContent = state.prenom.toUpperCase();
                document.getElementById('screen-thanks').classList.add('active');

                // Auto-reset après 8 secondes pour revenir à l'écran d'accueil
                clearTimeout(window.__autoResetTimeout);
                window.__autoResetTimeout = setTimeout(() => {
                    resetKiosk();
                }, 8000);
            }, 500);
        }

        // ============ HISTORIQUE DES COMMANDES ============
        function saveOrderToHistory() {
            // L'historique est un CONFORT (menu admin), pas une fonction vitale.
            // Il est appelé juste avant l'impression : si localStorage est plein,
            // corrompu ou inaccessible, une exception ici empêcherait l'impression
            // de toutes les commandes suivantes -> service à l'arrêt.
            // On isole donc totalement cette étape.
            try {
            const now = new Date();
            const order = {
                id: Date.now(),
                prenom: state.prenom,
                mode: state.mode,
                date: now.toLocaleDateString('fr-FR'),
                time: now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
                cart: JSON.parse(JSON.stringify(state.cart)),
                total: state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
            };

            // Récupérer l'historique existant
            let history = [];
            try {
                history = JSON.parse(localStorage.getItem('delices_inde_orders') || '[]');
                if (!Array.isArray(history)) history = [];
            } catch (e) {
                console.warn('[borne] historique illisible, réinitialisé');
                history = [];
            }

            // Ajouter la nouvelle commande au début
            history.unshift(order);

            // Garder seulement les 20 dernières commandes
            history = history.slice(0, 20);

            // Sauvegarder
            localStorage.setItem('delices_inde_orders', JSON.stringify(history));
            } catch (e) {
                // On n'interrompt JAMAIS la commande pour un problème d'historique.
                console.warn('[borne] historique non enregistré :', e && e.message);
            }
        }

        function lireHistorique() {
            try {
                const h = JSON.parse(localStorage.getItem('delices_inde_orders') || '[]');
                return Array.isArray(h) ? h : [];
            } catch (e) {
                console.warn('[borne] historique illisible');
                return [];
            }
        }

        function showOrderHistory() {
            closeAdminModal();

            const history = lireHistorique();
            const content = document.getElementById('history-content');

            if (history.length === 0) {
                content.innerHTML = '<div style="text-align: center; color: var(--text-dim); padding: 40px; font-size: 20px;">Aucune commande enregistrée</div>';
            } else {
                let html = '';
                history.slice(0, 10).forEach((order, index) => {
                    const modeLabel = order.mode === 'sur_place' ? 'SUR PLACE' : 'EMPORTER';
                    html += `
                        <div style="background: var(--glass); border: 1px solid var(--border); border-radius: 12px; padding: 15px; margin-bottom: 12px; ${index === 0 ? 'border-color: var(--yellow);' : ''}">
                            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                                <div>
                                    <span style="font-family: 'Anton', sans-serif; font-size: 20px; color: var(--yellow);">${order.prenom.toUpperCase()}</span>
                                    <span style="color: var(--text-dim); font-size: 14px; margin-left: 10px;">${modeLabel}</span>
                                </div>
                                <div style="text-align: right;">
                                    <div style="font-size: 14px; color: var(--text-dim);">${order.date} ${order.time}</div>
                                    <div style="font-family: 'Anton', sans-serif; font-size: 22px; color: #00cc66;">${order.total.toFixed(2)}€</div>
                                </div>
                            </div>
                            <div style="font-size: 14px; color: var(--text);">
                                ${order.cart.map(item => `${item.quantity}x ${item.name}`).join(' • ')}
                            </div>
                            <button onclick="reprintOrder(${order.id})" style="margin-top: 10px; background: rgba(255,192,0,0.15); border: 1px solid var(--yellow); border-radius: 8px; padding: 8px 15px; font-family: 'Anton', sans-serif; font-size: 14px; color: var(--yellow); cursor: pointer;">
                                REIMPRIMER
                            </button>
                        </div>
                    `;
                });
                content.innerHTML = html;
            }

            document.getElementById('history-modal').classList.add('active');
        }

        function closeHistoryModal() {
            document.getElementById('history-modal').classList.remove('active');
        }

        function reprintLastOrder() {
            const history = lireHistorique();
            if (history.length === 0) {
                showToast('Aucune commande à réimprimer');
                return;
            }
            reprintOrder(history[0].id);
        }

        function reprintOrder(orderId) {
            const history = lireHistorique();
            const order = history.find(o => o.id === orderId);

            if (!order) {
                showToast('Commande introuvable');
                return;
            }

            // Recréer temporairement l'état pour générer les tickets
            const savedState = { prenom: state.prenom, mode: state.mode, cart: state.cart };
            state.prenom = order.prenom;
            state.mode = order.mode;
            state.cart = order.cart;

            const tickets = generateTicketHTML();

            // Restaurer l'état original
            state.prenom = savedState.prenom;
            state.mode = savedState.mode;
            state.cart = savedState.cart;

            // Imprimer les 2 tickets sur les 2 imprimantes
            showToast('Réimpression en cours...');
            closeHistoryModal();
            printDualTickets(tickets.client, tickets.kitchen);
        }

        function printTicket(htmlContent) {
            const printWindow = window.open('', 'PRINT_TICKET', 'width=350,height=900');

            if (!printWindow) {
                showToast('Erreur: popup bloqué');
                return;
            }

            // CSS optimisé pour Star mCPrint3 - Ticket client lisible, ticket cuisine compact
            const ticketStyles = `
                @page {
                    size: 80mm auto;
                    margin: 0;
                }
                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                    -webkit-print-color-adjust: exact !important;
                    print-color-adjust: exact !important;
                    color-adjust: exact !important;
                }
                html, body {
                    width: 80mm;
                    font-family: 'Arial', 'Helvetica', sans-serif;
                    font-size: 12pt;
                    line-height: 1.3;
                    color: #000;
                    background: #fff;
                }
                .ticket {
                    width: 76mm;
                    padding: 2mm;
                    page-break-after: always;
                }
                .ticket:last-child {
                    page-break-after: auto;
                }

                /* Header - Ticket Client */
                .header {
                    text-align: center;
                    padding: 3mm 0;
                    border-bottom: 2px solid #000;
                }
                .logo {
                    font-size: 24pt;
                    font-weight: 900;
                    letter-spacing: 2px;
                }
                .address {
                    font-size: 9pt;
                    margin-top: 2mm;
                    line-height: 1.4;
                }

                /* Bande noire - Ticket Client */
                .black-band {
                    background: #000 !important;
                    color: #fff !important;
                    padding: 2mm 2mm;
                    margin: 2mm 0;
                    text-align: center;
                }
                .client-name {
                    font-size: 16pt;
                    font-weight: 700;
                    text-transform: uppercase;
                }
                .order-type {
                    font-size: 11pt;
                    font-weight: 700;
                    margin-top: 1mm;
                    padding: 1mm 3mm;
                    border: 1px solid #fff;
                    display: inline-block;
                }

                /* Date/heure */
                .datetime {
                    text-align: center;
                    font-size: 11pt;
                    padding: 2mm 0;
                    border-bottom: 1px dashed #000;
                }

                /* Articles - Ticket Client */
                .items {
                    padding: 3mm 0;
                }
                .item {
                    margin-bottom: 3mm;
                    padding-bottom: 2mm;
                    border-bottom: 1px dotted #ccc;
                }
                .item:last-child {
                    border-bottom: none;
                }
                .item-row {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                }
                .item-name {
                    font-size: 13pt;
                    font-weight: 700;
                    flex: 1;
                }
                .item-price {
                    font-size: 13pt;
                    font-weight: 700;
                    text-align: right;
                    min-width: 50px;
                }
                .item-details {
                    font-size: 10pt;
                    color: #333;
                    padding-left: 3mm;
                    margin-top: 1mm;
                    font-style: italic;
                }

                /* Totaux - Ticket Client */
                .totals {
                    border-top: 2px solid #000;
                    padding-top: 3mm;
                    margin-top: 2mm;
                }
                .total-row {
                    display: flex;
                    justify-content: space-between;
                    font-size: 11pt;
                    padding: 1mm 0;
                }
                .total-final {
                    font-size: 16pt;
                    font-weight: 900;
                    border-top: 1px solid #000;
                    margin-top: 2mm;
                    padding-top: 2mm;
                }

                /* Footer - Ticket Client */
                .footer {
                    text-align: center;
                    padding: 3mm 0;
                    border-top: 2px solid #000;
                    margin-top: 3mm;
                }
                .merci {
                    font-size: 14pt;
                    font-weight: 700;
                }
                .legal {
                    font-size: 8pt;
                    color: #666;
                    margin-top: 2mm;
                }

                /* ========== TICKET CUISINE ========== */
                .kitchen .black-band {
                    padding: 3mm 2mm;
                }
                .kitchen .client-name {
                    font-size: 18pt;
                }
                .kitchen .order-type {
                    font-size: 11pt;
                    padding: 1mm 2mm;
                    border: 1px solid #fff;
                    margin-top: 1mm;
                }
                .kitchen-item {
                    border: 1px solid #000;
                    padding: 2mm;
                    margin-bottom: 2mm;
                }
                .kitchen-item-header {
                    font-size: 14pt;
                    font-weight: 900;
                    text-transform: uppercase;
                    border-bottom: 1px dashed #000;
                    padding-bottom: 1mm;
                    margin-bottom: 1mm;
                }
                .kitchen-item-detail {
                    font-size: 11pt;
                    padding-left: 2mm;
                    line-height: 1.4;
                }
                .kitchen-time {
                    text-align: center;
                    font-size: 11pt;
                    font-weight: 700;
                    padding: 2mm;
                    border-top: 1px solid #000;
                    margin-top: 2mm;
                }

                /* Espacement fin de ticket */
                .cut-space {
                    height: 10mm;
                }
                .kitchen .cut-space {
                    height: 5mm;
                }
            `;

            const ticketPage = '<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Ticket</title><style>' +
                ticketStyles + '</style></head><body>' + htmlContent + '</body></html>';

            printWindow.document.write(ticketPage);
            printWindow.document.close();

            printWindow.onload = function () {
                setTimeout(function () {
                    printWindow.print();
                    setTimeout(function () { printWindow.close(); }, 3000);
                }, 500);
            };
        }

        function generateTicketHTML() {
            const total = state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            const tva = total * 0.10;
            const ht = total - tva;
            const mode = state.mode === 'sur_place' ? 'SUR PLACE' : 'À EMPORTER';
            const now = new Date();
            const date = now.toLocaleDateString('fr-FR');
            const time = now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

            // ========== TICKET CLIENT ==========
            let client = '<div class="ticket">';

            // Header
            client += '<div class="header">';
            client += '<div class="logo">DÉLICES DE L\'INDE</div>';
            client += '<div class="address">31 Bd Charles de Gaulle<br>31800 Saint-Gaudens</div>';
            client += '</div>';

            // Bande noire avec nom
            client += '<div class="black-band">';
            client += '<div class="client-name">' + state.prenom.toUpperCase() + '</div>';
            client += '<div class="order-type">' + mode + '</div>';
            client += '</div>';

            // Date/heure
            client += '<div class="datetime">' + date + ' à ' + time + '</div>';

            // Articles
            client += '<div class="items">';
            state.cart.forEach(item => {
                client += '<div class="item">';
                client += '<div class="item-row">';
                client += '<span class="item-name">' + item.quantity + 'x ' + item.name + '</span>';
                client += '<span class="item-price">' + (item.price * item.quantity).toFixed(2) + '€</span>';
                client += '</div>';
                if (item.details) {
                    client += '<div class="item-details">' + item.details + '</div>';
                }
                client += '</div>';
            });
            client += '</div>';

            // Totaux
            client += '<div class="totals">';
            client += '<div class="total-row"><span>Sous-total HT</span><span>' + ht.toFixed(2) + '€</span></div>';
            client += '<div class="total-row"><span>TVA 10%</span><span>' + tva.toFixed(2) + '€</span></div>';
            client += '<div class="total-row total-final"><span>TOTAL</span><span>' + total.toFixed(2) + '€</span></div>';
            client += '</div>';

            // Footer
            client += '<div class="footer">';
            client += '<div class="merci">Merci ' + state.prenom + ' !</div>';
            client += '<div>Présentez ce ticket en caisse</div>';
                        client += '</div>';

            client += '<div class="cut-space"></div>';
            client += '</div>';

            // ========== TICKET CUISINE ==========
            let kitchen = '<div class="ticket kitchen">';

            // Bande noire
            kitchen += '<div class="black-band">';
            kitchen += '<div class="client-name">' + state.prenom.toUpperCase() + '</div>';
            kitchen += '<div class="order-type">' + mode + '</div>';
            kitchen += '</div>';

            // Articles en gros
            state.cart.forEach(item => {
                kitchen += '<div class="kitchen-item">';
                kitchen += '<div class="kitchen-item-header">' + item.quantity + 'x ' + item.name.toUpperCase() + '</div>';
                if (item.details) {
                    item.details.split(' • ').forEach(d => {
                        kitchen += '<div class="kitchen-item-detail">→ ' + d + '</div>';
                    });
                }
                kitchen += '</div>';
            });

            // Heure
            kitchen += '<div class="kitchen-time">Commande reçue à ' + time + '</div>';

            kitchen += '<div class="cut-space"></div>';
            kitchen += '</div>';

            return { client: client, kitchen: kitchen };
        }

        // Test des deux imprimantes
        function testPrintBoth() {
            showToast('Test impression en cours...');

            // Ticket test CLIENT
            let clientTest = '<div class="ticket">';
            clientTest += '<div class="header">';
            clientTest += '<div class="logo">DÉLICES DE L\'INDE</div>';
            clientTest += '<div class="address">31 Bd Charles de Gaulle<br>31800 Saint-Gaudens</div>';
            clientTest += '</div>';
            clientTest += '<div class="black-band"><div class="client-name">TEST</div><div class="order-type">TEST</div></div>';
            clientTest += '<div class="items"><div class="item"><div class="item-row"><span class="item-name">1x Test Produit</span><span class="item-price">9.90€</span></div></div></div>';
            clientTest += '<div class="totals"><div class="total-row total-final"><span>TOTAL</span><span>9.90€</span></div></div>';
            clientTest += '<div class="footer"><div class="merci">Merci !</div></div>';
            clientTest += '<div class="cut-space"></div></div>';

            // Ticket test CUISINE
            let kitchenTest = '<div class="ticket kitchen">';
            kitchenTest += '<div class="black-band"><div class="client-name">TEST</div><div class="order-type">TEST</div></div>';
            kitchenTest += '<div class="kitchen-item"><div class="kitchen-item-header">1x TEST PRODUIT</div></div>';
            kitchenTest += '<div class="kitchen-time">' + new Date().toLocaleString('fr-FR') + '</div>';
            kitchenTest += '<div class="cut-space"></div></div>';

            // Imprimer sur les 2 imprimantes
            printDualTickets(clientTest, kitchenTest);
            showToast('Test envoyé: Epson + Star !');
        }

        // ============ MENU ADMIN SECRET ============
        let secretClicks = 0;
        let secretTimer = null;

        function handleSecretClick() {
            secretClicks++;
            clearTimeout(secretTimer);

            if (secretClicks >= 5) {
                document.getElementById('admin-modal').classList.add('active');
                secretClicks = 0;
            } else {
                secretTimer = setTimeout(() => {
                    secretClicks = 0;
                }, 1500);
            }
        }

        function closeAdminModal() {
            document.getElementById('admin-modal').classList.remove('active');
        }

        // Basculer entre mode DUAL (2 imprimantes) et SINGLE (1 imprimante)
        function togglePrinterMode() {
            if (PRINTER_CONFIG.mode === 'dual') {
                PRINTER_CONFIG.mode = 'single';
                showToast('Mode SINGLE: tout sur imprimante par défaut');
            } else {
                PRINTER_CONFIG.mode = 'dual';
                showToast('Mode DUAL: Epson + Star');
            }
            updatePrinterModeLabel();
        }

        function updatePrinterModeLabel() {
            const label = document.getElementById('printer-mode-label');
            const btn = document.getElementById('btn-printer-mode');
            if (PRINTER_CONFIG.mode === 'dual') {
                label.textContent = 'DUAL (Star + Epson)';
                btn.style.borderColor = '#00cc66';
                btn.style.color = '#00cc66';
                btn.style.background = 'rgba(0,204,102,0.15)';
            } else {
                label.textContent = 'SINGLE (défaut)';
                btn.style.borderColor = '#ff9800';
                btn.style.color = '#ff9800';
                btn.style.background = 'rgba(255,152,0,0.15)';
            }
        }

        // Mettre à jour le label au chargement
        window.addEventListener('load', () => {
            setTimeout(updatePrinterModeLabel, 100);
        });

        // Sortir du plein écran et ouvrir une URL
        function exitFullscreenAndOpen(url) {
            closeAdminModal();
            // Sortir du mode plein écran
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            }
            // Attendre un peu puis ouvrir l'URL
            setTimeout(() => {
                window.open(url, '_blank');
            }, 300);
        }

        function adminTestPrint() {
            const modeMsg = PRINTER_CONFIG.mode === 'dual'
                ? 'Test DUAL: Epson (client) + Star (cuisine)'
                : 'Test SINGLE: tout sur imprimante par défaut';
            showToast(modeMsg);
            closeAdminModal();

            const now = new Date();
            const date = now.toLocaleDateString('fr-FR');
            const time = now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

            // ========== TICKET CLIENT TEST ==========
            let client = '<div class="ticket">';
            client += '<div class="header">';
            client += '<div class="logo">DÉLICES DE L\'INDE</div>';
            client += '<div class="address">TEST IMPRESSION</div>';
            client += '</div>';

            client += '<div class="black-band">';
            client += '<div class="client-name">TEST</div>';
            client += '<div class="order-type">SUR PLACE</div>';
            client += '</div>';

            client += '<div class="datetime">' + date + ' à ' + time + '</div>';

            client += '<div class="items">';
            client += '<div class="item">';
            client += '<div class="item-row"><span class="item-name">1x Tacos XL</span><span class="item-price">14.90€</span></div>';
            client += '<div class="item-details">Tikka, Steak • Gratin Cheddar • Algérienne</div>';
            client += '</div>';
            client += '<div class="item">';
            client += '<div class="item-row"><span class="item-name">1x Naan Royal Menu</span><span class="item-price">11.50€</span></div>';
            client += '</div>';
            client += '</div>';

            client += '<div class="totals">';
            client += '<div class="total-row total-final"><span>TOTAL</span><span>26.40€</span></div>';
            client += '</div>';

            client += '<div class="footer"><div class="merci">Test réussi !</div></div>';
            client += '<div class="cut-space"></div>';
            client += '</div>';

            // ========== TICKET CUISINE TEST ==========
            let kitchen = '<div class="ticket kitchen">';

            kitchen += '<div class="black-band">';
            kitchen += '<div class="client-name">TEST</div>';
            kitchen += '<div class="order-type">SUR PLACE</div>';
            kitchen += '</div>';

            kitchen += '<div class="kitchen-item">';
            kitchen += '<div class="kitchen-item-header">1x TACOS XL</div>';
            kitchen += '<div class="kitchen-item-detail">→ Tikka, Steak</div>';
            kitchen += '<div class="kitchen-item-detail">→ Gratin Cheddar</div>';
            kitchen += '<div class="kitchen-item-detail">→ Algérienne</div>';
            kitchen += '</div>';

            kitchen += '<div class="kitchen-item">';
            kitchen += '<div class="kitchen-item-header">1x NAAN ROYAL MENU</div>';
            kitchen += '</div>';

            kitchen += '<div class="kitchen-time">Test à ' + time + '</div>';
            kitchen += '<div class="cut-space"></div>';
            kitchen += '</div>';

            // Imprimer sur les 2 imprimantes: Epson (client) + Star (cuisine)
            printDualTickets(client, kitchen);
        }

        function adminCloseKiosk() {
            closeAdminModal();
            window.close();
            window.location.href = 'about:blank';
        }

        function adminUpdateRestart() {
            if (confirm('Mettre à jour et redémarrer ?\n\nLa borne va se fermer puis se relancer automatiquement avec les dernières modifications.')) {
                closeAdminModal();
                // Afficher overlay "Mise à jour en cours..."
                const overlay = document.createElement('div');
                overlay.style.cssText = 'position:fixed;inset:0;background:#0a0a0a;z-index:99999;display:flex;flex-direction:column;align-items:center;justify-content:center;color:#FFC000;font-family:Anton,sans-serif;';
                overlay.innerHTML = `
                    <div style="font-size:42px;letter-spacing:2px;margin-bottom:20px;">MISE À JOUR EN COURS</div>
                    <div style="font-size:20px;color:#aaa;margin-bottom:30px;">Téléchargement des dernières modifications...</div>
                    <div style="width:60px;height:60px;border:4px solid #333;border-top-color:#FFC000;border-radius:50%;animation:spin 1s linear infinite;"></div>
                    <style>@keyframes spin{to{transform:rotate(360deg)}}</style>
                `;
                document.body.appendChild(overlay);
                // Naviguer vers maj.html qui déclenche la mise à jour côté launcher
                setTimeout(() => {
                    window.location.href = 'maj.html';
                }, 1500);
            }
        }

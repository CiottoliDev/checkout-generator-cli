# Checkout Generator CLI 🧬

**Checkout Generator CLI** è uno script in node.js che può generare una lista di checkout da un CSV, integrato perfettamente con le api di [FlowPay](https://developer.flowpay.it/).

## Requisiti

Requisiti necessari per eseguire lo script node

-   [Node](https://nodejs.org/)
-   **Client_id** (generato [FlowPay](https://developer.flowpay.it/))
-   **Client_secret** (generato sempre da [FlowPay](https://developer.flowpay.it/))
-   File CSV da [esempio](./example/esempio.csv)

## Installazione

Usa il package manager [npm](https://www.npmjs.com/) per installare **Checkout Generator CLI**.

```sh
# clona la repository oppure scarica la zip
git clone https://github.com/FlowPay/checkout-generator.git

# apri la cartella della repo appena scaricata
cd checkout-generator

# installa il pacchetto globale
npm install -g
```

Se ancora non hai il client id e il client secret, puoi generarli dalla piattaforma di sviluppo dedicata [FlowPay](https://developer.flowpay.it/).

Puoi impostare le due chiavi come variabile ambiente oppure come parametro script. Per variabile ambiente segui queste istruzioni.

```sh

# [facoltativo] imposta le variabili di ambiente clientId e clientSecret

# inserisci il tuo client id al posto di <your_client_id>
export CLIENT_ID=<your_client_id>

# inserisci il tuo client secret al posto di <your_client_secret>
export CLIENT_SECRET=<your_client_secret>
```

Per windows invece segui queste [istruzioni](https://phoenixnap.com/kb/windows-set-environment-variable).

## Utilizzo

È importante sapere che oltre alle chiavi utili per accedere alle api di **flowpay** è necessario impostare un input path del csv da cui generare il ceckout. Oltre al parametro di input è possibile impostare il path output per scegliere il nome e la directory del csv generato, se si desidera generare nella stessa cartella non importare alcun parametro di output. Vedi gli esempi qui.

> È possibile configurare lo script adattandolo alla propria situazione con [Mapping](#mapping) o [Scripting](#scripting)

```sh
# esegui questa istruzione con chiavi impostate nella variabile di ambiente
fpy-generator -p "<your_path_csv>"

# esegui quest istruzione per impostare oltre all'input
# un output path per la generazione del csv finale
fpy-generator -p "<your_path_csv>" -o "<your_path_output_csv>"

# esegui script impostando le chiavi come parametro se non sono come variabile ambiente
fpy-generator -p "<your_path_csv>" -i "<your_client_id>" -s "<your_client_secret>"
```

## Opzioni

Lo script è in grado di accettare alre opzioni per esempio il link di redirect di un checkout. Qui tutte le opzioni che accetta lo script.

| Parametri | Alias          | Variabile Ambiente | Descrizione                                                                                            | Tipo   |
| --------- | -------------- | ------------------ | ------------------------------------------------------------------------------------------------------ | ------ |
| -p        | --path         | CSV_PATH           | Inserisci il csv path del file da cui generare i checkout                                              | string |
| -o        | --pathOutput   |                    | Inserisci un path per output del csv generato. Se omesso sarà nella stessa cartella del file caricato. | string |
| -j        | --pathMap      | MAP_PATH           | Inserisci il path del map.json per mappare i titoli di colonna custom (property field custom).         | string |
| -y        | --pathScript   | SCRIPT_PATH        | Inserisci il path del tuo script che verrà eseguito per ogni riga del csv.                             | string |
| -k        | --creditorIBAN |                    | Inserisci il tuo IBAN se si desidera di default, sarà impostato per ogni checkout generato.            | string |
| -r        | --okRedirect   |                    | Configura un link per il redirect per checkout.                                                        | string |
| -n        | --nokRedirect  |                    | Configura un link per il redirect nel caso non esegua con successo il checkout.                        | string |
| -i        | --clientId     | CLIENT_ID          | Configura il tuo client_id.                                                                            | string |
| -s        | --clientSecret | CLIENT_SECRET      | Configura il tuo client_secret.                                                                        | string |

## Mapping

È possibile mappare le colonne del proprio csv con due modalità diverse di configurazione:

-   File .json
-   Opzioni di configurazione da terminale

Di default la configurazione è questa ed è presente nel file [map.json](map.json)

```json
{
	"vat_code": "Partita Iva",
	"amount": "Importo",
	"expire_date": "Data di scadenza",
	"creditor_iban": "Creditore IBAN",
	"remittance": "Causale",
	"code_invoice": "Riferimento checkout",
	"url_checkout": "Link riferimento checkout",
	"recurring_info": "Ricorrenze"
}
```

Per aggiungere una propria configurazione sarà dunque sufficiente creare un file .json, che abbia uno schema come qui sopra, con i nomi delle proprie colonne relative. Per esempio modifico "Partita Iva" con "Codice Fiscale". In fine, impostare come parametro il path del mio nuovo mapping.

```sh
# esegui questa istruzione con chiavi impostate nella variabile di ambiente
fpy-generator -p "<your_path_csv>" ...altri comandi -j "<your_path_map>"
```

> NB. Il valore che modificherai dovrà essere equivalente con il nome della colonna da mappare.

Oppure se si desidera mappare una sola colonna o tutte attravero opzioni di script, segui questa tabella.

| Parametri | Alias           | Descrizione                                                                                                                                  | Tipo   |
| --------- | --------------- | -------------------------------------------------------------------------------------------------------------------------------------------- | ------ |
| -v        | --vatCode       | Mappa nome della colonna di vat_code (Partita IVA).                                                                                          | string |
| -c        | --creditorIban  | Mappa nome della colonna di creditor_iban (Creditore IBAN).                                                                                  | string |
| -a        | --amount        | Mappa nome della colonna di amount (Importo).                                                                                                | string |
| -e        | --expireDate    | Mappa nome della colonna di expire_date (Data di scadenza). Se non trova la property di riferimento imposta automaticamente la data di ieri. | string |
| -r        | --remittance    | Mappa nome della colonna di remittance (Causale).                                                                                            | string |
| -d        | --codeInvoice   | Mappa nome della colonna di code_invoice (Codice checkout **generato**).                                                                     | string |
| -u        | --urlCheckout   | Mappa nome della colonna di url_checkout (Url checkout **generato**).                                                                        | string |
| -ri       | --recurringInfo | Mappa nome della colonna di recurring_info (Ricorrenza).                                                                                     | string |
| -f        | --fingerprint   | Mappa nome della colonna di fingerprint.                                                                                                     | string |

# Scripting

Come soluzione custom e diversa dal mapping, è possibile eseguire uno script `.mjs` con la propria business logic per ogni record del csv, dovrà dunque restituire un oggetto che sarà interpetato dal **Checkout Generator CLI**. Lo scripting effettuerà l'override del mapping per tutte le poprietà tranne per --urlCheckout, --recurringInfo e --fingerprint.

Lo script dovrà avere la seguente struttura.

```js
export default function (record) {
	/*
		record sarà un oggetto di un array
		con property il nome della colonna corrispondente
	*/

	// ...

	// struttura che checkout si aspetta di ricevere
	return {
		recurring_info,
		creditor_iban,
		vat_code,
		expire_date,
		amount,
		remittance,
	};
}
```

> Esempio di script `.msj`lo puoi trovare [qui](./example/esempio.mjs)

Una volta scritto lo script con la propria logica eseguire **Checkout Generator CLI** aggingedo il parametro pathScirpt come in questo esempio.

```sh
# esegui questa istruzione con chiavi impostate nella variabile di ambiente
fpy-generator -p "<your_path_csv>" ...altri comandi -j "<your_path_script>"
```

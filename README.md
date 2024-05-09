# nemu-technical-specialist

### Problema:

O cliente relatou que realizou todas as configurações para utilizar o painel da Nemu, porém não está conseguindo visualizar corretamente os dados de anúncios de suas campanhas.

Ao consultar o banco de dados, percebemos que os dados de UTMs não estão registrados no padrão para o funcionamento correto.

![image](https://github.com/alexdiegoo/nemu-technical-specialist/assets/66486335/347fc06c-1bfa-4d38-a34f-8ec52b3b002f)

A coluna “content” que faz referência aos dados de anúncios, precisa estar no seguinte padrão:

name|id|term

name: Nome do anúncio <br /> 
id: Id do anúncio <br />
term:  Id da sessão do usuário (gerado pelo pixel da Nemu) <br />

Exemplo de UTM content válida:

Criativo 3|12121212121212|nemu_yf1Dy6MWKc

Sua missão é analisar o código fonte responsável por salvar os dados do Vega, encontrar o problema e propor uma solução para a normalização dos dados a serem registrados no banco de dados.


Payload a ser testado:

```
{
	"payload": {
		"transaction_id": "AAAZZZ",
		"store_name": "Store Name",
		"method": "pix",
		"total_price": "15.00",
		"sub_price": "15.00",
		"shipping_price": "0.00",
		"tax_price": "0.00",
		"discount_price": "0.00",
		"ip": "",
		"status": "pending",
		"checkout_url": "",
		"order_url": "",
		"billet_url": null,
		"billet_digitable_line": null,
		"billet_due_date": null,
		"pix_code_image64": "",
		"created_at": "2024-05-01 09:55:58",
		"updated_at": "2024-05-01 09:56:02",
		"checkout": {
			"utm_source": "FB",
			"utm_medium": "Conjunto — Cópia — Cópia\\42424242424242",
			"utm_campaign": "[CBO] [Test] Criativo 14 — Cópia — Cópia\\43434343434343",
			"utm_term": null,
			"utm_content": "Criativo 14\\4141414141414141\\nemu_Ducjjiiaa"
		},
		"customer": {
			"name": "",
			"document": "",
			"email": "",
			"phone": ""
		},
		"address": {
			"street": "",
			"number": "",
			"complement": "",
			"district": "",
			"zip_code": "",
			"city": "",
			"state": "",
			"country": ""
		},
		"plans": [
			{
				"id": "AAAZZZ",
				"name": "Name",
				"description": "Description",
				"amount": 1,
				"value": 1500,
				"created_at": "2024-04-26 01:42:57",
				"products": [
					{
						"id": "AAAZZZ",
						"name": "Product Name",
						"description": "Product Description",
						"amount": 1,
						"photo": "",
						"created_at": "2024-04-26 01:40:32"
					}
				]
			}
		],
		"taxes": {
			"billetTax": 0,
			"ccTax": 0,
			"pixTax": 0,
			"antifraudTax": 0
		}
	}
}
```

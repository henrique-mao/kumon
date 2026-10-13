=== Informação Nutricional ===
Contributors: henriquearaujo
Tags: informação nutricional, tabela nutricional, alérgicos, rotulagem, anvisa
Requires at least: 5.8
Tested up to: 6.6
Requires PHP: 7.4
Stable tag: 1.0.0
License: GPLv2 or later

Cadastro e exibição da Informação Nutricional de produtos de supermercado no padrão ANVISA (RDC 429/2020 e IN 75/2020).

== Descrição ==

* **Tabela nutricional** no modelo oficial: porções por embalagem, porção + medida caseira, colunas 100 g/ml, porção e %VD.
  - Valores por porção e %VD são **calculados automaticamente** a partir dos valores por 100 g/ml (podem ser substituídos manualmente).
  - Nutrientes adicionais (vitaminas, minerais) em linhas extras.
* **Selo frontal "ALTO EM" (lupa)** para açúcar adicionado, gordura saturada e sódio — automático pelos limites da RDC 429/2020 ou manual. Layout horizontal ou vertical.
* **Ingredientes**.
* **Alérgicos** (RDC 26/2015): contém / contém derivados / pode conter, + glúten (Lei 10.674/2003) e lactose (RDC 136/2017). O texto "ALÉRGICOS: CONTÉM ..." é gerado automaticamente.
* **Cuidados**: conservação, após aberto, modo de preparo, recomendações de consumo, outros.
* **Selos informativos**: sem glúten, zero lactose, vegano, orgânico, integral, zero açúcar, light, fonte de fibras, etc.
* Tipo de post **Produtos** com categorias (opcional — pode usar um tipo criado no Custom Post Type UI ou o WooCommerce).
* **Widget Elementor** "Informação Nutricional" com controles de conteúdo e estilo.
* Visual herda fontes do tema e usa automaticamente a "Theme color" do **BeTheme** (ex.: Sushi3). Esquemas claro e escuro.

== Instalação ==

1. Envie o arquivo `informacao-nutricional.zip` em Plugins > Adicionar novo > Enviar plugin e ative.
2. Vá em Configurações > Informação Nutricional:
   - Se você já tem um tipo de post de produtos (Custom Post Type UI), desmarque "Registrar o tipo de post Produtos" e marque o seu tipo de post.
   - Escolha se a ficha é inserida automaticamente no fim da página do produto.
3. Edite um produto e preencha a caixa "Informação Nutricional" (abas Tabela, Ingredientes e alérgicos, Cuidados, Selos).
4. Exiba com o widget do Elementor ou com os shortcodes.

== Shortcodes ==

* `[info_nutricional]` — ficha completa do produto atual.
* `[info_nutricional id="123" secoes="alertas,selos,tabela,ingredientes,alergicos,cuidados" layout="abas|lista" estilo="light|dark" alto_em="horizontal|vertical" titulo="Informações do produto"]`
* `[inn_tabela]`, `[inn_alto_em layout="vertical"]`, `[inn_selos]`, `[inn_ingredientes]`, `[inn_alergicos]`, `[inn_cuidados]` — partes individuais (todos aceitam `id`).

== Elementor Theme Builder ==

Crie um template "Single" para o tipo de post Produtos e arraste o widget "Informação Nutricional" com Produto = "Produto atual".
Desative a "Exibição automática" nas configurações para não duplicar.

== Para desenvolvedores ==

* Dados salvos no post meta `_infonutri` (array). Helper: `infonutri_get( $post_id )`.
* Metas simples para consultas/filtros (Elementor Loop, WP_Query, ACF): `infonutri_alto_em` (ex.: "acucar_adicionado,sodio") e `infonutri_selos`.
* Cores via variáveis CSS em `.inn-ficha`: `--inn-accent`, `--inn-bg`, `--inn-text`, `--inn-heading`, `--inn-radius`.
* A tabela nutricional e o selo "ALTO EM" são sempre preto sobre branco, como exige a IN 75/2020.

== Observação ==

Os cálculos usam arredondamento simplificado. Confira sempre os valores com o rótulo oficial do fabricante — ele é a referência legal.

== Changelog ==

= 1.0.0 =
* Versão inicial.

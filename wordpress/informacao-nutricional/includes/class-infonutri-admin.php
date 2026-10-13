<?php
/**
 * Meta box de cadastro (Tabela, Ingredientes & Alérgicos, Cuidados, Selos).
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class InfoNutri_Admin {

	const NONCE = 'infonutri_save';

	public static function init() {
		add_action( 'add_meta_boxes', array( __CLASS__, 'add_meta_box' ) );
		add_action( 'save_post', array( __CLASS__, 'save' ), 10, 2 );
		add_action( 'admin_enqueue_scripts', array( __CLASS__, 'assets' ) );
		add_action( 'admin_init', array( __CLASS__, 'columns' ) );
	}

	public static function add_meta_box() {
		foreach ( InfoNutri_Settings::post_types() as $type ) {
			add_meta_box(
				'infonutri',
				__( 'Informação Nutricional', 'infonutri' ),
				array( __CLASS__, 'render' ),
				$type,
				'normal',
				'high'
			);
		}
	}

	public static function assets( $hook ) {
		$screen = get_current_screen();
		if ( 'settings_page_infonutri' === $hook ) {
			wp_enqueue_style( 'wp-color-picker' );
			wp_enqueue_script( 'wp-color-picker' );
			wp_add_inline_script( 'wp-color-picker', 'jQuery(function($){$(".infonutri-color").wpColorPicker();});' );
			return;
		}
		if ( ! $screen || 'post' !== $screen->base || ! in_array( $screen->post_type, InfoNutri_Settings::post_types(), true ) ) {
			return;
		}
		InfoNutri_Render::enqueue();
		wp_enqueue_style( 'infonutri-admin', INFONUTRI_URL . 'assets/css/admin.css', array( 'infonutri' ), INFONUTRI_VERSION );
		wp_enqueue_script( 'infonutri-admin', INFONUTRI_URL . 'assets/js/admin.js', array(), INFONUTRI_VERSION, true );

		$nutrients = array();
		foreach ( InfoNutri_Data::nutrients() as $key => $def ) {
			$nutrients[ $key ] = array( 'vd' => $def['vd'], 'unit' => $def['unit'] );
		}
		$alerts = array();
		foreach ( InfoNutri_Data::alerts() as $key => $def ) {
			$alerts[ $key ] = array(
				'nutrient' => $def['nutrient'],
				'solid'    => $def['solid'],
				'liquid'   => $def['liquid'],
			);
		}
		wp_localize_script(
			'infonutri-admin',
			'InfoNutriAdmin',
			array(
				'nutrients' => $nutrients,
				'alerts'    => $alerts,
			)
		);
	}

	/* ------------------------------------------------------------------ */

	public static function render( $post ) {
		$d = InfoNutri_Data::get( $post->ID );
		wp_nonce_field( self::NONCE, '_infonutri_nonce' );
		$n = 'infonutri';
		?>
		<div class="inn-admin">
			<nav class="inn-admin-tabs" role="tablist">
				<button type="button" class="is-active" data-tab="tabela"><?php esc_html_e( 'Tabela nutricional', 'infonutri' ); ?></button>
				<button type="button" data-tab="ingredientes"><?php esc_html_e( 'Ingredientes e alérgicos', 'infonutri' ); ?></button>
				<button type="button" data-tab="cuidados"><?php esc_html_e( 'Cuidados', 'infonutri' ); ?></button>
				<button type="button" data-tab="selos"><?php esc_html_e( 'Selos', 'infonutri' ); ?></button>
			</nav>

			<!-- TABELA ------------------------------------------------------>
			<section class="inn-admin-panel is-active" data-panel="tabela">
				<div class="inn-grid inn-grid-4">
					<label><?php esc_html_e( 'Estado físico', 'infonutri' ); ?>
						<select name="<?php echo esc_attr( $n ); ?>[unidade]" data-inn="unidade">
							<option value="g" <?php selected( $d['unidade'], 'g' ); ?>><?php esc_html_e( 'Sólido / semissólido (g)', 'infonutri' ); ?></option>
							<option value="ml" <?php selected( $d['unidade'], 'ml' ); ?>><?php esc_html_e( 'Líquido (ml)', 'infonutri' ); ?></option>
						</select>
					</label>
					<label><?php esc_html_e( 'Porção', 'infonutri' ); ?> (<span data-inn-unit><?php echo esc_html( $d['unidade'] ); ?></span>)
						<input type="text" inputmode="decimal" name="<?php echo esc_attr( $n ); ?>[porcao]" value="<?php echo esc_attr( InfoNutri_Data::input_number( $d['porcao'] ) ); ?>" data-inn="porcao" placeholder="60">
					</label>
					<label><?php esc_html_e( 'Medida caseira', 'infonutri' ); ?>
						<input type="text" name="<?php echo esc_attr( $n ); ?>[medida_caseira]" value="<?php echo esc_attr( $d['medida_caseira'] ); ?>" placeholder="<?php esc_attr_e( '1 fatia', 'infonutri' ); ?>">
					</label>
					<label><?php esc_html_e( 'Porções por embalagem', 'infonutri' ); ?>
						<input type="text" name="<?php echo esc_attr( $n ); ?>[porcoes_embalagem]" value="<?php echo esc_attr( $d['porcoes_embalagem'] ); ?>" placeholder="12">
					</label>
				</div>

				<table class="widefat inn-admin-table">
					<thead>
						<tr>
							<th><?php esc_html_e( 'Nutriente', 'infonutri' ); ?></th>
							<th><?php esc_html_e( 'Por 100', 'infonutri' ); ?> <span data-inn-unit><?php echo esc_html( $d['unidade'] ); ?></span></th>
							<th><?php esc_html_e( 'Por porção', 'infonutri' ); ?> <small>(<?php esc_html_e( 'calculado — preencha só para substituir', 'infonutri' ); ?>)</small></th>
							<th>%VD</th>
						</tr>
					</thead>
					<tbody>
					<?php foreach ( InfoNutri_Data::nutrients() as $key => $def ) : ?>
						<tr class="inn-level-<?php echo (int) $def['level']; ?>" data-nutrient="<?php echo esc_attr( $key ); ?>">
							<td><?php echo esc_html( $def['label'] ); ?> <small>(<?php echo esc_html( $def['unit'] ); ?>)</small></td>
							<td><input type="text" inputmode="decimal" name="<?php echo esc_attr( $n ); ?>[base][<?php echo esc_attr( $key ); ?>]" value="<?php echo esc_attr( InfoNutri_Data::input_number( $d['base'][ $key ] ) ); ?>" data-inn="base"></td>
							<td><input type="text" inputmode="decimal" name="<?php echo esc_attr( $n ); ?>[porcao_manual][<?php echo esc_attr( $key ); ?>]" value="<?php echo esc_attr( InfoNutri_Data::input_number( $d['porcao_manual'][ $key ] ) ); ?>" data-inn="manual"></td>
							<td class="inn-vd" data-inn="vd"><?php echo $def['vd'] ? '—' : ''; ?></td>
						</tr>
					<?php endforeach; ?>
					</tbody>
				</table>

				<h4><?php esc_html_e( 'Outros nutrientes (vitaminas, minerais, etc.)', 'infonutri' ); ?></h4>
				<table class="widefat inn-admin-table inn-extras">
					<thead>
						<tr>
							<th><?php esc_html_e( 'Nome', 'infonutri' ); ?></th>
							<th><?php esc_html_e( 'Unidade', 'infonutri' ); ?></th>
							<th><?php esc_html_e( 'Por 100', 'infonutri' ); ?></th>
							<th><?php esc_html_e( 'Por porção', 'infonutri' ); ?></th>
							<th>%VD</th>
							<th></th>
						</tr>
					</thead>
					<tbody data-inn-extras>
						<?php
						$rows = $d['extras'] ? $d['extras'] : array();
						foreach ( $rows as $i => $row ) {
							self::extra_row( $i, $row );
						}
						?>
					</tbody>
				</table>
				<template id="inn-extra-template"><?php self::extra_row( '__i__', array() ); ?></template>
				<p><button type="button" class="button" data-inn-add-extra>+ <?php esc_html_e( 'Adicionar nutriente', 'infonutri' ); ?></button></p>
			</section>

			<!-- INGREDIENTES / ALÉRGICOS ----------------------------------->
			<section class="inn-admin-panel" data-panel="ingredientes">
				<label class="inn-block"><?php esc_html_e( 'Ingredientes', 'infonutri' ); ?>
					<textarea name="<?php echo esc_attr( $n ); ?>[ingredientes]" rows="5" placeholder="<?php esc_attr_e( 'Farinha de trigo enriquecida com ferro e ácido fólico, açúcar, gordura vegetal...', 'infonutri' ); ?>"><?php echo esc_textarea( $d['ingredientes'] ); ?></textarea>
				</label>

				<table class="widefat inn-admin-table inn-allergens">
					<thead>
						<tr>
							<th><?php esc_html_e( 'Alergênico (RDC 26/2015)', 'infonutri' ); ?></th>
							<th><?php esc_html_e( 'Contém', 'infonutri' ); ?></th>
							<th><?php esc_html_e( 'Contém derivados', 'infonutri' ); ?></th>
							<th><?php esc_html_e( 'Pode conter', 'infonutri' ); ?></th>
						</tr>
					</thead>
					<tbody>
					<?php foreach ( InfoNutri_Data::allergens() as $key => $label ) : ?>
						<tr>
							<td><?php echo esc_html( $label ); ?></td>
							<td><input type="checkbox" name="<?php echo esc_attr( $n ); ?>[alergicos][]" value="<?php echo esc_attr( $key ); ?>" <?php checked( in_array( $key, $d['alergicos'], true ) ); ?>></td>
							<td><input type="checkbox" name="<?php echo esc_attr( $n ); ?>[derivados][]" value="<?php echo esc_attr( $key ); ?>" <?php checked( in_array( $key, $d['derivados'], true ) ); ?>></td>
							<td><input type="checkbox" name="<?php echo esc_attr( $n ); ?>[pode_conter][]" value="<?php echo esc_attr( $key ); ?>" <?php checked( in_array( $key, $d['pode_conter'], true ) ); ?>></td>
						</tr>
					<?php endforeach; ?>
					</tbody>
				</table>

				<div class="inn-grid inn-grid-2">
					<label><?php esc_html_e( 'Contém também (texto livre)', 'infonutri' ); ?>
						<input type="text" name="<?php echo esc_attr( $n ); ?>[alergicos_outros]" value="<?php echo esc_attr( $d['alergicos_outros'] ); ?>">
					</label>
					<label><?php esc_html_e( 'Pode conter também (texto livre)', 'infonutri' ); ?>
						<input type="text" name="<?php echo esc_attr( $n ); ?>[pode_conter_outros]" value="<?php echo esc_attr( $d['pode_conter_outros'] ); ?>">
					</label>
					<label><?php esc_html_e( 'Glúten (Lei 10.674/2003)', 'infonutri' ); ?>
						<select name="<?php echo esc_attr( $n ); ?>[gluten]">
							<option value=""><?php esc_html_e( '— não informar —', 'infonutri' ); ?></option>
							<option value="contem" <?php selected( $d['gluten'], 'contem' ); ?>><?php esc_html_e( 'Contém glúten', 'infonutri' ); ?></option>
							<option value="nao_contem" <?php selected( $d['gluten'], 'nao_contem' ); ?>><?php esc_html_e( 'Não contém glúten', 'infonutri' ); ?></option>
						</select>
					</label>
					<label><?php esc_html_e( 'Lactose (RDC 136/2017)', 'infonutri' ); ?>
						<select name="<?php echo esc_attr( $n ); ?>[lactose]">
							<option value=""><?php esc_html_e( '— não informar —', 'infonutri' ); ?></option>
							<option value="contem" <?php selected( $d['lactose'], 'contem' ); ?>><?php esc_html_e( 'Contém lactose', 'infonutri' ); ?></option>
							<option value="nao_contem" <?php selected( $d['lactose'], 'nao_contem' ); ?>><?php esc_html_e( 'Não contém lactose', 'infonutri' ); ?></option>
							<option value="baixo" <?php selected( $d['lactose'], 'baixo' ); ?>><?php esc_html_e( 'Baixo teor de lactose', 'infonutri' ); ?></option>
						</select>
					</label>
				</div>
			</section>

			<!-- CUIDADOS ---------------------------------------------------->
			<section class="inn-admin-panel" data-panel="cuidados">
				<?php foreach ( InfoNutri_Data::care_fields() as $key => $label ) : ?>
					<label class="inn-block"><?php echo esc_html( $label ); ?>
						<textarea name="<?php echo esc_attr( $n ); ?>[cuidados][<?php echo esc_attr( $key ); ?>]" rows="2"><?php echo esc_textarea( $d['cuidados'][ $key ] ); ?></textarea>
					</label>
				<?php endforeach; ?>
			</section>

			<!-- SELOS ------------------------------------------------------->
			<section class="inn-admin-panel" data-panel="selos">
				<h4><?php esc_html_e( 'Rotulagem frontal "ALTO EM" (RDC 429/2020)', 'infonutri' ); ?></h4>
				<p>
					<label><input type="radio" name="<?php echo esc_attr( $n ); ?>[alerta_modo]" value="auto" data-inn="alerta_modo" <?php checked( $d['alerta_modo'], 'auto' ); ?>> <?php esc_html_e( 'Automático (calculado pelos valores por 100 g/ml)', 'infonutri' ); ?></label><br>
					<label><input type="radio" name="<?php echo esc_attr( $n ); ?>[alerta_modo]" value="manual" data-inn="alerta_modo" <?php checked( $d['alerta_modo'], 'manual' ); ?>> <?php esc_html_e( 'Manual', 'infonutri' ); ?></label>
				</p>
				<p class="inn-alert-checks">
					<?php foreach ( InfoNutri_Data::alerts() as $key => $def ) : ?>
						<label><input type="checkbox" name="<?php echo esc_attr( $n ); ?>[alertas][]" value="<?php echo esc_attr( $key ); ?>" data-inn-alert="<?php echo esc_attr( $key ); ?>" <?php checked( in_array( $key, InfoNutri_Data::active_alerts( $d ), true ) ); ?>> <?php echo esc_html( $def['label'] ); ?></label>
					<?php endforeach; ?>
				</p>
				<p class="description"><?php esc_html_e( 'Limites: sólidos ≥ 15 g de açúcar adicionado, ≥ 6 g de gordura saturada, ≥ 600 mg de sódio por 100 g. Líquidos ≥ 7,5 g, ≥ 3 g e ≥ 300 mg por 100 ml.', 'infonutri' ); ?></p>
				<div class="inn-admin-preview" data-inn-preview>
					<?php echo InfoNutri_Render::alerts_box( array_keys( InfoNutri_Data::alerts() ), 'horizontal' ); // phpcs:ignore WordPress.Security.EscapeOutput ?>
				</div>

				<h4><?php esc_html_e( 'Selos informativos', 'infonutri' ); ?></h4>
				<div class="inn-badge-checks">
					<?php foreach ( InfoNutri_Data::badges() as $key => $def ) : ?>
						<label><input type="checkbox" name="<?php echo esc_attr( $n ); ?>[selos][]" value="<?php echo esc_attr( $key ); ?>" <?php checked( in_array( $key, $d['selos'], true ) ); ?>> <?php echo esc_html( $def['label'] ); ?></label>
					<?php endforeach; ?>
				</div>
			</section>

			<p class="inn-admin-help">
				<?php esc_html_e( 'Use vírgula ou ponto para decimais. Deixe em branco para exibir "—". Exibição:', 'infonutri' ); ?>
				<code>[info_nutricional id="<?php echo (int) $post->ID; ?>"]</code>
				<?php esc_html_e( 'ou o widget "Informação Nutricional" do Elementor.', 'infonutri' ); ?>
			</p>
		</div>
		<?php
	}

	private static function extra_row( $i, $row ) {
		$row = wp_parse_args( $row, array( 'nome' => '', 'unidade' => 'mg', 'base' => '', 'porcao' => '', 'vd' => '' ) );
		$p   = 'infonutri[extras][' . $i . ']';
		?>
		<tr>
			<td><input type="text" name="<?php echo esc_attr( $p ); ?>[nome]" value="<?php echo esc_attr( $row['nome'] ); ?>" placeholder="<?php esc_attr_e( 'Cálcio', 'infonutri' ); ?>"></td>
			<td><input type="text" name="<?php echo esc_attr( $p ); ?>[unidade]" value="<?php echo esc_attr( $row['unidade'] ); ?>" style="width:70px"></td>
			<td><input type="text" inputmode="decimal" name="<?php echo esc_attr( $p ); ?>[base]" value="<?php echo esc_attr( InfoNutri_Data::input_number( $row['base'] ) ); ?>"></td>
			<td><input type="text" inputmode="decimal" name="<?php echo esc_attr( $p ); ?>[porcao]" value="<?php echo esc_attr( InfoNutri_Data::input_number( $row['porcao'] ) ); ?>"></td>
			<td><input type="text" inputmode="decimal" name="<?php echo esc_attr( $p ); ?>[vd]" value="<?php echo esc_attr( InfoNutri_Data::input_number( $row['vd'] ) ); ?>" style="width:70px"></td>
			<td><button type="button" class="button-link-delete" data-inn-remove-extra aria-label="<?php esc_attr_e( 'Remover', 'infonutri' ); ?>">&times;</button></td>
		</tr>
		<?php
	}

	public static function save( $post_id, $post ) {
		if ( ! isset( $_POST['_infonutri_nonce'] ) || ! wp_verify_nonce( sanitize_key( $_POST['_infonutri_nonce'] ), self::NONCE ) ) {
			return;
		}
		if ( ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) || wp_is_post_revision( $post_id ) ) {
			return;
		}
		if ( ! current_user_can( 'edit_post', $post_id ) || ! in_array( $post->post_type, InfoNutri_Settings::post_types(), true ) ) {
			return;
		}
		// phpcs:ignore WordPress.Security.ValidatedSanitizedInput -- sanitizado em InfoNutri_Data::sanitize().
		$data = InfoNutri_Data::sanitize( $_POST['infonutri'] ?? array() );
		update_post_meta( $post_id, InfoNutri_Data::META_KEY, $data );

		// Meta simples para filtros / consultas (ex.: Elementor Loop, ACF, WP_Query).
		update_post_meta( $post_id, 'infonutri_alto_em', implode( ',', InfoNutri_Data::active_alerts( $data ) ) );
		update_post_meta( $post_id, 'infonutri_selos', implode( ',', $data['selos'] ) );
	}

	/** Coluna "Alto em" na listagem de produtos. */
	public static function columns() {
		foreach ( InfoNutri_Settings::post_types() as $type ) {
			add_filter(
				"manage_{$type}_posts_columns",
				function ( $cols ) {
					$cols['infonutri'] = __( 'Alto em', 'infonutri' );
					return $cols;
				}
			);
			add_action(
				"manage_{$type}_posts_custom_column",
				function ( $col, $post_id ) {
					if ( 'infonutri' !== $col ) {
						return;
					}
					$labels = array();
					$defs   = InfoNutri_Data::alerts();
					foreach ( array_filter( explode( ',', (string) get_post_meta( $post_id, 'infonutri_alto_em', true ) ) ) as $key ) {
						if ( isset( $defs[ $key ] ) ) {
							$labels[] = $defs[ $key ]['label'];
						}
					}
					echo $labels ? esc_html( implode( ', ', $labels ) ) : '—';
				},
				10,
				2
			);
		}
	}
}

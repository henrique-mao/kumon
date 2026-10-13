<?php
/**
 * Geração do HTML exibido no site (tabela, selos, ingredientes, alérgicos, cuidados).
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class InfoNutri_Render {

	private static $instance = 0;

	public static function init() {
		add_action( 'wp_enqueue_scripts', array( __CLASS__, 'register_assets' ) );
		add_filter( 'the_content', array( __CLASS__, 'auto_append' ), 20 );
	}

	public static function register_assets() {
		if ( wp_style_is( 'infonutri', 'registered' ) ) {
			return;
		}
		wp_register_style( 'infonutri', INFONUTRI_URL . 'assets/css/frontend.css', array(), INFONUTRI_VERSION );
		wp_register_script( 'infonutri', INFONUTRI_URL . 'assets/js/frontend.js', array(), INFONUTRI_VERSION, true );
		wp_add_inline_style( 'infonutri', '.inn-ficha{--inn-accent:' . esc_attr( InfoNutri_Settings::accent() ) . ';}' );
	}

	public static function enqueue() {
		if ( ! wp_style_is( 'infonutri', 'registered' ) ) {
			self::register_assets();
		}
		wp_enqueue_style( 'infonutri' );
		wp_enqueue_script( 'infonutri' );
	}

	public static function auto_append( $content ) {
		if ( ! InfoNutri_Settings::get( 'auto_append' ) || ! is_singular( InfoNutri_Settings::post_types() ) || ! in_the_loop() || ! is_main_query() ) {
			return $content;
		}
		$post_id = get_the_ID();
		// Não duplica quando a página já usa o widget/shortcode.
		if ( ! InfoNutri_Data::has_data( $post_id ) || has_shortcode( $content, 'info_nutricional' ) || false !== strpos( $content, 'inn-ficha' ) ) {
			return $content;
		}
		return $content . self::full( $post_id );
	}

	/* ------------------------------------------------------------------ */
	/* Ficha completa                                                      */
	/* ------------------------------------------------------------------ */

	/**
	 * @param int   $post_id
	 * @param array $args secoes (array), layout (abas|lista), alert_layout, style, title.
	 */
	public static function full( $post_id, $args = array() ) {
		$args = wp_parse_args(
			$args,
			array(
				'secoes'       => array( 'alertas', 'selos', 'tabela', 'ingredientes', 'alergicos', 'cuidados' ),
				'layout'       => InfoNutri_Settings::get( 'layout' ),
				'alert_layout' => InfoNutri_Settings::get( 'alert_layout' ),
				'style'        => InfoNutri_Settings::get( 'style' ),
				'title'        => '',
			)
		);
		if ( ! $post_id || ! InfoNutri_Data::has_data( $post_id ) ) {
			return '';
		}
		self::enqueue();
		$d   = InfoNutri_Data::get( $post_id );
		$uid = 'inn-' . (int) $post_id . '-' . ( ++self::$instance );

		$header = '';
		if ( in_array( 'alertas', $args['secoes'], true ) ) {
			$header .= self::alerts_box( InfoNutri_Data::active_alerts( $d ), $args['alert_layout'] );
		}
		if ( in_array( 'selos', $args['secoes'], true ) ) {
			$header .= self::badges( $d );
		}

		$titles = array(
			'tabela'       => __( 'Informação nutricional', 'infonutri' ),
			'ingredientes' => __( 'Ingredientes', 'infonutri' ),
			'alergicos'    => __( 'Alérgicos', 'infonutri' ),
			'cuidados'     => __( 'Cuidados', 'infonutri' ),
		);
		$panels = array();
		foreach ( $titles as $key => $label ) {
			if ( ! in_array( $key, $args['secoes'], true ) ) {
				continue;
			}
			$html = call_user_func( array( __CLASS__, $key ), $d );
			if ( '' !== $html ) {
				$panels[ $key ] = array( 'label' => $label, 'html' => $html );
			}
		}

		$classes = array( 'inn-ficha', 'inn-ficha--' . sanitize_html_class( $args['layout'] ), 'inn-ficha--' . sanitize_html_class( $args['style'] ) );
		ob_start();
		?>
		<div class="<?php echo esc_attr( implode( ' ', $classes ) ); ?>" id="<?php echo esc_attr( $uid ); ?>">
			<?php if ( $args['title'] ) : ?>
				<h3 class="inn-ficha__title"><?php echo esc_html( $args['title'] ); ?></h3>
			<?php endif; ?>
			<?php if ( $header ) : ?>
				<div class="inn-ficha__header"><?php echo $header; // phpcs:ignore WordPress.Security.EscapeOutput -- HTML gerado e escapado internamente. ?></div>
			<?php endif; ?>

			<?php if ( 'abas' === $args['layout'] && count( $panels ) > 1 ) : ?>
				<div class="inn-tabs" role="tablist">
					<?php $first = true; foreach ( $panels as $key => $p ) : ?>
						<button type="button" class="inn-tabs__tab<?php echo $first ? ' is-active' : ''; ?>" role="tab" id="<?php echo esc_attr( $uid . '-tab-' . $key ); ?>" aria-controls="<?php echo esc_attr( $uid . '-' . $key ); ?>" aria-selected="<?php echo $first ? 'true' : 'false'; ?>" tabindex="<?php echo $first ? '0' : '-1'; ?>"><?php echo esc_html( $p['label'] ); ?></button>
					<?php $first = false; endforeach; ?>
				</div>
			<?php endif; ?>

			<div class="inn-panels">
				<?php $first = true; foreach ( $panels as $key => $p ) : ?>
					<section class="inn-panel inn-panel--<?php echo esc_attr( $key ); ?><?php echo $first ? ' is-active' : ''; ?>" id="<?php echo esc_attr( $uid . '-' . $key ); ?>" <?php echo 'abas' === $args['layout'] ? 'role="tabpanel" aria-labelledby="' . esc_attr( $uid . '-tab-' . $key ) . '"' : ''; ?>>
						<h4 class="inn-panel__title"><?php echo esc_html( $p['label'] ); ?></h4>
						<?php echo $p['html']; // phpcs:ignore WordPress.Security.EscapeOutput ?>
					</section>
				<?php $first = false; endforeach; ?>
			</div>
		</div>
		<?php
		return ob_get_clean();
	}

	/* ------------------------------------------------------------------ */
	/* Tabela nutricional (modelo IN 75/2020)                              */
	/* ------------------------------------------------------------------ */

	public static function tabela( $d ) {
		$has_values = array_filter( $d['base'], 'strlen' ) || array_filter( $d['porcao_manual'], 'strlen' );
		if ( ! $has_values ) {
			return '';
		}
		$unit     = $d['unidade'];
		$portion  = InfoNutri_Data::format_amount( $d['porcao'], $unit );
		$servings = $d['porcoes_embalagem'];
		if ( is_numeric( str_replace( ',', '.', $servings ) ) ) {
			/* translators: %s: número de porções */
			$servings = sprintf( _n( '%s porção', '%s porções', (int) $servings, 'infonutri' ), $servings );
		}
		$footnote = InfoNutri_Settings::get( 'footnote' );

		ob_start();
		?>
		<div class="inn-tabela">
			<div class="inn-tabela__title"><?php esc_html_e( 'INFORMAÇÃO NUTRICIONAL', 'infonutri' ); ?></div>
			<?php if ( $servings || $portion ) : ?>
				<div class="inn-tabela__porcao">
					<?php if ( $servings ) : ?>
						<div><?php esc_html_e( 'Porções por embalagem:', 'infonutri' ); ?> <?php echo esc_html( $servings ); ?></div>
					<?php endif; ?>
					<?php if ( $portion ) : ?>
						<div><?php esc_html_e( 'Porção:', 'infonutri' ); ?> <?php echo esc_html( $portion ); ?><?php echo $d['medida_caseira'] ? ' (' . esc_html( $d['medida_caseira'] ) . ')' : ''; ?></div>
					<?php endif; ?>
				</div>
			<?php endif; ?>
			<div class="inn-tabela__bar" aria-hidden="true"></div>
			<table>
				<thead>
					<tr>
						<td></td>
						<th scope="col">100 <?php echo esc_html( $unit ); ?></th>
						<th scope="col"><?php echo $portion ? esc_html( $portion ) : esc_html__( 'Porção', 'infonutri' ); ?></th>
						<th scope="col"><abbr title="<?php esc_attr_e( 'Percentual de Valor Diário', 'infonutri' ); ?>">%VD*</abbr></th>
					</tr>
				</thead>
				<tbody>
				<?php foreach ( InfoNutri_Data::nutrients() as $key => $def ) :
					$base    = $d['base'][ $key ];
					$por     = InfoNutri_Data::portion_value( $d, $key );
					$vd      = InfoNutri_Data::vd_percent( $d, $key );
					$dash    = '—';
					?>
					<tr class="inn-level-<?php echo (int) $def['level']; ?>">
						<th scope="row"><?php echo esc_html( $def['label'] . ' (' . $def['unit'] . ')' ); ?></th>
						<td><?php echo '' !== $base ? esc_html( InfoNutri_Data::format_amount( $base, $def['unit'] ) ) : $dash; ?></td>
						<td><?php echo null !== $por ? esc_html( InfoNutri_Data::format_amount( $por, $def['unit'] ) ) : $dash; ?></td>
						<td><?php echo null !== $vd ? esc_html( $vd . '%' ) : ( $def['vd'] ? $dash : '' ); ?></td>
					</tr>
				<?php endforeach; ?>
				<?php foreach ( $d['extras'] as $row ) :
					$por = '' !== $row['porcao'] ? $row['porcao'] : ( '' !== $row['base'] && '' !== $d['porcao'] ? (float) $row['base'] * (float) $d['porcao'] / 100 : null );
					?>
					<tr class="inn-level-0">
						<th scope="row"><?php echo esc_html( $row['nome'] . ' (' . $row['unidade'] . ')' ); ?></th>
						<td><?php echo '' !== $row['base'] ? esc_html( InfoNutri_Data::format_amount( $row['base'], $row['unidade'] ) ) : '—'; ?></td>
						<td><?php echo null !== $por ? esc_html( InfoNutri_Data::format_amount( $por, $row['unidade'] ) ) : '—'; ?></td>
						<td><?php echo '' !== $row['vd'] ? esc_html( InfoNutri_Data::format_number( $row['vd'] ) . '%' ) : ''; ?></td>
					</tr>
				<?php endforeach; ?>
				</tbody>
			</table>
			<?php if ( $footnote ) : ?>
				<div class="inn-tabela__nota"><?php echo esc_html( $footnote ); ?></div>
			<?php endif; ?>
		</div>
		<?php
		return ob_get_clean();
	}

	/* ------------------------------------------------------------------ */
	/* Selo frontal "ALTO EM" (lupa)                                       */
	/* ------------------------------------------------------------------ */

	public static function alerts_box( $keys, $layout = 'horizontal' ) {
		if ( empty( $keys ) ) {
			return '';
		}
		self::enqueue();
		$labels = array(
			'acucar_adicionado' => array( __( 'AÇÚCAR', 'infonutri' ), __( 'ADICIONADO', 'infonutri' ) ),
			'gordura_saturada'  => array( __( 'GORDURA', 'infonutri' ), __( 'SATURADA', 'infonutri' ) ),
			'sodio'             => array( __( 'SÓDIO', 'infonutri' ) ),
		);
		$defs  = InfoNutri_Data::alerts();
		$names = array();
		$items = '';
		foreach ( array_keys( $defs ) as $key ) {
			if ( ! in_array( $key, $keys, true ) ) {
				continue;
			}
			$names[] = mb_strtolower( $defs[ $key ]['label'], 'UTF-8' );
			$items  .= '<span class="inn-alto-em__item" data-alert="' . esc_attr( $key ) . '">' . implode( '<br>', array_map( 'esc_html', $labels[ $key ] ) ) . '</span>';
		}
		/* translators: %s: lista de nutrientes */
		$aria = sprintf( __( 'Alto em %s', 'infonutri' ), InfoNutri_Data::join_list( $names ) );
		$layout = 'vertical' === $layout ? 'vertical' : 'horizontal';

		return '<div class="inn-alto-em inn-alto-em--' . $layout . '" role="img" aria-label="' . esc_attr( $aria ) . '">'
			. '<span class="inn-alto-em__head">' . self::magnifier() . '<span>' . esc_html__( 'ALTO EM', 'infonutri' ) . '</span></span>'
			. '<span class="inn-alto-em__items">' . $items . '</span>'
			. '</div>';
	}

	private static function magnifier() {
		return '<svg class="inn-alto-em__lupa" viewBox="0 0 40 40" aria-hidden="true" focusable="false"><circle cx="24" cy="15" r="11" fill="none" stroke="currentColor" stroke-width="3.5"/><path d="M16.5 23.5 4 36" stroke="currentColor" stroke-width="6" stroke-linecap="round"/></svg>';
	}

	/* ------------------------------------------------------------------ */
	/* Selos informativos                                                  */
	/* ------------------------------------------------------------------ */

	public static function badges( $d ) {
		if ( empty( $d['selos'] ) ) {
			return '';
		}
		self::enqueue();
		$defs = InfoNutri_Data::badges();
		$out  = '<ul class="inn-selos">';
		foreach ( $d['selos'] as $key ) {
			if ( isset( $defs[ $key ] ) ) {
				$out .= '<li class="inn-selo inn-selo--' . esc_attr( $key ) . '">' . self::icon( $defs[ $key ]['icon'] ) . '<span>' . esc_html( $defs[ $key ]['label'] ) . '</span></li>';
			}
		}
		return $out . '</ul>';
	}

	public static function icon( $name ) {
		$paths = array(
			'leaf'      => '<path d="M5 19c0-8 6-14 15-14 0 9-6 15-14 15"/><path d="M5 19 13 11"/>',
			'wheat-off' => '<path d="M12 21V9"/><path d="M12 9c-2-1-3-3-3-5 2 0 3 1 3 3 0-2 1-3 3-3 0 2-1 4-3 5Z"/><path d="M12 15c-2-1-3-2-3-4 2 0 3 1 3 2 0-1 1-2 3-2 0 2-1 3-3 4Z"/><path d="M3 3l18 18"/>',
			'drop'      => '<path d="M12 3s6 7 6 11a6 6 0 0 1-12 0c0-4 6-11 6-11Z"/>',
			'sprout'    => '<path d="M12 21v-9"/><path d="M12 12c0-4-3-6-7-6 0 4 3 6 7 6Z"/><path d="M12 10c0-3 2-6 7-6 0 4-3 6-7 6Z"/>',
			'grain'     => '<path d="M12 21V5"/><path d="M12 9c-3 0-4-2-4-4 3 0 4 2 4 4Zm0 0c3 0 4-2 4-4-3 0-4 2-4 4Zm0 5c-3 0-4-2-4-4 3 0 4 2 4 4Zm0 0c3 0 4-2 4-4-3 0-4 2-4 4Z"/>',
			'cube-off'  => '<rect x="5" y="5" width="14" height="14" rx="2"/><path d="M3 3l18 18"/>',
			'feather'   => '<path d="M20 4C11 4 6 9 6 18h0c9 0 14-5 14-14Z"/><path d="M4 20 14 10"/>',
			'bolt'      => '<path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z"/>',
			'shield'    => '<path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6l-8-3Z"/><path d="m9 12 2 2 4-4"/>',
			'snow'      => '<path d="M12 2v20M4 7l16 10M20 7 4 17"/>',
			'thermo'    => '<path d="M14 14V5a2 2 0 0 0-4 0v9a4 4 0 1 0 4 0Z"/>',
		);
		$path = $paths[ $name ] ?? $paths['shield'];
		return '<svg class="inn-selo__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' . $path . '</svg>';
	}

	/* ------------------------------------------------------------------ */
	/* Ingredientes, alérgicos e cuidados                                  */
	/* ------------------------------------------------------------------ */

	public static function ingredientes( $d ) {
		if ( '' === trim( $d['ingredientes'] ) ) {
			return '';
		}
		return '<div class="inn-ingredientes">' . wpautop( esc_html( $d['ingredientes'] ) ) . '</div>';
	}

	public static function alergicos( $d ) {
		$statements = InfoNutri_Data::allergen_statements( $d );
		if ( ! $statements ) {
			return '';
		}
		$out = '<ul class="inn-alergicos">';
		foreach ( $statements as $type => $text ) {
			$out .= '<li class="inn-alergicos__item inn-alergicos__item--' . esc_attr( $type ) . '">' . esc_html( $text ) . '</li>';
		}
		return $out . '</ul>';
	}

	public static function cuidados( $d ) {
		$rows = '';
		foreach ( InfoNutri_Data::care_fields() as $key => $label ) {
			if ( '' !== trim( $d['cuidados'][ $key ] ) ) {
				$rows .= '<div class="inn-cuidados__item"><dt>' . esc_html( $label ) . '</dt><dd>' . nl2br( esc_html( $d['cuidados'][ $key ] ) ) . '</dd></div>';
			}
		}
		return $rows ? '<dl class="inn-cuidados">' . $rows . '</dl>' : '';
	}
}

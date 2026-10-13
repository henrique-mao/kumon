<?php
/**
 * Página de configurações: Configurações > Informação Nutricional.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class InfoNutri_Settings {

	const OPTION = 'infonutri_settings';

	public static function init() {
		add_action( 'admin_menu', array( __CLASS__, 'menu' ) );
		add_action( 'admin_init', array( __CLASS__, 'register' ) );
		add_filter( 'plugin_action_links_' . plugin_basename( INFONUTRI_FILE ), array( __CLASS__, 'action_links' ) );
	}

	public static function defaults() {
		return array(
			'register_cpt'  => 1,
			'cpt_slug'      => 'produtos',
			'post_types'    => array( 'inn_produto' ),
			'auto_append'   => 1,
			'layout'        => 'abas',
			'alert_layout'  => 'horizontal',
			'accent'        => '',
			'style'         => 'light',
			'footnote'      => __( '* Percentual de valores diários fornecidos pela porção.', 'infonutri' ),
		);
	}

	public static function get( $key = null ) {
		$opts = wp_parse_args( get_option( self::OPTION, array() ), self::defaults() );
		return null === $key ? $opts : ( $opts[ $key ] ?? null );
	}

	/** Post types que recebem o meta box. */
	public static function post_types() {
		$types = (array) self::get( 'post_types' );
		if ( ! self::get( 'register_cpt' ) ) {
			$types = array_diff( $types, array( 'inn_produto' ) );
		}
		return array_values( array_filter( $types, 'post_type_exists' ) );
	}

	/**
	 * Cor de destaque: configuração manual > cor do tema do BeTheme > padrão.
	 */
	public static function accent() {
		$accent = self::get( 'accent' );
		if ( $accent ) {
			return $accent;
		}
		if ( function_exists( 'mfn_opts_get' ) ) {
			$theme = mfn_opts_get( 'color-theme' );
			if ( $theme && sanitize_hex_color( $theme ) ) {
				return $theme;
			}
		}
		return '#0089f7';
	}

	public static function menu() {
		add_options_page(
			__( 'Informação Nutricional', 'infonutri' ),
			__( 'Informação Nutricional', 'infonutri' ),
			'manage_options',
			'infonutri',
			array( __CLASS__, 'page' )
		);
	}

	public static function action_links( $links ) {
		array_unshift( $links, '<a href="' . esc_url( admin_url( 'options-general.php?page=infonutri' ) ) . '">' . esc_html__( 'Configurações', 'infonutri' ) . '</a>' );
		return $links;
	}

	public static function register() {
		register_setting(
			'infonutri',
			self::OPTION,
			array( 'sanitize_callback' => array( __CLASS__, 'sanitize' ) )
		);
	}

	public static function sanitize( $in ) {
		$in  = is_array( $in ) ? $in : array();
		$old = self::get();
		$out = self::defaults();

		$out['register_cpt'] = empty( $in['register_cpt'] ) ? 0 : 1;
		$out['cpt_slug']     = sanitize_title( $in['cpt_slug'] ?? '' ) ? sanitize_title( $in['cpt_slug'] ) : 'produtos';
		$out['post_types']   = isset( $in['post_types'] ) ? array_map( 'sanitize_key', (array) $in['post_types'] ) : array();
		$out['auto_append']  = empty( $in['auto_append'] ) ? 0 : 1;
		$out['layout']       = in_array( $in['layout'] ?? '', array( 'abas', 'lista' ), true ) ? $in['layout'] : 'abas';
		$out['alert_layout'] = in_array( $in['alert_layout'] ?? '', array( 'horizontal', 'vertical' ), true ) ? $in['alert_layout'] : 'horizontal';
		$out['accent']       = sanitize_hex_color( $in['accent'] ?? '' ) ?: '';
		$out['style']        = in_array( $in['style'] ?? '', array( 'light', 'dark' ), true ) ? $in['style'] : 'light';
		$out['footnote']     = sanitize_text_field( $in['footnote'] ?? '' );

		if ( $out['register_cpt'] !== (int) $old['register_cpt'] || $out['cpt_slug'] !== $old['cpt_slug'] ) {
			update_option( 'infonutri_flush_rewrite', 1 );
		}
		return $out;
	}

	public static function page() {
		if ( ! current_user_can( 'manage_options' ) ) {
			return;
		}
		$o     = self::get();
		$types = get_post_types( array( 'public' => true ), 'objects' );
		unset( $types['attachment'] );
		$name = self::OPTION;
		?>
		<div class="wrap infonutri-settings">
			<h1><?php esc_html_e( 'Informação Nutricional', 'infonutri' ); ?></h1>
			<form method="post" action="options.php">
				<?php settings_fields( 'infonutri' ); ?>
				<table class="form-table" role="presentation">
					<tr>
						<th scope="row"><?php esc_html_e( 'Tipo de post "Produtos"', 'infonutri' ); ?></th>
						<td>
							<label><input type="checkbox" name="<?php echo esc_attr( $name ); ?>[register_cpt]" value="1" <?php checked( $o['register_cpt'] ); ?>>
							<?php esc_html_e( 'Registrar o tipo de post "Produtos" deste plugin', 'infonutri' ); ?></label>
							<p class="description"><?php esc_html_e( 'Desmarque se você já criou o tipo de post de produtos pelo Custom Post Type UI (ou usa WooCommerce) e selecione-o abaixo.', 'infonutri' ); ?></p>
							<p><label><?php esc_html_e( 'Slug da URL:', 'infonutri' ); ?> <code><?php echo esc_html( home_url( '/' ) ); ?></code><input type="text" name="<?php echo esc_attr( $name ); ?>[cpt_slug]" value="<?php echo esc_attr( $o['cpt_slug'] ); ?>" class="regular-text" style="width:160px"></label></p>
						</td>
					</tr>
					<tr>
						<th scope="row"><?php esc_html_e( 'Exibir cadastro nos tipos de post', 'infonutri' ); ?></th>
						<td>
							<?php foreach ( $types as $type ) : ?>
								<label style="display:block;margin-bottom:4px">
									<input type="checkbox" name="<?php echo esc_attr( $name ); ?>[post_types][]" value="<?php echo esc_attr( $type->name ); ?>" <?php checked( in_array( $type->name, (array) $o['post_types'], true ) ); ?>>
									<?php echo esc_html( $type->labels->name ); ?> <code><?php echo esc_html( $type->name ); ?></code>
								</label>
							<?php endforeach; ?>
						</td>
					</tr>
					<tr>
						<th scope="row"><?php esc_html_e( 'Exibição automática', 'infonutri' ); ?></th>
						<td><label><input type="checkbox" name="<?php echo esc_attr( $name ); ?>[auto_append]" value="1" <?php checked( $o['auto_append'] ); ?>>
						<?php esc_html_e( 'Inserir a ficha nutricional ao final do conteúdo do produto (desative se for montar a página com o widget do Elementor ou shortcode).', 'infonutri' ); ?></label></td>
					</tr>
					<tr>
						<th scope="row"><?php esc_html_e( 'Layout da ficha', 'infonutri' ); ?></th>
						<td>
							<select name="<?php echo esc_attr( $name ); ?>[layout]">
								<option value="abas" <?php selected( $o['layout'], 'abas' ); ?>><?php esc_html_e( 'Abas', 'infonutri' ); ?></option>
								<option value="lista" <?php selected( $o['layout'], 'lista' ); ?>><?php esc_html_e( 'Seções empilhadas', 'infonutri' ); ?></option>
							</select>
							<select name="<?php echo esc_attr( $name ); ?>[style]">
								<option value="light" <?php selected( $o['style'], 'light' ); ?>><?php esc_html_e( 'Fundo claro', 'infonutri' ); ?></option>
								<option value="dark" <?php selected( $o['style'], 'dark' ); ?>><?php esc_html_e( 'Fundo escuro', 'infonutri' ); ?></option>
							</select>
						</td>
					</tr>
					<tr>
						<th scope="row"><?php esc_html_e( 'Selo frontal "Alto em"', 'infonutri' ); ?></th>
						<td>
							<select name="<?php echo esc_attr( $name ); ?>[alert_layout]">
								<option value="horizontal" <?php selected( $o['alert_layout'], 'horizontal' ); ?>><?php esc_html_e( 'Horizontal', 'infonutri' ); ?></option>
								<option value="vertical" <?php selected( $o['alert_layout'], 'vertical' ); ?>><?php esc_html_e( 'Vertical', 'infonutri' ); ?></option>
							</select>
						</td>
					</tr>
					<tr>
						<th scope="row"><?php esc_html_e( 'Cor de destaque', 'infonutri' ); ?></th>
						<td>
							<input type="text" class="infonutri-color" name="<?php echo esc_attr( $name ); ?>[accent]" value="<?php echo esc_attr( $o['accent'] ); ?>" placeholder="<?php echo esc_attr( self::accent() ); ?>">
							<p class="description"><?php esc_html_e( 'Deixe em branco para usar automaticamente a "Theme color" do BeTheme (Sushi3).', 'infonutri' ); ?></p>
						</td>
					</tr>
					<tr>
						<th scope="row"><?php esc_html_e( 'Nota de rodapé da tabela', 'infonutri' ); ?></th>
						<td><input type="text" class="large-text" name="<?php echo esc_attr( $name ); ?>[footnote]" value="<?php echo esc_attr( $o['footnote'] ); ?>"></td>
					</tr>
				</table>
				<?php submit_button(); ?>
			</form>

			<h2><?php esc_html_e( 'Como exibir', 'infonutri' ); ?></h2>
			<ul class="infonutri-help">
				<li><strong>Elementor:</strong> <?php esc_html_e( 'procure o widget "Informação Nutricional" na categoria "Informação Nutricional".', 'infonutri' ); ?></li>
				<li><code>[info_nutricional]</code> — <?php esc_html_e( 'ficha completa (selos, tabela, ingredientes, alérgicos e cuidados).', 'infonutri' ); ?></li>
				<li><code>[info_nutricional id="123" secoes="tabela,alergicos" layout="lista"]</code></li>
				<li><code>[inn_tabela]</code> <code>[inn_alto_em layout="vertical"]</code> <code>[inn_selos]</code> <code>[inn_ingredientes]</code> <code>[inn_alergicos]</code> <code>[inn_cuidados]</code></li>
			</ul>
		</div>
		<?php
	}
}

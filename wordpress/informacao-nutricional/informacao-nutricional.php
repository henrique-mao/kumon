<?php
/**
 * Plugin Name:       Informação Nutricional
 * Description:       Cadastro de Informação Nutricional (RDC 429/2020 e IN 75/2020), Ingredientes, Alérgicos, Cuidados e selos frontais "Alto em" para produtos de supermercado. Integra com Elementor, Custom Post Type UI e BeTheme.
 * Version:           1.0.0
 * Requires at least: 5.8
 * Requires PHP:      7.4
 * Author:            Henrique Araujo
 * License:           GPL-2.0-or-later
 * Text Domain:       infonutri
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

define( 'INFONUTRI_VERSION', '1.0.0' );
define( 'INFONUTRI_FILE', __FILE__ );
define( 'INFONUTRI_DIR', plugin_dir_path( __FILE__ ) );
define( 'INFONUTRI_URL', plugin_dir_url( __FILE__ ) );

require_once INFONUTRI_DIR . 'includes/class-infonutri-data.php';
require_once INFONUTRI_DIR . 'includes/class-infonutri-settings.php';
require_once INFONUTRI_DIR . 'includes/class-infonutri-cpt.php';
require_once INFONUTRI_DIR . 'includes/class-infonutri-admin.php';
require_once INFONUTRI_DIR . 'includes/class-infonutri-render.php';
require_once INFONUTRI_DIR . 'includes/class-infonutri-shortcodes.php';

InfoNutri_Settings::init();
InfoNutri_CPT::init();
InfoNutri_Admin::init();
InfoNutri_Render::init();
InfoNutri_Shortcodes::init();

// Elementor: widget "Informação Nutricional".
add_action(
	'elementor/init',
	function () {
		require_once INFONUTRI_DIR . 'includes/elementor/class-infonutri-elementor.php';
		InfoNutri_Elementor::init();
	}
);

register_activation_hook(
	__FILE__,
	function () {
		InfoNutri_CPT::register();
		flush_rewrite_rules();
	}
);

register_deactivation_hook( __FILE__, 'flush_rewrite_rules' );

/**
 * Helper público: retorna os dados nutricionais normalizados de um post.
 *
 * @param int|null $post_id ID do produto (padrão: post atual).
 * @return array
 */
function infonutri_get( $post_id = null ) {
	return InfoNutri_Data::get( $post_id ? $post_id : get_the_ID() );
}

<?php
/**
 * Integração com o Elementor: categoria + widget "Informação Nutricional".
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class InfoNutri_Elementor {

	public static function init() {
		add_action( 'elementor/elements/categories_registered', array( __CLASS__, 'category' ) );
		add_action( 'elementor/widgets/register', array( __CLASS__, 'widgets' ) );
		add_action( 'elementor/frontend/after_register_scripts', array( 'InfoNutri_Render', 'register_assets' ) );
		add_action( 'elementor/frontend/after_register_styles', array( 'InfoNutri_Render', 'register_assets' ) );
	}

	public static function category( $manager ) {
		$manager->add_category(
			'infonutri',
			array(
				'title' => __( 'Informação Nutricional', 'infonutri' ),
				'icon'  => 'eicon-table',
			)
		);
	}

	public static function widgets( $manager ) {
		require_once __DIR__ . '/class-infonutri-widget.php';
		$manager->register( new InfoNutri_Widget() );
	}
}

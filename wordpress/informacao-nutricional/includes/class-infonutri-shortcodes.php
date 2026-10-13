<?php
/**
 * Shortcodes.
 *
 * [info_nutricional id="" secoes="alertas,selos,tabela,ingredientes,alergicos,cuidados" layout="abas|lista" estilo="light|dark" titulo=""]
 * [inn_tabela id=""] [inn_alto_em id="" layout="horizontal|vertical"] [inn_selos id=""]
 * [inn_ingredientes id=""] [inn_alergicos id=""] [inn_cuidados id=""]
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class InfoNutri_Shortcodes {

	public static function init() {
		add_shortcode( 'info_nutricional', array( __CLASS__, 'full' ) );
		add_shortcode( 'inn_tabela', array( __CLASS__, 'tabela' ) );
		add_shortcode( 'inn_alto_em', array( __CLASS__, 'alto_em' ) );
		add_shortcode( 'inn_selos', array( __CLASS__, 'selos' ) );
		add_shortcode( 'inn_ingredientes', array( __CLASS__, 'ingredientes' ) );
		add_shortcode( 'inn_alergicos', array( __CLASS__, 'alergicos' ) );
		add_shortcode( 'inn_cuidados', array( __CLASS__, 'cuidados' ) );
	}

	private static function post_id( $atts ) {
		return ! empty( $atts['id'] ) ? absint( $atts['id'] ) : get_the_ID();
	}

	public static function full( $atts ) {
		$atts = shortcode_atts(
			array(
				'id'     => '',
				'secoes' => 'alertas,selos,tabela,ingredientes,alergicos,cuidados',
				'layout' => InfoNutri_Settings::get( 'layout' ),
				'alto_em' => InfoNutri_Settings::get( 'alert_layout' ),
				'estilo' => InfoNutri_Settings::get( 'style' ),
				'titulo' => '',
			),
			$atts,
			'info_nutricional'
		);
		return InfoNutri_Render::full(
			self::post_id( $atts ),
			array(
				'secoes'       => array_map( 'trim', explode( ',', $atts['secoes'] ) ),
				'layout'       => 'lista' === $atts['layout'] ? 'lista' : 'abas',
				'alert_layout' => 'vertical' === $atts['alto_em'] ? 'vertical' : 'horizontal',
				'style'        => 'dark' === $atts['estilo'] ? 'dark' : 'light',
				'title'        => sanitize_text_field( $atts['titulo'] ),
			)
		);
	}

	private static function part( $atts, $method ) {
		$id = self::post_id( (array) $atts );
		if ( ! $id || ! InfoNutri_Data::has_data( $id ) ) {
			return '';
		}
		InfoNutri_Render::enqueue();
		$html = call_user_func( array( 'InfoNutri_Render', $method ), InfoNutri_Data::get( $id ) );
		return $html ? '<div class="inn-ficha inn-ficha--parte">' . $html . '</div>' : '';
	}

	public static function tabela( $atts ) {
		return self::part( $atts, 'tabela' );
	}

	public static function selos( $atts ) {
		return self::part( $atts, 'badges' );
	}

	public static function ingredientes( $atts ) {
		return self::part( $atts, 'ingredientes' );
	}

	public static function alergicos( $atts ) {
		return self::part( $atts, 'alergicos' );
	}

	public static function cuidados( $atts ) {
		return self::part( $atts, 'cuidados' );
	}

	public static function alto_em( $atts ) {
		$atts = shortcode_atts( array( 'id' => '', 'layout' => InfoNutri_Settings::get( 'alert_layout' ) ), $atts, 'inn_alto_em' );
		$id   = self::post_id( $atts );
		if ( ! $id || ! InfoNutri_Data::has_data( $id ) ) {
			return '';
		}
		return InfoNutri_Render::alerts_box( InfoNutri_Data::active_alerts( InfoNutri_Data::get( $id ) ), $atts['layout'] );
	}
}

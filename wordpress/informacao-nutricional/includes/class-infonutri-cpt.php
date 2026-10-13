<?php
/**
 * Tipo de post "Produtos" e taxonomia "Categorias de produto" (opcionais).
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class InfoNutri_CPT {

	public static function init() {
		add_action( 'init', array( __CLASS__, 'register' ) );
		add_action( 'init', array( __CLASS__, 'maybe_flush' ), 99 );
	}

	public static function register() {
		if ( ! InfoNutri_Settings::get( 'register_cpt' ) ) {
			return;
		}
		$slug = InfoNutri_Settings::get( 'cpt_slug' );

		register_post_type(
			'inn_produto',
			array(
				'labels'        => array(
					'name'               => __( 'Produtos', 'infonutri' ),
					'singular_name'      => __( 'Produto', 'infonutri' ),
					'add_new'            => __( 'Adicionar produto', 'infonutri' ),
					'add_new_item'       => __( 'Adicionar novo produto', 'infonutri' ),
					'edit_item'          => __( 'Editar produto', 'infonutri' ),
					'new_item'           => __( 'Novo produto', 'infonutri' ),
					'view_item'          => __( 'Ver produto', 'infonutri' ),
					'search_items'       => __( 'Buscar produtos', 'infonutri' ),
					'not_found'          => __( 'Nenhum produto encontrado', 'infonutri' ),
					'not_found_in_trash' => __( 'Nenhum produto na lixeira', 'infonutri' ),
					'all_items'          => __( 'Todos os produtos', 'infonutri' ),
					'menu_name'          => __( 'Produtos', 'infonutri' ),
				),
				'public'        => true,
				'has_archive'   => true,
				'show_in_rest'  => true, // Gutenberg / Elementor / REST API.
				'menu_icon'     => 'dashicons-carrot',
				'menu_position' => 25,
				'supports'      => array( 'title', 'editor', 'excerpt', 'thumbnail', 'custom-fields', 'revisions', 'elementor' ),
				'rewrite'       => array( 'slug' => $slug, 'with_front' => false ),
			)
		);

		register_taxonomy(
			'inn_categoria',
			'inn_produto',
			array(
				'labels'            => array(
					'name'          => __( 'Categorias de produto', 'infonutri' ),
					'singular_name' => __( 'Categoria de produto', 'infonutri' ),
					'menu_name'     => __( 'Categorias', 'infonutri' ),
				),
				'hierarchical'      => true,
				'show_in_rest'      => true,
				'show_admin_column' => true,
				'rewrite'           => array( 'slug' => $slug . '-categoria', 'with_front' => false ),
			)
		);

		// Permite editar os produtos com o Elementor.
		add_post_type_support( 'inn_produto', 'elementor' );
	}

	public static function maybe_flush() {
		if ( get_option( 'infonutri_flush_rewrite' ) ) {
			delete_option( 'infonutri_flush_rewrite' );
			flush_rewrite_rules();
		}
	}
}

<?php
/**
 * Widget Elementor "Informação Nutricional".
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

use Elementor\Controls_Manager;
use Elementor\Group_Control_Border;
use Elementor\Group_Control_Box_Shadow;
use Elementor\Group_Control_Typography;
use Elementor\Widget_Base;

class InfoNutri_Widget extends Widget_Base {

	public function get_name() {
		return 'infonutri';
	}

	public function get_title() {
		return __( 'Informação Nutricional', 'infonutri' );
	}

	public function get_icon() {
		return 'eicon-table';
	}

	public function get_categories() {
		return array( 'infonutri', 'general' );
	}

	public function get_keywords() {
		return array( 'nutricional', 'tabela', 'alergicos', 'ingredientes', 'alto em', 'selo', 'produto' );
	}

	public function get_style_depends() {
		return array( 'infonutri' );
	}

	public function get_script_depends() {
		return array( 'infonutri' );
	}

	private function product_options() {
		$options = array();
		$posts   = get_posts(
			array(
				'post_type'      => InfoNutri_Settings::post_types(),
				'posts_per_page' => 500,
				'orderby'        => 'title',
				'order'          => 'ASC',
				'post_status'    => array( 'publish', 'draft', 'private' ),
				'fields'         => 'ids',
			)
		);
		foreach ( $posts as $id ) {
			$options[ $id ] = get_the_title( $id ) . ' (#' . $id . ')';
		}
		return $options;
	}

	protected function register_controls() {

		/* Conteúdo ------------------------------------------------------- */
		$this->start_controls_section( 'section_content', array( 'label' => __( 'Conteúdo', 'infonutri' ) ) );

		$this->add_control(
			'source',
			array(
				'label'   => __( 'Produto', 'infonutri' ),
				'type'    => Controls_Manager::SELECT,
				'default' => 'current',
				'options' => array(
					'current' => __( 'Produto atual (página/template)', 'infonutri' ),
					'custom'  => __( 'Escolher produto', 'infonutri' ),
				),
			)
		);

		$this->add_control(
			'product_id',
			array(
				'label'       => __( 'Selecione o produto', 'infonutri' ),
				'type'        => Controls_Manager::SELECT2,
				'options'     => $this->product_options(),
				'label_block' => true,
				'condition'   => array( 'source' => 'custom' ),
			)
		);

		$this->add_control(
			'title',
			array(
				'label' => __( 'Título', 'infonutri' ),
				'type'  => Controls_Manager::TEXT,
			)
		);

		$this->add_control(
			'sections',
			array(
				'label'       => __( 'Seções', 'infonutri' ),
				'type'        => Controls_Manager::SELECT2,
				'multiple'    => true,
				'label_block' => true,
				'default'     => array( 'alertas', 'selos', 'tabela', 'ingredientes', 'alergicos', 'cuidados' ),
				'options'     => array(
					'alertas'      => __( 'Selo frontal "Alto em"', 'infonutri' ),
					'selos'        => __( 'Selos informativos', 'infonutri' ),
					'tabela'       => __( 'Tabela nutricional', 'infonutri' ),
					'ingredientes' => __( 'Ingredientes', 'infonutri' ),
					'alergicos'    => __( 'Alérgicos', 'infonutri' ),
					'cuidados'     => __( 'Cuidados', 'infonutri' ),
				),
			)
		);

		$this->add_control(
			'layout',
			array(
				'label'   => __( 'Layout', 'infonutri' ),
				'type'    => Controls_Manager::SELECT,
				'default' => 'abas',
				'options' => array(
					'abas'  => __( 'Abas', 'infonutri' ),
					'lista' => __( 'Seções empilhadas', 'infonutri' ),
				),
			)
		);

		$this->add_control(
			'alert_layout',
			array(
				'label'   => __( 'Selo "Alto em"', 'infonutri' ),
				'type'    => Controls_Manager::SELECT,
				'default' => 'horizontal',
				'options' => array(
					'horizontal' => __( 'Horizontal', 'infonutri' ),
					'vertical'   => __( 'Vertical', 'infonutri' ),
				),
			)
		);

		$this->add_control(
			'style',
			array(
				'label'   => __( 'Esquema', 'infonutri' ),
				'type'    => Controls_Manager::SELECT,
				'default' => 'light',
				'options' => array(
					'light' => __( 'Fundo claro', 'infonutri' ),
					'dark'  => __( 'Fundo escuro', 'infonutri' ),
				),
			)
		);

		$this->end_controls_section();

		/* Estilo: geral -------------------------------------------------- */
		$this->start_controls_section(
			'section_style_box',
			array(
				'label' => __( 'Caixa', 'infonutri' ),
				'tab'   => Controls_Manager::TAB_STYLE,
			)
		);

		$this->add_control(
			'accent',
			array(
				'label'       => __( 'Cor de destaque', 'infonutri' ),
				'description' => __( 'Padrão: "Theme color" do BeTheme.', 'infonutri' ),
				'type'        => Controls_Manager::COLOR,
				'selectors'   => array( '{{WRAPPER}} .inn-ficha' => '--inn-accent: {{VALUE}};' ),
			)
		);

		$this->add_control(
			'bg',
			array(
				'label'     => __( 'Fundo', 'infonutri' ),
				'type'      => Controls_Manager::COLOR,
				'selectors' => array( '{{WRAPPER}} .inn-ficha' => '--inn-bg: {{VALUE}};' ),
			)
		);

		$this->add_control(
			'text',
			array(
				'label'     => __( 'Texto', 'infonutri' ),
				'type'      => Controls_Manager::COLOR,
				'selectors' => array( '{{WRAPPER}} .inn-ficha' => '--inn-text: {{VALUE}};' ),
			)
		);

		$this->add_responsive_control(
			'padding',
			array(
				'label'      => __( 'Espaçamento interno', 'infonutri' ),
				'type'       => Controls_Manager::DIMENSIONS,
				'size_units' => array( 'px', 'em', '%' ),
				'selectors'  => array( '{{WRAPPER}} .inn-ficha' => 'padding: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}};' ),
			)
		);

		$this->add_control(
			'radius',
			array(
				'label'      => __( 'Arredondamento', 'infonutri' ),
				'type'       => Controls_Manager::SLIDER,
				'size_units' => array( 'px' ),
				'range'      => array( 'px' => array( 'min' => 0, 'max' => 40 ) ),
				'selectors'  => array( '{{WRAPPER}} .inn-ficha' => '--inn-radius: {{SIZE}}{{UNIT}};' ),
			)
		);

		$this->add_group_control( Group_Control_Border::get_type(), array( 'name' => 'border', 'selector' => '{{WRAPPER}} .inn-ficha' ) );
		$this->add_group_control( Group_Control_Box_Shadow::get_type(), array( 'name' => 'shadow', 'selector' => '{{WRAPPER}} .inn-ficha' ) );

		$this->end_controls_section();

		/* Estilo: tipografia --------------------------------------------- */
		$this->start_controls_section(
			'section_style_type',
			array(
				'label' => __( 'Tipografia', 'infonutri' ),
				'tab'   => Controls_Manager::TAB_STYLE,
			)
		);

		$this->add_group_control(
			Group_Control_Typography::get_type(),
			array(
				'name'     => 'title_typo',
				'label'    => __( 'Título', 'infonutri' ),
				'selector' => '{{WRAPPER}} .inn-ficha__title',
			)
		);

		$this->add_group_control(
			Group_Control_Typography::get_type(),
			array(
				'name'     => 'tabs_typo',
				'label'    => __( 'Abas / títulos das seções', 'infonutri' ),
				'selector' => '{{WRAPPER}} .inn-tabs__tab, {{WRAPPER}} .inn-panel__title',
			)
		);

		$this->add_group_control(
			Group_Control_Typography::get_type(),
			array(
				'name'     => 'body_typo',
				'label'    => __( 'Texto', 'infonutri' ),
				'selector' => '{{WRAPPER}} .inn-ingredientes, {{WRAPPER}} .inn-alergicos, {{WRAPPER}} .inn-cuidados',
			)
		);

		$this->end_controls_section();
	}

	protected function render() {
		$s       = $this->get_settings_for_display();
		$post_id = ( 'custom' === $s['source'] && ! empty( $s['product_id'] ) ) ? absint( $s['product_id'] ) : get_the_ID();

		$html = InfoNutri_Render::full(
			$post_id,
			array(
				'secoes'       => (array) $s['sections'],
				'layout'       => $s['layout'],
				'alert_layout' => $s['alert_layout'],
				'style'        => $s['style'],
				'title'        => $s['title'],
			)
		);

		if ( '' === $html && \Elementor\Plugin::$instance->editor->is_edit_mode() ) {
			echo '<div class="inn-ficha inn-ficha--vazio">' . esc_html__( 'Informação Nutricional: este produto ainda não tem dados cadastrados. Escolha um produto em "Conteúdo > Produto" para visualizar.', 'infonutri' ) . '</div>';
			return;
		}
		echo $html; // phpcs:ignore WordPress.Security.EscapeOutput -- escapado em InfoNutri_Render.
	}
}

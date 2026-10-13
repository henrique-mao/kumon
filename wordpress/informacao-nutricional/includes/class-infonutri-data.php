<?php
/**
 * Modelo de dados: definições regulatórias, sanitização, cálculos e formatação.
 *
 * Referências:
 * - RDC ANVISA 429/2020 e IN 75/2020 (rotulagem nutricional e frontal).
 * - RDC ANVISA 26/2015 (alergênicos), Lei 10.674/2003 (glúten), RDC 136/2017 (lactose).
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class InfoNutri_Data {

	const META_KEY = '_infonutri';

	/**
	 * Nutrientes obrigatórios da tabela (IN 75/2020, Anexo II e IV).
	 * vd = Valor Diário de referência; level = recuo na tabela.
	 */
	public static function nutrients() {
		return array(
			'energia'              => array( 'label' => __( 'Valor energético', 'infonutri' ), 'unit' => 'kcal', 'vd' => 2000, 'level' => 0 ),
			'carboidratos'         => array( 'label' => __( 'Carboidratos totais', 'infonutri' ), 'unit' => 'g', 'vd' => 300, 'level' => 0 ),
			'acucares_totais'      => array( 'label' => __( 'Açúcares totais', 'infonutri' ), 'unit' => 'g', 'vd' => null, 'level' => 1 ),
			'acucares_adicionados' => array( 'label' => __( 'Açúcares adicionados', 'infonutri' ), 'unit' => 'g', 'vd' => 50, 'level' => 2 ),
			'proteinas'            => array( 'label' => __( 'Proteínas', 'infonutri' ), 'unit' => 'g', 'vd' => 50, 'level' => 0 ),
			'gorduras_totais'      => array( 'label' => __( 'Gorduras totais', 'infonutri' ), 'unit' => 'g', 'vd' => 65, 'level' => 0 ),
			'gorduras_saturadas'   => array( 'label' => __( 'Gorduras saturadas', 'infonutri' ), 'unit' => 'g', 'vd' => 20, 'level' => 1 ),
			'gorduras_trans'       => array( 'label' => __( 'Gorduras trans', 'infonutri' ), 'unit' => 'g', 'vd' => 2, 'level' => 1 ),
			'fibras'               => array( 'label' => __( 'Fibra alimentar', 'infonutri' ), 'unit' => 'g', 'vd' => 25, 'level' => 0 ),
			'sodio'                => array( 'label' => __( 'Sódio', 'infonutri' ), 'unit' => 'mg', 'vd' => 2000, 'level' => 0 ),
		);
	}

	/** Principais alimentos alergênicos (RDC 26/2015, Anexo). */
	public static function allergens() {
		return array(
			'trigo'           => __( 'Trigo', 'infonutri' ),
			'centeio'         => __( 'Centeio', 'infonutri' ),
			'cevada'          => __( 'Cevada', 'infonutri' ),
			'aveia'           => __( 'Aveia', 'infonutri' ),
			'crustaceos'      => __( 'Crustáceos', 'infonutri' ),
			'ovos'            => __( 'Ovos', 'infonutri' ),
			'peixes'          => __( 'Peixes', 'infonutri' ),
			'amendoim'        => __( 'Amendoim', 'infonutri' ),
			'soja'            => __( 'Soja', 'infonutri' ),
			'leite'           => __( 'Leite', 'infonutri' ),
			'amendoa'         => __( 'Amêndoa', 'infonutri' ),
			'avela'           => __( 'Avelã', 'infonutri' ),
			'castanha_caju'   => __( 'Castanha-de-caju', 'infonutri' ),
			'castanha_para'   => __( 'Castanha-do-pará', 'infonutri' ),
			'macadamia'       => __( 'Macadâmia', 'infonutri' ),
			'nozes'           => __( 'Nozes', 'infonutri' ),
			'peca'            => __( 'Pecã', 'infonutri' ),
			'pistache'        => __( 'Pistache', 'infonutri' ),
			'pinoli'          => __( 'Pinoli', 'infonutri' ),
			'castanhas'       => __( 'Castanhas', 'infonutri' ),
			'latex'           => __( 'Látex natural', 'infonutri' ),
		);
	}

	/** Rotulagem nutricional frontal "ALTO EM" (RDC 429/2020, Anexo XV), na ordem exigida. */
	public static function alerts() {
		return array(
			'acucar_adicionado' => array(
				'label'    => __( 'Açúcar adicionado', 'infonutri' ),
				'nutrient' => 'acucares_adicionados',
				'solid'    => 15,   // g / 100 g
				'liquid'   => 7.5,  // g / 100 ml
			),
			'gordura_saturada'  => array(
				'label'    => __( 'Gordura saturada', 'infonutri' ),
				'nutrient' => 'gorduras_saturadas',
				'solid'    => 6,
				'liquid'   => 3,
			),
			'sodio'             => array(
				'label'    => __( 'Sódio', 'infonutri' ),
				'nutrient' => 'sodio',
				'solid'    => 600,  // mg / 100 g
				'liquid'   => 300,  // mg / 100 ml
			),
		);
	}

	/** Selos informativos (opcionais, de marketing / atributos do produto). */
	public static function badges() {
		return array(
			'sem_gluten'        => array( 'label' => __( 'Sem glúten', 'infonutri' ), 'icon' => 'wheat-off' ),
			'zero_lactose'      => array( 'label' => __( 'Zero lactose', 'infonutri' ), 'icon' => 'drop' ),
			'vegano'            => array( 'label' => __( 'Vegano', 'infonutri' ), 'icon' => 'leaf' ),
			'vegetariano'       => array( 'label' => __( 'Vegetariano', 'infonutri' ), 'icon' => 'leaf' ),
			'organico'          => array( 'label' => __( 'Orgânico', 'infonutri' ), 'icon' => 'sprout' ),
			'integral'          => array( 'label' => __( 'Integral', 'infonutri' ), 'icon' => 'grain' ),
			'zero_acucar'       => array( 'label' => __( 'Zero açúcar', 'infonutri' ), 'icon' => 'cube-off' ),
			'light'             => array( 'label' => __( 'Light', 'infonutri' ), 'icon' => 'feather' ),
			'fonte_fibras'      => array( 'label' => __( 'Fonte de fibras', 'infonutri' ), 'icon' => 'grain' ),
			'rico_proteinas'    => array( 'label' => __( 'Rico em proteínas', 'infonutri' ), 'icon' => 'bolt' ),
			'sem_conservantes'  => array( 'label' => __( 'Sem conservantes', 'infonutri' ), 'icon' => 'shield' ),
			'sem_transgenicos'  => array( 'label' => __( 'Não transgênico', 'infonutri' ), 'icon' => 'shield' ),
			'congelado'         => array( 'label' => __( 'Manter congelado', 'infonutri' ), 'icon' => 'snow' ),
			'refrigerado'       => array( 'label' => __( 'Manter refrigerado', 'infonutri' ), 'icon' => 'thermo' ),
		);
	}

	/** Campos de cuidados / conservação. */
	public static function care_fields() {
		return array(
			'conservacao' => __( 'Conservação', 'infonutri' ),
			'apos_aberto' => __( 'Após aberto', 'infonutri' ),
			'preparo'     => __( 'Modo de preparo', 'infonutri' ),
			'consumo'     => __( 'Recomendações de consumo', 'infonutri' ),
			'outros'      => __( 'Outros cuidados', 'infonutri' ),
		);
	}

	public static function defaults() {
		$empty_nutrients = array_fill_keys( array_keys( self::nutrients() ), '' );
		return array(
			'unidade'           => 'g',
			'porcao'            => '',
			'medida_caseira'    => '',
			'porcoes_embalagem' => '',
			'base'              => $empty_nutrients,
			'porcao_manual'     => $empty_nutrients,
			'extras'            => array(),
			'ingredientes'      => '',
			'alergicos'         => array(),
			'alergicos_outros'  => '',
			'derivados'         => array(),
			'pode_conter'       => array(),
			'pode_conter_outros' => '',
			'gluten'            => '',
			'lactose'           => '',
			'cuidados'          => array_fill_keys( array_keys( self::care_fields() ), '' ),
			'alerta_modo'       => 'auto',
			'alertas'           => array(),
			'selos'             => array(),
		);
	}

	public static function get( $post_id ) {
		$raw = get_post_meta( (int) $post_id, self::META_KEY, true );
		$raw = is_array( $raw ) ? $raw : array();
		$data = array_replace_recursive( self::defaults(), $raw );
		// Listas não devem ser mescladas por índice.
		foreach ( array( 'extras', 'alergicos', 'derivados', 'pode_conter', 'alertas', 'selos' ) as $list ) {
			$data[ $list ] = isset( $raw[ $list ] ) && is_array( $raw[ $list ] ) ? $raw[ $list ] : array();
		}
		return $data;
	}

	public static function has_data( $post_id ) {
		$raw = get_post_meta( (int) $post_id, self::META_KEY, true );
		return ! empty( $raw );
	}

	/**
	 * Sanitiza o array enviado pelo formulário do meta box.
	 */
	public static function sanitize( $in ) {
		$in  = is_array( $in ) ? wp_unslash( $in ) : array();
		$out = self::defaults();

		$out['unidade']           = ( isset( $in['unidade'] ) && 'ml' === $in['unidade'] ) ? 'ml' : 'g';
		$out['porcao']            = self::clean_number( $in['porcao'] ?? '' );
		$out['medida_caseira']    = sanitize_text_field( $in['medida_caseira'] ?? '' );
		$out['porcoes_embalagem'] = sanitize_text_field( $in['porcoes_embalagem'] ?? '' );

		foreach ( array_keys( self::nutrients() ) as $key ) {
			$out['base'][ $key ]          = self::clean_number( $in['base'][ $key ] ?? '' );
			$out['porcao_manual'][ $key ] = self::clean_number( $in['porcao_manual'][ $key ] ?? '' );
		}

		if ( ! empty( $in['extras'] ) && is_array( $in['extras'] ) ) {
			foreach ( $in['extras'] as $row ) {
				$nome = sanitize_text_field( $row['nome'] ?? '' );
				if ( '' === $nome ) {
					continue;
				}
				$out['extras'][] = array(
					'nome'   => $nome,
					'unidade' => sanitize_text_field( $row['unidade'] ?? 'mg' ),
					'base'   => self::clean_number( $row['base'] ?? '' ),
					'porcao' => self::clean_number( $row['porcao'] ?? '' ),
					'vd'     => self::clean_number( $row['vd'] ?? '' ),
				);
			}
		}

		$out['ingredientes'] = sanitize_textarea_field( $in['ingredientes'] ?? '' );

		$allergen_keys        = array_keys( self::allergens() );
		$out['alergicos']     = self::clean_keys( $in['alergicos'] ?? array(), $allergen_keys );
		$out['derivados']     = self::clean_keys( $in['derivados'] ?? array(), $allergen_keys );
		$out['pode_conter']   = self::clean_keys( $in['pode_conter'] ?? array(), $allergen_keys );
		$out['alergicos_outros']   = sanitize_text_field( $in['alergicos_outros'] ?? '' );
		$out['pode_conter_outros'] = sanitize_text_field( $in['pode_conter_outros'] ?? '' );
		$out['gluten']  = in_array( $in['gluten'] ?? '', array( 'contem', 'nao_contem' ), true ) ? $in['gluten'] : '';
		$out['lactose'] = in_array( $in['lactose'] ?? '', array( 'contem', 'nao_contem', 'baixo' ), true ) ? $in['lactose'] : '';

		foreach ( array_keys( self::care_fields() ) as $key ) {
			$out['cuidados'][ $key ] = sanitize_textarea_field( $in['cuidados'][ $key ] ?? '' );
		}

		$out['alerta_modo'] = ( isset( $in['alerta_modo'] ) && 'manual' === $in['alerta_modo'] ) ? 'manual' : 'auto';
		$out['alertas']     = self::clean_keys( $in['alertas'] ?? array(), array_keys( self::alerts() ) );
		$out['selos']       = self::clean_keys( $in['selos'] ?? array(), array_keys( self::badges() ) );

		return $out;
	}

	private static function clean_keys( $values, $allowed ) {
		$values = is_array( $values ) ? array_map( 'sanitize_key', $values ) : array();
		return array_values( array_intersect( $allowed, $values ) );
	}

	/** Aceita "2,4", "2.4", "1.200,5" e retorna string numérica com ponto ("2.4") ou "". */
	public static function clean_number( $value ) {
		$value = trim( (string) $value );
		if ( '' === $value ) {
			return '';
		}
		if ( false !== strpos( $value, ',' ) ) {
			$value = str_replace( '.', '', $value );
			$value = str_replace( ',', '.', $value );
		}
		$value = preg_replace( '/[^0-9.\-]/', '', $value );
		return is_numeric( $value ) ? (string) ( 0 + $value ) : '';
	}

	/* ------------------------------------------------------------------ */
	/* Cálculos                                                            */
	/* ------------------------------------------------------------------ */

	/** Valor do nutriente na porção (manual tem prioridade sobre o cálculo). */
	public static function portion_value( $data, $key ) {
		if ( '' !== ( $data['porcao_manual'][ $key ] ?? '' ) ) {
			return (float) $data['porcao_manual'][ $key ];
		}
		$base = $data['base'][ $key ] ?? '';
		if ( '' === $base || '' === $data['porcao'] ) {
			return null;
		}
		return (float) $base * (float) $data['porcao'] / 100;
	}

	/** %VD da porção. */
	public static function vd_percent( $data, $key ) {
		$defs = self::nutrients();
		$ref  = $defs[ $key ]['vd'] ?? null;
		if ( ! $ref ) {
			return null;
		}
		$value = self::portion_value( $data, $key );
		if ( null === $value ) {
			return null;
		}
		return (int) round( $value / $ref * 100 );
	}

	/** Lista de alertas "ALTO EM" aplicáveis ao produto. */
	public static function active_alerts( $data ) {
		if ( 'manual' === $data['alerta_modo'] ) {
			return array_values( array_intersect( array_keys( self::alerts() ), $data['alertas'] ) );
		}
		$active = array();
		$state  = 'ml' === $data['unidade'] ? 'liquid' : 'solid';
		foreach ( self::alerts() as $key => $def ) {
			$value = $data['base'][ $def['nutrient'] ] ?? '';
			if ( '' !== $value && (float) $value >= $def[ $state ] ) {
				$active[] = $key;
			}
		}
		return $active;
	}

	/* ------------------------------------------------------------------ */
	/* Formatação                                                          */
	/* ------------------------------------------------------------------ */

	/**
	 * Formata número no padrão brasileiro com arredondamento simples
	 * (>= 10: inteiro; < 10: uma casa decimal).
	 */
	public static function format_number( $value ) {
		if ( null === $value || '' === $value ) {
			return '';
		}
		$value    = (float) $value;
		$decimals = ( abs( $value ) >= 10 || floor( $value ) === $value ) ? 0 : 1;
		$out      = number_format( $value, $decimals, ',', '.' );
		return preg_replace( '/,0$/', '', $out );
	}

	/** Valor bruto para campos de formulário (sem arredondar), com vírgula decimal. */
	public static function input_number( $value ) {
		return '' === $value || null === $value ? '' : str_replace( '.', ',', (string) $value );
	}

	public static function format_amount( $value, $unit ) {
		$n = self::format_number( $value );
		return '' === $n ? '' : $n . ' ' . $unit;
	}

	/** Une lista com vírgulas e "e" no final. */
	public static function join_list( $items ) {
		$items = array_values( array_filter( $items ) );
		if ( count( $items ) < 2 ) {
			return implode( '', $items );
		}
		$last = array_pop( $items );
		return implode( ', ', $items ) . ' ' . __( 'e', 'infonutri' ) . ' ' . $last;
	}

	/** Declaração de alergênicos no formato da RDC 26/2015. */
	public static function allergen_statements( $data ) {
		$labels = self::allergens();
		$contains = array();
		foreach ( $data['alergicos'] as $key ) {
			$contains[] = $labels[ $key ];
		}
		foreach ( $data['derivados'] as $key ) {
			/* translators: %s: alergênico */
			$contains[] = sprintf( __( 'derivados de %s', 'infonutri' ), $labels[ $key ] );
		}
		if ( $data['alergicos_outros'] ) {
			$contains[] = $data['alergicos_outros'];
		}

		$may = array();
		foreach ( $data['pode_conter'] as $key ) {
			$may[] = $labels[ $key ];
		}
		if ( $data['pode_conter_outros'] ) {
			$may[] = $data['pode_conter_outros'];
		}

		$out = array();
		if ( $contains ) {
			$out['contem'] = mb_strtoupper( __( 'Alérgicos: contém', 'infonutri' ) . ' ' . self::join_list( $contains ) . '.', 'UTF-8' );
		}
		if ( $may ) {
			$out['pode_conter'] = mb_strtoupper( __( 'Alérgicos: pode conter', 'infonutri' ) . ' ' . self::join_list( $may ) . '.', 'UTF-8' );
		}
		if ( 'contem' === $data['gluten'] ) {
			$out['gluten'] = __( 'CONTÉM GLÚTEN.', 'infonutri' );
		} elseif ( 'nao_contem' === $data['gluten'] ) {
			$out['gluten'] = __( 'NÃO CONTÉM GLÚTEN.', 'infonutri' );
		}
		if ( 'contem' === $data['lactose'] ) {
			$out['lactose'] = __( 'CONTÉM LACTOSE.', 'infonutri' );
		} elseif ( 'nao_contem' === $data['lactose'] ) {
			$out['lactose'] = __( 'NÃO CONTÉM LACTOSE.', 'infonutri' );
		} elseif ( 'baixo' === $data['lactose'] ) {
			$out['lactose'] = __( 'BAIXO TEOR DE LACTOSE.', 'infonutri' );
		}
		return $out;
	}
}

<?php
/**
 * Remove as configurações ao excluir o plugin.
 * Os dados nutricionais dos produtos (post meta "_infonutri") são mantidos
 * para não perder cadastros; defina INFONUTRI_DELETE_DATA como true no
 * wp-config.php para apagá-los também.
 */

if ( ! defined( 'WP_UNINSTALL_PLUGIN' ) ) {
	exit;
}

delete_option( 'infonutri_settings' );
delete_option( 'infonutri_flush_rewrite' );

if ( defined( 'INFONUTRI_DELETE_DATA' ) && INFONUTRI_DELETE_DATA ) {
	delete_post_meta_by_key( '_infonutri' );
	delete_post_meta_by_key( 'infonutri_alto_em' );
	delete_post_meta_by_key( 'infonutri_selos' );
}

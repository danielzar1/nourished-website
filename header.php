<?php ?>
<!DOCTYPE html>
<html <?php language_attributes(); ?> data-year="<?php echo esc_attr( date( 'Y' ) ); ?>">
<head>
    <meta charset="<?php bloginfo( 'charset' ); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
    <?php wp_body_open(); ?>
    <a class="skip-link" href="#main"><?php esc_html_e( 'Skip to content', 'nourished' ); ?></a>
    <div id="header-slot"></div>
